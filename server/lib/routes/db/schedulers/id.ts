import express = require('express');
import schedulers = require('../../../mongo/main/schedulers');

function addNamespace(app: express.Application) {
    app.namespace('/:id', () => {
        app.get('/', (req: express.Request, res: express.Response) => {
            var schedulerId = req.params.id;

            
        });

        app.post('/', (req: express.Request, res: express.Response) => {
            var schedulerId = req.params.id;
            var daily = req.body;      // daily
            
            schedulers.insertDaily(schedulerId, daily, (result) => {
                schedulers.findOne(schedulerId, (scheduler) => {
                    res.json(scheduler);
                });
            });
        });
    });
}

export = addNamespace;