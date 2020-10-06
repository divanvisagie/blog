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
async function processContent(contentFolder, templateName) {
    const templatePath = path
        .join(TEMPLATE_ROOT, `${templateName}.html`)
    const markdownPath = path
        .join('./content', contentFolder, 'index.md')

    const templateHtml = await fs.readFile(templatePath, 'utf8')
    const contentMd = await fs.readFile(markdownPath, 'utf8')
    const layoutHtml = await getLayout()

    // Put the content into the site layout template
    const htmlOut = layoutHtml
        .replace(TITLE, 'Divan Visagie')
        .replace(DESCRIPTION, `Divan's personal blog`)
        .replace(CARD_IMAGE, 'favicon.ico')
        .replace(CONTENT,
            templateHtml.replace(CONTENT,
                markdownToHtml(contentMd)
            )
        )

    const contentFolderPath =
        path.join('.', OUT_DIR, contentFolder)

    if (!fs.existsSync(contentFolderPath)) {
        await fs.mkdir(contentFolderPath, { recursive: true })
    }

    await fs.writeFile(
        path.join(contentFolderPath, 'index.html'),
        htmlOut
    )

    await fs.copy(
        path.join('./content', contentFolder),
        contentFolderPath
    )
}

async function buildPages() {
    console.log('Starting page build process')
    await processContent('about', 'about')
    await processContent('cv', 'about')
    await processContent('post/docker', 'post')
}


module.exports = { buildPages }