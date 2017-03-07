var toArray = require('./utils/to/array');
var defaultTo = require('./utils/default-to');
module.exports = function (array, delimiter) {
    return toArray(array).join(defaultTo(delimiter, ','));
};