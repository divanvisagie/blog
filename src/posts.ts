import fs from 'fs-extra'
import { Post } from './builder'

export async function getPostNames(): Promise<string[]> {
  const posts = await fs.readdir('./content/post')
  return posts
}

export function getPostLineItem(post: Post) {
  return `<li>
    <a href="post/${post.name}">${post.title}</a>
    <span>${post.date}</span>
    <p>${post.subtitle}</p>
  </li>`
}
