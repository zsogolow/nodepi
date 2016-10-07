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

    types: {
        '21': 'general',
        '22': 'relay'
    },

    getDuinoType: function (typeId) {
        var type = this.types[typeId];
        console.log(type)
        return type || 'unknown';
    },

    actions: {
        '-1': 'empty',
        '1': 'ping',
        '2': 'heartbeat',
        '3': 'blink',
        '4': 'relay_state',
        '5': 'relay_on',
        '6': 'relay_off'
    },

    getDuinoAction: function (actionId) {
        var action = this.actions[actionId];
        return action || 'unknown';
    },
}

module.exports = NodePi;