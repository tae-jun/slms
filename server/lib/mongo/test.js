var lights = require('./main/lights');
var groups = require('./main/groups');

setTimeout(function () {
    lights.findAll(function (lights) {
        console.log(lights.length);
    });
    groups.findAll(function (groups) {
        console.log(groups.length);
    });
}, 1000);
