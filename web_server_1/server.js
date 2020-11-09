'use strict'

// use express framework,
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    open = require('open');


app.use(express.static('public_html'));

app.set("view engine", "ejs")


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

app.get('/products', function (req, res) {
    let pageData = {}; // initialize empty object
    pageData.title = 'Product Catalog-blabla.com';
    pageData.description = 'Huge selection of products for all your needs-blabla.com';
    pageData.author = 'The blabla.com team'
    let products = [{
            id: 1,
            name: 'white shoes',
            price: '99.99'
        },
        {
            id: 2,
            name: 'black shoes',
            price: '69.99'
        },
        {
            id: 3,
            name: 'blue shoes',
            price: '79.99'
        }
    ]; //typically would come from a database query
    pageData.content = '<table>';
    for (let i = 0; i < products.length; i++) {
        pageData.content += '<tr><td>' + products[i].id + '</td>'
        pageData.content += '<td>' + products[i].name + '</td>'
        pageData.content += '<td>' + products[i].price + '</td>'
        pageData.content += '</tr>'
    }
    pageData.content += '</table>';
    res.render('master_template', pageData)
});


app.get("/seasons", function (req, res) {
    let pageData = {}; // initialize empty object
    pageData.title = 'Season;
    pageData.description = 'Huge selection of Seasons';
    pageData.author = 'The blabla.com team'
    let products = [{
            name: 'Winter',
        },{
            name: 'Summer',
        },{
            name: 'Spring',
        },{
            name: 'Fall',
        }
    ]; //typically would come from a database query
    pageData.content = '<ul>';
    for (let i = 0; i < products.length; i++) {
        pageData.content += '<li>' + products[i].name + '</li>'
    }
    pageData.content += '</ul>';
    res.render('master_template', pageData)
})

// LAST LINE OF CODE- START SERVER - ON PORT 8000
app.listen(8000, function () {
    open('https://sindresorhus.com', {app: ['google chrome', '--incognito']});
    console.log('Server listening to port 8000, go to http://localhost:8000');
})