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
        for (var prop in duinos) {
            console.log('something else');
            if (duinos.hasOwnProperty(prop)) {
                var oldDuino = duinos[prop];
                var check = new Date(oldDuino.heartbeat.getTime() + 5000);
                if (check < new Date()) {
                    console.log('something');
                    delete duinos[prop];
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