function Sockets(server) {
    if (this === undefined) {
        return new Sockets(server);
    }

    var io = require('socket.io')(server);

    this.seed = 0;
    this.cons = {};

    var self = this;

    io.on('connection', function (socket) {
        var id = self.generateId();
        self.cons[id] = {
            id: id,
            socket: socket
        };

        /**
         * send the connected event on connection
         */
        socket.emit('connected', {
            hello: 'world'
        });

        /**
         * listen for ack message. type will be the message
         * we are getting the ack from.
         */
        socket.on('ack', function (data) {
            console.log(data.data);
            switch (data.type) {
                case 'connected':
                    break;
                default:
                    break;
            }
        });

        /**
         * listen for \'request\''s
         */
        socket.on('request', function (data) {
            console.log(data.data);
            switch (data.type) {
                default: break;
            }
        });

        /**
         * remove the socket from our list of cons
         */
        socket.on('disconnect', function () {
            delete self.cons[id];
        });
    });
};


Sockets.prototype = {
    stream: function (interval, socketid, dataType, getData) {
        if (interval === undefined || isNaN(interval)) {
            interval = 1000;
        }

        if (socketid === undefined) {
            socketid = 'all';
        }

        var self = this;
        setInterval(function () {
            if (socketid === 'all') {
                for (var prop in self.cons) {
                    if (self.cons.hasOwnProperty(prop)) {
                        var con = self.cons[prop];
                        con.socket.emit('data', {
                            type: dataType,
                            data: getData()
                        });
                    }
                }
            } else {
                var con = self.cons[socketid];
                if (con) {
                    con.socket.emit('data', {
                        type: dataType,
                        data: getData()
                    });
                }
            }
        }, interval);
    },

    send: function (socketid, dataType, data) {
        if (socketid === 'all') {
            for (var prop in self.cons) {
                if (self.cons.hasOwnProperty(prop)) {
                    var con = self.cons[prop];
                    con.socket.emit('data', {
                        type: dataType,
                        data: data
                    });
                }
            }
        } else {
            var con = self.cons[socketid];
            if (con) {
                con.socket.emit('data', {
                    type: dataType,
                    data: data
                });
            }
        }
    },

    generateId: function () {
        return this.seed++;
    }
}

module.exports = Sockets;