var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function (windo) {
    return windo && isStrictlyEqual(windo, windo.global);
};