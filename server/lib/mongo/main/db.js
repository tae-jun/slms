var connect = require('../connect');

var status;
(function (status) {
    status[status["noConnection"] = 0] = "noConnection";
    status[status["connecting"] = 1] = "connecting";
    status[status["connected"] = 2] = "connected";
})(status || (status = {}));
;

var ConnectionPool = (function () {
    function ConnectionPool() {
    }
    ConnectionPool.getDb = function (callback) {
        var _this = this;
        if (this.status == 0 /* noConnection */) {
            this.status = 1 /* connecting */;
            this.callbacks.push(callback);

            connect('main', function (db) {
                _this.db = db;
                _this.status = 2 /* connected */;

                _this.callbacks.forEach(function (callback) {
                    callback(_this.db);
                });
                _this.callbacks = [];
            });
        } else if (this.status == 1 /* connecting */) {
            this.callbacks.push(callback);
        } else if (this.status == 2 /* connected */) {
            callback(this.db);
        }
    };

    ConnectionPool.getCollection = function (collName, callback) {
        if (this.status == 0 /* noConnection */) {
            this.getDb(function (db) {
                db.collection(collName, function (err, coll) {
                    if (err)
                        return console.dir(err);

                    callback(coll);
                });
            });
        } else if (this.status == 1 /* connecting */) {
            this.callbacks.push(function (db) {
                db.collection(collName, function (err, coll) {
                    if (err)
                        return console.dir(err);

                    callback(coll);
                });
            });
        } else if (this.status == 2 /* connected */) {
            this.db.collection(collName, function (err, coll) {
                if (err)
                    return console.dir(err);

                callback(coll);
            });
        }
    };
    ConnectionPool.status = 0 /* noConnection */;

    ConnectionPool.callbacks = [];
    return ConnectionPool;
})();

module.exports = ConnectionPool;
