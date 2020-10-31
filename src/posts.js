const fs = require('fs-extra')

async function getPosts() {
    const posts = await fs.readdir('./content/post')
    return posts
}

function getPostLineItem(post) {
    return `<li>
<a href="post/${post.name}">${post.title}</a>
<span>${post.date}</span>
<p>${post.subtitle}</p>
</li>`

}

module.exports = { getPosts, getPostLineItem }