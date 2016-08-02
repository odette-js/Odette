Odette.definition(this, function (app, windo, options) {
        'use strict';
var UNDEFINED, win = window,
    doc = win.document,
    EMPTY_STRING = '',
    SPACE = ' ',
    HYPHEN = '-',
    PERIOD = '.',
    COMMA = ',',
    SLASH = '/',
    UNDERSCORE = '_',
    COLON = ':',
    HASHTAG = '#',
    DOUBLE_UNDERSCORE = UNDERSCORE + UNDERSCORE,
    DOUBLE_SLASH = SLASH + SLASH,
    PIXELS = 'px',
    ZERO_PIXELS = 0 + PIXELS,
    ID = 'id',
    DISPLAY = 'display',
    DESTROY = 'destroy',
    BEFORE = 'before',
    CHANGE = 'change',
    CHANGING = 'changing',
    BEFORE_COLON = BEFORE + COLON,
    CHANGE_COLON = CHANGE + COLON,
    BEFORE_DESTROY = BEFORE_COLON + DESTROY,
    DESTROYING = DESTROY + 'ing',
    TO_STRING = 'toString',
    TO_JSON = 'toJSON',
    VALUE_OF = 'valueOf',
    PROTOTYPE = 'prototype',
    CONSTRUCTOR = 'constructor',
    CURRENT = 'current',
    PREVIOUS = 'previous',
    EXPORTS = 'exports',
    APPLICATION = 'application',
    NAME = 'name',
    TYPE = 'type',
    FINISHED = 'finished',
    SELECTOR = 'selector',
    ELEMENT = 'element',
    CHILD = 'child',
    NONE = 'none',
    HIDDEN = 'hidden',
    TARGET = 'target',
    ORIGIN = 'origin',
    RESET = 'reset',
    ATTRIBUTES = 'attributes',
    DATA = 'data',
    PARENT = 'parent',
    LENGTH = 'length',
    OBJECT = 'object',
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    FUNCTION = 'function',
    INDEX = 'index',
    INDEX_OF = INDEX + 'Of',
    WINDOW = 'window',
    DOCUMENT = 'document',
    WRITE = 'write',
    STACK = 'stack',
    START = 'start',
    STOP = 'stop',
    COMPONENTS = 'components',
    CLASS = 'class',
    CLASSNAME = CLASS + 'Name',
    TOP = 'top',
    LEFT = 'left',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    WIDTH = 'width',
    __ELID__ = DOUBLE_UNDERSCORE + 'elid' + DOUBLE_UNDERSCORE,
    HEIGHT = 'height',
    ITEM = 'item',
    INNER_HEIGHT = 'innerHeight',
    INNER_WIDTH = 'innerWidth',
    DISPATCH_EVENT = 'dispatchEvent',
    HTTP = 'http',
    HTTPS = HTTP + 's',
    TO_ARRAY = 'toArray',
    CONSTRUCTOR_KEY = DOUBLE_UNDERSCORE + CONSTRUCTOR + DOUBLE_UNDERSCORE,
    LOCATION = 'location',
    EXTEND = 'extend',
    STYLE = 'style',
    BODY = 'body',
    BOOLEAN_TRUE = !0,
    BOOLEAN_FALSE = !1,
    INFINITY = Infinity,
    NEGATIVE_INFINITY = -INFINITY,
    BIG_INTEGER = 32767,
    NEGATIVE_BIG_INTEGER = -BIG_INTEGER - 1,
    TWO_TO_THE_31 = 2147483647,
    MAX_ARRAY_LENGTH = 4294967295,
    NULL = null,
    FUNCTION_CONSTRUCTOR = Function,
    ARRAY_CONSTRUCTOR = Array,
    STRING_CONSTRUCTOR = String,
    NUMBER_CONSTRUCTOR = Number,
    OBJECT_CONSTRUCTOR = Object,
    FUNCTION_CONSTRUCTOR_CONSTRUCTOR = FUNCTION_CONSTRUCTOR[CONSTRUCTOR],
    BRACKET_OBJECT_SPACE = '[object ',
    STRING_PROTOTYPE = STRING_CONSTRUCTOR[PROTOTYPE],
    OBJECT_PROTOTYPE = OBJECT_CONSTRUCTOR[PROTOTYPE],
    ARRAY_PROTOTYPE = ARRAY_CONSTRUCTOR[PROTOTYPE],
    funcProto = FUNCTION_CONSTRUCTOR[PROTOTYPE],
    MAX_VALUE = NUMBER_CONSTRUCTOR.MAX_VALUE,
    MIN_VALUE = NUMBER_CONSTRUCTOR.MIN_VALUE,
    MAX_SAFE_INTEGER = NUMBER_CONSTRUCTOR.MAX_SAFE_INTEGER,
    MIN_SAFE_INTEGER = NUMBER_CONSTRUCTOR.MIN_SAFE_INTEGER;
var factories = {},
    nativeKeys = OBJECT_CONSTRUCTOR.keys,
    objectToString = OBJECT_CONSTRUCTOR[PROTOTYPE].toString,
    hasEnumBug = !{
        toString: NULL
    }.propertyIsEnumerable(TO_STRING),
    noop = function () {},
    /**
     * @func
     */
    indexOfNaN = function (array, fromIndex, toIndex, fromRight) {
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
    },
    property = function (string) {
        return function (object) {
            return object[string];
        };
    },
    indexOf = function (array, value, fromIndex, toIndex, fromRight) {
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
    },
    sortedIndexOf = function (list, item, minIndex_, maxIndex_, fromRight) {
        var guess, min = minIndex_ || 0,
            max = maxIndex_ || list[LENGTH] - 1,
            bitwise = (max <= TWO_TO_THE_31) ? BOOLEAN_TRUE : BOOLEAN_FALSE;
        if (item !== item) {
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
    },
    smartIndexOf = function (array, item, _from, _to, _rtl) {
        return (_from === BOOLEAN_TRUE && array && array[LENGTH] > 100 ? sortedIndexOf : indexOf)(array, item, _from, _to, _rtl);
    },
    /**
     * @func
     */
    toString = function (obj) {
        return obj == NULL ? EMPTY_STRING : obj + EMPTY_STRING;
    },
    stringify = function (obj) {
        return (isObject(obj) ? JSON.stringify(obj) : isFunction(obj) ? obj.toString() : obj) + EMPTY_STRING;
    },
    /**
     * @func
     */
    sort = function (obj, fn_, reversed, context) {
        var fn = bindTo(fn_ || function (a, b) {
            return a > b;
        }, context);
        // normalize sort function handling for safari
        return obj.sort(function (a, b) {
            var result = fn(a, b);
            if (isNaN(result)) {
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
    },
    normalizeToFunction = function (value, context, argCount) {
        if (value == NULL) return returns.first;
        if (isFunction(value)) return bindTo(value, context);
        // has not been created yet
        if (isObject(value)) return _.matcher(value);
        return property(value);
    },
    // Sort the object's values by a criterion produced by an iteratee.
    // _.sortBy = function(obj, iteratee, context) {
    //   iteratee = cb(iteratee, context);
    //   return _.pluck(_.map(obj, function(value, index, list) {
    //     return {
    //       value: value,
    //       index: index,
    //       criteria: iteratee(value, index, list)
    //     };
    //   }).sort(function(left, right) {
    //     var a = left.criteria;
    //     var b = right.criteria;
    //     if (a !== b) {
    //       if (a > b || a === void 0) return 1;
    //       if (a < b || b === void 0) return -1;
    //     }
    //     return left.index - right.index;
    //   }), 'value');
    // };
    // sortBy = function (list, string) {},
    // arg1 is usually a string or number
    sortBy = function (list, arg1, handler_, reversed, context) {
        var handler = handler_ || function (obj, arg1) {
            return obj[arg1];
        };
        return sort(list, function (a, b) {
            return handler(a, arg1) > handler(b, arg1);
        }, reversed, context);
    },
    /**
     * @func
     */
    has = function (obj, prop, useArrayCheck) {
        var val = BOOLEAN_FALSE;
        if (useArrayCheck) {
            return indexOf(obj, prop) !== -1;
        }
        if (obj && isFunction(obj.hasOwnProperty)) {
            val = obj.hasOwnProperty(prop);
        }
        return val;
    },
    /**
     * @func
     */
    previousConstructor = function (instance) {
        return instance && instance[CONSTRUCTOR_KEY] && instance[CONSTRUCTOR_KEY][CONSTRUCTOR] || instance[CONSTRUCTOR];
    },
    isInstance = function (instance, constructor_) {
        var constructor = constructor_;
        if (has(constructor, CONSTRUCTOR)) {
            constructor = constructor[CONSTRUCTOR];
        }
        return instance instanceof constructor;
    },
    /**
     * @func
     */
    splitGen = function (delimiter) {
        return function (list) {
            return isString(list) ? list.split(delimiter) : list;
        };
    },
    /**
     * @func
     */
    isWrap = function (type, fn_) {
        var fn = fn_ || function () {
            return BOOLEAN_TRUE;
        };
        return function (thing) {
            return typeof thing === type && fn(thing);
        };
    },
    /**
     * @func
     */
    isNaN = function (thing) {
        return thing !== thing;
    },
    notNaN = function (thing) {
        return thing === thing;
    },
    /**
     * @func
     */
    isFunction = isWrap(FUNCTION),
    /**
     * @func
     */
    isBoolean = isWrap(BOOLEAN),
    isInt = function (num) {
        return isNumber(num) && num === Math.round(num);
    },
    /**
     * @func
     */
    isString = isWrap(STRING),
    isNumber = isWrap(NUMBER, notNaN),
    isObject = isWrap(OBJECT, function (thing) {
        return !!thing;
    }),
    /**
     * @func
     */
    isNull = function (thing) {
        return thing === NULL;
    },
    isUndefined = function (thing) {
        return thing === UNDEFINED;
    },
    negate = function (fn) {
        return function () {
            return !fn.apply(this, arguments);
        };
    },
    isFinite_ = win.isFinite,
    isFinite = function (thing) {
        return isNumber(thing) && isFinite_(thing);
    },
    isWindow = function (obj) {
        return !!(obj && obj === obj[WINDOW]);
    },
    /**
     * @func
     */
    /**
     * @func
     */
    isArray = ARRAY_CONSTRUCTOR.isArray,
    /**
     * @func
     */
    isEmpty = function (obj) {
        return !keys(obj)[LENGTH];
    },
    /**
     * @func
     */
    invert = function (obj) {
        var i = 0,
            result = {},
            objKeys = keys(obj),
            length = objKeys[LENGTH];
        for (; i < length; i++) {
            result[obj[objKeys[i]]] = objKeys[i];
        }
        return result;
    },
    /**
     * @func
     */
    collectNonEnumProps = function (obj, keys) {
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
    },
    /**
     * @func
     */
    now = function () {
        return +(new Date());
    },
    now_offset = now(),
    now_shim = function () {
        return now() - now_offset;
    },
    _performance = window.performance,
    performance = _performance ? (_performance.now = (_performance.now || _performance.webkitNow || _performance.msNow || _performance.oNow || _performance.mozNow || now_shim)) && _performance : {
        now: now_shim,
        offset: now_offset
    },
    /**
     * @func
     */
    extend = function () {
        var deep = BOOLEAN_FALSE,
            args = arguments,
            length = args[LENGTH],
            index = 1,
            first = 0,
            base = args[0];
        if (base === BOOLEAN_TRUE) {
            deep = BOOLEAN_TRUE;
            base = args[1];
            index = 2;
        }
        base = base || {};
        for (; index < length; index++) {
            merge(base, args[index], deep);
        }
        return base;
    },
    returnOrApply = function (obj_or_fn, context, args) {
        return isFunction(obj_or_fn) ? obj_or_fn.apply(context, args) : obj_or_fn;
    },
    superExtend = function (key, handler) {
        return function () {
            var context = this,
                supertarget = context[CONSTRUCTOR].fn[key],
                args = toArray(arguments);
            return extend(BOOLEAN_TRUE, returnOrApply(supertarget, context, args), returnOrApply(handler, context, args));
        };
    },
    merge = function (obj1, obj2, deep) {
        var key, val, i = 0,
            instanceKeys = keys(obj2),
            l = instanceKeys[LENGTH];
        for (; i < l; i++) {
            key = instanceKeys[i];
            // ignore undefined
            if (obj2[key] !== UNDEFINED) {
                val = obj2[key];
                if (deep) {
                    if (isObject(obj2[key])) {
                        if (!isObject(obj1[key])) {
                            obj1[key] = returnBaseType(obj2[key]);
                        }
                        merge(obj1[key], obj2[key], deep);
                    } else {
                        obj1[key] = val;
                    }
                } else {
                    obj1[key] = val;
                }
            }
        }
        return obj1;
    },
    values = function (object) {
        var collected = [];
        each(object, function (value) {
            collected.push(value);
        });
        return collected;
    },
    zip = function (lists) {
        var aggregator = [];
        duff(lists, function (list, listCount) {
            duff(list, function (item, index) {
                var destination = aggregator[index];
                if (!aggregator[index]) {
                    destination = aggregator[index] = [];
                }
                destination[listCount] = item;
            });
        });
        return aggregator;
    },
    object = function (keys, values) {
        var obj = {};
        if (values) {
            duff(keys, function (key, index) {
                obj[key] = values[index];
            });
        } else {
            duff(keys, function (key, index) {
                obj[key[0]] = key[1];
            });
        }
        return obj;
    },
    /**
     * @func
     */
    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    MAX_ARRAY_INDEX = Math.pow(2, 53) - 1,
    /**
     * @func
     */
    isArrayLike = function (collection) {
        var length = !!collection && collection[LENGTH];
        return isArray(collection) || (isWindow(collection) ? BOOLEAN_FALSE : (isNumber(length) && !isString(collection) && length >= 0 && length <= MAX_ARRAY_INDEX && !isFunction(collection)));
    },
    iterates = function (obj, iterator, context) {
        var list = keys(obj),
            iteratee = bindTo(iterator, context);
        return {
            keys: list,
            handler: function (key, idx, list) {
                // gives you the key, use that to get the value
                return iteratee(obj[key], key, obj);
            }
        };
    },
    eachProxy = function (fn) {
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
                ret = iterates(list, iteratee, context);
                iterator = ret.handler;
                list = ret.keys;
                // prevent duff from binding again
                context = NULL;
            }
            return fn(list, iterator, context, direction);
        };
    },
    /**
     * @func
     */
    createPredicateIndexFinder = function (dir) {
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
                    return value;
                }
            }
            return;
        };
    },
    /**
     * @func
     */
    // Returns the first index on an array-like that passes a predicate test
    findIndex = createPredicateIndexFinder(1),
    /**
     * @func
     */
    findLastIndex = createPredicateIndexFinder(-1),
    /**
     * @func
     */
    validKey = function (key) {
        // -1 for arrays
        // any other data type ensures string
        return key !== -1 && key === key && key !== UNDEFINED && key !== NULL && key !== BOOLEAN_FALSE && key !== BOOLEAN_TRUE;
    },
    // finder = function (findHelper) {
    //     return function (obj, predicate, context, startpoint) {
    //         return findHelper(obj, predicate, context, startpoint);
    //         // if (validKey(key)) {
    //         //     return obj[key];
    //         // }
    //     };
    // },
    find = findIndex,
    findLast = findLastIndex,
    bind = function (func, context) {
        return arguments[LENGTH] < 3 ? bindTo(func, context) : bindWith(func, toArray(arguments).slice(1));
    },
    bindTo = function (func, context) {
        return context ? func.bind(context) : func;
    },
    bindWith = function (func, args) {
        return func.bind.apply(func, args);
    },
    duff = function (values, runner_, context, direction_) {
        var direction, runner, iterations, val, i, leftover, deltaFn;
        if (!values) {
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
    },
    each = eachProxy(duff),
    tackRight = function (fn) {
        return function (list, iterator, context) {
            return fn(list, iterator, arguments[LENGTH] < 3 ? NULL : context, -1);
        };
    },
    duffRight = tackRight(duff),
    eachRight = tackRight(each),
    /**
     * @func
     */
    toBoolean = function (thing) {
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
    },
    /**
     * @func
     */
    parseDecimal = function (num) {
        return parseFloat(num) || 0;
    },
    pI = function (num) {
        return parseInt(num, 10) || 0;
    },
    allKeys = function (obj) {
        var key, keys = [];
        for (key in obj) {
            keys.push(key);
        }
        // Ahem, IE < 9.
        if (hasEnumBug) {
            collectNonEnumProps(obj, keys);
        }
        return keys;
    },
    keys = function (obj) {
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
    },
    /**
     * @func
     */
    constructorExtend = function (name, protoProps) {
        var nameString, constructorKeyName, child, passedParent, hasConstructor, constructor, parent = this,
            nameIsStr = isString(name);
        if (name === BOOLEAN_FALSE) {
            extend(parent[PROTOTYPE], protoProps);
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
            extend(child[PROTOTYPE], protoProps);
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
    },
    constructorWrapper = function (Constructor, parent) {
        var __ = function (one, two, three, four, five, six) {
            return one instanceof Constructor ? one : new Constructor(one, two, three, four, five, six);
        };
        __.isInstance = Constructor.isInstance = function (instance) {
            return isInstance(instance, Constructor);
        };
        __.fn = Constructor.fn = Constructor[PROTOTYPE].fn = Constructor[PROTOTYPE];
        __[CONSTRUCTOR] = Constructor;
        __[EXTEND] = Constructor[EXTEND] = bind(constructorExtend, Constructor);
        if (parent) {
            __.super = Constructor.super = Constructor[PROTOTYPE].super = parent;
        }
        return __;
    },
    /**
     * @func
     */
    once = function (fn) {
        var doIt = BOOLEAN_TRUE;
        return function () {
            if (doIt) {
                doIt = BOOLEAN_FALSE;
                return fn.apply(this, arguments);
            }
        };
    },
    /**
     * @func
     */
    // Internal recursive comparison function for `isEqual`.
    eq = function (a, b, aStack, bStack) {
        var className, areArrays, aCtor, bCtor, length, objKeys, key;
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
            if (+a !== +a) return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case BRACKET_OBJECT_SPACE + 'Date]':
        case BRACKET_OBJECT_SPACE + 'Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
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
    },
    /**
     * @func
     */
    // Perform a deep comparison to check if two objects are equal.
    isEqual = function (a, b) {
        return eq(a, b, [], []);
    },
    /**
     * @func
     */
    // very shallow clone
    clone = function (obj) {
        return map(obj, function (value) {
            return value;
        });
    },
    cloneJSON = function (obj) {
        return parse(stringify(obj));
    },
    /**
     * @func
     */
    wrap = function (obj, fn, noExecute) {
        var newObj = {},
            _isArray = isArray(obj),
            wasfunction = isFunction(fn);
        each(obj, function (value, key) {
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
    },
    /**
     * @func
     */
    publicize = function (obj) {
        return extend(_, obj);
    },
    passesFirstArgument = function (fn) {
        return function (first) {
            return fn(first);
        };
    },
    passes = {
        first: passesFirstArgument
    },
    concat = function () {
        var base = [];
        return base.concat.apply(base, map(arguments, passesFirstArgument(toArray)));
    },
    /**
     * @func
     */
    concatUnique = function () {
        return foldl(arguments, function (memo, argument) {
            duff(argument, function (item) {
                if (indexOf(memo, item) === -1) {
                    memo.push(item);
                }
            });
            return memo;
        }, []);
    },
    cycle = function (arr, num_) {
        var length = arr[LENGTH],
            num = num_ % length,
            piece = arr.splice(num);
        arr.unshift.apply(arr, piece);
        return arr;
    },
    uncycle = function (arr, num_) {
        var length = arr[LENGTH],
            num = num_ % length,
            piece = arr.splice(0, length - num);
        arr.push.apply(arr, piece);
        return arr;
    },
    isMatch = function (object, attrs) {
        var key, i = 0,
            keysResult = keys(attrs),
            obj = Object(object);
        return !find(keysResult, function (val) {
            if (attrs[val] !== obj[val] || !(val in obj)) {
                return BOOLEAN_TRUE;
            }
        });
    },
    matches = function (obj1) {
        return function (obj2) {
            return isMatch(obj2, obj1);
        };
    },
    filter = function (obj, iteratee, context) {
        var isArrayResult = isArrayLike(obj),
            bound = bindTo(iteratee, context),
            runCount = 0;
        return foldl(obj, function (memo, item, key, all) {
            runCount++;
            if (bound(item, key, all)) {
                if (isArrayResult) {
                    memo.push(item);
                } else {
                    memo[key] = item;
                }
            }
            return memo;
        }, isArrayResult ? [] : {});
    },
    where = function (obj, attrs) {
        return filter(obj, matches(attrs));
    },
    findWhere = function (obj, attrs) {
        return find(obj, matches(attrs));
    },
    findLastWhere = function (obj, attrs) {
        return findLast(obj, matches(attrs));
    },
    whereNot = function (obj, attrs) {
        return filter(obj, negate(matches(attrs)));
    },
    baseDataTypes = {
        true: BOOLEAN_TRUE,
        false: BOOLEAN_FALSE,
        null: NULL,
        undefined: UNDEFINED
    },
    parse = function (val_) {
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
        coerced = +val;
        if (!isNaN(coerced)) {
            return coerced;
        }
        if (has(baseDataTypes, val)) {
            return baseDataTypes[val];
        }
        if (val.slice(0, 8) === 'function') {
            return new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('return ' + val)();
        }
        return val;
    },
    unwrapBlock = function (string_) {
        var string = string_.toString(),
            split = string.split('{');
        string = split.shift();
        return (string = split.join('{')).slice(0, string[LENGTH] - 1);
    },
    blockWrapper = function (block, context) {
        return 'with(' + (context || 'this') + '){\n' + block + '\n}';
    },
    evaluate = function (context, string_, args) {
        var string = string_;
        if (isFunction(string_)) {
            string = unwrapBlock(string_);
        }
        // use a function constructor to get around strict mode
        var fn = new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('string', blockWrapper('\teval("(function (){"+string+"}());");'));
        fn.call(context, '"use strict";\n' + string);
    },
    returnBaseType = function (obj) {
        return !isObject(obj) || isArrayLike(obj) ? [] : {};
    },
    map = function (objs, iteratee, context) {
        var collection = returnBaseType(objs),
            bound = bindTo(iteratee, context);
        return !objs ? collection : each(objs, function (item, index) {
            collection[index] = bound(item, index, objs);
        }) && collection;
    },
    arrayLikeToArray = function (arrayLike) {
        return arrayLike[LENGTH] === 1 ? [arrayLike[0]] : ARRAY_CONSTRUCTOR.apply(NULL, arrayLike);
    },
    objectToArray = function (obj) {
        return !obj ? [] : foldl(obj, function (memo, item) {
            memo.push(item);
        }, []);
    },
    toArray = function (object, delimiter) {
        return isArrayLike(object) ? isArray(object) ? object.slice(0) : arrayLikeToArray(object) : (isString(object) ? object.split(isString(delimiter) ? delimiter : COMMA) : [object]);
    },
    nonEnumerableProps = toArray('valueOf,isPrototypeOf,' + TO_STRING + ',propertyIsEnumerable,hasOwnProperty,toLocaleString'),
    flattenArray = function (list, deep_, handle) {
        var deep = !!deep_;
        return foldl(list, function (memo, item_) {
            var item;
            if (isArrayLike(item_)) {
                item = deep ? flattenArray(item_, deep, handle) : item_;
                return memo.concat(item);
            } else {
                if (handle) {
                    handle(item_);
                }
                memo.push(item_);
                return memo;
            }
        }, []);
    },
    flatten = function (list, deep, handler) {
        return flattenArray(isArrayLike(list) ? list : objectToArray(list), deep, handler);
    },
    gather = function (list, handler) {
        var newList = [];
        return newList.concat.apply(newList, map(list, handler));
    },
    baseClamp = function (number, lower, upper) {
        if (number === number) {
            if (upper !== UNDEFINED) {
                number = number <= upper ? number : upper;
            }
            if (lower !== UNDEFINED) {
                number = number >= lower ? number : lower;
            }
        }
        return number;
    },
    safeInteger = function (number_) {
        return baseClamp(number_, MIN_SAFE_VALUE, MAX_SAFE_VALUE);
    },
    isValidInteger = function (number) {
        return number < MAX_VALUE && number > MIN_VALUE;
    },
    clampInteger = function (number) {
        return baseClamp(number, MIN_VALUE, MAX_VALUE);
    },
    floatToInteger = function (value) {
        var remainder = value % 1;
        return value === value ? (remainder ? value - remainder : value) : 0;
    },
    toInteger = function (number, notSafe) {
        var converted;
        return floatToInteger((converted = +number) == number ? (notSafe ? converted : safeInteger(converted)) : 0);
    },
    isLength = function (number) {
        return isNumber(number) && isValidInteger(number);
    },
    toLength = function (number) {
        return number ? clampInteger(toInteger(number, BOOLEAN_TRUE), 0, MAX_ARRAY_LENGTH) : 0;
    },
    /**
     * @func
     */
    debounce = function (func, wait, immediate) {
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
    },
    throttle = function (fn, threshold, scope) {
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
    },
    defer = function (fn, time, ctx) {
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
    },
    /**
     * @func
     */
    stringifyQuery = function (obj) {
        var val, n, base = obj.url,
            query = [];
        if (isObject(obj)) {
            each(obj.query, function (val, n) {
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
    },
    protoProperty = function (instance, key, farDown) {
        var val, proto, constructor = previousConstructor(instance);
        farDown = farDown || 1;
        do {
            proto = constructor[PROTOTYPE];
            val = proto[key];
            constructor = previousConstructor(proto);
        } while (--farDown > 0 && constructor && isFinite(farDown));
        return val;
    },
    uuid = function () {
        var cryptoCheck = 'crypto' in win && 'getRandomValues' in crypto,
            sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var rnd, r, v;
                if (cryptoCheck) {
                    rnd = win.crypto.getRandomValues(new Uint32Array(1));
                    if (rnd === UNDEFINED) {
                        cryptoCheck = BOOLEAN_FALSE;
                    }
                }
                if (!cryptoCheck) {
                    rnd = [Math.floor(Math.random() * 10000000000)];
                }
                rnd = rnd[0];
                r = rnd % 16;
                v = (c === 'x') ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        return cryptoCheck ? sid : 'SF' + sid;
    },
    intendedApi = function (fn) {
        return function (one, two) {
            var context = this;
            intendedObject(one, two, fn, context);
            return context;
        };
    },
    intendedIteration = function (key, value, iterator_, context) {
        var keysResult, isObjectResult = isObject(key),
            iterator = bind(iterator_, context);
        if (isObjectResult) {
            keysResult = keys(key);
        }
        return function (one, two, three, four, five, six) {
            if (isObjectResult) {
                duff(keysResult, function (key_) {
                    iterator(key_, key[key_], one, two, three, four, five, six);
                });
            } else {
                iterator(key, value, one, two, three, four, five, six);
            }
        };
    },
    intendedObject = function (key, value, fn_, ctx) {
        var obj, fn = ctx ? bind(fn_, ctx) : fn_;
        if (isArray(key)) {
            duff(key, function (first) {
                fn(first, value);
            });
        } else {
            if ((obj = isObject(key) ? key : BOOLEAN_FALSE)) {
                each(obj, reverseParams(fn));
            } else {
                fn(key, value);
            }
        }
    },
    reverseParams = function (iteratorFn) {
        return function (value, key, third) {
            iteratorFn(key, value, third);
        };
    },
    /**
     * @func
     */
    roundFloat = function (val, power, base) {
        var mult;
        if (!isNumber(power)) {
            power = 1;
        }
        mult = Math.pow(base || 10, power);
        return (parseInt((mult * val), 10) / mult);
    },
    result = function (obj, str, arg) {
        return obj == NULL ? obj : (isFunction(obj[str]) ? obj[str](arg) : (isObject(obj) ? obj[str] : obj));
    },
    eachCall = function (array, method, arg) {
        return duff(array, function (item) {
            item[method](arg);
        });
    },
    eachCallBound = function (array, arg) {
        return duff(array, function (fn) {
            fn(arg);
        });
    },
    eachCallTry = function (array, method, arg, catcher, finallyer) {
        return duff(array, function (item) {
            wraptry(function () {
                item[method](arg);
            }, catcher, finallyer);
        });
    },
    mapCallTry = function (array, method, arg, catcher, finallyer) {
        return map(array, function (item) {
            return wraptry(function () {
                return item[method](arg);
            }, catcher, finallyer);
        });
    },
    results = function (array, method, arg) {
        return map(array, function (item) {
            return result(item, method, arg);
        });
    },
    eachCallRight = function (array, method, arg) {
        return duff(array, function (item) {
            result(item, method, arg);
        }, NULL, -1);
    },
    maths = Math,
    mathArray = function (method) {
        return function (args) {
            return maths[method].apply(maths, args);
        };
    },
    /**
     * @func
     */
    // Create a reducing function iterating left or right.
    createReduce = function (dir) {
        // Optimized iterator function as using arguments[LENGTH]
        // in the main function will deoptimize the, see #1991.
        var iterator = function (obj, iteratee, memo, keys, index, length) {
            var nextMemo, currentKey;
            for (; index >= 0 && index < length; index += dir) {
                currentKey = keys ? keys[index] : index;
                nextMemo = iteratee(memo, obj[currentKey], currentKey, obj);
                if (nextMemo !== UNDEFINED) {
                    memo = nextMemo;
                }
            }
            return memo;
        };
        return function (obj, iteratee, memo, context) {
            var actualKeys = !isArrayLike(obj) && keys(obj),
                length = (actualKeys || obj)[LENGTH],
                index = dir > 0 ? 0 : length - 1;
            // Determine the initial value if none is provided.
            if (arguments[LENGTH] < 3) {
                memo = obj[actualKeys ? actualKeys[index] : index];
                index += dir;
            }
            return iterator(obj, iteratee, memo, actualKeys, index, length);
        };
    },
    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`.
    /**
     * @func
     */
    foldl = createReduce(1),
    // The right-associative version of reduce, also known as `foldr`.
    /**
     * @func
     */
    foldr = createReduce(-1),
    some = function (array, handler) {
        return foldl(array, function (memo, value, key) {
            if (handler(value, key, array)) {
                memo.push(value);
            }
            return memo;
        }, []);
    },
    _console = win.console || {},
    _log = _console.log || noop,
    // use same name so that we can ensure browser compatability
    console = extend(wrap(toArray('trace,warn,log,dir,error,clear,table,profile,profileEnd,time,timeEnd,timeStamp'), function (key) {
        var method = _console[key] || _log;
        return function () {
            return method && method.apply && method.apply(_console, arguments);
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
    }),
    // make global
    exception = console.exception,
    // mitigate
    wraptry = function (trythis, errthat, finalfunction) {
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
    },
    // directed toggle
    toggle = function (current, which) {
        if (which === UNDEFINED) {
            return !current;
        } else {
            return !!which;
        }
    },
    returns = function (thing) {
        return function () {
            return thing;
        };
    },
    returnsTrue = returns.true = returns(BOOLEAN_TRUE),
    returnsFalse = returns.false = returns(BOOLEAN_FALSE),
    returnsArray = returns.array = function () {
        return [];
    },
    returnsObject = returns.object = function () {
        return {};
    },
    returnsFirstArgument = returns.first = function (value) {
        return value;
    },
    flows = function (fromHere, toHere) {
        return function () {
            return toHere.call(this, fromHere.apply(this, arguments));
        };
    },
    is = {
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
    _ = app._ = {
        is: is,
        blockWrapper: blockWrapper,
        unwrapBlock: unwrapBlock,
        passes: passes,
        performance: performance,
        constructorWrapper: constructorWrapper,
        stringifyQuery: stringifyQuery,
        intendedObject: intendedObject,
        intendedIteration: intendedIteration,
        parseDecimal: parseDecimal,
        flatten: flatten,
        gather: gather,
        isInt: isInt,
        reverseParams: reverseParams,
        isArrayLike: isArrayLike,
        isInstance: isInstance,
        hasEnumBug: hasEnumBug,
        roundFloat: roundFloat,
        factories: factories,
        cloneJSON: cloneJSON,
        toBoolean: toBoolean,
        stringify: stringify,
        values: values,
        zip: zip,
        object: object,
        wraptry: wraptry,
        toString: toString,
        throttle: throttle,
        debounce: debounce,
        defer: defer,
        protoProperty: protoProperty,
        protoProp: protoProperty,
        sortedIndexOf: sortedIndexOf,
        indexOfNaN: indexOfNaN,
        toInteger: toInteger,
        indexOf: indexOf,
        toArray: toArray,
        isEqual: isEqual,
        isArray: isArray,
        isEmpty: isEmpty,
        returns: returns,
        isBoolean: isBoolean,
        invert: invert,
        extend: extend,
        superExtend: superExtend,
        noop: noop,
        toggle: toggle,
        reduce: foldl,
        foldl: foldl,
        foldr: foldr,
        now: now,
        some: some,
        map: map,
        result: result,
        isUndefined: isUndefined,
        isFunction: isFunction,
        isObject: isObject,
        isNumber: isNumber,
        isFinite: isFinite,
        isString: isString,
        isNull: isNull,
        isNaN: isNaN,
        notNaN: notNaN,
        eachProxy: eachProxy,
        publicize: publicize,
        allKeys: allKeys,
        evaluate: evaluate,
        parse: parse,
        merge: merge,
        clone: clone,
        bind: bind,
        bindTo: bindTo,
        bindWith: bindWith,
        duff: duff,
        duffRight: duffRight,
        eachRight: eachRight,
        iterates: iterates,
        sort: sort,
        sortBy: sortBy,
        wrap: wrap,
        uuid: uuid,
        keys: keys,
        once: once,
        each: each,
        flows: flows,
        baseClamp: baseClamp,
        has: has,
        negate: negate,
        pI: pI,
        createPredicateIndexFinder: createPredicateIndexFinder,
        findIndex: findIndex,
        findLastIndex: findLastIndex,
        validKey: validKey,
        // finder: finder,
        find: find,
        findLast: findLast,
        console: console,
        min: mathArray('min'),
        max: mathArray('max'),
        arrayLikeToArray: arrayLikeToArray,
        objectToArray: objectToArray,
        math: wrap(toArray('E,LN2,LN10,LOG2E,LOG10E,PI,SQRT1_2,SQRT2,abs,acos,acosh,asin,asinh,atan,atan2,atanh,cbrt,ceil,clz32,cos,cosh,exp,expm1,floor,fround,hypot,imul,log,log1p,log2,log10,pow,random,round,sign,sin,sinh,sqrt,tan,tanh,trunc'), function (key) {
            return Math[key];
        })
    };
app.logWrappedErrors = BOOLEAN_TRUE;
/**
 * @class Extendable
 */
function Extendable(attributes, options) {
    return this;
}
factories.Extendable = constructorWrapper(Extendable, OBJECT_CONSTRUCTOR);
// app.scope(function (app) {
app.shims = function (win) {
    var fn = function () {
        var win = this,
            lengthString = 'length';
        win.performance = win.performance || {};
        win.performance.now = (function () {
            var performance = win.performance;
            return performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
                return new Date().getTime();
            };
        })();

        function f(n) {
            return n < 10 ? "0" + n : n;
        }

        function quote(string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }

        function str(key, holder) {
            var i, k, v, length, mind = gap,
                partial, value = holder[key];
            if (value && typeof value === "object" && typeof value.toJSON === "function") {
                value = value.toJSON(key);
            }
            if (typeof rep === "function") {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null";
                }
                gap += indent;
                partial = [];
                if (Object[PROTOTYPE].toString.apply(value) === "[object Array]") {
                    length = value[lengthString];
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }
                    v = partial[lengthString] === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === "object") {
                    length = rep[lengthString];
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object[PROTOTYPE].hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                }
                v = partial[lengthString] === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
            }
        }
        if (!JSON) {
            if (typeof Date[PROTOTYPE].toJSON !== "function") {
                Date[PROTOTYPE].toJSON = function (key) {
                    return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
                };
                String[PROTOTYPE].toJSON = Number[PROTOTYPE].toJSON = Boolean[PROTOTYPE].toJSON = function (key) {
                    return this.valueOf();
                };
            }
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                gap, indent, meta = {
                    "\b": "\\b",
                    "\t": "\\t",
                    "\n": "\\n",
                    "\f": "\\f",
                    "\r": "\\r",
                    '"': '\\"',
                    "\\": "\\\\"
                },
                rep;
            if (typeof JSON.stringify !== "function") {
                JSON.stringify = function (value, replacer, space) {
                    var i;
                    gap = "";
                    indent = "";
                    if (typeof space === "number") {
                        for (i = 0; i < space; i += 1) {
                            indent += " ";
                        }
                    } else {
                        if (typeof space === "string") {
                            indent = space;
                        }
                    }
                    rep = replacer;
                    if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer[lengthString] !== "number")) {
                        throw new Error("JSON.stringify");
                    }
                    return str("", {
                        "": value
                    });
                };
            }
            if (typeof JSON.parse !== "function") {
                JSON.parse = function (text, reviver) {
                    var j;

                    function walk(holder, key) {
                        var k, v, value = holder[key];
                        if (value && typeof value === "object") {
                            for (k in value) {
                                if (Object[PROTOTYPE].hasOwnProperty.call(value, k)) {
                                    v = walk(value, k);
                                    if (v !== undefined) {
                                        value[k] = v;
                                    } else {
                                        delete value[k];
                                    }
                                }
                            }
                        }
                        return reviver.call(holder, key, value);
                    }
                    text = String(text);
                    cx.lastIndex = 0;
                    if (cx.test(text)) {
                        text = text.replace(cx, function (a) {
                            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                        });
                    }
                    if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                        j = Function[PROTOTYPE].constructor("(" + text + ")");
                        return typeof reviver === "function" ? walk({
                            "": j
                        }, "") : j;
                    }
                    throw new SyntaxError("JSON.parse");
                };
            }
        }
        if (!Function[PROTOTYPE].bind) {
            Function[PROTOTYPE].bind = function (oThis) {
                if (typeof this !== 'function') {
                    // closest thing possible to the ECMAScript 5
                    // internal IsCallable function
                    throw new TypeError('Function[PROTOTYPE].bind - what is trying to be bound is not callable');
                }
                var aArgs = Array[PROTOTYPE].slice.call(arguments, 1),
                    fToBind = this,
                    FNOP = function () {},
                    fBound = function () {
                        return fToBind.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array[PROTOTYPE].slice.call(arguments)));
                    };
                if (this[PROTOTYPE]) {
                    // native functions don't have a prototype
                    FNOP[PROTOTYPE] = this[PROTOTYPE];
                }
                fBound[PROTOTYPE] = new FNOP();
                return fBound;
            };
        }
        win.matchMedia = win.matchMedia || function () {
            // "use strict";
            // For browsers that support matchMedium api such as IE 9 and webkit
            var styleMedia = (win.styleMedia || win.media);
            // For those that don't support matchMedium
            if (!styleMedia) {
                var style = document.createElement('style'),
                    script = document.getElementsByTagName('script')[0],
                    info = null;
                style.type = 'text/css';
                style.id = 'matchmediajs-test';
                script.parentNode.insertBefore(style, script);
                // 'style.currentStyle' is used by IE <= 8 and 'win.getComputedStyle' for all other browsers
                info = ('getComputedStyle' in win) && win.getComputedStyle(style, null) || style.currentStyle;
                styleMedia = {
                    matchMedium: function (media) {
                        var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';
                        // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                        if (style.styleSheet) {
                            style.styleSheet.cssText = text;
                        } else {
                            style.textContent = text;
                        }
                        // Test if media query is true or false
                        return info.width === '1px';
                    }
                };
            }
            return function (media) {
                media = media || 'all';
                return {
                    matches: styleMedia.matchMedium(media),
                    media: media
                };
            };
        }();
    };
    fn.call(win);
};
app.shims(win);
var cacheable = function (fn) {
        var cache = {};
        return function (input) {
            if (!has(cache, input)) {
                cache[input] = fn(input);
            }
            return cache[input];
        };
    },
    categoricallyCacheable = function (fn, baseCategory) {
        var cache = {};
        return function (string, category) {
            var cacher;
            category = category || baseCategory;
            cacher = cache[category] = cache[category] || cacheable(fn(category));
            return cacher(string);
        };
    },
    string = _.extend(wrap(toArray('toLowerCase,toUpperCase,trim'), function (method) {
        return cacheable(function (item) {
            return item[method]();
        });
    }), wrap(toArray('match,search'), function (method) {
        return categoricallyCacheable(function (input) {
            return function (item) {
                return item[method](input);
            };
        });
    })),
    wrapAll = function (fn) {
        return function () {
            var args = toArray(arguments),
                ctx = this;
            return map(args[0], function (thing) {
                args[0] = thing;
                return fn.apply(ctx, args);
            });
        };
    },
    deprefix = function (str, prefix, unUpcase) {
        var nuStr = str.slice(prefix[LENGTH]),
            first = nuStr[0];
        if (unUpcase) {
            first = nuStr[0].toLowerCase();
        }
        nuStr = first + nuStr.slice(1);
        return nuStr;
    },
    deprefixAll = wrapAll(deprefix),
    prefix = function (str, prefix, camelcase, splitter) {
        var myStr = prefix + str;
        if (camelcase !== UNDEFINED) {
            myStr = prefix + (splitter || HYPHEN) + str;
            if (camelcase) {
                myStr = camelCase(myStr, splitter);
            } else {
                myStr = unCamelCase(myStr, splitter);
            }
        }
        return myStr;
    },
    prefixAll = wrapAll(prefix),
    parseObject = (function () {
        var cache = {};
        return function (string) {
            var found = cache[string];
            if (!found) {
                cache[string] = found = new Function[CONSTRUCTOR]('return ' + string);
            }
            return found();
        };
    }()),
    // uniqueId = (function () {
    //     var stash = {};
    //     var globalPrefix = 0;
    //     return function (prefix) {
    //         var value;
    //         if (prefix) {
    //             stash[prefix] = stash[prefix] || 0;
    //             ++stash[prefix];
    //             value = stash[prefix];
    //         } else {
    //             ++globalPrefix;
    //             value = globalPrefix;
    //         }
    //         return prefix ? prefix + value : value;
    //     };
    // }()),
    /**
     * @func
     */
    camelCase = categoricallyCacheable(function (splitter) {
        return function (str) {
            var i, s, val;
            if (isString(str)) {
                if (str[0] === splitter) {
                    str = str.slice(1);
                }
                s = str.split(splitter);
                for (i = s[LENGTH] - 1; i >= 1; i--) {
                    if (s[i]) {
                        s[i] = capitalize(s[i]);
                    }
                }
                val = s.join(EMPTY_STRING);
            }
            return val;
        };
    }, HYPHEN),
    /**
     * @func
     */
    capitalize = cacheable(function (s) {
        return s[0].toUpperCase() + s.slice(1);
    }),
    /**
     * @func
     */
    unCamelCase = categoricallyCacheable(function (splitter) {
        return function (str) {
            return str.replace(/([a-z])([A-Z])/g, '$1' + splitter + '$2').replace(/[A-Z]/g, function (s) {
                return s.toLowerCase();
            });
        };
    }, HYPHEN),
    snakeCase = function (string) {
        return unCamelCase(string, '_');
    },
    kebabCase = function (string) {
        return unCamelCase(string, HYPHEN);
    },
    /**
     * @func
     */
    customUnits = categoricallyCacheable(function (unitList_) {
        var lengthHash = {},
            hash = {},
            lengths = [],
            unitList = toArray(unitList_),
            sortedUnitList = unitList.sort(function (a, b) {
                var aLength = a[LENGTH],
                    bLength = b[LENGTH],
                    value = _.max([-1, _.min([1, aLength - bLength])]);
                hash[a] = hash[b] = BOOLEAN_TRUE;
                if (!lengthHash[aLength]) {
                    lengthHash[aLength] = BOOLEAN_TRUE;
                    lengths.push(aLength);
                }
                if (!lengthHash[bLength]) {
                    lengthHash[bLength] = BOOLEAN_TRUE;
                    lengths.push(bLength);
                }
                return -1 * (value === 0 ? (a > b ? -1 : 1) : value);
            });
        lengths.sort(function (a, b) {
            return -1 * _.max([-1, _.min([1, a - b])]);
        });
        return function (str_) {
            var ch, unitStr, unit,
                i = 0,
                str = (str_ + EMPTY_STRING).trim(),
                length = str[LENGTH];
            while (lengths[i]) {
                if (lengths[i] < length) {
                    unit = str.substr(length - lengths[i], length);
                    if (hash[unit]) {
                        return unit;
                    }
                }
                i++;
            }
            return BOOLEAN_FALSE;
        };
    }),
    baseUnitList = toArray('px,em,rem,ex,in,cm,%,vh,vw,pc,pt,mm,vmax,vmin'),
    units = function (str) {
        return customUnits(str, baseUnitList);
    },
    isHttp = cacheable(function (str) {
        var ret = !1,
            splitLength = str.split(DOUBLE_SLASH)[LENGTH];
        if ((str.indexOf(HTTP) === 0 && splitLength >= 2) || (str.indexOf(DOUBLE_SLASH) === 0 && splitLength === 2)) {
            ret = !0;
        }
        return ret;
    }),
    protocol = cacheable(function (url) {
        var ret = !1,
            split = str.split(DOUBLE_SLASH),
            splitLength = split[LENGTH],
            first = split.shift();
        return ret;
    }),
    parseHash_ = cacheable(function (url) {
        var hash = EMPTY_STRING,
            hashIdx = indexOf(url, '#') + 1;
        if (hashIdx) {
            hash = url.slice(hashIdx);
        }
        return hash;
    }),
    parseHash = function (url, parser) {
        var parsed = parseHash_(url);
        return parser ? parsed : parse(parsed);
    },
    itemIs = function (list, item, index) {
        return list[index || 0] === item;
    },
    startsWith = itemIs,
    parseSearch = function (search) {
        var parms, temp, items, val, converted, i = 0,
            dcUriComp = win.decodeURIComponent;
        if (!search) {
            search = win[LOCATION].search;
        }
        items = search.slice(1).split("&");
        parms = {};
        for (; i < items[LENGTH]; i++) {
            temp = items[i].split("=");
            if (temp[0]) {
                if (temp[LENGTH] < 2) {
                    temp[PUSH](EMPTY_STRING);
                }
                val = temp[1];
                val = dcUriComp(val);
                if (val[0] === "'" || val[0] === '"') {
                    val = val.slice(1, val[LENGTH] - 1);
                }
                if (val === BOOLEAN_TRUE + EMPTY_STRING) {
                    val = BOOLEAN_TRUE;
                }
                if (val === BOOLEAN_FALSE + EMPTY_STRING) {
                    val = BOOLEAN_FALSE;
                }
                if (isString(val)) {
                    converted = +val;
                    if (converted == val && converted + EMPTY_STRING === val) {
                        val = converted;
                    }
                }
                parms[dcUriComp(temp[0])] = val;
            }
        }
        return parms;
    },
    urlToString = function (object) {
        object.toString = function () {
            return object.href;
        };
        object.replace = function (newlocation) {
            var newparsed = parseUrl(newlocation);
            newparsed.previous = object;
            return newparsed;
        };
        return object;
    },
    reference = cacheable(function (str) {
        var match;
        if (!str) {
            return EMPTY_STRING;
        }
        if (!isString(str)) {
            str = str.referrer;
        }
        if (isString(str)) {
            // gives it a chance to match
            str += SLASH;
            match = str.match(/^https?:\/\/.*?\//im);
            if (match) {
                match = match[0].slice(0, match[0][LENGTH] - 1);
            }
        }
        return match || EMPTY_STRING;
    }),
    protocols = [HTTP, HTTPS].concat(toArray('file,about,javascript,ws,tel')),
    extraslashes = {
        'http:': BOOLEAN_TRUE,
        'https:': BOOLEAN_TRUE
    },
    parseUrl = function (url__, startPath_, windo_) {
        var garbage, href, origin, hostnameSplit, questionable, firstSlash, object, startPath, hostSplit, originNoProtocol, windo = windo_ || window,
            url = url__ || EMPTY_STRING,
            search = EMPTY_STRING,
            hash = EMPTY_STRING,
            host = EMPTY_STRING,
            pathname = EMPTY_STRING,
            port = EMPTY_STRING,
            hostname = EMPTY_STRING,
            searchIdx = indexOf(url, '?') + 1,
            searchObject = {},
            protocolLength = protocols[LENGTH],
            doubleSlash = SLASH + SLASH,
            protocolSplit = url.split(COLON),
            globalProtocol = windo.location.protocol,
            protocol_ = (protocolSplit[LENGTH] - 1) && (questionable = protocolSplit.shift()),
            protocol = ((protocol_ && find(protocols, function (question) {
                return question === questionable;
            }) || globalProtocol.slice(0, globalProtocol[LENGTH] - 1))) + COLON;
        if (searchIdx) {
            search = url.slice(searchIdx - 1);
            hash = parseHash_(search);
        } else {
            hash = parseHash_(url);
        }
        if (searchIdx) {
            search = search.split(hash).join(EMPTY_STRING);
            searchObject = parseSearch(search);
            url = url.slice(0, searchIdx - 1);
        }
        if (url[0] === SLASH && url[1] === SLASH) {
            protocol = windo.location.protocol;
        } else {
            while (protocolLength-- && !protocol) {
                if (url.slice(0, protocols[protocolLength][LENGTH]) === protocols[protocolLength]) {
                    protocol = protocols[protocolLength];
                }
            }
            if (!protocol) {
                protocol = HTTP;
            }
        }
        // passed a protocol
        protocolSplit = url.split(COLON);
        if (protocolSplit[LENGTH] - 1) {
            // protocolSplit
            questionable = protocolSplit.shift();
            hostSplit = protocolSplit.join(COLON).split(SLASH);
            while (!host) {
                host = hostSplit.shift();
            }
            hostnameSplit = host.split(COLON);
            hostname = hostnameSplit.shift();
            port = hostnameSplit[LENGTH] ? hostnameSplit[0] : EMPTY_STRING;
            garbage = protocolSplit.shift();
            url = protocolSplit.join(COLON).slice(host[LENGTH]);
        } else {
            host = windo.location.host;
            port = windo.location.port;
            hostname = windo.location.hostname;
        }
        startPath = windo.location.pathname.slice(1);
        if (url[0] === SLASH && url[1] !== SLASH) {
            url = url.slice(1);
            startPath = EMPTY_STRING;
        }
        if (url[0] === PERIOD) {
            url = url.slice(2);
        }
        pathname = SLASH + startPath + url;
        origin = protocol + (extraslashes[protocol] ? SLASH + SLASH : EMPTY_STRING) + hostname + (port ? COLON + port : EMPTY_STRING);
        href = origin + pathname + (search || EMPTY_STRING) + (hash || EMPTY_STRING);
        return urlToString({
            passed: url__,
            port: port,
            hostname: hostname,
            pathname: pathname,
            search: search.slice(1),
            host: host,
            hash: hash.slice(1),
            href: href,
            protocol: protocol.slice(0, protocol[LENGTH]),
            origin: origin,
            searchObject: searchObject
        });
    },
    SIXTY = 60,
    SEVEN = 7,
    THIRTY = 30,
    TWENTY_FOUR = 24,
    ONE_THOUSAND = 1000,
    THREE_HUNDRED_SIXTY_FIVE = 365,
    ONE_THOUSAND_SIXTY = ONE_THOUSAND * SIXTY,
    THREE_HUNDRED_SIXTY_THOUSAND = ONE_THOUSAND_SIXTY * SIXTY,
    EIGHTY_SIX_MILLION_FOUR_HUNDRED_THOUSAND = THREE_HUNDRED_SIXTY_THOUSAND * TWENTY_FOUR,
    SIX_HUNDRED_FOUR_MILLION_EIGHT_HUNDRED_THOUSAND = THREE_HUNDRED_SIXTY_THOUSAND * SEVEN,
    TWO_BILLION_FIVE_HUNDRED_NINETY_TWO_MILLION = THREE_HUNDRED_SIXTY_THOUSAND * THIRTY,
    THIRTY_ONE_BILLION_FIVE_HUNDRED_THIRTY_SIX_MILLION = EIGHTY_SIX_MILLION_FOUR_HUNDRED_THOUSAND * THREE_HUNDRED_SIXTY_FIVE,
    NUMBERS_LENGTH = {
        ms: 1,
        secs: ONE_THOUSAND,
        s: ONE_THOUSAND,
        mins: ONE_THOUSAND_SIXTY,
        hrs: THREE_HUNDRED_SIXTY_THOUSAND,
        days: EIGHTY_SIX_MILLION_FOUR_HUNDRED_THOUSAND,
        wks: SIX_HUNDRED_FOUR_MILLION_EIGHT_HUNDRED_THOUSAND,
        mnths: TWO_BILLION_FIVE_HUNDRED_NINETY_TWO_MILLION,
        yrs: THIRTY_ONE_BILLION_FIVE_HUNDRED_THIRTY_SIX_MILLION
    },
    timeUnits = [],
    timeUnitToNumber = foldl(NUMBERS_LENGTH, function (memo, number, unit) {
        timeUnits.push(unit);
        memo[unit] = function (input) {
            return input * number;
        };
        return memo;
    }, {}),
    weekdays = toArray('sunday,monday,tuesday,wednesday,thursday,friday,saturday'),
    months = toArray('january,feburary,march,april,may,june,july,august,september,october,november,december'),
    monthsHash = wrap(months, BOOLEAN_TRUE),
    monthsIndex = wrap(months, function (key, index) {
        return index;
    }),
    time = cacheable(function (number_) {
        var time = 0;
        duff(toArray(number_ + EMPTY_STRING), function (num_) {
            var num = num_,
                unit = customUnits(num, timeUnits),
                number = +(num.split(unit || EMPTY_STRING).join(EMPTY_STRING)),
                handler = timeUnitToNumber[unit];
            // there's a handler for this unit, adn it's not NaN
            if (number === number) {
                if (handler) {
                    number = handler(number);
                }
                time += number;
            }
        });
        return time;
    }),
    escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    },
    escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g,
    escapeChar = function (match) {
        return '\\' + escapes[match];
    },
    escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    },
    unescapeMap = invert(escapeMap),
    createEscaper = function (map) {
        var escaper = function (match) {
            return map[match];
        };
        var source = '(?:' + keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function (string) {
            string = string == NULL ? EMPTY_STRING : EMPTY_STRING + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    },
    escape = createEscaper(escapeMap),
    unescape = createEscaper(unescapeMap);
_.publicize({
    escape: escape,
    unescape: unescape,
    monthIndex: monthsIndex,
    monthHash: monthsHash,
    months: months,
    weekdays: weekdays,
    // constants
    customUnits: customUnits,
    cacheable: cacheable,
    categoricallyCacheable: categoricallyCacheable,
    // cacheable
    deprefix: deprefix,
    deprefixAll: deprefixAll,
    prefix: prefix,
    prefixAll: prefixAll,
    capitalize: capitalize,
    // capitalize: capitalize,
    unCamelCase: unCamelCase,
    spinalCase: unCamelCase,
    camelCase: camelCase,
    snakeCase: snakeCase,
    reference: reference,
    string: string,
    units: units,
    baseUnitList: baseUnitList,
    isHttp: isHttp,
    parseHash: parseHash,
    parseUrl: parseUrl,
    parseSearch: parseSearch,
    parseObject: parseObject,
    time: time,
    startsWith: startsWith,
    itemIs: itemIs
});
var STATUS = 'Status',
    STATUSES = 'statuses',
    directives = {
        creation: {},
        destruction: {}
    },
    returnsNull = returns(NULL),
    returnsObject = function () {
        return {};
    },
    returnsThird = function (one, two, three) {
        return three;
    },
    parody = function (directive, method) {
        return function (one, two, three) {
            return this.directive(directive)[method](one, two, three);
        };
    },
    iterate = function (directive, method) {
        return function (list) {
            var instance = this,
                dir = instance.directive(directive);
            duff(list, dir[method], dir);
            return instance;
        };
    },
    checkParody = function (directive, method, defaultValue) {
        var defaultIsFunction = isFunction(defaultValue);
        return function (one, two, three, four, five, six) {
            var item = this;
            return item[directive] ? item[directive][method](one, two, three, four, five, six) : (defaultIsFunction ? defaultValue(item) : defaultValue);
        };
    },
    defineDirective = function (name, creation, destruction_) {
        var alreadyCreated, err = (!isString(name) && exception('directives must be registered with a string for a name')) || (!isFunction(creation)) && exception('directives must be registered with at least a create function');
        directives.creation[name] = (alreadyCreated = directives.creation[name]) || creation;
        directives.destruction[name] = directives.destruction[name] || destruction_;
        // returns whether or not that directive is new or not
        return !alreadyCreated;
    },
    extendDirective = function (oldName, newName, handler_, destruction_) {
        var Destruction = destruction_ || returnsThird;
        var Handler = handler_ || returnsThird;
        var oldDirective = directives.creation[oldName] || exception('directives must exist before they can be extended');
        return app.defineDirective(newName, function (instance, name, third) {
            var directive = new directives.creation[oldName](instance, name, third);
            return new Handler(instance, name, directive);
        }, function (instance, name, third) {
            var directive = directives.destruction[oldName](instance, name, third);
            return Destruction(instance, name, directive);
        });
    },
    Directive = factories.Directive = factories.Extendable.extend('Directive', {
        mark: parody(STATUS, 'mark'),
        unmark: parody(STATUS, 'unmark'),
        remark: parody(STATUS, 'remark'),
        is: checkParody(STATUS, 'is', BOOLEAN_FALSE),
        directive: function (name) {
            var Handler, directive, that = this;
            if ((directive = that[name])) {
                return directive;
            }
            Handler = (that['directive:creation:' + name] || directives.creation[name] || returnsObject);
            that[name] = new Handler(that, name);
            return that[name];
        },
        directiveDestruction: function (name) {
            var result = (directives.destruction[name] || returnsNull)(this[name], this, name);
            delete this[name];
            return result;
        }
    }),
    Status = factories.Status = factories.Directive.extend(STATUS, {
        constructor: function () {
            this[STATUSES] = {};
            return this;
        },
        has: function (status) {
            return this[STATUSES][status] !== UNDEFINED;
        },
        mark: function (status) {
            var previous = this[STATUSES][status];
            this[STATUSES][status] = BOOLEAN_TRUE;
            return previous !== BOOLEAN_TRUE;
        },
        unmark: function (status) {
            var previous = this[STATUSES][status];
            this[STATUSES][status] = BOOLEAN_FALSE;
            return previous !== BOOLEAN_FALSE;
        },
        remark: function (status, direction) {
            var statusObject = this;
            var previous = statusObject[STATUSES][status];
            var result = statusObject[STATUSES][status] = direction === UNDEFINED ? !statusObject[STATUSES][status] : !!direction;
            return previous !== result;
        },
        is: function (status) {
            return !!this[STATUSES][status];
        },
        isNot: function (status) {
            return !this[STATUSES][status];
        }
    });
defineDirective(STATUS, Status[CONSTRUCTOR]);
app.defineDirective = defineDirective;
app.extendDirective = extendDirective;
_.publicize({
    directives: {
        parody: parody,
        checkParody: checkParody,
        iterate: iterate
    }
});
var COLLECTION = 'Collection',
    REVERSED = 'reversed',
    REGISTRY = 'Registry',
    DELIMITED = 'delimited',
    STRING_MANAGER = 'StringManager',
    SORTED_COLLECTION = 'Sorted' + COLLECTION;
// now we start with some privacy
app.scope(function (app) {
    var isNullMessage = 'object must not be null or ' + UNDEFINED,
        validIdMessage = 'objects in sorted collections must have either a number or string for their valueOf result',
        cannotModifyMessage = 'list cannot be modified while it is being iterated over',
        /**
         * @func
         */
        doToAll = function (handler) {
            return function (list, items, lookAfter, lookBefore, fromRight) {
                var count = 0;
                duff(items, function (item) {
                    count += remove(list, item, lookAfter, lookBefore, fromRight);
                });
                return count === list[LENGTH];
            };
        },
        remove = function (list, item, lookAfter, lookBefore, fromRight) {
            var index = indexOf(list, item, lookAfter, lookBefore, fromRight);
            if (index + 1) {
                removeAt(list, index);
            }
            index = index + 1;
            return !!index;
        },
        removeAll = doToAll(remove),
        removeAt = function (list, index) {
            return list.splice(index, 1)[0];
        },
        add = function (list, item, lookAfter, lookBefore, fromRight) {
            var value = 0,
                index = indexOf(list, item, lookAfter, lookBefore, fromRight);
            if (index === -1) {
                value = list.push(item);
            }
            return !!value;
        },
        addAll = doToAll(add),
        insertAt = function (list, item, index) {
            var len = list[LENGTH],
                lastIdx = len || 0;
            list.splice(index || 0, 0, item);
            return len !== list[LENGTH];
        },
        eq = function (list, num, caller_) {
            var n, thisNum, caller = caller_ || noop,
                items = [],
                numb = num || 0,
                isNumberResult = isNumber(numb),
                isArrayLikeResult = isArrayLike(numb);
            if (numb < 0) {
                isNumberResult = !1;
            }
            if (!list[LENGTH]) {
                return items;
            }
            if (isNumberResult) {
                items = [list[numb]];
                caller(items[0]);
            } else {
                if (isArrayLikeResult) {
                    duff(numb, function (num) {
                        var item = list[num];
                        items.push(item);
                        caller(item);
                    });
                } else {
                    items = [list[0]];
                    caller(items[0]);
                }
            }
            return items;
        },
        range = function (start, stop, step, inclusive) {
            var length, range, idx;
            if (stop == NULL) {
                stop = start || 0;
                start = 0;
            }
            if (!isFinite(start) || !isNumber(start)) {
                start = 0;
            }
            step = +step || 1;
            length = Math.max(Math.ceil((stop - start) / step), 0) + (+inclusive || 0);
            range = [];
            idx = 0;
            while (idx < length) {
                range[idx] = start;
                idx++;
                start += step;
            }
            return range;
        },
        count = function (list, runner_, ctx_, start, end) {
            var runner, obj, idx, ctx;
            if (start >= end || !isNumber(start) || !isNumber(end) || !isFinite(start) || !isFinite(end)) {
                return list;
            }
            ctx = ctx_ || this;
            runner = bindTo(runner_, ctx);
            end = Math.abs(end);
            idx = start;
            while (idx < end) {
                obj = NULL;
                if (list[LENGTH] > idx) {
                    obj = list[idx];
                }
                runner(obj, idx, list);
                idx++;
            }
            return list;
        },
        countTo = function (list, runner, ctx, num) {
            return count(list, runner, ctx, 0, num);
        },
        countFrom = function (list, runner, ctx, num) {
            return count(list, runner, ctx, num, list[LENGTH]);
        },
        /**
         * @func
         */
        closestIndex = function (array, searchElement, minIndex_, maxIndex_) {
            var currentIndex, currentElement, found,
                minIndex = minIndex_ || 0,
                maxIndex = maxIndex_ || array[LENGTH] - 1;
            while (minIndex <= maxIndex) {
                currentIndex = (minIndex + maxIndex) / 2 | 0;
                currentElement = array[currentIndex];
                // calls valueOf
                if (currentElement < searchElement) {
                    minIndex = currentIndex + 1;
                } else if (currentElement > searchElement) {
                    maxIndex = currentIndex - 1;
                } else {
                    return currentIndex;
                }
            }
            found = ~~maxIndex;
            return found;
        },
        /**
         * @func
         */
        /**
         * @func
         */
        recreateSelf = function (fn, ctx) {
            return function () {
                return new this[CONSTRUCTOR_KEY](fn.apply(ctx || this, arguments));
            };
        },
        /**
         * @func
         */
        Registry = factories[REGISTRY] = factories.Directive.extend(REGISTRY, {
            constructor: function () {
                this.reset();
                return this;
            },
            get: function (category, id) {
                var cat = this.register[category];
                return cat && cat[id];
            },
            keep: function (category, id, value) {
                var register = this.register,
                    cat = register[category] = register[category] || {};
                if (value === UNDEFINED) {
                    delete cat[id];
                } else {
                    cat[id] = value;
                }
                return this;
            },
            ungroup: function (category) {
                return this.group(category, {});
            },
            group: function (category, setter) {
                var register = this.register;
                register[category] = setter || register[category] || {};
                return register[category];
            },
            swap: function (category, id, value) {
                var cached = this.get(category, id);
                this.keep(category, id, value);
                return cached;
            },
            drop: function (category, id) {
                return this.swap(category, id);
            },
            reset: function (registry, count) {
                var cached = this.register;
                this.register = registry || {};
                return cached;
            }
        }),
        recreatingSelfCollection = toArray('eq,where,whereNot,map,results,filter,cycle,uncycle,flatten,gather'),
        eachHandlers = {
            each: duff,
            duff: duff,
            forEach: duff,
            eachCall: eachCall,
            eachCallTry: eachCallTry,
            eachRight: duffRight,
            duffRight: duffRight,
            forEachRight: duffRight,
            eachCallRight: eachCallRight
        },
        eachHandlerKeys = keys(eachHandlers),
        abstractedCanModify = toArray('add'),
        abstractedCannotModify = toArray('insertAt,remove,removeAt'),
        nativeCannotModify = toArray('pop,shift,splice'),
        reverseCollection = toArray('reverse'),
        splatHandlers = toArray('push,unshift'),
        joinHandlers = toArray('join'),
        countingCollection = toArray('count,countTo,countFrom,merge'),
        foldIteration = toArray('foldr,foldl,reduce'),
        findIteration = toArray('find,findLast,findWhere,findLastWhere'),
        indexers = toArray('indexOf'),
        foldFindIteration = foldIteration.concat(findIteration),
        marksIterating = function (fn) {
            return function (one, two, three, four, five, six) {
                var result, list = this;
                ++list.iterating;
                result = fn(list, one, two, three, four, five, six);
                --list.iterating;
                return result;
            };
        },
        wrappedCollectionMethods = extend({
            seeker: function (handler, context) {
                var list = this,
                    bound = bindTo(handler, context);
                return duffRight(list.toArray(), function (one, two, three) {
                    if (bound(one, two, three)) {
                        list.removeAt(two);
                    }
                });
            },
            slice: function (one, two) {
                return new Collection(this.toArray().slice(one, two));
            }
        }, wrap(joinHandlers, function (name) {
            return function (arg) {
                return this.toArray()[name](arg);
            };
        }), wrap(indexers.concat(abstractedCanModify), function (name) {
            return function (one, two, three, four, five) {
                var list = this;
                return _[name](list.toArray(), one, two, three, four, five);
            };
        }), wrap(splatHandlers, function (name) {
            return function (args_) {
                var args = isArray(args_) ? args_ : arguments,
                    items = this.toArray();
                return items[name].apply(items, args);
            };
        }), wrap(nativeCannotModify, function (name) {
            return function (one, two, three, four, five, six) {
                var list = this;
                if (list.iterating) {
                    return exception(cannotModifyMessage);
                }
                return list.toArray()[name](one, two, three, four, five, six);
            };
        }), wrap(abstractedCannotModify, function (name) {
            return function (one, two, three, four, five) {
                var list = this;
                if (list.iterating) {
                    return exception(cannotModifyMessage);
                }
                return _[name](list.toArray(), one, two, three, four, five);
            };
        }), wrap(reverseCollection, function (name) {
            return function () {
                var list = this;
                list.remark(REVERSED, !list.is(REVERSED));
                list.toArray()[name]();
                return list;
            };
        }), wrap(eachHandlers, function (fn) {
            return marksIterating(function (list, handler, context) {
                var args0 = list.toArray(),
                    args1 = handler,
                    args2 = arguments[LENGTH] > 1 ? context : list;
                fn(args0, args1, args2);
                return list;
            });
        }), wrap(countingCollection, function (name) {
            return marksIterating(function (list, runner, fromHere, toThere) {
                _[name](list.toArray(), runner, list, fromHere, toThere);
                return list;
            });
        }), wrap(recreatingSelfCollection, function (name) {
            return marksIterating(function (list, one, two, three) {
                return new Collection[CONSTRUCTOR](_[name](list.toArray(), one, two, three));
            });
        }), wrap(foldFindIteration, function (name) {
            return marksIterating(function (list, one, two, three) {
                return _[name](list.toArray(), one, two, three);
            });
        })),
        ret = _.publicize({
            eachCall: eachCall,
            eachCallRight: eachCallRight,
            filter: filter,
            matches: matches,
            results: results,
            add: add,
            removeAll: removeAll,
            addAll: addAll,
            insertAt: insertAt,
            removeAt: removeAt,
            remove: remove,
            cycle: cycle,
            uncycle: uncycle,
            concat: concat,
            // pluck: pluck,
            where: where,
            findWhere: findWhere,
            findLastWhere: findLastWhere,
            range: range,
            count: count,
            countTo: countTo,
            countFrom: countFrom,
            whereNot: whereNot,
            eachRight: eachRight,
            duffRight: duffRight,
            flatten: flatten,
            eq: eq
        }),
        unwrapper = function () {
            return this.items;
        },
        Collection = factories[COLLECTION] = factories.Directive.extend(COLLECTION, extend({
            get: parody(REGISTRY, 'get'),
            keep: parody(REGISTRY, 'keep'),
            drop: parody(REGISTRY, 'drop'),
            swap: parody(REGISTRY, 'swap'),
            constructor: function (items) {
                this.reset(items);
                return this;
            },
            call: function (arg) {
                this.each(function (fn) {
                    fn(arg);
                });
                return this;
            },
            obliteration: function (handler, context) {
                duffRight(this.toArray(), handler, context === UNDEFINED ? this : context);
                return this;
            },
            empty: function () {
                this.reset();
                this.directive(REGISTRY).reset();
                return this;
            },
            reset: function (items) {
                // can be array like
                var list = this,
                    old = list.toArray() || [];
                list.iterating = list.iterating ? exception(cannotModifyMessage) : 0;
                list.items = items == NULL ? [] : (Collection.isInstance(items) ? items.toArray().slice(0) : toArray(items));
                list.unmark(REVERSED);
                return list;
            },
            toArray: unwrapper,
            unwrap: unwrapper,
            length: function () {
                return this.toArray()[LENGTH];
            },
            first: function () {
                return this.toArray()[0];
            },
            last: function () {
                var items = this.toArray();
                return items[items[LENGTH] - 1];
            },
            item: function (number) {
                return this.toArray()[number || 0];
            },
            has: function (object) {
                return this.indexOf(object) !== -1;
            },
            sort: function (fn_) {
                // normalization sort function for cross browsers
                var list = this;
                sort(list.toArray(), fn_, list.is(REVERSED), list);
                return list;
            },
            sortBy: function (key, fn_) {
                // normalization sort function for cross browsers
                var list = this;
                sortBy(list.toArray(), key, fn_, list.is(REVERSED), list);
                return list;
            },
            toString: function () {
                return stringify(this.toArray());
            },
            toJSON: function () {
                return results(this.toArray(), TO_JSON);
            },
            copy: function () {
                return this.items.slice(0);
            },
            range: recreateSelf(range),
            concat: recreateSelf(function () {
                // this allows us to mix collections with regular arguments
                var base = this.toArray();
                return base.concat.apply(base, map(arguments, function (arg) {
                    return Collection(arg).toArray();
                }));
            })
        }, wrappedCollectionMethods)),
        directiveResult = app.defineDirective(COLLECTION, function () {
            return new Collection[CONSTRUCTOR]();
        }),
        appDirectiveResult = app.defineDirective(COLLECTION, function () {
            return Collection();
        }),
        SortedCollection = factories.SortedCollection = Collection.extend(SORTED_COLLECTION, {
            constructor: function (list_, skip) {
                var sorted = this;
                sorted[CONSTRUCTOR + COLON + COLLECTION]();
                if (list_ && !skip) {
                    sorted.load(isArrayLike(list_) ? list_ : [list_]);
                }
                return sorted;
            },
            reverse: function () {
                var sorted = this;
                sorted.remark(REVERSED, !sorted.is(REVERSED));
                sorted.sort();
                return sorted;
            },
            closestIndex: function (value) {
                return closestIndex(this.toArray(), value);
            },
            closest: function (value) {
                var index, list = this.toArray();
                return (index = closestIndex(list, value)) === -1 ? UNDEFINED : list[index];
            },
            validIDType: function (id) {
                return isNumber(id) || isString(id);
            },
            indexOf: function (object, min, max) {
                return smartIndexOf(this.toArray(), object, BOOLEAN_TRUE);
            },
            load: function (values) {
                var sm = this;
                if (isArray(values)) {
                    duff(values, sm.add, sm);
                } else {
                    sm.add(values);
                }
                return sm;
            },
            add: function (object) {
                var registryDirective, sorted = this,
                    isNotNull = object == NULL && exception(isNullMessage),
                    valueOfResult = object && object.valueOf(),
                    retrieved = (registryDirective = sorted[REGISTRY]) && sorted.get(ID, valueOfResult);
                if (retrieved) {
                    return BOOLEAN_FALSE;
                }
                ret = !sorted.validIDType(valueOfResult) && exception(validIdMessage);
                sorted.insertAt(object, sorted.closestIndex(valueOfResult) + 1);
                (registryDirective || sorted.directive(REGISTRY)).keep(ID, valueOfResult, object);
                return BOOLEAN_TRUE;
            },
            remove: function (object, index) {
                var where, sorted = this,
                    isNotNull = object == NULL && exception(isNullMessage),
                    valueOfResult = object && object.valueOf();
                if (object == NULL || sorted.get(ID, valueOfResult) == NULL) {
                    return BOOLEAN_FALSE;
                }
                sorted.removeAt(index === UNDEFINED ? sorted.indexOf(object) : index);
                sorted.drop(ID, valueOfResult);
                return BOOLEAN_TRUE;
            },
            pop: function () {
                var collection = this,
                    length = collection[LENGTH]();
                if (length) {
                    return collection.remove(collection.last(), length - 1);
                }
            },
            shift: function () {
                return this.remove(this.first(), 0);
            }
        }),
        StringObject = factories.StringObject = factories.Extendable.extend('StringObject', {
            constructor: function (value, parent) {
                var string = this;
                string.value = value;
                string.parent = parent;
                string.isValid(BOOLEAN_TRUE);
                return string;
            },
            toggle: function (direction) {
                this.isValid(toggle(this.isValid(), direction));
            },
            isValid: function (value) {
                var string = this;
                if (arguments[LENGTH]) {
                    if (string.valid !== value) {
                        string.parent.increment();
                        string.valid = value;
                    }
                    return string;
                } else {
                    return string.valid;
                }
            },
            valueOf: function () {
                return this.value;
            },
            toString: function () {
                var string = this,
                    value = string.value,
                    parent = string.parent;
                if (parent.indexer === UNDEFINED) {
                    return value;
                }
                if (!string.isValid()) {
                    // canibalize the list as you join
                    string.parent.drop(ID, value);
                    string.parent.removeAt(parent.indexer);
                    return EMPTY_STRING;
                }
                // is it the first
                value = parent.indexer ? parent.delimiter + value : value;
                ++parent.indexer;
                return value;
            }
        }),
        StringManager = factories[STRING_MANAGER] = SortedCollection.extend(STRING_MANAGER, {
            Child: StringObject,
            add: function (string) {
                var sm = this,
                    found = sm.get(ID, string);
                if (string) {
                    if (found) {
                        found.isValid(BOOLEAN_TRUE);
                    } else {
                        found = new sm.Child(string, sm);
                        sm.toArray().push(found);
                        sm.keep(ID, string, found);
                    }
                }
                return found;
            },
            emptyCollection: Collection[CONSTRUCTOR][PROTOTYPE].empty,
            empty: function () {
                var sm = this;
                // wipes array and id hash
                sm.emptyCollection();
                // resets change counter
                sm.current(EMPTY_STRING);
                return sm;
            },
            increment: function () {
                var collection = this;
                collection.changeCounter = collection.changeCounter || 0;
                collection.changeCounter++;
                return collection;
            },
            decrement: function () {
                var collection = this;
                collection.changeCounter = collection.changeCounter || 0;
                collection.changeCounter--;
                return collection;
            },
            remove: function (string) {
                var sm = this,
                    found = sm.get(ID, string);
                if (string && found) {
                    found.isValid(BOOLEAN_FALSE);
                }
                return sm;
            },
            toggle: function (string, direction) {
                var wasFound = BOOLEAN_TRUE,
                    sm = this,
                    found = sm.get(ID, string);
                if (!found) {
                    wasFound = BOOLEAN_FALSE;
                    found = sm.add(string);
                }
                if (direction === UNDEFINED) {
                    if (wasFound) {
                        found.toggle();
                    }
                } else {
                    found.toggle(direction);
                }
            },
            join: function (delimiter_) {
                var sliced, result, cachedValue, parent = this,
                    delimiter = (delimiter_ || EMPTY_STRING) + EMPTY_STRING,
                    parentRegistry = parent.directive(REGISTRY);
                // slice as a base array
                // set the delimiter used to join
                parent.changeCounter = parent.changeCounter || 0;
                if (parent.changeCounter) {
                    parent.changeCounter = 0;
                    parentRegistry.group(DELIMITED, {});
                }
                if ((cachedValue = parentRegistry.get(DELIMITED, delimiter)) !== UNDEFINED) {
                    return cachedValue;
                }
                sliced = parent.toArray().slice(0);
                parent.indexer = 0;
                parent.delimiter = delimiter;
                // sliced is thrown away,
                // leaving the invalidated ones to be collected
                result = sliced.join(EMPTY_STRING);
                parent.current(delimiter, result);
                delete parent.indexer;
                delete parent.delimiter;
                return result;
            },
            generate: function (delimiter_) {
                var validResult, currentDelimited, string = EMPTY_STRING,
                    parent = this,
                    delimiter = delimiter_;
                parent.changeCounter = parent.changeCounter || 0;
                if (!parent.changeCounter && (currentDelimited = parent.current(delimiter))) {
                    return currentDelimited;
                }
                parent.current(delimiter, (string = parent.join(delimiter)));
                return string;
            },
            current: function (delimiter, current) {
                var value, sm = this;
                if (arguments[LENGTH] === 1) {
                    return (value = sm.get(DELIMITED, delimiter)) === UNDEFINED ? sm.join(delimiter) : value;
                } else {
                    sm.keep(DELIMITED, delimiter, current);
                    return sm;
                }
            },
            ensure: function (value_, splitter) {
                var sm = this,
                    value = value_,
                    delimiter = splitter === UNDEFINED ? SPACE : splitter,
                    isArrayResult = isArray(value),
                    madeString = (isArrayResult ? value.join(delimiter) : value);
                if (sm.current(delimiter) === madeString) {
                    return sm;
                }
                sm.load(isArrayResult ? value : (isString(value) ? value.split(delimiter) : BOOLEAN_FALSE));
                sm.current(delimiter, madeString);
                return sm;
            },
            refill: function (array_) {
                var sm = this,
                    array = array_;
                sm.empty();
                if (array) {
                    sm.load(array);
                }
                sm.increment();
                return sm;
            }
        });
    app.defineDirective(REGISTRY, Registry[CONSTRUCTOR]);
});
var Collection = factories[COLLECTION];
var Messenger = factories.Directive.extend('Messenger', {
    constructor: function () {
        var messenger = this;
        factories.Directive[CONSTRUCTOR].apply(this, arguments);
        hash = {};
        messenger.request = function (key, arg, prefix) {
            return hash[key] && hash[key](arg);
        };
        messenger.reply = function (key, handler, prefix) {
            intendedObject(key, handler, function (key, handler) {
                hash[key] = bind(isFunction(handler) ? handler : returns(handler), NULL);
            });
            return messenger;
        };
        messenger.destroy = function () {
            hash = UNDEFINED;
        };
        return messenger;
    }
});
app.defineDirective('Messenger', Messenger);
var EVENTS_STRING = 'Events',
    DISPATCH_EVENT = 'dispatchEvent',
    EVENTS = 'EventManager',
    STOP_LISTENING = 'stopListening',
    TALKER_ID = 'talkerId',
    LISTENING_TO = 'listeningTo',
    REGISTERED = 'registered',
    LISTENING_PREFIX = 'l',
    STATE = 'state',
    HANDLERS = 'handlers';
app.scope(function (app) {
    var methodExchange = function (eventer, handler) {
            var fn = isString(handler) ? eventer[handler] : handler,
                valid = !isFunction(fn) && exception('handler must be a function or a string with a method on the originating object');
            return fn;
        },
        iterateOverList = function (eventer, directive, names, handler, args, iterator) {
            // only accepts a string or a function
            return duff(toArray(names, SPACE), function (eventName) {
                iterator(eventer, directive, directive.make(eventName, handler, eventer), args);
            });
        },
        flattenMatrix = function (iterator, _nameOrObjectIndex, expects, fills) {
            return function (first, second) {
                var args, eventsDirective, firstTimeRound = BOOLEAN_TRUE,
                    eventer = this;
                if (!first) {
                    return eventer;
                }
                if (_nameOrObjectIndex && !second) {
                    return eventer;
                }
                args = toArray(arguments);
                intendedObject(args[_nameOrObjectIndex], args[_nameOrObjectIndex + 1], function (key, value, isObj) {
                    eventsDirective = eventsDirective || eventer.directive(EVENTS);
                    if (firstTimeRound && isObj) {
                        // make room for one more
                        args.splice(_nameOrObjectIndex, _nameOrObjectIndex + 1, NULL);
                    }
                    args[_nameOrObjectIndex] = key;
                    args[_nameOrObjectIndex + 1] = value;
                    firstTimeRound = BOOLEAN_FALSE;
                    if (args[LENGTH] < expects) {
                        fills(eventer, args);
                    }
                    iterateOverList(eventer, eventsDirective, key, value, args, iterator);
                });
                return eventer;
            };
        },
        curriedEquality = function (key, original) {
            return function (e) {
                return isEqual(original, e[ORIGIN].get(key));
            };
        },
        makeHandler = function (directive, object) {
            object.fn = function (e) {
                if (e && object.comparator(e)) {
                    if (object.triggersOnce) {
                        directive.detach(object);
                    }
                    object.runner(e);
                }
            };
        },
        setupWatcher = function (nameOrObjectIndex, triggersOnce) {
            return function () {
                var context, list, args, firstArg, handlersIndex, nameOrObject, eventerDirective, original_handler, targetDirective, eventer = this,
                    ret = {};
                if (!arguments[0]) {
                    return ret;
                }
                args = toArray(arguments);
                handlersIndex = nameOrObjectIndex;
                list = args.slice(nameOrObjectIndex);
                nameOrObject = list[0];
                context = list[(isObject(nameOrObject) ? 2 : 3)] || eventer;
                if (nameOrObjectIndex && !args[0]) {
                    return ret;
                }
                eventerDirective = eventer.directive(EVENTS);
                if (nameOrObjectIndex) {
                    targetDirective = args[0].directive(EVENTS);
                } else {
                    targetDirective = eventerDirective;
                }
                intendedObject(nameOrObject, list[1], function (key_, value_, isObject_) {
                    // only allow one to be watched
                    var key = key_.split(SPACE)[0],
                        fun_things = original_handler || bind(list[isObject_ ? 1 : 2], context || eventer),
                        value = isFunction(value_) ? value_ : curriedEquality(key, value_),
                        name = CHANGE + COLON + key,
                        origin = eventer,
                        made = targetDirective.make(name, fun_things, eventer);
                    if (nameOrObjectIndex + 2 < args[LENGTH]) {
                        args.push(context);
                    }
                    if (nameOrObjectIndex) {
                        listenToModifier(eventer, eventerDirective, made, args[0]);
                    }
                    made.comparator = value;
                    made.triggersOnce = !!triggersOnce;
                    made.runner = fun_things;
                    attachEventObject(origin, targetDirective, made, [list[0], list[2], list[3]], makeHandler);
                    ret[key] = fun_things;
                });
                return ret;
            };
        },
        listenToModifier = function (eventer, targetDirective, obj, target) {
            var valid, listeningObject = retreiveListeningObject(eventer, target),
                eventsDirective = target.directive(EVENTS),
                handlers = eventsDirective[HANDLERS] = eventsDirective[HANDLERS] || {};
            listeningObject.count++;
            obj.listening = listeningObject;
            return eventsDirective;
        },
        onceModification = function (directive, obj) {
            var fn = obj.fn || obj.handler;
            obj.fn = once(function (e) {
                // much faster than using off
                directive.detach(obj);
                // ok with using apply here since it is a one time deal per event
                return fn.apply(this, arguments);
            });
        },
        attachEventObject = function (eventer, directive, evnt, args, modifier) {
            evnt.context = evnt.context || args[2];
            evnt.handler = methodExchange(eventer, evnt.handler);
            directive.attach(evnt.name, evnt, modifier);
        },
        onceHandler = function (eventer, directive, obj, args) {
            attachEventObject(eventer, directive, obj, args, onceModification);
        },
        onFillerMaker = function (count) {
            return function (eventer, args) {
                if (args[LENGTH] === count) {
                    args.push(eventer);
                }
            };
        },
        onFiller = onFillerMaker(2),
        listenToFiller = onFillerMaker(3),
        retreiveListeningObject = function (listener, talker) {
            var listenerDirective = listener.directive(EVENTS),
                talkerDirective = talker.directive(EVENTS),
                talkerId = talkerDirective[TALKER_ID],
                listeningTo = listenerDirective[LISTENING_TO],
                listening = listeningTo[talkerId];
            if (listening) {
                return listening;
            }
            // This talkerect is not listening to any other events on `talker` yet.
            // Setup the necessary references to track the listening callbacks.
            listenerDirective[TALKER_ID] = listenerDirective[TALKER_ID] || app.counter(LISTENING_PREFIX);
            listening = listeningTo[talkerId] = {
                talker: talker,
                talkerId: talkerId,
                id: listenerDirective[TALKER_ID],
                listeningTo: listeningTo,
                count: 0
            };
            return listening;
        },
        listenToHandler = function (eventer, directive, evnt, list, modifier) {
            var target = list[0];
            var targetDirective = listenToModifier(eventer, directive, evnt, target);
            evnt.handler = methodExchange(eventer, evnt.handler);
            attachEventObject(target, targetDirective, evnt, list.slice(1), modifier);
        },
        listenToOnceHandler = function (eventer, directive, obj, list) {
            listenToHandler(eventer, directive, obj, list, onceModification);
        },
        uniqueKey = 'c',
        Events = factories[EVENTS_STRING] = factories.Directive.extend(EVENTS_STRING, {
            /**
             * @description attach event handlers to the Model event loop
             * @func
             * @name Model#on
             * @param {String} str - event name to listen to
             * @param {Function|String} fn - event handler or string corresponding to handler on prototype to use for handler
             * @param {Object} context - context that the handler will run in
             * @returns {Model} instance
             */
            // uniqueKey: 'c',
            initialize: noop,
            bubble: parody(EVENTS, 'bubble'),
            // onUntil: flattenMatrix(untilHandler),
            on: flattenMatrix(attachEventObject, 0, 3, onFiller),
            once: flattenMatrix(onceHandler, 0, 3, onFiller),
            listenTo: flattenMatrix(listenToHandler, 1, 4, listenToFiller),
            listenToOnce: flattenMatrix(listenToOnceHandler, 1, 4, listenToFiller),
            watch: setupWatcher(0),
            watchOnce: setupWatcher(0, 1),
            watchOther: setupWatcher(1),
            watchOtherOnce: setupWatcher(1, 1),
            request: parody('Messenger', 'request'),
            reply: parody('Messenger', 'reply'),
            when: parody('Linguistics', 'when'),
            constructor: function (opts) {
                var eventer = this;
                extend(eventer, opts);
                eventer[uniqueKey + ID] = eventer[uniqueKey + ID] || app.counter(uniqueKey);
                // reacting to self
                eventer.on(result(eventer, 'events'));
                eventer.initialize(opts);
                return eventer;
            },
            /**
             * @description attaches an event handler to the events object, and takes it off as soon as it runs once
             * @func
             * @name Model#once
             * @param {String} string - event name that will be triggered
             * @param {Function} fn - event handler that will run only once
             * @param {Object} context - context that will be applied to the handler
             * @returns {Model} instance
             */
            /**
             * @description remove event objects from the _events object
             * @param {String|Function} type - event type or handler. If a match is found, then the event object is removed
             * @param {Function} handler - event handler to be matched and removed
             * @func
             * @name Model#off
             * @returns {Model} instance
             */
            off: function (name_, fn_, context_) {
                var context, currentObj, eventer = this,
                    name = name_,
                    events = eventer[EVENTS];
                if (!events) {
                    return;
                }
                context = isObject(name) ? fn_ : context_;
                if (arguments[LENGTH]) {
                    if (!name) {
                        each(events[HANDLERS], function (list, name) {
                            events.seekAndDestroy(list, fn_, context);
                        });
                    } else {
                        intendedObject(name, fn_, function (name, fn_) {
                            iterateOverList(eventer, events, name, fn_, [], function (eventer, directive, obj) {
                                var handlers = events[HANDLERS][obj.name];
                                return handlers && events.seekAndDestroy(handlers, obj.handler, context);
                            });
                        });
                    }
                } else {
                    currentObj = events[STACK].last();
                    if (currentObj) {
                        events.detach(currentObj);
                    }
                }
                return eventer;
            },
            // hash this out later
            stopListening: function (target, name, callback) {
                var listeningTo, notTalking, ids, targetEventsDirective, stillListening = 0,
                    origin = this,
                    originEventsDirective = origin[EVENTS];
                if (!originEventsDirective) {
                    return origin;
                }
                listeningTo = originEventsDirective[LISTENING_TO];
                notTalking = (target && !(targetEventsDirective = target[EVENTS]));
                if (notTalking) {
                    return origin;
                }
                ids = target ? [targetEventsDirective[TALKER_ID]] : keys(listeningTo);
                duff(ids, function (id) {
                    var listening = listeningTo[id];
                    if (listening) {
                        listening.talker.off(name, callback);
                    }
                    stillListening = listening[id] ? 1 : 0;
                });
                if (!stillListening && !find(target ? keys(listeningTo) : ids, function (id, key) {
                    return listeningTo[id];
                })) {
                    originEventsDirective[LISTENING_TO] = {};
                }
                return origin;
            },
            /**
             * @description triggers a event loop
             * @func
             * @name Model#fire
             * @param {String} name of the event loop to be triggered
             * @returns {Model} object instance the method is being called on
             */
            dispatchEvents: function (names) {
                var eventer = this;
                return duff(toArray(names, SPACE), eventer.dispatchStack, eventer) && eventer;
            },
            dispatchStack: function (name) {
                return this[DISPATCH_EVENT](name);
            },
            dispatchEvent: function (name, data, options) {
                var bus, evnt, eventValidation, returnValue, eventer = this,
                    eventsDirective = eventer[EVENTS];
                if (!eventsDirective || !eventsDirective.has(name) || eventsDirective.running[name] || eventsDirective.queued[name] || !(eventValidation = eventsDirective.validate(name, data, options))) {
                    return;
                }
                if (isArray(eventValidation)) {
                    name = eventValidation[0];
                    data = eventValidation[1];
                    options = eventValidation[2];
                }
                evnt = eventsDirective.create(eventer, data, name, options);
                returnValue = eventsDirective.dispatch(name, evnt);
                return returnValue;
            }
        });
});
var CHILDREN = capitalize(CHILD + 'ren'),
    CHILD_OPTIONS = CHILD + 'Options',
    CHILD_EVENTS = CHILD + EVENTS_STRING;
app.scope(function (app) {
    var Events = factories.Events,
        List = factories.Collection,
        SORT = 'sort',
        ADDED = 'added',
        UNWRAP = 'unwrap',
        REMOVED = 'removed',
        STOP_LISTENING = 'stopListening',
        _DELEGATED_CHILD_EVENTS = '_delegatedParentEvents',
        _PARENT_DELEGATED_CHILD_EVENTS = '_parentDelgatedChildEvents',
        modelMaker = function (attributes, options) {
            return Model(attributes, options);
        },
        // ties child events to new child
        _delegateChildEvents = function (parent, model) {
            var childsEventDirective, childEvents = result(parent, CHILD_EVENTS);
            if (model && childEvents) {
                childsEventDirective = model.directive(EVENTS);
                // stash them
                childsEventDirective[_PARENT_DELEGATED_CHILD_EVENTS] = childEvents;
                parent.listenTo(model, childEvents);
            }
        },
        // ties child events to new child
        _unDelegateChildEvents = function (parent, model) {
            var childsEventDirective;
            if (model && parent[STOP_LISTENING] && (childsEventDirective = model[EVENTS]) && childsEventDirective[_PARENT_DELEGATED_CHILD_EVENTS]) {
                parent[STOP_LISTENING](model, model[_PARENT_DELEGATED_CHILD_EVENTS]);
                childsEventDirective[_PARENT_DELEGATED_CHILD_EVENTS] = UNDEFINED;
            }
        },
        _delegateParentEvents = function (parent_, model) {
            var childsEventDirective, parent = model[PARENT],
                parentEvents = result(model, PARENT + 'Events');
            if (parent && parentEvents) {
                childsEventDirective = model.directive(EVENTS);
                childsEventDirective[_DELEGATED_CHILD_EVENTS] = parentEvents;
                model.listenTo(parent, parentEvents);
            }
        },
        // ties child events to new child
        _unDelegateParentEvents = function (parent, model) {
            var childsEventDirective;
            if (model[STOP_LISTENING] && (childsEventDirective = model[EVENTS]) && childsEventDirective[_DELEGATED_CHILD_EVENTS]) {
                model[STOP_LISTENING](parent, model[_DELEGATED_CHILD_EVENTS]);
                childsEventDirective[_DELEGATED_CHILD_EVENTS] = UNDEFINED;
            }
        },
        SYNCER = 'Syncer',
        wrapSyncer = function (type, successful) {
            return function (url) {
                var syncer = this,
                    type = type + 'Type';
                if (!url) {
                    exception('syncer methods must have a url');
                }
                return successful(syncer, url, type);
            };
        },
        sendWithData = function (syncer, url, type) {
            var json = syncer.toJSON();
            return factories.HTTP({
                url: url,
                type: type,
                data: syncer.stringifyPosts ? syncer.stringify(json) : json
            });
        },
        Syncer = factories.Directive.extend(SYNCER, _.extend({
            createType: 'POST',
            updateType: 'PUT',
            fetchType: 'GET',
            deleteType: 'DELETE',
            parse: parse,
            stringify: stringify,
            // base method for xhr things
            constructor: function (target) {
                this[TARGET] = target;
                return this;
            }
        }, wrap(['destroy', 'fetch', 'update', 'create'], sendWithData, BOOLEAN_TRUE))),
        SyncerDirective = app.defineDirective(SYNCER, Syncer[CONSTRUCTOR]),
        Children = factories[CHILDREN] = Collection.extend(CHILDREN, {
            constructor: function (instance) {
                this[TARGET] = instance;
                this[CONSTRUCTOR + COLON + COLLECTION]();
                return this;
            },
            // this one forcefully adds
            attach: function (model) {
                var directive = this,
                    parent = directive[TARGET],
                    // children = parent.directive(CHILDREN),
                    evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](BEFORE_COLON + ADDED);
                // let the child know it's about to be added
                // (tied to it's parent via events)
                // unties models
                directive.detach(model);
                // explicitly tie to parent
                // attach events from parent
                directive.addToHash(model);
                // ties models together
                _delegateParentEvents(parent, model);
                _delegateChildEvents(parent, model);
                evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](ADDED);
                // notify that you were added
                return model;
            },
            // lots of private events
            detach: function (model) {
                // cache the parent
                var parent, directive = this;
                // go through the model to get the correct parent
                if (!(parent = model[PARENT])) {
                    return BOOLEAN_FALSE;
                }
                // let everyone know that this object is about to be removed
                model[DISPATCH_EVENT](BEFORE_COLON + REMOVED);
                // notify the child that the remove pipeline is starting
                // remove the parent events
                _unDelegateParentEvents(parent, model);
                // have parent remove it's child events
                _unDelegateChildEvents(parent, model);
                // attach events from parent
                directive.removeFromHash(model);
                // void out the parent member tied directly to the model
                delete model[PARENT];
                // let everyone know that you've offically separated
                model[DISPATCH_EVENT](REMOVED);
                // notify the child that the remove pipeline is done
                return BOOLEAN_TRUE;
            },
            addToHash: function (newModel) {
                var children = this,
                    parent = children[TARGET];
                newModel[PARENT] = parent;
                // add to collection
                children.add(newModel);
                // register with parent
                children.keep(ID, newModel.id, newModel);
                children.keep('cid', newModel.cid, newModel);
            },
            removeFromHash: function (child) {
                var directive = this;
                if (!child) {
                    return;
                }
                // remove the child from the children hash
                directive.remove(child);
                directive.drop(ID, child.id);
                // unregister from the child hash keys
                directive.drop('cid', child.cid);
            },
            /**
             * @description resets the model's attributes to the object that is passed in
             * @name Model#reset
             * @func
             * @param {Object} attributes - non circular hash that is extended onto what the defaults object produces
             * @returns {Model} instance the method was called on
             */
            // set attrs, sync with update or create
            save: function () {},
            fetch: function () {}
        }),
        setMemo = function () {
            return {
                add: [],
                remove: [],
                update: []
            };
        },
        Parent = factories.Parent = factories.Events.extend('Parent', {
            Child: BOOLEAN_TRUE,
            childOptions: noop,
            parentEvents: noop,
            childEvents: noop,
            childConstructor: function () {
                return this.Child === BOOLEAN_TRUE ? this.__constructor__ : (this.Child || Parent);
            },
            isChildType: function (child) {
                return isInstance(child, this.childConstructor());
            },
            diff: function (opts_, secondary_) {
                var models, remove, parent = this,
                    opts = opts_,
                    secondary = secondary_ || {},
                    children = parent.directive(CHILDREN),
                    memo = setMemo(),
                    diff = Collection(opts.add).foldl(function (memo, obj) {
                        var isChildType = parent.isChildType(obj),
                            // create a new model
                            // call it with new in case they use a constructor
                            Constructor = parent.childConstructor(),
                            newModel = isChildType ? obj : new Constructor(obj, secondary.shared),
                            // unfortunately we can only find by the newly created's id
                            // which we only know for sure after the child has been created ^
                            foundModel = children.get(ID, newModel.id);
                        if (foundModel) {
                            // update the old
                            foundModel.set(isChildType ? obj[TO_JSON]() : obj);
                            memo.update.push(foundModel);
                        } else {
                            // add the new
                            children.attach(newModel);
                            memo.add.push(newModel);
                        }
                    }, opts.remove ? Collection(opts.remove).foldl(function (memo, model) {
                        var children, parent = model && model[PARENT];
                        if (!parent) {
                            return;
                        }
                        children = parent[CHILDREN];
                        if (children && children.detach(model)) {
                            memo.remove.push(model);
                        }
                    }, memo) : memo);
                if (secondary.silent) {
                    return diff;
                }
                if (diff.remove.length) {
                    parent[DISPATCH_EVENT](CHILD + COLON + REMOVED, diff);
                }
                if (diff.add.length) {
                    parent[DISPATCH_EVENT](CHILD + COLON + ADDED, diff);
                }
                if (diff.add.length || diff.remove.length) {
                    parent[DISPATCH_EVENT](CHANGE_COLON + CHILD + COLON + 'count', diff);
                }
                return diff;
            },
            // public facing version filters
            add: function (objs_, secondary_) {
                var childAdded, diff, parent = this,
                    children = parent.directive(CHILDREN),
                    secondary = extend(result(parent, CHILD_OPTIONS), secondary_ || {}),
                    list = Collection(objs_);
                // unwrap it if you were passed a collection
                if (!list[LENGTH]()) {
                    return list[UNWRAP]();
                }
                return Collection(parent.diff({
                    add: list
                }, {
                    shared: secondary
                }).add);
            },
            remove: function (idModel_) {
                var children, models, parent = this,
                    idModel = idModel_;
                if (idModel == NULL) {
                    parent = parent[PARENT];
                    return parent.remove(this);
                }
                if (!isObject(idModel) && (children = parent.directive(CHILDREN))) {
                    // it's an id
                    idModel = children.get(ID, idModel);
                }
                if (!idModel || !isObject(idModel)) {
                    return setMemo();
                }
                return Collection(parent.diff({
                    // make sure you get a copy
                    remove: (idModel && Collection.isInstance(idModel) ? idModel.toArray() : toArray(idModel)).slice(0)
                }).remove);
            },
            /**
             * @description basic sort function
             * @param {Function|String} comparator - argument to sort children against
             * @returns {Model} instance
             * @func
             * @name Model#sort
             */
            sort: function (comparator_) {
                var children, comparator, comparingAttribute, isReversed, model = this;
                if (!(children = model[CHILDREN])) {
                    return model;
                }
                comparator = comparator_ || model.comparator;
                if (isString(comparator)) {
                    isReversed = comparator[0] === '!';
                    comparingAttribute = comparator;
                    if (isReversed) {
                        comparingAttribute = comparator.slice(1);
                    }
                    comparator = function (a, b) {
                        var val_, val_A = a.get(comparingAttribute),
                            val_B = b.get(comparingAttribute);
                        if (isReversed) {
                            val_ = val_B - val_A;
                        } else {
                            val_ = val_A - val_B;
                        }
                        return val_;
                    };
                }
                children[SORT](comparator);
                model[DISPATCH_EVENT](SORT);
                return model;
            },
            destroy: function () {
                var removeRet, model = this;
                if (!model.is(DESTROYING)) {
                    // notify things like parent that it's about to destroy itself
                    model[DISPATCH_EVENT](BEFORE_DESTROY);
                }
                // actually detach
                removeRet = model[PARENT] && model[PARENT].remove(model);
                // stop listening to other views
                model[DISPATCH_EVENT](DESTROY);
                // stops listening to everything
                model.stopListening();
                return model;
            }
        }),
        /**
         * @class Model
         * @augments Events
         */
        uniqueCounter = 0,
        setId = function (model, id) {
            model.id = (id === UNDEFINED ? ++uniqueCounter : id);
            return uniqueCounter;
        },
        Model = factories.Model = factories.Parent.extend('Model', {
            // this id prefix is nonsense
            // define the actual key
            // idAttribute: ID,
            /**
             * @description remove attributes from the Model object. Does not completely remove from object with delete, but instead simply sets it to UNDEFINED / undefined
             * @param {String} attr - property string that is on the attributes object
             * @returns {Model} instance the method was called on
             * @func
             * @name Model#unset
             */
            unset: function (key) {
                var dataDirective = this[DATA];
                if (!dataDirective) {
                    return BOOLEAN_FALSE;
                }
                var result = dataDirective.unset(key);
                this.modified([key]);
                return result;
            },
            // checkParody(DATA, 'unset', BOOLEAN_FALSE),
            /**
             * @description returns attribute passed into
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {*} value that is present on the attributes object
             * @func
             * @name Model#get
             */
            get: checkParody(DATA, 'get'),
            escape: function (key) {
                return escape(this.get(key));
            },
            /**
             * @func
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {Boolean} evaluation of whether or not the Model instance has a value at that attribute key
             * @description checks to see if the current attribute is on the attributes object as anything other an undefined
             * @name Model#has
             */
            keys: checkParody(DATA, 'keys', returnsArray),
            values: checkParody(DATA, 'values', returnsArray),
            has: checkParody(DATA, 'has', BOOLEAN_FALSE),
            idAttribute: returns('id'),
            constructor: function (attributes, secondary) {
                var model = this;
                model.reset(attributes);
                this[CONSTRUCTOR + COLON + EVENTS_STRING](secondary);
                return model;
            },
            defaults: function () {
                return {};
            },
            reset: function (data_) {
                var dataDirective, childModel, hasResetBefore, children, model = this,
                    // automatically checks to see if the data is a string
                    passed = parse(data_) || {},
                    // build new data
                    defaultsResult = model.defaults(passed),
                    newAttributes = extend(defaultsResult, passed),
                    // try to get the id from the attributes
                    idAttributeResult = model.idAttribute(newAttributes),
                    idResult = setId(model, newAttributes[idAttributeResult]),
                    keysResult = keys(newAttributes);
                // set id and let parent know what your new id is
                // setup previous data
                if ((hasResetBefore = model.is(RESET))) {
                    model[DISPATCH_EVENT](BEFORE_COLON + RESET);
                }
                if (hasResetBefore || keysResult[LENGTH]) {
                    dataDirective = model.directive(DATA);
                    dataDirective[RESET](newAttributes);
                }
                // let everything know that it is changing
                model.mark(RESET);
                if (hasResetBefore) {
                    model[DISPATCH_EVENT](RESET, newAttributes);
                }
                return model;
            },
            /**
             * @description collects a splat of arguments and condenses them into a single object. Object is then extended onto the attributes object and any items that are different will be fired as events
             * @param {...*} series - takes a series of key value pairs. can be mixed with objects. All key value pairs will be placed on a new object, which is to be passed into the function below
             * @func
             * @name Model#set
             * @returns {Model} instance
             */
            destroy: function () {
                Parent.fn.destroy.call(this);
                delete this.id;
                return this;
            },
            set: function (key, value) {
                var changedList = [],
                    model = this,
                    dataDirective = model.directive(DATA),
                    previous = {},
                    eventsDirective;
                intendedObject(key, value, function (key, value) {
                    // defconinitely set the value, and let us know what happened
                    // and if you're not changing already, (already)
                    if (dataDirective.set(key, value) && !dataDirective.changing[name]) {
                        eventsDirective = eventsDirective || model.directive(EVENTS);
                        // eventsDirective.queueStack(CHANGE_COLON + key);
                        changedList.push(key);
                    }
                });
                model.modified(changedList);
                return model;
            },
            modified: function (list) {
                var dataDirective, model = this;
                // do not digest... this time
                if (!list[LENGTH]) {
                    return model;
                }
                dataDirective = model.directive(DATA);
                model.digest(function () {
                    duff(list, function (name) {
                        var eventName = CHANGE_COLON + name,
                            previous = dataDirective.changing[name];
                        dataDirective.changing[name] = BOOLEAN_TRUE;
                        model[DISPATCH_EVENT](eventName);
                        dataDirective.changing[name] = BOOLEAN_FALSE;
                    });
                });
                return model;
            },
            digest: function (handler) {
                var model = this,
                    dataDirective = model.directive(DATA);
                dataDirective.increment();
                handler();
                dataDirective.decrement();
                // this event should only ever exist here
                if (dataDirective.static()) {
                    model[DISPATCH_EVENT](CHANGE, dataDirective[CHANGING]);
                    dataDirective.finish();
                }
            },
            /**
             * @description basic json clone of the attributes object
             * @func
             * @name Model#toJSON
             * @returns {Object} json clone of the attributes object
             */
            toJSON: function () {
                // does not prevent circular dependencies.
                // swap this out for something else if you want
                // to prevent circular dependencies
                return this.clone();
            },
            clone: checkParody(DATA, 'clone', function () {
                return {};
            }),
            valueOf: function () {
                return this.id;
            },
            /**
             * @description stringified version of attributes object
             * @func
             * @name Model#stringify
             * @returns {String} stringified json version of
             */
            toString: function () {
                return stringify(this);
            }
        });
    // children should actually extend from collection.
    // it should require certain things of the children it is tracking
    // and should be able to listen to them
    // app.defineDirective(CHILDREN, function () {
    //     return new Collection[CONSTRUCTOR](NULL, BOOLEAN_TRUE);
    // });
    app.defineDirective(CHILDREN, Children[CONSTRUCTOR]);
    // trick the modelMaker into thinking it is a Model Constructor
    modelMaker[CONSTRUCTOR] = Model[CONSTRUCTOR];
});
var Model = factories.Model;
var ACTIONS = 'actions',
    PROPAGATION = 'propagation',
    UPCASED_STOPPED = 'Stopped',
    DEFAULT_PREVENTED = 'defaultPrevented',
    PROPAGATION_HALTED = PROPAGATION + 'Halted',
    PROPAGATION_STOPPED = PROPAGATION + UPCASED_STOPPED,
    IMMEDIATE_PROP_STOPPED = 'immediate' + capitalize(PROPAGATION) + UPCASED_STOPPED;
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        event_incrementer = 1,
        Collection = factories.Collection,
        listeningCounter = 0,
        returnsId = function () {
            return this.id;
        },
        PASSED_DATA = 'passedData',
        ObjectEvent = factories.ObjectEvent = factories.Directive.extend('ObjectEvent', {
            constructor: function (data, target, name, options, when) {
                var evnt = this;
                evnt.unmark(PROPAGATION_HALTED);
                evnt.unmark(PROPAGATION_STOPPED);
                evnt.unmark(IMMEDIATE_PROP_STOPPED);
                // evnt[PROPAGATION_HALTED] = evnt[PROPAGATION_STOPPED] = evnt[IMMEDIATE_PROP_STOPPED] = BOOLEAN_FALSE;
                evnt[ORIGIN] = target;
                evnt[NAME] = name;
                evnt[TYPE] = name.split(COLON)[0];
                evnt.timestamp = now();
                evnt.timeStamp = when || evnt.timestamp;
                evnt[PASSED_DATA] = {};
                evnt.data(data);
                if (options) {
                    extend(evnt, options);
                }
                return evnt;
            },
            isStopped: function () {
                return this.is(PROPAGATION_STOPPED) || this.is(IMMEDIATE_PROP_STOPPED);
            },
            data: function (datum) {
                return arguments[LENGTH] ? this.set(datum) : this[PASSED_DATA];
            },
            get: function (key) {
                return this[PASSED_DATA][key];
            },
            set: function (data) {
                var evnt = this;
                evnt[PASSED_DATA] = isObject(data) ? data : {};
                return evnt;
            },
            stopImmediatePropagation: function () {
                this.stopPropagation();
                this.mark(IMMEDIATE_PROP_STOPPED);
                this.mark(PROPAGATION_HALTED);
            },
            stopPropagation: function () {
                this.mark(PROPAGATION_STOPPED);
            },
            preventDefault: function () {
                this[DEFAULT_PREVENTED] = BOOLEAN_TRUE;
            },
            defaultIsPrevented: function () {
                return this[DEFAULT_PREVENTED];
            },
            action: function (fn) {
                var evnt = this;
                evnt.directive(ACTIONS).push(fn);
                return evnt;
            },
            finished: function () {
                var actions, evnt = this;
                evnt.mark(FINISHED);
                // evnt.isFinished = BOOLEAN_FALSE;
                if (evnt.defaultIsPrevented()) {
                    return;
                }
                if ((actions = evnt[ACTIONS])) {
                    actions.call(evnt);
                }
            }
        }),
        EventsDirective = factories.EventsDirective = factories.Directive.extend('EventsDirective', {
            cancelled: _.noop,
            validate: returns(BOOLEAN_TRUE),
            constructor: function (target) {
                var eventsDirective = this;
                eventsDirective.target = target;
                eventsDirective.listenId = 'l' + (++listeningCounter);
                eventsDirective.handlers = {};
                eventsDirective.listeningTo = {};
                eventsDirective.running = {};
                eventsDirective.queued = {};
                eventsDirective.stack = Collection();
                eventsDirective.removeQueue = Collection();
                eventsDirective.proxyStack = Collection();
                eventsDirective.proxyStack.unmark('dirty');
                return eventsDirective;
            },
            attach: function (name, eventObject, modifier) {
                var list, eventsDirective = this,
                    handlers = eventsDirective[HANDLERS];
                eventObject.id = ++event_incrementer;
                eventObject.valueOf = returnsId;
                eventObject.context = eventObject.context || eventObject.origin;
                if (modifier && isFunction(modifier)) {
                    modifier(eventsDirective, eventObject);
                }
                eventObject.fn = bind(eventObject.fn || eventObject.handler, eventObject.context);
                // attach the id to the bound function because that instance is private
                list = handlers[name] = handlers[name] || Collection();
                // attaching name so list can remove itself from hash
                list[NAME] = name;
                // attached so event can remove itself
                eventObject.list = list;
                eventsDirective.add(list, eventObject);
            },
            create: function (target, data, name, options) {
                return ObjectEvent(data, target, name, options);
            },
            make: function (name, handler, origin) {
                return {
                    disabled: BOOLEAN_FALSE,
                    namespace: name && name.split && name.split(COLON)[0],
                    name: name,
                    handler: handler,
                    origin: origin
                };
            },
            seekAndDestroy: function (list, handler, context) {
                var obj, events = this,
                    array = list.toArray(),
                    i = array[LENGTH] - 1;
                for (; i >= 0; i--) {
                    obj = array[i];
                    if (!obj.disabled && (!handler || obj.handler === handler) && (!context || obj.context === context)) {
                        events.detach(obj, i);
                    }
                }
            },
            nextBubble: function (start) {
                return start.parent;
            },
            bubble: function (evnt, data, options) {
                var previous, events = this,
                    start = events.target,
                    list = [start],
                    next = start;
                while (next) {
                    previous = next;
                    next = events.nextBubble(previous, list);
                    if (next) {
                        list.push(next);
                    }
                    if (previous === next) {
                        exception('bubbling discerners must return a different object each time it is run');
                    }
                }
                duff(list, function (target) {
                    target[DISPATCH_EVENT](evnt, data, options);
                });
                return start;
            },
            add: function (list, evnt) {
                list.push([evnt]);
            },
            remove: function (list, evnt, index) {
                list.removeAt(evnt, index);
            },
            detachCurrent: function () {
                return this.detach(this[STACK].last());
            },
            detach: function (evnt, index) {
                var listeningTo, events = this,
                    listening = evnt.listening,
                    list = evnt.list,
                    disabled = evnt.disabled = BOOLEAN_TRUE;
                if (evnt.removed) {
                    return BOOLEAN_TRUE;
                }
                evnt.removed = BOOLEAN_TRUE;
                events.remove(list, evnt, index);
                // disconnect it from the list above it
                // we don't care about deleting here
                // because no one should have access to it.
                evnt.list = UNDEFINED;
                events.wipe(list);
                // check to see if it was a listening type
                if (listening) {
                    // if it was then decrement it
                    listening.count--;
                    // if that is the extent of the listening events, then detach it completely
                    if (!listening.count) {
                        listeningTo = listening.listeningTo;
                        listeningTo[listening[TALKER_ID]] = UNDEFINED;
                    }
                }
                return BOOLEAN_TRUE;
            },
            wipe: function (list) {
                if (list[LENGTH]()) {
                    return BOOLEAN_FALSE;
                }
                this.scrub(list);
                return BOOLEAN_TRUE;
            },
            scrub: function (list) {
                list.scrubbed = BOOLEAN_TRUE;
                delete this[HANDLERS][list[NAME]];
            },
            reset: function () {
                return each(this.handlers, this.scrub, this);
            },
            queue: function (stack, handler, evnt) {
                return stack.toArray().push(handler);
            },
            unQueue: function (stack, handler, evnt) {
                return stack.pop();
            },
            has: function (key) {
                return !!((this.handlers[key] && this.handlers[key][LENGTH]()) || this.proxyStack[LENGTH]());
            },
            dispatch: function (name, evnt) {
                var subset, subLength, handler, i = 0,
                    events = this,
                    stack = events[STACK],
                    handlers = events[HANDLERS],
                    list = handlers[name],
                    running = events.running,
                    // prevents infinite loops
                    cached = running[name],
                    stopped = evnt.is(PROPAGATION_STOPPED),
                    bus = events.proxyStack;
                // make sure setup is proper
                if (cached) {
                    return exception('cannot stack events coming from the same object');
                }
                if (stopped || !list || !list[LENGTH]()) {
                    return;
                }
                running[name] = BOOLEAN_TRUE;
                subset = events.subset(list.toArray(), evnt);
                subLength = subset[LENGTH];
                for (; i < subLength && !stopped; i++) {
                    handler = subset[i];
                    if (!handler.disabled && events.queue(stack, handler, evnt)) {
                        handler.fn(evnt);
                        events.unQueue(stack, handler, evnt);
                    }
                    stopped = !!evnt.is(PROPAGATION_HALTED);
                }
                if (stopped) {
                    events.cancelled(stack, evnt);
                } else {
                    bus.eachCall('run', evnt);
                }
                evnt.finished();
                running[name] = !!cached;
                return evnt.returnValue;
            },
            subset: function (list) {
                return list.slice(0);
            },
            addBus: function (key, target, prefix, filter) {
                var bus, eventer = this,
                    proxyStack = eventer.proxyStack;
                if (!(bus = proxyStack.get(key))) {
                    if (eventer.target === target) {
                        exception('bus target cannot be the same as delegated target');
                    }
                    bus = {
                        prefix: prefix || EMPTY_STRING,
                        target: target,
                        filter: filter || returnsTrue,
                        run: function (evnt) {
                            if (!this.filter(evnt)) {
                                return;
                            }
                            this.target[DISPATCH_EVENT](this.prefix ? (this.prefix + evnt.name) : evnt.name, evnt);
                        }
                    };
                    proxyStack.push(bus);
                    proxyStack.keep(ID, key, bus);
                }
                return this;
            },
            removeBus: function (key) {
                var eventer = this,
                    proxyStack = eventer.proxyStack;
                if ((bus = proxyStack.get(key))) {
                    proxyStack.remove(bus);
                    proxyStack.drop(ID, key);
                    bus.filter = returnsFalse;
                }
                return !!bus;
            }
        });
    app.defineDirective(EVENTS, factories.EventsDirective[CONSTRUCTOR]);
});
app.scope(function (app) {
    var CHANGE_COUNTER = 'counter',
        DataDirective = factories.DataDirective = factories.Directive.extend('DataDirective', {
            constructor: function () {
                var dataDirective = this;
                dataDirective[CURRENT] = {};
                dataDirective.previous = {};
                dataDirective[CHANGING] = {};
                dataDirective[CHANGE_COUNTER] = 0;
                return dataDirective;
            },
            set: function (key, newValue) {
                var dataDirective = this,
                    current = dataDirective[CURRENT];
                if (!isEqual(current[key], newValue)) {
                    dataDirective.previous[key] = current[key];
                    dataDirective[CURRENT][key] = newValue;
                    return BOOLEAN_TRUE;
                }
                return BOOLEAN_FALSE;
            },
            get: function (key) {
                return this[CURRENT][key];
            },
            clone: function () {
                return clone(this[CURRENT]);
            },
            unset: function (key) {
                var current = this[CURRENT],
                    previous = current[key];
                return (delete current[key]) && previous !== UNDEFINED;
            },
            reset: function (hash) {
                this[CURRENT] = hash || {};
                return this;
            },
            increment: function () {
                this[CHANGE_COUNTER] += 1;
                return this;
            },
            decrement: function () {
                this[CHANGE_COUNTER] -= 1;
                return this;
            },
            static: function () {
                return !this[CHANGE_COUNTER];
            },
            finish: function () {
                this[PREVIOUS] = {};
                this[CHANGING] = {};
                return this;
            },
            reach: function (key) {
                var lastkey, previous, dataDirective = this,
                    current = dataDirective[CURRENT];
                return duff(toArray(key, PERIOD), function (key, index, path) {
                    var no_more = index === path[LENGTH];
                    lastkey = key;
                    if (!no_more) {
                        current = isObject(current[key]) ? current[key] : {};
                    }
                }) && (isString(lastkey) ? UNDEFINED : current[lastkey]);
            },
            has: function (key) {
                return this[CURRENT][key] !== UNDEFINED;
            },
            each: function (fn) {
                return each(this[CURRENT], fn, this);
            }
        });
    app.defineDirective(DATA, DataDirective[CONSTRUCTOR]);
});

app.scope(function (app) {
    var SUCCESS = 'success',
        REGISTERED = 'registered',
        STATE = 'state',
        EVERY = 'every',
        FAILURES = 'failures',
        COUNTER = 'counter',
        GROUP_INDEX = 'groupIndex',
        LINGUISTICS = 'Linguistics',
        curriedEquivalence = function (value) {
            return function (current) {
                return isEqual(current, value);
            };
        },
        curriedGreaterThan = function (value) {
            return function (current) {
                return current > value;
            };
        },
        curriedLessThan = function (value) {
            return function (current) {
                return current < value;
            };
        },
        push = function (where) {
            return function (fn) {
                var sequencer = this;
                sequencer[where].push(bind(fn, sequencer));
                return sequencer;
            };
        },
        addValue = function (constant1, constant2) {
            return function () {
                var sequencer = this;
                duff(arguments, function (value) {
                    sequencer.add(value, constant1, constant2);
                });
                return sequencer;
            };
        },
        isNot = addValue(BOOLEAN_TRUE),
        makeLogic = function (context, key, handler, negate) {
            var bound = bind(handler, context),
                negative_bound = negate ? _.negate(bound) : bound;
            return {
                key: key,
                context: context,
                handler: handler,
                fn: negative_bound
            };
        },
        abstractedStopListening = function () {
            this.stopListening();
        },
        Linguistics = factories.Linguistics = factories.Events.extend(LINGUISTICS, {
            then: push(SUCCESS),
            always: push(EVERY),
            otherwise: push(FAILURES),
            is: addValue(),
            isnt: isNot,
            isNot: isNot,
            isGreaterThan: addValue(BOOLEAN_FALSE, curriedGreaterThan),
            isLessThan: addValue(BOOLEAN_FALSE, curriedLessThan),
            isNotGreaterThan: addValue(BOOLEAN_TRUE, curriedGreaterThan),
            isNotLessThan: addValue(BOOLEAN_TRUE, curriedLessThan),
            constructor: function (origin) {
                var sequencer = this;
                sequencer.origin = origin;
                sequencer[COUNTER] = 0;
                sequencer[GROUP_INDEX] = -1;
                sequencer[REGISTERED] = {};
                sequencer.logic = new Collection[CONSTRUCTOR]();
                sequencer[SUCCESS] = new Collection[CONSTRUCTOR]();
                sequencer[FAILURES] = new Collection[CONSTRUCTOR]();
                sequencer[EVERY] = new Collection[CONSTRUCTOR]();
                sequencer.group();
                sequencer.listenTo(sequencer.origin, {
                    change: 'apply',
                    destroy: abstractedStopListening
                });
                return this;
            },
            when: function (key) {
                return this[PARENT] ? this[PARENT].when(key) : exception('this sequencer has been destroyed');
            },
            and: function (key) {
                var sequencer = this;
                sequencer[CURRENT] = key;
                sequencer.bind(key);
                return sequencer;
            },
            or: function (key) {
                this.group();
                this.and(key);
                return this;
            },
            group: function () {
                var sequencer = this;
                ++sequencer[GROUP_INDEX];
                sequencer.logic.push({
                    index: sequencer[GROUP_INDEX],
                    list: new Collection[CONSTRUCTOR]()
                });
                return sequencer;
            },
            increment: function () {
                ++this[COUNTER];
            },
            bind: function (target) {
                var sequencer = this,
                    registered = sequencer[REGISTERED];
                if (!registered[target]) {
                    registered[target] = BOOLEAN_TRUE;
                    this.listenTo(this.origin, CHANGE_COLON + target, sequencer.increment);
                }
            },
            unbind: function (target) {
                var sequencer = this,
                    registered = sequencer[REGISTERED];
                if (registered[target]) {
                    registered[target] = BOOLEAN_FALSE;
                    this[STOP_LISTENING](this.origin, CHANGE_COLON + target, sequencer.increment);
                }
            },
            value: function (value, defaultFn) {
                return isFunction(value) ? value : defaultFn(value);
            },
            add: function (value_, negate, defaultFn) {
                var object, sequencer = this;
                var current = sequencer[CURRENT];
                var value = sequencer.value(value_, defaultFn || curriedEquivalence);
                var made = makeLogic(sequencer, current, value, negate);
                sequencer.logic.item(sequencer[GROUP_INDEX]).list.push(made);
                return sequencer;
            },
            check: function () {
                var sequencer = this;
                return !!(sequencer[COUNTER] && sequencer.logic.find(function (group) {
                    return !group.list.find(function (item) {
                        return !item.fn(sequencer.origin.get(item.key));
                    });
                }));
            },
            restart: function () {
                this[COUNTER] = 0;
                return this;
            },
            handle: function (key, arg) {
                var sequencer = this;
                var ret = sequencer[key] && sequencer[key].call(arg);
                return sequencer;
            },
            run: function () {
                var sequencer = this;
                if (sequencer[STATE]) {
                    sequencer.handle(SUCCESS);
                } else {
                    sequencer.handle(FAILURES);
                }
                sequencer.handle(EVERY);
            },
            apply: function () {
                var sequencer = this,
                    checked = sequencer.check();
                sequencer.restart();
                if (sequencer[STATE] !== checked) {
                    sequencer[STATE] = checked;
                    sequencer.run();
                }
                return sequencer;
            }
        }),
        LINGUISTICS_MANAGER = LINGUISTICS + 'Manager',
        LinguisticsManager = factories[LINGUISTICS_MANAGER] = factories.Model.extend(LINGUISTICS_MANAGER, {
            when: function (key) {
                var newish = new Linguistics[CONSTRUCTOR](this.target);
                this.add(newish);
                return newish.and(key);
            },
            constructor: function (target) {
                // save it for later
                this.target = target;
                return this;
            }
        });
    app.defineDirective(LINGUISTICS, LinguisticsManager[CONSTRUCTOR]);
});
var PROMISE = 'Promise';
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        FAILURE = 'failure',
        SUCCESS = 'success',
        PENDING = 'pending',
        STATE = 'state',
        CATCH = 'catch',
        ALWAYS = 'always',
        REASON = 'reason',
        FULFILLED = 'fulfilled',
        SETTLED = 'settled',
        REJECTED = 'rejected',
        EMPTYING = 'emptying',
        UP_CATCH = capitalize(CATCH),
        EMPTYING_CATCH = EMPTYING + UP_CATCH,
        ALL_STATES = 'allStates',
        STASHED_ARGUMENT = 'stashedArgument',
        STASHED_HANDLERS = 'stashedHandlers',
        LISTENING = 'listening',
        flatten = _.flatten,
        bind = _.bind,
        isString = _.isString,
        intendedObject = _.intendedObject,
        duff = _.duff,
        each = _.each,
        extend = _.extend,
        toArray = _.toArray,
        isFunction = _.isFunction,
        foldl = _.foldl,
        result = _.result,
        wraptry = _.wraptry,
        indexOf = _.indexOf,
        executeHandlers = function (promise, obj) {
            var handler, catches = [],
                lastCaught,
                catchesCanRun, arg = promise[STASHED_ARGUMENT],
                handlers = promise[STASHED_HANDLERS],
                countLimit = handlers[LENGTH],
                callIt = function () {
                    if (handler.key === CATCH) {
                        catches.push(handler);
                        if (lastCaught) {
                            catchIt(lastCaught);
                        }
                        return;
                    }
                    if (obj[handler.key]) {
                        handler.fn(arg);
                    }
                },
                catchIt = function (e) {
                    lastCaught = e;
                    catchesCanRun = BOOLEAN_TRUE;
                    var catching = catches.slice(0);
                    catches = [];
                    eachCallTry(catching, 'fn', lastCaught);
                };
            if (handlers && handlers[LENGTH]) {
                promise.mark(EMPTYING);
                while (handlers[0] && --countLimit >= 0) {
                    handler = handlers.shift();
                    // should already be bound to promise
                    wraptry(callIt, catchIt);
                }
                if (catchesCanRun) {
                    catchIt(lastCaught);
                }
                promise.unmark(EMPTYING);
            }
            return promise;
        },
        unknownStateErrorMessage = 'promise cannot resolve to an unknown or invalid ("", false, null, 0, etc.) state. Please check your resolution tree as well as your resolveAs method input',
        dispatch = function (promise, name, opts_) {
            var finalName = name,
                allstates = result(promise, ALL_STATES),
                collected = {},
                opts = arguments[LENGTH] === 2 ? (has(promise, STASHED_ARGUMENT) ? promise[STASHED_ARGUMENT] : promise[REASON]) : opts_,
                collectedKeys = [];
            if (!isString(finalName)) {
                exception(unknownStateErrorMessage);
            }
            do {
                if (collected[finalName]) {
                    // check for circularity
                    finalName = BOOLEAN_FALSE;
                } else {
                    if (finalName === SUCCESS) {
                        fulfillment(promise, BOOLEAN_TRUE);
                        promise[STASHED_ARGUMENT] = opts;
                    }
                    if (finalName === FAILURE) {
                        fulfillment(promise, BOOLEAN_FALSE);
                        promise[REASON] = opts;
                    }
                    if (allstates[finalName]) {
                        if (!collected[finalName]) {
                            collected[finalName] = BOOLEAN_TRUE;
                            collectedKeys.push(finalName);
                            finalName = allstates[finalName];
                        } else {
                            // terminate the chain
                            finalName = BOOLEAN_FALSE;
                        }
                    } else {
                        // terminate the chain
                        exception(1 + unknownStateErrorMessage);
                    }
                }
            } while (isString(finalName));
            // promise.resolutionChain = collected;
            return collectedKeys[LENGTH] ? executeHandlers(promise, collected, opts) : exception(unknownStateErrorMessage);
        },
        addHandler = function (key) {
            // if you haven't already attached a method, then do so now
            if (!this[key]) {
                this[key] = function () {
                    return this.handle(key, toArray(arguments));
                };
            }
            return this;
        },
        checkAll = function () {
            var notSuccessful, allSettled = BOOLEAN_TRUE,
                parent = this,
                collection = parent.directive(COLLECTION),
                argumentAggregate = [],
                found = collection.find(function (child) {
                    notSuccessful = notSuccessful || child.is(REJECTED);
                    allSettled = allSettled && child.is(SETTLED);
                    argumentAggregate.push(child[STASHED_ARGUMENT]);
                    return notSuccessful;
                });
            if (notSuccessful) {
                parent.resolveAs(FAILURE, found[REASON]);
            } else {
                // none were found that were not resolved
                if (allSettled) {
                    parent.resolveAs(SUCCESS, argumentAggregate);
                }
            }
            return parent;
        },
        checkAny = function () {
            var first, parent = this,
                collection = parent.directive(COLLECTION);
            if ((first = collection.find(function (child) {
                return child.is(SETTLED);
            }))) {
                parent.resolveAs(first[STATE], first[STASHED_ARGUMENT]);
            }
            return parent;
        },
        baseStates = {
            success: ALWAYS,
            failure: ALWAYS,
            catch: BOOLEAN_TRUE,
            always: BOOLEAN_TRUE
        },
        collect = function (promise, list) {
            var collection = promise.directive(COLLECTION);
            flatten(list, BOOLEAN_TRUE, function (pro) {
                if (promise.isChildType(pro)) {
                    collection.add(pro);
                    collection.keep('cid', pro.cid, pro);
                }
            });
        },
        listen = function (promise, unbound) {
            var bound = bind(unbound, promise),
                collection = promise.directive(COLLECTION);
            collection.each(function (pro) {
                if (collection.get(LISTENING, pro.cid)) {
                    return;
                }
                collection.keep(LISTENING, pro.cid, BOOLEAN_TRUE);
                pro.always(function () {
                    bound();
                });
            });
        },
        distillAllRaces = function (check) {
            return function () {
                var promise = this;
                if (promise[STATE] !== PENDING) {
                    return promise;
                }
                collect(promise, arguments);
                listen(promise, check);
                return promise;
            };
        },
        fulfillment = function (promise, bool) {
            promise.remark(FULFILLED, bool);
            promise.remark(REJECTED, !bool);
        },
        Events = factories.Events,
        Promise = factories.Promise = _.Promise = Events.extend('Promise', {
            addHandler: addHandler,
            fulfillKey: 'success',
            rejectKey: 'reject',
            auxiliaryStates: returns(BOOLEAN_FALSE),
            constructor: function (handler) {
                var promise = this;
                promise.state = PENDING;
                promise[STASHED_HANDLERS] = [];
                promise[REASON] = BOOLEAN_FALSE;
                Events[CONSTRUCTOR].call(promise);
                // cannot have been resolved in any way yet
                // attach some convenience handlers to the
                // instance so we can call crazy custom methods
                intendedObject(extend({}, baseStates, result(promise, 'associativeStates')), NULL, addHandler, promise);
                // add passed in success handlers
                // i do not understand this line,
                // but it is part of the js spec
                if (handler) {
                    handler(bind(promise.fulfill, promise), bind(promise.reject, promise), bind(promise.resolveAs, promise));
                }
                // return the promise
                return promise;
            },
            isChildType: function (promise) {
                return promise[SUCCESS] && promise[FAILURE] && promise[ALWAYS] && promise[CATCH];
            },
            allStates: function () {
                return extend({}, baseStates, result(this, 'auxiliaryStates'));
            },
            resolveAs: function (resolveAs_, opts_) {
                var dispatched, opts = opts_,
                    resolveAs = resolveAs_,
                    promise = this;
                if (promise.is(SETTLED)) {
                    return promise;
                }
                promise.mark(SETTLED);
                promise.state = resolveAs || FAILURE;
                resolveAs = promise.state;
                promise[DISPATCH_EVENT](BEFORE_COLON + 'resolve');
                dispatched = dispatch(promise, resolveAs, opts);
                return promise;
            },
            fulfill: function (opts) {
                return this.resolveAs(SUCCESS, opts);
            },
            resolve: function (opts) {
                return this.fulfill(opts);
            },
            reject: function (reason) {
                return this.resolveAs(FAILURE, reason);
            },
            when: function () {
                return this.all(arguments);
            },
            thenable: function () {
                return Promise.apply(NULL, arguments);
            },
            then: function (one, two, three) {
                var promise = this;
                var thenable = promise.thenable.apply(promise, arguments);
                promise.always(function (value) {
                    return promise.is(FULFILLED) ? thenable.resolve(value) : thenable.reject(value);
                });
                return thenable;
            },
            all: distillAllRaces(checkAll),
            race: distillAllRaces(checkAny),
            stash: intendedApi(function (name, list) {
                var promise = this,
                    stashedHandlers = promise[STASHED_HANDLERS];
                // do the hard work now so later you can
                // iterate through the stack quickly
                flatten(isFunction(list) ? [list] : list, BOOLEAN_TRUE, function (fn) {
                    if (!isFunction(fn)) {
                        return;
                    }
                    stashedHandlers.push({
                        key: name,
                        fn: bind(fn, promise),
                        handler: fn
                    });
                });
            }),
            handle: intendedApi(function (name, fn_) {
                var promise = this,
                    arg = promise[STASHED_ARGUMENT],
                    fn = fn_;
                promise.stash(name, fn);
                if (promise.is(SETTLED)) {
                    // could be anywhere on the stack chain
                    dispatch(promise, promise[STATE]);
                }
            })
        }),
        PromisePrototype = Promise[CONSTRUCTOR][PROTOTYPE],
        resulting = PromisePrototype.addHandler(SUCCESS).addHandler(FAILURE).addHandler(ALWAYS).addHandler(CATCH),
        appPromise = Promise(),
        instanceExposure = function (key) {
            return function () {
                var promise = Promise();
                return promise.race.apply(promise, arguments);
            };
        };
    app.extend({
        dependency: bind(appPromise.all, appPromise)
    });
    Promise.all = instanceExposure('all');
    Promise.race = instanceExposure('race');
});
var Promise = _.Promise;
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        ITEMS = 'items',
        DATASET = DATA + 'set',
        IS_ELEMENT = 'isElement',
        extend = _.extend,
        isObject = _.isObject,
        removeAt = _.removeAt,
        objectToString = {}.toString,
        Associator = factories.Associator = factories.Directive.extend('Associator', {
            get: function (obj, type) {
                var returnData, idxOf, dataset, n, key, instance = this,
                    canRead = 0,
                    data = {},
                    objIsObj = isObject(obj),
                    current = instance.sameType(obj, objIsObj),
                    els = current[ITEMS] = current[ITEMS] || [],
                    eldata = current[__ELID__] = current[__ELID__] || {},
                    dataArray = current[DATA] = current[DATA] || [];
                if (objIsObj) {
                    if (obj && current.readData) {
                        key = obj[__ELID__] = obj[__ELID__] || app.counter();
                        if (key) {
                            data = eldata[key] = eldata[key] || {};
                        }
                    } else {
                        idxOf = current[ITEMS][INDEX_OF](obj);
                        if (idxOf === UNDEFINED || idxOf === -1) {
                            idxOf = current[ITEMS][LENGTH];
                            current[ITEMS].push(obj);
                            dataArray[idxOf] = data;
                        }
                        data = dataArray[idxOf];
                    }
                } else {
                    current[__ELID__][obj] = current[__ELID__][obj] || {};
                    data = current[__ELID__][obj];
                }
                data.target = obj;
                return data;
            },
            /**
             * @func
             * @name Associator#set
             * @param {Node} el - Element to store data against
             * @param {Object} obj - object to extend onto current data
             * @param {String} [type] - toString evaluation of element, if it has already been evaluated
             * @returns {Object} data that is being held on the Associator
             */
            set: function (el, extensor, type) {
                var n, data = this.get(el, type);
                extend(data, extensor || {});
                return data;
            },
            remove: function (el) {
                var idx, type = this.sameType(el);
                if (type.readData) {
                    idx = el[__ELID__];
                    delete type[__ELID__][idx];
                } else {
                    idx = _[INDEX_OF](type[ITEMS], el);
                    if (idx !== -1) {
                        removeAt(type[DATA], idx);
                        removeAt(type[ITEMS], idx);
                    }
                }
            },
            /**
             * @func
             * @name Associator#sameType
             * @param {Object} obj - object to find matched types against
             */
            sameType: function (obj, isObj_) {
                var instance = this,
                    isObj = isObj_ === UNDEFINED ? isObject(obj) : isObj_,
                    type = objectToString.call(obj),
                    isWindow = obj && obj.window === obj,
                    lowerType = isWindow ? '[object global]' : type.toLowerCase(),
                    current = instance[lowerType] = instance[lowerType] || {},
                    globalindex = lowerType[INDEX_OF]('global'),
                    indexOfWindow = lowerType[INDEX_OF](WINDOW) === -1;
                // skip reading data
                if (globalindex === -1 && indexOfWindow && isObj) {
                    current.readData = BOOLEAN_TRUE;
                }
                return current;
            }
        });
});
app.scope(function (app) {
    var CATCH = 'catch',
        ERROR = 'error',
        STATUS = 'status',
        FAILURE = 'failure',
        SUCCESS = 'success',
        READY_STATE = 'readyState',
        XDomainRequest = win.XDomainRequest,
        stringifyQuery = _.stringifyQuery,
        GET = 'GET',
        PROGRESS = 'progress',
        validTypes = toArray(GET + ',POST,PUT,DELETE,HEAD,TRACE,OPTIONS,CONNECT'),
        baseEvents = toArray(PROGRESS + ',timeout,abort,' + ERROR),
        readAndApply = function (ajax) {},
        basehandlers = {
            progress: function () {},
            timeout: function () {},
            abort: function () {},
            error: readAndApply
        },
        attachBaseListeners = function (ajax) {
            var prog = 0,
                req = ajax.options.requestObject;
            duff(baseEvents, function (evnt) {
                if (evnt === PROGRESS) {
                    // we put it directly on the xhr object so we can
                    // account for certain ie bugs that show up
                    req['on' + evnt] = function (e) {
                        if (!e) {
                            return;
                        }
                        var percent = (e.loaded / e.total);
                        prog++;
                        ajax[DISPATCH_EVENT](PROGRESS, {
                            percent: percent || (prog / (prog + 1)),
                            counter: prog
                        }, {
                            originalEvent: e
                        });
                    };
                } else {
                    req['on' + evnt] = function (e) {
                        basehandlers[evnt](ajax, evnt, e);
                    };
                }
            });
        },
        sendthething = function (xhrReq, args, ajax) {
            return function () {
                return wraptry(function () {
                    return xhrReq.send.apply(xhrReq, args);
                }, function (e) {
                    ajax.resolveAs(CATCH, e, e.message);
                });
            };
        },
        /**
         * @class HTTP
         * @alias factories.HTTP
         * @augments Model
         * @classdesc XHR object wrapper Triggers events based on xhr state changes and abstracts many anomalies that have to do with IE
         */
        HTTP = factories.HTTP = Promise.extend('HTTP', {
            /**
             * @func
             * @name HTTP#constructor
             * @param {string} str - url to get from
             * @returns {HTTP} new ajax object
             */
            parse: parse,
            constructor: function (str) {
                var promise, url, thingToDo, typeThing, type, ajax = this,
                    method = 'onreadystatechange',
                    // Add a cache buster to the url
                    // ajax.async = BOOLEAN_TRUE;
                    xhrReq = new XMLHttpRequest();
                // covers ie9
                if (!isUndefined(XDomainRequest)) {
                    xhrReq = new XDomainRequest();
                    method = 'onload';
                }
                if (!isObject(str)) {
                    str = str || EMPTY_STRING;
                    type = GET;
                    typeThing = str.toUpperCase();
                    if (indexOf(validTypes, typeThing) !== -1) {
                        type = typeThing;
                    } else {
                        url = str;
                    }
                    str = {
                        url: url || EMPTY_STRING,
                        type: type
                    };
                }
                ajax.options = _.extend({
                    async: BOOLEAN_TRUE,
                    method: method,
                    type: type,
                    requestObject: xhrReq,
                    withCredentials: BOOLEAN_TRUE
                }, str);
                Promise[CONSTRUCTOR].call(ajax, function () {
                    var type = ajax.options.type,
                        url = ajax.options.url,
                        args = [],
                        data = ajax.options.data;
                    if (isObject(url) && !isArray(url)) {
                        url = stringifyQuery(url);
                    }
                    if (!url || !type) {
                        return exception('http object must have a url and a type');
                    }
                    ajax.attachResponseHandler();
                    wraptry(function () {
                        // if (!win.XDomainRequest || !isInstance(xhrReq, win.XDomainRequest)) {
                        //     xhrReq.withCredentials = ajax.options.withCredentials;
                        // }
                        xhrReq.open(type, url, ajax.options.async);
                    });
                    if (data) {
                        args.push(stringify(data));
                    }
                    ajax.headers(ajax.options.headers);
                    attachBaseListeners(ajax);
                    // have to wrap in set timeout for ie
                    setTimeout(sendthething(xhrReq, args, ajax));
                });
                return ajax;
            },
            status: function (code, handler) {
                return this.handle(STATUS + COLON + code, handler);
            },
            headers: function (headers) {
                var ajax = this,
                    xhrReq = ajax.requestObject;
                each(headers, function (val, key) {
                    xhrReq.setRequestHeader(key, val);
                });
                return ajax;
            },
            /**
             * @description specialized function to stringify url if it is an object
             * @returns {string} returns the completed string that will be fetched / posted / put / or deleted against
             * @name HTTP#getUrl
             */
            /**
             * @description makes public the ability to attach a response handler if one has not already been attached. We recommend not passing a function in and instead just listening to the various events that the xhr object will trigger directly, or indirectly on the ajax object
             * @param {function} [fn=handler] - pass in a function to have a custom onload, onreadystatechange handler
             * @returns {ajax}
             * @name HTTP#attachResponseHandler
             */
            auxiliaryStates: function () {
                return {
                    // cross domain error
                    'status:0': FAILURE,
                    'status:200': SUCCESS,
                    'status:202': SUCCESS,
                    'status:204': SUCCESS,
                    'status:205': SUCCESS,
                    'status:302': SUCCESS,
                    'status:304': SUCCESS,
                    'status:400': FAILURE,
                    'status:401': FAILURE,
                    'status:403': FAILURE,
                    'status:404': FAILURE,
                    'status:405': FAILURE,
                    'status:406': FAILURE,
                    'status:500': FAILURE,
                    'status:502': FAILURE,
                    'status:505': FAILURE,
                    'status:511': FAILURE,
                    'timeout': FAILURE,
                    'abort': FAILURE
                };
            },
            attachResponseHandler: function () {
                var ajax = this,
                    xhrReqObj = ajax.options.requestObject,
                    hasFinished = BOOLEAN_FALSE,
                    method = ajax.options.method,
                    handler = function (evnt) {
                        var status, doIt, allStates, rawData, xhrReqObj = this;
                        if (!xhrReqObj || hasFinished) {
                            return;
                        }
                        status = xhrReqObj[STATUS];
                        rawData = xhrReqObj.responseText;
                        if (method === 'onload' || (method === 'onreadystatechange' && xhrReqObj[READY_STATE] === 4)) {
                            allStates = result(ajax, 'allStates');
                            rawData = ajax.options.preventParse ? rawData : ajax.parse(rawData);
                            hasFinished = BOOLEAN_TRUE;
                            ajax.resolveAs(STATUS + COLON + (xhrReqObj[STATUS] === UNDEFINED ? 200 : xhrReqObj[STATUS]), rawData);
                        }
                    };
                if (!xhrReqObj[method]) {
                    xhrReqObj[method] = handler;
                }
                return ajax;
            }
        });
    _.foldl(validTypes, function (memo, key_) {
        var key = key_;
        key = key.toLowerCase();
        memo[key] = function (url, options) {
            return HTTP(_.extend({
                type: key_,
                url: url
            }, options));
        };
    }, HTTP);
});
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Model = factories.Model,
        Collection = factories.Collection,
        MODULE = 'module',
        CAPITAL_MODULE = capitalize(MODULE),
        MODULES = CAPITAL_MODULE + 's',
        STARTED = START + 'ed',
        INITIALIZED = 'initialized',
        INITIALIZED_COLON_SUBMODULE = INITIALIZED + COLON + 'sub' + MODULE,
        DEFINED = 'defined',
        notDefinedYetMessage = 'that module has not been ' + DEFINED + ' yet',
        startableMethods = {
            start: function (evnt) {
                var startable = this;
                if (!startable.is(STARTED)) {
                    startable.mark(STARTED);
                    startable[DISPATCH_EVENT](START, evnt);
                }
                return startable;
            },
            stop: function (evnt) {
                var startable = this;
                if (startable.is(STARTED)) {
                    startable.unmark(STARTED);
                    startable[DISPATCH_EVENT](STOP, evnt);
                }
                return startable;
            },
            toggle: function (evnt) {
                var startable = this;
                if (startable.is(STARTED)) {
                    startable[STOP](evnt);
                } else {
                    startable[START](evnt);
                }
                return startable;
            },
            restart: function (evnt) {
                var startable = this;
                if (startable.is(STARTED)) {
                    startable[STOP](evnt);
                }
                startable[START](evnt);
                return startable;
            }
        },
        Startable = factories.Startable = factories.Model.extend('Startable', startableMethods),
        doStart = function (e) {
            if (this.startWithParent) {
                this[START](e);
            }
        },
        doStop = function (e) {
            if (this.stopWithParent) {
                this[STOP](e);
            }
        },
        checks = function (app, list) {
            var exporting = [];
            duff(list, function (path) {
                var module = app.module(path);
                if (module.is(INITIALIZED)) {
                    exporting.push(module[EXPORTS]);
                }
            });
            return exporting[LENGTH] === list[LENGTH] ? exporting : BOOLEAN_FALSE;
        },
        Promise = _.Promise,
        moduleMethods = {
            module: function (name_, windo, fn) {
                var initResult, list, globalname, arg1, arg2, parentModulesDirective, modules, attrs, parentIsModule, nametree, parent = this,
                    originalParent = parent,
                    name = name_,
                    // globalname = name,
                    namespace = name.split(PERIOD),
                    module = parent.directive(CHILDREN).get(name_),
                    triggerBubble = function () {
                        module.mark(DEFINED);
                        module[PARENT].bubble(INITIALIZED_COLON_SUBMODULE);
                    };
                if (module) {
                    // hey, i found it. we're done here
                    parent = module[PARENT];
                    if (!fn) {
                        return module;
                    }
                    namespace = [module.id];
                } else {
                    // now i have to make the chain
                    while (namespace.length > 1) {
                        parent = parent.module(namespace[0]);
                        namespace.shift();
                    }
                }
                parentModulesDirective = parent.directive(CHILDREN);
                name = namespace.join(PERIOD);
                module = parentModulesDirective.get(ID, name);
                if (!module) {
                    list = parent.globalname ? parent.globalname.split(PERIOD) : [];
                    list.push(name);
                    globalname = list.join(PERIOD);
                    arg2 = extend({}, result(parent, CHILD_OPTIONS) || {}, {
                        application: app,
                        parent: parent,
                        id: name,
                        globalname: globalname
                    });
                    if (parent === app) {
                        module = Module({}, arg2);
                        parentModulesDirective.add(module);
                        parentModulesDirective.keep(ID, name, module);
                    } else {
                        module = parent.add({}, arg2).item(0);
                    }
                    app[CHILDREN].keep(ID, globalname, module);
                }
                if (isWindow(windo) || isFunction(windo) || isFunction(fn)) {
                    module[EXPORTS] = module[EXPORTS] || {};
                    module.mark(INITIALIZED);
                    initResult = module.run(windo, fn);
                    // allows us to create dependency graphs
                    if (initResult && Promise.fn.isChildType(initResult)) {
                        initResult.success(triggerBubble);
                    } else {
                        triggerBubble();
                    }
                }
                return module;
            },
            createArguments: function (windo) {
                var module = this;
                return [module].concat(module[APPLICATION].createArguments(windo));
            },
            run: function (windo_, fn_) {
                var result, module = this,
                    fn = isWindow(windo_) ? fn_ : windo_,
                    windo = fn === windo_ ? window : windo_;
                if (isFunction(fn)) {
                    result = fn.apply(module, module.createArguments(windo));
                }
                return result === UNDEFINED ? module : result;
            },
            publicize: intendedApi(function (key, value) {
                this[EXPORTS][key] = value;
            }),
            constructor: function (attrs, opts) {
                var module = this;
                module.startWithParent = BOOLEAN_TRUE;
                module.stopWithParent = BOOLEAN_TRUE;
                module[EXPORTS] = {};
                Model[CONSTRUCTOR].apply(module, arguments);
                module.listenTo(module[PARENT], {
                    start: doStart,
                    stop: doStop
                });
                return module;
            },
            topLevel: function () {
                return !this[APPLICATION] || this[APPLICATION] === this[PARENT];
            },
            require: function (key, fn) {
                return this.application.require(this.globalname + PERIOD + key, fn);
            }
        },
        Module = factories.Module = factories.Model.extend(CAPITAL_MODULE, extend({}, startableMethods, moduleMethods)),
        appextendresult = app.extend(extend({}, factories.Directive[CONSTRUCTOR][PROTOTYPE], factories.Events[CONSTRUCTOR][PROTOTYPE], factories.Parent[CONSTRUCTOR][PROTOTYPE], startableMethods, moduleMethods, {
            createArguments: function (windo) {
                var app = this,
                    _ = app._,
                    id = windo[DOCUMENT][__ELID__],
                    documentManagerDocuments = app.directive(DOCUMENT_MANAGER).documents,
                    documentView = documentManagerDocuments.get(ID, id);
                if (!documentView) {
                    documentView = app.global.definition(app.VERSION, windo);
                }
                return [app, _, _ && _.factories, documentView, documentView.factories, documentView.$];
            },
            require: function (modulename, handler) {
                var promise, module, list, mappedArguments, app = this;
                if (!isFunction(handler)) {
                    module = app.module(modulename);
                    return module.is(DEFINED) ? module[EXPORTS] : exception(notDefinedYetMessage);
                } else {
                    promise = Promise();
                    list = toArray(modulename, SPACE);
                    if (!isArray(list) || !list[LENGTH]) {
                        return promise;
                    }
                    list = list.slice(0);
                    promise.success(bind(handler, app));
                    if ((mappedArguments = checks(app, list))) {
                        promise.fulfill(mappedArguments);
                    } else {
                        app.on(INITIALIZED_COLON_SUBMODULE, function () {
                            if ((mappedArguments = checks(app, list))) {
                                app.off();
                                promise.fulfill(mappedArguments);
                            }
                        });
                    }
                    return promise;
                }
            }
        }));
    // delete the prototype link from parent prototype
    delete app.fn;
});
var ATTACHED = 'attached',
    IFRAME = 'iframe',
    LOCAL_NAME = 'localName',
    CHILD_NODES = 'childNodes',
    FRAGMENT = 'fragment',
    TAG_NAME = 'tagName',
    NODE_TYPE = 'nodeType',
    PARENT_NODE = 'parentNode',
    ATTRIBUTES = 'Attributes',
    DOM_MANAGER_STRING = 'DomManager',
    DESTROYED = DESTROY + 'ed',
    CUSTOM = 'custom',
    REMOVING = 'removing',
    ACCESSABLE = 'accessable',
    CUSTOM_LISTENER = CUSTOM + 'Listener',
    UPPER_CHILD = 'Child',
    APPEND_CHILD = 'append' + UPPER_CHILD,
    REMOVE = 'remove',
    REMOVE_CHILD = REMOVE + UPPER_CHILD,
    HTML = 'html',
    INNER_HTML = 'innerHTML',
    TEXT = 'text',
    INNER_TEXT = 'innerText',
    OUTER_HTML = 'outerHTML',
    REGISTERED_AS = 'registeredAs',
    ATTRIBUTE_CHANGE = 'attributeChange',
    ATTRIBUTES_CHANGING = 'attributesChanging',
    DELEGATE_COUNT = 'delegateCount',
    CAPTURE_COUNT = 'captureCount',
    CUSTOM_KEY = 'is',
    CLASS__NAME = (CLASS + HYPHEN + NAME),
    FONT_SIZE = 'fontSize',
    DEFAULT_VIEW = 'defaultView',
    DIV = 'div',
    CUSTOM_ATTRIBUTE = '[' + CUSTOM_KEY + ']',
    devicePixelRatio = (win.devicePixelRatio || 1),
    propsList = toArray('type,href,className,height,width,id,tabIndex,title,alt'),
    propsHash = wrap(propsList, BOOLEAN_TRUE),
    createAttributeFromTag = function (tag) {
        return '[' + CUSTOM_KEY + '="' + tag + '"]';
    },
    tag = function (el, str) {
        var tag;
        if (!el || !isElement(el)) {
            return BOOLEAN_FALSE;
        }
        tag = el[LOCAL_NAME].toLowerCase();
        return str ? tag === str.toLowerCase() : tag;
    },
    writeAttribute = function (el, key, val_) {
        if (val_ === BOOLEAN_FALSE || val_ == NULL) {
            removeAttribute(el, key);
        } else {
            el.setAttribute(key, (val_ === BOOLEAN_TRUE ? EMPTY_STRING : stringify(val_)) + EMPTY_STRING);
        }
    },
    registeredElementName = function (name, manager) {
        return capitalize(ELEMENT) + HYPHEN + manager[__ELID__] + HYPHEN + name;
    },
    iframeContent = function (head, body) {
        return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="user-scalable=no,width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">' + head + '</head><body>' + body + '</body></html>';
    },
    filtersParentNotMe = function (parent) {
        return function (element) {
            return element[PARENT_NODE] === parent;
        };
    },
    returnsSelector = function (string, owner) {
        var registeredElements = owner.registeredElements;
        return registeredElements[string] === BOOLEAN_TRUE ? string : createAttributeFromTag(string);
    },
    convertSelector = function (str, owner) {
        // removes custom tag names and replaces them with [is="tag"]
        // if anyone knows some regexp that would be better than this, then take a stab at it
        return map(toArray(str, SPACE), function (level) {
            return level.replace(/^(\S*?)([\.|\#|\[])/i, function (match_) {
                var match = match_;
                var last = match[LENGTH] - 1;
                return last ? (returnsSelector(match.slice(0, last), owner) + match.slice(last)) : match;
            });
        }).join(SPACE);
    },
    superElements = function (context, key) {
        return isElement(context[key]) ? [context[key]] : [];
    },
    superElementsHash = {
        body: BOOLEAN_TRUE,
        head: BOOLEAN_TRUE
    },
    dataReconstructor = function (list, fn) {
        return foldl(list, function (memo, arg1, arg2, arg3) {
            if (fn(arg1, arg2, arg3)) {
                memo.push(arg1);
            }
            return memo;
        }, []);
    },
    // takes string to query for, subset of tree to query for and manager so it can always get to the document
    query = function (str_, ctx, manager) {
        var directSelector, elements, str = str_,
            context = ctx,
            returnsArray = returns.first,
            owner = manager.owner;
        if (manager && manager === owner) {
            if (superElementsHash[str]) {
                return superElements(context, 'body');
            }
        }
        if (manager && str[0] === '>') {
            directSelector = BOOLEAN_TRUE;
            str = manager.queryString() + str;
        }
        str = convertSelector(str, owner);
        elements = context.querySelectorAll(str);
        if (directSelector) {
            return dataReconstructor(elements, filtersParentNotMe(context));
        } else {
            return toArray(elements);
        }
    },
    matchesSelector = function (element, selector, owner) {
        var match, parent, matchesSelector;
        if (!selector || !element || element[NODE_TYPE] !== 1) {
            return BOOLEAN_FALSE;
        }
        matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
        if (matchesSelector) {
            return matchesSelector.call(element, selector);
        }
        // fall back to performing a selector:
        parent = element[PARENT_NODE];
        if (!parent) {
            parent = createElement(DIV, ensure(element.ownerDocument, BOOLEAN_TRUE));
            parent[APPEND_CHILD](element);
        }
        return indexOf(query(selector, parent, owner), element) !== -1;
    },
    readAttribute = function (el, key) {
        var coerced, val = el.getAttribute(key);
        return convertAttributeValue(val);
    },
    cautiousConvertValue = function (generated) {
        var converted = +generated;
        return generated[LENGTH] && converted == generated ? converted : generated;
    },
    convertAttributeValue = function (val_) {
        var val = val_;
        if (val === EMPTY_STRING) {
            return BOOLEAN_TRUE;
        } else {
            return val == NULL ? BOOLEAN_FALSE : cautiousConvertValue(val);
        }
    },
    /**
     * @private
     * @func
     */
    removeAttribute = function (el, key) {
        el.removeAttribute(key);
    },
    attributeApi = {
        preventUnCamel: BOOLEAN_FALSE,
        read: readAttribute,
        write: writeAttribute,
        remove: removeAttribute
    },
    appendChild = function (parent, target) {
        return target && parent.appendChild && parent.appendChild(target);
    },
    removeChild = function (el, target) {
        var result = el && (target ? appendChild(target, el) : el.parentNode && el.parentNode.removeChild(el));
    },
    readProperty = function (el, property) {
        return el[property];
    },
    writeProperty = function (el, property, value) {
        if (value == NULL) {
            return removeProperty(el, property);
        }
        el[property] = value;
    },
    removeProperty = function (el, property) {
        el[property] = NULL;
    },
    propertyApi = {
        preventUnCamel: BOOLEAN_TRUE,
        read: readProperty,
        write: writeProperty,
        remove: removeProperty
    },
    baseNodeToJSON = function (node) {
        var obj = {
            tagName: tag(node),
            comment: BOOLEAN_FALSE,
            text: BOOLEAN_FALSE
        };
        duff(node.attributes, function (attr) {
            var attributes = obj.attributes = obj.attributes || {};
            attributes[camelCase(attr[LOCAL_NAME])] = attr.nodeValue;
        });
        return obj;
    },
    commentJSON = function (text) {
        return {
            tag: BOOLEAN_FALSE,
            comment: BOOLEAN_TRUE,
            text: BOOLEAN_FALSE,
            content: text
        };
    },
    textJSON = function (text) {
        return {
            tag: BOOLEAN_FALSE,
            comment: BOOLEAN_FALSE,
            text: BOOLEAN_TRUE,
            content: text
        };
    },
    finalInsertBefore = function (parent, el1, el2) {
        return el1 && parent.insertBefore && parent.insertBefore(el1, el2);
    },
    insertBefore = function (parent, inserting, target) {
        var children;
        if (isObject(target)) {
            finalInsertBefore(parent, inserting, target);
        } else {
            if (isNumber(target)) {
                children = parent[CHILD_NODES];
                target = children[LENGTH] > target ? children[target] : BOOLEAN_FALSE;
                if (target) {
                    finalInsertBefore(parent, inserting, target);
                } else {
                    appendChild(parent, inserting);
                }
            } else {
                if (target) {
                    // handle query string
                } else {
                    appendChild(parent, inserting);
                }
            }
        }
    },
    collectAttr = function (memo, attribute, future) {
        var attributeKey = attribute[LOCAL_NAME];
        if (future) {
            memo.attrsA[attributeKey] = BOOLEAN_TRUE;
            memo.accessB[attributeKey] = attribute.nodeValue;
        } else {
            memo.attrsA[attributeKey] = BOOLEAN_TRUE;
            memo.accessA[attributeKey] = attribute.nodeValue;
        }
        if (memo.hash[attributeKey]) {
            return;
        }
        memo.hash[attributeKey] = BOOLEAN_TRUE;
        memo.list.push(attributeKey);
    },
    returnsJSONNodeType = function (tagName) {
        return tagName === 'text' ? 3 : 1;
    },
    checkNeedForCustom = function (el) {
        return el[__ELID__] && attributeApi.read(el, 'is') !== BOOLEAN_FALSE;
    },
    diffAttributes = function (a, b, diffs, context) {
        var bKeys, aAttributes = a.attributes,
            aLength = aAttributes.length,
            bLength = (bKeys = keys(b[1])).length,
            attrs = foldl({
                length: Math.max(aLength, bLength)
            }, function (memo, voided, index) {
                var key;
                if (memo.aLength > index) {
                    collectAttr(memo, aAttributes[index]);
                }
                if (memo.bLength > index) {
                    key = bKeys[index];
                    collectAttr(memo, {
                        localName: key,
                        nodeValue: b[1][key]
                    }, BOOLEAN_TRUE);
                }
            }, {
                list: [],
                hash: {},
                attrsA: {},
                accessA: {},
                attrsB: {},
                accessB: {},
                aLength: aLength,
                bLength: bLength
            }),
            anElId = a[__ELID__],
            updates;
        duff(attrs.list, function (key) {
            if (attrs.accessA[key] !== attrs.accessB[key]) {
                updates = updates || {};
                updates[key] = attrs.accessB[key] === UNDEFINED ? NULL : attrs.accessB[key];
            }
        });
        if (!updates) {
            return;
        }
        diffs.updating.push(function () {
            var manager, props;
            each(updates, function (value, key) {
                if (!propsHash[key]) {
                    return;
                }
                delete updates[key];
                props = props || {};
                props[key] = value;
            });
            if (checkNeedForCustom(a)) {
                manager = context.returnsManager(a);
                if (keys(updates)[LENGTH]) {
                    manager.attr(updates);
                }
                if (props) {
                    manager.prop(props);
                }
            } else {
                each(updates, function (value, key) {
                    attributeApi.write(a, kebabCase(key), value);
                });
                each(props, function (value, key) {
                    propertyApi.write(a, kebabCase(key), value);
                });
            }
        });
    },
    collectVirtualKeys = function (virtualized, diff, previous_hash, level_, index_) {
        var groups, children = virtualized[2];
        var uniques = virtualized[3];
        var level = level_ || 0;
        var index = index_ || 0;
        if (uniques) {
            groups = toArray(uniques.group);
            if (uniques.key) {
                diff.ids[uniques.key] = {
                    virtual: virtualized,
                    level: level,
                    index: index,
                    group: groups[LENGTH] ? groups : NULL,
                    el: previous_hash[uniques.key]
                };
            }
        }
        duff(children, function (child, index) {
            collectVirtualKeys(child, diff, previous_hash, level + 1, index);
        });
    },
    computeStringDifference = function (a, b, context, diffs) {
        if (isString(b[2])) {
            if (a.innerHTML !== b[2]) {
                diffs.updating.push(function () {
                    if (checkNeedForCustom(a)) {
                        context.returnsManager(a).html(b[2]);
                    } else {
                        a.innerHTML = b[2];
                    }
                });
            }
            return BOOLEAN_TRUE;
        }
    },
    insertMapper = function (els, parent, context, i, hash) {
        var frag = doc.createDocumentFragment();
        duff(els, function (el) {
            context.deltas.create(el, frag, hash);
        });
        return {
            parent: parent,
            el: frag,
            index: i
        };
    },
    filtersAlreadyInserted = function (els, hash) {
        return _.filter(els, function (el) {
            var identifiers = el[3];
            if (identifiers && identifiers.key) {
                return !hash[identifiers.key];
            }
            return BOOLEAN_TRUE;
        });
    },
    diffChildren = function (a, b, hash, stopper, layer_level, diffs, context) {
        var aChildren = a.childNodes;
        var bChildren = b[2];
        var mutations = diffs.mutations;
        var keys = diffs.keys;
        // it was a string, so there's nothing more to compute in regards to children
        if (computeStringDifference(a, b, context, diffs)) {
            return diffs;
        }
        var aChildrenLength = aChildren && aChildren[LENGTH];
        var bChildrenLength = bChildren && bChildren[LENGTH];
        var maxLength = Math.max(aChildrenLength, bChildrenLength);
        var j, finished, bChild, removing, result, dontCreate, offset = 0,
            i = 0,
            focus = 0;
        if (!bChildren || isNumber(bChildren)) {
            return diffs;
        }
        for (; i < maxLength && !finished; i++) {
            if (aChildrenLength <= i) {
                // rethink this. it's a little weird
                diffs.inserting.push(insertMapper(filtersAlreadyInserted(toArray(bChildren).slice(i), hash), a, context, i, diffs.keys));
                return diffs;
            } else {
                if (b[2] && stopper(b)) {
                    // do not do children
                    if (bChildrenLength <= i) {
                        dontCreate = BOOLEAN_TRUE;
                        diffs.removing.push.apply(diffs.removing, toArray(aChildren).slice(i));
                        return diffs;
                    } else {
                        result = nodeComparison(aChildren[i], bChildren[i], hash, stopper, layer_level, i, diffs, context, a);
                        if (result === BOOLEAN_FALSE) {
                            diffs.removing.push(a);
                            diffs.inserting.push(insertMapper([b], a, context, i + offset, diffs.keys));
                        }
                    }
                }
            }
        }
        return diffs;
    },
    newDiff = function (context) {
        var diffs = {
            removing: [],
            updating: [],
            inserting: [],
            mutations: {
                remove: function () {
                    if (!diffs.removing[LENGTH]) {
                        return;
                    }
                    // maintains attach state on dommanager
                    context.$(diffs.removing).remove();
                    return BOOLEAN_TRUE;
                },
                update: function () {
                    // attributes and content
                    duff(diffs.updating, function (fn) {
                        fn();
                    });
                },
                insert: function () {
                    if (!diffs.inserting[LENGTH]) {
                        return;
                    }
                    diffs.inserting.sort(function (a, b) {
                        return a.index > b.index ? 1 : -1;
                    });
                    var target, index, currentFragment, actuallyInserting = [],
                        inserting = diffs.inserting.slice(0);
                    // group sections into document fragments
                    while (inserting[LENGTH]) {
                        // shift off of the inserting list
                        target = inserting.shift();
                        // if no index is defined
                        if (index === UNDEFINED) {
                            // define an index
                            index = target.index;
                            // set a current fragment
                            currentFragment = {
                                index: target.index,
                                el: context.createDocumentFragment(),
                                parent: target.parent
                            };
                            // push it to the final insert list
                            actuallyInserting.push(currentFragment);
                            // append the target element to the fragment
                            appendChild(currentFragment.el, target.el);
                        } else {
                            if (target.parent === currentFragment.parent && index + 1 === target.index) {
                                // append to current fragment
                                appendChild(currentFragment.el, target.el);
                                // update index
                                index = target.index;
                            } else {
                                // unshift target
                                inserting.unshift(target);
                                // reset index to undefined to start new document fragment
                                index = UNDEFINED;
                            }
                        }
                    }
                    duff(actuallyInserting, function (list, idx, lists) {
                        // maintains attach state on dom manager
                        context.returnsManager(list.parent).insertAt(list.el, list.index);
                    });
                    return BOOLEAN_TRUE;
                }
            },
            keys: {},
            ids: {},
            group: {},
            futureTree: {},
            futureHash: {}
        };
        return diffs;
    },
    // cannot start with a text node
    nodeComparison = function (a_, b_, hash_, stopper_, layer_level_, index_, diffs_, context, future_parent_) {
        var returns, resultant, current, inserting, identifyingKey, identified, first = !diffs_,
            a = a_,
            b = b_,
            index = index_ || 0,
            future_parent = future_parent_,
            diffs = diffs_ || newDiff(context),
            stopper = stopper_ || returnsTrue,
            keys = diffs.keys,
            mutations = diffs.mutations,
            layer_level = layer_level_ || 0,
            hash = hash_ || {},
            layerLength = b[LENGTH],
            identifiers = b[3],
            tagA = tag(a);
        if (first) {
            collectVirtualKeys(b, diffs, hash);
        }
        if (tagA === b[0] && a.nodeType === returnsJSONNodeType(b[0])) {
            if (identifiers && (identifyingKey = identifiers.key)) {
                current = hash[identifyingKey];
                identified = diffs.ids[identifyingKey];
                if (current) {
                    if (current === a) {
                        diffs.keys[identifyingKey] = current;
                    } else {
                        if (identified.virtual[0] === tagA) {
                            // has the effect of removing it at the same time as inserting it
                            diffs.removing.push(a);
                            identified.parent = future_parent;
                            diffs.inserting.push(identified);
                            a = diffs.keys[identifyingKey] = current;
                        } else {
                            diffs.removing.push(a);
                            diffs.inserting.push(insertMapper([b], future_parent, context, index, diffs.keys));
                            diffs.keys[identifyingKey] = a;
                            return diffs;
                        }
                    }
                } else {
                    diffs.inserting.push(insertMapper([b], future_parent, context, index, diffs.keys));
                    return diffs;
                }
            }
            // what is different.
            diffAttributes(a, b, diffs, context);
            return diffChildren(a, b, hash, stopper, layer_level + 1, diffs, context);
        } else {
            // instant fail
            if (first) {
                exception('at least the first node must match tagName and nodeType');
            }
            return BOOLEAN_FALSE;
        }
        // return diffs;
    },
    nodeToJSON = function (node, shouldStop_, includeComments) {
        var obj, children, childrenLength, shouldStop = shouldStop_ || noop;
        obj = baseNodeToJSON(node);
        if (obj.attributes && obj.attributes.is && obj.attributes.dataRenderer) {
            return {
                selfSufficient: BOOLEAN_TRUE
            };
        }
        if (!shouldStop(node, obj)) {
            return obj;
        }
        children = node.childNodes;
        if (!(childrenLength = children[LENGTH])) {
            return obj;
        }
        obj.children = foldl(children, function (memo, child) {
            if (isElement(child)) {
                memo.push(nodeToJSON(child, shouldStop, includeComments));
            } else {
                if (child.nodeType === 3) {
                    memo.push(textJSON(child.textContent));
                } else {
                    if (includeComments) {
                        if (child.nodeType === 8) {
                            memo.push(commentJSON(child.textContent));
                        } else {
                            memo.push({
                                err: BOOLEAN_TRUE
                            });
                        }
                    }
                }
            }
        }, []);
        return obj;
    },
    createDocumentFragment = function (nulled, context) {
        return context.is(DOCUMENT) && context.element().createDocumentFragment();
    },
    isElement = function (object) {
        return !!(object && isNumber(object[NODE_TYPE]) && object[NODE_TYPE] === object.ELEMENT_NODE);
    },
    isDocument = function (obj) {
        return obj && isNumber(obj[NODE_TYPE]) && obj[NODE_TYPE] === obj.DOCUMENT_NODE;
    },
    isFragment = function (frag) {
        return frag && frag[NODE_TYPE] === doc.DOCUMENT_FRAGMENT_NODE;
    },
    canBeProcessed = function (item) {
        return isWindow(item) || isElement(item) || isDocument(item) || isFragment(item);
    },
    collectChildren = function (element) {
        return toArray(element.children || element.childNodes);
    },
    globalAssociator = factories.Associator();
app.scope(function (app) {
    var ensure = function (el, owner) {
            var data;
            if (owner === BOOLEAN_TRUE) {
                data = globalAssociator.get(el);
            } else {
                data = owner.data.get(el);
            }
            if (!data[DOM_MANAGER_STRING]) {
                data[DOM_MANAGER_STRING] = DomManager(el, data, owner);
            }
            return data[DOM_MANAGER_STRING];
        },
        noMatch = /(.)^/,
        templateMiddleware = function (string) {
            var split = string.split('<');
            var pseudo = foldl(split, function (memo, splitstring) {
                var endsplit = splitstring.split('>');
                if (endsplit[LENGTH] === 1) {
                    // just text
                    memo.list.push(splitstring);
                    return;
                }
                var nexttext = endsplit[1];
                var contained = endsplit[0];
            }, {
                layer: 0,
                list: []
            });
            return string;
        },
        foldAttributes = function (attributes) {
            return attributes[LENGTH] ? _.foldl(attributes, function (memo, attribute) {
                memo[attribute[LOCAL_NAME]] = attribute.nodeValue;
            }) : NULL;
        },
        virtualizeDom = function (nodes) {
            return _.map(nodes, function (node) {
                return [node.tagName, foldAttributes(node.attributes)];
            });
        },
        templateGenerator = function (text_, templateSettings) {
            var render, template, trimmed, argument, settings = extend({}, templateSettings),
                text = text_,
                templateIsFunction = isFunction(text);
            if (templateIsFunction) {
                render = text;
            } else {
                // text = text.trim();
                // if (text.match(/return(\s*)\[/igm)) {
                trimmed = text.trim();
                if (trimmed[trimmed[LENGTH] - 1] !== ';') {
                    trimmed += ';';
                }
                trimmed = text;
                render = wraptry(function () {
                    return new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('helpers', '_', blockWrapper(trimmed));
                });
                // } else {
                //     exception('templates must return a json structure');
                // }
            }
            return function (data, helpers) {
                return render.call(data, helpers, _);
            };
            // }
            // var matcher = RegExp([
            //     (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
            // ].join('|') + '|$', 'g');
            // var index = 0;
            // var source = "__HTML__+='";
            // text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            //     source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
            //     index = offset + match[LENGTH];
            //     if (escape) {
            //         source += "'+\n((__t=(this." + escape + "))==null?'':_.escape(__t))+\n'";
            //     } else if (interpolate) {
            //         source += "'+\n((__t=(this." + interpolate + "))==null?'':__t)+\n'";
            //     } else if (evaluate) {
            //         source += "';\n" + evaluate + "\n__HTML__+='";
            //     }
            //     // Adobe VMs need the match returned
            //     // to produce the correct offset.
            //     return match;
            // });
            // source += "';\n";
            // // If a variable is not specified, place data values in local scope.
            // // if (!settings.variable) {
            // source = 'with(this||{}){\n' + source + '}\n';
            // // }
            // source = "var __t,__HTML__='',__j=Array.prototype.join," + "print=function(){__HTML__+=__j.call(arguments,'');};\n" + source + 'return __HTML__;\n';
            // render = _.wraptry(function () {
            //     return new FUNCTION_CONSTRUCTOR_CONSTRUCTOR(settings.variable || '_', source);
            // });
            // template = function (data) {
            //     return virtualize(render.call(data || {}, _));
            // };
            // // Provide the compiled source as a convenience for precompilation.
            // argument = settings.variable || 'obj';
            // template.source = 'function(' + argument + '){\n' + source + '}';
            // return template;
        },
        compile = function (id, template_, context) {
            var templateHandler, templateIsFunction, template, trimmed, templates = context.templates = context.templates || Collection();
            if (isFunction(id)) {
                return templateGenerator(id, context.templateSettings);
            }
            templateHandler = templates.get(ID, id);
            if (templateHandler) {
                return templateHandler;
            }
            template = template_ || context.$('#' + id).html();
            templateHandler = templateGenerator(template, context.templateSettings);
            templateHandler.id = id;
            templates.push(templateHandler);
            templates.keep(ID, id, templateHandler);
            return templateHandler;
        },
        /**
         * @private
         * @func
         */
        /**
         * @private
         * @func
         */
        getClosestWindow = function (windo_) {
            var windo = windo_ || win;
            return isWindow(windo) ? windo : (windo && windo[DEFAULT_VIEW] ? windo[DEFAULT_VIEW] : (windo.ownerGlobal ? windo.ownerGlobal : DOMA(windo).parent(WINDOW)[ITEM](0) || win));
        },
        getComputed = function (el, ctx) {
            var ret = getClosestWindow(ctx).getComputedStyle(el);
            return ret ? ret : getClosestWindow(el).getComputedStyle(el) || clone(el[STYLE]) || {};
        },
        allStyles = getComputed(doc[BODY], win),
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        motionMorph = /^device/,
        rforceEvent = /^webkitmouseforce/,
        Image = win.Image,
        hasWebP = (function () {
            var countdown = 4,
                result = BOOLEAN_TRUE,
                queue = [],
                emptyqueue = function (handler) {
                    return function () {
                        countdown--;
                        handler();
                        if (countdown) {
                            return;
                        }
                        duff(queue, function (item) {
                            item(result);
                        });
                        queue = [];
                    };
                };
            duff(["UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==", "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==", "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"], function (val) {
                var img = new Image();
                img.onload = emptyqueue(noop);
                img.onerror = emptyqueue(function () {
                    result = BOOLEAN_FALSE;
                });
                img.src = "data:image/webp;base64," + val;
            });
            return function (cb) {
                if (!countdown || !result) {
                    cb(result);
                } else {
                    queue.push(cb);
                }
            };
        }()),
        fetch = function (url, callback) {
            var img = new Image();
            url = stringifyQuery(url);
            if (callback) {
                img.onload = function () {
                    var list = toArray(arguments);
                    ARRAY_PROTOTYPE.unshift(list, url);
                    callback.apply(this, list);
                };
            }
            img.src = url;
            return img;
        },
        DO_NOT_TRUST = BOOLEAN_FALSE,
        makeEachTrigger = function (attr, api) {
            var whichever = api || attr;
            return function (manager) {
                var el = manager.element();
                var ret, cachedTrust = DO_NOT_TRUST;
                DO_NOT_TRUST = BOOLEAN_TRUE;
                if (ALL_EVENTS_HASH[whichever] && isFunction(el[whichever])) {
                    el[whichever]();
                } else {
                    manager[DISPATCH_EVENT](whichever);
                }
                DO_NOT_TRUST = cachedTrust;
            };
        },
        triggerEventWrapper = function (attr_, api) {
            var attr = attr_ || api,
                eachHandler = makeEachTrigger(attr, api);
            return function (fn, fn2, capturing) {
                var doma = this;
                if (isFunction(fn) || isFunction(fn2)) {
                    doma.on(attr, fn, fn2, capturing);
                } else {
                    doma.each(eachHandler);
                }
                return doma;
            };
        },
        triggerEventWrapperManager = function (attr_, api) {
            var attr = attr_ || api,
                eachHandler = makeEachTrigger(attr, api);
            return function (fn, fn2, capturing) {
                var manager = this;
                if (isFunction(fn) || isFunction(fn2)) {
                    manager.on(attr, fn, fn2, capturing);
                } else {
                    eachHandler(manager);
                }
                return manager;
            };
        },
        Events = toArray('abort,afterprint,beforeprint,blocked,cached,canplay,canplaythrough,change,chargingchange,chargingtimechange,checking,close,complete,dischargingtimechange,DOMContentLoaded,downloading,durationchange,emptied,ended,error,fullscreenchange,fullscreenerror,input,invalid,languagechange,levelchange,loadeddata,loadedmetadata,message,noupdate,obsolete,offline,online,open,pagehide,pageshow,paste,pause,pointerlockchange,pointerlockerror,play,playing,ratechange,reset,seeked,seeking,stalled,storage,submit,success,suspend,timeupdate,updateready,upgradeneeded,versionchange,visibilitychange'),
        SVGEvent = toArray('SVGAbort,SVGError,SVGLoad,SVGResize,SVGScroll,SVGUnload,SVGZoom,volumechange,waiting'),
        KeyboardEvent = toArray('keydown,keypress,keyup'),
        GamePadEvent = toArray('gamepadconnected,gamepadisconnected'),
        CompositionEvent = toArray('compositionend,compositionstart,compositionupdate,drag,dragend,dragenter,dragleave,dragover,dragstart,drop'),
        MouseEvents = toArray('click,contextmenu,dblclick,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,show,wheel'),
        TouchEvents = toArray('touchcancel,touchend,touchenter,touchleave,touchmove,touchstart'),
        DeviceEvents = toArray('devicemotion,deviceorientation,deviceproximity,devicelight'),
        FocusEvent = toArray('blur,focus'),
        TimeEvent = toArray('beginEvent,endEvent,repeatEvent'),
        AnimationEvent = toArray('animationend,animationiteration,animationstart,transitionend'),
        AudioProcessingEvent = toArray('audioprocess,complete'),
        UIEvents = toArray('abort,error,hashchange,load,orientationchange,readystatechange,resize,scroll,select,unload,beforeunload'),
        ProgressEvent = toArray('abort,error,load,loadend,loadstart,popstate,progress,timeout'),
        AllEvents = concatUnique(Events, SVGEvent, KeyboardEvent, CompositionEvent, GamePadEvent, MouseEvents, TouchEvents, DeviceEvents, FocusEvent, TimeEvent, AnimationEvent, AudioProcessingEvent, UIEvents, ProgressEvent),
        knownPrefixes = toArray('-o-,-ms-,-moz-,-webkit-,mso-,-xv-,-atsc-,-wap-,-khtml-,-apple-,prince-,-ah-,-hp-,-ro-,-rim-,-tc-'),
        validTagNames = toArray('a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,main,map,mark,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rb,rp,rt,rtc,ruby,s,samp,script,section,select,small,source,span,strong,style,sub,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'),
        validTagsNamesHash = wrap(validTagNames, BOOLEAN_TRUE),
        ALL_EVENTS_HASH = wrap(AllEvents, BOOLEAN_TRUE),
        knownPrefixesHash = wrap(knownPrefixes, BOOLEAN_TRUE),
        StringManager = factories.StringManager,
        ensureManager = function (manager, attribute, currentValue) {
            var _attributeManager = getStringManager(manager, attribute);
            return _attributeManager.ensure(currentValue === BOOLEAN_TRUE ? EMPTY_STRING : currentValue, SPACE);
        },
        /**
         * @private
         * @func
         */
        // returns the flow of the element passed on relative to the element's bounding window
        flow = function (el, ctx) {
            var clientRect = el.getBoundingClientRect(),
                computedStyle = getComputed(el, ctx.element()),
                marginTop = unitRemoval(computedStyle.marginTop),
                marginLeft = unitRemoval(computedStyle.marginLeft),
                marginRight = unitRemoval(computedStyle.marginRight),
                marginBottom = unitRemoval(computedStyle.marginBottom);
            return {
                height: clientRect[HEIGHT] + marginTop + marginBottom,
                width: clientRect[WIDTH] + marginLeft + marginRight,
                top: clientRect[TOP] - marginTop,
                left: clientRect[LEFT] - marginLeft,
                right: clientRect[LEFT] + clientRect[WIDTH] + marginRight,
                bottom: clientRect[TOP] + clientRect[HEIGHT] + marginBottom
            };
        },
        numberBasedCss = {
            columnCount: BOOLEAN_TRUE,
            columns: BOOLEAN_TRUE,
            fontWeight: BOOLEAN_TRUE,
            lineHeight: BOOLEAN_TRUE,
            opacity: BOOLEAN_TRUE,
            zIndex: BOOLEAN_TRUE,
            zoom: BOOLEAN_TRUE,
            animationIterationCount: BOOLEAN_TRUE,
            boxFlex: BOOLEAN_TRUE,
            boxFlexGroup: BOOLEAN_TRUE,
            boxOrdinalGroup: BOOLEAN_TRUE,
            flex: BOOLEAN_TRUE,
            flexGrow: BOOLEAN_TRUE,
            flexPositive: BOOLEAN_TRUE,
            flexShrink: BOOLEAN_TRUE,
            flexNegative: BOOLEAN_TRUE,
            flexOrder: BOOLEAN_TRUE,
            lineClamp: BOOLEAN_TRUE,
            order: BOOLEAN_TRUE,
            orphans: BOOLEAN_TRUE,
            tabSize: BOOLEAN_TRUE,
            widows: BOOLEAN_TRUE,
            // SVG-related properties
            fillOpacity: BOOLEAN_TRUE,
            stopOpacity: BOOLEAN_TRUE,
            strokeDashoffset: BOOLEAN_TRUE,
            strokeOpacity: BOOLEAN_TRUE,
            strokeWidth: BOOLEAN_TRUE
        },
        timeBasedCss = {
            transitionDuration: BOOLEAN_TRUE,
            animationDuration: BOOLEAN_TRUE,
            transitionDelay: BOOLEAN_TRUE,
            animationDelay: BOOLEAN_TRUE
        },
        /**
         * @private
         * @func
         */
        // prefixedStyles,
        prefixedStyles = (function () {
            var i, j, n, found, prefixIndex, __prefix, styleName, currentCheck, deprefixed, currentLen,
                validCssNames = [],
                prefixed = {},
                len = 0,
                addPrefix = function (list, prefix) {
                    if (indexOf(list, __prefix) === -1) {
                        list.push(__prefix);
                    }
                };
            for (i = 0; i < knownPrefixes[LENGTH]; i++) {
                currentLen = knownPrefixes[i][LENGTH];
                if (len < currentLen) {
                    len = currentLen;
                }
            }
            for (n in allStyles) {
                found = 0;
                currentCheck = EMPTY_STRING;
                __prefix = EMPTY_STRING;
                if (isNumber(+n)) {
                    styleName = allStyles[n];
                } else {
                    styleName = unCamelCase(n);
                }
                unCamelCase(styleName);
                camelCase(styleName);
                deprefixed = styleName;
                for (j = 0; j < len && styleName[j] && !found; j++) {
                    currentCheck += styleName[j];
                    prefixIndex = indexOf(knownPrefixes, currentCheck);
                    if (prefixIndex !== -1) {
                        __prefix = knownPrefixes[prefixIndex];
                        deprefixed = styleName.split(__prefix).join(EMPTY_STRING);
                        found = 1;
                    }
                    prefixIndex = indexOf(knownPrefixes, HYPHEN + currentCheck);
                    if (prefixIndex !== -1) {
                        __prefix = knownPrefixes[prefixIndex];
                        deprefixed = styleName.split(currentCheck).join(EMPTY_STRING);
                        found = 1;
                    }
                }
                deprefixed = camelCase(deprefixed);
                validCssNames.push(deprefixed);
                if (!prefixed[deprefixed]) {
                    prefixed[deprefixed] = [];
                }
                addPrefix(prefixed[deprefixed], __prefix);
            }
            return prefixed;
        }()),
        convertStyleValue = function (key, value) {
            return +value !== +value ? value : (timeBasedCss[key] ? value + 'ms' : (!numberBasedCss[key] ? value + PIXELS : value));
        },
        /**
         * @private
         * @func
         */
        style = function (els, key, value) {
            if (!els[LENGTH]) {
                return;
            }
            // var bound = bind(styleIteration, this);
            intendedObject(key, value, function (key, value_) {
                bound(key, convertStyleValue(key, value_));
            });
        },
        /**
         * @private
         * @func
         */
        box = function (el, ctx) {
            var clientrect, computed, ret = {};
            if (!isElement(el)) {
                return ret;
            }
            computed = getComputed(el, ctx);
            clientrect = clientRect(el, ctx);
            return {
                borderBottom: +computed.borderBottomWidth || 0,
                borderRight: +computed.borderRightWidth || 0,
                borderLeft: +computed.borderLeftWidth || 0,
                borderTop: +computed.borderTopWidth || 0,
                paddingBottom: +computed.paddingBottom || 0,
                paddingRight: +computed.paddingRight || 0,
                paddingLeft: +computed.paddingLeft || 0,
                paddingTop: +computed.paddingTop || 0,
                marginBottom: +computed.marginBottom || 0,
                marginRight: +computed.marginRight || 0,
                marginLeft: +computed.marginLeft || 0,
                marginTop: +computed.marginTop || 0,
                computedBottom: +computed[BOTTOM] || 0,
                computedRight: +computed[RIGHT] || 0,
                computedLeft: +computed[LEFT] || 0,
                computedTop: +computed[TOP] || 0,
                top: clientrect[TOP] || 0,
                left: clientrect[LEFT] || 0,
                right: clientrect[RIGHT] || 0,
                bottom: clientrect[BOTTOM] || 0,
                width: clientrect[WIDTH] || 0,
                height: clientrect[HEIGHT] || 0
            };
        },
        clientRect = function (item) {
            var returnValue = isElement(item) ? item.getBoundingClientRect() : {};
            return {
                top: returnValue[TOP] || 0,
                left: returnValue[LEFT] || 0,
                right: returnValue[RIGHT] || 0,
                bottom: returnValue[BOTTOM] || 0,
                width: returnValue[WIDTH] || item.clientWidth || 0,
                height: returnValue[HEIGHT] || item.clientHeight || 0
            };
        },
        /**
         * @private
         * @func
         */
        unitRemoval = function (str, unit) {
            return +(str.split(unit || 'px').join(EMPTY_STRING).trim()) || 0;
        },
        /**
         * @private
         * @func
         */
        getStyleSize = function (el, attr, win) {
            var val, elStyle, num = el;
            if (isObject(el)) {
                if (isElement(el)) {
                    elStyle = getComputed(el, win);
                } else {
                    elStyle = el;
                }
                val = elStyle[attr];
            } else {
                val = el;
            }
            if (isString(val)) {
                val = unitRemoval(val);
            }
            return val;
        },
        /**
         * @private
         * @func
         */
        filterExpressions = {
            ':even': function (el, idx) {
                return (idx % 2);
            },
            ':odd': function (el, idx) {
                return ((idx + 1) % 2);
            }
        },
        // always in pixels
        numberToUnit = {
            'in': function (val, el, win, styleAttr) {
                return val / 96;
            },
            vh: function (val, el, win, styleAttr) {
                return (val / win[INNER_HEIGHT]) * 100;
            },
            px: function (val, el, win, styleAttr) {
                return val;
            },
            cm: function (val, el, win, styleAttr) {
                return val / 37.79527559055118;
            },
            vw: function (val, el, win, styleAttr) {
                return (val / win[INNER_WIDTH]) * 100;
            },
            em: function (val, el, win, styleAttr) {
                return val / getStyleSize(el, FONT_SIZE, win);
            },
            mm: function (val, el, win, styleAttr) {
                return val / 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                var mult = Math.min(win[INNER_HEIGHT], win[INNER_WIDTH]);
                return (val / mult) * 100;
            },
            rem: function (val, el, win, styleAttr) {
                return val / getStyleSize(win[DOCUMENT][BODY][PARENT_NODE], FONT_SIZE, win);
            },
            pt: function (val, el, win, styleAttr) {
                return val / 1.333333333333333;
            },
            vmax: function (val, el, win, styleAttr) {
                var mult = Math.max(win[INNER_HEIGHT], win[INNER_WIDTH]);
                return (val / mult) * 100;
            },
            '%': function (val, el, win, styleAttr) {
                var parent = isElement(el) ? el[PARENT_NODE] : el,
                    _val = getStyleSize(parent, styleAttr, win);
                return (val / _val) * 100;
            },
            pc: function (val, el, win, styleAttr) {
                return val / 16;
            }
        },
        numToUnits = function (num, unit, el, winTop, styleAttr, returnNum) {
            var number = num;
            if (num) {
                number = numberToUnit[unit](num, el, winTop, styleAttr);
            }
            number = (number || 0);
            if (!returnNum) {
                number += unit;
            }
            return number;
        },
        /**
         * @private
         * @func
         */
        unitToNumber = {
            'in': function (val, el, win, styleAttr) {
                return val * 96;
            },
            vh: function (val, el, win, styleAttr) {
                return win[INNER_HEIGHT] * val / 100;
            },
            px: function (val, el, win, styleAttr) {
                return val;
            },
            cm: function (val, el, win, styleAttr) {
                return val * 37.79527559055118;
            },
            vw: function (val, el, win, styleAttr) {
                return win[INNER_WIDTH] * val / 100;
            },
            em: function (val, el, win, styleAttr) {
                return getStyleSize(el, FONT_SIZE) * val;
            },
            mm: function (val, el, win, styleAttr) {
                return val * 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                return ((Math.min(win[INNER_HEIGHT], win[INNER_WIDTH]) || 1) * val / 100);
            },
            rem: function (val, el, win, styleAttr) {
                return getStyleSize(win[DOCUMENT][BODY][PARENT_NODE], FONT_SIZE) * val;
            },
            pt: function (val, el, win, styleAttr) {
                return val * 1.333333333333333;
            },
            vmax: function (val, el, win, styleAttr) {
                return ((Math.max(win[INNER_HEIGHT], win[INNER_WIDTH]) || 1) * val / 100);
            },
            '%': function (val, el, win, styleAttr) {
                var parent = isElement(el) ? el[PARENT_NODE] : el,
                    _val = getStyleSize(parent, styleAttr);
                return (val * _val) / 100;
            },
            pc: function (val, el, win, styleAttr) {
                return val * 16;
            }
        },
        unitsToNum = function (str, el, winTop, styleAttr) {
            var ret, number, unit = units(str);
            if (!unit) {
                return str;
            }
            number = unitRemoval(str, unit);
            if (unitToNumber[unit]) {
                number = unitToNumber[unit](number, el, winTop, styleAttr) || 0;
            }
            return number;
        },
        /**
         * @private
         * @func
         */
        /**
         * @private
         * @func
         */
        // array, array, (array)
        diff = function (outputA, outputB, diffs_) {
            var opposition, element = this,
                view = element.view,
                first = !diffs_,
                diffs = diffs_ || [],
                target = outputA.length > elements.length ? (opposition = outputA) && outputB : (opposition = outputB) && outputA;
            _.foldl(target, function (diffs, element, index) {
                var correspondant = opposition[index];
                var tagNameA = element.tagName;
                var tagNameB = correspondant.tagName;
                if (tagNameA !== tagNameB) {
                    // swap node
                    return;
                }
                var isA = attributeApi.read(element, 'is');
                var isB = attributeApi.read(correspondant, 'is');
                if (isA || isB) {
                    // swap node
                    return;
                }
                // if (true) {}
            });
            return diffs;
        },
        elementTextOrComment = wrap([1, 3, 8], BOOLEAN_TRUE),
        // {
        //     '1': BOOLEAN_TRUE,
        //     '3': BOOLEAN_TRUE,
        //     '8': BOOLEAN_TRUE
        // },
        createElement = function (tag_, manager, attributes_, children_) {
            var confirmedObject, foundElement, elementName, newElement, newManager, documnt = manager && manager.element(),
                registeredElements = manager && manager.registeredElements,
                attributes = attributes_,
                children = children_,
                tag = tag_;
            if (isObject(tag)) {
                children = tag.children;
                attributes = tag.attributes;
                confirmedObject = BOOLEAN_TRUE;
                tag = tag.tagName;
                if (tag_.text) {
                    return makeText(tag_.content, manager);
                }
                if (tag_.comment) {
                    return makeComment(tag_.content, manager);
                }
            }
            foundElement = registeredElements && registeredElements[tag];
            elementName = foundElement === BOOLEAN_TRUE ? tag : foundElement;
            // native create
            if (!elementName) {
                exception('custom tag names must be registered before they can be used');
            }
            newElement = documnt.createElement(elementName);
            if (foundElement && foundElement !== BOOLEAN_TRUE) {
                attributeApi.write(newElement, CUSTOM_KEY, tag);
            }
            newManager = manager.returnsManager(newElement);
            if (!confirmedObject && !attributes && !children) {
                return newManager;
            }
            if (attributes) {
                newManager.attr(attributes);
            }
            if (!children) {
                return newManager;
            }
            if (isString(children)) {
                newManager.html(children);
            } else {
                newManager.append(reconstruct(children, manager));
            }
            return newManager;
        },
        makeText = function (content, manager) {
            return manager.element().createTextNode(content);
        },
        makeComment = function (content, manager) {
            return manager.element().createComment(content);
        },
        makeTree = function (str, manager) {
            var div = createElement(DIV, manager);
            // collect custom element
            div.html(str);
            return div.children().remove().toArray();
        },
        makeBranch = function (str, manager) {
            return makeTree(str, manager)[0];
        },
        /**
         * @private
         * @func
         */
        /**
         * @private
         * @func
         */
        mappedConcat = function (context, handler, items) {
            var list = [];
            return list.concat.apply(list, items ? map(items, handler) : context.map(handler));
        },
        createElements = function (tagName, context) {
            return DOMA(foldl(toArray(tagName, SPACE), function (memo, name) {
                var createdElement = createElement(name, context);
                memo.push(createdElement);
                return memo;
            }, []), NULL, NULL, NULL, context);
        },
        fragment = function (els_, context) {
            var frag, els = els_;
            if (isFragment(els)) {
                frag = els;
            } else {
                if (DOMA.isInstance(els)) {
                    els = els.toArray();
                }
                if (!isArrayLike(els)) {
                    els = els && toArray(els);
                }
                frag = context.createDocumentFragment();
                duff(els, function (manager_) {
                    var parentNode, manager = context.returnsManager(manager_),
                        el = manager.element();
                    if (!manager.is(ELEMENT) || manager.is(FRAGMENT)) {
                        return;
                    }
                    parentNode = el[PARENT_NODE];
                    // we don't want to create a dom manager object if we're just checking the parentfffffffff
                    if (parentNode && !isFragment(parentNode)) {
                        dispatchDetached([el], context);
                    }
                    frag[APPEND_CHILD](el);
                });
            }
            return frag;
        },
        htmlTextManipulator = function (attr) {
            return function (string) {
                var dom = this;
                return string !== UNDEFINED ? dom.eachCall(attr, string) && dom : dom.results(attr).join(EMPTY_STRING);
            };
        },
        horizontalTraverser = function (method, _idxChange) {
            return attachPrevious(function (context, idxChange_) {
                var collected = [],
                    list = context.toArray(),
                    idxChange = _idxChange || idxChange_;
                if (idxChange) {
                    context.duff(function (manager) {
                        if ((traversal = manager[method](idxChange))) {
                            add(collected, traversal);
                        }
                    });
                } else {
                    // didn't traverse anywhere
                    collected = list;
                }
                return collected;
            });
        },
        discernClassProperty = function (isProp) {
            return isProp ? CLASSNAME : CLASS;
        },
        makeDataKey = function (_key) {
            var dataString = 'data-',
                key = unCamelCase(_key),
                sliced = _key.slice(0, 5);
            if (dataString !== sliced) {
                key = dataString + _key;
            }
            return key;
        },
        styleAttributeManipulator = function (manager, key, value) {
            var element = manager.element();
            if (manager.is(ELEMENT)) {
                if (value === BOOLEAN_TRUE) {
                    return element[STYLE][key];
                } else {
                    element[STYLE][key] = value;
                }
            }
        },
        attachPrevious = function (fn) {
            return function (one, two, three, four, five) {
                var prev = this,
                    // ensures it's still a dom object
                    result = fn(prev, one, two, three, four, five),
                    // don't know if we went up or down, so use null as context
                    obj = new DOMA[CONSTRUCTOR](result, NULL, BOOLEAN_TRUE, NULL, prev.context.owner);
                obj._previous = prev;
                return obj;
            };
        },
        // coordinates
        covers = function (element, coords) {
            var _clientRect = clientRect(element),
                bottom = _clientRect[BOTTOM],
                right = _clientRect[RIGHT],
                left = _clientRect[LEFT],
                tippytop = _clientRect[TOP],
                x = coords.x,
                y = coords.y,
                ret = BOOLEAN_FALSE;
            if (x > left && x < right && y > tippytop && y < bottom) {
                ret = BOOLEAN_TRUE;
            }
            return ret;
        },
        center = function (clientRect) {
            return {
                x: clientRect[LEFT] + (clientRect[WIDTH] / 2),
                y: clientRect[TOP] + (clientRect[HEIGHT] / 2)
            };
        },
        distance = function (a, b) {
            var xdiff = a.x - b.x,
                ydiff = a.y - b.y;
            return Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
        },
        closer = function (center, current, challenger) {
            return distance(center, current) < distance(center, challenger);
        },
        createSelector = function (doma, args, fn) {
            var fun, selector, capturing, group, name = args.shift();
            if (isString(args[0]) || args[0] == NULL) {
                selector = args.shift();
            }
            if (isString(args[0])) {
                args[0] = doma[args[0]];
            }
            if (!isFunction(args[0])) {
                return this;
            }
            fun = args.shift();
            capturing = args.shift();
            if (isString(capturing)) {
                group = capturing;
                capturing = BOOLEAN_FALSE;
            } else {
                capturing = !!capturing;
            }
            // that's all folks
            group = args.shift();
            fn(doma, name, selector, fun, capturing, group);
            return doma;
        },
        expandEventListenerArguments = function (fn) {
            return function () {
                var selector, doma = this,
                    args = toArray(arguments),
                    nameOrObject = args.shift();
                if (isObject(nameOrObject)) {
                    if (isString(args[0])) {
                        selector = args.shift();
                    }
                    each(nameOrObject, function (handler, key) {
                        createSelector(doma, [key, selector, handler].concat(args), fn);
                    });
                    return doma;
                } else {
                    args.unshift(nameOrObject);
                    return createSelector(doma, args, fn);
                }
            };
        },
        validateEvent = function (evnt, el, name_) {
            return evnt && isObject(evnt) && !isWindow(evnt) && isNumber(evnt.AT_TARGET) ? evnt : {
                data: stringify(evnt),
                type: name_,
                bubbles: BOOLEAN_FALSE,
                eventPhase: 2,
                cancelable: BOOLEAN_FALSE,
                defaultPrevented: BOOLEAN_FALSE,
                isTrusted: BOOLEAN_FALSE,
                timeStamp: now(),
                target: el
            };
        },
        isCapturing = function (evnt) {
            var capturing = BOOLEAN_FALSE,
                eventPhase = evnt.eventPhase;
            if (eventPhase === 1) {
                capturing = BOOLEAN_TRUE;
            }
            return capturing;
        },
        _eventExpander = wrap({
            resize: 'resize,orientationchange',
            ready: 'DOMContentLoaded',
            wheel: 'wheel,mousewheel',
            deviceorientation: 'deviceorientation,mozOrientation',
            fullscreenalter: 'webkitfullscreenchange,mozfullscreenchange,fullscreenchange,MSFullscreenChange',
            hover: 'mouseenter,mouseleave',
            forcewillbegin: 'mouseforcewillbegin,webkitmouseforcewillbegin',
            forcechange: 'mouseforcechange,webkitmouseforcechange',
            forcedown: 'mouseforcedown,webkitmouseforcedown',
            forceup: 'mouseforceup,webkitmouseforceup',
            force: 'mouseforcewillbegin,webkitmouseforcewillbegin,mouseforcechange,webkitmouseforcechange,mouseforcedown,webkitmouseforcedown,mouseforceup,webkitmouseforceup'
        }, toArray),
        distilledEventName = foldl(_eventExpander, function (memo, arr, key) {
            duff(arr, function (item) {
                memo[item] = key;
            });
            return memo;
        }, {}),
        eventExpander = function (expanders, fn, stack_) {
            var stack = stack_ || [];
            return function (nme) {
                var name = nme,
                    hadInList = indexOf(stack, name) !== -1;
                if (!hadInList) {
                    stack.push(name);
                }
                if (expanders[name] && !hadInList) {
                    duff(expanders[name], eventExpander(expanders, fn, stack));
                } else {
                    fn(name, stack[0], stack.slice(0));
                }
                if (!hadInList) {
                    stack.pop();
                }
            };
        },
        addEventListener = expandEventListenerArguments(function (manager, name, selector, callback, capture, group) {
            return isFunction(callback) ? _addEventListener(manager, name, group, selector, callback, capture) : manager;
        }),
        addEventListenerOnce = expandEventListenerArguments(function (manager, types, selector, callback, capture, group) {
            var _callback;
            return isFunction(callback) && _addEventListener(manager, types, group, selector, (_callback = once(function () {
                _removeEventListener(manager, types, group, selector, _callback, capture);
                return callback.apply(this, arguments);
            })), capture);
        }),
        removeEventListener = expandEventListenerArguments(function (manager, name, selector, handler, capture, group) {
            return isFunction(handler) ? _removeEventListener(manager, name, group, selector, handler, capture) : manager;
        }),
        _addEventListener = function (manager, eventNames, group, selector, handler, capture) {
            var events, wasCustom = manager.is(CUSTOM);
            duff(toArray(eventNames, SPACE), eventExpander(manager.owner.events.expanders, function (name, passedName, nameStack) {
                events = events || manager.directive(EVENTS);
                if (!ALL_EVENTS_HASH[name]) {
                    manager.mark(CUSTOM_LISTENER);
                }
                events.attach(name, {
                    capturing: !!capture,
                    origin: manager,
                    handler: handler,
                    group: group,
                    selector: selector,
                    passedName: passedName,
                    domName: name,
                    domTarget: manager,
                    nameStack: nameStack
                });
            }));
            if (!wasCustom && manager.is(CUSTOM_LISTENER)) {
                markCustom(manager, BOOLEAN_TRUE);
                manager.remark(ATTACHED, isAttached(manager.element(), manager.owner));
            }
            return manager;
        },
        eventToNamespace = function (evnt) {
            var evntName;
            if (!isString(evnt)) {
                evnt = evnt.type;
            }
            evnt = evnt.split(PERIOD);
            evntName = evnt.shift();
            return [evntName, evnt.sort().join(PERIOD)];
        },
        appendChildDomManager = function (el) {
            return this.insertAt(el, NULL);
        },
        prependChild = function (el) {
            return this.insertAt(el, 0);
        },
        sharedInsertBefore = function (els, index, clone) {
            var parent = this.parent();
            if (is.number(index)) {
                return this.insertAt(els, index);
            } else {
                return parent.insertAt(els, parent.children().indexOf(this));
            }
        },
        insertAfter = function (els, index, clone) {
            var parent = this.parent();
            if (is.number(index)) {
                return this.insertAt(els, index + 1);
            } else {
                return parent.insertAt(els, parent.children().indexOf(this) + 1);
            }
        },
        attributeParody = function (method) {
            return function (one, two) {
                return attributeApi[method](this.element(), one, two);
            };
        },
        getInnard = function (attribute, manager) {
            var windo, win, doc, parentElement, returnValue = EMPTY_STRING;
            if (manager.is(IFRAME)) {
                testIframe(manager);
                windo = manager.window();
                if (windo.is(ACCESSABLE)) {
                    parentElement = windo.element();
                    doc = parentElement[DOCUMENT];
                    returnValue = doc.body ? doc.body[PARENT_NODE].outerHTML : EMPTY_STRING;
                }
            } else {
                if (manager.is(ELEMENT)) {
                    parentElement = manager.element();
                    returnValue = parentElement[attribute];
                }
            }
            return returnValue;
        },
        setInnard = function (attribute, manager, value) {
            var children, cachedValue, win, doc, windo, doTheThing, parentElement,
                owner = manager.owner;
            if (manager.is(IFRAME)) {
                windo = manager.window();
                testIframe(manager);
                if (windo.is(ACCESSABLE)) {
                    parentElement = windo.element();
                    doc = parentElement[DOCUMENT];
                    doc.open();
                    doc.write(value);
                    doc.close();
                    doTheThing = BOOLEAN_TRUE;
                }
            } else {
                if (manager.is(ELEMENT)) {
                    parentElement = manager.element();
                    if (attribute === INNER_HTML) {
                        children = toArray(manager.$(CUSTOM_ATTRIBUTE));
                    }
                    parentElement[attribute] = value || EMPTY_STRING;
                    if (children[LENGTH]) {
                        // detach old
                        dispatchDetached(children, owner);
                    }
                    // establish new
                    duff(manager.$(CUSTOM_ATTRIBUTE, parentElement), owner.returnsManager, owner);
                }
            }
        },
        innardManipulator = function (attribute) {
            return function (value) {
                var manager = this,
                    returnValue = manager;
                if (value === UNDEFINED) {
                    return getInnard(attribute, manager);
                } else {
                    setInnard(attribute, manager, value);
                    return manager;
                }
            };
        },
        /**
         * @func
         */
        testIframe = function (manager, element_) {
            var src, contentWindow, contentWindowManager, element;
            manager.remark(IFRAME, manager.tagName === IFRAME);
            if (!manager.is(IFRAME)) {
                return;
            }
            element = element_ || manager.element();
            src = element.src;
            contentWindow = element.contentWindow;
            manager.remark('windowReady', !!contentWindow);
            if (!contentWindow) {
                return;
            }
            contentWindowManager = manager.owner.returnsManager(contentWindow);
            contentWindowManager.iframe = manager;
            markGlobal(contentWindowManager, contentWindow, src);
            if (!manager.cachedContent || !contentWindowManager.is(ACCESSABLE)) {
                return;
            }
            // must be string
            manager.html(manager.cachedContent);
            manager.cachedContent = NULL;
        },
        cachedDispatch = factories.Events[CONSTRUCTOR][PROTOTYPE][DISPATCH_EVENT],
        RUNNING_EVENT = 'runningEvent',
        eventDispatcher = function (manager, name, e, capturing_, DO_NOT_TRUST) {
            var capturing = !!capturing_;
            manager.owner.mark(RUNNING_EVENT);
            var validated = validateEvent(e, manager.element(), name);
            var returnValue = cachedDispatch.call(manager, name, validated, {
                capturing: capturing
            });
            manager.owner.remark(RUNNING_EVENT, DO_NOT_TRUST);
            return returnValue;
        },
        directAttributes = {
            id: BOOLEAN_FALSE,
            src: BOOLEAN_FALSE,
            checked: BOOLEAN_FALSE,
            disabled: BOOLEAN_FALSE,
            classes: CLASSNAME
        },
        videoDirectEvents = {
            play: 'playing',
            pause: 'paused'
        },
        directEvents = toArray('blur,focus,focusin,focusout,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,change,select,submit,keydown,keypress,keyup,error,contextmenu'),
        // collected here so DOMA can do what it wants
        allDirectMethods = directEvents.concat(_.keys(videoDirectEvents), _.keys(directAttributes)),
        isAttached = function (element_, owner, passed_element_) {
            var isAttachedResult, parent, potential, manager = owner.returnsManager(element_),
                element = passed_element_ || manager.element();
            if ((isAttachedResult = manager.is(ATTACHED))) {
                return isAttachedResult;
            }
            if (manager.is(WINDOW)) {
                return BOOLEAN_TRUE;
            }
            while (!parent && element && element[PARENT_NODE]) {
                potential = element[PARENT_NODE];
                if (isFragment(potential)) {
                    return BOOLEAN_FALSE;
                }
                if (isDocument(potential)) {
                    return BOOLEAN_TRUE;
                }
                if (potential[__ELID__]) {
                    return isAttached(potential, owner);
                }
                element = potential;
            }
            return BOOLEAN_FALSE;
        },
        dispatchDomEvent = function (evnt, mark) {
            return function (list, owner) {
                var managers = [];
                // mark all managers first
                duff(list, function (element) {
                    var manager = owner.returnsManager(element);
                    var original = manager.is(ATTACHED);
                    manager.remark(ATTACHED, mark);
                    if (mark !== original && manager.is(ELEMENT) && manager.is(CUSTOM_LISTENER)) {
                        managers.push(manager);
                    }
                });
                eachCall(managers, DISPATCH_EVENT, evnt);
            };
        },
        dispatchDetached = dispatchDomEvent('detach', BOOLEAN_FALSE),
        dispatchAttached = dispatchDomEvent('attach', BOOLEAN_TRUE),
        applyStyle = function (key, value, manager, important) {
            var newStyles, found, cached, element = manager.element();
            if (!manager.is(ELEMENT) || (element[STYLE][key] === value && important)) {
                return BOOLEAN_FALSE;
            }
            cached = attributeApi.read(element, STYLE);
            value = value !== '' ? convertStyleValue(key, value) : value;
            if (!important) {
                duff(prefixedStyles[camelCase(key)], function (prefix) {
                    element[STYLE][prefix + unCamelCase(key)] = value;
                });
            } else {
                // write with importance
                attributeApi.write(element, STYLE, (newStyles = foldl(cached.split(';'), function (memo, item_, index, items) {
                    var item = item_.trim(),
                        itemSplit = item.split(COLON),
                        property = itemSplit[0].trim(),
                        setValue = itemSplit[1].trim();
                    if (property === key) {
                        found = BOOLEAN_TRUE;
                        setValue = value + ' !important';
                    }
                    memo.push([property, setValue].join(': '));
                    if (index === items[LENGTH] - 1 && !found) {
                        memo.push([key, value + ' !important'].join(': '));
                    }
                    return memo;
                }, []).join('; ')) ? newStyles + ';' : newStyles);
            }
            return attributeApi.read(element, STYLE) !== cached;
        },
        attributeValuesHash = {
            set: function (attributeManager, set, nulled, read) {
                attributeManager.refill(set === BOOLEAN_TRUE ? [] : set);
                if (set === BOOLEAN_FALSE) {
                    attributeManager.mark(REMOVING);
                }
            },
            add: function (attributeManager, add) {
                duff(add, attributeManager.add, attributeManager);
            },
            remove: function (attributeManager, remove) {
                duff(remove, attributeManager.remove, attributeManager);
            },
            toggle: function (attributeManager, togglers, direction) {
                duff(togglers, function (toggler) {
                    attributeManager.toggle(toggler, direction);
                });
            },
            change: function (attributeManager, remove, add) {
                this.remove(attributeManager, remove);
                this.add(attributeManager, toArray(add, SPACE));
            }
        },
        unmarkChange = function (fn) {
            return function (manager, idx) {
                var returnValue = fn(manager, idx);
                if (manager.is(ATTRIBUTES_CHANGING)) {
                    manager.unmark(ATTRIBUTES_CHANGING);
                    manager[DISPATCH_EVENT](ATTRIBUTE_CHANGE);
                }
                return returnValue;
            };
        },
        queueAttributeValues = function (attribute_, second_, third_, api_, domHappy_, merge, passedTrigger_) {
            var attribute = attribute_ === CLASS ? CLASSNAME : attribute_,
                domHappy = domHappy_ || unCamelCase,
                api = api_,
                unCamelCased = api.preventUnCamel ? attribute : domHappy(attribute),
                withClass = unCamelCased === CLASSNAME || unCamelCased === CLASS__NAME,
                trigger = (withClass ? (api = propertyApi) && (unCamelCased = CLASSNAME) && CLASSNAME : passedTrigger_) || unCamelCased;
            api = propsHash[camelCase(trigger)] ? propertyApi : attributeApi;
            return function (manager, idx) {
                var converted, generated, el = manager.element(),
                    read = api.read(el, unCamelCased),
                    returnValue = manager,
                    attributeManager = ensureManager(manager, unCamelCased, read);
                if (merge === 'get') {
                    if (!idx) {
                        returnValue = read;
                    }
                    return returnValue;
                }
                intendedObject(second_, third_, function (second, third) {
                    var currentMerge = merge || (third === BOOLEAN_TRUE ? 'add' : (third === BOOLEAN_FALSE ? REMOVE : 'toggle'));
                    attributeValuesHash[currentMerge](attributeManager, isString(second) ? second.split(SPACE) : second, third, read);
                });
                if (attributeManager.changeCounter) {
                    if (attributeManager.is(REMOVING)) {
                        attributeManager.unmark(REMOVING);
                        api.remove(el, unCamelCased);
                    } else {
                        generated = attributeManager.generate(SPACE);
                        api.write(el, unCamelCased, cautiousConvertValue(generated));
                    }
                }
                if (generated !== read && manager.is(CUSTOM_LISTENER)) {
                    manager.mark(ATTRIBUTES_CHANGING);
                    manager[DISPATCH_EVENT](ATTRIBUTE_CHANGE + COLON + trigger, {
                        previous: read,
                        current: convertAttributeValue(generated)
                    });
                }
            };
        },
        domAttributeManipulatorExtended = function (proc, innerHandler, api) {
            return function (normalize) {
                return function (first, second, third, alternateApi, domHappy, trigger) {
                    return normalize(proc(first, second, third, alternateApi || api, domHappy, innerHandler, trigger), this);
                };
            };
        },
        hasAttributeValue = function (property, values_, third, api) {
            var values = toArray(values_, SPACE);
            return function (manager) {
                var el = manager.element(),
                    attributeManager = getStringManager(manager, property),
                    read = api.read(el, property);
                attributeManager.ensure(read, SPACE);
                return find(values, function (value) {
                    var stringInstance = attributeManager.get(ID, value);
                    return stringInstance ? !stringInstance.isValid() : BOOLEAN_TRUE;
                });
            };
        },
        setValue = domAttributeManipulatorExtended(queueAttributeValues, 'set', attributeApi),
        addValue = domAttributeManipulatorExtended(queueAttributeValues, 'add', attributeApi),
        removeValue = domAttributeManipulatorExtended(queueAttributeValues, REMOVE, attributeApi),
        toggleValue = domAttributeManipulatorExtended(queueAttributeValues, 'toggle', attributeApi),
        changeValue = domAttributeManipulatorExtended(queueAttributeValues, 'change', attributeApi),
        getValue = domAttributeManipulatorExtended(queueAttributeValues, 'get', attributeApi),
        hasValue = domAttributeManipulatorExtended(hasAttributeValue, 'has', attributeApi),
        getSetter = function (proc, givenApi, keyprocess) {
            return function (understandsContext) {
                return function (first, second_, api_) {
                    var reverseCache, context = this,
                        firstIsString = isString(first),
                        api = firstIsString ? api_ : second_,
                        second = firstIsString ? second_ : NULL,
                        usingApi = givenApi || api;
                    if (firstIsString && second === UNDEFINED) {
                        context = context.item(0);
                        return usingApi.read(context.element(), keyprocess(first));
                    } else {
                        reverseCache = {};
                        context.each(unmarkChange(intendedIteration(first, second, function (first, second, manager, idx) {
                            var processor = reverseCache[first] = reverseCache[first] || proc(first, second, NULL, usingApi, keyprocess, isObject(second) ? NULL : 'set');
                            processor(manager, idx);
                        })));
                        return context;
                    }
                };
            };
        },
        attrApi = getSetter(queueAttributeValues, attributeApi, unCamelCase),
        dataApi = getSetter(queueAttributeValues, attributeApi, makeDataKey),
        propApi = getSetter(queueAttributeValues, propertyApi, camelCase),
        domFirst = function (handler, context) {
            var first = context.item(0);
            return first && handler(first, 0);
        },
        domIterates = function (handler, context) {
            context.each(handler);
            return context;
        },
        returnsFirst = function (fn, context) {
            return fn(context.item(), 0);
        },
        domContextFind = function (fn, context) {
            return !context.find(fn);
        },
        makeValueTarget = function (target, passed_, api, domaHappy) {
            var passed = passed_ || target;
            return _.foldl(toArray('add,remove,toggle,change,has,set'), function (memo, method_) {
                var method = method_ + 'Value';
                memo[method_ + capitalize(target)] = function (one, two) {
                    return this[method](passed, one, two, api, domaHappy, target);
                };
                return memo;
            }, {});
        },
        classApplicationWrapper = function (key, hasList, noList) {
            return function (element, list, second) {
                if (element.classList && element.classList[key] && !isIE) {
                    return hasList(element, list, second);
                } else {
                    return noList(element, toArray(element[CLASSNAME] ? element[CLASSNAME] : [], SPACE), list, second);
                }
            };
        },
        toggles = function (list, direction_, item) {
            var listIndex, direction = direction_;
            if (!item) {
                return;
            }
            if (direction == NULL) {
                listIndex = indexOf(list, item);
                direction = listIndex === -1;
            }
            listIndex = listIndex === UNDEFINED ? indexOf(list, item) : listIndex;
            if (direction) {
                if (listIndex === -1) {
                    list.push(item);
                }
            } else {
                if (listIndex !== -1) {
                    list.splice(listIndex, 1);
                }
            }
        },
        arrayAdds = _.add,
        arrayRemoves = _.remove,
        // ua = (win.navigator && win.navigator.userAgent),
        isIE = !!(function () {
            var sAgent = window.navigator.userAgent;
            var Idx = sAgent.indexOf("MSIE");
            // If IE, return version number.
            if (Idx > 0) return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
            // If IE 11 then look for Updated user agent string.
            else if (!!navigator.userAgent.match(/Trident\/7\./)) return 11;
            else return 0; //It is not IE
        }()),
        classApiShim = {
            add: classApplicationWrapper('add', function (element, list) {
                element.classList.add.apply(element.classList, list);
            }, function (element, current, list) {
                duff(list, passesFirstArgument(bind(arrayAdds, NULL, current)));
                element[CLASSNAME] = current.join(SPACE);
            }),
            remove: classApplicationWrapper('remove', function (element, list) {
                element.classList.remove.apply(element.classList, list);
            }, function (element, current, list) {
                duff(list, passesFirstArgument(bind(arrayRemoves, NULL, current)));
                element[CLASSNAME] = current.join(SPACE);
            }),
            // mess with toggle here so that you
            toggle: classApplicationWrapper('toggler', noop, function (element, current, list, direction) {
                duff(list, passesFirstArgument(bind(toggles, NULL, current, direction)));
                element[CLASSNAME] = current.join(SPACE);
            }),
            contains: classApplicationWrapper('contains', function (element, list) {
                return !element.classList.contains.apply(element.classList, list);
            }, function (element, current, list) {
                return find(list, function (item) {
                    return !has(current, item, BOOLEAN_TRUE);
                });
            }),
            change: classApplicationWrapper('add', function (element, list, second) {
                element.classList.remove.apply(element.classList, list);
                element.classList.add.apply(element.classList, toArray(second, SPACE));
            }, function (element, current, list, second) {
                duff(list, passesFirstArgument(bind(arrayRemoves, NULL, current)));
                duff(second, passesFirstArgument(bind(arrayAdds, NULL, current)));
                element[CLASSNAME] = current.join(SPACE);
            })
        },
        passer = function (key) {
            return function (a, b) {
                return function (manager) {
                    return classApiShim[key](manager.element(), a, b);
                };
            };
        },
        classApi = foldl(foldl(toArray('add,remove,toggle,change'), function (memo, key) {
            memo[key] = function (manipulator) {
                return function (classes, second) {
                    this.each(manipulator(toArray(classes, SPACE), second ? toArray(second, SPACE) : UNDEFINED));
                    return this;
                };
            };
        }, {
            has: function (manipulator) {
                return function (classes) {
                    return !this.find(manipulator(toArray(classes, SPACE)));
                };
            }
        }), function (memo, handler, key) {
            memo[key + 'Class'] = handler(passer(key === 'has' ? 'contains' : key));
        }, {}),
        markCustom = function (manager, forceCustom, element_) {
            var resultant, isCustom, isCustomValue = manager.is(ELEMENT) && attributeApi.read(element_ || manager.element(), CUSTOM_KEY);
            // more efficient way to do this?
            manager.remark(CUSTOM, forceCustom || !!isCustomValue);
            if (manager.is(CUSTOM) && !isCustomValue) {
                isCustomValue = BOOLEAN_TRUE;
            }
            resultant = manager.is(ELEMENT) && writeAttribute(element_ || manager.element(), CUSTOM_KEY, isCustomValue);
            if (isCustomValue) {
                manager[REGISTERED_AS] = isCustomValue;
            }
        },
        markElement = function (manager, owner, element) {
            manager.unmark(ELEMENT);
            manager.unmark(IFRAME);
            manager.tagName = BOOLEAN_FALSE;
            if (manager.is(WINDOW)) {
                return;
            }
            if ((manager.remark(ELEMENT, isElement(element)))) {
                manager.tagName = tag(element);
                manager.owner = owner;
                testIframe(manager, element);
                markCustom(manager, BOOLEAN_FALSE, element);
            }
        },
        markGlobal = function (manager, element, src) {
            var isAccessable;
            manager.remark(WINDOW, isWindow(element));
            if (!manager.is(WINDOW) || !manager.owner) {
                return;
            }
            manager.remark(ACCESSABLE, (isAccessable = !!wraptry(function () {
                return element[DOCUMENT];
            })));
            manager.remark('topWindow', (element === element.top));
            manager.setAddress();
            // either the window is null, (we're detached),
            // or it is an unfriendly window
            if (!isAccessable) {
                return;
            }
            if (manager.is('topWindow')) {
                // tests do never fail on top window because it always
                // exists otherwise this code would not run
                return;
            }
            // more accessable tests
            manager.remark(ACCESSABLE, manager.sameOrigin());
        },
        test = function (manager, owner, element) {
            markGlobal(manager, element);
            markElement(manager, owner, element);
            manager.unmark(DOCUMENT);
            manager.unmark(FRAGMENT);
            manager.unmark(ATTACHED);
            if (manager.is(WINDOW)) {
                manager.mark(ATTACHED);
                return;
            }
            manager.remark(DOCUMENT, isDocument(element));
            manager.remark(FRAGMENT, isFragment(element));
            if (manager.is(DOCUMENT)) {
                manager.mark(ATTACHED);
                return;
            }
            if (manager.is(FRAGMENT)) {
                manager.unmark(ATTACHED);
                return;
            }
            manager.remark(ATTACHED, isAttached(manager, owner, element));
        },
        DOMA_SETUP = factories.DOMA_SETUP = function (windo_) {
            var registeredElements, $, setup, wrapped, windo = windo_,
                doc = windo[DOCUMENT],
                manager = returnsManager(doc, BOOLEAN_TRUE),
                unregisteredElements = factories.Registry(),
                expanders = cloneJSON(_eventExpander),
                cachedMotionEvent, lastCalculatedMotionEvent = 0,
                cachedMotionCalculation = {},
                registeredConstructors = {},
                registeredElementOptions = {},
                defaultMotion = function () {
                    cachedMotionEvent = NULL;
                    return {
                        x: 0,
                        y: 0,
                        z: 0,
                        motionX: 0,
                        motionY: 0,
                        motionZ: 0,
                        interval: 1,
                        rotationRate: 0,
                        alpha: 0,
                        beta: 0,
                        gamma: 0,
                        absolute: 0
                    };
                },
                deltas = {
                    update: function (node, attrs, children, hash) {
                        var results;
                        each(attrs, function (value, key) {
                            if (propsHash[key]) {
                                propertyApi.write(node, kebabCase(key), value);
                            } else {
                                attributeApi.write(node, kebabCase(key), value);
                            }
                        });
                        results = isString(children) ? (node.innerHTML = children) : duff(children, function (child) {
                            appendChild(node, deltas.create(child, node, hash));
                        });
                        return node;
                    },
                    create: function (virtual, parent, hash) {
                        var key, data, created;
                        if (virtual[0] === 'text') {
                            parent.innerHTML += virtual[1];
                            return;
                        }
                        created = doc.createElement(virtual[0]);
                        data = virtual[3];
                        if (data && data.key) {
                            if (hash[data.key]) {
                                exception('can\'t have a non unique key at ' + data.key);
                            }
                            hash[data.key] = created;
                        }
                        parent.appendChild(deltas.update(created, virtual[1], virtual[2], hash));
                        return created;
                    },
                    resetHtml: function (target, newhtml, context) {
                        return function () {
                            context.owner.returnsManager(target).html(newhtml);
                        };
                    },
                    removeNodes: function (els, diffs) {
                        return function () {
                            var removableEls = _.filter(els, function (el) {
                                return !_.find(diffs.keys, function (element, key) {
                                    return element === el;
                                });
                            });
                            return removableEls[LENGTH] ? duff(removableEls, passesFirstArgument(removeChild)) : BOOLEAN_FALSE;
                        };
                    },
                    addNodes: function (parent, els, context, hash) {
                        var frag = doc.createDocumentFragment();
                        duff(els, function (el) {
                            deltas.create(el, frag, hash);
                        });
                        return function () {
                            parent.appendChild(frag);
                            return BOOLEAN_TRUE;
                        };
                    },
                    updateAttribute: function (element, key, value) {
                        return function () {
                            attributeApi.write(element, key, value);
                        };
                    },
                    replaceNode: function (a, b, index, hash, diffs, frag_) {
                        var frag = frag_,
                            parent = a[PARENT_NODE];
                        if (!frag) {
                            frag = doc.createDocumentFragment();
                            deltas.create(b, frag, hash);
                        }
                        return function () {
                            insertBefore(parent, frag, a);
                            var result = a[__ELID__] ? $(a).remove() : removeChild(a);
                        };
                    }
                },
                openBlock = function (selector, total) {
                    return once(function () {
                        total.push(selector.join('') + ' {');
                    });
                },
                closeBlock = function (total) {
                    return function () {
                        total.push(' }\n');
                    };
                },
                buildCss = function (json, selector_, memo_) {
                    var result, baseSelector = selector_ || [],
                        memo = memo_ || [],
                        opensBlock = noop,
                        closesBlock = noop;
                    if (memo_) {
                        opensBlock = openBlock(baseSelector, memo);
                    }
                    result = foldl(json, function (memo, block, key) {
                        var trimmed = key.trim();
                        // var media = trimmed[0] === '@';
                        // if (media) {
                        // return total_.concat(medium[trimmed.split(' ').shift()](json, trimmed, total));
                        // handle one way... possible with an extendable handler?
                        // } else {
                        if (isObject(block)) {
                            if (baseSelector[LENGTH]) {
                                if (trimmed[0] !== '&') {
                                    trimmed = ' ' + trimmed;
                                } else {
                                    trimmed = trimmed.slice(1);
                                }
                            }
                            opensBlock = openBlock(baseSelector, memo);
                            baseSelector.push(trimmed);
                            buildCss(block, baseSelector, memo);
                            baseSelector.pop();
                        } else {
                            opensBlock();
                            closesBlock = closeBlock(memo);
                            // always on the same line
                            memo.push('\n\t' + trimmed + ':' + convertStyleValue(trimmed, block) + ';');
                        }
                        // }
                    }, memo);
                    // if (memo_) {
                    closesBlock(memo);
                    return result.join('');
                };
            if (manager.is('setupComplete')) {
                return manager.$;
            }
            registeredElements = clone(validTagsNamesHash);
            setup = function (e) {
                manager.DOMContentLoadedEvent = e;
                manager.mark('ready');
            };
            $ = function (sel, ctx) {
                var context = ctx || manager;
                return DOMA(sel, context, BOOLEAN_FALSE, manager === context, manager);
            };
            wrapped = extend(wrap({
                $: $,
                createElements: createElements,
                createDocumentFragment: createDocumentFragment,
                registeredElementName: registeredElementName,
                fragment: function () {
                    return returnsManager(fragment(NULL, manager), manager);
                }
            }, function (handler) {
                return function (one) {
                    return handler(one, manager);
                };
            }), wrap({
                makeTree: makeTree,
                makeBranch: makeBranch,
                createElement: createElement,
                diff: diff
            }, function (handler) {
                return function (one, two, three) {
                    return handler(one, manager, two, three);
                };
            }), {
                buildCss: buildCss,
                nodeComparison: function (a, b, hash_, stopper) {
                    return nodeComparison(a, b, hash_, stopper, NULL, NULL, NULL, manager);
                },
                supports: {},
                deltas: deltas,
                registeredConstructors: registeredConstructors,
                registeredElementOptions: registeredElementOptions,
                iframeContent: iframeContent,
                orderEventsByHeirarchy: returns(BOOLEAN_TRUE),
                data: factories.Associator(),
                // documentId: manager.documentId,
                document: manager,
                devicePixelRatio: devicePixelRatio,
                constructor: DOMA[CONSTRUCTOR],
                registeredElements: registeredElements,
                templateSettings: {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /<%=([\s\S]+?)%>/g,
                    escape: /<%-([\s\S]+?)%>/g
                },
                events: {
                    custom: {},
                    expanders: {},
                    lists: wrap({
                        base: Events,
                        svg: SVGEvent,
                        keyboard: KeyboardEvent,
                        gamepad: GamePadEvent,
                        composition: CompositionEvent,
                        mouse: MouseEvents,
                        touch: TouchEvents,
                        device: DeviceEvents,
                        focus: FocusEvent,
                        time: TimeEvent,
                        animation: AnimationEvent,
                        audioProcessing: AudioProcessingEvent,
                        ui: UIEvents,
                        progress: ProgressEvent,
                        all: AllEvents
                    }, cloneJSON)
                },
                returnsManager: function (item) {
                    return item === manager || item === manager.element() ? manager : returnsManager(item, manager);
                },
                expandEvent: function (passedEvent, actualEvent) {
                    var expanders = manager.events.expanders;
                    duff(toArray(actualEvent, SPACE), function (actualEvent) {
                        duff(toArray(passedEvent, SPACE), function (passedEvent) {
                            expanders[passedEvent] = expanders[passedEvent] || [];
                            if (indexOf(expanders[passedEvent], actualEvent) === -1) {
                                expanders[passedEvent].push(actualEvent);
                            }
                        });
                    });
                    return manager;
                },
                customEvent: function (key, value) {
                    duff(toArray(key, SPACE), function (key) {
                        manager.events.custom[key] = value;
                    });
                    return manager;
                },
                customAttribute: function (key) {
                    return key ? '[' + CUSTOM_KEY + '="' + key + '"]' : CUSTOM_ATTRIBUTE;
                },
                stashMotionEvent: function (evnt) {
                    cachedMotionEvent = evnt;
                },
                motion: function () {
                    var originalEvent, acc, acc_, someData;
                    if (!cachedMotionEvent) {
                        return defaultMotion();
                    }
                    if (lastCalculatedMotionEvent >= cachedMotionEvent.timestamp) {
                        return cachedMotionCalculation;
                    }
                    lastCalculatedMotionEvent = now();
                    originalEvent = cachedMotionEvent.originalEvent;
                    acc = originalEvent.acceleration || ((acc_ = originalEvent.accelerationIncludingGravity) && {
                        x: acc_.x - 9.81,
                        y: acc_.y - 9.81,
                        z: acc_.z - 9.81
                    });
                    if (acc && isNumber(acc.x)) {
                        cachedMotionCalculation.x = acc.x;
                        cachedMotionCalculation.y = acc.y;
                        cachedMotionCalculation.z = acc.z;
                        cachedMotionCalculation.interval = originalEvent.interval;
                        cachedMotionCalculation.rotationRate = originalEvent.rotationRate;
                        someData = BOOLEAN_TRUE;
                    }
                    if (originalEvent.alpha != NULL) {
                        cachedMotionCalculation.alpha = originalEvent.alpha;
                        cachedMotionCalculation.beta = originalEvent.beta;
                        cachedMotionCalculation.gamma = originalEvent.gamma;
                        cachedMotionCalculation.absolute = originalEvent.absolute;
                        someData = BOOLEAN_TRUE;
                    }
                    if (!someData) {
                        return defaultMotion();
                    }
                    return cachedMotionCalculation;
                },
                // shared across all documents running this version
                plugin: function (handler) {
                    plugins.push(handler);
                    duff(allSetups, function (setup) {
                        handler(setup);
                    });
                    return this;
                },
                compile: function (id, string) {
                    return compile(id, string, manager);
                },
                collectTemplates: function () {
                    return $('script[id]').each(function (script) {
                        compile(script.prop(ID), script.html(), manager);
                    }).remove();
                },
                unregisteredElement: function (manager) {
                    unregisteredElements.keep(manager.registeredElementName(), manager[__ELID__], manager);
                },
                registerElement: function (name, options_) {
                    var generatedTagName, creation, group, wasDefined, options = options_ || {},
                        lastKey = [],
                        extendss = options.extends,
                        events = options.events,
                        prototype = options[PROTOTYPE],
                        destruction = options.destruction,
                        newName = manager.registeredElementName(name);
                    if (registeredElements[name]) {
                        if (registeredElements[name] === BOOLEAN_TRUE) {
                            exception('custom element names must not be used natively by browsers');
                        } else {
                            exception('custom element names can only be registered once per document');
                        }
                    } else {
                        registeredElements[name] = extendss ? registeredElements[extendss] : DIV;
                    }
                    options.creation = (extendss ? _.flows(registeredElementOptions[extendss].creation, options.creation || noop) : options.creation) || noop;
                    registeredElementOptions[name] = options;
                    registeredConstructors[name] = (extendss ? (registeredConstructors[extendss] || DomManager) : DomManager).extend(capitalize(camelCase(name)), extend({}, prototype));
                    if (this.document.is('ready')) {
                        manager.$(manager.customAttribute(name)).each(manager.returnsManager);
                    }
                    return registeredConstructors[name];
                }
            });
            // manager.documentId = app.counter('doc');
            extend(manager, wrapped);
            extend($, wrapped);
            runSupport(manager.supports, manager);
            setupDomContentLoaded(setup, manager);
            manager.mark('setupComplete');
            return $;
        },
        testWithHandler = function (win, evntname, handler, failure) {
            duff(toArray(evntname, SPACE), function (evntname) {
                if (win.addEventListener) {
                    win.addEventListener(evntname, handler);
                    win.removeEventListener(evntname, handler);
                } else {
                    handler(failure);
                }
            });
        },
        runSupport = function (supported, manager) {
            var windowManager = manager.window();
            var windowElement = windowManager.element();
            supported.deviceMotion = !!windowElement.DeviceMotionEvent;
            supported.deviceOrientation = !!windowElement.DeviceOrientationEvent;
            supported.motion = supported.deviceMotion || supported.deviceOrientation;
            testWithHandler(windowElement, 'deviceorientation devicemotion', function (e) {
                if (e.alpha === NULL) {
                    supported.motion = supported.deviceMotion = supported.deviceOrientation = BOOLEAN_FALSE;
                }
            }, {
                alpha: NULL
            });
        },
        styleManipulator = function (one, two) {
            var unCameled, styles, manager = this;
            if (!manager[LENGTH]()) {
                return manager;
            }
            if (isString(one) && two === UNDEFINED) {
                unCameled = unCamelCase(one);
                return (manager = manager.item(0)) && (styles = manager.getStyle()) && ((prefix = find(prefixedStyles[camelCase(one)], function (prefix) {
                    return styles[prefix + unCameled] !== UNDEFINED;
                })) ? styles[prefix + unCameled] : styles[prefix + unCameled]);
            } else {
                manager.each(unmarkChange(intendedIteration(one, two, applyStyle)));
                return manager;
            }
        },
        getValueCurried = getValue(returnsFirst),
        setValueCurried = setValue(domIterates),
        manager_query = function (selector) {
            var manager = this;
            var target = manager.element();
            return manager.owner.$(query(selector, target, manager), target);
        },
        isAppendable = function (els) {
            return els.isValidDomManager || isElement(els) || isFragment(els);
        },
        iframeChangeHandler = function () {
            var windo;
            if ((windo = this.window())) {
                windo.unmark(ACCESSABLE);
                testIframe(this);
            }
        },
        childByTraversal = function (manager, parent, element, idxChange_, ask_, isString) {
            var target, found,
                idxChange = idxChange_,
                children = collectChildren(parent),
                startIndex = indexOf(children, element),
                ask = ask_;
            if (isString) {
                idxChange = idxChange || 1;
                target = element;
                ask = convertSelector(ask, manager.owner);
                while (target && !found) {
                    target = children[(startIndex = (startIndex += idxChange))];
                    found = matchesSelector(target, ask, parent.owner);
                }
            } else {
                target = element;
                target = children[startIndex];
                target = children[startIndex + idxChange];
            }
            return target && manager.owner.returnsManager(target);
        },
        managerHorizontalTraverser = function (method, property, _idxChange_) {
            return function (_idxChange) {
                var stringResult, direction = _idxChange_,
                    parent, children, currentIndex, startIndex, target, idxChange = _idxChange || _idxChange_,
                    manager = this,
                    element = manager.element(),
                    traversed = element[property];
                if (!(stringResult = isString(idxChange)) && property && !traversed) {
                    return manager.owner.returnsManager(traversed);
                }
                if (!(parent = element[PARENT_NODE]) && !traversed) {
                    return;
                }
                return childByTraversal(manager, parent, element, direction, idxChange, stringResult);
            };
        },
        collectCustom = function (manager, markedListener) {
            var element = manager.element();
            return (manager.is(ELEMENT) && manager.is(markedListener ? CUSTOM_LISTENER : CUSTOM) ? [element] : []).concat(query(CUSTOM_ATTRIBUTE, element, manager));
        },
        reconstruct = function (string, context) {
            var fragment = context.createDocumentFragment();
            if (!string) {
                return fragment;
            }
            var objects = parse(string);
            var contextDocument = context.element();
            each(toArray(objects), function (object) {
                var element = contextDocument.createElement(object.tagName);
                var frag = reconstruct(object.children, context);
                element.appendChild(frag);
                each(object.attributes, function (value, key) {
                    attributeApi.write(element, unCamelCase(key), value);
                });
                fragment.appendChild(element);
            });
            return fragment;
        },
        IS_TRUSTED = 'isTrusted',
        FULLSCREEN = 'fullscreen',
        fixHooks = {
            // Includes some event props shared by KeyEvent and MouseEvent
            props: toArray("altKey,bubbles,cancelable,ctrlKey,currentTarget,eventPhase,metaKey,relatedTarget,shiftKey,target,timeStamp,view,which,x,y,deltaX,deltaY"),
            fixedHooks: {},
            keyHooks: {
                props: toArray("char,charCode,key,keyCode"),
                filter: function (evnt, original) {
                    var charCode;
                    // Add which for key evnts
                    if (evnt.which == NULL) {
                        charCode = original.charCode;
                        evnt.which = charCode != NULL ? charCode : original.keyCode;
                    }
                    return evnt;
                }
            },
            forceHooks: {
                props: [],
                filter: function (evnt, original) {
                    evnt.value = ((original.force || original.webkitForce) / 3) || 0;
                    return evnt;
                }
            },
            motionHooks: {
                props: [],
                reaction: function (evnt) {
                    evnt.origin.owner.stashMotionEvent(evnt);
                }
            },
            mouseHooks: {
                props: toArray("button,buttons,clientX,clientY,offsetX,offsetY,pageX,pageY,screenX,screenY,toElement"),
                filter: function (evnt, original) {
                    var eventDoc, doc, body,
                        button = original.button;
                    // Calculate pageX/Y if missing and clientX/Y available
                    if (evnt.pageX == NULL && original.clientX != NULL) {
                        evntDoc = evnt.target.ownerDocument || doc;
                        doc = evntDoc.documentElement;
                        body = evntDoc[BODY];
                        evnt.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                        evnt.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                    }
                    evnt.movementX = original.movementX || 0;
                    evnt.movementY = original.movementY || 0;
                    evnt.layerX = original.layerX || 0;
                    evnt.layerY = original.layerY || 0;
                    evnt.x = original.x || 0;
                    evnt.y = original.y || 0;
                    // Add which for click: 1 === left; 2 === middle; 3 === right
                    // Note: button is not normalized, so don't use it
                    if (!evnt.which && button !== UNDEFINED) {
                        evnt.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                    }
                    return evnt;
                }
            },
            make: function (evnt, originalEvent, options) {
                var acc, acc_, doc, target, val, i, prop, copy, type = originalEvent.type,
                    // Create a writable copy of the event object and normalize some properties
                    fixHook = fixHooks.fixedHooks[type],
                    origin = options.origin;
                if (!fixHook) {
                    fixHooks.fixedHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : rforceEvent.test(type) ? this.forceHooks : motionMorph.test(type) ? this.motionHooks : {};
                }
                copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
                i = copy[LENGTH];
                duff(copy, function (prop) {
                    var val = originalEvent[prop];
                    if (val != NULL) {
                        evnt[prop] = val;
                    }
                });
                evnt.originalType = type;
                // Support: Cordova 2.5 (WebKit) (#13255)
                // All events should have a target; Cordova deviceready doesn't
                // ie also does not have a target... so use current target
                target = evnt.target || (evnt.view ? evnt.view.event.currentTarget : event && event.currentTarget) || evnt.delegateTarget.element();
                if (!target) {
                    target = evnt.target = doc;
                }
                // Support: Safari 6.0+, Chrome<28
                // Target should not be a text node (#504, #13143)
                if (target[NODE_TYPE] === 3) {
                    evnt.target = target[PARENT_NODE];
                }
                (fixHook.filter || noop)(evnt, originalEvent);
                type = distilledEventName[originalEvent.type] || originalEvent.type;
                cachedObjectEventConstructor.call(evnt, parse(originalEvent.data), options.origin, type, NULL, evnt.timeStamp);
                if (evnt.type === FULLSCREEN + CHANGE) {
                    doc = evnt.target;
                    if (isWindow(doc)) {
                        doc = doc[DOCUMENT];
                    } else {
                        while (doc && !isDocument(doc) && doc[PARENT_NODE]) {
                            doc = doc[PARENT_NODE];
                        }
                    }
                    evnt.fullscreenDocument = doc;
                    if (isDocument(doc)) {
                        evnt.remark(FULLSCREEN, (doc.fullScreen || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.fullscreenElement) ? BOOLEAN_TRUE : BOOLEAN_FALSE);
                    }
                }
                evnt[IS_TRUSTED] = _.has(originalEvent, IS_TRUSTED) ? originalEvent[IS_TRUSTED] : !DO_NOT_TRUST;
                (fixHook.reaction || noop)(evnt, originalEvent);
            }
        },
        cachedObjectEventConstructor = factories.ObjectEvent[CONSTRUCTOR],
        DomEvent = factories.DomEvent = factories.ObjectEvent.extend('DomEvent', {
            AT_TARGET: 1,
            constructor: function (evnt, opts) {
                var e = this;
                if (DomEvent.isInstance(evnt)) {
                    return evnt;
                }
                e.originalEvent = evnt;
                if (!has(evnt.target) || !has(evnt.currentTarget)) {
                    e.delegateTarget = opts.origin;
                } else {
                    e.delegateTarget = opts.origin.owner.returnsManager(opts.target);
                }
                fixHooks.make(e, evnt, opts);
                e.capturing = opts.capturing === UNDEFINED ? isCapturing(e) : opts.capturing;
                return e;
            },
            motion: function () {
                var acc, acc_, cached, evnt = this,
                    owner = evnt.origin.owner,
                    motion = owner.motion();
                return motion;
            },
            preventDefault: function () {
                var e = this.originalEvent;
                this[DEFAULT_PREVENTED] = BOOLEAN_TRUE;
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
            },
            stopPropagation: function () {
                var e = this.originalEvent;
                this[PROPAGATION_STOPPED] = BOOLEAN_TRUE;
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
            },
            stopImmediatePropagation: function () {
                var e = this.originalEvent;
                this[IMMEDIATE_PROP_STOPPED] = BOOLEAN_TRUE;
                if (e && e.stopImmediatePropagation) {
                    e.stopImmediatePropagation();
                }
                this.stopPropagation();
            }
        }),
        removeEvent = function (evnt, name, mainHandler, capturing) {
            var el = evnt.origin.element();
            if (el.removeEventListener) {
                el.removeEventListener(name, mainHandler[capturing], capturing);
            } else {
                el.detachEvent(name, mainHandler[capturing]);
            }
            delete mainHandler[capturing];
        },
        DomEventsDirective = factories.EventsDirective.extend('DomEventsDirective', {
            remove: function (list, evnt) {
                var events = this,
                    elementHandlers = events.elementHandlers,
                    name = list.name,
                    mainHandler = elementHandlers[name],
                    capturing = mainHandler.capturing;
                list.remove(evnt);
                if (capturing) {
                    --mainHandler[CAPTURE_COUNT];
                    if (!mainHandler[CAPTURE_COUNT]) {
                        removeEvent(evnt, name, mainHandler, capturing);
                    }
                } else {
                    if (evnt.selector) {
                        mainHandler[DELEGATE_COUNT]--;
                    }
                    if (list[LENGTH]() === mainHandler[CAPTURE_COUNT]) {
                        removeEvent(evnt, name, mainHandler, capturing);
                    }
                }
            },
            add: function (list, evnt) {
                var foundDuplicate, delegateCount, obj, eventHandler, hadMainHandler, domTarget, events = this,
                    el = evnt.element,
                    i = 0,
                    // needs an extra hash to care for the actual event hanlders that get attached to dom
                    elementHandlers = events.elementHandlers = events.elementHandlers || {},
                    name = list.name,
                    mainHandler = elementHandlers[name],
                    capture = evnt.capturing,
                    items = list.toArray(),
                    customEvents = evnt.origin.owner.events.custom;
                for (; i < items[LENGTH] && !foundDuplicate; i++) {
                    obj = items[i];
                    foundDuplicate = evnt.capturing === evnt.capturing && evnt.handler === obj.handler && obj.group === evnt.group && evnt.selector === obj.selector && evnt.passedName === obj.passedName;
                }
                if (foundDuplicate) {
                    return;
                }
                hadMainHandler = mainHandler;
                // brand new event stack
                if (!mainHandler) {
                    mainHandler = elementHandlers[name] = {
                        delegateCount: 0,
                        captureCount: 0,
                        events: events,
                        currentEvent: NULL,
                        capturing: capture
                    };
                }
                evnt.mainHandler = mainHandler;
                if (!mainHandler[capture]) {
                    // i don't have that handler attached to the dom yet
                    domTarget = evnt.domTarget;
                    eventHandler = mainHandler[capture] = function (e) {
                        return eventDispatcher(domTarget, e.type, e, capture);
                    };
                }
                if (evnt.capturing) {
                    list.insertAt(evnt, mainHandler[CAPTURE_COUNT]);
                    ++mainHandler[CAPTURE_COUNT];
                } else {
                    if (evnt.selector) {
                        delegateCount = mainHandler[DELEGATE_COUNT];
                        ++mainHandler[DELEGATE_COUNT];
                        if (delegateCount) {
                            list.insertAt(evnt, mainHandler[CAPTURE_COUNT] + delegateCount);
                        } else {
                            list.insertAt(evnt, mainHandler[CAPTURE_COUNT]);
                        }
                    } else {
                        list.toArray().push(evnt);
                    }
                }
                duff(evnt.nameStack, function (name) {
                    evnt.fn = (customEvents[name] || returns.first)(evnt.fn, name, evnt) || evnt.fn;
                });
                if (eventHandler) {
                    el = evnt.origin.element();
                    if (el.addEventListener) {
                        el.addEventListener(evnt.domName, eventHandler, capture);
                    } else {
                        if (capture) {
                            return;
                        }
                        el.attachEvent(evnt.domName, eventHandler);
                    }
                }
            },
            create: function (origin, original, type, opts) {
                return DomEvent(original, {
                    target: origin.target,
                    origin: origin,
                    capturing: opts.capturing
                });
            },
            queue: function (stack, handler, evnt) {
                if (evnt[PROPAGATION_STOPPED] && evnt.currentTarget !== handler.temporaryTarget) {
                    evnt[PROPAGATION_HALTED] = BOOLEAN_TRUE;
                    return BOOLEAN_FALSE;
                }
                evnt.currentTarget = handler.temporaryTarget;
                handler.mainHandler.currentEvent = evnt;
                stack.push(handler);
                return BOOLEAN_TRUE;
            },
            unQueue: function (stack, handler, evnt) {
                evnt.currentTarget = handler.currentTarget = NULL;
                handler.mainHandler.currentEvent = NULL;
                stack.pop();
                return this;
            },
            cancelled: function (list_, evnt, last) {
                var mainHandler, delegateCount, first, events = this;
                if (!list_[LENGTH]()) {
                    return events;
                }
                first = list_.first();
                mainHandler = first.mainHandler;
                delegateCount = mainHandler[DELEGATE_COUNT];
                if (!delegateCount || delegateCount < last) {
                    return events;
                }
                while (last <= delegateCount) {
                    first = list_[last];
                    first.temporaryTarget = NULL;
                    ++last;
                }
                return events;
            },
            nextBubble: function (start, collected) {
                var parent, element = start.element();
                if (!start.is(ELEMENT) || element[PARENT_NODE]) {
                    return BOOLEAN_FALSE;
                }
                return start.parent(function (element) {
                    if (start.element() !== element) {
                        if (element[__ELID__]) {
                            parent = start.owner.returnsManager(element);
                            if (parent.is(CUSTOM_LISTENER)) {
                                return [parent, BOOLEAN_TRUE];
                            }
                        }
                    }
                    return [element[PARENT_NODE], BOOLEAN_FALSE];
                });
            },
            subset: function (list_, evnt) {
                var ordersEventsByHierarchy, parent, found, target, sumCount, element, counter, el, afterwards, selector, branch, first, mainHandler, delegateCount, captureCount, i = 0,
                    j = 0,
                    list = [],
                    manager = evnt.origin;
                if (!list_[LENGTH]) {
                    return [];
                }
                first = list_[0];
                mainHandler = first.mainHandler;
                captureCount = mainHandler[CAPTURE_COUNT];
                delegateCount = mainHandler[DELEGATE_COUNT];
                if (evnt.capturing) {
                    return list_.slice(0, captureCount);
                }
                // sumCount = delegateCount - captureCount;
                manager = evnt.origin;
                el = manager.element();
                // only take the target so we don't try to make managers for everyone
                target = evnt.target;
                // there are no delegated events, so just return everything after capture
                if (!delegateCount || evnt.target === el) {
                    return list_.slice(captureCount);
                }
                sumCount = captureCount + delegateCount;
                i = captureCount;
                afterwards = list_.slice(sumCount);
                ordersEventsByHierarchy = manager.orderEventsByHeirarchy();
                while (i < sumCount) {
                    first = list_[i];
                    ++i;
                    selector = first.selector;
                    counter = -1;
                    parent = target;
                    while (!found && parent && isElement(parent) && parent !== el) {
                        ++counter;
                        if (matchesSelector(parent, selector, manager.owner)) {
                            found = parent;
                            // hold on to the temporary target
                            first.temporaryTarget = found;
                            // how far up did you have to go before you got to the top
                            first.parentNodeNumber = counter;
                            if (ordersEventsByHierarchy) {
                                if (!(j = list[LENGTH])) {
                                    list.push(first);
                                } else {
                                    while (first && list[--j]) {
                                        if (list[j].parentNodeNumber <= first.parentNodeNumber) {
                                            list.splice(j + 1, 0, first);
                                            first = NULL;
                                        }
                                    }
                                }
                            } else {
                                list.push(first);
                            }
                        }
                        parent = parent[PARENT_NODE];
                    }
                }
                return list.concat(afterwards);
            }
        }),
        windowIsVisible = function (windo_, perspective) {
            var notVisible = BOOLEAN_FALSE,
                windo = windo_;
            while (!windo.is('topWindow') && !notVisible) {
                windo = perspective.returnsManager(windo.element().parent);
                if (windo.iframe && windo.is(ACCESSABLE)) {
                    notVisible = !windo.iframe.visible();
                }
            }
            return !notVisible;
        },
        getStringManager = function (events, where) {
            var attrs = events.directive(ATTRIBUTES),
                found = attrs[where] = attrs[where] || StringManager();
            return found;
        },
        dimensionFinder = function (element, doc, win) {
            return function (num) {
                var ret, body, manager = this[ITEM](num);
                if (manager.is(ELEMENT)) {
                    ret = clientRect(manager.element())[element];
                } else {
                    if (manager.is(DOCUMENT) && (body = manager.element()[BODY])) {
                        ret = body[doc];
                    } else {
                        if (manager.is(WINDOW)) {
                            ret = manager.element()[win];
                        }
                    }
                }
                return ret || 0;
            };
        },
        historyResult = app.extendDirective('Registry', 'History'),
        registerAs = function (manager, data, owner) {
            var historyDirective, name, Wrapper, registeredAs = manager[REGISTERED_AS];
            if (!manager.is(CUSTOM)) {
                return manager;
            }
            name = manager.owner.registeredElementName(registeredAs);
            Wrapper = manager.owner.registeredConstructors[registeredAs];
            if (!Wrapper) {
                exception('custom elements must be registered before they can be used');
            }
            manager = new Wrapper[CONSTRUCTOR](manager, data, owner);
            return manager;
        },
        removeHandler = function (fragment, handler) {
            var el, timeoutId, parent, manager = this,
                cachedRemoving = manager.is(REMOVING) || BOOLEAN_FALSE;
            if (cachedRemoving || !(el = manager.element()) || !(parent = el[PARENT_NODE])) {
                // can't remove because already removed
                return manager;
            }
            manager.mark(REMOVING);
            if (manager.is(IFRAME) && handler && isFunction(handler)) {
                // use the parent window's setTimeout
                // do we need a way to cancel it if it gets reattached?
                manager.owner.window().element().setTimeout(bind(handler, manager, manager));
            }
            removeChild(el, fragment);
            dispatchDetached([el], manager.owner);
            manager.remark(REMOVING, cachedRemoving);
            return manager;
        },
        dommanagerunwrapper = function () {
            return [this];
        },
        DomManager = factories[DOM_MANAGER_STRING] = factories.Events.extend(DOM_MANAGER_STRING, extend({}, classApi, {
            'directive:creation:EventManager': DomEventsDirective,
            isValidDomManager: BOOLEAN_TRUE,
            $: manager_query,
            // this is here to be an alias
            querySelectorAll: manager_query,
            orderEventsByHeirarchy: function () {
                return this.owner.orderEventsByHeirarchy;
            },
            queryString: function () {
                var string = '';
                var json = this.toJSON(BOOLEAN_TRUE);
                var attributes = json.attributes;
                string += json.tagName;
                if (attributes.id) {
                    string += ('#' + attributes.id);
                }
                if (attributes[CLASS]) {
                    string += (PERIOD + attributes[CLASS].split(SPACE).join(PERIOD));
                }
                return string;
            },
            registeredElementName: function () {
                return this.owner.registeredElementName(this[REGISTERED_AS]);
            },
            attributes: function (fn_) {
                var memo, bound, manager = this;
                var element = manager.element();
                var elementAttributes = element.attributes;
                if (!fn_) {
                    memo = {};
                    duff(elementAttributes, function (attribute) {
                        memo[attribute.localName] = attribute.nodeValue;
                    });
                    return memo;
                }
                bound = bindTo(fn_, manager);
                duff(elementAttributes, function (attribute) {
                    bound(attribute.nodeValue, attribute.localName);
                });
                return manager;
            },
            hasValue: hasValue(domContextFind),
            addValue: addValue(domIterates),
            removeValue: removeValue(domIterates),
            toggleValue: toggleValue(domIterates),
            changeValue: changeValue(domIterates),
            on: addEventListener,
            addEventListener: addEventListener,
            once: addEventListenerOnce,
            off: removeEventListener,
            removeEventListener: removeEventListener,
            append: appendChildDomManager,
            appendChild: appendChildDomManager,
            prepend: prependChild,
            insertBefore: sharedInsertBefore,
            insertAfter: insertAfter,
            getAttribute: getValueCurried,
            setAttribute: setValueCurried,
            removeAttribute: attributeParody(REMOVE),
            attr: attrApi(domIterates),
            data: dataApi(domIterates),
            prop: propApi(domIterates),
            html: innardManipulator(INNER_HTML),
            // outerHTML: innardManipulator(OUTER_HTML),
            text: innardManipulator(INNER_TEXT),
            // style: styleManipulator,
            css: styleManipulator,
            next: managerHorizontalTraverser('next', 'nextElementSibling', 1),
            prev: managerHorizontalTraverser('prev', 'previousElementSibling', -1),
            skip: managerHorizontalTraverser('skip', NULL, 0),
            height: dimensionFinder(HEIGHT, 'scrollHeight', INNER_HEIGHT),
            width: dimensionFinder(WIDTH, 'scrollWidth', INNER_WIDTH),
            siblings: function (filtr) {
                var original = this,
                    filter = createDomFilter(filtr, original.owner);
                return original.parent().children(function (manager, index, list) {
                    return manager !== original && filter(manager, index, list);
                });
            },
            element: function () {
                return this[TARGET];
            },
            elements: function () {
                return [this.element()];
            },
            constructor: function (el, hash, owner_) {
                var elId, registeredOptions, isDocument, owner = owner_,
                    manager = this;
                if (!el) {
                    exception('element must be an element');
                }
                if (DomManager.isInstance(el)) {
                    // extend what we already know
                    hash[DOM_MANAGER_STRING] = manager;
                    extend(manager, el);
                    // run it through it's scoped constructor
                    registeredOptions = owner.registeredElementOptions[manager[REGISTERED_AS]];
                    registeredOptions.creation.call(manager, manager);
                    manager.on(registeredOptions.events);
                    manager.on(DESTROY, registeredOptions.destruction);
                    return manager;
                }
                test(manager, owner, el);
                if (manager.is(ELEMENT) || manager.is(FRAGMENT)) {
                    hash[DOM_MANAGER_STRING] = manager;
                    owner = ensure(el.ownerDocument, BOOLEAN_TRUE);
                    if (manager.is(ELEMENT)) {
                        manager[__ELID__] = el[__ELID__];
                    }
                } else {
                    if ((isDocument = manager.is(DOCUMENT))) {
                        owner = manager;
                        manager[__ELID__] = elId = el[__ELID__];
                    } else {
                        hash[DOM_MANAGER_STRING] = manager;
                        manager[__ELID__] = app.counter('win');
                    }
                }
                manager.owner = owner || BOOLEAN_FALSE;
                manager[TARGET] = el;
                if (manager.is(IFRAME)) {
                    manager.on(ATTRIBUTE_CHANGE + ':src detach attach', iframeChangeHandler);
                }
                if (manager.is(WINDOW)) {
                    markGlobal(manager, el);
                }
                if (manager.is(ELEMENT)) {
                    if (manager[REGISTERED_AS] && manager[REGISTERED_AS] !== BOOLEAN_TRUE) {
                        manager = wraptry(function () {
                            return registerAs(manager, hash, owner);
                        }) || manager;
                    }
                    if (has(manager, REGISTERED_AS)) {
                        delete manager[REGISTERED_AS];
                    }
                }
                return manager;
            },
            clone: function () {
                var manager = this;
                if (!manager.is(ELEMENT)) {
                    return {};
                }
                return makeBranch(manager.element()[OUTER_HTML], manager.owner);
            },
            length: function () {
                return 1;
            },
            wrap: function (list) {
                return this.owner.$(list || this);
            },
            unwrap: dommanagerunwrapper,
            toArray: dommanagerunwrapper,
            parent: (function () {
                var finder = function (manager, fn, original) {
                        var rets, found, parentManager = manager,
                            owner = manager.owner,
                            parentElement = parentManager.element(),
                            next = original;
                        while (parentElement && !found) {
                            rets = fn(parentElement, original, next, owner);
                            parentElement = rets[0];
                            found = rets[1];
                            next = rets[2];
                        }
                        if (found && parentElement) {
                            return owner.returnsManager(parentElement);
                        }
                    },
                    number = function (element, original, next) {
                        next -= 1;
                        if (next < 0 || !isFinite(next) || isNaN(next)) {
                            next = 0;
                        }
                        return [element[PARENT_NODE], !next, next];
                    },
                    string = function (element, original_, next, owner) {
                        var parent = element[PARENT_NODE];
                        var original = convertSelector(original_, owner);
                        return [parent, matchesSelector(parent, original, owner)];
                    },
                    speshal = {
                        document: function (element, original, next) {
                            var parent = element[PARENT_NODE];
                            if (isDocument(parent)) {
                                return [parent, BOOLEAN_TRUE];
                            } else {
                                if (isElement(parent)) {
                                    return [parent, BOOLEAN_FALSE];
                                } else {
                                    if (isFragment(parent)) {
                                        return [NULL, BOOLEAN_FALSE];
                                    }
                                }
                            }
                        },
                        window: function (element, original, next, origin) {
                            var parent, defaultView = element[DEFAULT_VIEW];
                            if (defaultView) {
                                return [defaultView, BOOLEAN_TRUE];
                            }
                            if ((parent = element[PARENT_NODE])) {
                                return [parent, BOOLEAN_FALSE];
                            } else {
                                return [BOOLEAN_FALSE, BOOLEAN_FALSE];
                            }
                        },
                        iframe: function (element, original, next) {
                            var found, parent = element,
                                elementIsWindow = isWindow(element);
                            if (elementIsWindow) {
                                if (parent === parent.top) {
                                    return [NULL, BOOLEAN_FALSE];
                                } else {
                                    found = wraptry(function () {
                                        return parent.frameElement;
                                    });
                                    return [found, !!found];
                                }
                            } else {
                                return [element[DEFAULT_VIEW]] || element[PARENT_NODE];
                            }
                        }
                    };
                return function (original) {
                    var iterator, manager = this,
                        data = [],
                        doDefault = BOOLEAN_FALSE;
                    if (isNumber(original)) {
                        iterator = number;
                    } else {
                        if (isString(original)) {
                            iterator = speshal[original] || string;
                        } else {
                            doDefault = original ? BOOLEAN_TRUE : doDefault;
                        }
                    }
                    if (doDefault) {
                        return finder(manager, original);
                    } else {
                        if (!iterator) {
                            iterator = number;
                            original = 1;
                        }
                        return finder(manager, iterator, original);
                    }
                };
            }()),
            contains: function (element_) {
                var managerElement, target, element = element_,
                    manager = this;
                if (isWindow(element)) {
                    return BOOLEAN_FALSE;
                }
                if (isString(element)) {
                    return !!query(element, manager.element(), manager)[LENGTH];
                }
                if (element.isValidDOMA) {
                    return !!element.find(manager.contains, manager);
                }
                target = manager.owner.returnsManager(element);
                if (target.is(DOCUMENT)) {
                    return target.window() === manager;
                }
                managerElement = manager.element();
                return !!target.parent(function (node) {
                    var parentNode = node[PARENT_NODE];
                    return [parentNode, parentNode === managerElement];
                });
            },
            insertAt: function (els, index) {
                var manager = this,
                    owner = manager.owner,
                    fragmentManager = isAppendable(els) ? owner.returnsManager(els) : owner.$(els).fragment(),
                    fragment = fragmentManager.element(),
                    children = index == NULL ? NULL : manager.children(),
                    child = children && children.item(index) || NULL,
                    element = child && child.element() || NULL,
                    managerElement = manager && manager.element(),
                    returns = fragmentManager.children(),
                    fragmentChildren = collectCustom(fragmentManager, BOOLEAN_TRUE),
                    detachNotify = dispatchDetached(fragmentChildren, owner),
                    returnValue = managerElement && insertBefore(managerElement, fragment, element),
                    notify = isAttached(managerElement, owner) && dispatchAttached(fragmentChildren, owner);
                return returns;
            },
            window: function () {
                var manager = this;
                if (manager.is(WINDOW)) {
                    // yay we're here!
                    return manager;
                }
                if (manager.is(DOCUMENT)) {
                    // it's a document, so return the manager relative to the inside
                    return manager.returnsManager(manager.element().defaultView);
                }
                if (manager.is(IFRAME)) {
                    // it's an iframe, so return the manager relative to the outside
                    return manager.is(ATTACHED) && manager.owner.returnsManager(manager.element().contentWindow);
                }
                // it's an element so go up
                return manager.owner.window();
            },
            setAddress: function (address) {
                var manager = this;
                address = manager.address = address || manager.address || uuid();
                return address;
            },
            emit: function (message_, referrer_, handler) {
                var message, post, windo = this.window(),
                    element = windo.element();
                if (windo.is(ACCESSABLE)) {
                    message = parse(message_);
                    // if (handler) {
                    (handler || receivePostMessage)({
                        // this can be expanded a bit when you get some time
                        srcElement: element,
                        timeStamp: _.now(),
                        data: function () {
                            return message;
                        }
                    });
                    return this;
                    // }
                }
                wraptry(function () {
                    // do not parse message so it can be sent as is
                    if (!referrer_) {
                        exception('missing referrer: ' + windo.address);
                    } else {
                        element.postMessage(message_, referrer_);
                    }
                });
                return this;
            },
            sameOrigin: function () {
                var parsedReference, manager = this,
                    element = manager.element(),
                    windo = manager.owner.window(),
                    windoElement = windo.element();
                if (windo === manager) {
                    return BOOLEAN_TRUE;
                }
                if (manager.is(ACCESSABLE)) {
                    parsedReference = reference(wraptry(function () {
                        return manager.parent('iframe').element().src || element[LOCATION].href;
                    }) || element[LOCATION].href);
                    if (!parsedReference && manager.iframe) {
                        parsedReference = reference(manager.iframe.src());
                    }
                    return !parsedReference || parsedReference === reference(windoElement[LOCATION].href);
                }
                return BOOLEAN_FALSE;
            },
            children: function (eq, memo) {
                var filter, resultant, manager = this,
                    children = collectChildren(manager.element());
                if (eq === UNDEFINED) {
                    return memo ? ((children = map(children, manager.owner.returnsManager, manager.owner)) && result(memo, 'is', FRAGMENT) ? memo.append(children) : (memo.push.apply(memo, children) ? memo : memo)) : manager.wrap(children);
                } else {
                    filter = createDomFilter(eq, manager.owner);
                    resultant = foldl(children, function (memo, child, idx, children) {
                        if (filter(child, idx, children)) {
                            memo.push(manager.owner.returnsManager(child));
                        }
                        return memo;
                    }, memo || []);
                }
                return memo ? resultant : manager.wrap(resultant);
            },
            visible: function () {
                var client, element, styles, owner, windo, windoElement, innerHeight, innerWidth, manager = this;
                if (!manager.is(ATTACHED)) {
                    return BOOLEAN_FALSE;
                }
                styles = manager.getStyle();
                if (+styles.opacity === 0 || styles.display === NONE || styles[HEIGHT] === ZERO_PIXELS || styles[WIDTH] === ZERO_PIXELS || styles.visibility === HIDDEN) {
                    return BOOLEAN_FALSE;
                }
                element = manager.element();
                client = element.getBoundingClientRect();
                if (!client[HEIGHT] || !client[WIDTH]) {
                    return BOOLEAN_FALSE;
                }
                windoElement = (manager.element().ownerDocument || {}).defaultView;
                if (!windoElement) {
                    return BOOLEAN_TRUE;
                }
                innerHeight = windoElement[INNER_HEIGHT];
                innerWidth = windoElement[INNER_WIDTH];
                if (innerHeight < client.top || innerWidth < client.left || client.right < 0 || client.bottom < 0) {
                    return BOOLEAN_FALSE;
                }
                windo = manager.owner.returnsManager(windoElement);
                return windo.is('topWindow') ? BOOLEAN_TRUE : windowIsVisible(windo, manager.owner);
            },
            hide: function () {
                return this.applyStyle(DISPLAY, NONE);
            },
            show: function () {
                return this.applyStyle(DISPLAY, 'block');
            },
            applyStyle: function (key, value, important) {
                applyStyle(key, value, this, important);
                return this;
            },
            getStyle: function (eq) {
                var returnValue = {},
                    manager = this,
                    first = manager.element();
                if (first && manager.is(ELEMENT)) {
                    returnValue = getComputed(first, manager.owner.element());
                }
                return returnValue;
            },
            remove: removeHandler,
            removeChild: removeHandler,
            frame: function (head, body, passedContent) {
                var manager = this,
                    content = head || '';
                if (!passedContent && (body || content.slice(0, 10).toLowerCase() !== '<!doctype ')) {
                    content = manager.owner.iframeContent(content, body);
                }
                if (manager.is(IFRAME)) {
                    if (manager.is(ATTACHED)) {
                        manager.html(content);
                    } else {
                        manager.cachedContent = content;
                    }
                    return manager;
                } else {
                    return manager;
                }
            },
            // rework how to destroy elements
            destroy: function (handler) {
                var customName, manager = this,
                    registeredAs = manager[REGISTERED_AS],
                    element = manager.element();
                if (manager.is(DESTROYED)) {
                    return manager;
                }
                manager.mark(DESTROYED);
                if (manager.is(IFRAME)) {
                    manager.owner.data.remove(element.contentWindow);
                }
                manager.remove(NULL, handler);
                if (registeredAs) {
                    customName = manager.owner.registeredElementName(registeredAs);
                    manager.directiveDestruction(customName);
                }
                manager[DISPATCH_EVENT](DESTROY);
                // destroy events
                manager.directiveDestruction(EVENTS);
                // remove from global hash
                manager.owner.data.remove(element);
                manager[STOP_LISTENING]();
                return manager;
            },
            item: function () {
                return this;
            },
            each: function (fn, ctx) {
                var manager = this,
                    wrapped = [manager],
                    result = ctx ? fn.call(ctx, manager, 0, wrapped) : fn(manager, 0, wrapped);
                return wrapped;
            },
            find: function (fn) {
                var manager = this;
                return fn(manager, 0, [manager]) ? manager : UNDEFINED;
            },
            client: function () {
                return clientRect(this.element());
            },
            box: function (context) {
                return box(this.element(), context);
            },
            flow: function (context) {
                return flow(this.element(), context);
            },
            dispatchEvent: function (name, e, capturing_) {
                var ret, cachedTrust = DO_NOT_TRUST;
                DO_NOT_TRUST = BOOLEAN_TRUE;
                ret = eventDispatcher(this, name, e, capturing_, cachedTrust);
                DO_NOT_TRUST = cachedTrust;
                return ret;
            },
            toJSON: function (preventDeep) {
                var previous, temporaryFragment, childrenLength, children, obj, manager = this,
                    owner = manager.owner,
                    node = manager.element();
                if (manager.is(WINDOW) || manager.is(DOCUMENT)) {
                    exception('cannot serialize documents and windows');
                }
                return nodeToJSON(node, preventDeep === UNDEFINED ? returnsTrue : (isFunction(preventDeep) ? preventDeep : returns(preventDeep)), BOOLEAN_TRUE);
            }
        }, wrap(directAttributes, function (attr, api) {
            if (!attr) {
                attr = api;
            }
            return function (string) {
                var item, manager = this;
                if (string !== UNDEFINED) {
                    return manager.attr(attr, string);
                }
                return manager.element()[attr];
            };
        }), wrap(videoDirectEvents, triggerEventWrapperManager), wrap(directEvents, function (attr) {
            return triggerEventWrapperManager(attr);
        }), wrap(toArray('add,addBack,elements,push,fragment'), function (key) {
            return function (one, two, three) {
                return this.wrap()[key](one, two, three);
            };
        }))),
        _removeEventListener = function (manager, name, group, selector, handler, capture_) {
            var capture = !!capture_,
                directive = manager.directive(EVENTS),
                removeFromList = function (list, name) {
                    return list.obliteration(function (obj) {
                        if ((!name || name === obj.passedName) && (!handler || obj.handler === handler) && (!group || obj.group === group) && (!selector || obj.selector === selector)) {
                            directive.detach(obj);
                        }
                    });
                };
            return name ? duff(toArray(name, SPACE), eventExpander(manager.owner.events.expanders, function (name, passedName) {
                removeFromList(directive[HANDLERS][name], passedName);
            })) : each(directive[HANDLERS], passesFirstArgument(removeFromList));
        },
        /**
         * @class DOMA
         * @augments Model
         * @augments Collection
         */
        eq = _.eq,
        objectMatches = _.matches,
        createDomFilter = function (filtr_, owner) {
            var filtr = filtr_;
            return isFunction(filtr) ? filtr : (isString(filtr) ? (filterExpressions[filtr] || (filtr = convertSelector(filtr, owner)) && function (item) {
                return matchesSelector(item, filtr, owner);
            }) : (isNumber(filtr) ? function (el, idx) {
                return idx === filtr;
            } : (isObject(filtr) ? objectMatches(filtr) : function () {
                return BOOLEAN_TRUE;
            })));
        },
        unwrapsOnLoop = function (fn) {
            return function (manager, index, list) {
                return fn(manager.element(), index, list);
            };
        },
        domFilter = function (items, filtr, owner) {
            var filter = createDomFilter(filtr, owner);
            return dataReconstructor(items, unwrapsOnLoop(filter));
        },
        returnsManager = function (element, owner) {
            return element && !isWindow(element) && element.isValidDomManager ? element : ensure(element, owner);
        },
        exportResult = _.publicize({
            covers: covers,
            center: center,
            closer: closer,
            fetch: fetch,
            distance: distance,
            escape: escape,
            unescape: unescape,
            box: box,
            isElement: isElement,
            isWindow: isWindow,
            isDocument: isDocument,
            isFragment: isFragment,
            unitToNumber: unitToNumber,
            numberToUnit: numberToUnit
        }),
        setupDomContentLoaded = function (handler, documentManager) {
            var bound = bind(handler, documentManager),
                windo = documentManager.window(),
                domHandler = function (e) {
                    documentManager.off('DOMContentLoaded', domHandler);
                    windo.off('load', domHandler);
                    documentManager.$(CUSTOM_ATTRIBUTE).each(documentManager.returnsManager);
                    bound(documentManager.$, e);
                };
            if (documentManager.is('ready')) {
                bound(documentManager.$, documentManager.DOMContentLoadedEvent);
            } else {
                documentManager.on('DOMContentLoaded', domHandler);
                windo.on('load', domHandler);
            }
            documentManager.mark('setup');
            return documentManager;
        },
        applyToEach = function (method) {
            return function (one, two, three, four, five, six) {
                return this.each(function (manager) {
                    manager[method](one, two, three, four, five, six);
                });
            };
        },
        allEachMethods = toArray(DESTROY + ',show,hide,style,remove,on,off,once,addEventListener,removeEventListener,dispatchEvent').concat(allDirectMethods),
        firstMethods = toArray('tag,element,client,box,flow'),
        applyToFirst = function (method) {
            var shouldBeContext = method !== 'tag';
            return function (one, two) {
                var element = this.item(one);
                return element && element[method](shouldBeContext ? this.context : two);
            };
        },
        readMethods = toArray('isWindow,isElement,isDocument,isFragment'),
        applyToTarget = function (property) {
            return function (one) {
                var element = this.item(one);
                return element && element[property];
            };
        },
        DOMA = factories.DOMA = factories.Collection.extend('DOMA', extend({}, classApi, {
            /**
             * @func
             * @name DOMA#constructor
             * @param {String | Node | Function} str - string to query the dom with, or a function to run on document load, or an element to wrap in a DOMA instance
             * @returns {DOMA} instance
             */
            isValidDOMA: BOOLEAN_TRUE,
            // destroy: function (handler_) {
            //     var handler = isFunction(handler_) ? handler_ : NULL;
            //     return this.each(function (manager) {
            //         manager.destroy(handler);
            //     });
            // },
            constructor: function (str, ctx, isValid, validContext, documentContext) {
                var isArrayResult, els = str,
                    dom = this,
                    context = dom.context = validContext ? ctx.item(0) : documentContext,
                    owner = dom.owner = documentContext,
                    unwrapped = context.element();
                if (str && !isWindow(str) && str.isValidDOMA) {
                    return str;
                }
                if (isFunction(str)) {
                    if (isDocument(unwrapped)) {
                        return setupDomContentLoaded(str, owner).wrap();
                    }
                } else {
                    if (!isValid) {
                        if (isString(str)) {
                            if (str[0] === '<') {
                                els = makeTree(str, owner);
                            } else {
                                els = map(query(str, unwrapped, context), owner.returnsManager, owner);
                            }
                        } else {
                            els = str;
                            if (DomManager.isInstance(els)) {
                                els = [els];
                            } else {
                                if (Collection.isInstance(els)) {
                                    els = els.toArray();
                                }
                                if (canBeProcessed(els)) {
                                    els = [owner.returnsManager(els)];
                                } else {
                                    els = els && map(els, owner.returnsManager, owner);
                                }
                            }
                        }
                    }
                    dom.reset(els);
                }
                return dom;
            },
            setValue: setValue(domIterates),
            hasValue: hasValue(domContextFind),
            addValue: addValue(domIterates),
            removeValue: removeValue(domIterates),
            toggleValue: toggleValue(domIterates),
            changeValue: changeValue(domIterates),
            add: attachPrevious(function (context, query) {
                var found = context.owner.$(query);
                return concatUnique(context.toArray(), found.toArray());
            }),
            addBack: attachPrevious(function (context, selector) {
                var previous = context._previous;
                if (!previous) {
                    return context.toArray().concat([]);
                }
                if (selector) {
                    previous = previous.filter(selector);
                }
                return context.toArray().concat(previous.toArray());
            }),
            wrap: function () {
                return this;
            },
            push: function () {
                var owner = this.context.owner;
                this.items.push.apply(this.items, foldl(arguments, function (memo, el) {
                    if (!el) {
                        return memo;
                    }
                    if (isWindow(el)) {
                        memo.push(el);
                    } else {
                        memo = memo.concat(!isWindow(el) && isFunction(el.unwrap) ? el.toArray() : owner.returnsManager(el));
                    }
                    return memo;
                }, [], owner));
                return this;
            },
            elements: function () {
                // to array of elements
                return this.results(ELEMENT);
            },
            /**
             * @func
             * @name DOMA#isWin
             * @description asks if the first or specified index of the object is a window type object
             * @returns {Boolean}
             */
            /**
             * @func
             * @name DOMA#isDoc
             * @description asks if the first or specified index of the object is a document type object
             * @returns {Boolean}
             */
            fragment: function (els) {
                return this.context.returnsManager(fragment(els || this.toArray(), this.context));
            },
            /**
             * @func
             * @name DOMA#filter
             * @param {String|Function|Object} filtr - filter variable that will filter by matching the object that is passed in, or by selector if it is a string, or simply with a custom function
             * @returns {DOMA} new DOMA instance object
             */
            filter: attachPrevious(function (context, filter) {
                return domFilter(context.toArray(), filter, context.owner);
            }),
            empty: attachPrevious(function (context, filtr) {
                var filter = createDomFilter(filtr, context.owner);
                return dataReconstructor(context.toArray(), unwrapsOnLoop(function (memo, manager, idx, list) {
                    return !filter(manager, idx, list) && manager.remove();
                }));
            }),
            /**
             * @func
             * @name DOMA#find
             * @param {String} str - string to use query to find against
             * @returns {DOMA} matching elements
             */
            $: attachPrevious(function (context, str) {
                var matchers = [],
                    push = function (el) {
                        matchers.push(context.owner.returnsManager(el));
                    };
                // look into foldl so we do not get duplicate elements
                return duff(context.toArray(), function (manager) {
                    duff(query(str, manager.element(), manager), push);
                }) && matchers;
            }),
            /**
             * @func
             * @name DOMA#children
             * @param {Number} [eq] - index of the children to gather. If none is provided, then all children will be added
             * @returns {DOMA} all / matching children
             */
            children: attachPrevious(function (context, eq) {
                // this should be rewritten as context.foldl
                return foldl(context.toArray(), function (memo, manager) {
                    return manager.children(eq, memo);
                }, []);
            }),
            /**
             * @func
             * @name DOMA#once
             * @param {String} space delimited list of event names to attach handlers to
             * @param {Function} fn - handler to put on the event loop
             * @returns {DOMA} instance
             */
            /**
             * @func
             * @name DOMA#css
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMA} instance
             */
            css: styleManipulator,
            // style: styleManipulator,
            /**
             * @func
             * @name DOMA#allDom
             * @returns {Boolean} value indicating whether or not there were any non dom elements found in the collection
             */
            allElements: function () {
                return !!(this[LENGTH]() && !find(this.toArray(), function (manager) {
                    return !manager.is(ELEMENT);
                }));
            },
            /**
             * @func
             * @name DOMA#height
             * @returns {Number} height of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            height: dimensionFinder(HEIGHT, 'scrollHeight', INNER_HEIGHT),
            /**
             * @func
             * @name DOMA#width
             * @returns {Number} width of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            width: dimensionFinder(WIDTH, 'scrollWidth', INNER_WIDTH),
            /**
             * @func
             * @name DOMA#data
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {Object|*} can return the value that is asked for by the initial function call
             */
            /**
             * @func
             * @name DOMA#attr
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMA | *} if multiple attributes were requested then a plain hash is returned, otherwise the DOMA instance is returned
             */
            attr: attrApi(domIterates),
            data: dataApi(domIterates),
            prop: propApi(domIterates),
            /**
             * @func
             * @name DOMA#eq
             * @param {Number|Array} [num=0] - index or list of indexes to create a new DOMA element with.
             * @returns {DOMA} instance
             */
            eq: attachPrevious(function (context, num) {
                return eq(context.toArray(), num);
            }),
            /**
             * @func
             * @name DOMA#box
             * @param {Number} [num=0] - index to get the boxmodel of
             */
            /**
             * @func
             * @name DOMA#end
             * @returns {DOMA} object that started the traversal chain
             */
            end: function () {
                var that = this;
                while (that._previous) {
                    that = that._previous;
                }
                return that;
            },
            getAttribute: getValueCurried,
            setAttribute: setValueCurried,
            /**
             * @func
             * @name DOMA#append
             */
            append: function (els, clone) {
                return this.insertAt(els, NULL, clone);
            },
            prepend: function (els, clone) {
                return this.insertAt(els, 0, clone);
            },
            insertBefore: sharedInsertBefore,
            appendTo: function (target) {
                $(target).append(this);
                return this;
            },
            /**
             * @func
             * @name DOMA#next
             * @returns {DOMA} instance
             */
            next: horizontalTraverser('next', 1),
            /**
             * @func
             * @name DOMA#previous
             * @returns {DOMA} instance
             */
            prev: horizontalTraverser('prev', -1),
            /**
             * @func
             * @name DOMA#skip
             * @returns {DOMA} instance
             */
            skip: horizontalTraverser('skip', 0),
            siblings: attachPrevious(function (context, filtr) {
                return mappedConcat(context, function (manager) {
                    return manager.siblings(filtr).toArray();
                });
            }),
            /**
             * @func
             * @name DOMA#insertAt
             * @returns {DOMA} instance
             */
            insertAt: function (els_, index, clone) {
                var manager = this,
                    owner = manager.owner,
                    els = isAppendable(els_) ? this.context.returnsManager(els_) : owner.$(els_).fragment();
                return this.each(function (manager) {
                    var elements = els;
                    if (clone) {
                        elements = elements.clone();
                    }
                    manager.insertAt(elements, index);
                });
            },
            replaceWith: attachPrevious(function (context, els_, shouldClone_) {
                var isStringResult, els, shouldClone = !!shouldClone_,
                    owner = context.owner;
                if (!(isStringResult = isString(element))) {
                    els = isAppendable(els_) ? owner.returnsManager(els_) : owner.$(els_).fragment();
                }
                return mappedConcat(context, function (manager, index) {
                    var elements = els_;
                    if (!manager.is(ELEMENT)) {
                        return [];
                    }
                    if (isStringResult) {
                        elements = context.owner.$(els_);
                    } else {
                        if (clone) {
                            elements = els.clone();
                        } else {
                            if (index) {
                                return [];
                            }
                        }
                    }
                    parent = manager.parent();
                    parent.insertAt(elements, parent.children().indexOf(manager));
                    manager.remove();
                    return elements.toArray();
                });
            }),
            contains: function (els) {
                return !!this.find(function (manager) {
                    return manager.contains(els);
                });
            },
            clone: attachPrevious(function (context) {
                return context.foldl(function (memo, manager) {
                    if (manager.is(ELEMENT)) {
                        memo.push(manager.clone());
                    }
                    return memo;
                });
            }),
            /**
             * @func
             * @name DOMA#parent
             * @param {Number} [count=1] - number of elements to go up in the parent chain
             * @returns {DOMA} instance of collected, unique parents
             */
            parent: attachPrevious(function (context, original) {
                // ensure unique
                var hash = {};
                return context.foldl(function (memo, manager) {
                    var parent;
                    if ((parent = manager.parent(original)) && !hash[parent.element()[__ELID__]]) {
                        hash[parent.element()[__ELID__]] = parent;
                        memo.push(parent);
                    }
                    return memo;
                }, []);
            }),
            /**
             * @func
             * @name DOMA#has
             * @param {Node|Array} els - list of elements to check the current instance against
             * @returns {Boolean} whether or not the current doma element has all of the elements that were passed in
             */
            has: function (els) {
                var doma = this,
                    collection = Collection(els),
                    length = collection[LENGTH]();
                return !!length && collection.find(function (el) {
                    return doma.indexOf(el) === -1;
                });
            },
            /**
             * @func
             * @name DOMA#html
             * @returns {DOMA} instance
             */
            html: htmlTextManipulator(HTML),
            /**
             * @func
             * @name DOMA#text
             * @returns {DOMA} instance
             */
            text: htmlTextManipulator(TEXT),
            /**
             * @func
             * @name DOMA#childOf
             */
            map: function (handler, context) {
                return Collection(map(this.toArray(), handler, context));
            },
            toJSON: function () {
                return this.results(TO_JSON).toArray();
            },
            toString: function () {
                return stringify(this);
            }
        }, wrap(allEachMethods, applyToEach), wrap(firstMethods, applyToFirst), wrap(readMethods, applyToTarget))),
        allSetups = [],
        plugins = [];
    app.undefine(function (app, windo, passed) {
        var setup = DOMA_SETUP(windo);
        allSetups.push(setup);
        duff(plugins, function (plugin) {
            plugin(setup);
        });
        setup.collectTemplates();
        passed.$ = setup;
        return setup;
    });
    // collect all templates with an id
    // register all custom elements...
    // everything that's created after this should go through the DomManager to be marked appropriately
    // define a hash for attribute caching
    app.defineDirective(ATTRIBUTES, function () {
        return {};
    });
});
app.scope(function (app) {
    var lastAFId, lastTId, lastOverrideId, x = 0,
        lastTime = 0,
        frameTime = 0,
        int = _.pI,
        nowish = _.now,
        vendors = toArray('ms,moz,webkit,o'),
        RUNNING = 'running',
        HALTED = 'halted',
        STOPPED = 'stopped',
        DESTROYED = 'destroyed',
        LOOPER = 'Looper',
        TIMEOUT = 'Timeout',
        SET_TIMEOUT = 'set' + TIMEOUT,
        CLEAR_TIMEOUT = 'clear' + TIMEOUT,
        ANIMATION_FRAME = 'AnimationFrame',
        REQUEST_ANIMATION_FRAME = 'request' + ANIMATION_FRAME,
        UP_REQUEST_ANIMATION_FRAME = capitalize(REQUEST_ANIMATION_FRAME),
        CANCEL_ANIMATION_FRAME = 'cancel' + ANIMATION_FRAME,
        allLoopers = [],
        runningLoopers = [],
        eachCall = _.eachCall,
        time = _.time,
        remove = _.remove,
        running = BOOLEAN_FALSE,
        focused = BOOLEAN_TRUE,
        request = function (handler) {
            var nextFrame = Math.max(0, lastTime - frameTime);
            lastAFId = win[REQUEST_ANIMATION_FRAME](function () {
                // if this handler ever gets called, then you can call it focused
                focused = BOOLEAN_TRUE;
                handler();
            });
            if (!focused) {
                win[CLEAR_TIMEOUT](lastTId);
                lastTId = win.setTimeout(handler, nextFrame + 1);
            }
            if (Looper.playWhileBlurred) {
                win[CLEAR_TIMEOUT](lastOverrideId);
                lastOverrideId = win.setTimeout(function () {
                    focused = BOOLEAN_FALSE;
                    handler();
                }, nextFrame + 50);
            }
        },
        basicHandler = function () {
            // snapshot the time
            frameTime = _.now();
            // clear all the things
            win[CANCEL_ANIMATION_FRAME](lastAFId);
            win[CLEAR_TIMEOUT](lastTId);
            win[CLEAR_TIMEOUT](lastOverrideId);
            // run the handlers
            var docManager = app.DocumentManager;
            var dependant = docManager && docManager.dependency();
            eachCall(runningLoopers, 'run', frameTime);
            // do it all over again
            teardown();
            return dependant && dependant();
        },
        setup = function () {
            running = BOOLEAN_TRUE;
            request(basicHandler);
        },
        teardown = function () {
            duffRight(runningLoopers, function (looper, idx) {
                if (looper.is(HALTED) || looper.is(STOPPED) || looper.is(DESTROYED) || !looper[LENGTH]()) {
                    looper.stop();
                    runningLoopers.splice(idx, 1);
                }
            });
            running = BOOLEAN_FALSE;
            if (runningLoopers[LENGTH]) {
                setup();
            }
        },
        add = function (looper) {
            allLoopers.push(looper);
        },
        start = function (looper) {
            if (!has(runningLoopers, looper)) {
                runningLoopers.push(looper);
            }
            if (!running) {
                setup();
            }
        },
        shim = (function () {
            for (; x < vendors[LENGTH] && !win[REQUEST_ANIMATION_FRAME]; ++x) {
                win[REQUEST_ANIMATION_FRAME] = win[vendors[x] + UP_REQUEST_ANIMATION_FRAME];
                win[CANCEL_ANIMATION_FRAME] = win[vendors[x] + capitalize(CANCEL_ANIMATION_FRAME)] || win[vendors[x] + 'Cancel' + UP_REQUEST_ANIMATION_FRAME];
            }
            if (!win[REQUEST_ANIMATION_FRAME]) {
                win[REQUEST_ANIMATION_FRAME] = function (callback) {
                    var currTime = now(),
                        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                        id = win.setTimeout(function () {
                            callback(currTime + timeToCall);
                        }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            if (!win[CANCEL_ANIMATION_FRAME]) {
                win[CANCEL_ANIMATION_FRAME] = function (id) {
                    win[CLEAR_TIMEOUT](id);
                };
            }
        }()),
        runner = function (tween, obj, lastrun) {
            tween.current = obj;
            if (!obj.filter(lastrun)) {
                return;
            }
            wraptry(function () {
                obj.fn(lastrun);
            }, function () {
                // takes queued object off of the queue
                tween.dequeue(obj.id);
            });
        },
        returnsNext = function () {
            return this.tween.lastRun;
        },
        actuallyDequeue = function (tween, obj) {
            tween.drop(ID, obj.id);
            return tween.remove(obj);
        },
        sorter = function (a, b) {
            var aVal, bVal;
            return (aVal = a.sort()) === (bVal = b.sort()) ? 0 : (isNaN(aVal) ? 1 : (isNaN(bVal) ? -1 : aVal < bVal ? -1 : 1));
        },
        Looper = factories[LOOPER] = Collection.extend(LOOPER, {
            constructor: function () {
                var looper = this;
                looper.mark(STOPPED);
                looper.unmark(HALTED);
                looper.unmark(DESTROYED);
                looper.unmark(RUNNING);
                looper[CONSTRUCTOR + COLON + COLLECTION]();
                add(looper);
                return looper;
            },
            destroy: function () {
                this.mark(DESTROYED);
                return this.halt();
            },
            run: function (_nowish) {
                var sliced, slicedLength, finished, i = 0,
                    tween = this;
                if (!tween.is(HALTED) && !tween.is(STOPPED) && tween[LENGTH]()) {
                    // stop early if it is halted, stopped, or there's nothing to run
                    tween.lastRun = _nowish;
                    tween.sort(sorter);
                    sliced = tween.toArray().slice(0);
                    slicedLength = sliced[LENGTH];
                    for (; i < slicedLength && !finished; i++) {
                        finished = !tween.is(HALTED) && runner(tween, sliced[i], _nowish);
                    }
                }
                tween.current = NULL;
                tween.unmark(RUNNING);
            },
            dequeue: function (id_) {
                var fnObj, found, i = 0,
                    tween = this,
                    id = id_,
                    ret = BOOLEAN_FALSE;
                if (id === UNDEFINED && !arguments[LENGTH]) {
                    if (tween.current) {
                        id = actuallyDequeue(tween, tween.current);
                    }
                    return !!id;
                }
                if (!isNumber(id)) {
                    return BOOLEAN_FALSE;
                }
                found = tween.get(ID, id);
                if (!found) {
                    return BOOLEAN_FALSE;
                }
                actuallyDequeue(tween, found);
                return BOOLEAN_TRUE;
            },
            stop: function () {
                this.mark(STOPPED);
                return this;
            },
            start: function () {
                var looper = this;
                looper.unmark(STOPPED);
                looper.unmark(HALTED);
                start(looper);
                return looper;
            },
            halt: function () {
                this.mark(HALTED);
                return this.stop();
            },
            queue: function (fn_) {
                var len, id = app.counter(BOOLEAN_FALSE),
                    tween = this,
                    obj = fn_;
                if (isFunction(obj)) {
                    obj = {
                        fn: tween.bind(obj)
                    };
                }
                if (!isObject(obj)) {
                    return;
                }
                len = tween[LENGTH]();
                obj.tween = tween;
                obj.sort = obj.sort || returnsNext;
                obj.filter = obj.filter || returnsTrue;
                obj.id = id;
                tween.push(obj);
                tween.keep(ID, id, obj);
                len = len ? start(tween) : tween.start();
                return id;
            },
            bind: function (fn) {
                return bindTo(fn, this);
            },
            once: function (fn) {
                return this.frames(1, fn);
            },
            frames: function (timey, fn_) {
                var fn, count = 0,
                    times = int(timey) || 1;
                if (!fn_ && isFunction(times)) {
                    fn_ = timey;
                    times = 1;
                }
                if (!isFunction(fn_)) {
                    return;
                }
                fn = this.bind(fn_);
                if (times < 1 || !isNumber(times)) {
                    times = 1;
                }
                return this.queue(function (ms) {
                    var last = BOOLEAN_FALSE;
                    count++;
                    if (count >= times) {
                        this.dequeue();
                        last = BOOLEAN_TRUE;
                    }
                    fn(ms, last, count);
                });
            },
            tween: function (time__, fn_) {
                var fn, added = nowish(),
                    time_ = time(time__),
                    tween = this;
                if (!isFunction(fn_)) {
                    return;
                }
                fn = tween.bind(fn_);
                // continuous update
                return tween.timeout(0, function (ms) {
                    var finished = BOOLEAN_FALSE,
                        diff = ms - added;
                    if (diff >= time_) {
                        finished = BOOLEAN_TRUE;
                        tween.dequeue();
                    }
                    fn(ms, Math.min(1, (diff / time_)), finished);
                });
            },
            frameRate: function (time__, fn_, min) {
                var fn, tween = this,
                    minimum = Math.min(min || 0.8, 0.8),
                    expectedFrameRate = 30 * minimum,
                    lastDate = 1,
                    lastSkip = nowish(),
                    time_ = time__ || 125;
                if (!isFunction(fn_)) {
                    return tween;
                }
                fn = tween.bind(fn_);
                return tween.queue(function (ms) {
                    var frameRate = 1000 / (ms - lastDate);
                    if (frameRate > 40) {
                        expectedFrameRate = 60 * minimum;
                    }
                    if (frameRate < expectedFrameRate) {
                        lastSkip = ms;
                    }
                    if (ms - lastSkip > time_) {
                        tween.dequeue();
                        fn(ms);
                    }
                    lastDate = ms;
                });
            },
            timeout: function (time_, fn_) {
                var fn, tweener = this;
                if (!isFunction(fn_)) {
                    return;
                }
                fn = tweener.bind(fn_);
                return tweener.interval(time_, function (ms) {
                    tweener.dequeue();
                    fn(ms);
                });
            },
            interval: function (time_, handler) {
                var bound, fn = handler,
                    tweener = this,
                    timey = time(time_),
                    last = now();
                if (!isFunction(fn)) {
                    return;
                }
                if (!isNumber(timey)) {
                    timey = 0;
                }
                bound = tweener.bind(handler);
                return tweener.queue({
                    filter: function (t) {
                        return t - timey >= last;
                    },
                    fn: function (t) {
                        last = t;
                        bound(t);
                    },
                    sort: function () {
                        return last + timey;
                    }
                });
            },
            defer: function (time, handler) {
                var id, tweener = this;
                return function () {
                    var args = toArray(arguments);
                    tweener.dequeue(id);
                    id = tweener.timeout(time, bind.apply(_, [handler, this].concat(args)));
                    return id;
                };
            }
        });
    // use set timeout to play when visibility changes
    Looper.playWhileBlurred = BOOLEAN_TRUE;
    _.publicize({
        AF: Looper()
    });
});
var AF = _.AF;

var REGION_MANAGER = 'RegionManager',
    DOCUMENT_VIEW = 'DocumentView',
    DOCUMENT_MANAGER = 'DocumentManager',
    RENDER_LOOP = 'renderLoop',
    verifyOwner$ = function (instance) {
        if (instance.owner$) {
            return;
        }
        exception('object needs an owner$ function to scope itself against a ' + DOCUMENT);
    };
app.scope(function (app) {
    var protoProp = _.protoProp,
        isFragment = _.isFragment,
        isInstance = _.isInstance,
        isFunction = _.isFunction,
        isArrayLike = _.isArrayLike,
        intendedObject = _.intendedObject,
        RENDER = 'render',
        RENDERING = RENDER + 'ing',
        RENDERED = RENDER + 'ed',
        OPTIONS = 'options',
        MODEL_ID = 'modelId',
        ESTABLISHED = 'established',
        PARENT_NODE = 'parentNode',
        CONSTRUCTOR = 'constructor',
        BUFFERED_VIEWS = 'bufferedViews',
        noRegionMessage = 'that region does not exist',
        invalidRegionMessage = 'invalid key passed for region name',
        elementDoesNotExistAt = function (key) {
            return exception('an element does not exist at ' + key);
        },
        /**
         * @class View
         * @augments Model
         * @augments Model
         * @classDesc Objects that have one or more element associated with them, such as a template that needs constant updating from the data
         */
        // region views are useful if you're constructing different components
        // from a separate place and just want it to be in the buffer pipeline
        // very useful for componentizing your ui
        Parent = factories.Parent,
        Model = factories.Model,
        makesView = function (region, view_) {
            var isModel, child, Child, isView, model = view_,
                children = region.directive(CHILDREN);
            if ((isView = View.isInstance(view_))) {
                if ((child = children.get(MODEL_ID, view_.model.id))) {
                    return child;
                } else {
                    return view_;
                }
            }
            if ((isModel = Model.isInstance(model))) {
                if ((child = children.get(MODEL_ID, model.id))) {
                    return child;
                }
            } else {
                Child = region.childConstructor();
                return Child({
                    model: Child[CONSTRUCTOR][PROTOTYPE].Model(view_)
                });
            }
        },
        disown = function (currentParent, view, region) {
            var model, children = currentParent[CHILDREN];
            view[PARENT] = NULL;
            children.remove(view);
            model = view.model;
            children.drop('viewCid', view.cid);
            children.drop('modelCid', model.cid);
            children.drop(MODEL_ID, model.id);
            return region;
        },
        Region = factories.Region = Parent.extend('Region', {
            attributes: returns(BOOLEAN_FALSE),
            childConstructor: function () {
                var region = this;
                return region.Child === BOOLEAN_TRUE ? region[PARENT][PARENT].childConstructor() : region.Child;
            },
            constructor: function (secondary) {
                var model = this;
                model.super.call(model, secondary);
                verifyOwner$(model);
                model.directive(CHILDREN);
                model.setElement();
                return model;
            },
            add: function (models_, options_, renderer) {
                var bufferedViewsDirective, region = this,
                    options = options_ || {},
                    unwrapped = Collection(models_).foldl(function (memo, item) {
                        var adoption;
                        if ((adoption = region.adopt(item))) {
                            memo.push(adoption);
                        }
                    }, []);
                if (region.el) {
                    region.render(renderer);
                }
                return unwrapped;
            },
            adopt: function (view_) {
                var model, view, region = this,
                    children = region[CHILDREN];
                if (!view_) {
                    return BOOLEAN_FALSE;
                }
                view = makesView(region, view_);
                if (view[PARENT]) {
                    if (view[PARENT] === region) {
                        return BOOLEAN_FALSE;
                    } else {
                        disown(view[PARENT], view, region);
                    }
                }
                view[PARENT] = region;
                children.add(view);
                model = view.model;
                children.keep('viewCid', view.cid, view);
                children.keep('modelCid', model.cid, view);
                children.keep(MODEL_ID, model.id, view);
                return view;
            },
            buffer: function (view) {
                var currentParentNode, bufferDirective, region = this,
                    viewEl = view.el && view.el.element(),
                    regionElement = region.el.element(),
                    viewParentElement = view.parentElement(region);
                if (!viewEl) {
                    return region;
                }
                currentParentNode = viewEl.parentNode;
                if (!currentParentNode || currentParentNode !== viewParentElement) {
                    if (viewParentElement === regionElement) {
                        bufferDirective = region.directive(BUFFERED_VIEWS);
                        bufferDirective.els.append(viewEl);
                    } else {
                        $(viewParentElement).append(viewEl);
                    }
                }
                return region;
            },
            // this needs to be modified for shared windows
            setElement: function () {
                var region = this,
                    selector = region[SELECTOR],
                    parent = region[PARENT][PARENT],
                    manager = parent[PARENT] && parent[PARENT][PARENT] === app ? parent.$(selector).item(0) : parent.owner$.returnsManager(parent.directive(CAPITAL_ELEMENT).hashed[selector]);
                if (!manager) {
                    return elementDoesNotExistAt(selector);
                }
                region.directive(CAPITAL_ELEMENT).set(manager);
                return region;
            },
            render: function (preventChain_) {
                var region = this,
                    bufferDirective = region.directive(BUFFERED_VIEWS),
                    elementDirective = region.directive(CAPITAL_ELEMENT),
                    preventChain = preventChain_ || noop;
                region.unmark(RENDERED);
                // doc frags on regionviews, list of children to trigger events on
                bufferDirective.ensure();
                // request extra data or something before rendering: dom is still completely intact
                region[DISPATCH_EVENT](BEFORE_COLON + RENDER);
                // unbinds and rebinds element only if it changes
                region.setElement();
                // update new element's attributes
                // elementDirective.setAttributes();
                // puts children back inside parent
                if (preventChain(region)) {
                    // stop rendering child views, just buffer them
                    region[CHILDREN].each(region.buffer, region);
                } else {
                    region[CHILDREN].eachCall(RENDER, preventChain);
                }
                // buffer region element
                // appends child elements
                elementDirective.el.append(bufferDirective.els);
                region[DISPATCH_EVENT]('buffered');
                // pass the buffered views up
                // mark the view as rendered
                region.mark(RENDERED);
                // reset buffered objects
                bufferDirective.reset();
                // dispatch the render event
                region[DISPATCH_EVENT](RENDER);
                return region;
            }
        }),
        establishRegions = function (view, force) {
            var regionManager = view.directive(REGION_MANAGER);
            if (!force && regionManager.is(ESTABLISHED)) {
                return;
            }
            // var regions = result(view, 'regions');
            var element = view.directive(CAPITAL_ELEMENT);
            regionManager.mark(ESTABLISHED);
            element.renderEl();
            element.diff();
            element.renderTemplate();
            // var regionsResult = keys(regions)[LENGTH] && regionManager.establish(regions);
            return view;
        },
        addChildView = intendedApi(function (regionKey, views) {
            var region, view = this,
                regionManager = view.directive(REGION_MANAGER);
            establishRegions(view);
            return (region = regionManager.get(regionKey)) ? region.add(views) : exception(noRegionMessage);
        }),
        removeChildView = intendedApi(function (regionKey, views) {
            var region, regionManager = this.directive(REGION_MANAGER);
            return regionManager.is(ESTABLISHED) && ((region = regionManager.get(regionKey)) ? region.remove(views) : exception(noRegionMessage));
        }),
        addRegion = parody(REGION_MANAGER, 'add'),
        getRegion = parody(REGION_MANAGER, 'get'),
        removeRegion = parody(REGION_MANAGER, 'remove'),
        // view needs to be pitted against a document
        View = factories.View = Parent.extend('View', {
            Model: Model,
            modifiers: noop,
            getRegion: getRegion,
            addRegion: addRegion,
            removeRegion: removeRegion,
            addChildView: addChildView,
            removeChildView: removeChildView,
            getChildViews: function (key) {
                return this.getRegion(key).directive(CHILDREN);
            },
            tagName: returns('div'),
            template: returns(BOOLEAN_FALSE),
            // elementParent: returns(BOOLEAN_TRUE),
            parentElement: function (region) {
                return region.el.element();
            },
            childrenOf: function (key) {
                return this.directive(REGION_MANAGER).get(key).directive(CHILDREN);
            },
            parentView: function () {
                var found, view = this,
                    parent = view[PARENT];
                while (!found && parent) {
                    parent = parent[PARENT];
                    if (View.isInstance(parent)) {
                        found = parent;
                    }
                }
                return found;
            },
            bindModel: function (model) {
                var view = this,
                    modelEvents = result(view, 'modelEvents');
                view.model = Model.isInstance(model) ? model : view.Model(model);
                view.listenTo(view.model, modelEvents);
                view.listenTo(view.model, CHANGE, view.render);
            },
            constructor: function (secondary_) {
                var view = this;
                var secondary = secondary_ || {};
                view.id = app.counter(BOOLEAN_FALSE, BOOLEAN_TRUE);
                view.bindModel(secondary.model);
                delete secondary.model;
                Parent[CONSTRUCTOR].call(view, secondary);
                view.directive(CAPITAL_ELEMENT).ensure();
                return view;
            },
            // mostly sorting purposes
            valueOf: function () {
                return this.model.valueOf();
            },
            destroy: function (handler) {
                var view = this;
                if (view.is(DESTROYING)) {
                    return view;
                } else {
                    view[DISPATCH_EVENT](BEFORE_DESTROY);
                }
                view.mark(DESTROYING);
                if (view[REGION_MANAGER]) {
                    view[REGION_MANAGER].list.eachCall(DESTROY);
                }
                if (view.el) {
                    view.el.destroy(handler);
                }
                view.directiveDestruction(CAPITAL_ELEMENT);
                Parent[CONSTRUCTOR][PROTOTYPE].destroy.call(view);
                return view;
            },
            render: function (preventChain) {
                var newelementisDifferent, element, json, html, renderResult, bufferedDirective, template, settingElement, view = this;
                // you might be able to do this a better way
                view.mark(RENDERING);
                element = view.directive(CAPITAL_ELEMENT);
                // prep the object with extra members (doc frags on regionviews,
                // list of children to trigger events on)
                // request extra data or something before rendering: dom is still completely intact
                view[DISPATCH_EVENT](BEFORE_COLON + RENDER);
                // renders the html
                // mark the view as rendered
                // pass buffered views up to region
                if (view[REGION_MANAGER]) {
                    view[REGION_MANAGER].list.eachCall(RENDER, isFunction(preventChain) ? preventChain : returnsTrue);
                }
                establishRegions(view, BOOLEAN_TRUE);
                element = view[PARENT] && view[PARENT].buffer(view);
                return view;
            }
        }),
        _View = factories.View,
        bufferedEnsure = function () {
            var buffers = this,
                _bufferedEls = buffers.els && buffers.els.is(FRAGMENT) ? 1 : buffers.resetEls();
        },
        bufferedReset = function () {
            var cached = this.views;
            this.resetEls();
            return cached;
        },
        bufferedElsReset = function () {
            this.els = this.region.owner$.fragment();
        },
        RegionManager = factories[REGION_MANAGER] = factories.Directive.extend(REGION_MANAGER, {
            constructor: function (instance) {
                var regionManager = this;
                regionManager.parent = instance;
                regionManager.list = Collection();
                return regionManager;
            },
            create: function (where, region_) {
                var key, regionManagerDirective = this,
                    parent = regionManagerDirective[PARENT],
                    // assume that it is a region
                    selector = region_,
                    region = region_;
                if (isInstance(region, Region)) {
                    return region;
                }
                region = Region(extend({
                    selector: selector || EMPTY_STRING,
                    owner$: parent.owner$
                }, isObject(region) ? region : {}, {
                    id: where,
                    key: region_,
                    parent: regionManagerDirective
                }));
                regionManagerDirective.list.push(region);
                regionManagerDirective.list.keep(ID, where, region);
                return region;
            },
            establish: intendedApi(function (key, selector) {
                if (!key) {
                    exception(invalidRegionMessage);
                }
                var $selected, element, regionManagerDirective = this,
                    parentView = regionManagerDirective[PARENT],
                    region = regionManagerDirective.list.get(ID, key),
                    documentManager = parentView[PARENT];
                if (!region) {
                    region = regionManagerDirective.create(key, selector);
                }
                if (documentManager && documentManager[PARENT] === app) {
                    // come at it from the top
                    $selected = parentView.el.$(selector)[ITEM](0);
                    if (!$selected) {
                        elementDoesNotExistAt(selector);
                    }
                } else {
                    // i should already have this one
                    // from the
                    element = parentView.directive(CAPITAL_ELEMENT);
                    element = element.hashed[region[SELECTOR]];
                    if (!element) {
                        elementDoesNotExistAt(selector);
                    }
                    $selected = parentView.owner$.returnsManager(element);
                }
                if (!region.el) {
                    region.el = $selected;
                }
            }),
            remove: function (region_) {
                // var regionManager = this;
                // var region = isString(region_) ? regionManager.get(region_) : region_;
                // regionManager.remove(region);
                // regionManager.drop(region.id, region);
            },
            add: intendedApi(function (key, selector) {
                var regionManagerDirective = this;
                var region = regionManagerDirective.list.get(ID, key);
                if (!region) {
                    regionManagerDirective.establish(key, selector);
                }
            }),
            get: function (key) {
                return this.list.get(ID, key);
            }
        }),
        BufferedViews = factories[BUFFERED_VIEWS] = factories.Directive.extend(BUFFERED_VIEWS, {
            constructor: function (instance) {
                var bufferedViews = this;
                bufferedViews.region = instance;
                this.resetEls();
                return bufferedViews;
            },
            reset: bufferedReset,
            ensure: bufferedEnsure,
            resetEls: bufferedElsReset
        }),
        DocumentView = factories[DOCUMENT_VIEW] = factories.Model.extend(DOCUMENT_VIEW, {
            regions: noop,
            addRegion: addRegion,
            getRegion: getRegion,
            removeRegion: removeRegion,
            removeChildView: removeChildView,
            addChildView: intendedApi(function (key, view_) {
                var regionManager = this.directive(REGION_MANAGER);
                var region = regionManager.get(key);
                view_.render();
                region.add(view_, NULL, returnsTrue);
            }),
            render: function (preventChain) {
                var view = this;
                view.directive(REGION_MANAGER).list.eachCall(RENDER, preventChain);
                return view;
            },
            constructor: function (options) {
                var documentView = this;
                extend(documentView, options);
                return documentView;
            },
            chunk: function (id, fn) {
                var docViewManager = this.parent,
                    modifications = docViewManager.modifications,
                    alreadyQueued = modifications.get(ID, id),
                    chunk = alreadyQueued || {
                        id: id,
                        fn: fn,
                        counter: 0
                    };
                if (alreadyQueued) {
                    alreadyQueued.counter += 1;
                }
                modifications.keep(ID, id, chunk);
                modifications.push(chunk);
                docViewManager.checkRenderLoop();
            }
        }),
        DocumentManager = factories[DOCUMENT_MANAGER] = factories.Model.extend(DOCUMENT_MANAGER, {
            checkRenderLoop: function () {
                if (!this.get(RENDER_LOOP)) {
                    this.modify();
                }
            },
            dependency: function () {
                var docViewManager = this;
                docViewManager.set(RENDER_LOOP, docViewManager.get(RENDER_LOOP) + 1);
                return function () {
                    docViewManager.set(RENDER_LOOP, docViewManager.get(RENDER_LOOP) - 1);
                    docViewManager.checkRenderLoop();
                };
            },
            modify: function () {
                var finisher, documentView = this,
                    modifications = documentView.modifications;
                if (!modifications.length()) {
                    return;
                }
                modifications = modifications.slice(0);
                documentView.modifications = Collection();
                // silently set write
                finisher = documentView.dependency();
                documentView.mark('writing');
                modifications.eachCallTry('fn');
                // let everyone know when
                // you're done writing
                documentView.unmark('writing');
                finisher();
            },
            constructor: function (app) {
                // all managed and connected externally. no api
                var documentManager = this;
                documentManager.parent = app;
                documentManager.documents = Collection();
                documentManager.modifications = Collection();
                factories.Model[CONSTRUCTOR].apply(this, arguments);
                return documentManager;
            }
        });
    var CAPITAL_ELEMENT = capitalize(ELEMENT);
    var basicViewTrigger = function (name, e) {
            return this[DISPATCH_EVENT](name, e);
        },
        makeDelegateEventKeys = function (cid, bindings, key) {
            var viewNamespace = 'delegateEvents' + cid,
                indexOfAt = indexOf(key, '@'),
                hasAt = indexOfAt !== -1;
            return {
                selector: hasAt ? normalizeUIString(key.slice(indexOfAt), bindings) : EMPTY_STRING,
                group: viewNamespace,
                events: hasAt ? key.slice(0, indexOfAt).trim() : key
            };
        },
        normalizeUIString = function (uiString, ui) {
            return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function (r) {
                return ui[r.slice(4)];
            });
        },
        // allows for the use of the @ui. syntax within
        // a given key for triggers and events
        // swaps the @ui with the associated selector.
        // Returns a new, non-mutated, parsed events hash.
        normalizeUIKeys = function (hash, ui) {
            return reduce(hash, function (memo, val, key) {
                memo[normalizeUIString(key, ui)] = val;
            }, {});
        },
        Element = factories.Directive.extend(CAPITAL_ELEMENT, {
            constructor: function (view) {
                this.view = view;
                return this;
            },
            ensure: function () {
                var el, element = this,
                    view = element.view,
                    selector = element[SELECTOR] || result(view, 'el');
                if (selector) {
                    element[SELECTOR] = selector;
                }
                if (factories.DOMA.isInstance(selector)) {
                    return;
                }
                if (isString(selector)) {
                    // sets external element
                    el = selector;
                } else {
                    // defauts back to wrapping the element
                    // creates internal element
                    el = element.create(view.tagName());
                    // subclassed to expand the attributes that can be used
                }
                element.set(el);
            },
            create: function (tag) {
                return this.view.owner$.createElement(tag);
            },
            unset: function () {
                var element = this;
                delete element.view.el;
                delete element.el;
            },
            set: function (el) {
                var directive = this;
                directive.view.el = directive.el = el;
            },
            diff: function () {
                var element = this,
                    manager = element.el,
                    view = element.view,
                    el = manager.element(),
                    json = (view.model && view.model.toJSON()) || {},
                    // try to generate template
                    virtual = element.virtual = [view.tagName(), element.attributes(), view.template(json, result(view, 'helpers') || {})],
                    comparison = view.owner$.nodeComparison(el, virtual, element.hashed, bindTo(element.comparisonFilter, element)),
                    keys = element.hashed = comparison.keys,
                    mutations = element.mutations = comparison.mutations,
                    modifiers = element.modifiers = extend({
                        remove: noop,
                        update: noop,
                        insert: noop
                    }, isFunction(modifiers = view.modifiers()) ? {
                        insert: modifiers
                    } : modifiers);
            },
            comparisonFilter: function (node) {
                // node is a virtual node, so json
                var regionManager = this.view.directive(REGION_MANAGER),
                    // get the 3rd index, where all the data is stored
                    id = node[3] || {},
                    key = id.key;
                // if you don't have an identifying key, and are not registered as a region, then go ahead
                return !key || !regionManager.get(ID, key);
            },
            delta: function () {
                var result, element = this,
                    view = element.view,
                    mutations = element.mutations,
                    modifiers = element.modifiers,
                    memo = BOOLEAN_FALSE;
                if (!element.mutations) {
                    return BOOLEAN_FALSE;
                }
                delete element.mutations;
                delete element.modifiers;
                // if it's a function, then do it last
                result = mutations.remove() || memo;
                result = modifiers.remove() || result;
                result = mutations.update() || result;
                result = modifiers.update() || result;
                result = mutations.insert() || result;
                return modifiers.insert() || result;
            },
            renderEl: function () {
                var replacing, elementsSwapped, element = this,
                    view = element.view,
                    settingElement = view.el,
                    newelementisDifferent = settingElement !== element.el;
                if (newelementisDifferent) {
                    element.unset();
                }
                if (!newelementisDifferent && view.is(RENDERED)) {
                    return;
                }
                // turns ui into a hash
                element.degenerateUIBindings();
                element.undelegateEvents();
                element.undelegateTriggers();
                element.set(settingElement);
                // these may change with a delta'd render
                element.generateUIBindings();
                element.delegateEvents();
                element.delegateTriggers();
            },
            setState: function () {
                var elementsSwapped, regions, regionsResult, element = this,
                    view = element.view;
                view.unmark('asyncRendering');
                // prevent future from triggering
                view.owner$.documentView.chunk(view.cid, noop);
                if ((elementsSwapped = element.delta())) {
                    // ui objects changed. need to update groups
                    element.bindUI();
                }
                view.unmark(RENDERING);
                view.mark(RENDERED);
                regions = result(view, 'regions');
                regionsResult = keys(regions)[LENGTH] && view.RegionManager.establish(regions);
                // dispatch the render event
                view[DISPATCH_EVENT](RENDER);
                return element;
            },
            renderTemplate: function () {
                var element = this,
                    view = element.view;
                // if it is attached and the documentview is not writing already, then queue it up
                if (view.el.is('attached')) {
                    view.mark('asyncRendering');
                    view.owner$.documentView.chunk(view.cid, bindTo(element.setState, element));
                } else {
                    element.setState();
                }
                return element;
            },
            degenerateUIBindings: function () {
                var directive = this;
                if (!directive.ui) {
                    return NULL;
                }
                directive.ui = directive.view.ui = directive.uiBindings;
                delete directive.uiBindings;
            },
            generateUIBindings: function () {
                var directive = this,
                    uiBindings = directive.uiBindings || result(directive.view, 'ui'),
                    ui = directive.ui = directive.ui || {};
                if (directive.uiBindings) {
                    return directive;
                }
                // save it to skip the result call later
                directive.uiBindings = uiBindings;
                return directive;
            },
            delegateEvents: function () {
                var key, method, match, directive = this,
                    view = directive.view,
                    el = directive.el,
                    elementBindings = directive.elementBindings || result(view, 'elementEvents'),
                    __events = [];
                if (directive.elementBindings) {
                    directive.elementBindings = elementBindings;
                }
                if (!el) {
                    return directive;
                }
                directive.cachedElementBindings = map(elementBindings, function (method, key) {
                    var object = makeDelegateEventKeys(view.cid, directive.uiBindings, key),
                        bound = object.fn = bindTo(isString(method) ? view[method] : method, view);
                    __events.push(object);
                    el.on(object.events, object[SELECTOR], bound, object.capture, object.group);
                });
                directive.cachedElementBindings = __events;
                return directive;
            },
            undelegateEvents: function () {
                var key, method, match, directive = this,
                    view = directive.view,
                    el = directive.el,
                    elementBindings = directive.cachedElementBindings;
                if (!elementBindings || !el) {
                    return directive;
                }
                duff(elementBindings, function (binding) {
                    el.off(binding.events, binding[SELECTOR], binding.fn);
                });
                directive.cachedElementBindings = UNDEFINED;
                return directive;
            },
            delegateTriggers: function () {
                var key, method, match, directive = this,
                    view = directive.view,
                    el = directive.el,
                    elementTriggers = directive.elementTriggers || result(view, 'elementTriggers'),
                    __events = [];
                if (!directive.elementTriggers) {
                    directive.elementTriggers = elementTriggers;
                }
                if (!el) {
                    return directive;
                }
                each(elementTriggers, function (method, key) {
                    var object = makeDelegateEventKeys(view.cid, directive.uiBindings, key),
                        bound = object.fn = bindWith(basicViewTrigger, [view, method]);
                    el.on(object.events, object[SELECTOR], bound, object.capture, object.group);
                });
                directive.cachedElementTriggers = __events;
                return directive;
            },
            undelegateTriggers: function () {
                var key, method, match, directive = this,
                    view = directive.view,
                    el = directive.el,
                    elementBindings = directive.cachedElementTriggers;
                if (!directive.cachedElementTriggers || !el) {
                    return directive;
                }
                duff(elementBindings, function (binding) {
                    el.off(binding.events.join(SPACE), binding[SELECTOR], binding.fn);
                });
                directive.cachedElementTriggers = UNDEFINED;
                return directive;
            },
            attributes: function () {
                return result(this.view, 'attributes');
            },
            bindUI: function () {
                var directive = this,
                    uiBindings = directive.uiBindings;
                directive.ui = directive.view.ui = map(uiBindings, directive.el.$, directive.el);
                return directive;
            }
        });
    app.defineDirective(DOCUMENT_MANAGER, DocumentManager[CONSTRUCTOR]);
    app.defineDirective(REGION_MANAGER, RegionManager[CONSTRUCTOR]);
    app.defineDirective(BUFFERED_VIEWS, BufferedViews[CONSTRUCTOR]);
    app.defineDirective(CAPITAL_ELEMENT, Element, function (directive, instance) {
        directive.el.destroy();
        directive.unset();
        var ui = directive.ui;
        directive.degenerateUIBindings();
        eachCall(ui, 'destroy');
    });
    app.undefine(function (app, windo, opts) {
        var doc = windo[DOCUMENT];
        var documentManager = app.directive(DOCUMENT_MANAGER);
        var documents = documentManager.documents;
        var documentView = documents.get(ID, doc[__ELID__]);
        if (documentView) {
            exception('document has already been setup');
        }
        var $ = opts.$,
            owner = $.document,
            ExtendedRegion = Region.extend({
                owner$: $
            }),
            ExtendedView = View.extend({
                owner$: $
            }),
            scopedFactories = opts.scopedFactories = {
                Region: ExtendedRegion,
                View: ExtendedView
            };
        documentView = DocumentView({
            $: $,
            owner$: $,
            id: doc[__ELID__],
            el: $.returnsManager(doc),
            parent: documentManager,
            factories: scopedFactories
        });
        $.documentView = documentView;
        documents.push(documentView);
        documents.keep(ID, documentView.id, documentView);
    });
});
var busterGroupHash = {},
    VERSION = 'version',
    UPPERCASE_VERSION = VERSION.toUpperCase(),
    receivePostMessage = function (evt) {
        var buster, data = evt.data(),
            postTo = data.postTo;
        if (evt.busted || app.isDestroyed || !data || !postTo || (app[UPPERCASE_VERSION] !== data[VERSION] && data[VERSION] !== '*')) {
            return;
        }
        buster = (busterGroupHash[data.group] || {})[data.postTo];
        if (!buster) {
            return;
        }
        evt.busted = BOOLEAN_TRUE;
        var originalMessage, runCount = data.runCount,
            children = buster.directive(CHILDREN);
        if (runCount) {
            originalMessage = children.get(ID, data.messageId);
            if (!originalMessage) {
                return;
            }
            // found the message that I originally sent you
            // allow the buster to set some things up
            buster.response(originalMessage, data);
        } else {
            buster.receive(data);
        }
    };
app.scope(function (app) {
    var ENCODED_BRACKET = '%7B',
        IS_LATE = 'isLate',
        DOCUMENT_READY = 'documentReady',
        DEFERRED = 'deferred',
        RESOLVED = 'resolved',
        IS_DEFERRED = 'is' + capitalize(DEFERRED),
        GROUP = 'group',
        POST_TO = 'postTo',
        COMMAND = 'command',
        RUN_COUNT = 'runCount',
        FLUSHING = 'flushing',
        CONNECT = 'connect',
        CONNECTED = CONNECT + 'ed',
        DISCONNECTED = 'dis' + CONNECTED,
        COMPONENT = 'component',
        INITIALIZE = 'initialize',
        RESPONSE = 'response',
        MESSAGE = 'message',
        RESPONSE_OPTIONS = RESPONSE + 'Options',
        CAPITAL_RESPONSE = capitalize(RESPONSE),
        LATEST_RESPONSE = 'latest' + CAPITAL_RESPONSE,
        LAST_RESPONSE = 'last' + CAPITAL_RESPONSE,
        RESPONDED = 'responded',
        RESPONDED_WITH = RESPONDED + 'With',
        RECEIVED = 'received',
        BEFORE_RESPONDED = BEFORE_COLON + RESPONDED,
        BEFORE_RECEIVED = BEFORE_COLON + RECEIVED,
        QUEUED_MESSAGE_INDEX = 'queuedMessageIndex',
        SENT_MESSAGE_INDEX = 'sentMessageIndex',
        RECEIVED_REFERRER = 'receiveReferrer',
        EMIT_REFERRER = 'emitReferrer',
        BUSTER = 'buster',
        PACKET = 'packet',
        /**
         * single function to stringify and post message an object to the other side
         * @private
         * @arg {object} object to be stringified and sent to the receive function,
         * either through a post message, or through a setTimeout
         * @arg {buster}
         */
        postMessage = function (base, buster) {
            var referrer, message = stringify(base);
            return buster.emitWindow.emit(message, buster.get(EMIT_REFERRER));
        },
        defaultGroupId = uuid(),
        RESPOND_HANDLERS = 'respondHandlers',
        Message = factories.Model.extend(capitalize(MESSAGE), {
            idAttribute: returns(MESSAGE + 'Id'),
            initialize: function () {
                var message = this;
                message[RESPOND_HANDLERS] = [];
                message.once(RESPONSE, message.saveReceived);
                message.on(DEFERRED, message.saveDeferred);
            },
            saveReceived: function (e) {
                this.responseEventObject = e;
            },
            saveDeferred: function (e) {
                this.deferredEventObject = e;
            },
            packet: function (data) {
                var message = this;
                if (arguments[0]) {
                    message.set(PACKET, data || {});
                } else {
                    message = cloneJSON(message.get(PACKET));
                }
                return message;
            },
            defaults: function () {
                return {
                    command: NULL + EMPTY_STRING,
                    packet: {}
                };
            },
            response: function (handler) {
                var message = this;
                if (!isFunction(handler)) {
                    return message;
                }
                if (message.get(RESPONDED_WITH)) {
                    handler.call(message, message.responseEventObject);
                } else {
                    message.once(RESPONSE, handler);
                }
                return message;
            },
            deferred: function (handler) {
                var message = this,
                    latestResponse = message.get(LATEST_RESPONSE);
                message.on(DEFERRED, handler);
                if (latestResponse && latestResponse.isDeferred) {
                    handler.call(message, message.deferredEventObject);
                }
                return message;
            },
            send: function () {
                return this[PARENT].flush();
            }
        }),
        receiveWindowEvents = {
            message: receivePostMessage
        },
        wipe = function (buster) {
            return find(busterGroupHash, function (groupHash) {
                return find(groupHash, function (previousbuster, key, groupHash) {
                    return buster === previousbuster && delete groupHash[key];
                });
            });
        },
        disconnected = function () {
            var buster = this;
            if (buster.connectPromise) {
                buster.connectPromise.reject();
            }
            buster.unmark(CONNECTED);
            buster[DISPATCH_EVENT](DISCONNECTED);
            buster.connectPromise = _.Promise();
        },
        connected = function (buster, message) {
            buster.connectPromise.fulfill(message);
            buster.mark(CONNECTED);
            buster[DISPATCH_EVENT](CONNECTED);
        },
        connectReceived = function (e) {
            // first submit a response so the other side can flush
            var buster = this,
                dataDirective = buster.directive(DATA);
            if (dataDirective.get(IS_LATE)) {
                dataDirective.set(SENT_MESSAGE_INDEX, 1);
            }
            buster.respond((e.message || e.origin).id);
            buster.mark(CONNECTED);
            buster[DISPATCH_EVENT](CONNECTED);
        },
        UPCASED_BUSTER = capitalize(BUSTER),
        defaultMessage = function (buster) {
            return {
                from: buster.get(ID),
                postTo: buster.get(POST_TO),
                group: buster.get(GROUP),
                version: app[UPPERCASE_VERSION],
                messageId: buster.directive(CHILDREN)[LENGTH](),
                timeStamp: _.now()
            };
        };
    var Buster = factories[UPCASED_BUSTER] = factories.Model.extend(UPCASED_BUSTER, {
        Child: Message,
        bounce: function (e) {
            return this.respond(e.message.id);
        },
        connected: function () {
            this.connectPromise.success(arguments);
            return this;
        },
        response: function (original, data) {
            var buster = this,
                originalData = original[DATA];
            if (!originalData) {
                return;
            }
            originalData.set(LATEST_RESPONSE, data);
            if (original.is(RESOLVED)) {
                original[DISPATCH_EVENT](DEFERRED, data.packet);
            } else {
                originalData.set(RESPONDED_WITH, data);
                original.mark(RESOLVED);
                original[DISPATCH_EVENT](RESPONSE, data.packet);
            }
        },
        receive: function (data) {
            var message, buster = this,
                receiveHistory = buster.receiveHistory;
            data.originMessageId = data.messageId;
            data.messageId = receiveHistory.length();
            data.isDeferred = BOOLEAN_FALSE;
            message = Message(data);
            receiveHistory.push(message);
            receiveHistory.keep(ID, data.messageId, message);
            buster[DISPATCH_EVENT](BEFORE_RECEIVED);
            buster[DISPATCH_EVENT](RECEIVED + COLON + data.command, data.packet, {
                message: message
            });
            buster[DISPATCH_EVENT](RECEIVED);
            return buster;
        },
        setGroup: function () {
            var buster = this,
                group = buster.get(GROUP),
                id = buster.get(ID),
                resultant = wipe(buster),
                groupHash = busterGroupHash[group] = busterGroupHash[group] || {};
            groupHash[id] = buster;
            return buster;
        },
        /**
         * @func
         * @name Buster#defaults
         */
        defineWindows: function (receiveWindow, emitWindow) {
            var buster = this,
                busterData = buster.directive(DATA);
            if (receiveWindow && receiveWindow.is(WINDOW)) {
                // takes care of preventing duplicate handlers
                buster.receiveWindow = receiveWindow.on(receiveWindowEvents);
                buster.mark(DOCUMENT_READY);
                buster.flush();
            }
            if (emitWindow && emitWindow.is(WINDOW)) {
                buster.emitWindow = emitWindow;
                busterData.set(POST_TO, busterData.get(POST_TO) || buster.emitWindow.address);
            }
        },
        defineIframe: function (iframe) {
            var busterData, emitReferrer, receiveReferrer, iframeSrc, referrer, receiveWindow, data, href, windo, buster = this;
            if (!iframe || !iframe.is(IFRAME)) {
                return;
            }
            buster[IFRAME] = iframe;
            if (iframe.is(ATTACHED) && (windo = iframe.window())) {
                buster.defineWindows(NULL, windo);
            }
            if (iframe) {
                buster.setupIframe();
            }
        },
        setupIframe: function () {
            var emitReferrer, buster = this,
                iframe = buster[IFRAME],
                busterData = buster.directive(DATA),
                hrefSplit = buster.receiveWindow.element().location.href.split(ENCODED_BRACKET),
                hrefShift = hrefSplit.shift(),
                unshifted = hrefSplit.unshift(EMPTY_STRING),
                href = hrefSplit.join(ENCODED_BRACKET),
                receiveReferrer = parseUrl(busterData.get(RECEIVED_REFERRER) || href).origin,
                iframeSrc = busterData.get(IFRAME + 'Src'),
                iframeContent = busterData.get(IFRAME + 'Content'),
                // this is going to the
                data = {
                    postTo: buster.id,
                    useTop: false,
                    // post to me
                    useParent: true,
                    emitReferrer: receiveReferrer,
                    id: busterData.get(POST_TO),
                    group: busterData.get(GROUP)
                };
            busterData.set(RECEIVED_REFERRER, receiveReferrer);
            if (iframeSrc) {
                emitReferrer = busterData.set(EMIT_REFERRER, _.reference(iframeSrc));
                data[RECEIVED_REFERRER] = emitReferrer;
            }
            if (iframeSrc) {
                iframe.src(stringifyQuery({
                    url: iframeSrc,
                    hash: data
                }));
            }
            if (iframeContent) {
                iframe.data(BUSTER, encodeURI(stringify(data)));
                iframe.html(iframeContent);
                buster.begin(INITIALIZE);
            }
        },
        stripData: function () {
            var hashSplit, hashShift, hashString, buster = this,
                receiveWindow = buster.receiveWindow;
            if (!receiveWindow || !receiveWindow.is(WINDOW)) {
                return;
            }
            hashString = receiveWindow.element().location.hash.slice(1);
            hashSplit = hashString.split(ENCODED_BRACKET);
            hashShift = hashSplit.shift();
            hashSplit.unshift(EMPTY_STRING);
            hashString = hashSplit.join(ENCODED_BRACKET);
            buster.set(parse(decodeURI(hashString || wraptry(function () {
                return receiveWindow.parent(IFRAME).data(BUSTER);
            }))));
        },
        constructor: function (listen, talk, settings_, events) {
            var buster = this;
            verifyOwner$(buster);
            var settings = settings_ || {};
            // normalize to manager
            var receiveWindow = buster.owner$(listen).item(0);
            var manager = buster.owner$(talk).item(0);
            settings.id = settings.id === UNDEFINED ? uuid() : settings.id;
            buster.receiveHistory = factories.Collection();
            disconnected.call(buster);
            settings.group = defaultGroupId;
            factories.Model[CONSTRUCTOR].call(buster, settings);
            buster.on(CONNECTED, function (e) {
                var firstMessage = buster.directive(CHILDREN).first();
                buster.connectPromise.fulfill(firstMessage);
                buster.flush();
            });
            buster.on({
                'received:update': 'bounce',
                'received:unload': 'destroy',
                destroy: disconnected,
                'received:initialize received:connect': connectReceived,
                'change:group change:id': 'setGroup'
            });
            buster.on(events);
            buster.setGroup();
            if (receiveWindow && receiveWindow.is(WINDOW)) {
                buster.defineWindows(receiveWindow);
            }
            if (manager.is(WINDOW)) {
                buster.defineWindows(NULL, manager);
                // window tests... because messages are going up
            } else {
                buster.defineIframe(manager);
                // iframe tests... because messages are going down
            }
            if (buster.get('strip')) {
                buster.stripData();
            }
            buster.set(SENT_MESSAGE_INDEX, 0);
            if (buster[IFRAME]) {
                // oh, are we late?
                if (buster.get(IS_LATE)) {
                    buster.begin(INITIALIZE);
                }
            } else {
                // is an inner buster... let's check to see if anyone is waiting for us
                buster.begin(CONNECT);
            }
            return buster;
        },
        /**
         * tries to flush the cache. only works if the connected attribute is set to true. If it is, then the post message pipeline begins
         * @returns {buster} returns this;
         * @func
         * @name Buster#flush
         */
        flush: function () {
            var command, children, childrenLen, queuedMsg, i = 0,
                buster = this,
                dataManager = buster.directive(DATA),
                currentIdx = dataManager.get(SENT_MESSAGE_INDEX),
                connected = buster.is(CONNECTED),
                initedFrom = dataManager.get('initedFromPartner'),
                flushing = dataManager.get(FLUSHING);
            if (!buster.is(DOCUMENT_READY)) {
                return buster;
            }
            if (!initedFrom || connected && ((connected || !currentIdx) && !flushing)) {
                dataManager.set(FLUSHING, BOOLEAN_TRUE);
                children = buster.directive(CHILDREN);
                childrenLen = children[LENGTH]();
                queuedMsg = children.item(currentIdx);
                while (queuedMsg && currentIdx < childrenLen) {
                    queuedMsg.directive(DATA).set(RUN_COUNT, 0);
                    if (currentIdx || connected) {
                        queuedMsg = children.item(currentIdx);
                        currentIdx = (dataManager.get(SENT_MESSAGE_INDEX) + 1) || 0;
                        dataManager.set(SENT_MESSAGE_INDEX, currentIdx);
                        postMessage(queuedMsg, buster);
                    } else {
                        // initializing
                        childrenLen = UNDEFINED;
                        command = queuedMsg.get(COMMAND);
                        if (command === CONNECT || command === INITIALIZE) {
                            postMessage(queuedMsg, buster);
                        }
                    }
                }
                buster.set(FLUSHING, BOOLEAN_FALSE);
                if (buster.is(CONNECTED)) {
                    if (children[LENGTH]() > buster.get(SENT_MESSAGE_INDEX)) {
                        buster.flush();
                    }
                }
            }
            return buster;
        },
        /**
         * basic send message function, adds to queue, then calls flush
         * @arg {string} can be string or object. if object, must have command property as string
         * @arg {object} base object to be sent
         * @returns {buster}
         * @func
         * @name Buster#send
         */
        create: function (command, packet, extra) {
            var buster = this,
                message = buster.add(extend({
                    command: command,
                    packet: packet
                }, defaultMessage(buster), extra));
            return message.item(0);
        },
        /**
         * shorthand for creating a function that gets called after the buster's partner has responded
         * @func
         * @name Buster#sync
         */
        sync: function (fn) {
            return this.create('update').response(fn).send();
        },
        /**
         * creates a default message based on the attributes of the buster
         * @returns {object} blank / default message object
         * @func
         * @name Buster#defaultMessage
         */
        /**
         * respond trigger.
         * @arg {object} original data object (same pointer) that was sent over
         * @arg {object} extend object, that will be applied to a base object, that is created by the responseExtend attribute set on the buster object
         * @returns {buster}
         * @func
         * @name Buster#respond
         */
        respond: function (messageId, packet_) {
            var messageData, packet, lastRespondUpdate, newMessage, buster = this,
                originalMessage = buster.receiveHistory.get(ID, messageId);
            if (!originalMessage) {
                return buster;
            }
            buster[DISPATCH_EVENT](BEFORE_RESPONDED);
            // if (buster.el && (!data.canThrottle || buster.shouldUpdate(arguments))) {
            // on the inner functions, we don't want to allow this
            // module to be present, so the inner does not influence the outer
            messageData = originalMessage.directive(DATA);
            messageData.set(RUN_COUNT, (messageData.get(RUN_COUNT) || 0) + 1);
            packet = extend(BOOLEAN_TRUE, result(buster, 'package') || {}, packet_);
            newMessage = extend(defaultMessage(buster), {
                from: originalMessage.get(POST_TO),
                postTo: originalMessage.get('from'),
                messageId: originalMessage.get('originMessageId'),
                isResponse: BOOLEAN_TRUE,
                isDeferred: originalMessage.get(IS_DEFERRED),
                runCount: originalMessage.get(RUN_COUNT),
                command: originalMessage.get(COMMAND),
                timeStamp: _.now(),
                packet: packet,
                version: originalMessage.get(VERSION)
            });
            // silent sets
            messageData.set(LAST_RESPONSE, newMessage.timeStamp);
            messageData.set(IS_DEFERRED, BOOLEAN_TRUE);
            // loud set
            buster.set(LAST_RESPONSE, newMessage.timeStamp);
            postMessage(newMessage, buster);
            buster[DISPATCH_EVENT](RESPONDED, packet);
            return buster;
        },
        /**
         * starts a relationship between two busters. simplifies the initialization process.
         * @returns {number} just for responding to the original message in case there's a handler
         * @func
         * @name Buster#begin
         */
        begin: function (command) {
            var buster = this,
                children = buster.directive(CHILDREN);
            return children.item(0) || buster.create(command).response(function (e) {
                connectReceived.call(buster, e);
            }).send();
        }
    });
    Buster.receivePostMessage = receivePostMessage;
    app.undefine(function (app, win, opts) {
        var documentManager = app.directive(DOCUMENT_MANAGER);
        var documentView = documentManager.documents.get(ID, win[DOCUMENT][__ELID__]);
        var $ = documentView.$;
        var scopedFactories = documentView.factories;
        var winTop = win.top;
        var windo = win.parent;
        scopedFactories[UPCASED_BUSTER] = Buster.extend({
            owner$: $
        });
        if (app.global.touch(win, winTop)) {
            documentView.$(winTop).on(MESSAGE, receivePostMessage);
        }
        // documentView.$(win).on(MESSAGE, receivePostMessage);
        wraptry(function () {
            var windo;
            while (windo !== winTop) {
                documentView.$(windo).on(MESSAGE, receivePostMessage);
                windo = win.parent;
            }
        });
    });
});
app.scope(function (app) {
    var testisrunning,
        expectationRunning, current, expectationCount, pollerTimeout, allIts, describes, successfulIts, failedIts, stack, queue, allExpectations, successful, failures, successfulExpectations, failedExpectations, globalBeforeEachStack, globalAfterEachStack, currentItFocus, failedTests = 0,
        EXPECTED = 'expected',
        SPACE_NOT = ' not',
        TO_EQUAL = ' to equal ',
        TO_EVALUATE_TO = ' to evaluate to ',
        AN_ERROR = ' an error',
        TO_BE_THROWN = ' to be thrown',
        TO_BE_STRICTLY_EQUAL_TO_STRING = ' to be strictly equal to ',
        errIfFalse = function (handler, makemessage, execute) {
            return function (arg) {
                var result, expectation = {};
                if (execute) {
                    current = current();
                }
                result = handler(current, arg);
                if (result !== BOOLEAN_TRUE && result !== BOOLEAN_FALSE) {
                    exception('expectation results from the maker method must be of type boolean.');
                }
                if (result) {
                    successfulExpectations.push(expectation);
                    expectation.success = BOOLEAN_TRUE;
                } else {
                    ++failedTests;
                    expectation = new Error(makemessage.call(this, current, arg));
                    expectation.message = expectation.toString();
                    expectation.success = BOOLEAN_FALSE;
                    failedExpectations.push(expectation);
                }
                allExpectations.push(expectation);
                expectation.tiedTo = currentItFocus;
                expectationRunning = BOOLEAN_FALSE;
                return result;
            };
        },
        expectationsHash = {
            not: {}
        },
        expect = function (start) {
            if (expectationRunning) {
                return exception('expectations cannot be nested or be running at the same time');
            }
            expectationRunning = BOOLEAN_TRUE;
            current = start;
            return expectationsHash;
        },
        maker = expect.maker = function (where, test, positive, negative, execute) {
            expectationsHash[where] = errIfFalse(test, positive, execute);
            expectationsHash.not[where] = errIfFalse(negate(test), negative, execute);
        },
        internalToThrowResult = maker('toThrow', function (handler) {
            var errRan = BOOLEAN_FALSE;
            return wraptry(handler, function () {
                errRan = BOOLEAN_TRUE;
            }, function () {
                return errRan;
            });
        }, function () {
            return EXPECTED + AN_ERROR + TO_BE_THROWN;
        }, function () {
            return EXPECTED + AN_ERROR + SPACE_NOT + TO_BE_THROWN;
        }),
        internalToBeResult = maker('toBe', function (current, comparison) {
            return current === comparison;
        }, function (current, comparison) {
            return EXPECTED + SPACE + stringify(current) + TO_BE_STRICTLY_EQUAL_TO_STRING + stringify(comparison);
        }, function (current, comparison) {
            return EXPECTED + SPACE + stringify(current) + SPACE_NOT + TO_BE_STRICTLY_EQUAL_TO_STRING + stringify(comparison);
        }),
        internalToEqualResult = maker('toEqual', function (current, comparison) {
            return isEqual(current, comparison);
        }, function (current, comparison) {
            return EXPECTED + SPACE + stringify(current) + TO_EQUAL + stringify(comparison);
        }, function (current, comparison) {
            return EXPECTED + SPACE + stringify(current) + SPACE_NOT + TO_EQUAL + stringify(comparison);
        }),
        internalToEvaluateTo = maker('toEvaluateTo', function (current, comparison) {
            return isEqual(current, comparison);
        }, function (current, comparison) {
            return EXPECTED + SPACE + 'function' + TO_EVALUATE_TO + stringify(comparison);
        }, function (current, comparison) {
            return EXPECTED + SPACE + 'function not' + TO_EVALUATE_TO + stringify(comparison);
        }, BOOLEAN_TRUE),
        errHandler = function (expectation) {
            return function (err) {
                expectation.erred = err;
                console.error(err);
            };
        },
        executedone = function (expectation) {
            var queued;
            expectation.endTime = _.performance.now();
            stack.pop();
            if (failedTests || expectation.erred) {
                failedIts.push(expectation);
                expectation.promise.reject(expectation.err);
            } else {
                successfulIts.push(expectation);
                expectation.promise.fulfill();
            }
            failedTests = 0;
            runningEach(expectation.afterStack);
            testisrunning = BOOLEAN_FALSE;
            if (queue[0]) {
                queued = queue.shift();
                clearTimeout(queued.runId);
                setup(queued);
            }
            setupPoller();
        },
        describe = function (string, handler) {
            var resolution = Promise();
            describes.push(resolution);
            stack.push(string);
            globalBeforeEachStack.push([]);
            globalAfterEachStack.push([]);
            wraptry(handler, noop, function () {
                globalAfterEachStack.pop();
                globalBeforeEachStack.pop();
                stack.pop();
            });
            return resolution;
        },
        setup = function (expectation) {
            testisrunning = BOOLEAN_TRUE;
            expectation.runId = setTimeout(function () {
                var errThat, doThis, errThis, err, finallyThis,
                    current = expectation.current.slice(0);
                currentItFocus = expectation;
                testisrunning = BOOLEAN_TRUE;
                runningEach(expectation.beforeStack);
                errThis = errHandler(expectation);
                if (expectation.handler[LENGTH] === 1) {
                    err = new Error();
                    expectation.timeoutId = setTimeout(function () {
                        console.error('timeout:\n' + current.join('\n'));
                        errThat(err);
                        executedone(expectation);
                    }, 5000);
                    doThis = function () {
                        expectation.handler(function () {
                            clearTimeout(expectation.timeoutId);
                            executedone(expectation);
                        });
                    };
                    errThat = errThis;
                    errThis = function (e) {
                        errThat(e);
                        executedone(expectation);
                    };
                    finallyThis = noop;
                } else {
                    doThis = expectation.handler;
                    finallyThis = function () {
                        executedone(expectation);
                    };
                }
                expectation.startTime = _.performance.now();
                wraptry(doThis, errThis, finallyThis);
            });
        },
        it = function (string, handler) {
            var copy, expectation;
            stack.push(string);
            copy = stack.slice(0);
            stack.pop();
            expectation = {
                string: string,
                handler: handler,
                current: copy,
                afterStack: globalAfterEachStack.slice(0),
                beforeStack: globalBeforeEachStack.slice(0),
                promise: Promise()
            };
            allIts.push(expectation);
            if (testisrunning) {
                queue.push(expectation);
            } else {
                setup(expectation);
            }
            return expectation.promise;
        },
        runningEach = function (globalStack) {
            var i, j, itemized;
            for (i = 0; i < globalStack[LENGTH]; i++) {
                itemized = globalStack[i];
                for (j = 0; j < itemized[LENGTH]; j++) {
                    itemized[j]();
                }
            }
        },
        beforeEach = function (handler) {
            globalBeforeEachStack[globalBeforeEachStack[LENGTH] - 1].push(handler);
        },
        afterEach = function (handler) {
            globalAfterEachStack[globalAfterEachStack[LENGTH] - 1].push(handler);
        },
        resetTests = function () {
            pollerTimeout = UNDEFINED;
            _.each(describes, function (promise) {
                promise.resolve();
            });
            expectationCount = 0;
            describes = [];
            allIts = [];
            successfulIts = [];
            failedIts = [];
            stack = [];
            queue = [];
            allExpectations = [];
            successful = [];
            failures = [];
            successfulExpectations = [];
            failedExpectations = [];
            globalBeforeEachStack = [];
            globalAfterEachStack = [];
            testisrunning = BOOLEAN_FALSE;
            expectationRunning = BOOLEAN_FALSE;
        },
        makesItName = function (current, delimiter_) {
            var target, string, delimiter = delimiter_ || '\n',
                stringList = current.slice(0);
            while (stringList.length) {
                target = stringList.shift();
                if (string) {
                    string = string + delimiter + target;
                } else {
                    string = target;
                }
                delimiter = delimiter + '    ';
            }
            return string;
        },
        createResults = function (duration) {
            return {
                passed: successfulExpectations[LENGTH],
                failed: failedExpectations[LENGTH],
                total: allExpectations[LENGTH],
                duration: duration,
                tests: map(allExpectations, function (expectation) {
                    var target, tiedIt = expectation.tiedTo,
                        string = makesItName(tiedIt.current);
                    return {
                        name: expectation.success ? string : string + '\n',
                        duration: 0,
                        result: expectation.success,
                        message: expectation.message
                    };
                })
            };
        },
        setupPoller = function () {
            pollerTimeout = pollerTimeout === void 0 ? setTimeout(function loops() {
                var theIt, string, i = 0,
                    totalTime = 0;
                if (!testisrunning) {
                    for (; i < allIts[LENGTH]; i++) {
                        theIt = allIts[i];
                        totalTime += (theIt.endTime - theIt.startTime);
                    }
                    if (failedExpectations[LENGTH]) {
                        console.log('failed');
                        duff(failedExpectations, function (obj) {
                            console.log(obj);
                        });
                    }
                    string = successfulExpectations[LENGTH] + ' successful expectations\n' + failedExpectations[LENGTH] + ' failed expectations\n' + allExpectations[LENGTH] + ' expectations ran\n' + successfulIts[LENGTH] + ' out of ' + allIts[LENGTH] + ' tests passed\nin ' + totalTime + 'ms';
                    results = createResults(totalTime);
                    resetTests();
                    eachCallBound(afters, results);
                    console.log(string, results);
                } else {
                    pollerTimeout = setTimeout(loops, 500);
                }
            }, 100) : pollerTimeout;
        },
        afters = [],
        finished = function (fn) {
            afters.push(fn);
        };
    resetTests();
    _.publicize({
        test: {
            afterEach: afterEach,
            beforeEach: beforeEach,
            expect: expect,
            describe: describe,
            it: it,
            finished: finished
        }
    });
});
});