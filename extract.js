/**
 * Extract headers from previous python processor into 
 * seperate json files
 */

const fs = require('fs-extra')
const os = require('os');
const { markdownToHtml } = require('./src/markdown_processor');

function getMarkdownMetaString(fullMarkdownString) {
    const split = fullMarkdownString.split('---')
    const metaStringLines = split[1]
    return [metaStringLines, split[2]]
}

function metaToJson(metaString) {
    const quoted = metaString
        .split(os.EOL)
        .filter(Boolean)
        .map(line => {
            let [left, right] = line.split(':').map(x => x.trim())
            if (right[0] !== '[') {
                right = `"${right}"`
            }
            left = `"${left}"`
            return `${left}: ${right}`
        }).join(`,${os.EOL}`)
    return JSON.parse(`{${quoted}}`)
}

function addTitleSubtitleAndDate(md, metaJson) {
    if (md.includes('class="title"')) return md
    return `<h1 class="title">${metaJson.title}</h1>
<h2 class="subtitle">${metaJson.subtitle}</h2>
<span class="date">${metaJson.date}</span>
${md}`
}


async function main() {
    const posts = await fs.readdir('./content/post')
    posts.forEach(async post => {
        const indexMarkdownPath = `./content/post/${post}/index.md`
        const indexJsonPath = `./content/post/${post}/index.json`

        //Create index.json from meta info
        const markdownString = await fs.readFile(indexMarkdownPath, 'utf8')
        let [metaString, strippedMarkdown] = getMarkdownMetaString(markdownString)
        const metaJson = metaToJson(metaString)
        await fs.writeFile(indexJsonPath, JSON.stringify(metaJson, null, 2))

        //Convert markdown to metaInfo
        strippedMarkdown = addTitleSubtitleAndDate(strippedMarkdown, metaJson)
        console.log(strippedMarkdown)


        await fs.writeFile(indexMarkdownPath, strippedMarkdown)

    })
}
main()