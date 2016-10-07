'use strict';

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        if (error) {
            console.log(error);
        }

        callback(stdout, stderr);
    });
}

function Duinos() {
    if (!this) {
        return new Duinos();
    }

    var self = this;
}

Duinos.prototype = {
    duinos: {},
    types: {
        '21': 'general',
        '22': 'relay'
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

    getDuinoType: function (typeId) {
        var type = this.types[typeId];
        return type || 'unknown';
    },

    getDuinoAction: function (actionId) {
        var action = this.actions[actionId];
        return action || 'unknown';
    },

    heartbeat: function (duino) {
        var duinos = this.duinos;
        duinos[duino.id] = duino;

        for (var prop in duinos) {
            if (duinos.hasOwnProperty(prop)) {
                var oldDuino = duinos[prop];
                var timeToExpire = 20000;
                var check = new Date(oldDuino.heartbeat.getTime() + timeToExpire);
                if (check < new Date()) {
                    delete duinos[prop];
                }
            }
        }
    },

    startListening: function () {
        execute('sudo runner -t 2', function (stdout) {
            console.log(stdout);
        });
    },

    ping: function (id, callback) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 1', function (stdout) {
            });
        });
        return prom;
    },

    lightsState: function (id) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 4', function (stdout) {
            });
        });
        return prom;
    },

    lightsOn: function (id) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 5', function (stdout) {
            });
        });
        return prom;
    },

    lightsOff: function (id) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 6', function (stdout) {
            });
        });
        return prom;
    },
};

module.exports = Duinos;