var flattens = require('./utils/array/flatten/worker');
module.exports = function flattenDeep(list) {
    return flattens(list, flattens);
};