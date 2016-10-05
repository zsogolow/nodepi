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

    getDuinoType: function (typeId) {
        var type = undefined;
        switch (typeId) {
            case GENERAL:
                type = 'general';
                break;
            case RELAY:
                type = 'relay';
                break;
            default:
                type = 'unknown';
                break;
        }
        return type;
    },

    getDuinoAction: function (actionId) {
        var action = "hi";
        switch (actionId) {
            case EMPTY:
                action = "empty";
                break;
            case PING:
                action = "ping";
                break;
            case HEARTBEAT:
                action = "heartbeat";
                break;
            case BLINK:
                action = "blink";
                break;
            case RELAY_STATE:
                action = "relay_state";
                break;
            case RELAY_ON:
                action = "relay_on";
                break;
            case RELAY_OFF:
                action = "relay_off";
                break;
            default:
                action = "unknown";
                break;
        }
        return action;
    },
}

module.exports = NodePi;