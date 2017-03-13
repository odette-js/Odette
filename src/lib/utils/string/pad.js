var toString = require('./utils/to/string');
var toInteger = require('./utils/to/integer');
var nativeFloor = require('./utils/number/floor');
var createPadding = require('./utils/string/create-padding');
var nativeCeil = require('./utils/number/ceil');
module.exports = function pad(string_, length_, chars) {
    var string = toString(string_);
    var length = toInteger(length_);
    var strLength = length ? string.length : 0;
    if (!length || strLength >= length) {
        return string;
    }
    var mid = (length - strLength) / 2;
    return ''.concat(createPadding(nativeFloor(mid), chars), string, createPadding(nativeCeil(mid), chars));
};