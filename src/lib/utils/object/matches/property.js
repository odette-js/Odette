var isStrictlyEqual = require('./utils/is/strictly-equal');
var get = require('./utils/object/get');
module.exports = function (pair) {
    var key = pair[0],
        value = pair[1];
    return function (item) {
        return isStrictlyEqual(get(item, key), value);
    };
};