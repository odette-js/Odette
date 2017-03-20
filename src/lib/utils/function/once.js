module.exports = function once(fn) {
    var doIt = 1;
    return function onceInstance() {
        if (doIt) {
            doIt = 0;
            return fn.apply(this, arguments);
        }
    };
};