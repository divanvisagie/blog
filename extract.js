/**
 * Extract headers from previous python processor into 
 * seperate json files
 */

const fs = require('fs-extra')
const os = require('os');

function getMarkdownMetaString(fullMarkdownString) {
    const metaStringLines = fullMarkdownString.split('---')[1]
    return metaStringLines
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

async function main() {
    const posts = await fs.readdir('./content/post')
    posts.forEach(async post => {
        const indexMarkdownPath = `./content/post/${post}/index.md`
        const indexJsonPath = `./content/post/${post}/index.json`
        const markdownString = await fs.readFile(indexMarkdownPath, 'utf8')
        const metaJson = metaToJson(
            getMarkdownMetaString(markdownString)
        )
        fs.writeFile(indexJsonPath, JSON.stringify(metaJson, null, 2))
    })
}
main()