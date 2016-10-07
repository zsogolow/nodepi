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
        var duinos = this.duinos;
        duinos[duino.id] = duino;

        // new Promise(function (resolve, reject) {
            for (var prop in dunios) {
                if (duinos.hasOwnProperty(prop)) {
                    var oldDuino = duions[prop];
                    if (oldDuino.heartbeat + 20000 < new Date()) {
                        delete duino[prop];
                    }
                }
            }
            // resolve(true);
        // }).then(function (data) {

        // }).catch(function (err) {
        //     console.log(`oops...! ${err}`);
        // })
    },
};

module.exports = Duinos;