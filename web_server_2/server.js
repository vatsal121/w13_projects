'use strict'

// use express framework,
const express = require('express')
const app = express()
// const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const {
    off
} = require('process')

app.use(express.static('public_html'))

// SET CORS to allows cross-origin resource sharing access
app.use(cors())

// support parsing of application/json type post data
// app.use(bodyParser.json())
app.use(express.json())

// support parsing of application/x-www-form-urlencoded post data
// app.use(bodyParser.urlencoded({
//     extended: true
// }))
app.use(express.urlencoded({
    extended: true
}))

// HOME PAGE http://localhost:8000
app.get('/',
    function (req, res) {
        return res.redirect('/offices.html');
    }
)



app.get('/offices', function (request, response) {
    const DB = require('./src/dao')

    DB.connect();
    DB.query('SELECT * from offices order by officecode asc', function (offices) {
        const officesJSON = {
            offices: offices.rows
        }
        const officesJSONString = JSON.stringify(officesJSON, null, 4)
        // set content type
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        DB.disconnect();
        // send out a string
        response.end(officesJSONString)
    })
});


app.get('/offices/:id', function (request, response) {
    let id = request.params.id // read the :id value send in the URL
    let DB = require('./src/dao');
    DB.connect();
    DB.queryParams('SELECT * from offices WHERE officecode=$1 order by officecode asc', [id], function (offices) {

        const officesJSON = {
            offices: offices.rows
        }
        const officesJSONString = JSON.stringify(officesJSON, null, 4)
        // set content type
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        DB.disconnect();
        // send out a string
        response.end(officesJSONString)
    })
});

app.post('/offices', function (request, response) {
    const DB = require('./src/dao')
    const officeData = {
        officecode: request.body.officecode,
        city: request.body.city,
        phone: request.body.phone,
        addressline1: request.body.addressline1,
        addressline2: request.body.addressline2,
        state: request.body.state,
        country: request.body.country,
        postalcode: request.body.postalcode,
        territory: request.body.territory,
    }
    DB.connect()
    let insertQuery = "insert into offices(officecode,city,phone,addressline1,addressline2,state,country,postalcode,territory)";
    insertQuery += " VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)"
    const queryParams = [officeData.officecode, officeData.city, officeData.phone, officeData.addressline1, officeData.addressline2, officeData.state, officeData.country, officeData.postalcode, officeData.territory]
    DB.queryParams(insertQuery, queryParams, function (offices) {
        let statusCode = 200
        let msg = "Succussfully inserted data"
        let error = null;

        response.writeHead(statusCode, {
            'Content-Type': 'application/json'
        })
        const officesJSONString = JSON.stringify({
            statusCode: statusCode,
            message: msg,
            error: error
        }, null, 4)
        DB.disconnect();

        // send out a string
        response.end(officesJSONString)
    })
});

app.put('/offices/:id', function (request, response) {
    const officeData = {
        officecode: request.params.id,
        city: request.body.city,
        phone: request.body.phone,
        addressline1: request.body.addressline1,
        addressline2: request.body.addressline2,
        state: request.body.state,
        country: request.body.country,
        postalcode: request.body.postalcode,
        territory: request.body.territory,
    }
    const DB = require('./src/dao')
    DB.connect()
    let updateQuery = "UPDATE offices set city=$1,phone=$2,addressline1=$3,addressline2=$4,state=$5,country=$6,postalcode=$7,territory=$8 where officecode=$9"
    const queryParams = [officeData.city, officeData.phone, officeData.addressline1, officeData.addressline2, officeData.state, officeData.country, officeData.postalcode, officeData.territory, officeData.officecode]
    DB.queryParams(updateQuery, queryParams, function (offices) {
        let statusCode = 200
        let msg = "Succussfully updated data"
        let error = null;
        // if (err !== undefined && err !== null) {
        //     statusCode = 500
        //     msg = "Internal Server Error. Error inserting data";
        //     error = err;
        //     console.log("Postgres INSERT error:", err)
        // }

        response.writeHead(statusCode, {
            'Content-Type': 'application/json'
        })
        const officesJSONString = JSON.stringify({
            statusCode: statusCode,
            message: msg,
            error: error
        }, null, 4)
        DB.disconnect();

        // send out a string
        response.end(officesJSONString)
    })
});


app.delete('/offices/:id', function (request, response) {
    let id = request.params.id // read the :id value send in the URL
    let DB = require('./src/dao');
    DB.connect();

    DB.queryParams('select * from employees where officecode=$1', [id], function (employee) {
        if (employee.rowCount <= 0) {
            DB.queryParams('DELETE from offices WHERE officecode=$1', [id], function (office) {
                response.writeHead(200, {
                    'Content-Type': 'text/json'
                })
                DB.disconnect();
                // send out a string
                const officesJSONString = JSON.stringify({
                    statusCode: 200,
                    message: "OK office deleted",
                    error: null
                }, null, 4)
                response.end(officesJSONString)
            })
        } else {
            response.writeHead(500, {
                'Content-Type': 'text/json'
            })
            DB.disconnect();
            // send out a string
            const officesJSONString = JSON.stringify({
                statusCode: 500,
                message: "Cannot delete office record as employee is already assigned that office number ",
                error: null
            }, null, 4)
            response.end(officesJSONString)
        }

    });

});

const portNo = process.env.PORT || 8000
app.listen(portNo, function () {
    console.log(`Server listening to port 8000, go to http://localhost:${portNo}`)
})