var factories = {},
    nativeKeys = OBJECT_CONSTRUCTOR.keys,
    objectToString = OBJECT_CONSTRUCTOR[PROTOTYPE].toString,
    hasEnumBug = !{
        toString: NULL
    }.propertyIsEnumerable(TO_STRING),
    /**
     * @lends _
     */
    noop = function () {},
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
    toString = function (obj) {
        return obj == NULL ? EMPTY_STRING : obj + EMPTY_STRING;
    },
    stringify = function (obj) {
        return (isObject(obj) ? JSON.stringify(obj) : isFunction(obj) ? obj.toString() : obj) + EMPTY_STRING;
    },
    sort = function (obj, fn_, reversed, context) {
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
    splitGen = function (delimiter) {
        return function (list) {
            return isString(list) ? list.split(delimiter) : list;
        };
    },
    isWrap = function (type, fn_) {
        var fn = fn_ || function () {
            return BOOLEAN_TRUE;
        };
        return function (thing) {
            return typeof thing === type && fn(thing);
        };
    },
    _isNaN = function (thing) {
        return thing !== thing;
    },
    notNaN = function (thing) {
        return thing === thing;
    },
    isFunction = isWrap(FUNCTION),
    isBoolean = function (argument) {
        return argument === BOOLEAN_TRUE || argument === BOOLEAN_FALSE;
    },
    isInt = function (num) {
        return isNumber(num) && num === Math.round(num);
    },
    isString = isWrap(STRING),
    isNumber = isWrap(NUMBER, notNaN),
    isObject = isWrap(OBJECT, function (thing) {
        return !!thing;
    }),
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
    _isFinite = function (thing) {
        return isNumber(thing) && isFinite_(thing);
    },
    isWindow = function (obj) {
        return !!(obj && obj === obj[WINDOW]);
    },
    isArray = ARRAY_CONSTRUCTOR.isArray,
    isEmpty = function (obj) {
        return !keys(obj)[LENGTH];
    },
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
    // merge_count = 0,
    merge = function (obj1, obj2, deep) {
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
                            // if (merge_count > 20) {
                            //     debugger;
                            // }
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
        // merge_count--;
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
    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    MAX_ARRAY_INDEX = Math.pow(2, 53) - 1,
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
    // Returns the first index on an array-like that passes a predicate test
    findIndex = createPredicateIndexFinder(1),
    findLastIndex = createPredicateIndexFinder(-1),
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
    },
    each = eachProxy(duff),
    tackRight = function (fn) {
        return function (list, iterator, context) {
            return fn(list, iterator, arguments[LENGTH] < 3 ? NULL : context, -1);
        };
    },
    duffRight = tackRight(duff),
    eachRight = tackRight(each),
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
    factory = function (name, func_) {
        var func = func_ ? func_ : name;
        var extensor = {
            constructor: function () {
                return func.apply(this.super.apply(this, arguments), arguments);
            }
        };
        return this.extend.apply(this, func === func_ ? [name, extensor] : [extensor]);
    },
    constructorWrapper = function (Constructor, parent) {
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
    },
    once = function (fn) {
        var doIt = BOOLEAN_TRUE;
        return function () {
            if (doIt) {
                doIt = BOOLEAN_FALSE;
                return fn.apply(this, arguments);
            }
        };
    },
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
    isEqual = function (a, b) {
        return eq(a, b, [], []);
    },
    // very shallow clone
    clone = function (obj) {
        return map(obj, function (value) {
            return value;
        });
    },
    cloneJSON = function (obj) {
        return parse(stringify(obj));
    },
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
    unique = function (list) {
        return foldl(list, function (memo, item) {
            if (indexOf(memo, item) === -1) {
                memo.push(item);
            }
        }, []);
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
    },
    unwrapBlock = function (string_) {
        var string = string_.toString(),
            split = string.split('{'),
            first = split[0],
            fTrimmed = first && first.trim();
        if (fTrimmed.slice(0, 8) === 'function') {
            string = split.shift();
            return (string = split.join('{')).slice(0, string[LENGTH] - 1);
        }
        return split.join('{');
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
        return isArrayLike(object) ? (isArray(object) ? object.slice(0) : arrayLikeToArray(object)) : (isString(object) ? object.split(isString(delimiter) ? delimiter : COMMA) : [object]);
    },
    nonEnumerableProps = toArray('valueOf,isPrototypeOf,' + TO_STRING + ',propertyIsEnumerable,hasOwnProperty,toLocaleString'),
    flattenArray = function (list, handle, deep) {
        var items = foldl(list, function (memo, item_) {
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
            duff(items, handle);
        }
        return items;
    },
    flatten = function (list, handler_, deep_) {
        return flattenArray(isArrayLike(list) ? list : objectToArray(list), handler_, !!deep_);
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
        return baseClamp(number_, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    },
    isValidInteger = function (number) {
        return number < MAX_INTEGER && number > -MAX_INTEGER;
    },
    clampInteger = function (number) {
        return baseClamp(number, -MAX_INTEGER, MAX_INTEGER);
    },
    floatToInteger = function (value) {
        var remainder = value % 1;
        return value === value ? (remainder ? value - remainder : value) : 0;
    },
    toFinite = function (value) {
        if (!value) {
            return value === 0 ? value : 0;
        }
        value = toNumber(value);
        if (value === INFINITY || value === -INFINITY) {
            var sign = (value < 0 ? -1 : 1);
            return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
    },
    toInteger = function (value) {
        var result = toFinite(value),
            remainder = result % 1;
        return result === result ? (remainder ? result - remainder : result) : 0;
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
        } while (--farDown > 0 && constructor && _isFinite(farDown));
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
            return iteratorFn(key, value, third);
        };
    },
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
    foldl = createReduce(1),
    // The right-associative version of reduce, also known as `foldr`.
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
    consolemaker = function (canTrace) {
        // use same name so that we can ensure browser compatability
        return extend(wrap(toArray('trace,warn,log,dir,error,clear,table,profile,profileEnd,time,timeEnd,timeStamp'), function (key) {
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
    },
    console = consolemaker(),
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
    returnsSelf = returns.self = function () {
        return this;
    },
    returnsTrue = returns.true = returns(BOOLEAN_TRUE),
    returnsFalse = returns.false = returns(BOOLEAN_FALSE),
    returnsNull = returns.null = returns(NULL),
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
    /**
     * @static
     * @namespace _
     */
    _ = app._ = {
        is: is,
        consolemaker: consolemaker,
        blockWrapper: blockWrapper,
        unwrapBlock: unwrapBlock,
        passes: passes,
        performance: performance,
        constructorWrapper: constructorWrapper,
        stringifyQuery: stringifyQuery,
        intendedApi: intendedApi,
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
        isFinite: _isFinite,
        isString: isString,
        isNull: isNull,
        isNaN: _isNaN,
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
        unique: unique,
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
        BIG_INTEGER: BIG_INTEGER,
        NEGATIVE_BIG_INTEGER: NEGATIVE_BIG_INTEGER,
        math: wrap(toArray('E,LN2,LN10,LOG2E,LOG10E,PI,SQRT1_2,SQRT2,abs,acos,acosh,asin,asinh,atan,atan2,atanh,cbrt,ceil,clz32,cos,cosh,exp,expm1,floor,fround,hypot,imul,log,log1p,log2,log10,pow,random,round,sign,sin,sinh,sqrt,tan,tanh,trunc'), function (key) {
            return Math[key];
        })
    };
isBoolean.false = isBoolean.true = BOOLEAN_TRUE;
app.logWrappedErrors = BOOLEAN_TRUE;
/**
 * @class Extendable
 * @private
 */
function Extendable(attributes, options) {
    return this;
}
factories.Extendable = constructorWrapper(Extendable, OBJECT_CONSTRUCTOR);