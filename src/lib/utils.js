var factories = {},
    object = Object,
    fn = Function,
    FunctionConstructor = fn[CONSTRUCTOR],
    array = Array,
    string = String,
    number = Number,
    BRACKET_OBJECT_SPACE = '[object ',
    stringProto = string[PROTOTYPE],
    objectProto = object[PROTOTYPE],
    arrayProto = array[PROTOTYPE],
    funcProto = fn[PROTOTYPE],
    nativeKeys = object.keys,
    hasEnumBug = !{
        toString: NULL
    }.propertyIsEnumerable(TO_STRING),
    MAX_VALUE = number.MAX_VALUE,
    MIN_VALUE = number.MIN_VALUE,
    MAX_SAFE_INTEGER = number.MAX_SAFE_INTEGER,
    MIN_SAFE_INTEGER = number.MIN_SAFE_INTEGER,
    MAX_ARRAY_LENGTH = 4294967295,
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
    push = function (obj, list) {
        return arrayProto.push.apply(obj, list);
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
    binaryIndexOf = function (list, item, minIndex_, maxIndex_) {
        var guess, min = minIndex_ || 0,
            max = maxIndex_ || list[LENGTH] - 1,
            bitwise = (max <= TWO_TO_THE_31) ? BOOLEAN_TRUE : BOOLEAN_FALSE;
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
        return (array && array[LENGTH] > 100 ? binaryIndexOf : indexOf)(array, item, _from, _to, _rtl);
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
        return obj == NULL ? EMPTY_STRING : obj + EMPTY_STRING;
    },
    stringify = function (obj) {
        return (isObject(obj) ? JSON.stringify(obj) : isFunction(obj) ? obj.toString() : obj) + EMPTY_STRING;
    },
    /**
     * @func
     */
    sort = function (obj, fn_) {
        var fn = fn_ || function (a, b) {
            return a > b;
        };
        // normalize sort function handling for safari
        return arrayProto.sort.call(obj, function () {
            var result = fn.apply(this, arguments),
                numericResult = +result;
            if (isNaN(numericResult)) {
                numericResult = 0;
            }
            if (numericResult > 1) {
                numericResult = 1;
            }
            if (result === BOOLEAN_FALSE || numericResult < -1) {
                numericResult = -1;
            }
            return numericResult;
        });
    },
    /**
     * @func
     */
    has = function (obj, prop) {
        var val = BOOLEAN_FALSE;
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
        return instance instanceof constructor;
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
            return isString(list) ? list.split(delimiter) : list;
        };
    },
    /**
     * @func
     */
    joinGen = function (delimiter) {
        return function (arr) {
            return arr.join(delimiter);
        };
    },
    /**
     * @func
     */
    gapJoin = joinGen(SPACE),
    /**
     * @func
     */
    gapSplit = splitGen(SPACE),
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
    isNull = function (thing) {
        return thing === NULL;
    },
    isUndefined = function (thing) {
        return thing === UNDEFINED;
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
    // stringify = toString,
    // stringify = function (obj) {
    //     return (isObject(obj) ? JSON.stringify(obj) : isFunction(obj) ? obj.toString() : obj) + EMPTY_STRING;
    // },
    /**
     * @func
     */
    now = function () {
        return +(new Date());
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
            if (obj2[key] !== UNDEFINED) {
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
    iterates = function (obj, iterator, context) {
        var list = keys(obj),
            iteratee = bind(iterator, context);
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
                context = NULL;
            }
            return fn(list, iterator, context, direction);
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
        return key !== -1 && key === key && key !== UNDEFINED && key !== NULL && key !== BOOLEAN_FALSE && key !== BOOLEAN_TRUE;
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
    bind = function (func) {
        return func.bind.apply(func, splice(arguments, 1));
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
        runner = bind(runner_, context);
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
            child = new FunctionConstructor('var parent=arguments[0];return function ' + name + '(){return parent.apply(this,arguments);}')(passedParent);
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
        var __ = function (one, two, three, four, five, six) {
            if (isInstance(one, Constructor)) {
                return one;
            }
            return new Constructor(one, two, three, four, five, six);
        };
        __.isInstance = Constructor.isInstance = function (instance) {
            return isInstance(instance, Constructor);
        };
        __[CONSTRUCTOR] = Constructor;
        __[EXTEND] = Constructor[EXTEND] = function () {
            return constructorExtend.apply(Constructor, arguments);
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
                return fn.apply(this, arguments);
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
        if (a === NULL || a === UNDEFINED || b === UNDEFINED || b === NULL) {
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
        var areArrays = className === BRACKET_OBJECT_SPACE + 'Array]';
        if (!areArrays) {
            if (!isObject(a) || !isObject(b)) {
                return BOOLEAN_FALSE;
            }
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
    clone = function (obj) {
        return map(obj, function (value, key) {
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
    unshift = function (thing, items) {
        return thing.unshift.apply(thing, items);
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
        var coerced, val = val_;
        if (isString(val)) {
            val = val.trim();
            if ((val[0] === '{' && val[val[LENGTH] - 1] === '}') || (val[0] === '[' && val[val[LENGTH] - 1] === ']')) {
                wraptry(function () {
                    val = JSON.parse(val);
                }, console.error);
            } else {
                if (val === 'true') {
                    val = BOOLEAN_TRUE;
                } else {
                    coerced = +val;
                    if (coerced === coerced) {
                        val = coerced;
                    } else {
                        if (val === 'false') {
                            val = BOOLEAN_FALSE;
                        } else {
                            if (val === 'null') {
                                val = NULL;
                            } else {
                                if (val === 'undefined') {
                                    val = UNDEFINED;
                                } else {
                                    if (val.slice(0, 8) === 'function') {
                                        val = new FunctionConstructor('return ' + val)();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return val;
    },
    evaluate = function (string, context) {
        var parsed = string;
        if (isString(parsed)) {
            if (parsed.slice(0, 8) !== 'function') {
                parsed = new Function[CONSTRUCTOR]('window', 'global', 'root', 'return ' + parsed);
            }
        }
        parsed = new Function[CONSTRUCTOR]('var document,\nconsole,\nwindow=this;\nreturn ' + parsed + '.call(this, this, this, this);');
        return parsed.call(context);
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
        var collection = returnDismorphicBase(objs),
            bound = bind(iteratee, context);
        return !objs ? collection : each(objs, function (item, index) {
            collection[index] = bound(item, index, objs);
        }) && collection;
    },
    arrayLikeToArray = function (arrayLike) {
        return Array.apply(NULL, arrayLike);
    },
    objectToArray = function (obj) {
        return !obj ? [] : foldl(obj, function (memo, item) {
            memo.push(item);
            return memo;
        }, []);
    },
    toArray = function (obj, delimiter) {
        return isArrayLike(obj) ? isArray(obj) ? obj : arrayLikeToArray(obj) : (isString(obj) ? obj.split(isString(delimiter) ? delimiter : EMPTY_STRING) : objectToArray(obj));
    },
    flattenArray = function (list, deep_) {
        var deep = !!deep_;
        return foldl(list, function (memo, item_) {
            var item;
            if (isArrayLike(item_)) {
                item = deep ? flattenArray.call(NULL, item_, deep) : item_;
                return memo.concat(item);
            } else {
                memo.push(item_);
                return memo;
            }
        }, []);
    },
    flatten = function (list, deep) {
        return flattenArray(isArrayLike(list) ? list : objectToArray(list), deep);
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
                if (val !== UNDEFINED) {
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
        var fn = ctx ? bind(fn_, ctx) : fn_,
            obj = isObject(key) ? key : BOOLEAN_FALSE;
        if (obj) {
            each(obj, reverseParams(fn));
        } else {
            fn(key, value);
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
    reference = function (str) {
        var match;
        if (!isString(str)) {
            str = str.referrer;
        }
        match = str.match(/^https?:\/\/.*?\//);
        if (match) {
            match = match[0];
        }
        return match || EMPTY_STRING;
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
    result = function (obj, str, arg, knows) {
        return isObject(obj) ? (knows || isFunction(obj[str]) ? obj[str](arg) : obj[str]) : obj;
    },
    maths = Math,
    mathArray = function (method) {
        return function (args) {
            return maths[method].apply(maths, args);
        };
    },
    ensureFunction = function (fn) {
        return function (_fn) {
            _fn = _fn || noop;
            return fn.call(this, _fn);
        };
    },
    matchesOneToOne = function (key, value) {
        this[key] = value;
    },
    wipeKey = function (key) {
        this[key] = UNDEFINED;
    },
    /**
     * @func
     */
    // Create a reducing function iterating left or right.
    createReduce = function (dir) {
        // Optimized iterator function as using arguments[LENGTH]
        // in the main function will deoptimize the, see #1991.
        var iterator = function (obj, iteratee, memo, keys, index, length) {
            var currentKey;
            for (; index >= 0 && index < length; index += dir) {
                currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        };
        return function (obj, iteratee, memo, context) {
            // iteratee = optimizeCb(iteratee, context, 4);
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
    console = extend(wrap(gapSplit('trace log dir error'), function (key) {
        var method = _console[key] || _log;
        return function () {
            return method.apply(_console, arguments);
        };
    }), {
        exception: function (options) {
            throw new Error(options && options.message || options);
        },
        validate: function (boolean_, options) {
            if (boolean_) {
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
            returnValue = errthat ? errthat(e) : returnValue;
        } finally {
            returnValue = finalfunction ? finalfunction(err) : returnValue;
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
    flow = function (bool, list_) {
        var list = bool === BOOLEAN_TRUE ? list_ : arguments,
            length = list[LENGTH];
        return function () {
            var start = 1,
                args = arguments,
                arg = list[0].apply(this, args);
            while (start < length) {
                arg = list[start].call(this, arg);
                ++start;
            }
            return arg;
        };
    },
    _ = app._ = {
        months: gapSplit('january feburary march april may june july august september october november december'),
        weekdays: gapSplit('sunday monday tuesday wednesday thursday friday saturday'),
        constructorWrapper: constructorWrapper,
        stringifyQuery: stringifyQuery,
        intendedObject: intendedObject,
        intendedIteration: intendedIteration,
        ensureFunction: ensureFunction,
        parseDecimal: parseDecimal,
        flatten: flatten,
        reference: reference,
        isArrayLike: isArrayLike,
        isInstance: isInstance,
        hasEnumBug: hasEnumBug,
        roundFloat: roundFloat,
        factories: factories,
        listSlice: listSlice,
        fullClone: fullClone,
        toBoolean: toBoolean,
        stringify: stringify,
        splitGen: splitGen,
        gapSplit: gapSplit,
        // uniqueId: uniqueId,
        wraptry: wraptry,
        toString: toString,
        throttle: throttle,
        debounce: debounce,
        protoProperty: protoProperty,
        protoProp: protoProperty,
        reverse: reverse,
        binaryIndexOf: binaryIndexOf,
        indexOfNaN: indexOfNaN,
        toInteger: toInteger,
        indexOf: indexOf,
        joinGen: joinGen,
        toArray: toArray,
        isEqual: isEqual,
        unshift: unshift,
        gapJoin: gapJoin,
        isArray: isArray,
        isEmpty: isEmpty,
        splice: splice,
        returns: returns,
        isBoolean: isBoolean,
        invert: invert,
        extend: extend,
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
        isBlank: isBlank,
        isNull: isNull,
        isNaN: isNaN,
        eachProxy: eachProxy,
        exports: exports,
        allKeys: allKeys,
        evaluate: evaluate,
        slice: slice,
        parse: parse,
        shift: shift,
        merge: merge,
        fetch: fetch,
        split: split,
        clone: clone,
        bind: bind,
        duff: duff,
        duffRight: duffRight,
        eachRight: eachRight,
        iterates: iterates,
        sort: sort,
        join: join,
        wrap: wrap,
        uuid: uuid,
        keys: keys,
        once: once,
        each: each,
        push: push,
        flow: flow,
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
        arrayLikeToArray: arrayLikeToArray,
        objectToArray: objectToArray,
        math: wrap(gapSplit('E LN2 LN10 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos acosh asin asinh atan atan2 atanh cbrt ceil clz32 cos cosh exp expm1 floor fround hypot imul log log1p log2 log10 pow random round sign sin sinh sqrt tan tanh trunc'), function (key) {
            return Math[key];
        })
    };
/**
 * @class Model
 */
function Model(attributes, options) {
    return this;
}
Model[PROTOTYPE] = {
    evaluate: function (handler) {
        return evaluate(handler, this);
    }
};
factories.Model = constructorWrapper(Model);
window._ = _;