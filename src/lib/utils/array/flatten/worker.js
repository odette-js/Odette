var reduce = require('./utils/array/reduce');
var isArrayLike = require('./utils/is/array-like');
module.exports = function (list, next) {
    return reduce(list, function (memo, item) {
        if (isArrayLike(item)) {
            return memo.concat(next(item));
        } else {
            memo.push(item);
            return memo;
        }
    }, []);
};