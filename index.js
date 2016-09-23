'use strict';

var fs = require('fs');
var os = require('os');
var exec = require('child_process').exec;

function NodePi() {

}

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}

NodePi.prototype = {
    osInfo: function () {
        console.log('hi')

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

    halt: function () {
        execute('sudo halt', function (stdout) {
            console.log(stdout);
        });
    }
}

module.exports = NodePi; 