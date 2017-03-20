var isUndefined = require('./utils/is/undefined');
var keyGenerator = require('./utils/array/reduce/key-generator');
module.exports = function reduction(accessor, iteratee, memo_, dir, startsAt1) {
    var value, nextMemo, next, memo = memo_,
        generated = keyGenerator(accessor, dir);
    if (startsAt1) {
        if (isUndefined(next = generated())) {
            return memo;
        } else {
            memo = accessor[next];
        }
    }
    while (!isUndefined(next = generated())) {
        if (!isUndefined(nextMemo = iteratee(memo, accessor[next], next, accessor))) {
            memo = nextMemo;
        }
    }
    return memo;
};