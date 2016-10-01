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
            console.log(stdout);
        });
    },

    lightsOff: function () {
        execute('sudo runner -d 1 -t 6', function (stdout) {
            console.log(stdout);
        });
    },

    lightsState: function () {
        execute('sudo runner -d 1 -t 4', function (stdout) {
            console.log(stdout);
        });
    }
};

module.exports = Relay;