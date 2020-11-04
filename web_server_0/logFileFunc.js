'use strict'

const fs = require('fs')
const dirName = 'log'
const fileName = 'server_log.log'
const filePath = dirName + '/' + fileName

function createFolderIfNotExists(dirName) {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName)
        console.log('Directory created: ', dirName)
    } else {
        console.log('Warning: Directory already exists: ', dirName)
    }
}

function createFileIfNotExists(fileName) {
    if (!fs.existsSync(fileName)) {
        fs.appendFile(fileName, '', 'utf8', (err) => {
            if (err) {
                throw err;
            }
        })
        console.log('File created: ', fileName)
    } else {
        console.log('Warning: File already exists: ', fileName)
    }
}

function log(message) {
    message += "\n";
    fs.appendFile(filePath, message, 'utf8', (err) => {
        if (err) {
            throw err
        }
    })
}

createFolderIfNotExists(dirName)
createFileIfNotExists(filePath)

log('ABCD')
log('Hello')
log('Hello')
