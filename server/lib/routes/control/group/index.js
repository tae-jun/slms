var serial = require('../../../serial/serial');
var groups = require('../../../mongo/main/groups');

function addNamespace(app) {
    app.namespace('/group', function () {
        app.post('/', function (req, res) {
            var values;
            values = req.body;

            serial.setLight(values.rgb, function () {
                groups.update(values._id, { rgb: values.rgb });
                res.json({ rgb: values.rgb });
            });
        });
    });
}

module.exports = addNamespace;
