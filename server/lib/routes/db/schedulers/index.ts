import express = require('express');
import schedulers = require('../../../mongo/main/schedulers');

function addNamespace(app: express.Application) {
    app.namespace('/schedulers', () => {
        
        app.get('/', (req: express.Request, res: express.Response) => {
            schedulers.findAll((schedulers) => {
                res.json(schedulers);
            });
        });
        
        require('./id')(app);
    });
}

export = addNamespace;