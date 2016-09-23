var webApp = require('./server/webapp');
var NodePi = require('./index');

var app = webApp.createWebApp();
var settings = {
    port: 3000,
    hostname: '0.0.0.0'
};

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

var nodePi = new NodePi();

app.router.get('/osInfo', function (req, res) {
    var promDate = nodePi.osInfo();
    res.end(JSON.stringify(promDate));
});

app.router.post('/shutdown', function (req, res) {
    nodePi.halt();
    res.end('shutting down');
});