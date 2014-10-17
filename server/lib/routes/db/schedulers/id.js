var schedulers = require('../../../mongo/main/schedulers');

function addNamespace(app) {
    app.namespace('/:id', function () {
        app.get('/', function (req, res) {
            var schedulerId = req.params.id;
        });

        app.post('/', function (req, res) {
            var schedulerId = req.params.id;
            var daily = req.body;

            schedulers.insertDaily(schedulerId, daily, function (result) {
                schedulers.findOne(schedulerId, function (scheduler) {
                    res.json(scheduler);
                });
            });
        });
    });
}

module.exports = addNamespace;
