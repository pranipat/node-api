'use strict';
require('dotenv').config();

const promiseRetry = require('promise-retry');

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const HOST = process.env.HOST || 'localhost';

const dbHOST = process.env.MONGO_HOST;
const dbName = process.env.MONGO_INITDB_DATABASE;
const dbPort = process.env.MONGO_PORT;

const url = `mongodb://${dbHOST}:${dbPort}/${dbName}`;

const options = {
    useNewUrlParser: true,
    reconnectTries: 60,
    reconnectInterval: 1000,
    poolSize: 10,
    bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
}

const promiseRetryOptions = {
    retries: options.reconnectTries,
    factor: 2,
    minTimeout: options.reconnectInterval,
    maxTimeout: 5000
}

const routes = require('./routes/routes.js');
const port = process.env.PORT || 8080;
const app = express();
const http = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', routes);
app.use((req, res) => {
    res.status(404);
});

const connect = () => {
    return promiseRetry(async (retry, number) => {
        console.log(`MongoClient connecting to ${url} - retry number: ${number}`)
        try {
            return MongoClient.connect(url, options, (err, database) => {
                if(database){
                    app.locals.db = database.db(dbName);
                }                
            });
        }
        catch (error) {
            return retry(error);
        }
    }, promiseRetryOptions)
}

connect().then(()=>{
    http.listen(port, () => {
        console.log('Server started at: ' + `http://${HOST}:${port}`);
        app.emit('APP_STARTED');
    })
});

// MongoClient.connect(url, options, (err, database) => {
//     if (err) {
//         console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`);
//         process.exit(1);
//     }
//     app.locals.db = database.db(dbName);
//     http.listen(port, () => {
//         console.log('Server started at: ' + `http://${HOST}:${port}`);
//         //console.log("Listening on port " + port);
//         //console.log(app.locals.db);
//         app.emit('APP_STARTED');
//     })
// })

module.exports = app;