var slice = require('./slice');
var defaultTo1 = require('./default-to/1');
module.exports = function (array, _n) {
    return slice(array, defaultTo1(_n));
};