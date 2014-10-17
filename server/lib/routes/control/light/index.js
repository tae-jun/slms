var serial = require('../../../serial/serial');
var lights = require('../../../mongo/main/lights');

function addNamespace(app) {
    app.namespace('/light', function () {
        app.post('/:id', function (req, res) {
            var values;
            values = req.body;

            var id = req.params['id'];

            serial.setLight(values.rgb, function () {
                lights.update(id, { rgb: values.rgb });

                var msg = {
                    status: 'success',
                    rgb: values.rgb
                };

                res.json(msg);
            });
        });
    });
}

module.exports = addNamespace;
