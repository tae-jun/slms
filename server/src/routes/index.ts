﻿import config = require('../../config');

function addRoute(app) {
    require('./db/index')(app);      //db actions
    require('./control/index')(app);

    // This route deals enables HTML5Mode by forwarding missing files to the index.html
    app.all('/*', function (req, res) {
        // Just send the index.html for other files to support HTML5Mode
        res.sendfile('index.html', { root: config.distFolder });
    });
}

export = addRoute;