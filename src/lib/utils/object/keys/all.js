var ENUM_BUG = require('./utils/object/keys/enum-bug');
var collectNonEnumProps = require('./utils/object/collect-non-enum-props');
module.exports = function (obj) {
    var key, keys = [];
    for (key in obj) {
        keys.push(key);
    }
    // Ahem, IE < 9.
    if (ENUM_BUG) {
        collectNonEnumProps(obj, keys);
    }
    return keys;
};