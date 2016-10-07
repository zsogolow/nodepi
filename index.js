'use strict';

var fs = require('fs');
var os = require('os');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

// types
const GENERAL = 21;
const RELAY = 22;

// actions
const EMPTY = -1;
const PING = 1;
const HEARTBEAT = 2;
const BLINK = 3;
const RELAY_STATE = 4;
const RELAY_ON = 5;
const RELAY_OFF = 6;


function NodePi() {

}

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
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
        });
    },

    reboot: function () {
        execute('sudo reboot', function (stdout) {
        });
    },
}

module.exports = NodePi;