var PERFORMANCE = 'performance';
var performance = require('./utils/performance');
var date_offset = require('./utils/date/offset');
var now = require('./utils/date/now');
module.exports = performance.now || (performance.now = (function () {
    var performance = win[PERFORMANCE];
    return performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
        return now() - date_offset;
    };
}()));