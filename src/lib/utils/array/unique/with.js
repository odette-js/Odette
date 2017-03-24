var isUndefined = require('./utils/is/undefined');
var forEachEndRight = require('./utils/array/base/for-each-end-right');
var bindWith = require('./utils/function/bind-with');
var isArrayLike = require('./utils/is/array-like');
var reduce = require('./utils/array/reduce');
module.exports = function uniqueBy(list, comparator) {
    if (!isArrayLike(list)) {
        // can't do something that is not an array like
        return list;
    }
    return reduce(list, function uniqueChecker(memo, a, index, list) {
        if (isUndefined(forEachEndRight(memo, bindWith(comparator, [null, a])))) {
            memo.push(a);
        }
        return memo;
    }, []);
};