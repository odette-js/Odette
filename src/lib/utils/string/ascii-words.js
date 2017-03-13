var match = require('./utils/string/match');
var reAsciiWord = require('./utils/regexp/ascii-word');
module.exports = function (string) {
    return match(string, reAsciiWord);
};