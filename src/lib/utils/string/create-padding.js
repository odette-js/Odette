var nativeCeil = require('./utils/number/ceil');
var toArray = require('./utils/to/array');
var baseRepeat = require('./utils/string/base/repeat');
var baseToString = require('./utils/to/base/string');
module.exports = function (length, chars_) {
    var chars = chars_ === undefined ? ' ' : baseToString(chars_);
    var charsLength = chars.length;
    if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
    }
    var result = baseRepeat(chars, nativeCeil(length / chars.length));
    return hasUnicode(chars) ? castSlice(toArray(result), 0, length).join('') : result.slice(0, length);
};