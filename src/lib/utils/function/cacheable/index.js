var isUndefined = require('./utils/is/undefined');
module.exports = function (fn) {
    var cache = {};
    return function (input) {
        var value;
        if (isUndefined(value = cache[input])) {
            value = cache[input] = fn(input);
        }
        return value;
    };
};