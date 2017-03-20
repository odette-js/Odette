var sortedIndexOf = require('./utils/array/index/of/sorted');
var indexOf = require('./utils/array/index/of');
var isTrue = require('./utils/is/true');
module.exports = function smartIndexOf(array, item, _from, _to, _rtl) {
    return (isTrue(_from) && array && array.length > 100 ? sortedIndexOf : indexOf)(array, item, _from, _to, _rtl);
};