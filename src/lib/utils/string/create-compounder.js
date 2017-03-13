var words = require('./utils/string/words');
var deburr = require('./utils/string/deburr');
var reApos = require('./utils/regexp/apos');
var cacheable = require('./utils/function/cacheable');
var arrayReduce = require('./utils/array/reduce');
module.exports = function (callback) {
    return cacheable(function (string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
    });
};