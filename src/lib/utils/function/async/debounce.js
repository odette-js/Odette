module.exports = function (func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments,
            callNow = immediate && !timeout,
            later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
        return timeout;
    };
};