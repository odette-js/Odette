var isObject = require('./utils/is/object');
var contains = require('./utils/array/contains');
var returnBaseType = require('./utils/returns/base-type');
var mergeWith = require('./utils/object/merge/with');
module.exports = function deepMergeWithCustomizer(o1Val, o2Val, key, o1, o2, stack) {
    var result, garbage;
    if (isObject(o2Val)) {
        if (contains(stack, o2Val)) {
            return o2Val;
        }
        stack.push(o2Val);
        if (!isObject(o1Val)) {
            o1Val = returnBaseType(o2Val);
        }
        result = mergeWith(o1Val, o2Val, deepMergeWithCustomizer, stack);
        garbage = stack.pop();
        return result;
    } else {
        return o2Val;
    }
};