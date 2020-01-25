'use strict';
require('dotenv').config();

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
    reconnectInterval: 1000
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

MongoClient.connect(url, options, (err, database) => {
    if (err) {
        console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`);
        process.exit(1);
    }
    app.locals.db = database.db(dbName);
    http.listen(port, () => {
        console.log('Server started at: ' + `http://${HOST}:${port}`);
        //console.log("Listening on port " + port);
        //console.log(app.locals.db);
        app.emit('APP_STARTED');
    })
})

module.exports = app;