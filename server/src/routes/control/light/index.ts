import express = require('express');
import serial = require('../../../serial/serial');
import lights = require('../../../mongo/main/lights');
import groups = require('../../../mongo/main/groups');

function addNamespace(app: express.Application) {
    app.namespace('/light', () => {
        app.post('/:id', (req: express.Request, res: express.Response) => {
            var values: { rgb: number[] };     // rgb: size 3 number array
            values = req.body;

            var id = req.params['id'];

            lights.findByID(id, (light) => {
                groups.findByID(light.gid.toHexString(), (group) => {
                    serial.setLight(values.rgb, group.did, light.did, () => {
                        lights.update(id, { rgb: values.rgb });

                        var msg = {
                            status: 'success',
                            rgb: values.rgb
                        };

                        res.json(msg);
                    });
                });
            });
        });
    });
}

export = addNamespace; 