var isStrictlyEqual = require('./is/strictly-equal');
var nth = require('./nth');
module.exports = function (array, final, index) {
    return isStrictlyEqual(nth(array, index || 0), final);
};