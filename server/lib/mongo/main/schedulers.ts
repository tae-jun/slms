import express = require('express');
import mongodb = require('mongodb');
import Collection = mongodb.Collection;
import ObjectId = mongodb.ObjectID;
import ConnPool = require('./db');

var schedulers: Collection;

ConnPool.getCollection('schedulers', (coll) => {
    schedulers = coll;
});

export class Scheduler {
    _id: ObjectId;
    name: string;
    daily: any[];
}

export function findAll(callback: (schedulers: Scheduler[]) => void) {
    schedulers.find().toArray((err, results: Scheduler[]) => {
        if (err) return console.dir(err);

        callback(results);
    });
}

export function findOne(schedulerId: string, callback: (scheduler: Scheduler) => void) {
    schedulers.findOne({ _id: new ObjectId(schedulerId) }, (err, result) => {
        if (err) return console.dir(err);

        callback(result);
    });
}

export function insertDaily(schedulerId: string, daily, callback: (result) => void) {
    // if daily is not array, push it in array
    if (!Array.isArray(daily))
        daily = [daily];

    schedulers.update(
        // query by id
        { _id: new ObjectId(schedulerId) },
        // push daily array into daily field, and sort by time
        {
            $push: {
                daily: {
                    $each: daily,
                    $sort: { h: 1, m: 1 }
                }
            }
        },
        // write safe
        { w: 1 },
        (err, result) => {
            if (err) return console.dir(err);

            callback(result);
        });
}