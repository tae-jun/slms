var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;
var ConnPool = require('./db');

var groups;
var lights;

ConnPool.getCollection('groups', function (coll) {
    groups = coll;
});

ConnPool.getCollection('lights', function (coll) {
    lights = coll;
});

var Group = (function () {
    function Group() {
    }
    return Group;
})();
exports.Group = Group;

function findAll(callback) {
    groups.find().toArray(function (err, results) {
        if (err)
            return console.dir(err);

        callback(results);
    });
}
exports.findAll = findAll;

function findByID(_id, callback) {
    groups.findOne({ _id: new ObjectId(_id) }, function (err, result) {
        if (err)
            return console.dir(err);

        callback(result);
    });
}
exports.findByID = findByID;

function update(_id, doc, callback) {
    groups.update({ _id: new ObjectId(_id) }, { $set: doc }, { w: 1 }, function (err, result) {
        if (err)
            return console.dir(err);

        if (callback)
            callback(result);
    });
}
exports.update = update;

function remove(_id, callback) {
    lights.update({ gid: new ObjectId(_id) }, { $set: { gid: null } }, { w: 1, multi: true }, function (err, affectedLights) {
        if (err)
            return console.dir(err);

        groups.remove({ _id: new ObjectId(_id) }, { w: 1 }, function (err, result) {
            if (err)
                return console.dir(err);

            var rtnObj = {
                lights: affectedLights,
                groups: result
            };
            callback(rtnObj);
        });
    });
}
exports.remove = remove;

function create(group, callback) {
    var newGroup = new Group;
    newGroup.name = group.name;

    groups.insert(newGroup, { w: 1 }, function (err, gResult) {
        if (err)
            return console.dir(err);

        newGroup._id = gResult[0]._id;

        var lightOids = [];
        group.lights.forEach(function (value) {
            lightOids.push(new ObjectId(value));
        });

        lights.update({ _id: { $in: lightOids } }, { $set: { gid: newGroup._id } }, { w: 1, multi: true }, function (err, lResult) {
            if (err)
                return console.dir(err);

            if (lResult == group.lights.length) {
                newGroup.lights = group.lights;
                callback(newGroup);
            } else {
                console.dir('group create error');
            }
        });
    });
}
exports.create = create;
