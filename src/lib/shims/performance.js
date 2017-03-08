var PERFORMANCE = 'performance';
global[PERFORMANCE] = global[PERFORMANCE] || {};
global[PERFORMANCE].now = (function () {
    var performance = global[PERFORMANCE];
    return performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
        return new Date().getTime();
    };
})();