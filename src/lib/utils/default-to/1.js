var defaultTo = require('./index.js');
module.exports = function defaultIs1(n) {
    return defaultTo(n, 1);
};