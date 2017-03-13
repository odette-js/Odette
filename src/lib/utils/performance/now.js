var performance = require('./utils/performance');
var date_offset = require('./utils/date/offset');
var now;
if (!performance.now) {
    now = require('./utils/date/now');
    performance.now = performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
        return now() - date_offset;
    };
}
module.exports = performance.now;