function addNamespace(app) {
    app.namespace('/control', function () {
        require('./light/index')(app);
        require('./group/index')(app);

        app.get('/*', function (req, res) {
            res.json({ msg: 'wrong approach' });
        });
    });
}

module.exports = addNamespace;
