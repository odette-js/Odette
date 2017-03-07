var forEach = require('./utils/array/for/each');
module.exports = function (keys) {
    var obj = {};
    forEach(keys, function (key, index) {
        obj[key[0]] = key[1];
    });
    return obj;
};