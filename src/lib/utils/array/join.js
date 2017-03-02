var toArray = require('./to/array');
var defaultTo = require('./default-to');
module.exports = function (array, delimiter) {
    return toArray(array).join(defaultTo(delimiter, ','));
};