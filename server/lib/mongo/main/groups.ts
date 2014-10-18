import express = require('express');
import mongodb = require('mongodb');
import ObjectId = mongodb.ObjectID;
import ConnPool = require('./db');

var groups: mongodb.Collection;
var lights: mongodb.Collection;

ConnPool.getCollection('groups', (coll) => {
    groups = coll;
});

ConnPool.getCollection('lights', (coll) => {
    lights = coll;
});

export class Group {
    _id: string;
    name: string;
    lights: string[];
    rgb: number[];
    did: number;
}

export function findAll(callback: (groups: Group[]) => void) {
    groups.find().toArray((err, results: Group[]) => {
        if (err) return console.dir(err);

        callback(results);
    });
}

export function findByID(_id: string, callback: (group: Group) => void) {
    groups.findOne({ _id: new ObjectId(_id) }, (err, result: Group) => {
        if (err) return console.dir(err);

        callback(result);
    });
}

export function update(_id: string, doc: any, callback?: (affectedDoc: number) => void) {
    groups.update({ _id: new ObjectId(_id) }, { $set: doc }, { w: 1 }, (err, result: number) => {
        if (err) return console.dir(err);

        if (callback)
            callback(result);
    });
}

export function remove(_id: string, callback: (result: any) => void) {
    // set lights of group to null
    lights.update({ gid: new ObjectId(_id) }, { $set: { gid: null } }, { w: 1, multi: true }, (err, affectedLights: number) => {
        if (err) return console.dir(err);

        // remove group
        groups.remove({ _id: new ObjectId(_id) }, { w: 1 }, (err, result) => {
            if (err) return console.dir(err);

            var rtnObj = {
                lights: affectedLights,
                groups: result
            };
            callback(rtnObj);
        });
    });
}

export function create(group: Group, callback: (result: Group) => void) {
    var newGroup = new Group;
    newGroup.name = group.name;

    groups.insert(newGroup, { w: 1 }, (err, gResult: Group[]) => {
        if (err) return console.dir(err);

        newGroup._id = gResult[0]._id;

        var lightOids = [];
        group.lights.forEach((value) => {
            lightOids.push(new ObjectId(value));
        });

        lights.update({ _id: { $in: lightOids } }, { $set: { gid: newGroup._id } }, { w: 1, multi: true }, (err, lResult: number) => {
            if (err) return console.dir(err);

            if (lResult == group.lights.length) {
                newGroup.lights = group.lights;
                callback(newGroup);
            }
            else {
                console.dir('group create error');
            }
        });
    });
}