var db = require('./test');

setTimeout(function () {
    var lights = db.getCollection('lights');

    setTimeout(function () {
        lights.findOne(function (err, result) {
            if (err)
                return console.dir(err);

            console.dir(result);
        });
    }, 1000);
}, 1000);
