var connect = require('./connect');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var lights = require('./lights');

var db;
var groups;

exports.isConnected = false;
exports.done = null;

connect('groups', function (_db) {
    db = _db;

    db.collection('groups', function (err, collection) {
        exports.isConnected = true;
        groups = collection;

        if (exports.done != null)
            exports.done();
    });
});

var Group = (function () {
    function Group() {
    }
    return Group;
})();
exports.Group = Group;

function create(group, callback) {
    var _result = new Group();

    groups.insert(group, { w: 1 }, function (err, result) {
        if (err) {
            console.dir(err);
        }

        var group = result.pop();
        var keys = Object.keys(group);
        for (var i = 0; i < keys.length; i++) {
            _result[keys[i]] = group[keys[i]];
        }

        if (callback != undefined)
            callback(group);
    });

    return _result;
}
exports.create = create;

function findAll(callback) {
    var _items = new Array();

    groups.find().toArray(function (err, items) {
        if (err) {
            console.dir(err);
        }
        _items.push(items);

        if (callback != undefined)
            callback(items);
    });

    return _items;
}
exports.findAll = findAll;

function findByID(groupID, callback) {
    var _item = new Group();

    groups.findOne({ _id: new ObjectID(groupID) }, function (err, item) {
        if (err) {
            console.dir(err);
        }

        var keys = Object.keys(item);
        for (var i = 0; i < keys.length; i++) {
            _item[keys[i]] = item[keys[i]];
        }

        if (callback != undefined)
            callback(_item);
    });

    return _item;
}
exports.findByID = findByID;

function update(groupID, values, callback) {
    groups.update({ _id: new ObjectID(groupID) }, { $set: values }, function (err, result) {
        if (err) {
            console.dir(err);
        }

        if (callback != undefined)
            callback(result);
    });
}
exports.update = update;

function remove(groupID, callback) {
    var lightsColl = lights.getLightsColl();

    lightsColl.update({ groupID: groupID }, { $set: { groupID: null } }, { w: 1, multi: true }, function (err, lightResult) {
        if (err) {
            callback(null);
            return console.dir(err);
        } else {
            groups.remove({ _id: new ObjectID(groupID) }, function (err, groupResult) {
                callback({
                    lights: lightResult,
                    groups: groupResult
                });
            });
        }
    });
}
exports.remove = remove;
