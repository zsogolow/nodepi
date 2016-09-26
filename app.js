var webApp = require('./server/webapp');
var NodePi = require('./index');

var app = webApp.createWebApp();
var settings = {
    port: 3000,
    hostname: '0.0.0.0'
};

var nodePi = new NodePi();

app.router.use(function (req, res, next) {
    res.setHeader('test', 'header1');
    next();
});

app.router.get('/hi', function (req, res) {
    res.end('you got hi!');
});

app.listen(settings.port, settings.hostname, () => {
    console.log(`Server running at http://${settings.hostname}:${settings.port}/`);
});

app.router.get('/osInfo', function (req, res) {
    var promDate = nodePi.osInfo();
    res.end(JSON.stringify(promDate));
});

app.router.post('/shutdown', function (req, res) {
    nodePi.halt();
    res.end('shutting down');
});

app.router.post('/reboot', function (req, res) {
    nodePi.reboot();
    res.end('rebooting');
});

function streamUptime(interval) {
    setInterval(function () {
        for (var prop in cons) {
            if (cons.hasOwnProperty(prop)) {
                var con = cons[prop];
                con.socket.emit('data', {
                    type: 'uptime',
                    data: nodePi.osInfo().uptime
                });
            }
        }
    }, interval);
}

streamUptime(1000);

var seed = 0;
var cons = {};
var io = require('socket.io')(app.server);

function generateId() {
    return seed++;
}
io.on('connection', function (socket) {
    var id = generateId();
    cons[id] = {
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
        delete cons[id];
    });
});