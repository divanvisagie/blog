import express from 'express'
import path from 'path'
import { build } from './build'
import chokidar from 'chokidar'

const buildPath = path.join(__dirname, 'build')
const app = express()
const PORT = 3000

/**
 * Set up livereload express server
 */
app.use(express.static(buildPath))

var liveReloadPort = 35729
var excludeList = ['.woff', '.flv']

app.use(
  require('connect-livereload')({
    port: liveReloadPort,
    excludeList: excludeList,
  })
)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

/**
 * Watch for build
 */
let timeOut: NodeJS.Timeout
function handleFileChange() {
  clearTimeout(timeOut)
  timeOut = setTimeout(() => {
    build()
  }, 500)
}

const watcher = chokidar.watch(['./templates', './content', './public'], {})

watcher.on('all', (x) => {
  handleFileChange()
})
