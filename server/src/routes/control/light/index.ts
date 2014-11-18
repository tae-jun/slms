import express = require('express');
import lights = require('../../../mongo/main/lights');
import SmartServer = require('../../../smart-server/SmartServer');

function addNamespace(app: express.Application) {
    app.namespace('/light', () => {
        app.post('/:id', (req: express.Request, res: express.Response) => {
            var id = req.params['id'];
            var values: { dim: number };
            values = req.body;

            var dim = values.dim;

            SmartServer.write(id, dim, (err, result) => {
                if (err) {
                    console.error(err);

                    lights.findByID(id, (light) => {
                        res.json({ state: 'error', dim: light.dim });
                    });
                }
                else {
                    lights.update(id, { dim: dim }, (num) => {
                        res.json({ state: 'success', dim: dim });
                    });
                }
            });
        });
    });
}

export = addNamespace; 