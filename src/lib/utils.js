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
        return eachProxy(function (array, predicate, context, index_) {
            var length = array[LENGTH],
                callback = bindTo(predicate, context),
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
    constructorExtend = function (name, protoProps, attach) {
        var nameString, child, passedParent, hasConstructor, constructor, parent = this,
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
        if (className !== objectToString.call(b)) return BOOLEAN_FALSE;
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
        var coerced, val = val_;
        if (!isString(val)) {
            return val;
        }
        val = val.trim();
        if (!val[LENGTH]) {
            return val;
        }
        if ((val[0] === '{' && val[val[LENGTH] - 1] === '}') || (val[0] === '[' && val[val[LENGTH] - 1] === ']')) {
            return wraptry(function () {
                return JSON.parse(val);
            });
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
        return isArrayLike(obj) ? [] : {};
    },
    map = function (objs, iteratee, context) {
        var collection = returnBaseType(objs),
            bound = bindTo(iteratee, context);
        return !objs ? collection : each(objs, function (item, index) {
            collection[index] = bound(item, index, objs);
        }) && collection;
    },
    arrayLikeToArray = function (arrayLike) {
        if (arrayLike[LENGTH] === 1) {
            return [arrayLike[0]];
        } else {
            return ARRAY_CONSTRUCTOR.apply(NULL, arrayLike);
        }
    },
    objectToArray = function (obj) {
        return !obj ? [] : foldl(obj, function (memo, item) {
            memo.push(item);
            return memo;
        }, []);
    },
    toArray = function (object, delimiter) {
        return isArrayLike(object) ? isArray(object) ? object : arrayLikeToArray(object) : (isString(object) ? object.split(isString(delimiter) ? delimiter : COMMA) : [object]);
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
            fn();
        });
    },
    eachCallTry = function (array, method, arg, catcher, finallyer) {
        return duff(array, function (item) {
            wraptry(function () {
                result(item, method, arg);
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
            return method.apply(_console, arguments);
        };
    }), {
        exception: function (options) {
            throw new Error(options && options.message || options);
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
            console.error(e);
            returnValue = errthat ? errthat(e) : returnValue;
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
    returnsTrue = returns(BOOLEAN_TRUE),
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
        finder: finder,
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
/**
 * @class Extendable
 */
function Extendable(attributes, options) {
    return this;
}
factories.Extendable = constructorWrapper(Extendable, OBJECT_CONSTRUCTOR);