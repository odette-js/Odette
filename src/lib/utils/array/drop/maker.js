var toIterable = require('./utils/to/iterable');
module.exports = function (filter) {
    return function (array, iteratee) {
        return filter(array, toIterable(iteratee));
    };
};