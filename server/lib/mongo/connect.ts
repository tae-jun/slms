import mongodb = require('mongodb');
import config = require('../../config');
var MongoClient = mongodb.MongoClient;

function connect(dbName: string, callback: (db: mongodb.Db) => void) {
    MongoClient.connect(config.mongo.url + dbName, (err: Error, db: mongodb.Db) => {
        if (err) return console.dir(err);

        console.log('New connection pool created: ' + dbName);
        callback(db);
    });
}

export = connect;