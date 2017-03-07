var toIterable = require('./utils/to/iterable');
module.exports = function (fn) {
    return function (a, b, c, d, e, f) {
        return fn(a, toIterable(b), c, d, e, f);
    };
};