var groups = require('../../../mongo/main/groups');

function addNamespace(app) {
    app.namespace('/groups', function () {
        app.get('/', function (req, res) {
            groups.findAll(function (items) {
                res.json(items);
            });
        });

        app.post('/', function (req, res) {
            var values = req.body;

            groups.create(values, function (result) {
                console.dir(result);
                res.json(result);
            });
        });

        require('./id/groupID')(app);
    });
}

module.exports = addNamespace;
