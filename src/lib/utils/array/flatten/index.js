var returnsFirstArgument = require('./utils/returns/first');
var flattens = require('./utils/array/flatten/worker');
module.exports = function (list) {
    return flattens(list, returnsFirstArgument);
};