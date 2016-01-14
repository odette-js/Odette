application.scope('dev', function (app) {
    var blank, _, object = Object,
        extendFrom = {},
        factories = {},
        fn = Function,
        array = Array,
        string = String,
        toStringString = 'toString',
        PROTOTYPE_STRING = 'prototype',
        constructorString = 'constructor',
        lengthString = 'length',
        CONSTRUCTOR_ID = '__constructorId',
        CONSTRUCTOR_KEY = '__constructor__',
        stringProto = string[PROTOTYPE_STRING],
        objectProto = object[PROTOTYPE_STRING],
        arrayProto = array[PROTOTYPE_STRING],
        // shiftArray = arrayProto.shift,
        funcProto = fn[PROTOTYPE_STRING],
        nativeKeys = object.keys,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        hasEnumBug = !{
            toString: null
        }.propertyIsEnumerable(toStringString),
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
        isNegative1 = function (num) {
            return (num === -1);
        },
        /**
         * @func
         */
        listHas = function (list, item) {
            return (!isNegative1(indexOf(list, item)));
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
        indexOfNaN = function (array, fromIndex, fromRight) {
            var length = array[lengthString],
                index = fromIndex + (fromRight ? 0 : -1);
            while ((fromRight ? index-- : ++index < length)) {
                var other = array[index];
                if (other !== other) {
                    return index;
                }
            }
            return -1;
        },
        indexOf = function (array, value, fromIndex) {
            if (value !== value) {
                return indexOfNaN(array, fromIndex);
            }
            if (array) {
                var index = (fromIndex || 0) - 1,
                    length = array[lengthString];
                while (++index < length) {
                    if (array[index] === value) {
                        return index;
                    }
                }
            }
            return -1;
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
            return (obj === null || obj === blank) ? '' : (obj + '');
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
        nativeIsInstance = function (instance, constructor) {
            var result = BOOLEAN_FALSE;
            if (constructor) {
                return instance instanceof constructor;
            }
        },
        isInstance = function (instance, constructor_) {
            var result = BOOLEAN_FALSE,
                constructor = constructor_;
            while (has(constructor, 'constructor')) {
                constructor = constructor.constructor;
            }
            if (constructor && constructor[CONSTRUCTOR_ID] && instance && instance[CONSTRUCTOR_ID]) {
                result = constructor[CONSTRUCTOR_ID] === instance[CONSTRUCTOR_ID];
            } else {
                result = nativeIsInstance(instance, constructor);
            }
            return result;
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
        isFunction = isWrap('function'),
        /**
         * @func
         */
        isBoolean = isWrap('boolean'),
        /**
         * @func
         */
        isString = isWrap('string'),
        /**
         * @func
         */
        // isBlank = isWrap('undefined', function (thing) {
        //     return thing === null;
        // }),
        isNull = function (thing) {
            return thing === null;
        },
        isBlank = function (thing) {
            return thing === void 0 || isNull(thing);
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
        isFinite_ = window.isFinite,
        isFinite = function (thing) {
            return isNumber(thing) && isFinite_(thing);
        },
        /**
         * @func
         */
        isObject = isWrap('object', function (thing) {
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
            return !keys(obj)[lengthString];
        },
        nonEnumerableProps = gapSplit('valueOf isPrototypeOf ' + toStringString + ' propertyIsEnumerable hasOwnProperty toLocaleString'),
        /**
         * @func
         */
        invert = function (obj) {
            var i = 0,
                result = {},
                objKeys = keys(obj),
                length = getLength(objKeys);
            for (; i < length; i++) {
                result[obj[objKeys[i]]] = objKeys[i];
            }
            return result;
        },
        /**
         * @func
         */
        collectNonEnumProps = function (obj, keys) {
            var nonEnumIdx = nonEnumerableProps[lengthString];
            var constructor = obj.constructor;
            var proto = (isFunction(constructor) && constructor.prototype) || ObjProto;
            // Constructor is a special case.
            var prop = 'constructor';
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
        nowish = function () {
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
            var deep, source, keys, length, l, key, args = toArray(arguments),
                base = args.shift(),
                index = 0,
                i = 0;
            if (base === BOOLEAN_TRUE) {
                deep = base;
                base = args.shift();
            }
            base = base || {};
            length = getLength(args);
            if (length) {
                for (; index < length; index++) {
                    merge(base, args[index], deep);
                }
            }
            return base;
        },
        merge = function (obj1, obj2, deep) {
            var key, val, attach, i = 0,
                keys = allKeys(obj2),
                l = getLength(keys);
            for (; i < l; i++) {
                key = keys[i];
                // ignore undefined
                if (obj2[key] !== blank) {
                    attach = BOOLEAN_FALSE;
                    val = obj2[key];
                    if (deep) {
                        if (isObject(obj1[key]) && isObject(obj2[key])) {
                            merge(obj1[key], obj2[key], deep);
                            attach = BOOLEAN_FALSE;
                        } else {
                            attach = BOOLEAN_TRUE;
                        }
                    } else {
                        attach = BOOLEAN_TRUE;
                    }
                    if (attach) {
                        obj1[key] = val;
                    }
                }
            }
            return obj1;
        },
        /**
         * @func
         */
        property = function (key) {
            return function (obj) {
                return obj === blank ? blank : obj[key];
            };
        },
        // Helper for collection methods to determine whether a collection
        // should be iterated as an array or as an object
        // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
        // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
        MAX_ARRAY_INDEX = Math.pow(2, 53) - 1,
        getLength = property('length'),
        /**
         * @func
         */
        isArrayLike = function (collection) {
            var length = !!collection && getLength(collection);
            return isArray(collection) || (isNumber(length) && !isString(collection) && length >= 0 && length <= MAX_ARRAY_INDEX && !isFunction(collection));
        },
        /**
         * @func
         */
        // each = function (obj, iteratee, context, direction) {
        //     var length, objKeys, i = 0,
        //         args = [obj, iteratee, context, direction];
        //     if (obj) {
        //         if (!isArrayLike(obj)) {
        //             args[0] = objKeys = keys(obj);
        //             length = getLength(objKeys);
        //             iteratee = bind(iteratee, context);
        //             args[2] = null;
        //             args[1] = function (idx, key, all) {
        //                 // gives you the key, use that to get the value
        //                 return iteratee(obj[key], key, obj);
        //             };
        //         }
        //         duff.apply(this, args);
        //     }
        //     return obj;
        // },
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
                        iteratee = bindTo(iterator, context);
                        context = null;
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
                var length = getLength(array),
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
            return key !== -1 && key !== blank && key !== null && key !== BOOLEAN_FALSE && key !== BOOLEAN_TRUE;
        },
        finder = function (findHelper) {
            return function (obj, predicate, context) {
                var key = findHelper(obj, predicate, context);
                if (validKey(key)) {
                    return obj[key];
                }
            };
        },
        find = finder(findIndex),
        findLast = finder(findLastIndex),
        bind = function (fn, ctx) {
            return fn.bind(ctx);
        },
        bindTo = function (fn, ctx) {
            if (ctx && isObject(ctx)) {
                fn = bind(fn, ctx);
            }
            return fn;
        },
        duff = function (values, process, context, direction) {
            var iterations, val, i, leftover, deltaFn;
            if (values && isFunction(process)) {
                i = 0;
                val = values[lengthString];
                leftover = val % 8;
                iterations = Math.floor(val / 8);
                deltaFn = function () {
                    i += direction;
                };
                if (direction < 0) {
                    i = val - 1;
                }
                direction = direction || 1;
                process = bindTo(process, context);
                if (leftover > 0) {
                    do {
                        deltaFn(process(values[i], i, values));
                    } while (--leftover > 0);
                }
                if (iterations) {
                    do {
                        deltaFn(process(values[i], i, values));
                        deltaFn(process(values[i], i, values));
                        deltaFn(process(values[i], i, values));
                        deltaFn(process(values[i], i, values));
                        deltaFn(process(values[i], i, values));
                        deltaFn(process(values[i], i, values));
                        deltaFn(process(values[i], i, values));
                        deltaFn(process(values[i], i, values));
                    } while (--iterations > 0);
                }
            }
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
        // math = Math,
        // mathMix = function (method) {
        //     return function (arr) {
        //         return math[method].apply(math, arr);
        //     };
        // },
        // random = function () {
        //     return math.random();
        // },
        // mathMixCaller = function (method) {
        //     return function (num) {
        //         math[method](num);
        //     };
        // },
        // mathMixComparer = function (method) {
        //     return function (num, num2) {
        //         math[method](num, num2);
        //     };
        // },
        // min = mathMix('min'),
        // max = mathMix('max'),
        // abs = mathMixCaller('abs'),
        // acos = mathMixCaller('acos'),
        // asin = mathMixCaller('asin'),
        // atan = mathMixCaller('atan'),
        // ceil = mathMixCaller('ceil'),
        // cos = mathMixCaller('cos'),
        // exp = mathMixCaller('exp'),
        // floor = mathMixCaller('floor'),
        // log = mathMixCaller('log'),
        // round = mathMixCaller('round'),
        // sin = mathMixCaller('sin'),
        // sqrt = mathMixCaller('sqrt'),
        // tan = mathMixCaller('tan'),
        /**
         * @func
         */
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
            var constructorId, nameString, child, passedParent, hasConstructor, constructor, parent = this,
                nameIsStr = isString(name);
            if (!nameIsStr) {
                protoProps = name;
            }
            hasConstructor = has(protoProps, constructorString);
            if (protoProps && hasConstructor) {
                child = protoProps[constructorString];
            }
            if (nameIsStr) {
                // nameString = name;
                passedParent = parent;
                if (child) {
                    passedParent = child;
                }
                child = new Function.constructor('var parent=arguments[0];return function ' + name + '(){return parent.apply(this,arguments);}')(passedParent);
                factories[name] = child;
            } else {
                child = function () {
                    return parent.apply(this, arguments);
                };
            }
            extend(child, parent);
            constructorId = uniqueId('con');
            child[CONSTRUCTOR_ID] = constructorId;
            child.extend = (this[CONSTRUCTOR_KEY] && this[CONSTRUCTOR_KEY].extend) || constructorExtend;
            var Surrogate = function () {
                this[constructorString] = child;
            };
            Surrogate[PROTOTYPE_STRING] = parent[PROTOTYPE_STRING];
            child[PROTOTYPE_STRING] = new Surrogate;
            if (protoProps) {
                extend(child[PROTOTYPE_STRING], protoProps);
            }
            constructor = child;
            child = constructorWrapper(constructor);
            if (!isFunction(protoProps.Model) || !has(protoProps, 'Model')) {
                constructor[PROTOTYPE_STRING].Model = child;
            }
            // child.constructor = constructor;
            child.__super__ = parent[PROTOTYPE_STRING];
            constructor[CONSTRUCTOR_ID] = constructorId;
            constructor[PROTOTYPE_STRING][CONSTRUCTOR_KEY] = child;
            if (nameIsStr) {
                makeExtendFrom(name, constructor);
                // this is good when _ / utils object is your global app object
                if (attach) {
                    _[name] = child;
                }
            }
            return constructor;
        },
        constructorWrapper = function (Ch) {
            var __ = function (attributes, options) {
                if (isInstance(attributes, Ch)) {
                    return attributes;
                }
                return new Ch(attributes, options);
            };
            __.constructor = Ch;
            return __;
        },
        /**
         * @func
         */
        makeExtendFrom = function (name, child) {
            extendFrom[name] = function () {
                return child.extend.apply(child, arguments);
            };
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
        // camelCase = (function () {
        //     var cached = {};
        //     return function (str, splitter) {
        //         var i, s, val;
        //         if (splitter === undefined) {
        //             splitter = '-';
        //         }
        //         if (!cached[splitter]) {
        //             cached[splitter] = {};
        //         }
        //         val = cached[splitter][str];
        //         if (!val && isString(str)) {
        //             if (str[0] === '-') {
        //                 str = slice(str, 1);
        //             }
        //             s = split(str, splitter);
        //             for (i = getLength(s) - 1; i >= 1; i--) {
        //                 if (s[i]) {
        //                     s[i] = upCase(s[i]);
        //                 }
        //             }
        //             val = join(s, '');
        //         }
        //         cached[splitter][str] = val;
        //         cached[splitter][val] = val;
        //         return val;
        //     };
        // }()),
        /**
         * @func
         */
        // upCase = function (s) {
        //     return s[0].toUpperCase() + slice(s, 1);
        // },
        // cacheable = function (fn) {
        //     var cache = {};
        //     return function (input) {
        //         if (!has(cache, input)) {
        //             cache[input] = fn.apply(this, arguments);
        //         }
        //         return cache[input];
        //     };
        // },
        // categoricallyCacheable = function (fn) {
        //     return function () {};
        // },
        /**
         * @func
         */
        // unCamelCase = (function () {
        //     var cached = {};
        //     return function (str, splitter) {
        //         var val;
        //         if (!splitter) {
        //             splitter = '-';
        //         }
        //         if (!cached[splitter]) {
        //             cached[splitter] = {};
        //         }
        //         val = cached[splitter][str];
        //         if (!val) {
        //             if (str) {
        //                 val = str.replace(/([a-z])([A-Z])/g, '$1' + splitter + '$2').replace(/[A-Z]/g, function (s) {
        //                     return s.toLowerCase();
        //                 });
        //             }
        //         }
        //         cached[splitter][str] = val;
        //         cached[splitter][val] = val;
        //         return val;
        //     };
        // }()),
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
            // A strict comparison is necessary because `null == undefined`.
            if (a === null || a === blank || b === blank || b === null) {
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
            case '[object RegExp]':
                // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
            }
            var areArrays = className === '[object Array]';
            if (!areArrays) {
                if (typeof a != 'object' || typeof b != 'object') return BOOLEAN_FALSE;
                // Objects with different constructors are not equivalent, but `Object`s or `Array`s
                // from different frames are.
                var aCtor = a.constructor,
                    bCtor = b.constructor;
                if (aCtor !== bCtor && !(isFunction(aCtor) && nativeIsInstance(aCtor, aCtor) && isFunction(bCtor) && nativeIsInstance(bCtor, bCtor)) && ('constructor' in a && 'constructor' in b)) {
                    return BOOLEAN_FALSE;
                }
            }
            // Assume equality for cyclic structures. The algorithm for detecting cyclic
            // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
            // Initializing stack of traversed objects.
            // It's done here since we only need them for objects and arrays comparison.
            // aStack = aStack || [];
            // bStack = bStack || [];
            var length = aStack[lengthString];
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
                length = a[lengthString];
                if (length !== b[lengthString]) {
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
                length = objKeys[lengthString];
                // Ensure that both objects contain the same number of properties before comparing deep equality.
                if (keys(b)[lengthString] !== length) return BOOLEAN_FALSE;
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
        mix = function () {},
        // cachable = function (fn) {
        //     var cache = {};
        //     return function () {
        //         var key = JSON.stringify(arguments);
        //         if (!cache[key]) {
        //             cache[key] = JSON.stringify(fn.apply(this, arguments));
        //         }
        //         return JSON.parse(cache[key]);
        //     };
        // },
        /**
         * @func
         */
        Image = window.Image,
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
        /**
         * @func
         */
        // returnBuild = function (obj, array, def) {
        //     var attach, last, depth = obj;
        //     duff(gapSplit(array), function (key, idx) {
        //         last = key;
        //         if (!isObject(depth[key])) {
        //             if (def[idx] === blank) {
        //                 depth[key] = {};
        //             } else {
        //                 depth[key] = def[idx];
        //             }
        //             attach = 1;
        //         }
        //         depth = depth[key];
        //     });
        //     return depth;
        // },
        log = function (type, args) {
            if (!_.isFunction(console[type])) {
                type = 'log';
            }
            console[type].apply(console, args);
        },
        /**
         * @func
         */
        parse = function (val_) {
            var val = val_;
            if (isString(val)) {
                val = val.trim();
                if (val[0] === '{' || val[0] === '[') {
                    try {
                        val = JSON.parse(val);
                    } catch (e) {
                        log('error', ['could not parse', val]);
                    }
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
                        timeout = null;
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
            var bound = bindTo(iteratee, context);
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
                    _nowish = nowish(),
                    args = arguments;
                if (last && _nowish < last + threshold) {
                    // hold on to it
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function () {
                        last = _nowish;
                        fn.apply(context, args);
                    }, threshold);
                } else {
                    last = _nowish;
                    fn.apply(context, args);
                }
            };
        },
        /**
         * @func
         */
        pngString = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=";
        },
        /**
         * @func
         */
        // this should really be it's own factory
        stringifyQuery = function (obj) {
            var val, n, base = obj.url,
                query = [];
            if (isObject(obj)) {
                for (n in obj.query) {
                    val = obj.query[n];
                    if (val !== blank) {
                        val = encodeURIComponent(_.stringify(val));
                        query.push(n + '=' + val);
                    }
                }
                if (query[lengthString]) {
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
            var val, proto, constructor = instance.constructor;
            farDown = farDown || 1;
            do {
                proto = constructor.prototype;
                val = proto[key];
                constructor = proto.constructor;
            } while (--farDown > 0 && constructor && isFinite(farDown));
            return val;
        },
        /**
         * @func
         */
        makeId = (function () {
            var global = -1,
                cache = {};
            return function (prefix) {
                var prefixStr, retVal;
                if (!prefix) {
                    prefixStr = '';
                }
                if (prefix) {
                    prefixStr = prefix.toString();
                }
                if (cache[prefixStr] === blank) {
                    cache[prefixStr] = -1;
                }
                cache[prefixStr]++;
                global++;
                retVal = prefix + cache[prefixStr];
                if (!prefix) {
                    retVal = global;
                    if (prefix === '') {
                        retVal = '' + global;
                    }
                }
                return retVal;
            };
        }()),
        /**
         * @func
         */
        uuid = function () {
            var blank, cryptoCheck = 'crypto' in window && 'getRandomValues' in crypto,
                sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var rnd, r, v;
                    if (cryptoCheck) {
                        rnd = window.crypto.getRandomValues(new Uint32Array(1));
                        if (rnd === blank) {
                            cryptoCheck = false;
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
        intendedObject = function (key, value, fn_, ctx) {
            var fn = fn_,
                obj = isObject(key) ? key : BOOLEAN_FALSE;
            if (obj) {
                each(obj, reverseParams(fn), ctx);
            } else {
                if (ctx) {
                    fn = bindTo(fn, ctx);
                }
                fn(key, value);
            }
        },
        /**
         * @func
         */
        /** wrapper for advisibility to be calculated by outside framework */
        adVisibility = function (adObj) {
            adObj.set(app.modules.visibility(adObj.el));
        },
        /**
         * @func
         */
        getReference = function (str) {
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
        /**
         * @func
         */
        cssTemplater = function (str, obj) {
            str += '';
            each(obj, function (key, val) {
                str = str.split('\\\\' + key + '\\\\').join(val);
            });
            return str;
        },
        png = pngString,
        /**
         * @func
         */
        simpleObject = function (key, value) {
            var obj = {};
            obj[key] = value;
            return obj;
        },
        objCondense = function () {
            var skip = 0,
                obj = {};
            duff(arguments, function (arg, idx, args) {
                if (!skip) {
                    skip++;
                    if (isString(arg)) {
                        skip++;
                        obj[arg] = args[idx + 1];
                    }
                    if (isObject(arg)) {
                        extend(obj, arg);
                    }
                }
                skip--;
            });
            return obj;
        },
        reverseParams = function (iteratorFn) {
            return function (value, key, third) {
                iteratorFn(key, value, third);
            };
        },
        /**
         * @func
         */
        rip = function (list, ripped) {
            var obj = {};
            duff(gapSplit(list), function (val, key) {
                obj[val] = ripped[val];
            });
            return obj;
        },
        result = function (obj, str, args) {
            var rez = obj;
            if (isObject(obj)) {
                rez = obj[str];
                if (isFunction(rez)) {
                    rez = obj[str].apply(obj, args || []);
                }
            }
            return rez;
        },
        resultOf = function (item, ctx, arg) {
            return isFunction(item) ? item.call(ctx, arg) : item;
        },
        maths = Math,
        mathArray = function (method) {
            return function (args) {
                return maths[method].apply(maths, args);
            };
        },
        mathMix = function (key) {
            var doIt = function (x, mult) {
                var ret;
                if (isArrayLike(x)) {
                    ret = Math[key].apply(Math, x);
                } else {
                    ret = Math[key](x * mult);
                    ret = ret / mult;
                }
                return ret;
            };
            return function (thing, mult) {
                if (!isNumber(mult)) {
                    mult = 1;
                }
                if (isNumber(thing) || isString(thing)) {
                    return doIt(thing, mult);
                } else {
                    return duff(thing, function (val, key, obj) {
                        obj[key] = doIt(val, mult);
                    });
                }
            };
        },
        floor = mathMix('floor'),
        ceil = mathMix('ceil'),
        ensureFunction = function (fn) {
            return function (_fn) {
                _fn = _fn || function () {};
                return fn.call(this, _fn);
            };
        };
    // cssResetString = 'a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{margin:0;padding:0;border:0;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}'
    /**
     * @class Model
     */
    function Model(attributes, secondary) {
        return this;
    }
    factories.Model = Model;
    Model.prototype = {};
    makeExtendFrom('Model', factories.Model);
    Model.extend = constructorExtend;
    _ = app._ = {
        noop: function () {},
        monthNames: gapSplit('january feburary march april may june july august september october november december'),
        possibleEvents: gapSplit('context timings impression impression_image delivered_impression viewable_impression asset_impression goal timer expanded_time auto_expand auto_contract auto_close auto_video_play auto_video_stop counter'),
        possibleInteractions: gapSplit('click hover_count hover_time expand contract close open_panel exit video_play video_stop'),
        weekdays: gapSplit('sunday monday tuesday wednesday thursday friday saturday'),
        ignoreAssetTags: gapSplit('script link style meta title head'),
        constructorWrapper: constructorWrapper,
        stringifyQuery: stringifyQuery,
        intendedObject: intendedObject,
        ensureFunction: ensureFunction,
        objectCondense: objCondense,
        parseDecimal: parseDecimal,
        adVisibility: adVisibility,
        getReference: getReference,
        cssTemplater: cssTemplater,
        simpleObject: simpleObject,
        isArrayLike: isArrayLike,
        objCondense: objCondense,
        isInstance: isInstance,
        hasEnumBug: hasEnumBug,
        roundFloat: roundFloat,
        extendFrom: extendFrom,
        factories: factories,
        listSlice: listSlice,
        fullClone: fullClone,
        pngString: pngString,
        parseBool: parseBool,
        stringify: stringify,
        getLen: getLength,
        splitGen: splitGen,
        gapSplit: gapSplit,
        uniqueId: uniqueId,
        property: property,
        toString: toString,
        throttle: throttle,
        debounce: debounce,
        protoProp: protoProp,
        reverse: reverse,
        indexOf: indexOf,
        joinGen: joinGen,
        toArray: toArray,
        isEqual: isEqual,
        unshift: unshift,
        gapJoin: gapJoin,
        isArray: isArray,
        isEmpty: isEmpty,
        modules: {},
        listHas: listHas,
        isBlank: isBlank,
        isUndefined: isBlank,
        splice: splice,
        isBoolean: isBoolean,
        invert: invert,
        extend: extend,
        makeId: makeId,
        nowish: nowish,
        now: nowish,
        map: map,
        result: result,
        isNull: isNull,
        merge: merge,
        fetch: fetch,
        split: split,
        clone: clone,
        isObject: isObject,
        isNaN: isNaN,
        isNumber: isNumber,
        isFinite: isFinite,
        isString: isString,
        parse: parse,
        shift: shift,
        eachProxy: eachProxy,
        exports: exports,
        slice: slice,
        bind: bind,
        bindTo: bindTo,
        duff: duff,
        sort: sort,
        join: join,
        wrap: wrap,
        isFunction: isFunction,
        uuid: uuid,
        allKeys: allKeys,
        keys: keys,
        once: once,
        each: each,
        push: push,
        pop: pop,
        len: getLength,
        has: has,
        rip: rip,
        png: png,
        negate: negate,
        pI: pI,
        math: {},
        resultOf: resultOf,
        createPredicateIndexFinder: createPredicateIndexFinder,
        findIndex: findIndex,
        findLastIndex: findLastIndex,
        validKey: validKey,
        finder: finder,
        find: find,
        findLast: findLast
    };
    duff(gapSplit('E LN2 LN10 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos acosh asin asinh atan atan2 atanh cbrt ceil clz32 cos cosh exp expm1 floor fround hypot imul log log1p log2 log10 max min pow random round sign sin sinh sqrt tan tanh trunc'), function (key) {
        _[key] = _.math[key] = Math[key];
    });
    exports({
        floor: floor,
        ceil: ceil,
        min: mathArray('min'),
        max: mathArray('max')
    });
});