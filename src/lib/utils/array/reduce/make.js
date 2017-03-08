var reduction = require('./utils/array/reduce/reduction');
module.exports = function (dir_) {
    return function (obj, iteratee, memo) {
        return reduction(obj, iteratee, memo, dir_, arguments.length < 3);
    };
};