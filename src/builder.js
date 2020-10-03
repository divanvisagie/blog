const path = require('path')
const fs = require('fs-extra')

const { markdownToHtml } = require('./markdown_processor')

const { CONTENT, TITLE, DESCRIPTION, CARD_IMAGE, OUT_DIR, TEMPLATE_ROOT } = require('./replacement_tags')



async function getLayout() {
    return await fs.readFile(
        path.join(TEMPLATE_ROOT, 'layout.html'), 'utf8'
    )
}

/**
 * Process a markdown folder into a site page
 */
async function processSimple(contentFolder, templateName) {
    const templatePath = path
        .join(TEMPLATE_ROOT, `${templateName}.html`)
    const markdownPath = path
        .join('./content', contentFolder, 'index.md')

    const templateHtml = await fs.readFile(templatePath, 'utf8')
    const contentMd = await fs.readFile(markdownPath, 'utf8')
    const layoutHtml = await getLayout()

    // Put content html inside the template for this page
    contentHtml = markdownToHtml(contentMd)
    contentHtml = templateHtml.replace(CONTENT, contentHtml)

    // Put the content into the site layout template
    const htmlOut = layoutHtml
        .replace(TITLE, 'Divan Visagie')
        .replace(DESCRIPTION, `Divan's personal blog`)
        .replace(CARD_IMAGE, 'favicon.ico')

    const contentFolderPath =
        path.join('.', OUT_DIR, contentFolder)

    if (!fs.existsSync(contentFolderPath)) {
        await fs.mkdir(contentFolderPath)
    }

    await fs.writeFile(
        path.join(contentFolderPath, 'index.html'),
        htmlOut
    )
}

async function buildPages() {
    console.log('Starting page build process')
    await processSimple('about', 'about')

    console.log('TODO: build the pages')
}


module.exports = { buildPages }