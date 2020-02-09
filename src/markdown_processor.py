from markdown import *
from markdown.extensions import Extension
from markdown.extensions.codehilite import CodeHiliteExtension as CodeHilite

def markdown_to_html(html_string):
    cl = CodeHilite(linenums=False, use_pygments=True)
    return markdown(html_string, extensions=[cl,'fenced_code','toc'])
