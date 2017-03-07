var isUndefined = require('./utils/is/undefined');
var findIndex = require('./utils/array/find/key');
var bindWith = require('./utils/function/bind-with');
var isArrayLike = require('./utils/is/array-like');
var reduce = require('./utils/array/reduce');
module.exports = function (list, comparator) {
    if (!isArrayLike(list)) {
        // can't do something that is not an array like
        return list;
    }
    return reduce(list, function (memo, a, index, list) {
        if (isUndefined(findIndex(memo, bindWith(comparator, [null, a])))) {
            memo.push(a);
        }
        return memo;
    }, []);
};