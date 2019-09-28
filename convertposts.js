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

async function main() {
    const layoutHtml = fs.readFileSync(path.join(__dirname,'layout.html')).toString();

    const files = await getFilesInPath(directoryPath);
    const posts = files.map(x => {
        const p = path.join(directoryPath, x);
        return {
            path: p,
            postName: x.split('.')[0],
            contents: getContentsOfFile(p) 
        }
    }).map(x => {
        const postHtmlContent = getHtmlForMarkdown(x.contents);
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
        `<li><a href="post/${post.postName}">${post.postName}</a></li>`
        ).join('\n');
    
    indexHtml = indexHtml.replace('{{CONTENT}}', lis);

    fs.writeFile(path.join(__dirname,'public','index.html'), indexHtml, (err) => {
        if (err) {
            console.log('there was an error writing the index file');
        }
    });


}

main();
