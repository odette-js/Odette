var reduce = require('./utils/array/reduce');
var indexOf = require('./utils/array/index/of');
var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function concatUnique(list) {
    return reduce(list, function (memo, argument) {
        return reduce(argument, function (memo, item) {
            if (isStrictlyEqual(indexOf(memo, item), -1)) {
                memo.push(item);
            }
        }, memo);
    }, []);
};