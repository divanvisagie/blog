const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

function markdownToHtml(htmlString) {
    return md.render(htmlString)
}

module.exports = { markdownToHtml }
