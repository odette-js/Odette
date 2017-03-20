var isUndefined = require('./utils/is/undefined');
module.exports = function cacheable(fn) {
    var cache = {};
    return function cacheableInstance(input) {
        var value;
        if (isUndefined(value = cache[input])) {
            value = cache[input] = fn(input);
        }
        return value;
    };
};