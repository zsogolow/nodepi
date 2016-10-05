var webApp = require('./server/webapp');
var NodePi = require('./index');
var Duinos = require('./duinos');
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
var duinos = new Duinos();

unixSocket('/tmp/hidden', function (data) {
    var dataArray = [];
    for (var i = 0; i < data.length; i++) {
        dataArray.push(data[i]);
    }
    var id = dataArray[0];
    var action = dataArray[1];
    var type = dataArray[2];
    var extra = dataArray[3];

    var duino = {
        id: id,
        action: nodePi.getDuinoAction(action),
        type: nodePi.getDuinoType(type),
        extra: extra,
        heartbeat: new Date().toLocaleString()
    }

    sockets.send('all', duino.action, duino);
});

setTimeout(function () {
    console.log("listening now");
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
    console.log(req.body);
    var promise = nodeRelay.lightsOn(req.body.id);
    promise.then(function (data) {}).catch(function (err) {
        console.log(`oops! ${err}`);
    });

    res.end();
});

app.router.post('/lightsOff', function (req, res) {
    console.log(req.body);
    var promise = nodeRelay.lightsOff(req.body.id);
    promise.then(function (data) {}).catch(function (err) {
        console.log(`oops! ${err}`);
    });

    res.end();
});

app.router.get('/lightsState', function (req, res) {
    var parsed = url.parse(req.url, true);
    var promise = nodeRelay.lightsState(parsed.query.id);
    promise.then(function (data) {}).catch(function (err) {
        console.log(`oops! ${err}`);
    });

    res.end();
});

app.router.get('/ping', function (req, res) {
    var parsed = url.parse(req.url, true);
    var promise = duinos.ping(parsed.query.id);
    promise.then(function (data) {}).catch(function (err) {
        console.log(`oops! ${err}`);
    });
    
    res.end();
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