// #!/usr/bin/env node
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