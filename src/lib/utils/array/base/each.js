var isArrayLike = require('./utils/is/array-like');
module.exports = function baseForEach(iterates, forEach) {
    return function baseForEachIterator(obj_, iteratee_) {
        var obj = obj_,
            iteratee = iteratee_;
        if (!obj) {
            return;
        }
        if (!isArrayLike(obj)) {
            iteratee = iterates(obj, iteratee);
            obj = iteratee.keys;
        }
        if (obj.length) {
            return forEach(obj, iteratee);
        }
    };
};