function addNamespace(app) {
    app.namespace('/db', function () {
        require('./lights/lights')(app);
        require('./groups/groups')(app);
        require('./schedulers/index')(app);

        app.get('/*', function (req, res) {
            res.json({ msg: 'wrong approach' });
        });
    });
}

module.exports = addNamespace;
