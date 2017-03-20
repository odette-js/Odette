var isStrictlyEqual = require('./strictly-equal');
module.exports = function (thing) {
    return isStrictlyEqual(thing);
};