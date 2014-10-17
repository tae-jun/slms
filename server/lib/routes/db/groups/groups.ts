import express = require('express');
import groups = require('../../../mongo/main/groups');

function addNamespace(app: express.Application) {
    app.namespace('/groups', () => {
        app.get('/', (req: express.Request, res: express.Response) => {
            groups.findAll((items) => {
                res.json(items);
            });
        });

        app.post('/', (req: express.Request, res: express.Response) => {
            var values = req.body;

            groups.create(values, (result) => {
                console.dir(result);
                res.json(result);
            });
        });

        require('./id/groupID')(app);
    });
}

export = addNamespace;