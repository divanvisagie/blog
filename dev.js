const express = require('express')
const path = require('path')
const connectLivereload = require('connect-livereload')
const buildPath = path.join(__dirname, 'build')

const app = express()

const PORT = 3000

app.use(express.static(buildPath))

// live reload script
var liveReloadPort = 35729;
var excludeList = ['.woff', '.flv'];

app.use(require('connect-livereload')({
    port: liveReloadPort,
    excludeList: excludeList
}));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

