import express = require('express');
import mongodb = require('mongodb');
import Collection = mongodb.Collection;
import ObjectId = mongodb.ObjectID;
import ConnPool = require('./db');

var lights: Collection;

ConnPool.getCollection('lights', (coll) => {
    lights = coll;
});

export class Light {
    _id: ObjectId;
    name: string;
    lat: number;
    lng: number;
    gid: ObjectId;
    did: number;
}

export function findAll(callback: (lights: Light[]) => void) {
    lights.find().toArray((err, results: Light[]) => {
        if (err) return console.dir(err);

        callback(results);
    });
}

export function findByID(_id: string, callback: (light: Light) => void) {
    lights.findOne({ _id: new ObjectId(_id) }, (err, result: Light) => {
        if (err) return console.dir(err);

        callback(result);
    });
}

export function findByGID(gid: string, callback: (lights: Light[]) => void) {
    lights.find({ gid: new ObjectId(gid) }).toArray((err, results) => {
        if (err) return console.log(err);
        callback(results);
    });
}

export function create(light: Object, callback) {
    lights.insert(light, { w: 1 }, (err, result) => {
        if (err) return console.dir(err);

        callback(result);
    });
}

export function update(_id: string, doc: any, callback?: (affectedDoc: any) => void) {
    lights.update({ _id: new ObjectId(_id) }, { $set: doc }, { w: 1 }, (err, result) => {
        if (err) return console.dir(err);

        if (callback)
            callback(result);
    });
}

export function remove(_id: string, callback: (result: number) => void) {
    lights.remove({ _id: new ObjectId(_id) }, { w: 1, single: true }, (err, result: number) => {
        if (err) return console.dir(err);

        callback(result);
    });
}

export function removeMult(_ids: string[], callback: (result: number) => void) {
    var objIDs = [];
    _ids.forEach((value) => {
        objIDs.push(new ObjectId(value));
    });

    lights.remove({ _id: { $in: objIDs } }, { w: 1 }, (err, result: number) => {
        if (err) return console.dir(err);

        callback(result);
    });
}