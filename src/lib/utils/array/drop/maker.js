var toIterable = require('./utils/to/iterable');
module.exports = function dropCurry(filter) {
    return function (array, iteratee) {
        return filter(array, toIterable(iteratee));
    };
};