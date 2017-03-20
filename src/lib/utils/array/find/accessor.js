var isUndefined = require('./utils/is/undefined');
module.exports = function accessorCurry(fn) {
    return function accessor(value, callback, index) {
        var foundAt;
        if (!isUndefined(foundAt = fn(value, callback, index))) {
            return value[foundAt];
        }
    };
};