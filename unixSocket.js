var net = require('net');
var fs = require('fs');
var socketPath = '/tmp/hidden';

function listen(path, cb) {
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
                cb(data);
                // send ack
                localSerialConnection.write('ack!');
            });
            // write to socket with localSerialConnection.write()
        });

        unixServer.listen(path);
    });
}

module.exports = function (path, cb) {
    listen(path, cb);
}