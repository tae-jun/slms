import edge = require('edge');
import path = require('path');


var assemblyFile = path.join(__dirname, 'SmartServer.dll');

var option: edge.IFuncOption = {
    assemblyFile: assemblyFile
};

var _read;
var _write;

/**
 * Start up C# .NET dll
 */
export function startup(callback?: () => void) {
    option.methodName = 'read';
    _read = edge.func(option);

    option.methodName = 'write';
    _write = edge.func(option);

    if (callback)
        callback();
}

/**
 * Read smart server's state
 */
export function read(id: string, callback: (err, result) => void) {
    var input = {
        id: id
    };

    _read(input, (err, result) => {
        if (err)
            callback(err, null);
        else
            callback(null, result);
    });
}

/**
 * Write smart server's state
 */
export function write(id: string, value, callback: (err, result) => void) {
    var input = {
        id: id,
        value: value
    };

    _write(input, (err, result) => {
        if (err)
            callback(err, null);
        else
            callback(null, result);
    });
}
