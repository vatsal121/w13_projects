// use express framework,
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path')

app.use(express.static('public_html'))

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: true
}));


// HOME PAGE http://localhost:8000
app.get('/',
    function (req, res) {
        res.send("<h1>Hello World</h1>")
    }
)



app.get("/chair", function (req, res) {
    res.sendFile(path.join(__dirname, 'public_html', 'chair_response.html'));
})

// LAST LINE OF CODE- START SERVER - ON PORT 8000
app.listen(8000, function () {
    console.log('Server listening to port 8000, go to http://localhost:8000');
})