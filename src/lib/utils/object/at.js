var isStrictlyEqual = require('./utils/is/strictly-equal');
var iterateOverPath = require('./utils/iterate/over-path');
var lastIndex = require('./utils/array/index/last');
var isNil = require('./utils/is/nil');
module.exports = function (object_, path) {
    var result, object = object_ || {};
    iterateOverPath(path, function (accessor, index, list) {
        var value = object[accessor];
        if (isStrictlyEqual(index, lastIndex(list))) {
            result = value;
        } else if (isNil(value)) {
            return true;
        } else {
            object = value;
        }
    });
    return result;
};