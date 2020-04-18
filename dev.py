#!./env/bin/python
from src.builder import build
from livereload import Server

# Fix breaking change in tornado https://github.com/tornadoweb/tornado/issues/2608
import asyncio
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

def main():
    # build()
    server = Server()
    server.watch('content/post/**/*.md',build)
    server.serve(root='public')

if __name__ == '__main__':
    main()


