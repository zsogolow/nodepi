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
        execute('sudo runner -d 1 -t 5', function (stdout) {
        });
    },

    lightsOff: function () {
        execute('sudo runner -d 1 -t 6', function (stdout) {
        });
    },

    lightsState: function () {
        execute('sudo runner -d 1 -t 4', function (stdout) {
        });
    }
};

module.exports = Relay;