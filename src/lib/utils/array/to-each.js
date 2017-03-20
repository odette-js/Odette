var forEach = require('./utils/array/for/each');
var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function doToEach(handler) {
    return function (list, items, lookAfter, lookBefore, fromRight) {
        var count = 0;
        forEach(items, function runMethodAndCount(item) {
            count += handler(list, item, lookAfter, lookBefore, fromRight);
        });
        return !!count;
    };
};