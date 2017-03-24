module.exports = match;
var keys = require('./utils/object/keys');
var toObject = require('./utils/to/object');
var forEachEnd = require('./utils/array/base/for-each-end');
var isStrictlyEqual = require('./utils/is/strictly-equal');

function match(object, attrs) {
    var key, i = 0,
        keysResult = keys(attrs),
        obj = toObject(object);
    return !(forEachEnd(keysResult, iterates) + 1);

    function iterates(key) {
        return !isStrictlyEqual(attrs[key], obj[key]);
    }
}