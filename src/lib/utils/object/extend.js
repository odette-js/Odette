var merge = require('./utils/object/merge');
module.exports = function (args, deep, stack) {
    var length = args && args.length,
        index = 1,
        first = 0,
        base = args[0] || {};
    for (; index < length; index++) {
        merge(base, args[index], deep, stack);
    }
    return base;
};