const path = require('path');
const fs = require('fs')

const hljs = require('highlight.js'); // https://highlightjs.org/

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
        return line.split(":").map(x => `"${x}"`).join(':')
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
    const posts = files.map(x => {
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
            <h1>${x.meta.title}</h1>
            <h2>${x.meta.subtitle}</h2>
            ${postHtmlContent}
        `

        x.html = layoutHtml.replace('{{CONTENT}}', postHtmlContent)
        return x;
    });

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

    let indexHtml = fs.readFileSync(path.join(__dirname,'index.html'))
    indexHtml = layoutHtml.replace('{{CONTENT}}', indexHtml);

    const lis = posts.map(post => 
        `<li>
            <a href="post/${post.postName}">${post.meta.title}</a>
            <p>${post.meta.subtitle}</p>
        </li>`
        ).join('\n');
    
    indexHtml = indexHtml.replace('{{CONTENT}}', lis);

    fs.writeFile(path.join(__dirname,'public','index.html'), indexHtml, (err) => {
        if (err) {
            console.log('there was an error writing the index file');
        }
    });


}

main();
