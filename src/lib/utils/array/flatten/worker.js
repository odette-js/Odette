var reduce = require('./utils/array/reduce');
module.exports = flattenWorker;

function flattenWorker(list, filter, next) {
    return reduce(list, function (memo, item) {
        if (filter(item)) {
            return memo.concat(next(item, filter, next));
        } else {
            memo.push(item);
            return memo;
        }
    }, []);
};