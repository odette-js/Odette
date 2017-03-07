var concat = [].concat;
var map = require('./utils/array/map');
var toArray = require('./utils/to/array');
var passesFirstArgument = require('./utils/passes/first');
module.exports = function (list) {
    return arrayConcat.apply([], map(list, passesFirstArgument(toArray)));
};