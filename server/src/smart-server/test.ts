var edge = require('edge');

var sayHi = edge.func('SmartServer.dll');

sayHi(1, (err, result) => {
    if (err) throw err;
    console.log(result);
}); 