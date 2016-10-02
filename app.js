var webApp = require('./server/webapp');
var NodePi = require('./index');
var NodeRelay = require('./relay');
var Sockets = require('./sockets');
var unixSocket = require('./unixSocket');
var url = require('url');

var app = webApp.createWebApp();
var settings = {
    port: 3000,
    hostname: '0.0.0.0'
};

var nodePi = new NodePi();
var nodeRelay = new NodeRelay();
var sockets = new Sockets(app.server);

unixSocket('/tmp/hidden', function (data) {
    var dataArray = [];
    for (var i = 0; i < data.length; i++) {
        dataArray.push(data[i]);
    }
    var type = dataArray[0];
    var id = dataArray[1];
    var duino = {
        type: nodePi.getDuinoType(type),
        id: id,
        heartbeat: new Date().toLocaleString()
    }
    sockets.send('all', 'heartbeat', duino);
});

setTimeout(function () {
    nodePi.startListening();
}, 1500);

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

app.router.get('/networkInfo', function (req, res) {
    var networkInfo = nodePi.network();
    res.end(JSON.stringify(networkInfo));
});

app.router.post('/lightsOn', function (req, res) {
    var promise = nodeRelay.lightsOn();
    promise.then(function (data) {
        res.end(data.toString());
    });
});

app.router.post('/lightsOff', function (req, res) {
    var promise = nodeRelay.lightsOff();
    promise.then(function (data) {
        res.end(data.toString());
    });
});

app.router.get('/lightsState', function (req, res) {
    var parsed = url.parse(req.url, true);    
    var promise = nodeRelay.lightsState(parsed.query.id);
    promise.then(function (data) {
        res.end(data.toString());
    });
});

app.router.post('/shutdown', function (req, res) {
    nodePi.halt();
    res.end('shutting down');
});

app.router.post('/reboot', function (req, res) {
    nodePi.reboot();
    res.end('rebooting');
});

sockets.stream(1000, 'all', 'uptime', function () {
    return nodePi.osInfo().uptime;
});