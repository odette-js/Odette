var toString = require('./utils/to/string');
var defaultTo = require('./utils/default-to');
module.exports = function (string, delimiter) {
    return toString(string).split(defaultTo(delimiter, ''));
};