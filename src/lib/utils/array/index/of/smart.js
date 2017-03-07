var sortedIndexOf = require('./utils/array/index/of/sorted');
var indexOf = require('./utils/array/index/of');
module.exports = function (array, item, _from, _to, _rtl) {
    return (_from === true && array && array.length > 100 ? sortedIndexOf : indexOf)(array, item, _from, _to, _rtl);
};