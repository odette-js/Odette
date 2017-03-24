var isNil = require('./utils/is/nil');
module.exports = function accessObjectAfter(result, original, iterated, wasArrayLike) {
    return isNil(result) ? result : (wasArrayLike ? original[result] : original[iterated[result]]);
};