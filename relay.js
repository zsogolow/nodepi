var exec = require('child_process').exec;

function Relay() {

}

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}

Relay.prototype = {
    lightsOn: function () {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d 1 -t 5', function (stdout) {
                var state = parseInt(stdout);
                resolve(state);
            });
        });
        return prom;
    },

    lightsOff: function () {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d 1 -t 6', function (stdout) {
                var state = parseInt(stdout);
                resolve(state);
            });
        });
        return prom;
    },

    lightsState: function () {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d 1 -t 4', function (stdout) {
                var state = parseInt(stdout);
                resolve(state);
            });
        });
        return prom;
    }
};

module.exports = Relay;