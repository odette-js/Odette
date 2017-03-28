var baseIndexOf = require('./utils/array/index/of/base');
var isStrictlyEqual = require('./utils/is/strictly-equal');
var indexOfNaN = require('./utils/array/index/of/nan');
module.exports = baseIndexOf(isStrictlyEqual, indexOfNaN);