# Blog

Source code for generating my personal blog written in python.

The posts are all written in markdown and then processed into HTML with this custom code. The output is pushed as a submodule to my gh-pages site.


To update the submodule
```bash
git submodule update --init --recursive
```

## Running

To run we first have to set up a python environment
```sh
python -m venv env
python venv env
pip install -r requirements.txt
```

To build:
```sh
./build.py
```

For development, live reload server:
```
./dev.py
```


Image optimization should be done in source prior to committing or publishing a new post.
```
optimize-images content/post/[the post in question] -cb -fd
```

Syntax highlight Theme: https://github.com/sbrisard/nord_pygments

Publish to medium using [mdium](https://github.com/icyphox/mdium)
