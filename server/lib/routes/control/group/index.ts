import express = require('express');
import serial = require('../../../serial/serial');
import groups = require('../../../mongo/main/groups');

function addNamespace(app: express.Application) {
    app.namespace('/group', () => {
        app.post('/', (req: express.Request, res: express.Response) => {
            var values: { _id: string; rgb: number[] };     // _id: groupID, rgb: size 3 number array
            values = req.body;

            groups.findByID(values._id, (group) => {
                var deviceId = group.did;       // device id

                serial.setLight(values.rgb, deviceId, () => {
                    groups.update(values._id, { rgb: values.rgb });
                    res.json({ rgb: values.rgb });
                });
            });
        });
    });
}

export = addNamespace; 