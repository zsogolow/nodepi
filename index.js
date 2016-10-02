'use strict';

var fs = require('fs');
var os = require('os');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

function NodePi() {

}

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        console.log(error);
        callback(stdout, stderr);
    });
}

NodePi.prototype = {
    osInfo: function () {
        return {
            hostname: os.hostname(),
            loadavg: os.loadavg(),
            uptime: os.uptime(),
            freemem: os.freemem(),
            totalmem: os.totalmem(),
            cpus: os.cpus(),
            type: os.type(),
            release: os.release(),
            arch: os.arch(),
            platform: os.platform(),
            EOL: os.EOL,
            endianness: os.endianness()
        }
    },

    network: function () {
        return os.networkInterfaces();
    },

    halt: function () {
        execute('sudo halt', function (stdout) {
            console.log(stdout);
        });
    },

    reboot: function () {
        execute('sudo reboot', function (stdout) {
            console.log(stdout);
        });
    },

    startListening: function () {
        execute('sudo runner -t 2', function (stdout) {
            console.log(stdout);
        });
    },

    getDuinoType: function (typeId) {
        var type = undefined;
        switch (typeId) {
            case 21:
                type = 'general';
                break;
            case 22:
                type = 'relay';
                break;
            default:
                type = 'unknown';
                break;
        }
        return type;
    },
}

module.exports = NodePi;