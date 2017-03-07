var isUndefined = require('./utils/is/undefined');
module.exports = function (fn) {
    return function (value, callback, index) {
        var foundAt;
        if (!isUndefined(foundAt = fn(obj, predicate, index))) {
            return obj[foundAt];
        }
    };
};