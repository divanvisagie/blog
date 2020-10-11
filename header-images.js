/**
 * This adds back header images using extracted index.json files
 */

const fs = require('fs-extra')


function addHeaderImage(md, metaJson) {
    if (md.includes('class="post-header"')) return md
    return `<img class="post-header" alt="An image displayed as a header before the article for decorative purposes." src="${metaJson.header}"></img>
${md}`
}


async function main() {
    const posts = await fs.readdir('./content/post')
    posts.forEach(async post => {
        const indexJsonPath = `./content/post/${post}/index.json`
        const metaJson = require(indexJsonPath)
        if (!metaJson.header) return //there is no header, no point in going forward

        const indexMarkdownPath = `./content/post/${post}/index.md`
        let markdownString = await fs.readFile(indexMarkdownPath, 'utf8');
        markdownString = addHeaderImage(markdownString, metaJson);

        await fs.writeFile(indexMarkdownPath, markdownString)
    })
}
main()