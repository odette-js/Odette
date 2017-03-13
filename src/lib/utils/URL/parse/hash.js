var cacheable = require('./utils/function/cacheable');
var indexOf = require('./utils/array/index/of');
module.exports = cacheable(function (url) {
    var hashIdx, hash = '';
    return (hashIdx = indexOf(url, '#') + 1) ? url.slice(hashIdx) : hash;
});