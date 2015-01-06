import path = require('path');

var config = {
    staticUrl: '/static',
    distFolder: path.join(__dirname, '../../Client/dist'),
    port: 80,
    mongo: {
        //url: 'mongodb://ktj7147.iptime.org:27017/'
        url: 'mongodb://localhost:27017/'
    },
    serial: {
        comName: 'COM3'
    }
};

export = config;