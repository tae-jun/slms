var mongodb = require('mongodb');

var ObjectId = mongodb.ObjectID;
var ConnPool = require('./db');

var schedulers;

ConnPool.getCollection('schedulers', function (coll) {
    schedulers = coll;
});

var Scheduler = (function () {
    function Scheduler() {
    }
    return Scheduler;
})();
exports.Scheduler = Scheduler;

function findAll(callback) {
    schedulers.find().toArray(function (err, results) {
        if (err)
            return console.dir(err);

        callback(results);
    });
}
exports.findAll = findAll;

function findOne(schedulerId, callback) {
    schedulers.findOne({ _id: new ObjectId(schedulerId) }, function (err, result) {
        if (err)
            return console.dir(err);

        callback(result);
    });
}
exports.findOne = findOne;

function insertDaily(schedulerId, daily, callback) {
    if (!Array.isArray(daily))
        daily = [daily];

    schedulers.update({ _id: new ObjectId(schedulerId) }, {
        $push: {
            daily: {
                $each: daily,
                $sort: { h: 1, m: 1 }
            }
        }
    }, { w: 1 }, function (err, result) {
        if (err)
            return console.dir(err);

        callback(result);
    });
}
exports.insertDaily = insertDaily;
