#!./env/bin/python
from src.builder import build
from src.replacement_tags import ROOT
from os import path, makedirs, listdir
from os.path import abspath, join, dirname
from distutils.dir_util import copy_tree

def create_build_dir():
    build = f'{ROOT}/build'
    if not path.exists(build):
        makedirs(build)

def copy_public():
    root = abspath(join(dirname(__file__), '.')) # The root of this file
    p = f'{root}/public/'
    copy_tree(f'{root}/public',f'{root}/build')


def main():
    create_build_dir()
    copy_public()
    build()

if __name__ == '__main__':
    main()


