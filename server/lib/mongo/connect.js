var mongodb = require('mongodb');
var config = require('../../config');
var MongoClient = mongodb.MongoClient;

function connect(dbName, callback) {
    MongoClient.connect(config.mongo.url + dbName, function (err, db) {
        if (err)
            return console.dir(err);

        console.log('New connection pool created: ' + dbName);
        callback(db);
    });
}

module.exports = connect;
