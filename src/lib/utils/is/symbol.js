var SYMBOL = 'symbol';
var isStrictlyEqual = require('./utils/is/strictly-equal');
var callObjectToString = require('./utils/function/object-to-string');
var createToStringResult = require('./utils/to/string-result');
var symbolTag = createToStringResult(SYMBOL);
var isObject = require('./utils/is/object');
var isSymbolWrap = require('./utils/is/type-wrap')(SYMBOL);
module.exports = function (value) {
    return isSymbolWrap(value) || (isObject(value) && isStrictlyEqual(callObjectToString(value), symbolTag));
};