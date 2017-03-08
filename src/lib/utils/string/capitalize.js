var cacheable = require('./utils/function/cacheable');
module.exports = cacheable(function (s) {
    return s[0].toUpperCase() + s.slice(1);
});