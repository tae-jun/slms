import express = require('express');
import lights = require('../../../mongo/main/lights');

function addNamespace(app: express.Application) {
    app.namespace('/lights', () => {
        app.get('/', (req: express.Request, res: express.Response) => {
            lights.findAll((items) => {
                res.json(items);
            });
        });

        app.post('/', (req: express.Request, res: express.Response) => {
            var values = req.body;

            lights.create(values, (result) => {
                res.json(result);
            });
        });
        
        require('./id/lightID')(app);
    });
}

export = addNamespace;