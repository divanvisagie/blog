const connect = require('connect')
const static = require('serve-static')
const livereload = require('livereload')

const server = connect()
server.use(static(__dirname + '/build'))
server.listen(3000);

var lrserver = livereload.createServer()
lrserver.watch(__dirname + '/build')