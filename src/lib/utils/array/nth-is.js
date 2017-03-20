var isStrictlyEqual = require('./utils/is/strictly-equal');
var nth = require('./utils/array/nth');
module.exports = function nthIs(array, final, index) {
    return isStrictlyEqual(nth(array, index || 0), final);
};