from markdown import markdown

from src.posts import process_posts
from src.replacement_tags import CONTENT, ROOT, TITLE, DESCRIPTION, CARD_IMAGE
from src.markdown_processor import markdown_to_html

def get_layout():
    layout_html = open(f'{ROOT}/layout.html','r')
    return layout_html.read()

def get_li_for_post(post):
    return f'<li><a href="post/{post.name}">{post.title}</a><span>{post.date}</span><p>{post.subtitle}</p></li>'

def process_index(posts):
    """
    Creates the index page with the list of posts
    """
    index_html = open(f'{ROOT}/index.html','r').read()

    # Sort by date order
    posts = sorted(posts, key=lambda k: int(k.date.replace('-','')), reverse = True)

    # put content into html template
    content = ''
    for post in posts:
        c = get_li_for_post(post)
        content = f'{content}{c}'
    index_html = index_html.replace(CONTENT, content)

    layout_html = get_layout()
    html_out = layout_html.replace(CONTENT, index_html)

    html_out = html_out.replace(TITLE, 'Divan Visagie')
    html_out = html_out.replace(DESCRIPTION, 'Divan\'s personal blog')
    html_out = html_out.replace(CARD_IMAGE, 'favicon.ico')

    f_out = open(f'{ROOT}/public/index.html', 'w')
    f_out.write(html_out)

def process_simple(content_folder, template_name):
    """
    Process a markdown folder into a site page
    """
    template_html = open(f'{ROOT}/{template_name}.html', 'r').read()
    content_md = open(f'{ROOT}/content/{content_folder}/index.md', 'r').read()
    layout_html = get_layout()
    
    # Put content html inside the template for this page
    content_html = markdown_to_html(content_md)
    content_html = template_html.replace(CONTENT, content_html)

    # Put the content into the site layout template
    html_out = layout_html.replace(CONTENT, content_html)

    html_out = html_out.replace(TITLE, 'Divan Visagie')
    html_out = html_out.replace(DESCRIPTION, 'Divan\'s personal blog')
    html_out = html_out.replace(CARD_IMAGE, 'favicon.ico')
    
    f_out = open(f'{ROOT}/public/{content_folder}/index.html', 'w')
    f_out.write(html_out)

def build():
    print('starting the process')
    process_simple('about', 'about')
    posts = process_posts()
    process_index(posts)

if __name__ == '__main__':
    println('Please run from root')
