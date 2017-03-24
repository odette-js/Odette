var isNil = require('./utils/is/nil');
module.exports = function accessorCurry(fn) {
    return function accessor(object, callback, start, end) {
        var foundAt;
        if (!isNil(foundAt = fn(object, callback, start, end))) {
            return object[foundAt];
        }
    };
};