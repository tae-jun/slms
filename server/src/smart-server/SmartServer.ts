import edge = require('edge');



var assemblyFile = 'SmartServer.dll';

var option: edge.IFuncOption = {
    assemblyFile: assemblyFile
};

var _read;
var _write;

export function startup(callback?: () => void) {
    option.methodName = 'read';
    _read = edge.func(option);

    option.methodName = 'write';
    _write = edge.func(option);

    if (callback)
        callback();
}

export function read(id: string, callback: (result) => void) {
    var input = {
        id: id
    };

    _read(input, (err, result) => {
        if (err) return console.error(err);
        callback(result);
    });
}

export function write(id: string, value, callback: (result) => void) {
    var input = {
        id: id,
        value: value
    };

    _write(input, (err, result) => {
        if (err) return console.error(err);
        callback(result);
    });
}

startup(() => {
    read('readID', (result) => {
        console.log(result);
    });

    write('writeID', { dim: 'A' }, (result) => {
        console.log(result);
    });
});