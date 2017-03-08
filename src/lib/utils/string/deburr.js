var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
var deburrLetter = require('./utils/string/deburr-letter');
var toString = require('./utils/to/string');
module.exports = function (str) {
    var string = toString(str);
    return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
};