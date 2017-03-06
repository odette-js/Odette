var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function (thing) {
    return isStrictlyEqual(thing, null);
};