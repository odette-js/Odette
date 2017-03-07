var isUndefined = require('./utils/is/undefined');
var keys = require('./utils/keys');
module.exports = function (o1, o2, customizer, _stack) {
    var key, o1Val, o2Val, i = 0,
        instanceKeys = keys(o2),
        stack = _stack || [],
        l = instanceKeys[LENGTH];
    for (; i < l; i++) {
        key = instanceKeys[i];
        o1Val = o1[key];
        o2Val = o2[key];
        // ignore undefined
        if (!isUndefined(o2[key]) && !isStrictlyEqual(o1Val, o2Val)) {
            o1[key] = customizer(o1Val, o2Val, key, o1, o2, stack);
        }
    }
    return o1;
};