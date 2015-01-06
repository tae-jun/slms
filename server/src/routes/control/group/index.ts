import express = require('express');
import serial = require('../../../serial/serial');
import groups = require('../../../mongo/main/groups');
import lights = require('../../../mongo/main/lights');

function addNamespace(app: express.Application) {
    app.namespace('/group', () => {
        app.post('/', (req: express.Request, res: express.Response) => {
            var values: { _id: string; rgb: number[] };     // _id: groupID, rgb: size 3 number array
            values = req.body;

            groups.findByID(values._id, (group) => {
                lights.findByGID(group._id, (lights) => {
                    lights.forEach((light) => {
                        /**
                         * 
                         * 
                         * 
                         * res.json을 여러번 호출함
                         */
                        serial.setLight(values.rgb, group.did, light.did, () => {
                            groups.update(values._id, { rgb: values.rgb });
                            res.json({ rgb: values.rgb });
                        });
                    });
                });
            });
        });
    });
}

export = addNamespace; 