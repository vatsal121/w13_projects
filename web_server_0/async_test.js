const fs = require('fs') // to use file system (fs) functions, more later

console.log('SYNCHRONOUS VERSION************************')
// Open a file, and output the content to console
const fileContent = fs.readFileSync('some_file.txt', 'utf8')
console.log(fileContent)
console.log('Hello World')

console.log('ASYNCHRONOUS VERSION************************')
// Open a file and output the content to console, using a asynchronous
fs.readFile('some_file.txt', 'utf8',
    // callback function to be executed after the file has been read
    (err, fileContent) => {
        if (err) throw err
        console.log(fileContent)
    }
)
console.log('Hello World')