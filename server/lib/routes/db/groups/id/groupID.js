var groups = require('../../../../mongo/main/groups');

function addNamespace(app) {
    app.namespace('/:id', function () {
        app.get('/', function (req, res) {
            var _id = req.params.id;
            groups.findByID(_id, function (item) {
                res.json(item);
            });
        });

        app.post('/', function (req, res) {
            var values = req.body;
            var _id = req.params.id;
            groups.update(_id, values, function (result) {
                res.json(result);
            });
        });

        app.del('/', function (req, res) {
            var _id = req.params.id;
            groups.remove(_id, function (result) {
                res.json(result);
            });
        });
    });
}

module.exports = addNamespace;
