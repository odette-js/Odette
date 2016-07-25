#!/usr/bin/env node

require('./server')({
    http: {
        port: 9080
    },
    env: {
        type: process.env.SPICE_ENV,
        isDev: process.env.SPICE_ENV === 'dev',
        logger: process.env.SPICE_LOGGER
    }
});
require('./server')({
    http: {
        port: 9000
    },
    env: {
        type: process.env.SPICE_ENV,
        isDev: process.env.SPICE_ENV === 'dev',
        logger: process.env.SPICE_LOGGER
    }
});