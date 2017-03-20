module.exports = function whilst(filter, continuation, _memo) {
    var memo = _memo;
    while (filter(memo)) {
        memo = continuation(memo);
    }
    return memo;
};