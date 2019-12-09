const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const copydir = require('copy-dir');

const hljs = require('highlight.js'); // https://highlightjs.org/

const ROOT = process.cwd();

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// Actual default values
const md = require('markdown-it')({
    linkify: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (e) {
                console.error(e);
            }
        }

        return ''; // use external default escaping
    }
});

const POSTS_DIR = path.join(ROOT, 'content', 'post')


async function getFilesInPath(directoryPath) {
    var promise = new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                return console.error('Unable to scan directory', e)
            }
            resolve(files)
        })


    });

    return promise
}

function getContentsOfFile(path) {
    return fs.readFileSync(path).toString()
}

function getHtmlForMarkdown(markdown) {
    return md.render(markdown)
}

function getMetaString(markdown) {
    return markdown.split('---')[1];
}

function getMarkdownWithoutMetaString(markdown, metaString) {
    const metaWithMarkers = `---${metaString}---`;
    return markdown.replace(metaWithMarkers, '');
}

function getJsonFromMetaString(metaString) {
    const stringy = metaString
        .split("\r").join("") //windows stuff
        .trim()
        .split('\n')
        .map(line => {
            return line.split(":").map(x => `"${x.trim()}"`).join(':')
        })
        .filter(x => !x.includes("["))
        .join(',')
    console.log(stringy)
    const json = `{ ${stringy} }`;

    let parsed;
    try {
        parsed = JSON.parse(json);
    } catch (e) {
        console.error('error parsing', e);
        console.error(json);
    }
    return parsed;
}

function getHtmlPostWithHeader({ htmlContent, title, subtitle, date }) {
    return `
    <h1 style="margin-bottom:0;">${title}</h1>
    <h2 style="margin:0;">${subtitle}</h2>
    <span style="color: #4C566A; font-size: 12px;">${date}</span>
    ${htmlContent}`;
}

function getPostWithHeaderImage({html, headerImageSrc}) {
    return ` 
        <img class="post-header" src="${headerImageSrc}"></img>
        ${html}
    `;
}

async function main() {
    const layoutTemplate = fs.readFileSync(path.join(ROOT, 'layout.html')).toString();
    const postTemplate = fs.readFileSync(path.join(ROOT, 'post.html')).toString();

    const postFolders = (await getFilesInPath(POSTS_DIR))
        .filter(x => !x.includes(".")); //filter out files, we only want direcotries

    let posts = postFolders.map(x => {
        return {
            path: path.join(POSTS_DIR, x),
            postName: x.split('.')[0],
            contents: getContentsOfFile(path.join(POSTS_DIR, x, 'index.md'))
                .split('\r').join('') //remove windows line endings
        }
    }).map(x => {
        const metaString = getMetaString(x.contents);
        x.meta = getJsonFromMetaString(metaString);

        x.contents = getMarkdownWithoutMetaString(x.contents, metaString); //our markdown without the top "comment" block
        x.contents = getHtmlForMarkdown(x.contents);
        const post = getHtmlPostWithHeader({
            title: x.meta.title,
            subtitle: x.meta.subtitle,
            date: x.meta.date,
            htmlContent: x.contents
        });

        let postTemplateOutput = postTemplate.replace("{{CONTENT}}", post);
        let cardImage = "favicon.ico"
        if (x.meta.header) {
            postTemplateOutput = getPostWithHeaderImage({
                html: postTemplateOutput,
                headerImageSrc: x.meta.header
            });
            cardImage = x.meta.header
        }

        x.html = layoutTemplate.replace('{{CONTENT}}', postTemplateOutput)
        x.html = x.html.replaceAll('{{TITLE}}', x.meta.title);
        x.html = x.html.replaceAll('{{DESCRIPTION}}', x.meta.subtitle);
        x.html = x.html.replaceAll('{{CARD_IMAGE}}', `http://dvisagie.com/${cardImage}`);
        
        return x;
    });

    posts = _.sortBy(posts, x => x.meta.date).reverse();

    posts.forEach(x => {
        const newFilePath = path.join(ROOT, 'public', 'post', x.postName);
        if (!fs.existsSync(newFilePath))
            fs.mkdirSync(newFilePath, { recursive: true });

        console.log(`writing to path ${newFilePath}`)
        fs.writeFile(path.join(newFilePath, 'index.html'), x.html, (err) => {
            if (err) {
                console.error(`Failed to write ${x.postName}`, err);
            }
        })
    })

    let indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'));
    indexHtml = layoutTemplate.replace('{{CONTENT}}', indexHtml);
    indexHtml = indexHtml.replaceAll("{{TITLE}}", 'Divan Visagie - Blog');
    indexHtml = indexHtml.replaceAll("{{DESCRIPTION}}", "Divan's Personal Blog");
    indexHtml = indexHtml.replaceAll("{{CARD_IMAGE}}", "http://dvisagie.com/favicon.ico");


    const lis = posts.map(post =>
        `<li>
            <a href="post/${post.postName}">${post.meta.title}</a>
            <span>${post.meta.date}</span>
            <p>${post.meta.subtitle}</p>
        </li>`
    ).join('\n');

    indexHtml = indexHtml.replace('{{CONTENT}}', lis);

    fs.writeFile(path.join(ROOT, 'public', 'index.html'), indexHtml, (err) => {
        if (err) {
            console.log('there was an error writing the index file');
        }
    });


    //copy images across
    copydir(POSTS_DIR, path.join(ROOT,'public', 'post'), {
        utimes: true,  // keep add time and modify time
        mode: true,    // keep file mode
        cover: true,   // cover file when exists, default is true,
        filter: (stat, path, filename) => !path.includes('.md')
    }, function (err) {
        if (err) {
            console.error('error copying images', err)
        }
        console.log('done');
    });
}

main();
