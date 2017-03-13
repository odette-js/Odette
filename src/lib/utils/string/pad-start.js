var toString = require('./utils/to/string');
var toInteger = require('./utils/to/integer');
var createPadding = require('./utils/string/create-padding');
module.exports = function (string_, length_, chars) {
    var string = toString(string_);
    var length = toInteger(length_);
    var strLength = length ? string.length : 0;
    return (length && strLength < length) ? ''.concat(createPadding(length - strLength, chars).string) : string;
};