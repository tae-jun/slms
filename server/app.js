var http = require('http');
var express = require('express');
require('express-namespace');

var config = require('./config');

var app = express();

require('./lib/routes/static/static')(app);
app.use(express.json());
app.use(express.urlencoded());

app.use(express.logger('dev'));
app.use(app.router);

require('./lib/routes/index')(app);

http.createServer(app).listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
});
