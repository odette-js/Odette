'use strict';
var blank, win = window,
    TO_STRING = 'toString',
    VALUE_OF = 'valueOf',
    PROTOTYPE = 'prototype',
    CONSTRUCTOR = 'constructor',
    CHILD = 'child',
    CHILDREN = CHILD + 'ren',
    CHANGE = 'change',
    BEFORE_COLON = 'before:',
    RESET = 'reset',
    ATTRIBUTES = 'attributes',
    PARENT = 'parent',
    DESTROY = 'destroy',
    LENGTH = 'length',
    OBJECT = 'object',
    STRING = 'string',
    BOOLEAN = 'boolean',
    FUNCTION = 'function',
    INDEX_OF = 'indexOf',
    DISPATCH_EVENT = 'dispatchEvent',
    HTTP = 'http',
    TO_ARRAY = 'toArray',
    CONSTRUCTOR_KEY = '__' + CONSTRUCTOR + '__',
    LOCATION = 'location',
    EXTEND = 'extend',
    BOOLEAN_TRUE = !0,
    BOOLEAN_FALSE = !1,
    NULL = null;
application.scope(function (app) {
    var blank, _, factories = {},
        object = Object,
        fn = Function,
        array = Array,
        string = String,
        BRACKET_OBJECT_SPACE = '[object ',
        stringProto = string[PROTOTYPE],
        objectProto = object[PROTOTYPE],
        arrayProto = array[PROTOTYPE],
        funcProto = fn[PROTOTYPE],
        nativeKeys = object.keys,
        hasEnumBug = !{
            toString: NULL
        }.propertyIsEnumerable(TO_STRING),
        noop = function () {},
        /**
         * @func
         */
        slice = function (obj, one, two) {
            return stringProto.slice.call(obj, one, two);
        },
        listSlice = function (obj, one, two) {
            return arrayProto.slice.call(obj, one, two);
        },
        /**
         * @func
         */
        split = function (obj, str) {
            return stringProto.split.call(obj, str);
        },
        /**
         * @func
         */
        join = function (obj, str) {
            return arrayProto.join.call(obj, str);
        },
        /**
         * @func
         */
        pop = function (obj) {
            return arrayProto.pop.call(obj);
        },
        /**
         * @func
         */
        push = function (obj, item) {
            var args = splice(arguments, 1);
            return arrayProto.push.apply(obj, args);
        },
        /**
         * @func
         */
        shift = function (o) {
            return arrayProto.shift.call(o);
        },
        /**
         * @func
         */
        indexOfNaN = function (array, fromIndex, toIndex, fromRight) {
            if (!array) {
                return -1;
            }
            var other, limit = array[LENGTH],
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
        binaryIndexOf = function (array, searchElement, minIndex_, maxIndex_) {
            var currentIndex, currentElement, resultIndex, found,
                minIndex = minIndex_ || 0,
                maxIndex = maxIndex_ || array[LENGTH] - 1;
            while (minIndex <= maxIndex) {
                resultIndex = currentIndex = (minIndex + maxIndex) / 2 | 0;
                currentElement = array[currentIndex];
                if (currentElement < searchElement) {
                    minIndex = currentIndex + 1;
                } else if (currentElement > searchElement) {
                    maxIndex = currentIndex - 1;
                } else {
                    return currentIndex;
                }
            }
            found = ~maxIndex;
            return found;
        },
        /**
         * @func
         */
        splice = function () {
            var ctx = shift(arguments);
            return arrayProto.splice.apply(ctx, arguments);
        },
        reverse = function (arr) {
            return arrayProto.reverse.call(arr);
        },
        /**
         * @func
         */
        toString = function (obj) {
            return (obj === NULL || obj === blank) ? '' : (obj + '');
        },
        /**
         * @func
         */
        sort = function (obj, fn) {
            var _fn;
            if (isFunction(fn)) {
                _fn = fn;
                // normalization for safari
                fn = function () {
                    var res = +_fn.apply(this, arguments);
                    if (isNaN(res)) {
                        res = 0;
                    }
                    if (res > 1) {
                        res = 1;
                    }
                    if (res < -1) {
                        res = -1;
                    }
                    return res;
                };
            }
            return arrayProto.sort.call(obj, fn);
        },
        /**
         * @func
         */
        has = function (obj, prop) {
            var val = !1;
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
        nativeIsInstance = function (instance, constructor) {
            var result = BOOLEAN_FALSE;
            if (isFunction(constructor)) {
                result = instance instanceof constructor;
            }
            return result;
        },
        isInstance = function (instance, constructor_) {
            var constructor = constructor_;
            while (has(constructor, CONSTRUCTOR)) {
                constructor = constructor[CONSTRUCTOR];
            }
            return nativeIsInstance(instance, constructor);
        },
        /**
         * @func
         */
        splitGen = function (delimiter) {
            return function (list) {
                if (isString(list)) {
                    list = split(list, delimiter);
                }
                return list;
            };
        },
        /**
         * @func
         */
        joinGen = function (delimiter) {
            return function (arr) {
                return join(arr, delimiter);
            };
        },
        /**
         * @func
         */
        gapJoin = joinGen(' '),
        /**
         * @func
         */
        gapSplit = splitGen(' '),
        /**
         * @func
         */
        isWrap = function (type, fn) {
            if (!fn) {
                fn = function () {
                    return 1;
                };
            }
            return function (thing) {
                var ret = 0;
                if (typeof thing === type && fn(thing)) {
                    ret = 1;
                }
                return !!ret;
            };
        },
        /**
         * @func
         */
        isFunction = isWrap(FUNCTION),
        /**
         * @func
         */
        isBoolean = isWrap(BOOLEAN),
        /**
         * @func
         */
        isString = isWrap(STRING),
        /**
         * @func
         */
        // isBlank = isWrap('undefined', function (thing) {
        //     return thing === NULL;
        // }),
        isNull = function (thing) {
            return thing === NULL;
        },
        isUndefined = function (thing) {
            return thing === blank;
        },
        isBlank = function (thing) {
            return isUndefined(thing) || isNull(thing);
        },
        /**
         * @func
         */
        isNaN = function (thing) {
            return thing !== thing;
        },
        negate = function (fn) {
            return function () {
                return !fn.apply(this, arguments);
            };
        },
        isNumber = isWrap('number', negate(isNaN)),
        isFinite_ = win.isFinite,
        isFinite = function (thing) {
            return isNumber(thing) && isFinite_(thing);
        },
        /**
         * @func
         */
        isObject = isWrap(OBJECT, function (thing) {
            return !!thing;
        }),
        /**
         * @func
         */
        isArray = Array.isArray,
        /**
         * @func
         */
        isEmpty = function (obj) {
            return !keys(obj)[LENGTH];
        },
        nonEnumerableProps = gapSplit('valueOf isPrototypeOf ' + TO_STRING + ' propertyIsEnumerable hasOwnProperty toLocaleString'),
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
        stringify = function (obj) {
            if (isObject(obj)) {
                obj = JSON.stringify(obj);
            }
            if (isFunction(obj)) {
                obj = obj.toString();
            }
            return obj + '';
        },
        /**
         * @func
         */
        uniqueId = (function () {
            var cache = {},
                global = 0;
            return function (prefix, isInt) {
                var val;
                if (!prefix) {
                    prefix = '';
                }
                prefix += '';
                val = cache[prefix];
                if (!val) {
                    val = cache[prefix] = 0;
                }
                cache[prefix]++;
                if (!isInt) {
                    val = prefix + val;
                }
                return val;
            };
        }()),
        now = function () {
            return +(new Date());
        },
        allKeys = function (obj) {
            var key, keys = [];
            if (isObject(obj)) {
                for (key in obj) {
                    keys.push(key);
                }
                // Ahem, IE < 9.
                if (hasEnumBug) {
                    collectNonEnumProps(obj, keys);
                }
            }
            return keys;
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
        merge = function (obj1, obj2, deep) {
            var key, val, i = 0,
                keys = allKeys(obj2),
                l = keys[LENGTH];
            for (; i < l; i++) {
                key = keys[i];
                // ignore undefined
                if (obj2[key] !== blank) {
                    val = obj2[key];
                    if (deep) {
                        if (isObject(obj2[key])) {
                            if (!isObject(obj1[key])) {
                                obj1[key] = returnDismorphicBase(obj2[key]);
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
            return isArray(collection) || (isNumber(length) && !isString(collection) && length >= 0 && length <= MAX_ARRAY_INDEX && !isFunction(collection));
        },
        eachProxy = function (fn) {
            return function (obj_, iteratee_, context_, direction_) {
                var ret, obj = obj_,
                    list = obj,
                    iteratee = iteratee_,
                    iterator = iteratee,
                    context = context_,
                    direction = direction_;
                if (obj) {
                    if (!isArrayLike(obj)) {
                        list = keys(obj);
                        if (context) {
                            iteratee = bind(iterator, context);
                        }
                        context = NULL;
                        iterator = function (key, idx, list) {
                            // gives you the key, use that to get the value
                            return iteratee(obj[key], key, obj);
                        };
                    }
                    return fn(list, iterator, context, direction);
                }
            };
        },
        /**
         * @func
         */
        createPredicateIndexFinder = function (dir) {
            return eachProxy(function (array, predicate, context, index_) {
                var length = array[LENGTH],
                    callback = bind(predicate, context),
                    index = index_ || (dir > 0 ? 0 : length - 1);
                for (; index >= 0 && index < length; index += dir) {
                    if (callback(array[index], index, array)) {
                        return index;
                    }
                }
                return -1;
            });
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
            return key !== -1 && key === key && key !== blank && key !== NULL && key !== BOOLEAN_FALSE && key !== BOOLEAN_TRUE;
        },
        finder = function (findHelper) {
            return function (obj, predicate, context, startpoint) {
                var key = findHelper(obj, predicate, context, startpoint);
                if (validKey(key)) {
                    return obj[key];
                }
            };
        },
        find = finder(findIndex),
        findLast = finder(findLastIndex),
        bind = function (fn_, ctx) {
            var fn = fn_;
            if (ctx) {
                fn = fn_.bind(ctx);
            }
            return fn;
        },
        duff = function (values, process, context, direction) {
            var iterations, val, i, leftover, deltaFn;
            if (values && isFunction(process)) {
                i = 0;
                val = values[LENGTH];
                leftover = val % 8;
                iterations = Math.floor(val / 8);
                if (direction < 0) {
                    i = val - 1;
                }
                direction = direction || 1;
                process = bind(process, context);
                if (leftover > 0) {
                    do {
                        process(values[i], i, values);
                        i += direction;
                    } while (--leftover > 0);
                }
                if (iterations) {
                    do {
                        process(values[i], i, values);
                        i += direction;
                        process(values[i], i, values);
                        i += direction;
                        process(values[i], i, values);
                        i += direction;
                        process(values[i], i, values);
                        i += direction;
                        process(values[i], i, values);
                        i += direction;
                        process(values[i], i, values);
                        i += direction;
                        process(values[i], i, values);
                        i += direction;
                        process(values[i], i, values);
                        i += direction;
                    } while (--iterations > 0);
                }
            }
            return values;
        },
        each = eachProxy(duff),
        /**
         * @func
         */
        parseBool = function (thing) {
            var ret, thingMod = thing + '';
            thingMod = thingMod.trim();
            if (thingMod === BOOLEAN_FALSE + '') {
                ret = BOOLEAN_FALSE;
            }
            if (thingMod === BOOLEAN_TRUE + '') {
                ret = BOOLEAN_TRUE;
            }
            if (ret === blank) {
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
        constructorExtend = function (name, protoProps, attach) {
            var nameString, child, passedParent, hasConstructor, constructor, parent = this,
                nameIsStr = isString(name);
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
                child = new Function[CONSTRUCTOR]('var parent=arguments[0];return function ' + name + '(){return parent.apply(this,arguments);}')(passedParent);
                // factories[name] = child;
            } else {
                child = function () {
                    return parent.apply(this, arguments);
                };
            }
            // extend(child, parent);
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
            constructor = child;
            child = constructorWrapper(constructor);
            child.__super__ = parent;
            constructor[PROTOTYPE][CONSTRUCTOR_KEY] = child;
            if (nameIsStr && attach) {
                factories[name] = child;
            }
            return child;
        },
        constructorWrapper = function (Constructor) {
            var __ = function (attributes, options) {
                if (isInstance(attributes, Constructor)) {
                    return attributes;
                }
                return new Constructor(attributes, options);
            };
            __[CONSTRUCTOR] = Constructor;
            __[EXTEND] = function () {
                return Constructor[EXTEND].apply(Constructor, arguments);
            };
            return __;
        },
        /**
         * @func
         */
        once = function (fn) {
            var doIt;
            return function () {
                if (!doIt) {
                    doIt = 1;
                    fn.apply(this, arguments);
                }
            };
        },
        /**
         * @func
         */
        // Internal recursive comparison function for `isEqual`.
        eq = function (a, b, aStack, bStack) {
            // Identical objects are equal. `0 === -0`, but they aren't identical.
            // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
            if (a === b) {
                return a !== 0 || 1 / a === 1 / b;
            }
            // A strict comparison is necessary because `NULL == undefined`.
            if (a === NULL || a === blank || b === blank || b === NULL) {
                return a === b;
            }
            // Unwrap any wrapped objects.
            // if (a instanceof _) a = a._wrapped;
            // if (b instanceof _) b = b._wrapped;
            // Compare `[[Class]]` names.
            var className = toString.call(a);
            if (className !== toString.call(b)) return BOOLEAN_FALSE;
            switch (className) {
                // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case BRACKET_OBJECT_SPACE + 'RegExp]':
                // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case BRACKET_OBJECT_SPACE + 'String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
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
            var areArrays = className === BRACKET_OBJECT_SPACE + 'Array]';
            if (!areArrays) {
                if (typeof a != OBJECT || typeof b != OBJECT) return BOOLEAN_FALSE;
                // Objects with different constructors are not equivalent, but `Object`s or `Array`s
                // from different frames are.
                var aCtor = a[CONSTRUCTOR],
                    bCtor = b[CONSTRUCTOR];
                if (aCtor !== bCtor && !(isFunction(aCtor) && nativeIsInstance(aCtor, aCtor) && isFunction(bCtor) && nativeIsInstance(bCtor, bCtor)) && (CONSTRUCTOR in a && CONSTRUCTOR in b)) {
                    return BOOLEAN_FALSE;
                }
            }
            // Assume equality for cyclic structures. The algorithm for detecting cyclic
            // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
            // Initializing stack of traversed objects.
            // It's done here since we only need them for objects and arrays comparison.
            // aStack = aStack || [];
            // bStack = bStack || [];
            var length = aStack[LENGTH];
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
                var objKeys = keys(a),
                    key;
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
        clone = function (a) {
            return map(a, function (value, key) {
                return value;
            });
        },
        fullClone = function (obj) {
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
                        newObj[value] = fn(value);
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
        unshift = function (thing) {
            var ret, items = [];
            duff(arguments, function (arg, idx) {
                if (idx) {
                    items.push(arg);
                }
            });
            return [].unshift.apply(thing, items);
        },
        /**
         * @func
         */
        exports = function (obj) {
            return extend(_, obj);
        },
        /**
         * @func
         */
        Image = win.Image,
        fetch = function (url, callback) {
            var img = new Image();
            url = stringifyQuery(url);
            if (callback) {
                img.onload = function () {
                    _.unshift(arguments, url);
                    callback.apply(this, arguments);
                };
            }
            img.src = url;
            return img;
        },
        parse = function (val_) {
            var val = val_;
            if (isString(val)) {
                val = val.trim();
                if (val[0] === '{' || val[0] === '[') {
                    wraptry(function () {
                        val = JSON.parse(val);
                    });
                }
            }
            return val;
        },
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
        returnDismorphicBase = function (obj) {
            return isArrayLike(obj) ? [] : {};
        },
        map = function (objs, iteratee, context) {
            var collection = returnDismorphicBase(objs);
            var bound = bind(iteratee, context);
            each(objs, function (item, index) {
                collection[index] = bound(item, index, objs);
            });
            return collection;
        },
        toArray = function (obj) {
            var array = [];
            each(obj, function (value, key) {
                array.push(value);
            });
            return array;
        },
        /**
         * @func
         */
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
        /**
         * @func
         */
        stringifyQuery = function (obj) {
            var val, n, base = obj.url,
                query = [];
            if (isObject(obj)) {
                for (n in obj.query) {
                    val = obj.query[n];
                    if (val !== blank) {
                        val = encodeURIComponent(stringify(val));
                        query.push(n + '=' + val);
                    }
                }
                if (query[LENGTH]) {
                    base += '?';
                }
                base += query.join('&');
                if (obj.hash) {
                    obj.hash = _.stringify(obj.hash);
                    base += ('#' + obj.hash);
                }
            } else {
                base = obj;
            }
            return base;
        },
        protoProp = function (instance, key, farDown) {
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
            var blank, cryptoCheck = 'crypto' in window && 'getRandomValues' in crypto,
                sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var rnd, r, v;
                    if (cryptoCheck) {
                        rnd = win.crypto.getRandomValues(new Uint32Array(1));
                        if (rnd === blank) {
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
        intendedArray = function (array, fn_) {
            var fn = fn_;
            if (isArrayLike(array)) {
                duff(array, fn);
            } else {
                if (array) {
                    fn(array, 0, [array]);
                }
            }
        },
        intendedObject = function (key, value, fn_) {
            var fn = fn_,
                obj = isObject(key) ? key : BOOLEAN_FALSE;
            if (obj) {
                each(obj, reverseParams(fn));
            } else {
                fn(key, value);
            }
        },
        reverseParams = function (iteratorFn, ctx) {
            return function (value, key, third) {
                iteratorFn(key, value, third);
            };
        },
        /**
         * @func
         */
        reference = function (str) {
            var match;
            if (!isString(str)) {
                str = str.referrer;
            }
            match = str.match(/^https?:\/\/.*?\//);
            if (match) {
                match = match[0];
            }
            return match || '';
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
            return isFunction(obj[str]) ? obj[str](arg) : obj[str];
        },
        mathArray = function (method) {
            return function (args) {
                return Math[method].apply(maths, args);
            };
        },
        ensureFunction = function (fn) {
            return function (_fn) {
                _fn = _fn || function () {};
                return fn.call(this, _fn);
            };
        },
        _console = win.console || {},
        _log = _console.log || noop,
        console = wrap(gapSplit('trace log dir error'), function (key) {
            var method = _console[key];
            return function () {
                if (method) {
                    return method.apply(_console, arguments);
                } else {
                    return _log.apply(_console, arguments);
                }
            };
        }),
        wraptry = function (trythis, errthat, finalfunction) {
            try {
                return trythis();
            } catch (e) {
                return errthat && errthat(e);
            } finally {
                return finalfunction && finalfunction();
            }
        };
    /**
     * @class Model
     */
    function Model(attributes, options) {
        return this;
    }
    factories.Model = Model;
    Model[PROTOTYPE] = {};
    Model[EXTEND] = constructorExtend;
    _ = app._ = {
        noop: noop,
        months: gapSplit('january feburary march april may june july august september october november december'),
        weekdays: gapSplit('sunday monday tuesday wednesday thursday friday saturday'),
        constructorWrapper: constructorWrapper,
        stringifyQuery: stringifyQuery,
        intendedObject: intendedObject,
        intendedArray: intendedArray,
        ensureFunction: ensureFunction,
        parseDecimal: parseDecimal,
        reference: reference,
        isArrayLike: isArrayLike,
        isInstance: isInstance,
        hasEnumBug: hasEnumBug,
        roundFloat: roundFloat,
        factories: factories,
        listSlice: listSlice,
        fullClone: fullClone,
        parseBool: parseBool,
        stringify: stringify,
        splitGen: splitGen,
        gapSplit: gapSplit,
        uniqueId: uniqueId,
        wraptry: wraptry,
        toString: toString,
        throttle: throttle,
        debounce: debounce,
        protoProp: protoProp,
        reverse: reverse,
        binaryIndexOf: binaryIndexOf,
        indexOfNaN: indexOfNaN,
        indexOf: indexOf,
        joinGen: joinGen,
        toArray: toArray,
        isEqual: isEqual,
        unshift: unshift,
        gapJoin: gapJoin,
        isArray: isArray,
        isEmpty: isEmpty,
        splice: splice,
        isBoolean: isBoolean,
        invert: invert,
        extend: extend,
        now: now,
        map: map,
        result: result,
        isUndefined: isUndefined,
        isFunction: isFunction,
        isObject: isObject,
        isNumber: isNumber,
        isFinite: isFinite,
        isString: isString,
        isBlank: isBlank,
        isNull: isNull,
        isNaN: isNaN,
        eachProxy: eachProxy,
        exports: exports,
        allKeys: allKeys,
        slice: slice,
        parse: parse,
        shift: shift,
        merge: merge,
        fetch: fetch,
        split: split,
        clone: clone,
        bind: bind,
        duff: duff,
        sort: sort,
        join: join,
        wrap: wrap,
        uuid: uuid,
        keys: keys,
        once: once,
        each: each,
        push: push,
        pop: pop,
        has: has,
        negate: negate,
        pI: pI,
        createPredicateIndexFinder: createPredicateIndexFinder,
        findIndex: findIndex,
        findLastIndex: findLastIndex,
        validKey: validKey,
        finder: finder,
        find: find,
        findLast: findLast,
        console: console,
        min: mathArray('min'),
        max: mathArray('max'),
        math: wrap(gapSplit('E LN2 LN10 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos acosh asin asinh atan atan2 atanh cbrt ceil clz32 cos cosh exp expm1 floor fround hypot imul log log1p log2 log10 max min pow random round sign sin sinh sqrt tan tanh trunc'), function (key) {
            return Math[key];
        })
    };
});