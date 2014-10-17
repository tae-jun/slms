function addNamespace(app) {
    app.namespace('/control', function () {
        require('./group/group')(app);

        app.get('/*', function (req, res) {
            res.json({ msg: 'wrong approach' });
        });
    });
}

module.exports = addNamespace;
