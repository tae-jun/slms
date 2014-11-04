import express = require('express');

function addNamespace(app: express.Application) {
    app.namespace('/control', () => {
        require('./light/index')(app);
        require('./group/index')(app);

        app.get('/*', (req: express.Request, res: express.Response) => {
            res.json({ msg: 'wrong approach' });
        });
    });
}

export = addNamespace;