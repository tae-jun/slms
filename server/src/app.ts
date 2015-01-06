/// <reference path="../../server/scripts/typings/node/node.d.ts" />
/// <reference path="../scripts/typings/express-/express.d.ts" />
/// <reference path="../scripts/typings/mongodb/mongodb.d.ts" />

// node modules
import http = require('http');
import express = require('express');
require('express-namespace');
import path = require('path');

// my modules
import config = require('./config');

var app = express();

// router configures
require('./routes/static/static')(app);
app.use(express.json());        // to support JSON-encoded bodies
app.use(express.urlencoded());  // to support URL-encoded bodies

// all environments
app.use(express.logger('dev'));
app.use(app.router);

// routes
require('./routes/index')(app);

http.createServer(app).listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
});