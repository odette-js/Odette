var doTry = require('./utils/function/do-try');
module.exports = buildCallers;

function buildCallers(prefix, handler, second, memo_) {
    var memo = memo_ || {},
        CALL = 'Call',
        BOUND = 'Bound',
        TRY = 'Try';
    memo[prefix] = handler;
    memo[prefix + CALL] = function (array, method, arg) {
        return handler(array, function (item) {
            return item[method](arg);
        });
    };
    memo[prefix + CALL + BOUND] = function (array, arg) {
        return handler(array, function (fn) {
            return fn(arg);
        });
    };
    memo[prefix + CALL + TRY] = function (array, method, arg, catcher, finallyer) {
        return handler(array, doTry(function (item) {
            return item[method](arg);
        }, catcher, finallyer));
    };
    memo[prefix + CALL + BOUND + TRY] = function (array, method, arg, catcher, finallyer) {
        return handler(array, doTry(function (item) {
            return item(arg);
        }, catcher, finallyer));
    };
    if (second) {
        buildCallers(prefix + 'Right', second, null, memo);
    }
    return memo;
};