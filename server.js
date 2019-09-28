const express = require('express');


const livereload = require('easy-livereload');

const app = express();

app.use(livereload({
    app: app
  }));
app.use(express.static('public'))

app.listen(8080);