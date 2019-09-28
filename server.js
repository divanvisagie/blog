const express = require('express');

const app = express();

const livereload = require('easy-livereload');

app.use(express.static('public'))

app.use(livereload({
    app: app
  }));

app.listen(8080);