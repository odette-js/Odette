var reduce = require('./utils/array/reduce');
var forEach = require('./utils/array/for/each');
module.exports = function zip(lists) {
    return reduce(lists, function zipReducer(memo, list, listCount) {
        return forEach(memo, function zipIterator(item, index) {
            var destination;
            if (!(destination = memo[index])) {
                destination = memo[index] = [];
            }
            destination[listCount] = item;
        });
    }, []);
};