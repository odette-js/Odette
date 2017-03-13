var cacheable = require('./utils/function/cacheable');
var isString = require('./utils/is/string');
module.exports = cacheable(function (str) {
    var match;
    if (!str) {
        return '';
    }
    if (!isString(str)) {
        str = str.referrer;
    }
    if (isString(str)) {
        // gives it a chance to match
        str += '/';
        match = str.match(/^https?:\/\/.*?\//im);
        if (match) {
            match = match[0].slice(0, match[0].length - 1);
        }
    }
    return match || '';
});