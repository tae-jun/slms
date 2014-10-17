var schedulers = require('../../../mongo/main/schedulers');

function addNamespace(app) {
    app.namespace('/schedulers', function () {
        app.get('/', function (req, res) {
            schedulers.findAll(function (schedulers) {
                res.json(schedulers);
            });
        });

        require('./id')(app);
    });
}

module.exports = addNamespace;
