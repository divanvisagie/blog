from os import listdir, makedirs, path
import re
from src.markdown_processor import markdown_to_html
from src.replacement_tags import CONTENT, ROOT, TITLE, DESCRIPTION, CARD_IMAGE, TEMPLATE_ROOT
from shutil import copyfile

class Post:
    title = ''
    subtitle = ''
    name = ''
    html = ''
    date = ''
    header = ''

    def __init__(self, name):
        self.name = name

    def print_rep(self):
        return f'{self.name}:\n{self.html}'

    def __str__(self):
        return self.print_rep()

    def __repr__(self):
        return self.print_rep()

    def cleanup(self):
        """
        Remove html from post so that we conserve memory
        """
        self.html = ''

post_template = open(f'{TEMPLATE_ROOT}/post.html','r', encoding='utf8').read()
layout_template = open(f'{TEMPLATE_ROOT}/layout.html','r', encoding='utf8').read()

def get_posts():
    """
    Get a list of simple objects that represent posts that are only populated by name
    """
    posts = []
    root_path = f'{ROOT}/content/post'
    dirs = listdir(root_path)
    for dir_name in dirs:
        if not path.isfile(f'{root_path}/{dir_name}'):
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
    post_md = open(f'{ROOT}/content/post/{post.name}/index.md', 'r', encoding='utf8').read()
    
    post.title = get_markdown_metastring(post_md, 'title')
    post.subtitle = get_markdown_metastring(post_md, 'subtitle')
    post.date = get_markdown_metastring(post_md, 'date')
    post.header = get_markdown_metastring(post_md, 'header')

    post_md = post_md.split('---')[2] #remove the meta
    post.html = markdown_to_html(post_md)
  
    # Add Titles
    post.html = f'<h1 style="margin-bottom:0;">{post.title}</h1> <h2 style="margin:0;">{post.subtitle}</h2><span style="color: #4C566A; font-size: 12px;">{post.date}</span>{post.html}'
    return post

def insert_in_template(post):
    # Put content in post template
    post.html = post_template.replace(CONTENT, post.html)

    # Insert header at the beginning of the template   
    if post.header != None:
        post.html = f'<img class="post-header" src="{post.header}"></img>\n{post.html}'

    # Put into layout
    post.html = layout_template.replace(CONTENT, post.html)
    
    # Update meta tags
    post.html = post.html.replace(TITLE, post.title)
    post.html = post.html.replace(DESCRIPTION, post.subtitle)
    header = post.header
    if header == None:
        header = 'favicon.ico'
    post.html = post.html.replace(CARD_IMAGE, header)
    
    return post

def copy_images_for_post(post):
    p = f'{ROOT}/content/post/{post.name}'
    for f in listdir(p):
        if not '.md' in f:
            source = f'{p}/{f}'
            destination = f'{ROOT}/public/post/{post.name}/{f}'
            copyfile(source, destination)

def write_post(post):
    p = f'{ROOT}/public/post/{post.name}'
    if not path.exists(p):
        makedirs(p)
    wf = open(f'{p}/index.html','w', encoding='utf8')
    wf.write(post.html)

def process_posts():
    posts = get_posts()
    for post in posts:
        post = get_metadata_for_post(post)
        post = insert_in_template(post)
        write_post(post)
        copy_images_for_post(post)
        post.cleanup()
    return posts
  
