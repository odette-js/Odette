var symbolToString = require('./utils/symbol/to-string');
var isString = require('./utils/is/string');
var isSymbol = require('./utils/is/symbol');
module.exports = function (value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (isString(value)) {
        return value;
    }
    if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -Infinity) ? '-0' : result;
};