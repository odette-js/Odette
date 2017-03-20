var wraptry = require('./utils/function/wrap-try');
module.exports = function doTry(fn, catcher, finallyer) {
    return function doTryIterator(item) {
        return wraptry(function tries() {
            return fn(item);
        }, catcher, finallyer);
    };
};