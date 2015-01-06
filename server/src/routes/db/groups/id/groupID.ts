import express = require('express');
import groups = require('../../../../mongo/main/groups');

function addNamespace(app: express.Application) {
    app.namespace('/:id', () => {
        // get single group
        app.get('/', (req: express.Request, res: express.Response) => {
            var _id = req.params.id;
            groups.findByID(_id, (item) => {
                res.json(item);
            });
        });

        // update
        app.post('/', (req: express.Request, res: express.Response) => {
            var values = req.body;
            var _id = req.params.id;
            groups.update(_id, values, (result) => {
                res.json(result);
            });
        });

        // delete
        app.del('/', (req: express.Request, res: express.Response) => {
            var _id = req.params.id;
            groups.remove(_id, (result) => {
                res.json(result);
            });
        });
    });
}

export = addNamespace; 