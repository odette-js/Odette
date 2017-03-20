var lastIndex = require('./index/last');
var nthIs = require('./nth-is');
module.exports = function lastIs(array, final) {
    return nthIs(array, final, lastIndex(array));
};