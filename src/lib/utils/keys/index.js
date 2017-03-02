var ENUM_BUG = require('./enum-bug');
var collectNonEnumProps = require('./collect-non-enum-props');
var isObject = require('./is/object');
var isFunction = require('./is/function');
var nativeKeys = require('./native');
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