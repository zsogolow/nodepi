'use strict';

var net = require('net');
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

    // actionClient: {},

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
        if (duino.id > 0 && duino.type != 'unknown')
            duinos[duino.id] = duino;

        this.purge();
    },

    purge: function () {
        var duinos = this.duinos;
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
        var self = this;
        execute('sudo threadpi', function (stdout) {
            console.log(stdout);
            setTimeout(function () {
                var socketPath = '/tmp/action.sock';
                self.actionClient = net.connect(socketPath, () => {
                    console.log('connected to server!');
                    self.actionClient.write("0000");
                });

                self.actionClient.on('data', (data) => {
                    console.log(data.toString());
                });

                self.actionClient.on('end', () => {
                    console.log('disconnected from server');
                });
            }, 2000);
        });
    },

    ping: function (id) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 1', function (stdout) {});
        });
        return prom;
    },

    lightsState: function (id) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 4', function (stdout) {});
        });
        return prom;
    },

    lightsOn: function (id) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 5', function (stdout) {});
        });
        return prom;
    },

    lightsOff: function (id) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 6', function (stdout) {});
        });
        return prom;
    },
};

module.exports = Duinos;