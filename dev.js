const connect = require('connect')
const static = require('serve-static')
const livereload = require('livereload')

const PORT = 3000;




/**
 * Set up a server that will continuously update when the build directory updates
 */
const server = connect()
server.use(static(__dirname + '/build'))
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

var lrserver = livereload.createServer()
lrserver.watch(__dirname + '/build')