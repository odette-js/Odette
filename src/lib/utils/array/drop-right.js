var slice = require('./slice');
var defaultTo1 = require('./utils/default-to/1');
module.exports = function dropRight(array, _n) {
    return slice(array, 0, defaultTo1(_n));
};