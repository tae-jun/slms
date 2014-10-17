var mongodb = require('mongodb');

var ObjectId = mongodb.ObjectID;
var ConnPool = require('./db');

var lights;

ConnPool.getCollection('lights', function (coll) {
    lights = coll;
});

var Light = (function () {
    function Light() {
    }
    return Light;
})();
exports.Light = Light;

function findAll(callback) {
    lights.find().toArray(function (err, results) {
        if (err)
            return console.dir(err);

        callback(results);
    });
}
exports.findAll = findAll;

function findByID(_id, callback) {
    lights.findOne({ _id: new ObjectId(_id) }, function (err, result) {
        if (err)
            return console.dir(err);

        callback(result);
    });
}
exports.findByID = findByID;

function create(light, callback) {
    lights.insert(light, { w: 1 }, function (err, result) {
        if (err)
            return console.dir(err);

        callback(result);
    });
}
exports.create = create;

function update(_id, doc, callback) {
    lights.update({ _id: new ObjectId(_id) }, { $set: doc }, { w: 1 }, function (err, result) {
        if (err)
            return console.dir(err);

        if (callback)
            callback(result);
    });
}
exports.update = update;

function updateGid() {
}
exports.updateGid = updateGid;

function remove(_id, callback) {
    lights.remove({ _id: new ObjectId(_id) }, { w: 1, single: true }, function (err, result) {
        if (err)
            return console.dir(err);

        callback(result);
    });
}
exports.remove = remove;

function removeMult(_ids, callback) {
    var objIDs = [];
    _ids.forEach(function (value) {
        objIDs.push(new ObjectId(value));
    });

    lights.remove({ _id: { $in: objIDs } }, { w: 1 }, function (err, result) {
        if (err)
            return console.dir(err);

        callback(result);
    });
}
exports.removeMult = removeMult;
