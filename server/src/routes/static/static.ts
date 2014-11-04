import config = require('../../../config');
import express = require('express');

function addRoute(app) {
    // Serve up the favicon
    //app.use(express.favicon(config.distFolder + '/favicon.ico'));

    // First looks for a static file: index.html, css, images, etc.
    app.use(config.staticUrl, express.compress());
    app.use(config.staticUrl, express.static(config.distFolder));
    app.use(config.staticUrl, function (req, res, next) {
        res.send(404); // If we get here then the request for a static file is invalid
    });
}

export = addRoute;