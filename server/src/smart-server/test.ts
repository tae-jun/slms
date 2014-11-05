import edge = require('edge');

var option: edge.IFuncOption = {
    assemblyFile: 'SmartServer.dll',
    methodName: 'read'
};

var read = edge.func(option);

read({id: '1'}, (err, result) => {
    if (err) throw err;
    console.log(result);
});


setTimeout(() => {
    read({ id: '2' }, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
}, 10000);