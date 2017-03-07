var wraptry = require('./utils/function/wrap-try');
module.exports = function (fn, catcher, finallyer) {
    return function (item) {
        return wraptry(function () {
            return fn(item);
        }, catcher, finallyer);
    };
};