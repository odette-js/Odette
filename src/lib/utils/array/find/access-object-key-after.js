var isNil = require('./utils/is/nil');
module.exports = function accessObjectKeyAfter(result, original, iterated, wasArrayLike) {
    return isNil(result) ? result : (wasArrayLike ? result : iterated[result]);
};