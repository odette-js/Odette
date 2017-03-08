var keys = require('./utils/keys');
var toObject = require('./utils/to/object');
var find = require('./utils/array/find');
var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function (object, attrs) {
    var key, i = 0,
        keysResult = keys(attrs),
        obj = toObject(object);
    return !find(keysResult, function (key) {
        return !isStrictlyEqual(attrs[key], obj[key]);
    });
};