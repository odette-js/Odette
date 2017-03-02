var slice = require('./slice');
var defaultTo1 = require('./default-to/1');
module.exports = function (array, _n) {
    return slice(array, 0, defaultTo1(_n));
};