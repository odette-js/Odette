var ENUM_BUG = require('./utils/keys/enum-bug');
var collectNonEnumProps = require('./utils/collect-non-enum-props');
var isObject = require('./utils/is/object');
var isFunction = require('./utils/is/function');
var nativeKeys = require('./utils/keys/native');
var has = require('./utils/object/has');
module.exports = function (obj) {
    var key, keys = [];
    if (!obj || (!isObject(obj) && !isFunction(obj))) {
        return keys;
    }
    if (nativeKeys) {
        return nativeKeys(obj);
    }
    for (key in obj) {
        if (has(obj, key)) {
            keys.push(key);
        }
    }
    // Ahem, IE < 9.
    if (ENUM_BUG) {
        collectNonEnumProps(obj, keys);
    }
    return keys;
};