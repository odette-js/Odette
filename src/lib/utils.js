var garbage, factories = {},
    builtCallers = {},
    nativeKeys = OBJECT_CONSTRUCTOR.keys,
    objectToString = OBJECT_CONSTRUCTOR[PROTOTYPE].toString,
    hasEnumBug = !{
        toString: NULL
    }.propertyIsEnumerable(TO_STRING),
    isFinite_ = win.isFinite,
    arrayConcat = [].concat,
    MAX_ARRAY_INDEX = Math.pow(2, 53) - 1,
    isArray = ARRAY_CONSTRUCTOR.isArray,
    isFunction = isWrap(FUNCTION),
    isString = isWrap(STRING),
    isNumber = isWrap(NUMBER, notNaN),
    nonEnumerableProps = toArray('valueOf,isPrototypeOf,' + TO_STRING + ',propertyIsEnumerable,hasOwnProperty,toLocaleString'),
    isObject = isWrap(OBJECT, function (thing) {
        return !!thing;
    }),
    // Returns the first index on an array-like that passes a predicate test
    findIndex = createPredicateIndexFinder(1),
    findIndexRight = createPredicateIndexFinder(-1),
    find = findAccessor(findIndex),
    findRight = findAccessor(findIndexRight),
    now_offset = dateNow(),
    forIn = eachProxy(forEach, allKeys),
    forOwn = eachProxy(forEach, keys),
    each = forOwn,
    map = maps(forEach, mapValuesIteratee, returnsArray),
    mapValues = maps(forOwn, mapValuesIteratee, returnBaseType),
    mapKeys = maps(forOwn, mapKeysIteratee, returnBaseType),
    reduce = createReduce(1),
    forEachRight = tackRight(forEach),
    forOwnRight = tackRight(forOwn),
    forInRight = tackRight(forIn),
    eachRight = forOwnRight,
    mapRight = maps(forEachRight, mapValuesIteratee, returnsArray),
    mapValuesRight = maps(forOwnRight, mapValuesIteratee, returnBaseType),
    mapKeysRight = maps(eachRight, mapKeysIteratee, returnBaseType),
    reduceRight = createReduce(-1),
    garbage = buildCallers('forEach', forEach, forEachRight),
    garbage = buildCallers('forOwn', forOwn, forOwnRight),
    garbage = buildCallers('forIn', forIn, forInRight),
    garbage = buildCallers('each', each, eachRight),
    garbage = buildCallers('map', map, mapRight),
    garbage = buildCallers('mapValues', mapValues, mapValuesRight),
    garbage = buildCallers('mapKeys', mapKeys, mapKeysRight),
    garbage = buildCallers('find', find, findRight),
    garbage = buildCallers('findIndex', findIndex, findIndexRight),
    garbage = buildCallers('filter', filter),
    garbage = buildCallers('filterNegative', filterNegative),
    garbage = buildCallers('reduce', reduce, reduceRight),
    _performance = window.performance,
    uuidHash = {},
    maths = Math,
    performance = _performance ? (_performance.now = (_performance.now || _performance.webkitNow || _performance.msNow || _performance.oNow || _performance.mozNow || now_shim)) && _performance : {
        now: now_shim
    },
    passes = {
        first: passesFirstArgument
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
    is = {
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
        length: isLength,
        validInteger: isValidInteger,
        arrayLike: isArrayLike,
        instance: isInstance
    },
    to = {
        array: toArray,
        'function': toFunction,
        n: toN,
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
        toN: toN,
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
        // each: each,
        // find: find,
        // some: some,
        // foldl: foldl,
        // foldr: foldr,
        parse: parse,
        merge: merge,
        isInt: isInt,
        defer: defer,
        clone: clone,
        clamp: clamp,
        flows: flows,
        where: where,
        isNaN: _isNaN,
        // forIn: forIn,
        // forOwn: forOwn,
        reduce: reduce,
        under1: under1,
        invert: invert,
        extend: extend,
        passes: passes,
        values: values,
        gather: gather,
        object: object,
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
        // forEach: forEach,
        flatten: flatten,
        wraptry: wraptry,
        indexOf: indexOf,
        toArray: toArray,
        isEmpty: isEmpty,
        returns: returns,
        allKeys: allKeys,
        console: console,
        whereNot: whereNot,
        evaluate: evaluate,
        validKey: validKey,
        // findRight: findRight,
        toString: toString,
        throttle: throttle,
        debounce: debounce,
        iterates: iterates,
        bindWith: bindWith,
        mapRight: mapRight,
        isObject: isObject,
        isNumber: isNumber,
        isString: isString,
        isFinite: _isFinite,
        isBoolean: isBoolean,
        factories: factories,
        cloneJSON: cloneJSON,
        toBoolean: toBoolean,
        stringify: stringify,
        shiftSelf: shiftSelf,
        eachProxy: eachProxy,
        toInteger: toInteger,
        publicize: publicize,
        // eachRight: eachRight,
        // findIndex: findIndex,
        startsWith: startsWith,
        isInstance: isInstance,
        hasEnumBug: hasEnumBug,
        indexOfNaN: indexOfNaN,
        toFunction: toFunction,
        roundFloat: roundFloat,
        isFunction: isFunction,
        withinRange: withinRange,
        isUndefined: isUndefined,
        superExtend: superExtend,
        intendedApi: intendedApi,
        protoProp: protoProperty,
        isArrayLike: isArrayLike,
        performance: performance,
        unwrapBlock: unwrapBlock,
        BIG_INTEGER: BIG_INTEGER,
        smartIndexOf: smartIndexOf,
        consolemaker: consolemaker,
        // forEachRight: forEachRight,
        blockWrapper: blockWrapper,
        isEmptyArray: isEmptyArray,
        parseDecimal: parseDecimal,
        keyGenerator: keyGenerator,
        // findIndexRight: findIndexRight,
        protoProperty: protoProperty,
        reverseParams: reverseParams,
        objectToArray: objectToArray,
        sortedIndexOf: sortedIndexOf,
        // filterNegative: filterNegative,
        stringifyQuery: stringifyQuery,
        intendedObject: intendedObject,
        arrayLikeToArray: arrayLikeToArray,
        euclideanDistance: euclideanDistance,
        intendedIteration: intendedIteration,
        constructorWrapper: constructorWrapper,
        NEGATIVE_BIG_INTEGER: NEGATIVE_BIG_INTEGER,
        createPredicateIndexFinder: createPredicateIndexFinder,
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

function isValue(item) {
    return notNaN(item) && !isNull(item) && !isUndefined(item);
}

function sortedIndexOf(list, item, minIndex_, maxIndex_, fromRight) {
    var guess, min = minIndex_ || 0,
        max = maxIndex_ || list[LENGTH] - 1,
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

function toBoolean(item) {
    return !!item;
}

function stringify(obj) {
    return (isObject(obj) ? JSON.stringify(obj) : isFunction(obj) ? obj.toString() : obj) + EMPTY_STRING;
}

function sort(obj, fn_, reversed, context) {
    var fn = bindTo(fn_ || function (a, b) {
        return a > b;
    }, context || obj);
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
function sortBy(list, arg1, handler_, reversed, context) {
    var handler = handler_ || function (obj, arg1) {
        return obj[arg1];
    };
    return sort(list, function (a, b) {
        return handler(a, arg1) > handler(b, arg1);
    }, reversed, context);
}

function has(obj, prop, useArrayCheck) {
    var val = BOOLEAN_FALSE;
    if (useArrayCheck) {
        return indexOf(obj, prop) !== -1;
    }
    return obj && isFunction(obj.hasOwnProperty) ? obj.hasOwnProperty(prop) : val;
}

function previousConstructor(instance) {
    return instance && instance[CONSTRUCTOR_KEY] && instance[CONSTRUCTOR_KEY][CONSTRUCTOR] || instance[CONSTRUCTOR];
}

function isInstance(instance, constructor_) {
    var constructor = constructor_;
    if (has(constructor, CONSTRUCTOR)) {
        constructor = constructor[CONSTRUCTOR];
    }
    return instance instanceof constructor;
}

function itemIs(list, item, index) {
    return list[index || 0] === item;
}

function isWrap(type, fn_) {
    var fn = fn_ || function () {
        return BOOLEAN_TRUE;
    };
    return function (thing) {
        return typeof thing === type && fn(thing);
    };
}

function _isNaN(thing) {
    return thing !== thing;
}

function notNaN(thing) {
    return !_isNaN(thing);
}

function isBoolean(argument) {
    return argument === BOOLEAN_TRUE || argument === BOOLEAN_FALSE;
}

function isInt(num) {
    return num === Math.round(num);
}

function isNull(thing) {
    return thing === NULL;
}

function isUndefined(thing) {
    return thing === UNDEFINED;
}

function negate(fn) {
    return function () {
        return !fn.apply(this, arguments);
    };
}

function _isFinite(thing) {
    return isNumber(thing) && isFinite_(thing);
}

function isWindow(obj) {
    return !!(obj && obj === obj[WINDOW]);
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
    if (has(obj, prop) && !contains(keys, prop)) keys.push(prop);
    while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] && !contains(keys, prop)) {
            keys.push(prop);
        }
    }
}

function extend(args, deep) {
    var length = args && args[LENGTH],
        index = 1,
        first = 0,
        base = args[0] || {};
    for (; index < length; index++) {
        merge(base, args[index], deep);
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
    var key, obj1Val, obj2Val, i = 0,
        instanceKeys = keys(obj2),
        l = instanceKeys[LENGTH];
    // merge_count++;
    for (; i < l; i++) {
        key = instanceKeys[i];
        // ignore undefined
        if (obj2[key] !== UNDEFINED) {
            obj2Val = obj2[key];
            if (deep) {
                obj1Val = obj1[key];
                if (obj1Val !== obj2Val) {
                    if (isObject(obj2Val)) {
                        if (!isObject(obj1Val)) {
                            obj1Val = obj1[key] = returnBaseType(obj2Val);
                        }
                        merge(obj1Val, obj2Val, deep);
                    } else {
                        obj1[key] = obj2Val;
                    }
                }
            } else {
                obj1[key] = obj2Val;
            }
        }
    }
    return obj1;
}

function zip(lists) {
    var aggregator = [];
    forEach(lists, function (list, listCount) {
        forEach(list, function (item, index) {
            var destination = aggregator[index];
            if (!aggregator[index]) {
                destination = aggregator[index] = [];
            }
            destination[listCount] = item;
        });
    });
    return aggregator;
}

function object(keys, values) {
    var obj = {};
    if (values) {
        forEach(keys, function (key, index) {
            obj[key] = values[index];
        });
    } else {
        forEach(keys, function (key, index) {
            obj[key[0]] = key[1];
        });
    }
    return obj;
}
// Helper for collection methods to determine whether a collection
// should be iterated as an array or as an object
// Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
function isArrayLike(collection) {
    var length = !!collection && collection[LENGTH];
    return isArray(collection) || (isWindow(collection) ? BOOLEAN_FALSE : (isNumber(length) && !isString(collection) && length >= 0 && length <= MAX_ARRAY_INDEX && !isFunction(collection)));
}

function iterates(keys, obj, iterator, context) {
    var list = keys(obj),
        iteratee = bindTo(iterator, context);
    return {
        keys: list,
        handler: function (key, idx, list) {
            // gives you the key, use that to get the value
            return iteratee(obj[key], key, obj);
        }
    };
}

function eachProxy(fn, getkeys) {
    return function (obj_, iteratee_, context_, direction_) {
        var ret, obj = obj_,
            list = obj,
            iteratee = iteratee_,
            iterator = iteratee,
            context = context_,
            direction = direction_;
        if (!obj) {
            return obj;
        }
        if (!isArrayLike(obj)) {
            ret = iterates(getkeys, list, iteratee, context);
            iterator = ret.handler;
            list = ret.keys;
            // prevent forEach from binding again
            context = NULL;
        }
        return fn(list, iterator, context, direction);
    };
}

function createPredicateIndexFinder(dir) {
    return function (obj, predicate, context, index_) {
        var key, value, array = isArrayLike(obj) ? obj : keys(obj),
            length = array[LENGTH],
            callback = bindTo(predicate, context),
            index = index_ || (dir > 0 ? 0 : length - 1);
        for (; index >= 0 && index < length; index += dir) {
            key = index;
            if (obj !== array) {
                key = array[index];
            }
            value = obj[key];
            if (callback(value, key, obj)) {
                return key;
            }
        }
        return;
    };
}

function findAccessor(fn) {
    return function (obj, predicate, context, index) {
        var foundAt = fn(obj, predicate, context, index);
        if (foundAt !== UNDEFINED) {
            return obj[foundAt];
        }
    };
}

function validKey(key) {
    // -1 for arrays
    // any other data type ensures string
    return key !== -1 && key === key && key !== UNDEFINED && key !== NULL && key !== BOOLEAN_FALSE && key !== BOOLEAN_TRUE;
}
// finder = function (findHelper) {
//     return function (obj, predicate, context, startpoint) {
//         return findHelper(obj, predicate, context, startpoint);
//         // if (validKey(key)) {
//         //     return obj[key];
//         // }
//     };
// },
function bind(func, context) {
    return arguments[LENGTH] < 3 ? bindTo(func, context) : bindWith(func, toArray(arguments).slice(1));
}

function bindTo(func, context) {
    return context ? func.bind(context) : func;
}

function bindWith(func, args) {
    return func.bind.apply(func, args);
}

function forEach(values, runner_, context, direction_) {
    var direction, runner, iterations, val, i, leftover, deltaFn;
    if (!values || !runner_) {
        return;
    }
    i = 0;
    val = values[LENGTH];
    leftover = val % 8;
    iterations = parseInt(val / 8, 10);
    if (direction_ < 0) {
        i = val - 1;
    }
    direction = direction_ || 1;
    runner = bindTo(runner_, context);
    if (leftover > 0) {
        do {
            runner(values[i], i, values);
            i += direction;
        } while (--leftover > 0);
    }
    if (iterations) {
        do {
            runner(values[i], i, values);
            i += direction;
            runner(values[i], i, values);
            i += direction;
            runner(values[i], i, values);
            i += direction;
            runner(values[i], i, values);
            i += direction;
            runner(values[i], i, values);
            i += direction;
            runner(values[i], i, values);
            i += direction;
            runner(values[i], i, values);
            i += direction;
            runner(values[i], i, values);
            i += direction;
        } while (--iterations > 0);
    }
    return values;
}

function tackRight(fn) {
    return function (list, iterator, context) {
        return fn(list, iterator, arguments[LENGTH] < 3 ? NULL : context, -1);
    };
}

function values(object) {
    var collected = [];
    forOwn(object, function (value) {
        collected.push(value);
    });
    return collected;
}

function toBoolean(thing) {
    var ret, thingMod = thing + EMPTY_STRING;
    thingMod = thingMod.trim();
    if (thingMod === BOOLEAN_FALSE + EMPTY_STRING) {
        ret = BOOLEAN_FALSE;
    }
    if (thingMod === BOOLEAN_TRUE + EMPTY_STRING) {
        ret = BOOLEAN_TRUE;
    }
    // if failed to convert, revert
    if (ret === UNDEFINED) {
        ret = thing;
    }
    return ret;
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
    if (hasEnumBug) {
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
    if (hasEnumBug) {
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
        return one != NULL && one instanceof Constructor ? one : new Constructor(one, two, three, four, five, six);
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
    case BRACKET_OBJECT_SPACE + 'RegExp]':
        // RegExps are coerced to strings for comparison (Note: EMPTY_STRING + /a/i === '/a/i')
    case BRACKET_OBJECT_SPACE + 'String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return EMPTY_STRING + a === EMPTY_STRING + b;
    case BRACKET_OBJECT_SPACE + 'Number]':
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
/**
 * Perform a deep comparison to check if two objects are equal.
 * @name _#isEqual
 * @method
 * @param {*} a object or value to deep compare against b.
 * @param {*} b object or value to deep compare against a.
 * @returns {Boolean} result of the comparison. True is returned if the objects' values are identical. False will be returned if ther are any differences.
 * @example <caption>The isEqual method can compare values as well as pointers since pointers will be iterated through, looking for differences. The following calls will both result in true.</caption>
 * _.isEqual(true, true);
 * _.isEqual({}, {});
 * @example <caption>The isEqual method finds differences if they exist. The following calls will return false</caption>
 * _.isEqual(true, false);
 * _.isEqual({
 *     diff: 1
 * }, {
 *     diff: true
 * });
 */
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

function concat(list) {
    return arrayConcat.apply([], map(list, passesFirstArgument(toArray)));
}

function concatUnique(list) {
    return reduce(list, function (memo, argument) {
        forEach(argument, function (item) {
            if (indexOf(memo, item) === -1) {
                memo.push(item);
            }
        });
        return memo;
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
    array.push.apply(array, piece);
    return array;
}

function isMatch(object, attrs) {
    var key, i = 0,
        keysResult = keys(attrs),
        obj = toObject(object);
    return !find(keysResult, function (val) {
        return (attrs[val] !== obj[val] || !(val in obj));
    });
}

function matches(obj1) {
    return function (obj2) {
        return isMatch(obj2, obj1);
    };
}

function matchesBinary(assertment, lookingFor) {
    var boolAssertment = !assertment;
    var boolLookingFor = !lookingFor;
    return boolAssertment === boolLookingFor;
}

function filterCommon(thing, iteratee, context, negated, passed, memo) {
    var negative = !negated;
    var bound = bindTo(iteratee, context);
    return reduce(thing, function (memo, item, index, list) {
        if (matchesBinary(bound(item, index, list), negative)) {
            passed(memo, item, index);
        }
    }, memo);
}

function arrayAdd(array, item) {
    array.push(item);
}

function objectSet(object, item, key) {
    object[key] = item;
}

function filterArray(array, iteratee, context, negated) {
    return filterCommon(array, iteratee, context, negated, arrayAdd, []);
}

function filterObject(object, iteratee, context, negated) {
    return filterCommon(object, iteratee, context, negated, objectSet, {});
}

function filter(thing, iteratee, context, negated) {
    return isArrayLike(thing) ? filterArray(thing, iteratee, context, negated) : filterObject(thing, iteratee, context, negated);
}

function filterNegative(obj, iteratee, context, negated) {
    return filter(obj, iteratee, context, !negated);
}

function unique(list) {
    return filter(list, function (memo, item) {
        if (indexOf(memo, item) === -1) {
            memo.push(item);
        }
    }, []);
}

function where(obj, attrs) {
    return filter(obj, matches(attrs));
}

function whereNot(obj, attrs) {
    return filterNegative(obj, matches(attrs));
}

function findWhere(obj, attrs) {
    return find(obj, matches(attrs));
}

function findWhereRight(obj, attrs) {
    return findRight(obj, matches(attrs));
}

function findIndexWhere(obj, attrs) {
    return findIndex(obj, matches(attrs));
}

function findIndexWhereRight(obj, attrs) {
    return findIndexRight(obj, matches(attrs));
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
    if ((val[0] === '{' && val[valLength - 1] === '}') || (val[0] === '[' && val[valLength - 1] === ']')) {
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
        return (string = split.join('{')).slice(0, string[LENGTH] - 1);
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
    return function (objs, iteratee, context) {
        var collection = returnBaseType(objs),
            iterates = isString(iteratee) ? whenString(iteratee) : iteratee,
            bound = bindTo(iterates, context);
        if (objs) {
            iterator(objs, iterable(collection, bound, isEmptyArray(collection)));
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

function objectToArray(obj) {
    return !obj ? [] : reduce(obj, function (memo, item) {
        memo.push(item);
    }, []);
}

function toN(item) {
    return isArrayLike(object) ? item : [item];
}

function toArray(object, delimiter) {
    return isArrayLike(object) ? (isArray(object) ? object.slice(0) : arrayLikeToArray(object)) : (isString(object) ? object.split(isString(delimiter) ? delimiter : COMMA) : [object]);
}

function toString(argument) {
    return argument ? argument.toString() : ('' + argument);
}

function flattenArray(list, handle, deep) {
    var items = reduce(list, function (memo, item_) {
        var item;
        if (isArrayLike(item_)) {
            item = deep ? flattenArray(item_, BOOLEAN_FALSE, deep) : item_;
            return memo.concat(item);
        } else {
            memo.push(item_);
            return memo;
        }
    }, []);
    if (handle) {
        forEach(items, handle);
    }
    return items;
}

function flatten(list, handler_, deep_) {
    return flattenArray(isArrayLike(list) ? list : objectToArray(list), handler_, !!deep_);
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

function isLength(number) {
    return isNumber(number) && isValidInteger(number);
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

function defer(fn, time, ctx) {
    var id;
    return function () {
        var context = ctx || this,
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
        var context = this;
        intendedObject(one, two, fn, context);
        return context;
    };
}

function intendedIteration(key, value, iterator_, context) {
    var keysResult, isObjectResult = isObject(key),
        iterator = bind(iterator_, context);
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

function intendedObject(key, value, fn_, ctx) {
    var obj, fn = ctx ? bind(fn_, ctx) : fn_;
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

function buildCallers(prefix, handler, second) {
    var memo = {},
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

function reduction(accessor, iteratee, memo_, context, dir, startsAt1) {
    var value, nextMemo, next, memo = memo_,
        bound = bindTo(iteratee, context),
        generated = keyGenerator(accessor, dir);
    if (startsAt1) {
        if (isUndefined(next = generated())) {
            return memo;
        } else {
            memo = accessor[next];
        }
    }
    while (!isUndefined(next = generated())) {
        if (!isUndefined(nextMemo = bound(memo, accessor[next], next, accessor))) {
            memo = nextMemo;
        }
    }
    return memo;
}

function createReduce(dir_) {
    return function (obj, iteratee, memo, context, dir, startsAt1) {
        return reduction(obj, iteratee, memo, context, dir || dir_, startsAt1 || arguments[LENGTH] < 3);
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
    if (which === UNDEFINED) {
        return !current;
    } else {
        return !!which;
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
function Extendable(attributes, options) {
    return this;
}