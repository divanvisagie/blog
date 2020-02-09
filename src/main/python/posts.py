from os import listdir
import re
from markdown_processor import markdown_to_html
from replacement_tags import CONTENT

class Post:
    title = ''
    subtitle = ''
    name = ''
    html = ''

    def __init__(self, name):
        self.name = name

    def print_rep(self):
        return f'{self.name}:\n{self.html}'

    def __str__(self):
        return self.print_rep()

    def __repr__(self):
        return self.print_rep()

post_template = open('../../../post.html','r', encoding='utf8').read()
layout_template = open('../../../layout.html','r', encoding='utf8').read()

def get_posts():
    """
    Get a list of simple objects that represent posts that are only populated by name
    """
    posts = []
    dirs = listdir('../../../content/post')
    for dir_name in dirs:
        posts.append(Post(dir_name))
    return posts  

def get_markdown_metastring(markdown, key):
    ms_s = markdown.split('---')[1]
    s = f'^({key}:)(.*)'
    key_regex = re.compile(s, re.MULTILINE)
    try:
        return re.findall(key_regex, ms_s)[0][1].strip()
    except:
        return None


def get_metadata_for_post(post):
    """
    Get metadata for a post object and populate it
    """
    post_md = open(f'../../../content/post/{post.name}/index.md', 'r', encoding='utf8').read()
    
    post.title = get_markdown_metastring(post_md, 'title')
    post.subtitle = get_markdown_metastring(post_md, 'subtitle')

    post_md = post_md.split('---')[2] #remove the meta
    post.html = markdown_to_html(post_md)

    return post

def insert_in_template(post):
    # Put content in post template
    post.html = post_template.replace(CONTENT, post.html)

    # Put into layout
    post.html = layout_template.replace(CONTENT, post.html)

    print(post)
    return post

def process_posts():
    posts = get_posts()
    for post in posts:
        post = get_metadata_for_post(post)
        post = insert_in_template(post)
        wf = open(f'../../../public/post/{post.name}/index.html','w', encoding='utf8')
        wf.write(post.html)
    return posts
  
