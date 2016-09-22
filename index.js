#!/usr/bin/env node

var settings = require('./settings');
require('./server')({
    http: {
        port: settings.http.port
    },
    env: {
        type: process.env.SPICE_ENV,
        isDev: process.env.SPICE_ENV === 'dev',
        logger: process.env.SPICE_LOGGER
    }
});
require('./server')({
    http: {
        port: settings.http.port - 80
    },
    env: {
        type: process.env.SPICE_ENV,
        isDev: process.env.SPICE_ENV === 'dev',
        logger: process.env.SPICE_LOGGER
    }
});