var connect = require('./connect');
var mongodb = require('mongodb');

var db;
var lights;
var ObjectID = mongodb.ObjectID;

exports.isConnected = false;
exports.done = null;

connect('lights', function (_db) {
    db = _db;

    db.collection('lights', function (err, collection) {
        exports.isConnected = true;
        lights = collection;

        if (exports.done != null)
            exports.done();
    });
});

var Light = (function () {
    function Light() {
    }
    return Light;
})();
exports.Light = Light;

function create(light, callback) {
    var _result = new Light();

    lights.insert(light, { w: 1 }, function (err, result) {
        if (err) {
            console.dir(err);
        }

        var light = result.pop();
        var keys = Object.keys(light);
        for (var i = 0; i < keys.length; i++) {
            _result[keys[i]] = light[keys[i]];
        }

        if (callback != undefined)
            callback(light);
    });

    return _result;
}
exports.create = create;

function findAll(callback) {
    var _items = new Array();

    lights.find().toArray(function (err, items) {
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

function findByID(lightID, callback) {
    var _item = new Light();

    lights.findOne({ _id: new ObjectID(lightID) }, function (err, item) {
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

function update(lightID, values, callback) {
    lights.update({ _id: new ObjectID(lightID) }, { $set: values }, function (err, result) {
        if (err) {
            console.dir(err);
        }

        if (callback != undefined)
            callback(result);
    });
}
exports.update = update;

function remove(lightID, callback) {
    lights.remove({ _id: new ObjectID(lightID) }, { w: 1 }, function (err, numberOfRemovedDocs) {
        if (err) {
            console.dir(err);
        }

        if (callback != undefined)
            callback(numberOfRemovedDocs);
    });
}
exports.remove = remove;

function getLightsColl() {
    return lights;
}
exports.getLightsColl = getLightsColl;
