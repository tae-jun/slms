import edge = require('edge');

var option: edge.IFuncOption = {
    assemblyFile: 'SmartServer.dll',
    methodName: 'read'
};

var read = edge.func(option);

read({id: 'sadfsadf'}, (err, result) => {
    if (err) throw err;
    console.log(result);
});
