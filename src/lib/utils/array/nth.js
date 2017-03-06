var toNumberCoerce = require('./utils/to/number');
var access = require('./utils/object/get');
module.exports = function (array, index) {
    var idx;
    return (idx = toNumberCoerce(index)) !== -1 ? access(array, idx) : undefined;
};