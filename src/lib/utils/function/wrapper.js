var noop = require('./utils/function/noop');
module.exports = function (defaultFn_) {
    var defaultFn = defaultFn_ || noop;
    return function (passnext, passfirst_) {
        var passfirst = passfirst_ || defaultFn;
        return function (item, value) {
            return passnext(item, value, function () {
                return passfirst(item, value);
            });
        };
    };
};