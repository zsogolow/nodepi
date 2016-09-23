'use strict';

var fs = require('fs');
function NodePi() {

}

NodePi.prototype = {
    getHostname: function () {
        return fs.readFileSync('/etc/hostname');
    },

    getHostnameAsync: function () {
        var hostnamePromise = new Promise(function (resolve, reject) {
            fs.readFile('/etc/hostname', function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        return hostnamePromise;
    }
}

module.exports = NodePi; 