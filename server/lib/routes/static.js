var config = require('../../config');
var express = require('express');

function addRoute(app) {
    app.use(config.staticUrl, express.compress());
    app.use(config.staticUrl, express.static(config.distFolder));
    app.use(config.staticUrl, function (req, res, next) {
        res.send(404);
    });
}

module.exports = addRoute;
