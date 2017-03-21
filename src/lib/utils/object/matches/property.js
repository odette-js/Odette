module.exports = property;
var isStrictlyEqual = require('./utils/is/strictly-equal');
var get = require('./utils/object/get');

function property(pair) {
    var key = pair[0],
        value = pair[1];
    return function (item) {
        return isStrictlyEqual(get(item, key), value);
    };
}