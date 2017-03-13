var cacheable = require('./utils/function/cacheable');
module.exports = cacheable(function (url) {
    return str.split('//').shift();
});