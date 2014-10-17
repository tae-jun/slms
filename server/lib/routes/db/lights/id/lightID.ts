import express = require('express');
import lights = require('../../../../mongo/main/lights');

function addNamespace(app: express.Application) {
    app.namespace('/:id', () => {
        // get single light
        app.get('/', (req: express.Request, res: express.Response) => {
            var _id = req.params.id;
            lights.findByID(_id, (result) => {
                res.json(result);
            });
        });

        // update
        app.post('/', (req: express.Request, res: express.Response) => {
            var values = req.body;
            var _id = req.params.id;

            lights.update(_id, values, (result) => {
                res.json(result);
            });
        });

        // delete
        app.del('/', (req: express.Request, res: express.Response) => {
            var _id = req.params.id;
            lights.remove(_id, (num) => {
                res.json({ result: num });
            });
        });
    });
}

export = addNamespace; 