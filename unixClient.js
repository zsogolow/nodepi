'use strict';

var net = require('net');
var socketPath = '/tmp/hidden';

function UnixClient() {
    if (!this) {
        return new UnixClient();
    }

    var self = this;
}


UnixClient.prototype = {
    open: function (path, cb) {
        if (!path) {
            path = socketPath;
        }

        var self = this;

        var client = net.connect(path, () => {
            //'connect' listener
            console.log('connected to server!');
            cb(client);
        });

        client.on('data', (data) => {
            console.log(data.toString());
        });

        client.on('end', () => {
            console.log('disconnected from server');
        });

        self.client = client;
    },

    write: function (msg) {
        var self = this;
        
        self.client.write(msg);
    }
};

module.exports = UnixClient;




// var socketPath = '/tmp/hidden';
// var client;
// setTimeout(function () {
//     client = net.connect(socketPath, () => {
//         //'connect' listener
//         console.log('connected to server!');
//         client.write("0000");
//     });

//     client.on('data', (data) => {
//         console.log(data.toString());
//     });

//     client.on('end', () => {
//         console.log('disconnected from server');
//     });
// }, 2000);