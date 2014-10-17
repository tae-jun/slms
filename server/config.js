var path = require('path');

var config = {
    staticUrl: '/static',
    distFolder: path.join(__dirname, '../Client/dist'),
    port: 80,
    mongo: {
        url: 'mongodb://localhost:27017/'
    },
    serial: {
        comName: 'COM3'
    }
};

module.exports = config;
