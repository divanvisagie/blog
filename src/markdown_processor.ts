const md = require('markdown-it')({
  html: true,
}).use(require('markdown-it-highlightjs'), { inline: true })

export function markdownToHtml(htmlString: string) {
  return md.render(htmlString)
}
