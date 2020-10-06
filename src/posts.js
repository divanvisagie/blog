const fs = require('fs-extra')

async function getPosts() {
    const posts = await fs.readdir('./content/post')
    return posts
}

module.exports = { getPosts }