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

function executeSync(command) {
    var result = execSync(command);
    return result;
}

function Duinos() {
    if (!this) {
        return new Duinos();
    }
}

Duinos.prototype = {
    ping: function (id, callback) {
        execute('sudo runner -d ' + id + ' -t 1', function (stdout, stderr) {
            console.log(stderr);
            console.log(stdout);
            callback(stdout, stderr);
        });
    },
    pingSync: function (id) {
        return executeSync('sudo runner -d ' + id + ' -t 1');
    }
};

module.exports = Duinos;