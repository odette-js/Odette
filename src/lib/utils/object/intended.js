var isObject = require('./utils/is/object');
var isArray = require('./utils/is/array');
var forEach = require('./utils/array/for/each');
var reverseParams = require('./utils/function/reverse-params');
var forOwn = require('./utils/object/for-own');
module.exports = function (key, value, fn) {
    var obj;
    if (isArray(key)) {
        forEach(key, function (first) {
            fn(first, value);
        });
    } else {
        if ((obj = isObject(key) ? key : false)) {
            forOwn(obj, reverseParams(fn));
        } else {
            fn(key, value);
        }
    }
};