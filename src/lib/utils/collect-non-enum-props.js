var CONSTRUCTOR = 'constructor';
var has = require('./object/has');
var contains = require('./array/contains');
var nonEnumerableProps = require('./non-enumerable-props');
module.exports = function (obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj[CONSTRUCTOR];
    var proto = (isFunction(constructor) && constructor.prototype) || ObjProto;
    // Constructor is a special case.
    var prop = CONSTRUCTOR;
    if (has(obj, prop) && !contains(keys, prop)) {
        keys.push(prop);
    }
    while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] && !contains(keys, prop)) {
            keys.push(prop);
        }
    }
};