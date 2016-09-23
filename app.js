var webApp = require('./server/webapp')

var app = webApp.createWebApp();
var settings = {
    port: 3000,
    hostname: '127.0.0.1'
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
