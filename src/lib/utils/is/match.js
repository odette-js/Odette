module.exports = match;
var keys = require('./utils/object/keys');
var toObject = require('./utils/to/object');
var find = require('./utils/array/find');
var isStrictlyEqual = require('./utils/is/strictly-equal');

function match(object, attrs) {
    var key, i = 0,
        keysResult = keys(attrs),
        obj = toObject(object);
    return !find(keysResult, function (key) {
        return !isStrictlyEqual(attrs[key], obj[key]);
    });
};