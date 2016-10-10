var net = require('net');
var fs = require('fs');
var socketPath = '/tmp/hidden';

function UnixServer() {
    if (!this) {
        return new UnixServer();
    }

    var self = this;

}

UnixServer.prototype = {
    listen: function (path) {
        if (!path) {
            path = socketPath;
        }

        fs.stat(path, function (err) {

            if (!err) {
                fs.unlinkSync(path);
            } else {
                console.log(err);
            }

            var unixServer = net.createServer(function (localSerialConnection) {
                localSerialConnection.on('data', function (data) {
                    // data is a buffer from the socket
                    next(data);
                    // send ack
                    // localSerialConnection.write('ack!');
                });
                // write to socket with localSerialConnection.write()
            });

            unixServer.listen(path);
        });
    },
    next: function (data) {
        console.log(data);
    }
};

function listen(path, cb) {
    if (!path) {
        path = socketPath;
    }

    var unixServer;
    fs.stat(path, function (err) {

        if (!err) {
            fs.unlinkSync(path);
        } else {
            console.log(err);
        }

        unixServer = net.createServer(function (localSerialConnection) {
            localSerialConnection.on('data', function (data) {
                // data is a buffer from the socket
                console.log(data);
                // cb(data);
                // send ack
                // localSerialConnection.write('ack!');
            });
            // write to socket with localSerialConnection.write()
        });

        unixServer.listen(path);
    });

    return unixServer;
}

module.exports = UnixServer;