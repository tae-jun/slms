import mongodb = require('mongodb');
import config = require('../../../config');
import connect = require('../connect');
import MongoClient = mongodb.MongoClient;
import Db = mongodb.Db;
import Collection = mongodb.Collection;

enum status {
    noConnection = 0,
    connecting = 1,
    connected = 2
};

class ConnectionPool {
    private static status: status = status.noConnection;
    private static db: Db;
    private static callbacks: Function[] = [];

    static getDb(callback: (db: Db) => void) {
        if (this.status == status.noConnection) {
            this.status = status.connecting
            this.callbacks.push(callback);

            connect('duri', (db) => {
                this.db = db;
                this.status = status.connected;

                this.callbacks.forEach((callback) => {
                    callback(this.db);
                });
                this.callbacks = [];
            });
        }
        else if (this.status == status.connecting) {
            this.callbacks.push(callback);
        }
        else if (this.status == status.connected) {
            callback(this.db);
        }
    }

    static getCollection(collName: string, callback: (coll: Collection) => void) {
        if (this.status == status.noConnection) {
            this.getDb((db) => {
                db.collection(collName, (err, coll) => {
                    if (err) return console.dir(err);

                    callback(coll);
                });
            });
        }
        else if (this.status == status.connecting) {
            this.callbacks.push((db) => {
                db.collection(collName, (err, coll) => {
                    if (err) return console.dir(err);

                    callback(coll);
                });
            });
        }
        else if (this.status == status.connected) {
            this.db.collection(collName, (err, coll) => {
                if (err) return console.dir(err);

                callback(coll);
            });
        }
    }
}

export = ConnectionPool;