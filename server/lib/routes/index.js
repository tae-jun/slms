var config = require('../../config');

function addRoute(app) {
    require('./db/index')(app);
    require('./control/index')(app);

    app.all('/*', function (req, res) {
        res.sendfile('index.html', { root: config.distFolder });
    });
}

module.exports = addRoute;
