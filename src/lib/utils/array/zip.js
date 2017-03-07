var reduce = require('./utils/array/reduce');
var forEach = require('./utils/array/for/each');
module.exports = function (lists) {
    return reduce(lists, function (memo, list, listCount) {
        return forEach(memo, function (item, index) {
            var destination;
            if (!(destination = memo[index])) {
                destination = memo[index] = [];
            }
            destination[listCount] = item;
        });
    }, []);
};