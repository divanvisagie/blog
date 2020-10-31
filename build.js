const { mkdir } = require('fs').promises
const { existsSync } = require('fs')
const { copy } = require('fs-extra')
const { buildPages } = require('./src/builder')

async function createBuildDir() {
    const path = './build'
    if (!existsSync(path)) {
        await mkdir(path)
    }
}

async function copyPublic() {
    const startPath = './public'
    const targetPath = './build'
    await copy(startPath, targetPath)
}

async function build() {
    await createBuildDir()
    await copyPublic()
    await buildPages()
}

build()