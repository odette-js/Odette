var noop = require('./utils/function/noop');
module.exports = function wrapper(defaultFn_) {
    var defaultFn = defaultFn_ || noop;
    return function wraps(passnext, passfirst_) {
        var passfirst = passfirst_ || defaultFn;
        return function calls(item, value) {
            return passnext(item, value, function next() {
                return passfirst(item, value);
            });
        };
    };
};