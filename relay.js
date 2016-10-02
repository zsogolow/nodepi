var exec = require('child_process').exec;

function Relay() {

}

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}

Relay.prototype = {
    lightsOn: function (id) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 5', function (stdout) {
                var state = parseInt(stdout);
                console.log(state);
                resolve(state);
            });
        });
        return prom;
    },

    lightsOff: function (id) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 6', function (stdout) {
                var state = parseInt(stdout);
                console.log(state);
                resolve(state);
            });
        });
        return prom;
    },

    lightsState: function (id) {
        var prom = new Promise(function (resolve, reject) {
            execute('sudo runner -d ' + id + ' -t 4', function (stdout) {
                var state = parseInt(stdout);
                console.log(state);
                resolve(state);
            });
        });
        return prom;
    }
};

module.exports = Relay;