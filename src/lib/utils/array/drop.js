var slice = require('./slice');
var defaultTo1 = require('./utils/default-to/1');
module.exports = function drop(array, _n) {
    return slice(array, defaultTo1(_n));
};