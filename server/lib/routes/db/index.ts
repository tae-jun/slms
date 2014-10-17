import express = require('express');

function addNamespace(app: express.Application) {
    app.namespace('/db', () => {
        require('./lights/lights')(app);
        require('./groups/groups')(app);
        require('./schedulers/index')(app);

        app.get('/*', (req: express.Request, res: express.Response) => {
            res.json({ msg: 'wrong approach' });
        });
    });
}

export = addNamespace;