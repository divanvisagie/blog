const path = require('path')
const fs = require('fs-extra')
const urljoin = require('url-join')

const { markdownToHtml } = require('./markdown_processor')

const { CONTENT, TITLE, DESCRIPTION, CARD_IMAGE, OUT_DIR, TEMPLATE_ROOT } = require('./replacement_tags')
const { getPosts, getPostLineItem } = require('./posts')

const rootUrl = 'https:\/\/dvisagie.com'

async function getLayout() {
    return await fs.readFile(
        path.join(TEMPLATE_ROOT, 'layout.html'), 'utf8'
    )
}

function findFirstImage(html) {
    try {
        return html.split('<img')[1]
            .split('src="')[1]
            .split('"')[0]
            .trim()
    } catch {
        return //never go full python
    }
}

/**
 * Process a markdown folder into a site page
 */
async function processFolderWithTemplate(contentFolder, templateName) {
    const metaPath = path.join(`./content`, contentFolder, `index.json`)
    let meta = {};
    if (fs.existsSync(metaPath))
        meta = JSON.parse(await fs.readFile(metaPath, 'utf8'))

    const templatePath = path
        .join(TEMPLATE_ROOT, `${templateName}.html`)
    const markdownPath = path
        .join('./content', contentFolder, 'index.md')

    const templateHtml = await fs.readFile(templatePath, 'utf8')
    const contentMd = await fs.readFile(markdownPath, 'utf8')
    const layoutHtml = await getLayout()

    // Put the content into the site layout template
    let title = ''
    if (meta.title) {
        title = `${meta.title} - `
    }

    const convertedMarkdown = markdownToHtml(contentMd)

    let cardImage = `${rootUrl} / favicon.ico`
    if (!meta.header) {
        const found = findFirstImage(convertedMarkdown)
        if (found)
            cardImage = urljoin(rootUrl, contentFolder, found)
    } else {
        cardImage = urljoin(rootUrl, contentFolder, meta.header)
    }

    let pageContent = templateHtml.replace(CONTENT, convertedMarkdown)
    if (meta.header) {
        pageContent = `<img class="post-header" alt = "An image displayed as a header before the article for decorative purposes." src="${meta.header}" ></img >\n${pageContent}`
    }

    const htmlOut = layoutHtml
        .replace(TITLE, title)
        .split(TITLE).join(meta.title || 'Divan Visagie')
        .split(DESCRIPTION).join(meta.subtitle || `Divan's personal blog`)
        .split(CARD_IMAGE).join(cardImage)
        .replace(CONTENT, pageContent)

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

    return meta
}

async function processIndexPage(posts) {
    const layoutHtml = await getLayout()
    const indexHtml = await fs.readFile(
        path.join(TEMPLATE_ROOT, 'index.html')
    )

    posts.sort((a, b) => {
        const da = new Date(a.date)
        const db = new Date(b.date)

        // console.log(da, db)
        return db - da
    })


    const list = `${posts.map(getPostLineItem).join('')}`

    const output = layoutHtml
        .split(TITLE).join('')
        .split(DESCRIPTION).join(`Divan's personal blog`)
        .replace(CONTENT, indexHtml)
        .replace(CONTENT, list)

    await fs.writeFile('./build/index.html', output)
}

async function buildPages() {
    const timer = 'Pages built'
    console.log('Starting page build process')
    console.time(timer)
    await processFolderWithTemplate('about', 'about')
    await processFolderWithTemplate('cv', 'about')

    const posts = []
    for (let post of await getPosts()) {
        const postMetadata = await processFolderWithTemplate(`post/${post}`, 'post')
        postMetadata.name = post
        posts.push(postMetadata)
    }

    await processIndexPage(posts)

    console.timeEnd(timer)
}


module.exports = { buildPages }