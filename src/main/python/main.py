from markdown import markdown

from posts import process_posts
from replacement_tags import CONTENT, ROOT
from markdown_processor import markdown_to_html

def get_layout():
    layout_html = open(f'{ROOT}/layout.html','r')
    return layout_html.read()

def process_index(posts):
    """
    Creates the index page with the list of posts
    """
    index_html = open(f'{ROOT}/index.html','r').read()
    layout_html = get_layout()
    processed = layout_html.replace(CONTENT,index_html)
    print(processed)

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
    
    f_out = open(f'{ROOT}/public/{content_folder}/index.html', 'w')
    f_out.write(html_out)
    print(html_out)


def main():
    print('starting the process')
    process_simple('about','about')
    posts = process_posts()
    # process_index(posts)

if __name__ == '__main__':
    main()
