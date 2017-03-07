module.exports = function (fn) {
    var doIt = 1;
    return function () {
        if (doIt) {
            doIt = 0;
            return fn.apply(this, arguments);
        }
    };
};