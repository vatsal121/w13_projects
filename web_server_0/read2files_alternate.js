'use strict'

console.log('NodeJs Interpreter starts executing Javascript code')

/* Async programming *****************************************************/
const fs = require('fs')

// global variables
let file1Content = null
let file2Content = null

fs.readFile('some_file.txt', 'utf8',
    (err, fileContent) => {
        if (err) throw err
        file1Content = fileContent
        fs.readFile('other_file.txt', 'utf8',
            (err, fileContent) => {
                if (err) throw err
                file2Content = fileContent
                // same as DisplayFiles()
                console.log(file1Content + file2Content)
            }
        )
    }
)

// this will be displayed first while waiting for files to be loaded
console.log('Hello TEST123')