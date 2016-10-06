var gulp = require('gulp');
var path = require('path');
var pathtosettings = path.join(process.cwd(), './settings');
var settings = require(pathtosettings);
var argv = require('optimist').argv;
module.exports = function (settings, paths) {
    return function () {
        server({
            http: {
                port: argv.port || settings.http.port - 80
            },
            env: {
                type: process.env.SPICE_ENV,
                isDev: process.env.SPICE_ENV === 'dev',
                logger: process.env.SPICE_LOGGER
            }
        });
    };
};