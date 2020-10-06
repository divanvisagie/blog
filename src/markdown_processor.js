const md = require('markdown-it')()
    .use(require('markdown-it-highlightjs'), { inline: true })

function markdownToHtml(htmlString) {
    return md.render(htmlString)
}

module.exports = { markdownToHtml }
