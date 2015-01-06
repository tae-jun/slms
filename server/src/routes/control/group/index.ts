import express = require('express');
import serial = require('../../../serial/serial');
import groups = require('../../../mongo/main/groups');
import lights = require('../../../mongo/main/lights');
import async = require('async');

function addNamespace(app: express.Application) {
    app.namespace('/group', () => {
        app.post('/', (req: express.Request, res: express.Response) => {
            var values: { _id: string; rgb: number[] };     // _id: groupID, rgb: size 3 number array
            values = req.body;

            groups.findByID(values._id, (group) => {
                lights.findByGID(group._id, (lights) => {
                    var tasks = [];
                    lights.forEach((light) => {
                        var task = (callback) => {
                            serial.setLight(values.rgb, group.did, light.did, () => {
                                groups.update(values._id, { rgb: values.rgb });
                                setTimeout(() => {
                                    callback(null, null);
                                }, 100);
                            });
                        };

                        tasks.push(task);
                    });

                    async.series(tasks, (err, results) => {
                        res.json({ rgb: values.rgb });
                    });
                });
            });
        });
    });
}

export = addNamespace; 