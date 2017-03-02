var toString = require('./to/string');
var defaultTo = require('./default-to');
module.exports = function (string, delimiter) {
    return toString(string).split(defaultTo(delimiter, ''));
};