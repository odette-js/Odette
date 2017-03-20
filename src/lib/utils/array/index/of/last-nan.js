var indexOfNaN = require('./utils/array/index/of/nan');
module.exports = function lastIndexOfNaN(a, b, c) {
    return indexOfNaN(a, b, c, true);
};