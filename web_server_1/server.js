'use strict'

// use express framework,
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    open = require('open'),
    cors = require("cors");


app.use(express.static('public_html'));

// SET CORS to allows cross-origin resource sharing access
app.use(cors());

// SET view engine to use.
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
    console.log(path.join(__dirname, 'public_html', 'chair_response.html'));
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
    pageData.title = 'Season';
    pageData.description = 'Huge selection of Seasons';
    pageData.author = 'The blabla.com team'
    let products = [{
        name: 'Winter',
    }, {
        name: 'Summer',
    }, {
        name: 'Spring',
    }, {
        name: 'Fall',
    }]; //typically would come from a database query
    pageData.content = '<ul>';
    for (let i = 0; i < products.length; i++) {
        pageData.content += '<li>' + products[i].name + '</li>'
    }
    pageData.content += '</ul>';
    res.render('master_template', pageData)
})

app.get('/customers_list', function (request, response) {
    const DB = require('./src/dao')
    DB.connect()
    DB.query('SELECT * from customers', function (customers) {
        let html = ''
        html += 'Number of customers: ' + customers.rowCount + '<br>'
        html += '<table>'
        for (let i = 0; i < customers.rowCount; i++) {
            html += '<tr><td>' + customers.rows[i].customernumber + '</td><td>' + customers.rows[i].customername + '</td></tr>'
        }
        html += '</table>'

        // use the page template of course to display the list
        const pageData = {} // initialize empty object
        pageData.title = 'Customers List-blabla.com'
        pageData.description = 'Customers Number and Name'
        pageData.author = 'The blabla.com team'
        // send out the html table
        pageData.content = html
        DB.disconnect()
        response.render('master_template', pageData)
    })
})

// for AJAX tests, returns the list of customers in a JSON string
app.get('/customers', function (request, response) {
    let DB = require('./src/dao');
    DB.connect();
    DB.query('SELECT * from customers', function (customers) {
        const customersJSON = {
            customers: customers.rows
        }
        const customersJSONString = JSON.stringify(customersJSON, null, 4)
        // set content type
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        DB.disconnect();
        // send out a string
        response.end(customersJSONString)
    })
});

// delete one customer
// note you cannot delete customers with orders
// to know customers that don't have an order run this query
// SELECT * from customers
// LEFT JOIN orders on customers.customernumber = orders.customernumber
// WHERE ordernumber IS NULL
// ORDER BY customers.customernumber ASC
// result: you can delete customernumber 477,480,481 and others
app.delete('/customers/:id', function (request, response) {
    let id = request.params.id // read the :id value send in the URL
    let DB = require('./src/dao');
    DB.connect();
    DB.queryParams('DELETE from customers WHERE customernumber=$1', [id], function (customers) {

        response.writeHead(200, {
            'Content-Type': 'text/html'
        })
        DB.disconnect();
        // send out a string
        response.end("OK customer deleted")
    })
});

app.post('/customer_search_id', function (request, response) {
    const DB = require('./src/dao')
    const customerNumber = request.body.customerId
    DB.connect()
    DB.query(`SELECT * from customers where customernumber=${customerNumber}`, function (customers) {
        let html = ''
        html += 'Number of customers: ' + customers.rowCount + '<br>'
        html += '<table>'
        if (customers.rowCount <= 0) {
            html += `<tr><td>No customer found having id ${customerNumber}</td></tr>`;
        }
        for (let i = 0; i < customers.rowCount; i++) {
            html += `<tr><td>Customer Number:</td><td>${customers.rows[i].customernumber}</td></tr>`;
            html += `<tr><td>Customer Name:</td><td>${customers.rows[i].customername}</td></tr>`;
            html += `<tr><td>Customer LastName:</td><td>${customers.rows[i].contactlastname}</td></tr>`;
            html += `<tr><td>Customer FirstName:</td><td>${customers.rows[i].contactfirstname}</td></tr>`;
            html += `<tr><td>Customer Phone:</td><td>${customers.rows[i].phone}</td></tr>`;
            html += `<tr><td>Customer AddressLine 1:</td><td>${customers.rows[i].addressline1}</td></tr>`;
            html += `<tr><td>Customer AddressLine 2:</td><td>${customers.rows[i].addressline2}</td></tr>`;
            html += `<tr><td>Customer City:</td><td>${customers.rows[i].city}</td></tr>`;
            html += `<tr><td>Customer State:</td><td>${customers.rows[i].state}</td></tr>`;
            html += `<tr><td>Customer Country:</td><td>${customers.rows[i].country}</td></tr>`;
            html += `<tr><td>Postal code:</td><td>${customers.rows[i].postalcode}</td></tr>`;
            html += `<tr><td>Customer Credit Limit:</td><td>${customers.rows[i].creditlimit}</td></tr>`;
        }
        html += '</table>'

        // use the page template of course to display the list
        const pageData = {} // initialize empty object
        pageData.title = 'Customers List-blabla.com'
        pageData.description = 'Customers Number and Name'
        pageData.author = 'The blabla.com team'
        // send out the html table
        pageData.content = html
        DB.disconnect();
        response.render('master_template', pageData)
    })
});



app.get('/employees', function (request, response) {
    let DB = require('./src/dao');
    DB.connect();
    DB.query('SELECT * from employees', function (employees) {
        const employeesJSON = {
            employees: employees.rows
        }
        const employeesJSONString = JSON.stringify(employeesJSON, null, 4)
        // set content type
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        DB.disconnect();
        // send out a string
        response.end(employeesJSONString)
    })
});


// LAST LINE OF CODE- START SERVER - ON PORT 8000
let portNo = process.env.PORT || 8000;
app.listen(portNo, function () {
    open('https://sindresorhus.com', {
        app: ['google chrome', '--incognito']
    });
    console.log(`Server listening to port 8000, go to http://localhost:${portNo}`);
})