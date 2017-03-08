var hasUnicodeWord = require('./utils/string/has-unicode-word');
var toString = require('./utils/to/string');
module.exports = function (string_, pattern_, guard) {
    var string = toString(string_),
        pattern = guard ? undefined : pattern_;
    if (pattern === undefined) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
    }
    return string.match(pattern) || [];
};