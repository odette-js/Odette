var isStrictlyEqual = require('./utils/is/strictly-equal');
var forEachEndRight = require('./utils/array/base/for-each-end-right');
var bindWith = require('./utils/function/bind-with');
var isArrayLike = require('./utils/is/array-like');
var reduce = require('./utils/array/reduce');
module.exports = require('./utils/function/convert-second-to-iterable')(uniqueWith);

function uniqueWith(list, comparator) {
    return reduce(list, function uniqueChecker(memo, a, index, list) {
        if (isStrictlyEqual(forEachEndRight(memo, function (b) {
                return comparator(a, b);
            }), -1)) {
            memo.push(a);
        }
    }, []);
}