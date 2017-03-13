var match = require('./utils/string/match');
var isUndefined = require('./utils/is/undefined');
var unicodeWords = require('./utils/string/unicode-words');
var asciiWords = require('./utils/string/ascii-words')
var hasUnicodeWord = require('./utils/string/has-unicode-word');
var toString = require('./utils/to/string');
module.exports = function (string_, pattern_, guard) {
    var string = toString(string_),
        pattern = guard ? undefined : pattern_;
    if (isUndefined(pattern)) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
    }
    return match(string, pattern);
};