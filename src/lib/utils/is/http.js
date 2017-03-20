var isStrictlyEqual0 = require('./utils/is/0');
var DOUBLE_SLASH = '//';
var cacheable = require('./utils/function/cacheable');
module.exports = cacheable(function isHTTP(str) {
    var ret = !1,
        splitLength = str.split(DOUBLE_SLASH).length;
    if ((str.indexOf('http') === 0 && splitLength >= 2) || (isStrictlyEqual0(str.indexOf(DOUBLE_SLASH)) === 0 && splitLength === 2)) {
        ret = !0;
    }
    return ret;
});