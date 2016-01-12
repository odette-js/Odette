module.exports = {
    http: {
        port: 8080
    },
    env: {
        type: process.env.SPICE_ENV,
        isDev: process.env.SPICE_ENV === 'dev',
        logger: process.env.SPICE_LOGGER
    }
};