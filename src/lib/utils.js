var garbage, FOR = 'for',
    FIND = 'find',
    FIND_INDEX = FIND + 'Index',
    REG_EXP = 'RegExp',
    factories = {},
    builtCallers = {},
    OBJECT_PROTOTYPE = OBJECT_CONSTRUCTOR[PROTOTYPE],
    nativeKeys = OBJECT_CONSTRUCTOR.keys,
    objectToString = OBJECT_PROTOTYPE.toString,
    ENUM_BUG = !{
        toString: NULL
    }.propertyIsEnumerable(TO_STRING),
    isFinite_ = win.isFinite,
    symbolTag = createToStringResult(SYMBOL),
    isSymbolWrap = isTypeWrap(SYMBOL),
    pathByStringRegExp = /\]\.|\.|\[|\]/igm,
    arrayConcat = ARRAY.concat,
    arrayPush = ARRAY.push,
    MAX_ARRAY_INDEX = Math.pow(2, 53) - 1,
    isArray = ARRAY_CONSTRUCTOR.isArray,
    isFunction = isTypeWrap(FUNCTION),
    isString = isTypeWrap(STRING),
    isNumber = isTypeWrap(NUMBER, notNaN),
    isObject = isTypeWrap(OBJECT, castBoolean),
    isRegExp = isToStringWrap(REG_EXP),
    nonEnumerableProps = toArray('valueOf,isPrototypeOf,propertyIsEnumerable,hasOwnProperty,toLocaleString,' + TO_STRING),
    // Returns the first index on an array-like that passes a predicate test
    returnsEmptyString = returns(''),
    iteratesIn = iterates(allKeys),
    iteratesOwn = iterates(keys),
    findIndex = baseFindIndex,
    findIndexIn = baseFind(iteratesIn, findIndex),
    findIndexOwn = baseFind(iteratesOwn, findIndex),
    findIndexRight = baseFindIndexRight,
    findIndexInRight = baseFind(iteratesIn, findIndexRight),
    findIndexOwnRight = baseFind(iteratesOwn, findIndexRight),
    find = findAccessor(baseFindIndex),
    findIn = baseFind(iteratesIn, find),
    findOwn = baseFind(iteratesOwn, find),
    findRight = findAccessor(baseFindIndexRight),
    findInRight = baseFind(iteratesIn, findRight),
    findOwnRight = baseFind(iteratesOwn, findRight),
    now_offset = dateNow(),
    filterable = negatableFilter(filterCommon(returnsArray, arrayAdd), filterCommon(returnsObject, objectSet), filterCommon(returnsEmptyString, stringConcat)),
    forIn = baseEach(iteratesIn, forEach),
    forOwn = baseEach(iteratesOwn, forEach),
    each = forOwn,
    map = maps(forEach, mapValuesIteratee, returnsArray),
    mapKeys = maps(forOwn, mapKeysIteratee, returnBaseType),
    mapValues = maps(forOwn, mapValuesIteratee, returnBaseType),
    reduce = createReduce(1),
    dropWhile = dropsWhile(filter),
    filter = filterable(reduce),
    filterNegative = filterable(reduce, BOOLEAN_TRUE),
    forInRight = baseEach(iteratesIn, forEachRight),
    forOwnRight = baseEach(iteratesOwn, forEachRight),
    eachRight = forOwnRight,
    mapRight = maps(forEachRight, mapValuesIteratee, returnsArray),
    mapKeysRight = maps(eachRight, mapKeysIteratee, returnBaseType),
    mapValuesRight = maps(forOwnRight, mapValuesIteratee, returnBaseType),
    reduceRight = createReduce(-1),
    dropWhileRight = dropsWhile(filterRight),
    filterRight = filterable(reduceRight),
    filterNegativeRight = filterable(reduceRight, BOOLEAN_TRUE),
    where = convertSecondToIterable(filter),
    whereRight = convertSecondToIterable(filterRight),
    whereNot = convertSecondToIterable(filterNegative),
    whereNotRight = convertSecondToIterable(filterNegativeRight),
    findWhere = convertSecondToIterable(find),
    findWhereRight = convertSecondToIterable(findRight),
    findIndexWhere = convertSecondToIterable(findIndex),
    findIndexWhereRight = convertSecondToIterable(findIndexRight),
    uniqueBy = convertSecondToIterable(uniqueWith);
buildCallers(FOR + 'Each', forEach, forEachRight, builtCallers);
buildCallers(FOR + 'Own', forOwn, forOwnRight, builtCallers);
buildCallers(FOR + 'In', forIn, forInRight, builtCallers);
buildCallers('each', each, eachRight, builtCallers);
buildCallers('map', map, mapRight, builtCallers);
buildCallers('mapValues', mapValues, mapValuesRight, builtCallers);
buildCallers('mapKeys', mapKeys, mapKeysRight, builtCallers);
buildCallers('where', where, whereRight, builtCallers);
buildCallers('whereNot', whereNot, whereNotRight, builtCallers);
buildCallers(FIND, find, findRight, builtCallers);
buildCallers(FIND + 'Own', findOwn, findOwnRight, builtCallers);
buildCallers(FIND + 'In', findOwn, findOwnRight, builtCallers);
buildCallers(FIND_INDEX, findIndex, findIndexRight, builtCallers);
buildCallers(FIND_INDEX + 'Own', findIndexOwn, findIndexOwnRight, builtCallers);
buildCallers(FIND_INDEX + 'In', findIndexIn, findIndexInRight, builtCallers);
buildCallers(FIND + 'Where', findWhere, findWhereRight, builtCallers);
buildCallers(FIND + 'IndexWhere', findIndexWhere, findIndexWhereRight, builtCallers);
buildCallers('reduce', reduce, reduceRight, builtCallers);
buildCallers('filter', filter, filterRight, builtCallers);
buildCallers('filterNegative', filterNegative, filterNegativeRight, builtCallers);
buildCallers('dropWhile', dropWhile, dropWhileRight, builtCallers);
var _performance = window.performance,
    uuidHash = {},
    maths = Math,
    performance = _performance ? (_performance.now = (_performance.now || _performance.webkitNow || _performance.msNow || _performance.oNow || _performance.mozNow || now_shim)) && _performance : {
        now: now_shim
    },
    passes = {
        first: passesFirstArgument,
        second: passesSecondArgument
    },
    baseDataTypes = {
        true: BOOLEAN_TRUE,
        false: BOOLEAN_FALSE,
        null: NULL,
        undefined: UNDEFINED
    },
    _console = win.console || {},
    _log = _console.log || noop,
    console = consolemaker(),
    startsWith = itemIs,
    // make global
    exception = console.exception,
    is = merge(isStrictlyEqual, {
        of: isOf,
        equal: isEqual,
        strictlyEqual: isStrictlyEqual,
        emptyArray: isEmptyArray,
        number: isNumber,
        string: isString,
        object: isObject,
        nan: isNaN,
        int: isInt,
        array: isArray,
        'function': isFunction,
        boolean: isBoolean,
        'null': isNull,
        nil: isNil,
        value: isValue,
        isKey: isKey,
        validInteger: isValidInteger,
        arrayLike: isArrayLike,
        instance: isInstance,
        truthy: castBoolean,
        falsey: negate(castBoolean),
        false: isFalse,
        true: isTrue
    }),
    to = {
        array: toArray,
        'function': toFunction,
        number: toNumber,
        string: toString,
        finite: toFinite,
        integer: toInteger
    },
    /**
     * @static
     * @namespace _
     */
    _ = app._ = merge({
        is: is,
        to: to,
        pI: pI,
        zip: zip,
        has: has,
        now: now,
        // map: map,
        noop: noop,
        bind: bind,
        sort: sort,
        wrap: wrap,
        uuid: uuid,
        keys: keys,
        once: once,
        slice: slice,
        chunk: chunk,
        parse: parse,
        merge: merge,
        isInt: isInt,
        defer: defer,
        clone: clone,
        clamp: clamp,
        flows: flows,
        where: where,
        isNaN: _isNaN,
        whilst: whilst,
        reduce: reduce,
        under1: under1,
        invert: invert,
        extend: extend,
        passes: passes,
        values: values,
        gather: gather,
        toggle: toggle,
        sortBy: sortBy,
        negate: negate,
        unique: unique,
        filter: filter,
        bindTo: bindTo,
        result: result,
        isNull: isNull,
        notNaN: notNaN,
        itemIs: itemIs,
        isEqual: isEqual,
        isArray: isArray,
        flatten: flatten,
        wraptry: wraptry,
        indexOf: indexOf,
        toArray: toArray,
        isEmpty: isEmpty,
        returns: returns,
        allKeys: allKeys,
        console: console,
        uniqueBy: uniqueBy,
        ENUM_BUG: ENUM_BUG,
        whereNot: whereNot,
        evaluate: evaluate,
        validKey: validKey,
        toString: toString,
        throttle: throttle,
        debounce: debounce,
        iterates: iterates,
        bindWith: bindWith,
        mapRight: mapRight,
        isObject: isObject,
        isNumber: isNumber,
        isString: isString,
        baseEach: baseEach,
        toLength: toLength,
        isFinite: _isFinite,
        isBoolean: isBoolean,
        factories: factories,
        cloneJSON: cloneJSON,
        toBoolean: toBoolean,
        stringify: stringify,
        shiftSelf: shiftSelf,
        toInteger: toInteger,
        publicize: publicize,
        startsWith: startsWith,
        isInstance: isInstance,
        indexOfNaN: indexOfNaN,
        toFunction: toFunction,
        uniqueWith: uniqueWith,
        roundFloat: roundFloat,
        isFunction: isFunction,
        difference: difference,
        iteratesIn: iteratesIn,
        lastIndexOf: lastIndexOf,
        iteratesOwn: iteratesOwn,
        withinRange: withinRange,
        castBoolean: castBoolean,
        isUndefined: isUndefined,
        superExtend: superExtend,
        intendedApi: intendedApi,
        isArrayLike: isArrayLike,
        performance: performance,
        unwrapBlock: unwrapBlock,
        BIG_INTEGER: BIG_INTEGER,
        differenceBy: differenceBy,
        smartIndexOf: smartIndexOf,
        consolemaker: consolemaker,
        blockWrapper: blockWrapper,
        isEmptyArray: isEmptyArray,
        parseDecimal: parseDecimal,
        keyGenerator: keyGenerator,
        protoProperty: protoProperty,
        reverseParams: reverseParams,
        // objectToArray: objectToArray,
        sortedIndexOf: sortedIndexOf,
        stringifyQuery: stringifyQuery,
        intendedObject: intendedObject,
        differenceWith: differenceWith,
        lastIndexOfNaN: lastIndexOfNaN,
        arrayLikeToArray: arrayLikeToArray,
        euclideanDistance: euclideanDistance,
        intendedIteration: intendedIteration,
        constructorWrapper: constructorWrapper,
        NEGATIVE_BIG_INTEGER: NEGATIVE_BIG_INTEGER,
        euclideanOriginDistance: euclideanOriginDistance,
        math: merge(wrap(toArray('E,LN2,LN10,LOG2E,LOG10E,PI,SQRT1_2,SQRT2,abs,acos,acosh,asin,asinh,atan,atan2,atanh,cbrt,ceil,clz32,cos,cosh,exp,expm1,floor,fround,hypot,imul,log,log1p,log2,log10,pow,random,round,sign,sin,sinh,sqrt,tan,tanh,trunc'), function (key) {
            return Math[key];
        }), {
            min: mathArray('min'),
            max: mathArray('max')
        })
    }, builtCallers),
    returnsTrue = returns(BOOLEAN_TRUE),
    returnsFalse = returns(BOOLEAN_FALSE),
    returnsNull = returns(NULL);
merge(returns, {
    true: returnsTrue,
    false: returnsFalse,
    null: returnsNull,
    array: returnsArray,
    object: returnsObject,
    self: returnsSelf,
    first: returnsFirstArgument,
    second: returnsSecondArgument
});
app.logWrappedErrors = isBoolean.false = isBoolean.true = BOOLEAN_TRUE;
factories.Extendable = constructorWrapper(Extendable, OBJECT_CONSTRUCTOR);
/**
 * @lends _
 */
function noop() {}

function returnsSelf() {
    return this;
}

function returnsObject() {
    return {};
}

function returnsArray() {
    return [];
}

function returnsFirstArgument(value) {
    return value;
}

function returnsSecondArgument(nil, value) {
    return value;
}

function createToStringResult(string) {
    return BRACKET_OBJECT_SPACE + string + ']';
}

function callObjectToString(item) {
    return objectToString.call(item);
}

function isToStringWrap(string_) {
    var string = createToStringResult(string_);
    return function (item) {
        return isStrictlyEqual(callObjectToString(item), string);
    };
}

function indexOfNaN(array, fromIndex, toIndex, fromRight) {
    if (!array) {
        return -1;
    }
    var other, limit = toIndex || array[LENGTH],
        index = fromIndex + (fromRight ? 0 : -1),
        incrementor = fromRight ? -1 : 1;
    while ((index += incrementor) < limit) {
        other = array[index];
        if (other !== other) {
            return index;
        }
    }
    return -1;
}

function property(string) {
    return function (object) {
        return object[string];
    };
}

function indexOf(array, value, fromIndex, toIndex, fromRight) {
    var index, limit, incrementor;
    if (!array) {
        return -1;
    }
    if (value !== value) {
        return indexOfNaN(array, fromIndex, toIndex, fromRight);
    }
    index = (fromIndex || 0) - 1;
    limit = toIndex || array[LENGTH];
    incrementor = fromRight ? -1 : 1;
    while ((index += incrementor) < limit) {
        if (array[index] === value) {
            return index;
        }
    }
    return -1;
}

function lastIndexOf(a, b, c, d) {
    return indexOf(a, b, c, d, BOOLEAN_TRUE);
}

function lastIndexOfNaN(a, b, c) {
    return indexOfNaN(a, b, c, BOOLEAN_TRUE);
}

function contains(list, item, start, end) {
    return indexOf(list, item, start, end) !== -1;
}

function isNil(item) {
    return isNull(item) || isUndefined(item);
}

function isKey(item) {
    return isNumber(item) || isString(item);
}

function isValue(item) {
    return notNaN(item) && !isNil(item);
}

function sortedIndexOf(list, item, minIndex_, maxIndex_, fromRight) {
    var guess, min = minIndex_ || 0,
        max = maxIndex_ || lastIndex(list),
        bitwise = (max <= TWO_TO_THE_31) ? BOOLEAN_TRUE : BOOLEAN_FALSE;
    if (item !== item) {
        // bitwise does not work for NaN
        return indexOfNaN(list, min, max, fromRight);
    }
    if (bitwise) {
        while (min <= max) {
            guess = (min + max) >> 1;
            if (list[guess] === item) {
                return guess;
            } else {
                if (list[guess] < item) {
                    min = guess + 1;
                } else {
                    max = guess - 1;
                }
            }
        }
    } else {
        while (min <= max) {
            guess = (min + max) / 2 | 0;
            if (list[guess] === item) {
                return guess;
            } else {
                if (list[guess] < item) {
                    min = guess + 1;
                } else {
                    max = guess - 1;
                }
            }
        }
    }
    return -1;
}

function smartIndexOf(array, item, _from, _to, _rtl) {
    return (_from === BOOLEAN_TRUE && array && array[LENGTH] > 100 ? sortedIndexOf : indexOf)(array, item, _from, _to, _rtl);
}

function toString(obj) {
    return obj == NULL ? EMPTY_STRING : obj + EMPTY_STRING;
}

function toObject(argument) {
    return isObject(argument) ? argument : {};
}

function toFunction(argument) {
    return isFunction(argument) ? argument : returns(argument);
}

function castBoolean(item) {
    return !!item;
}

function matches(obj1) {
    return function (obj2) {
        return isMatch(obj2, obj1);
    };
}

function matchesProperty(pair) {
    var key = pair[0],
        value = pair[1];
    return function (item) {
        return item[key] === value;
    };
}

function matchesBinary(assertment, lookingFor) {
    var boolAssertment = !assertment;
    var boolLookingFor = !lookingFor;
    return boolAssertment === boolLookingFor;
}

function stringify(obj) {
    return (isObject(obj) ? JSON.stringify(obj) : isFunction(obj) ? obj.toString() : obj) + EMPTY_STRING;
}

function sort(obj, fn_, reversed) {
    var fn = bindTo(fn_ || function (a, b) {
        return a > b;
    }, obj);
    // normalize sort function handling for safari
    return obj.sort(function (a, b) {
        var result = fn(a, b);
        if (_isNaN(result)) {
            result = INFINITY;
        }
        if (result === BOOLEAN_TRUE) {
            result = 1;
        }
        if (result === BOOLEAN_FALSE) {
            result = -1;
        }
        return reversed ? result * -1 : result;
    });
}
// arg1 is usually a string or number
function sortBy(list, arg1, handler_, reversed) {
    var handler = handler_ || function (obj, arg1) {
        return obj[arg1];
    };
    return sort(list, function (a, b) {
        return handler(a, arg1) > handler(b, arg1);
    }, reversed);
}

function has(obj, prop) {
    return obj && isFunction(obj.hasOwnProperty) ? obj.hasOwnProperty(prop) : BOOLEAN_FALSE;
}

function previousConstructor(instance) {
    return instance && instance[CONSTRUCTOR_KEY] && instance[CONSTRUCTOR_KEY][CONSTRUCTOR] || instance[CONSTRUCTOR];
}

function isInstance(instance, constructor_) {
    var constructor = constructor_;
    if (has(constructor, CONSTRUCTOR)) {
        constructor = constructor[CONSTRUCTOR];
    }
    return isOf(instance, constructor);
}

function itemIs(list, item, index) {
    return list[index || 0] === item;
}

function isFalse(item) {
    return isStrictlyEqual(item, BOOLEAN_FALSE);
}

function isTrue(item) {
    return isStrictlyEqual(item, BOOLEAN_TRUE);
}

function lowerCaseString(item) {
    return item.toLowerCase();
}

function isTypeWrap(type_, fn_) {
    var type = lowerCaseString(type_);
    var fn = fn_ || function () {
        return BOOLEAN_TRUE;
    };
    return function (thing) {
        return typeof thing === type && fn(thing);
    };
}

function _isNaN(thing) {
    return !isStrictlyEqual(thing, thing);
}

function notNaN(thing) {
    return !_isNaN(thing);
}

function isStrictlyEqual(a, b) {
    return a === b;
}

function isOf(instance, constructor) {
    return constructor ? instance instanceof constructor : BOOLEAN_FALSE;
}

function isBoolean(argument) {
    return isStrictlyEqual(argument, BOOLEAN_TRUE) || isStrictlyEqual(argument, BOOLEAN_FALSE);
}

function isInt(num) {
    return num === Math.round(num);
}

function isNull(thing) {
    return isStrictlyEqual(thing, NULL);
}

function isUndefined(thing) {
    return isStrictlyEqual(thing, UNDEFINED);
}

function isDefined(thing) {
    return !isUndefined(thing);
}

function negate(fn) {
    return function (a1, a2, a3, a4, a5, a6) {
        return !fn(a1, a2, a3, a4, a5, a6);
    };
}

function _isFinite(thing) {
    return isNumber(thing) && isFinite_(thing);
}

function isWindow(obj) {
    return castBoolean(obj && isStrictlyEqual(obj, obj[WINDOW]));
}

function isEmpty(obj) {
    return !keys(obj)[LENGTH];
}

function invert(obj) {
    var i = 0,
        result = {},
        objKeys = keys(obj),
        length = objKeys[LENGTH];
    for (; i < length; i++) {
        result[obj[objKeys[i]]] = objKeys[i];
    }
    return result;
}

function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps[LENGTH];
    var constructor = obj[CONSTRUCTOR];
    var proto = (isFunction(constructor) && constructor[PROTOTYPE]) || ObjProto;
    // Constructor is a special case.
    var prop = CONSTRUCTOR;
    if (has(obj, prop) && !contains(keys, prop)) {
        keys.push(prop);
    }
    while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] && !contains(keys, prop)) {
            keys.push(prop);
        }
    }
}

function extend(args, deep, stack) {
    var length = args && args[LENGTH],
        index = 1,
        first = 0,
        base = args[0] || {};
    for (; index < length; index++) {
        merge(base, args[index], deep, stack);
    }
    return base;
}

function returnOrApply(obj_or_fn, context, args) {
    return isFunction(obj_or_fn) ? obj_or_fn.apply(context, args) : obj_or_fn;
}

function superExtend(key, handler) {
    return function () {
        var context = this,
            supertarget = context[CONSTRUCTOR].fn[key],
            args = toArray(arguments);
        return merge(returnOrApply(supertarget, context, args), returnOrApply(handler, context, args), BOOLEAN_TRUE);
    };
}
// merge_count = 0,
function merge(obj1, obj2, deep) {
    var customizer = isBoolean[deep] ? (deep ? deepMergeWithCustomizer : shallowMergeWithCustomizer) : deep ? deep : shallowMergeWithCustomizer;
    return mergeWith(obj1, obj2, customizer);
}

function shallowMergeWithCustomizer(o1Val, o2Val, key, o1, o2, stack) {
    return o2Val;
}

function deepMergeWithCustomizer(o1Val, o2Val, key, o1, o2, stack) {
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
}

function mergeWith(o1, o2, customizer, _stack) {
    var key, o1Val, o2Val, i = 0,
        instanceKeys = keys(o2),
        stack = _stack || [],
        l = instanceKeys[LENGTH];
    for (; i < l; i++) {
        key = instanceKeys[i];
        o1Val = o1[key];
        o2Val = o2[key];
        // ignore undefined
        if (o2[key] !== UNDEFINED && o1Val !== o2Val) {
            o1[key] = customizer(o1Val, o2Val, key, o1, o2, stack);
        }
    }
    return o1;
}

function whilst(filter, continuation, _memo) {
    var memo = _memo;
    while (filter(memo)) {
        memo = continuation(memo);
    }
    return memo;
}
// function countUp(limit, fn) {
//     var start = 0;
//     while (limit > start) {
//         fn(start++);
//     }
// }
// function countDown(number, fn) {
//     while (number >= 0) {
//         fn(--number);
//     }
// }
function chunk(array, size) {
    var length, nu = [];
    if (!array || !(length = array.length)) {
        return nu;
    }
    var final = whilst(function (count) {
        return length > count;
    }, function (count) {
        var upperLimit = clamp(count + size, 0, length);
        nu.push(array.slice(count, upperLimit));
        return upperLimit;
    }, 0);
    return nu;
}

function compact(list) {
    return filter(list, castBoolean);
}

function differentiator(list, comparison, modder, differ) {
    var diffs = [],
        modifier = modder || mod;
    if (!comparison || !(comparisonLength = comparison.length)) {
        return list ? list.slice(0) : diffs;
    }
    forEach(list, function (item, index) {
        if (!differ(modifier(item), modifier(comparison[index]))) {
            diffs.push(item);
        }
    });
    return diffs;
}

function difference(list, comparison) {
    return differentiator(list, comparison, returnsFirstArgument, isEqual);
}

function differenceBy(list, comparison, by) {
    return differentiator(list, comparison, by, isEqual);
}

function differenceWith(list, comparison, comparator) {
    return differentiator(list, comparison, returnsFirstArgument, comparator);
}

function definedAndCall(item, caller) {
    return isUndefined(item) ? item : toFunction(caller)(item);
}

function definedOrCall(item, caller) {
    return isUndefined(item) ? toFunction(caller)(item) : item;
}

function definedOr(item, def) {
    return isUndefined(item) ? item : def;
}

function definedThenCall(item, bool, caller) {
    return matchesBinary(isUndefined(item), bool) ? toFunction(caller)(item) : item;
}

function undefineAndCall(item, caller) {
    return isUndefined(item) ? item : toFunction(caller)(item);
}

function undefinedOrCall(item, caller) {
    return isUndefined(item) ? toFunction(caller)(item) : item;
}

function undefinedOr(item, def) {
    return isUndefined(item) ? def : item;
}

function defaultTo1(n) {
    return undefinedOr(n, 1);
}

function possibleArrayIndex(n) {
    return clamp(n, 0, MAX_ARRAY_INDEX);
}

function slice(array, start, end) {
    return toArray(array, possibleArrayIndex(start), possibleArrayIndex(end));
}

function drop(array, _n) {
    return slice(array, defaultTo1(_n));
}

function dropRight(array, _n) {
    return slice(array, 0, defaultTo1(_n));
}

function toIterable(iteratee) {
    return isFunction(iteratee) ? iteratee : (isArray(iteratee) ? matchesProperty(iteratee) : (isObject(iteratee) ? matches(iteratee) : property(iteratee)));
}

function dropsWhile(filter) {
    return function (array, iteratee) {
        return filter(array, toIterable(iteratee));
    };
}

function zip(lists) {
    return reduce(lists, function (memo, list, listCount) {
        return forEach(memo, function (item, index) {
            var destination;
            if (!(destination = memo[index])) {
                destination = memo[index] = [];
            }
            destination[listCount] = item;
        });
    }, []);
}

function fromPairs(keys) {
    var obj = {};
    forEach(keys, function (key, index) {
        obj[key[0]] = key[1];
    });
    return obj;
}

function iterateOverPath(path, fn, object) {
    var list = path;
    if (!isArray(path)) {
        list = path.exec(pathByStringRegExp);
        list = lastIs(path, ']') ? dropRight(list) : list;
    }
    return find(list, fn, object);
}

function tunnelPath(object, path, step, destination) {
    return iterateOverPath(path, function (memo, key, index, subset) {
        if (index - 1 === subset[LENGTH]) {
            return !destination(memo, key);
        } else {
            return !step(memo, key);
        }
    }, object);
}

function baseSet(path, value, object) {
    iterateOverPath(path, function (memo, key, index) {
        if (index - 1 === subsetLength) {
            memo[key] = value;
            return;
        }
        if (isObject(present = memo[key])) {
            return present;
        }
        return (memo[key] = notNaN(toNumber(key)) ? [] : {});
    }, object);
    return object;
}

function set(path, value, object_) {
    return baseSet(path, value, object_ || {});
}

function access(object, key) {
    return object && object[key];
}

function nth(array, index) {
    var idx;
    return (idx = +index) === -1 ? UNDEFINED : access(array, idx);
}

function lastIndex(array) {
    return access(array, LENGTH) - 1;
}

function first(array) {
    return nth(array, 0);
}

function last(array) {
    return nth(array, lastIndex(array));
}

function nthIs(array, final, index) {
    return isStrictlyEqual(nth(array, index || 0), final);
}

function firstIs(array, final) {
    return nthIs(nthIs, final, 0);
}

function lastIs(array, final) {
    return nthIs(nthIs, final, lastIndex(array));
}

function head(array, n) {
    return slice(array, n);
}

function initial(array) {
    return array ? dropRight(array, lastIndex(array)) : [];
}

function isArrayLike(collection) {
    var length = castBoolean(collection) && collection[LENGTH];
    return isArray(collection) || (isWindow(collection) ? BOOLEAN_FALSE : (isNumber(length) && !isString(collection) && length >= 0 && length <= MAX_ARRAY_INDEX && !isFunction(collection)));
}

function convertSecondToIterable(fn) {
    return function (a, b, c, d, e, f) {
        return fn(a, toIterable(b), c, d, e, f);
    };
}

function iterates(keys) {
    return function (obj, iterator) {
        handler.keys = keys(obj);
        return handler;

        function handler(key, idx, list) {
            // gives you the key, use that to get the value
            return iterator(obj[key], key, obj);
        }
    };
}

function baseEach(iterates, forEach) {
    return function (obj_, iteratee_) {
        var obj = obj_,
            iteratee = iteratee_;
        if (!obj) {
            return obj;
        }
        if (!isArrayLike(obj)) {
            iteratee = iterates(obj, iteratee);
            obj = iteratee.keys;
        }
        return forEach(obj, iteratee);
    };
}

function baseForEach(list, iterator, step) {
    var greaterThanZero, last;
    return (!list || !iterator) ? [] : (last = lastIndex(list)) >= 0 ? baseFromTo(list, iterator, (greaterThanZero = step > 0) ? 0 : last, greaterThanZero ? last : 0, step) : [];
}

function baseForEachEnd(list, iterator, start, stop, step) {
    var greaterThanZero, last;
    return (!list || !iterator) ? [] : (last = lastIndex(list) < 0 ? [] : baseFromToEnd(list, iterator, start === UNDEFINED ? 0 : start, stop === UNDEFINED ? lastIndex(list) : stop, step));
}

function baseFindIndex(values, callback, start, end) {
    return baseForEachEnd(values, callback, start, end, 1);
}

function baseFindIndexRight(values, callback, start, end) {
    return baseForEachEnd(values, callback, start === UNDEFINED ? lastIndex(values) : start, end === UNDEFINED ? 0 : end, -1);
}

function findAccessor(fn) {
    return function (value, callback, index) {
        var foundAt;
        if ((foundAt = fn(obj, predicate, index)) !== UNDEFINED) {
            return obj[foundAt];
        }
    };
}

function baseFind(iterates, forEachEnd) {
    return function (obj_, iteratee_) {
        var obj = obj_,
            iteratee = iteratee_;
        if (!obj) {
            return;
        }
        if (!isArrayLike(obj)) {
            iteratee = iterates(obj, iteratee);
            obj = iteratee.keys;
        }
        return forEachEnd(obj, iteratee);
    };
}

function baseFromToEnd(values, callback, _start, _end, _step) {
    var counter, value, step = _step || 1,
        end = _end,
        start = _start,
        goingDown = start > end,
        index = start,
        limit = ((goingDown ? start - end : end - start) + 1) / Math.abs(step || 1);
    step = goingDown ? (step > 0 ? -step : step) : (step < 0 ? -step : step);
    for (counter = 0; index >= 0 && counter < limit; counter++) {
        if (callback(values[index], index, values)) {
            return index;
        }
        index += step;
    }
}

function findAccessor(fn) {
    return function (obj, predicate, a, b, c) {
        var foundAt = fn(obj, predicate, a, b, c);
        if (foundAt !== UNDEFINED) {
            return obj[foundAt];
        }
    };
}

function validKey(key) {
    // -1 for arrays
    // any other data type ensures string
    return !isStrictlyEqual(key, -1) && isValue(key) && !isBoolean(key);
}

function bind(func, context) {
    return arguments[LENGTH] < 3 ? bindTo(func, context) : bindWith(func, toArray(arguments).slice(1));
}

function bindTo(func, context) {
    return context ? func.bind(context) : func;
}

function bindWith(func, args) {
    return func.bind.apply(func, args);
}

function baseFromTo(values, runner, _start, _end, step) {
    if (!step) {
        return [];
    }
    var goingDown = step < 0,
        end = _end,
        start = _start,
        index = start,
        distance = (goingDown ? start - end : end - start) + 1,
        leftover = distance % 8,
        iterations = parseInt(distance / 8, 10);
    if (leftover > 0) {
        do {
            runner(values[index], index, values);
            index += step;
        } while (--leftover > 0);
    }
    if (iterations) {
        do {
            runner(values[index], index, values);
            index += step;
            runner(values[index], index, values);
            index += step;
            runner(values[index], index, values);
            index += step;
            runner(values[index], index, values);
            index += step;
            runner(values[index], index, values);
            index += step;
            runner(values[index], index, values);
            index += step;
            runner(values[index], index, values);
            index += step;
            runner(values[index], index, values);
            index += step;
        } while (--iterations > 0);
    }
    return values;
}

function forEach(list, iterator) {
    return baseForEach(list, iterator, 1);
}

function forEachRight(list, iterator) {
    return baseForEach(list, iterator, -1);
}

function values(object) {
    var collected = [];
    return forOwn(object, passesFirstArgument(bindTo(arrayPush, collected))) && collected;
}

function toBoolean(thing) {
    var converted = (thing + EMPTY_STRING).trim();
    if (isBoolean[converted] && has(baseDataTypes, converted)) {
        return baseDataTypes[converted];
    }
    return castBoolean(thing);
}

function parseDecimal(num) {
    return parseFloat(num) || 0;
}

function pI(num) {
    return parseInt(num, 10) || 0;
}

function allKeys(obj) {
    var key, keys = [];
    for (key in obj) {
        keys.push(key);
    }
    // Ahem, IE < 9.
    if (ENUM_BUG) {
        collectNonEnumProps(obj, keys);
    }
    return keys;
}

function keys(obj) {
    var key, keys = [];
    if (!obj || (!isObject(obj) && !isFunction(obj))) {
        return keys;
    }
    if (nativeKeys) {
        return nativeKeys(obj);
    }
    for (key in obj) {
        if (has(obj, key)) {
            keys.push(key);
        }
    }
    // Ahem, IE < 9.
    if (ENUM_BUG) {
        collectNonEnumProps(obj, keys);
    }
    return keys;
}

function constructorExtend(name, protoProps) {
    var nameString, constructorKeyName, child, passedParent, hasConstructor, constructor, parent = this,
        nameIsStr = isString(name);
    if (name === BOOLEAN_FALSE) {
        merge(parent[PROTOTYPE], protoProps);
        return parent;
    }
    if (!nameIsStr) {
        protoProps = name;
    }
    hasConstructor = has(protoProps, CONSTRUCTOR);
    if (protoProps && hasConstructor) {
        child = protoProps[CONSTRUCTOR];
    }
    if (nameIsStr) {
        passedParent = parent;
        if (child) {
            passedParent = child;
        }
        child = new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('parent', 'return function ' + name + '(){return parent.apply(this,arguments);}')(passedParent);
    } else {
        child = child || new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('parent', 'return ' + parent.toString())(parent);
    }
    child[EXTEND] = constructorExtend;
    var Surrogate = function () {
        this[CONSTRUCTOR] = child;
    };
    Surrogate[PROTOTYPE] = parent[PROTOTYPE];
    child[PROTOTYPE] = new Surrogate;
    // don't call the function if nothing exists
    if (protoProps) {
        merge(child[PROTOTYPE], protoProps);
    }
    constructorKeyName = CONSTRUCTOR + COLON + name;
    if (nameIsStr) {
        if (child[PROTOTYPE][constructorKeyName]) {
            exception(CONSTRUCTOR + 's with names cannot extend constructors with the same name');
        } else {
            child[PROTOTYPE][constructorKeyName] = child;
        }
    }
    constructor = child;
    child = constructorWrapper(constructor, parent);
    constructor[PROTOTYPE][CONSTRUCTOR_KEY] = child;
    return child;
}

function factory(name, func_) {
    var func = func_ ? func_ : name;
    var extensor = {
        constructor: function () {
            return func.apply(this.super.apply(this, arguments), arguments);
        }
    };
    return this.extend.apply(this, func === func_ ? [name, extensor] : [extensor]);
}

function constructorWrapper(Constructor, parent) {
    var __ = function (one, two, three, four, five, six) {
        return isValue(one) && isOf(one, Constructor) ? one : new Constructor(one, two, three, four, five, six);
    };
    __.isInstance = Constructor.isInstance = function (instance) {
        return isInstance(instance, Constructor);
    };
    __.factory = Constructor.factory = factory;
    __.fn = Constructor.fn = Constructor[PROTOTYPE].fn = Constructor[PROTOTYPE];
    __[CONSTRUCTOR] = Constructor;
    __[EXTEND] = Constructor[EXTEND] = bind(constructorExtend, Constructor);
    if (parent) {
        __.super = Constructor.super = Constructor[PROTOTYPE].super = parent;
    }
    return __;
}

function once(fn) {
    var doIt = BOOLEAN_TRUE;
    return function () {
        if (doIt) {
            doIt = BOOLEAN_FALSE;
            return fn.apply(this, arguments);
        }
    };
}
// Internal recursive comparison function for `isEqual`.
function eq(a, b, aStack, bStack) {
    var className, areArrays, aCtor, bCtor, length, objKeys, key, aNumber, bNumber;
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) {
        return a !== 0 || 1 / a === 1 / b;
    }
    // A strict comparison is necessary because `NULL == undefined`.
    if (a === NULL || a === UNDEFINED || b === UNDEFINED || b === NULL) {
        return a === b;
    }
    // Unwrap any wrapped objects.
    // if (a instanceof _) a = a._wrapped;
    // if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    className = objectToString.call(a);
    if (className !== objectToString.call(b)) {
        return BOOLEAN_FALSE;
    }
    switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case createToStringResult(REG_EXP):
        // RegExps are coerced to strings for comparison (Note: EMPTY_STRING + /a/i === '/a/i')
    case createToStringResult(STRING):
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return EMPTY_STRING + a === EMPTY_STRING + b;
    case createToStringResult(NUMBER):
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        aNumber = toNumber(a);
        bNumber = toNumber(b);
        if (aNumber !== aNumber) {
            return bNumber !== bNumber;
        }
        // An `egal` comparison is performed for other numeric values.
        return aNumber === 0 ? 1 / aNumber === 1 / b : aNumber === bNumber;
    case BRACKET_OBJECT_SPACE + 'Date]':
    case BRACKET_OBJECT_SPACE + 'Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return toNumber(a) === toNumber(b);
    }
    areArrays = className === BRACKET_OBJECT_SPACE + 'Array]';
    if (!areArrays) {
        if (!isObject(a) || !isObject(b)) {
            return BOOLEAN_FALSE;
        }
        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        aCtor = a[CONSTRUCTOR];
        bCtor = b[CONSTRUCTOR];
        if (aCtor !== bCtor && !(isFunction(aCtor) && (aCtor instanceof aCtor) && isFunction(bCtor) && (bCtor instanceof bCtor)) && (CONSTRUCTOR in a && CONSTRUCTOR in b)) {
            return BOOLEAN_FALSE;
        }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    // aStack = aStack || [];
    // bStack = bStack || [];
    length = aStack[LENGTH];
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) {
            return bStack[length] === b;
        }
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    // Recursively compare objects and arrays.
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a[LENGTH];
        if (length !== b[LENGTH]) {
            return BOOLEAN_FALSE;
        }
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
            if (!eq(a[length], b[length], aStack, bStack)) {
                return BOOLEAN_FALSE;
            }
        }
    } else {
        // Deep compare objects.
        objKeys = keys(a);
        length = objKeys[LENGTH];
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (keys(b)[LENGTH] !== length) return BOOLEAN_FALSE;
        while (length--) {
            // Deep compare each member
            key = objKeys[length];
            if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return BOOLEAN_FALSE;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return BOOLEAN_TRUE;
}

function isEqual(a, b) {
    return eq(a, b, [], []);
}

function clone(obj) {
    return mapValues(obj, function (value) {
        return value;
    });
}

function cloneJSON(obj) {
    return parse(stringify(obj));
}

function wrap(obj, fn, noExecute) {
    var newObj = {},
        _isArray = isArray(obj),
        wasfunction = isFunction(fn);
    forOwn(obj, function (value, key) {
        if (_isArray) {
            if (!wasfunction || noExecute) {
                newObj[value] = fn;
            } else {
                newObj[value] = fn(value, key);
            }
        } else {
            newObj[key] = fn(obj[key], key);
        }
    });
    return newObj;
}

function publicize(obj) {
    return merge(_, obj);
}

function passesFirstArgument(fn) {
    return function (first) {
        return fn(first);
    };
}

function passesSecondArgument(fn) {
    return function (nil, second) {
        return fn(second);
    };
}

function concat(list) {
    return arrayConcat.apply([], map(list, passesFirstArgument(toArray)));
}

function concatUnique(list) {
    return reduce(list, function (memo, argument) {
        return reduce(argument, function (memo, item) {
            if (indexOf(memo, item) === -1) {
                memo.push(item);
            }
        }, memo);
    }, []);
}

function cycle(arr, num_) {
    var length = arr[LENGTH],
        num = num_ % length,
        piece = arr.splice(num);
    arr.unshift.apply(arr, piece);
    return arr;
}

function uncycle(array, num_) {
    var length = array[LENGTH],
        num = num_ % length,
        piece = array.splice(0, length - num);
    arrayPush.apply(array, piece);
    return array;
}

function isMatch(object, attrs) {
    var key, i = 0,
        keysResult = keys(attrs),
        obj = toObject(object);
    return !find(keysResult, function (key) {
        return !isStrictlyEqual(attrs[key], obj[key]);
    });
}

function arrayAdd(array, item) {
    array.push(item);
}

function objectSet(object, item, key) {
    object[key] = item;
}

function stringConcat(base, string) {
    return base.concat(string);
}

function join(array, delimiter) {
    return toArray(array).join(undefinedOr(delimiter, COMMA));
}

function split(string, delimiter) {
    return toString(string).split(undefinedOr(delimiter, EMPTY_STRING));
}

function filterCommon(memo, passed) {
    return function (thing, bound, negated, reduction) {
        var negative = !negated;
        return reduction(thing, function (memo, item, index, list) {
            if (matchesBinary(bound(item, index, list), negative)) {
                passed(memo, item, index);
            }
        }, memo());
    };
}

function negatableFilter(array, object, string) {
    return function (reduction, negation) {
        return function (thing, iteratee) {
            return (isArrayLike(thing) ? array : (isObject(thing) ? object : string))(thing, iteratee, negation, reduction);
        };
    };
}

function uniqueWith(list, comparator) {
    if (!isArrayLike(list)) {
        // can't do something that is not an array like
        return list;
    }
    return filter(list, function (a, index, list) {
        if (list[LENGTH] - 1 === index) {
            return BOOLEAN_TRUE;
        }
        return findIndex(list, function (b) {
            return comparator(a, b);
        }, index + 1) === UNDEFINED;
    });
}

function unique(list) {
    return uniqueWith(list, isEqual);
}

function couldBeJSON(string) {
    var firstVal = first(string);
    var lastVal = last(string);
    return (isStrictlyEqual(firstVal, '{') && isStrictlyEqual(lastVal, '}')) || (isStrictlyEqual(firstVal, '[') && isStrictlyEqual(lastVal, ']'));
}

function parse(val_) {
    var valTrimmed, valLength, coerced, val = val_;
    if (!isString(val)) {
        // already parsed
        return val;
    }
    val = valTrimmed = val.trim();
    valLength = val[LENGTH];
    if (!valLength) {
        return val;
    }
    if (couldBeJSON(val)) {
        if ((val = wraptry(function () {
                return JSON.parse(val);
            }, function () {
                return val;
            })) !== valTrimmed) {
            return val;
        }
    }
    coerced = toNumber(val);
    if (!_isNaN(coerced)) {
        return coerced;
    }
    if (has(baseDataTypes, val)) {
        return baseDataTypes[val];
    }
    if (val.slice(0, 8) === 'function') {
        return new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('return ' + val)();
    }
    return val;
}

function unwrapBlock(string_) {
    var string = string_.toString(),
        split = string.split('{'),
        first = split[0],
        fTrimmed = first && first.trim();
    if (fTrimmed.slice(0, 8) === 'function') {
        string = split.shift();
        return (string = split.join('{')).slice(0, lastIndex(string));
    }
    return split.join('{');
}

function blockWrapper(block, context) {
    return 'with(' + (context || 'this') + '){\n' + block + '\n}';
}

function evaluate(context, string_, args) {
    var string = string_;
    if (isFunction(string_)) {
        string = unwrapBlock(string_);
    }
    // use a function constructor to get around strict mode
    var fn = new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('string', blockWrapper('\teval("(function (){"+string+"}());");'));
    fn.call(context, '"use strict";\n' + string);
}

function returnBaseType(obj) {
    return !isObject(obj) || isArrayLike(obj) ? [] : {};
}

function isEmptyArray(array) {
    return array && array.length === 0;
}

function mapValuesIteratee(collection, bound, empty) {
    return empty ? function (item, index, objs) {
        arrayAdd(collection, bound(item, index, objs));
    } : function (item, key, objs) {
        objectSet(collection, bound(item, key, objs), key);
    };
}

function maps(iterator, iterable, returnBaseType) {
    return function (objs, iteratee) {
        var collection = returnBaseType(objs),
            iterates = isString(iteratee) ? whenString(iteratee) : iteratee;
        if (objs) {
            iterator(objs, iterable(collection, iterates, isEmptyArray(collection)));
        }
        return collection;
    };

    function whenString(iteratee) {
        return function (item) {
            return item[iteratee];
        };
    }
}

function mapKeysIteratee(collection, bound) {
    return function (item, index, objs) {
        objectSet(collection, item, bound(item, key, objs));
    };
}

function arrayLikeToArray(arrayLike) {
    return arrayLike[LENGTH] === 1 ? [arrayLike[0]] : ARRAY_CONSTRUCTOR.apply(NULL, arrayLike);
}
// function objectToArray(obj) {
//     return !obj ? [] : reduce(obj, function (memo, item) {
//         memo.push(item);
//     }, []);
// }
function toArray(object, delimiter) {
    return isArrayLike(object) ? (isArray(object) ? object : arrayLikeToArray(object)) : (isString(object) ? object.split(isString(delimiter) ? delimiter : COMMA) : [object]);
}

function toString(argument) {
    return argument ? argument.toString() : ('' + argument);
}

function flattens(list, next) {
    return reduce(list, function (memo, item) {
        if (isArrayLike(item)) {
            return memo.concat(next(item));
        } else {
            memo.push(item);
            return memo;
        }
    }, []);
}

function flatten(list) {
    return flattens(list, returnsFirstArgument);
}

function flattenDeep(list) {
    return flattens(list, flattens);
}

function flattenSelectively(list, next) {
    return flattens(list, toFunction(next));
}

function flattenDepth(list, depth_) {
    var depth = defaultTo1(depth_);
    return flatten(list, function (item) {
        var result;
        if (--depth) {
            result = flattenDepth(item, depth);
        }
        ++depth;
        return result;
    });
}

function gather(list, handler) {
    return concat(map(list, handler));
}

function clamp(number, lower, upper) {
    return number !== number ? number : (number < lower ? lower : (number > upper ? upper : number));
}

function withinRange(number, min, max) {
    return number === clamp(number, min, max);
}

function safeInteger(number_) {
    return clamp(number_, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER);
}

function isValidInteger(number) {
    return withinRange(number, -MAX_INTEGER, MAX_INTEGER);
}

function floatToInteger(value) {
    var remainder = value % 1;
    return value === value ? (remainder ? value - remainder : value) : 0;
}

function toNumber(argument) {
    return +argument;
}

function toFinite(value) {
    var sign;
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}

function toInteger(number, notSafe) {
    var converted;
    return floatToInteger((converted = toNumber(number)) == number ? (notSafe ? converted : safeInteger(converted)) : 0);
}

function under1(number) {
    return number > 1 ? 1 / number : number;
}

function toLength(number) {
    return number ? clamp(toInteger(number, BOOLEAN_TRUE), 0, MAX_ARRAY_LENGTH) : 0;
}

function dateNow() {
    return toNumber(new Date());
}

function now_shim() {
    return dateNow() - now_offset;
}

function now() {
    return performance.now();
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments,
            callNow = immediate && !timeout,
            later = function () {
                timeout = NULL;
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
}

function throttle(fn, threshold, scope) {
    var last,
        deferTimer;
    if (!threshold) {
        threshold = 250;
    }
    return function () {
        var context = scope || this,
            _now = now(),
            args = arguments;
        if (last && _now < last + threshold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = _now;
                fn.apply(context, args);
            }, threshold);
        } else {
            last = _now;
            fn.apply(context, args);
        }
    };
}

function defer(fn, time, context) {
    var id;
    return function () {
        var context = context || this,
            args = toArray(arguments);
        clearTimeout(id);
        id = setTimeout(function () {
            fn.apply(context, args);
        });
        return id;
    };
}

function stringifyQuery(obj) {
    var val, n, base = obj.url,
        query = [];
    if (isObject(obj)) {
        forOwn(obj.query, function (val, n) {
            if (val !== UNDEFINED) {
                val = encodeURIComponent(stringify(val));
                query.push(n + '=' + val);
            }
        });
        if (query[LENGTH]) {
            base += '?';
        }
        base += query.join('&');
        if (obj.hash) {
            obj.hash = isObject(obj.hash) ? encodeURI(stringify(obj.hash)) : hash;
            base += ('#' + obj.hash);
        }
    } else {
        base = obj;
    }
    return base;
}

function protoProperty(instance, key, farDown) {
    var val, proto, constructor = previousConstructor(instance);
    farDown = farDown || 1;
    do {
        proto = constructor[PROTOTYPE];
        val = proto[key];
        constructor = previousConstructor(proto);
    } while (--farDown > 0 && constructor && _isFinite(farDown));
    return val;
}

function _uuid(idx) {
    var cryptoCheck = 'crypto' in win && 'getRandomValues' in crypto,
        sid = ('xxxxxxxx-xxxx-' + idx + 'xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
            var rnd, r, v;
            if (cryptoCheck) {
                rnd = win.crypto.getRandomValues(new Uint32Array(1));
                if (rnd === UNDEFINED) {
                    cryptoCheck = BOOLEAN_FALSE;
                }
            }
            if (!cryptoCheck) {
                rnd = [Math.floor(Math.random() * 10e12)];
            }
            rnd = rnd[0];
            r = rnd % 16;
            v = (c === 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    // if crypto check passes, you can trust the browser
    return uuidHash[sid] ? _uuid(idx + 1) : (uuidHash[sid] = BOOLEAN_TRUE) && sid;
}

function uuid() {
    return _uuid(4);
}

function intendedApi(fn) {
    return function (one, two) {
        intendedObject(one, two, bindTo(fn, this));
        return this;
    };
}

function intendedIteration(key, value, iterator) {
    var keysResult, isObjectResult = isObject(key);
    if (isObjectResult) {
        keysResult = keys(key);
    }
    return function (one, two, three, four, five, six) {
        if (isObjectResult) {
            forEach(keysResult, function (key_) {
                iterator(key_, key[key_], one, two, three, four, five, six);
            });
        } else {
            iterator(key, value, one, two, three, four, five, six);
        }
    };
}

function intendedObject(key, value, fn) {
    var obj;
    if (isArray(key)) {
        forEach(key, function (first) {
            fn(first, value);
        });
    } else {
        if ((obj = isObject(key) ? key : BOOLEAN_FALSE)) {
            forOwn(obj, reverseParams(fn));
        } else {
            fn(key, value);
        }
    }
}

function reverseParams(iteratorFn) {
    return function (value, key, third) {
        return iteratorFn(key, value, third);
    };
}

function roundFloat(val, power, base) {
    var mult;
    if (!isNumber(power)) {
        power = 1;
    }
    mult = Math.pow(base || 10, power);
    return (parseInt(mult * val, 10) / mult);
}

function callMethod(isStr, method, context, argument) {
    return isStr ? obj[method](argument) : method.call(context, argument);
}

function result(obj, str, arg) {
    return obj == NULL ? obj : (isFunction(obj[str]) ? obj[str](arg) : (isObject(obj) ? obj[str] : obj));
}

function doTry(fn, catcher, finallyer) {
    return function (item) {
        return wraptry(function () {
            return fn(item);
        }, catcher, finallyer);
    };
}

function buildCallerKeys(prefix) {
    return keys(buildCallers(prefix, noop, noop));
}

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
    merge(builtCallers, memo);
    if (second) {
        buildCallers(prefix + 'Right', second);
    }
    return memo;
}

function results(array, method, arg) {
    return map(array, function (item) {
        return result(item, method, arg);
    });
}

function shiftSelf(fn) {
    return function (one, two, three, four, five, six) {
        return fn(this, one, two, three, four, five, six);
    };
}

function mathArray(method) {
    return function (args) {
        return maths[method].apply(maths, args);
    };
}
// Create a reducing function iterating left or right.
function reduceIterator(obj, iteratee, memo, dir, keys, length) {
    var nextMemo, currentKey, index = dir > 0 ? 0 : length - 1;
    for (; index >= 0 && index < length; index += dir) {
        currentKey = keys ? keys[index] : index;
        nextMemo = iteratee(memo, obj[currentKey], currentKey, obj);
        if (nextMemo !== UNDEFINED) {
            memo = nextMemo;
        }
    }
    return memo;
}

function greaterThanZero(number) {
    return 0 > number;
}

function arrayKeyGenerator(array, dir_, cap_, incrementor_, transformer_) {
    var previous, dir = dir_ || 1,
        length = array[LENGTH],
        counter = dir > 0 ? -1 : length,
        transformer = transformer_ || returnsFirstArgument,
        cap = cap_ || (counter < 0 ? function (counter) {
            return counter >= length;
        } : greaterThanZero),
        incrementor = incrementor_ || returnsSecondArgument;
    return function (fn) {
        counter += dir;
        if (cap(counter)) {
            return;
        }
        return transformer(previous = incrementor(previous, counter, array));
    };
}

function objectKeyGenerator(object, dir, cap, incrementor) {
    var objectKeys = keys(object);
    return arrayKeyGenerator(objectKeys, dir, cap, incrementor, proxy);

    function proxy(value) {
        return objectKeys[value];
    }
}

function keyGenerator(object, dir, cap, incrementor) {
    return isArrayLike(object) ? arrayKeyGenerator(object, dir, cap, incrementor) : (isObject(object) ? objectKeyGenerator(object, dir, cap, incrementor) : noop);
}

function reduction(accessor, iteratee, memo_, dir, startsAt1) {
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
}

function createReduce(dir_) {
    return function (obj, iteratee, memo) {
        return reduction(obj, iteratee, memo, dir_, arguments[LENGTH] < 3);
    };
}

function consolemaker(canTrace) {
    // use same name so that we can ensure browser compatability
    return merge(wrap(toArray('trace,warn,log,dir,error,clear,table,profile,profileEnd,time,timeEnd,timeStamp'), function (key) {
        var method = _console[key] || _log;
        return function () {
            var consoled = method && method.apply && method.apply(_console, arguments);
            if (key !== 'trace' && key !== 'error' && _console.trace && canTrace) {
                _console.trace();
            }
        };
    }), {
        exception: function (msg) {
            throw new Error(msg);
        },
        assert: function (boolean_, options) {
            if (!boolean_) {
                exception(options);
            }
        }
    });
}
// mitigate
function wraptry(trythis, errthat, finalfunction) {
    var returnValue, err = NULL;
    try {
        returnValue = trythis();
    } catch (e) {
        err = e;
        if (app.logWrappedErrors) {
            console.error(e);
        }
        returnValue = errthat ? errthat(e, returnValue) : returnValue;
    } finally {
        returnValue = finalfunction ? finalfunction(err, returnValue) : returnValue;
    }
    return returnValue;
}
// directed toggle
function toggle(current, which) {
    if (isUndefined(which)) {
        return !current;
    } else {
        return castBoolean(which);
    }
}

function euclideanDistance(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2;
    return Math.sqrt((a * a) + (b * b));
}

function euclideanOriginDistance(x, y) {
    return euclideanDistance(0, 0, x, y);
}

function returns(thing) {
    return function () {
        return thing;
    };
}

function flows(fromHere, toHere) {
    var toIsString = isString(toHere),
        fromIsString = isString(fromHere);
    return function (arg) {
        return callMethod(toIsString, toHere, this, callMethod(fromIsString, fromHere, this, arg));
    };
}
/**
 * @class Extendable
 * @private
 */
function Extendable() {
    return this;
}