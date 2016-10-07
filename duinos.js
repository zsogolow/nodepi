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

    ping: function (id, callback) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 1', function (stdout) {
                console.log(stdout);
                resolve(stdout);
            });
        });
        return prom;
    },

    heartbeat: function (duino) {
        this.duinos[duino.id] = duino;
    },
};

module.exports = Duinos;