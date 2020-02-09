#!./env/bin/python
from src.builder import build
from livereload import Server

def main():
    # build()
    server = Server()
    server.watch('content/post/**/*.md',build)
    server.serve(root='public')

if __name__ == '__main__':
    main()


