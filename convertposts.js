const path = require('path');
const fs = require('fs');
const _ = require('underscore');

const hljs = require('highlight.js'); // https://highlightjs.org/

String.prototype.replaceAll = function(search, replacement) {
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

const directoryPath = path.join(__dirname,'content','post')


async function getFilesInPath(directoryPath) {
    var promise = new Promise((resolve,reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                return console.error('Unable to scan directory',e)
            }
            resolve(files)
        }) 

      
    });

    return promise
}

function getContentsOfFile(path){
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
    return markdown.replace(metaWithMarkers,'');
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
        console.error('error parsing',e);
        console.error(json);
    }
    return parsed;
}   

async function main() {
    const layoutHtml = fs.readFileSync(path.join(__dirname,'layout.html')).toString();

    const files = await getFilesInPath(directoryPath);
    let posts = files.map(x => {
        const p = path.join(directoryPath, x);
        return {
            path: p,
            postName: x.split('.')[0],
            contents: getContentsOfFile(p)
                .split('\r').join('') //remove windows line endings
        }
    }).map(x => {
        const metaString = getMetaString(x.contents);
        x.meta = getJsonFromMetaString(metaString);

        x.contents = getMarkdownWithoutMetaString(x.contents, metaString);
        let postHtmlContent = getHtmlForMarkdown(x.contents);

        postHtmlContent = `
            <h1 style="margin-bottom:0;">${x.meta.title}</h1>
            <h2 style="margin:0;">${x.meta.subtitle}</h2>
            <span style="color: #4C566A; font-size: 12px;">${x.meta.date}</span>
            ${postHtmlContent}
        `

        x.html = layoutHtml.replace('{{CONTENT}}', postHtmlContent)
        x.html = x.html.replaceAll('{{TITLE}}', x.meta.title);
        x.html = x.html.replaceAll('{{DESCRIPTION}}', x.meta.subtitle);
        return x;
    });

    posts = _.sortBy(posts, x => x.meta.date).reverse();
    
    posts.forEach(x => {
        const newFilePath = path.join(__dirname,'public', 'post', x.postName);
        if (!fs.existsSync(newFilePath))
            fs.mkdirSync(newFilePath, {recursive: true});

        console.log(`writing to path ${newFilePath}`)
        fs.writeFile(path.join(newFilePath,'index.html'), x.html, (err) => {
            if (err) {
                console.error(`Failed to write ${x.postName}`, err);
            }
        })
    })

    let indexHtml = fs.readFileSync(path.join(__dirname,'index.html'));
    indexHtml = layoutHtml.replace('{{CONTENT}}', indexHtml);
    indexHtml = indexHtml.replaceAll("{{TITLE}}", 'Divan Visagie - Blog');
    indexHtml = indexHtml.replaceAll("{{DESCRIPTION}}", "Divan's Personal Blog");

    const lis = posts.map(post => 
        `<li>
            <a href="post/${post.postName}">${post.meta.title}</a>
            <span>${post.meta.date}</span>
            <p>${post.meta.subtitle}</p>
        </li>`
        ).join('\n');
    
    indexHtml = indexHtml.replace('{{CONTENT}}', lis);

    fs.writeFile(path.join(__dirname,'public','index.html'), indexHtml, (err) => {
        if (err) {
            console.log('there was an error writing the index file');
        }
    });


    //copy images across
    let copydir = require('copy-dir');
    copydir('static/img', 'public/img', {
        utimes: true,  // keep add time and modify time
        mode: true,    // keep file mode
        cover: true    // cover file when exists, default is true
    }, function(err){
        if(err) {
            console.error('error copying images', err)
        }
        console.log('done');
    });
}

main();
