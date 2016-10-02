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

    ping: function (id) {
        console.log(id);
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 1', function (stdout) {
                var state = parseInt(stdout);
                console.log(state);
                resolve(state);
            });
        });
        return prom;
    }
}

module.exports = NodePi;