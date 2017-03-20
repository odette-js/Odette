var toIterable = require('./utils/to/iterable');
module.exports = function convertSecondToIterable(fn) {
    return function convertsSecondToIterable(a, b, c, d, e, f) {
        return fn(a, toIterable(b), c, d, e, f);
    };
};