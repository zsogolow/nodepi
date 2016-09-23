'use strict'

var http = require('http')
var Router = require('router')
var staticServer = require('node-static')
var bodyParser = require('body-parser')

/**
 * WebApp constructor
 */
function WebApp() {
    // ensure proper context
    if (!(this instanceof WebApp)) {
        return new WebApp();
    }

    var self = this;

    // create httpServer, store it on this
    const httpServer = http.createServer(requestHandler);
    self.server = httpServer;

    const router = Router();
    router.use(bodyParser.json());
    self.router = router;

    const fileServer = new staticServer.Server();
    self.fileServer = fileServer;

    function requestHandler(req, res) {
        self.router(req, res, () => {
            self.fileServer.serve(req, res);
        });
    }
};

/**
 * WebApp prototype, functions accessed via instance dot call
 */
WebApp.prototype = {

    /**
     * facade call to server.listen, to begin excepting connections to the
     * specified port and host name. callback is invoked on the 'listening' 
     * event.
     */
    listen: function (port, hostname, callback) {
        var self = this;
        self.server.listen(port, hostname, callback);
    },
};

/**
 * creates a new instanace of WebApp
 */
var createWebApp = function () {
    var app = new WebApp();
    return app;
};

/**
 * expose the createWebApp function
 */
module.exports.createWebApp = createWebApp;


/**
    Example Usage:
 
    var webApp = require('./webapp')

    var app = webApp.createWebApp();

    app.router.use(function (req, res, next) {
        res.setHeader('test', 'header1');
        next();
    });

    app.router.get('/hi', function (req, res) {
        res.end('you got hi!');
    });

    app.listen(3000, '127.0.0.1', () => {
        console.log(`Server running at http://${'127.0.0.1'}:${3000}/`);
    });

 */