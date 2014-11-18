import edge = require('edge');

var option: edge.IFuncOption = {
    assemblyFile: 'SmartServer.dll',
    methodName: 'write'
};

var write = edge.func(option);

var param = {
    UCPTname: 'Net/LON/Test 1',
    dim: 0
};

write(param, (err, result) => {
    if (err) return console.error(err);
    console.log(result);
});
