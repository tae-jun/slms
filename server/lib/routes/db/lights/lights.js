var lights = require('../../../mongo/main/lights');

function addNamespace(app) {
    app.namespace('/lights', function () {
        app.get('/', function (req, res) {
            lights.findAll(function (items) {
                res.json(items);
            });
        });

        app.post('/', function (req, res) {
            var values = req.body;

            lights.create(values, function (result) {
                res.json(result);
            });
        });

        require('./id/lightID')(app);
    });
}

module.exports = addNamespace;
