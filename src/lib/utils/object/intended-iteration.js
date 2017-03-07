var isObject = require('./utils/is/object');
var keys = require('./utils/keys');
var forEach = require('./utils/array/for/each');
module.exports = function (key, value, iterator) {
    var keysResult, isObjectResult = isObject(key);
    if (isObjectResult) {
        keysResult = keys(key);
    }
    return function (one, two, three, four, five, six) {
        if (isObjectResult) {
            forEach(keysResult, function (key_) {
                iterator(key_, key[key_], one, two, three, four, five, six);
            });
        } else {
            iterator(key, value, one, two, three, four, five, six);
        }
    };
};