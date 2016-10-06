#!/usr/bin/env node

// var settings = require('./settings');
var server = require('./server');
module.exports = function (port) {
    return server({
        http: {
            port: port
        },
        env: {
            type: process.env.SPICE_ENV,
            isDev: process.env.SPICE_ENV === 'dev',
            logger: process.env.SPICE_LOGGER
        }
    });
};
// server({
//     http: {
//         port: settings.http.port - 80
//     },
//     env: {
//         type: process.env.SPICE_ENV,
//         isDev: process.env.SPICE_ENV === 'dev',
//         logger: process.env.SPICE_LOGGER
//     }
// });