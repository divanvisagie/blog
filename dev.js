const express = require('express')
const path = require('path')
const { build } = require('./build')
const chokidar = require('chokidar')

const buildPath = path.join(__dirname, 'build')
const app = express()
const PORT = 3000

/**
 * Set up livereload express server
 */
app.use(express.static(buildPath))

var liveReloadPort = 35729;
var excludeList = ['.woff', '.flv'];

app.use(require('connect-livereload')({
    port: liveReloadPort,
    excludeList: excludeList
}));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

/**
 * Watch for build
 */
let timeOut;
function handleFileChange() {
    clearTimeout(timeOut)
    timeOut = setTimeout(() => {
        build()
    }, 500)
}

const watcher = chokidar.watch([
    './templates',
    './content'
], {
})

watcher.on('all', (x) => {
    handleFileChange()
})