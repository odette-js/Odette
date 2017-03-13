var match = require('./utils/string/match');
var reUnicodeWord = require('./utils/regexp/unicode-word');
module.exports = function (string) {
    return match(string, reUnicodeWord);
};