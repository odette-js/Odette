var now = require('./utils/date/now');
module.exports = function (fn, threshold, scope) {
    var last,
        deferTimer;
    if (!threshold) {
        threshold = 250;
    }
    return function () {
        var context = scope || this,
            _now = now(),
            args = arguments;
        if (last && _now < last + threshold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = _now;
                fn.apply(context, args);
            }, threshold);
        } else {
            last = _now;
            fn.apply(context, args);
        }
    };
};