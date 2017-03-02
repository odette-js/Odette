var toNumberCoerce = require('./to/number');
var access = require('./object/access');
module.exports = function (array, index) {
    var idx;
    return (idx = toNumberCoerce(index)) !== -1 ? access(array, idx) : undefined;
};