// var REG_EXP = 'RegExp';
var CONSTRUCTOR = 'constructor';
var keys = require('./utils/object/keys');
var objectToString = require('./utils/function/object-to-string');
var is0 = require('./utils/is/0');
var isOf = require('./utils/is/of');
var isNil = require('./utils/is/nil');
var toNumber = require('./utils/to/number');
var createToStringResult = require('./utils/to/string-result');
var isStrictlyEqual = require('./utils/is/strictly-equal');
var isObject = require('./utils/is/object');
var has = require('./utils/object/has');
// Internal recursive comparison function for `isEqual`
module.exports = eq;

function eq(a, b, aStack, bStack) {
    var className, areArrays, aCtor, bCtor, length, objKeys, key, aNumber, bNumber;
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (isStrictlyEqual(a, b)) {
        return !isStrictlyEqual(a, 0) || isStrictlyEqual(1 / a, 1 / b);
    }
    // A strict comparison is necessary because `NULL == undefined`.
    if (isNil(a) || isNil(b)) {
        return isStrictlyEqual(a, b);
    }
    // Unwrap any wrapped objects.
    // if (a instanceof _) a = a._wrapped;
    // if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    className = objectToString(a);
    if (!isStrictlyEqual(className, objectToString(b))) {
        return false;
    }
    switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case createToStringResult('RegExp'):
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case createToStringResult('String'):
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return isStrictlyEqual('' + a, '' + b);
    case createToStringResult('Number'):
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        aNumber = toNumber(a);
        bNumber = toNumber(b);
        if (aNumber !== aNumber) {
            return bNumber !== bNumber;
        }
        // An `egal` comparison is performed for other numeric values.
        return is0(aNumber) ? isStrictlyEqual(1 / aNumber, 1 / b) : isStrictlyEqual(aNumber, bNumber);
    case createToStringResult('Date'):
    case createToStringResult('Boolean'):
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return isStrictlyEqual(toNumber(a), toNumber(b));
    }
    areArrays = isStrictlyEqual(className, createToStringResult('Array'));
    if (!areArrays) {
        if (!isObject(a) || !isObject(b)) {
            return false;
        }
        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        aCtor = a[CONSTRUCTOR];
        bCtor = b[CONSTRUCTOR];
        if (aCtor !== bCtor && !(isFunction(aCtor) && isOf(aCtor, aCtor) && isFunction(bCtor) && isOf(bCtor, bCtor)) && (CONSTRUCTOR in a && CONSTRUCTOR in b)) {
            return false;
        }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    // aStack = aStack || [];
    // bStack = bStack || [];
    length = aStack.length;
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (isStrictlyEqual(aStack[length], a)) {
            return isStrictlyEqual(bStack[length], b);
        }
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    // Recursively compare objects and arrays.
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length) {
            return false;
        }
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
            if (!eq(a[length], b[length], aStack, bStack)) {
                return false;
            }
        }
    } else {
        // Deep compare objects.
        objKeys = keys(a);
        length = objKeys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (!isStrictlyEqual(keys(b).length, length)) return false;
        while (length--) {
            // Deep compare each member
            key = objKeys[length];
            if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
}
// // Internal recursive comparison function for `isEqual`.
// function eq(a, b, aStack, bStack) {
//     var className, areArrays, aCtor, bCtor, length, objKeys, key, aNumber, bNumber;
//     // Identical objects are equal. `0 === -0`, but they aren't identical.
//     // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
//     if (a === b) {
//         return a !== 0 || 1 / a === 1 / b;
//     }
//     // A strict comparison is necessary because `NULL == undefined`.
//     if (a === NULL || a === UNDEFINED || b === UNDEFINED || b === NULL) {
//         return a === b;
//     }
//     // Unwrap any wrapped objects.
//     // if (a instanceof _) a = a._wrapped;
//     // if (b instanceof _) b = b._wrapped;
//     // Compare `[[Class]]` names.
//     className = objectToString.call(a);
//     if (className !== objectToString.call(b)) {
//         return BOOLEAN_FALSE;
//     }
//     switch (className) {
//         // Strings, numbers, regular expressions, dates, and booleans are compared by value.
//     case createToStringResult(REG_EXP):
//         // RegExps are coerced to strings for comparison (Note: EMPTY_STRING + /a/i === '/a/i')
//     case createToStringResult(STRING):
//         // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
//         // equivalent to `new String("5")`.
//         return EMPTY_STRING + a === EMPTY_STRING + b;
//     case createToStringResult(NUMBER):
//         // `NaN`s are equivalent, but non-reflexive.
//         // Object(NaN) is equivalent to NaN
//         aNumber = toNumber(a);
//         bNumber = toNumber(b);
//         if (aNumber !== aNumber) {
//             return bNumber !== bNumber;
//         }
//         // An `egal` comparison is performed for other numeric values.
//         return aNumber === 0 ? 1 / aNumber === 1 / b : aNumber === bNumber;
//     case BRACKET_OBJECT_SPACE + 'Date]':
//     case BRACKET_OBJECT_SPACE + 'Boolean]':
//         // Coerce dates and booleans to numeric primitive values. Dates are compared by their
//         // millisecond representations. Note that invalid dates with millisecond representations
//         // of `NaN` are not equivalent.
//         return toNumber(a) === toNumber(b);
//     }
//     areArrays = className === BRACKET_OBJECT_SPACE + 'Array]';
//     if (!areArrays) {
//         if (!isObject(a) || !isObject(b)) {
//             return BOOLEAN_FALSE;
//         }
//         // Objects with different constructors are not equivalent, but `Object`s or `Array`s
//         // from different frames are.
//         aCtor = a[CONSTRUCTOR];
//         bCtor = b[CONSTRUCTOR];
//         if (aCtor !== bCtor && !(isFunction(aCtor) && (aCtor instanceof aCtor) && isFunction(bCtor) && (bCtor instanceof bCtor)) && (CONSTRUCTOR in a && CONSTRUCTOR in b)) {
//             return BOOLEAN_FALSE;
//         }
//     }
//     // Assume equality for cyclic structures. The algorithm for detecting cyclic
//     // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
//     // Initializing stack of traversed objects.
//     // It's done here since we only need them for objects and arrays comparison.
//     // aStack = aStack || [];
//     // bStack = bStack || [];
//     length = aStack[LENGTH];
//     while (length--) {
//         // Linear search. Performance is inversely proportional to the number of
//         // unique nested structures.
//         if (aStack[length] === a) {
//             return bStack[length] === b;
//         }
//     }
//     // Add the first object to the stack of traversed objects.
//     aStack.push(a);
//     bStack.push(b);
//     // Recursively compare objects and arrays.
//     if (areArrays) {
//         // Compare array lengths to determine if a deep comparison is necessary.
//         length = a[LENGTH];
//         if (length !== b[LENGTH]) {
//             return BOOLEAN_FALSE;
//         }
//         // Deep compare the contents, ignoring non-numeric properties.
//         while (length--) {
//             if (!eq(a[length], b[length], aStack, bStack)) {
//                 return BOOLEAN_FALSE;
//             }
//         }
//     } else {
//         // Deep compare objects.
//         objKeys = keys(a);
//         length = objKeys[LENGTH];
//         // Ensure that both objects contain the same number of properties before comparing deep equality.
//         if (keys(b)[LENGTH] !== length) return BOOLEAN_FALSE;
//         while (length--) {
//             // Deep compare each member
//             key = objKeys[length];
//             if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return BOOLEAN_FALSE;
//         }
//     }
//     // Remove the first object from the stack of traversed objects.
//     aStack.pop();
//     bStack.pop();
//     return BOOLEAN_TRUE;
// }