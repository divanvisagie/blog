# Blog

Source code for generating my personal blog written in NodeJS.

The posts are all written in markdown and then processed into HTML with this custom code. The output is pushed via GitHub actions to the GitHub pages repository.

## Running

Project setup:
```sh
npm install
```

To build:
```sh
npm run build
```

For development, live reload server:
```
npm run dev
```


Image optimization should be done in source prior to committing or publishing a new post.
```
optimize-images content/post/[the post in question] -cb -fd
```


Publish to medium using [mdium](https://github.com/icyphox/mdium)
