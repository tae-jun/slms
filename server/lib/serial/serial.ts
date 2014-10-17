
import config = require('../../config');
var SerialPort = require("serialport").SerialPort;

var serialPort = require("serialport");
var Serial = require("serialport").SerialPort;

var serial;

var startTime: Date;
var endTime: Date;

var callbacks: Function[] = [];

var onData = (data) => {
    endTime = new Date;
    console.log('data received: ' + data + ' - ' + (endTime.getTime() - startTime.getTime()) + 'ms');

    while (callbacks.length)
        callbacks.pop()();
};

serialPort.list((err, ports) => {
    if (err) return console.dir(err);

    ports = ports || [];
    console.log(ports.length + ' ports detected');

    ports.forEach((port) => {
        serial = new Serial(port.comName, {}, false);

        serial.open((err) => {
            if (err) return console.dir(err);

            console.log('serial port opened');
            console.dir(port);

            serial.on('data', onData);
        });
    });
});


export function setLight(rgb: number[], callback?: Function) {
    if (callback == undefined)
        callback = function () { }

    // !!! delete here in real environment
    if (serial == undefined) 
        return callback();

    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];

    r = r * 100 / 255;
    g = g * 100 / 255;
    b = b * 100 / 255;

    startTime = new Date();

    var buff = [35, 36, r, g, b, 38];
    serial.write(buff);

    if (callback)
        callbacks.push(callback);
}