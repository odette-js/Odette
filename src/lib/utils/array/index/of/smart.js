module.exports = smartIndexOf;
var sortedIndexOf = require('./utils/array/index/of/sorted'),
    indexOf = require('./utils/array/index/of'),
    isTrue = require('./utils/is/true');

function smartIndexOf(array, item, _from, _to) {
    return (array && array.length > 100 ? sortedIndexOf : indexOf)(array, item, _from, _to);
}