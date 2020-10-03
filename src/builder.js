const path = require('path')
const fs = require('fs-extra')

const TEMPLATE_ROOT = './templates'
const ROOT = '..'

async function getLayout() {
    return await fs.readFile(
        path.join([TEMPLATE_ROOT, 'layout.html']), 'utf8'
    )
}

/**
 * Process a markdown folder into a site page
 */
async function processSimple(contentFolder, templateName) {
    const templatePath = path
        .join([TEMPLATE_ROOT, `${templateName}.html`])
    const markdownPath = path
        .join(['../content', contentFolder, 'index.md'])

    const templateHtml = await fs.readFile(templatePath, 'utf8')
    const contentMd = await fs.readFile(markdownPath, 'utf8')
    const layoutHtml = await getLayout()

    //put content html inside the template for this page
    //TODO: convert markdown to html

    templateHtml = fs.readFile([])
}

async function buildPages() {
    console.log('Starting page build process')

    console.log('TODO: build the pages')
}


module.exports = { buildPages }