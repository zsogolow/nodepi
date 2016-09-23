'use strict';

var fs = require('fs');
var os = require('os');

function NodePi() {

}

NodePi.prototype = {
    osInfo: function () {
        console.log('hi')

        return {
            hostname: os.hostname(),
            loadavg: os.loadavg(),
            uptime: os.uptime(),
            freemem: os.freemem(),
            totalmem: os.totalmem(),
            cpus: os.cpus(),
            type: os.type(),
            release: os.release(),
            arch: os.arch(),
            platform: os.platform(),
            EOL: os.EOL,
            endianness: os.endianness()
        }
    },
}

module.exports = NodePi; 