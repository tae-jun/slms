var lights = require('../../../../mongo/main/lights');

function addNamespace(app) {
    app.namespace('/:id', function () {
        app.get('/', function (req, res) {
            var _id = req.params.id;
            lights.findByID(_id, function (result) {
                res.json(result);
            });
        });

        app.post('/', function (req, res) {
            var values = req.body;
            var _id = req.params.id;

            lights.update(_id, values, function (result) {
                res.json(result);
            });
        });

        app.del('/', function (req, res) {
            var _id = req.params.id;
            lights.remove(_id, function (num) {
                res.json({ result: num });
            });
        });
    });
}

module.exports = addNamespace;
