
(function (win, where) {
    'use strict';
    function Application(name, parent) {
        this.version = name;
        this.scoped = true;
        this.global = false;
        return this;
    }
    var makeParody = function (parent, fn) {
        return function () {
            return fn.apply(parent, arguments);
        };
    };
    Application.prototype.extend = function (obj) {
        var n, app = this;
        for (n in obj) {
            if (obj.hasOwnProperty(n)) {
                app[n] = obj[n];
            }
        }
        return app;
    };
    Application.prototype.parody = function (list) {
        var i = 0,
            extendor = {},
            parent = this.parent;
        for (; i < list[lengthString]; i++) {
            extendor[list[i]] = makeParody(parent, parent[list[i]]);
        }
        this.extend(extendor);
        return this;
    };
    var topmostDoc, makeScriptString = 'makeScript',
        lengthString = 'length',
        application = win[where] = win[where] || {
        versions: {},
        versionOrder: [],
        global: true,
        scoped: false,
        registerVersion: function (name) {
            var application = this,
                cachedOrCreated = application.versions[name],
                newApp = application.versions[name] = cachedOrCreated || new Application(name, application);
            newApp.parent = application;
            application.upsetDefaultVersion(name);
            if (!cachedOrCreated) {
                application.versionOrder.push(name);
            }
            return newApp;
        },
        upsetDefaultVersion: function (version) {
            var application = this;
            if (application.defaultVersion) {
                // keyword version only works the first time then it's set for the lifespan
                if (+application.defaultVersion === +application.defaultVersion) {
                    // keyword version overwrites default (dev / hotfix)
                    if (+version !== +version) {
                        application.defaultVersion = version;
                    }
                }
            } else {
                application.defaultVersion = version;
            }
        },
        unRegisterVersion: function (name) {
            var application = this,
                saved = application.versions[name],
                orderIdx = application.versionOrder.indexOf(name);
            if (orderIdx !== -1) {
                application.versionOrder.splice(orderIdx, 1);
            }
            saved.parent = void 0;
            application.versions[name] = void 0;
            return saved;
        },
        scope: function (name_, fn_) {
            var ret, app = this,
                hash = app.versions,
                name = fn_ ? name_ : app.defaultVersion,
                fn = fn_ ? fn_ : name_;
            if (typeof name_ === 'string') {
                app.currentVersion = name_;
            }
            app.registerVersion(name);
            ret = typeof fn === 'function' && fn(hash[name]);
            return hash[name];
        },
        map: function (arra, fn, ctx) {
            var i = 0,
                len = arra[lengthString],
                arr = [];
            while (len > i) {
                arr[i] = fn.call(ctx, i, arra[i], arra);
                i++;
            }
            return arr;
        },
        registerScopedMethod: function (name, expects_) {
            var application = this,
                expects = expects_ || 3,
                method = application[name] = application[name] || function () {
                    var version, i = 1,
                        args = arguments,
                        args_ = args,
                        argLen = args[lengthString];
                    // expects is equivalent to what it would be if the version was passed in
                    if (argLen < expects) {
                        version = application.defaultVersion;
                    } else {
                        args_ = [];
                        version = args[1];
                        for (; i < args[lengthString]; i++) {
                            args_.push(args[i]);
                        }
                    }
                    application.applyTo(version, name, args_);
                };
            return application;
        },
        get: function (version) {
            return this.versions[version];
        },
        applyTo: function (which, method, args) {
            var application = this,
                app = application.get(which);
            if (app) {
                return app[method].apply(app, args);
            }
        },
        getCurrentScript: function (d) {
            var allScripts = (d || doc).scripts,
                currentScript = d.currentScript,
                lastScript = allScripts[allScripts[lengthString] - 1];
            return currentScript || lastScript;
        },
        loadScript: function (url, callback, docu_) {
            var scriptTag, application = this,
                // allow top doc to be overwritten
                docu = docu_ || topmostDoc || doc;
            scriptTag = application[makeScriptString](url, callback);
            docu.head.appendChild(scriptTag);
            return application;
        },
        makeScript: function (src, onload, docu_) {
            var docu = docu_ || topmostDoc || doc,
                script = docu.createElement('script');
            script.type = 'text/javascript';
            docu.head.appendChild(script);
            if (src) {
                if (onload) {
                    script.onload = onload;
                }
                // src applied last for ie
                script.src = src;
            }
            return script;
        },
        touchTop: function (win) {
            // assume you have top access
            var href, topAccess = 1,
                application = this;
            if (application.topAccess === void 0) {
                try {
                    href = win.top.location.href;
                    // safari bug where unfriendly frame returns undefined
                    if (href) {
                        topAccess = 0;
                        application = win.top[where];
                    }
                } catch (e) {
                    topAccess = 1;
                }
                if (win === win.top) {
                    topAccess = 0;
                }
                if (!topAccess) {
                    topmostDoc = win.top.document;
                    win.top[where] = application;
                }
                application.topAccess = !topAccess;
            }
            win[where] = application;
            return application;
        },
    };
}(window, 'application'));
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
        resultOf = function (item, ctx, args) {
            return _.isFunction(item) ? item.apply(ctx, args || []) : item;
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
application.scope(function (app) {
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
                    if (Object.prototype.toString.apply(value) === "[object Array]") {
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
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
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
                if (typeof Date.prototype.toJSON !== "function") {
                    Date.prototype.toJSON = function (key) {
                        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
                    };
                    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
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
                                    if (Object.prototype.hasOwnProperty.call(value, k)) {
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
                            j = Function.prototype.constructor("(" + text + ")");
                            return typeof reviver === "function" ? walk({
                                "": j
                            }, "") : j;
                        }
                        throw new SyntaxError("JSON.parse");
                    };
                }
            }
            if (!Function.prototype.bind) {
                Function.prototype.bind = function (oThis) {
                    if (typeof this !== 'function') {
                        // closest thing possible to the ECMAScript 5
                        // internal IsCallable function
                        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                    }
                    var aArgs = Array.prototype.slice.call(arguments, 1),
                        fToBind = this,
                        FNOP = function () {},
                        fBound = function () {
                            return fToBind.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
                        };
                    if (this.prototype) {
                        // native functions don't have a prototype
                        FNOP.prototype = this.prototype;
                    }
                    fBound.prototype = new FNOP();
                    return fBound;
                };
            }
            window.matchMedia = window.matchMedia || function () {
                // "use strict";
                // For browsers that support matchMedium api such as IE 9 and webkit
                var styleMedia = (window.styleMedia || window.media);
                // For those that don't support matchMedium
                if (!styleMedia) {
                    var style = document.createElement('style'),
                        script = document.getElementsByTagName('script')[0],
                        info = null;
                    style.type = 'text/css';
                    style.id = 'matchmediajs-test';
                    script.parentNode.insertBefore(style, script);
                    // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
                    info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;
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
    app.shims(window);
});
application.scope(function (app) {
    var blank, _ = app._,
        toArray = _.toArray,
        map = _.map,
        indexOf = _.indexOf,
        gapSplit = _.gapSplit,
        isString = _.isString,
        slice = _.slice,
        split = _.split,
        getLength = _.len,
        lengthString = 'length',
        falseBool = false,
        has = _.has,
        join = _.join,
        cacheable = function (fn) {
            var cache = {};
            return function (input) {
                if (!has(cache, input)) {
                    cache[input] = fn.apply(this, arguments);
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
        string = _.extend(_.wrap(gapSplit('toLowerCase toUpperCase trim'), function (method) {
            return cacheable(function (item) {
                return item[method]();
            });
        }), _.wrap(gapSplit('indexOf match search'), function (method) {
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
            var nuStr = str.slice(getLength(prefix)),
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
            if (camelcase !== blank) {
                myStr = prefix + (splitter || '-') + str;
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
                    cache[string] = found = new Function.constructor('return ' + string);
                }
                return found();
            };
        }()),
        /**
         * @func
         */
        camelCase = categoricallyCacheable(function (splitter) {
            return function (str) {
                var i, s, val;
                if (isString(str)) {
                    if (str[0] === splitter) {
                        str = slice(str, 1);
                    }
                    s = split(str, splitter);
                    for (i = getLength(s) - 1; i >= 1; i--) {
                        if (s[i]) {
                            s[i] = upCase(s[i]);
                        }
                    }
                    val = join(s, '');
                }
                return val;
            };
        }, '-'),
        /**
         * @func
         */
        upCase = cacheable(function (s) {
            return s[0].toUpperCase() + slice(s, 1);
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
        }, '-'),
        /**
         * @func
         */
        customUnits = categoricallyCacheable(function (unitList_) {
            var unitList = gapSplit(unitList_);
            return function (str) {
                var i, ch, unitStr, unit = [];
                // make sure it's a string
                str += '';
                // make sure there is no trailing whitespace
                str = str.trim();
                i = str[lengthString];
                // work from the back
                while (str[--i]) {
                    // for (i = str[lengthString] - 1; i >= 0; i--) {
                    unit.unshift(str[i]);
                    unitStr = unit.join('');
                    if (indexOf(unitList, unitStr) >= 0) {
                        if (unitStr === 'em') {
                            if (str[i - 1] === 'r') {
                                unitStr = 'rem';
                            }
                        }
                        if (unitStr === 'in') {
                            if (str[i - 2] === 'v' && str[i - 1] === 'm') {
                                unitStr = 'vmin';
                            }
                        }
                        return unitStr;
                    }
                }
                return falseBool;
            };
        }),
        baseUnitList = gapSplit('px em ex in cm % vh vw pc pt mm vmax vmin'),
        units = function (str) {
            return customUnits(str, baseUnitList);
        },
        isHttp = function (str) {
            var ret = !1;
            if ((str.indexOf('http') === 0 && str.split('//').length >= 2) || str.indexOf('//') === 0) {
                ret = !0;
            }
            return ret;
        },
        parseHash = function (url) {
            var hash = '',
                hashIdx = indexOf(url, '#') + 1;
            if (hashIdx) {
                hash = url.slice(hashIdx - 1);
            }
            return hash;
        },
        parseURL = function (url) {
            var firstSlash, hostSplit, originNoProtocol, search = '',
                hash = '',
                host = '',
                pathname = '',
                protocol = '',
                port = '',
                hostname = '',
                origin = url,
                searchIdx = indexOf(url, '?') + 1,
                searchObject = {},
                protocols = ['http', 'https', 'file', 'about'],
                protocolLength = protocols.length,
                doubleSlash = '//';
            if (searchIdx) {
                search = url.slice(searchIdx - 1);
                origin = origin.split(search).join('');
                hash = parseHash(search);
                search = search.split(hash).join('');
                searchObject = app.parseSearch(search);
            } else {
                hash = parseHash(url);
                origin = origin.split(hash).join('');
            }
            if (url[0] === '/' && url[1] === '/') {
                protocol = window.location.protocol;
                url = protocol + url;
                origin = protocol + origin;
            } else {
                while (protocolLength-- && !protocol) {
                    if (url.slice(0, protocols[protocolLength].length) === protocols[protocolLength]) {
                        protocol = protocols[protocolLength];
                    }
                }
                if (!protocol) {
                    protocol = 'http';
                }
                protocol += ':';
                if (origin.slice(0, protocol.length) + doubleSlash !== protocol + doubleSlash) {
                    url = protocol + doubleSlash + url;
                    origin = protocol + doubleSlash + origin;
                }
            }
            originNoProtocol = origin.split(protocol + doubleSlash).join('');
            firstSlash = indexOf(originNoProtocol, '/') + 1;
            pathname = originNoProtocol.slice(firstSlash - 1);
            host = originNoProtocol.slice(0, firstSlash - 1);
            origin = origin.split(pathname).join('');
            hostSplit = host.split(':');
            hostname = hostSplit.shift();
            port = hostSplit.join(':');
            return {
                port: port,
                hostname: hostname,
                pathname: pathname,
                search: search,
                host: host,
                hash: hash,
                href: url,
                protocol: protocol,
                origin: origin,
                searchObject: searchObject
            };
        };
    _.exports({
        deprefix: deprefix,
        deprefixAll: deprefixAll,
        prefix: prefix,
        prefixAll: prefixAll,
        upCase: upCase,
        unCamelCase: unCamelCase,
        camelCase: camelCase,
        cacheable: cacheable,
        categoricallyCacheable: categoricallyCacheable,
        units: units,
        string: string,
        baseUnitList: baseUnitList,
        customUnits: customUnits,
        isHttp: isHttp,
        parseHash: parseHash,
        parseURL: parseURL,
        parseObject: parseObject
    });
});
application.scope(function (app) {
    var blank, _ = app._,
        extendFrom = _.extendFrom,
        factories = _.factories,
        isObject = _.isObject,
        isNumber = _.isNumber,
        isFunction = _.isFunction,
        lengthString = 'length',
        itemsString = '_items',
        previousString = '_previous',
        each = _.each,
        duff = _.duff,
        push = _.push,
        wrap = _.wrap,
        keys = _.keys,
        find = _.find,
        map = _.map,
        stringify = _.stringify,
        findLast = _.findLast,
        allKeys = _.allKeys,
        splice = _.splice,
        toArray = _.toArray,
        gapSplit = _.gapSplit,
        getLength = _.getLen,
        sort = _.sort,
        bindTo = _.bindTo,
        isArrayLike = _.isArrayLike,
        eachCall = function (array, method) {
            return duff(array, function (item) {
                _.result(item, method);
            });
        },
        eachRevCall = function (array, method) {
            return duff(array, function (item) {
                _.result(item, method);
            }, null, -1);
        },
        unshiftContext = function (fn, ctx) {
            return function () {
                var args = toArray(arguments);
                args.unshift(this);
                return fn.call(ctx || this, args, arguments);
            };
        },
        doToEverything = function (doLater, direction) {
            return function () {
                var args = _.toArray(arguments);
                var one = args.shift();
                duff(args, function (items) {
                    duff(items, function (item) {
                        doLater.call(_, one, item);
                    }, null, direction || 1);
                });
                return one;
            };
        },
        /**
         * @func
         */
        remove = function (list, item, lookAfter) {
            var index = posit(list, item, lookAfter);
            if (index) {
                removeAt(list, index - 1);
            }
            return !!index;
        },
        removeAll = doToEverything(remove, -1),
        removeAt = function (list, index) {
            return splice(list, index, 1)[0];
        },
        add = function (list, item) {
            var val = 0,
                index = posit(list, item);
            if (!index) {
                val = push(list, item);
            }
            return !!val;
        },
        addAll = doToEverything(add),
        addAt = function (list, item, index) {
            var len = list[lengthString],
                lastIdx = len || 0;
            splice(list, index || 0, 0, item);
            return len !== list[lengthString];
        },
        range = function (start, stop, step, inclusive) {
            var length, range, idx;
            if (stop === null || stop === void 0) {
                stop = start || 0;
                start = 0;
            }
            if (!isFinite(start) || !_.isNumber(start)) {
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
        count = function (list, start, end, runner) {
            var obj, idx, ctx = this;
            if (start < end && _.isNumber(start) && _.isNumber(end) && isFinite(start) && isFinite(end)) {
                end = Math.abs(end);
                idx = start;
                while (idx < end) {
                    obj = null;
                    if (_.has(list, idx)) {
                        obj = list[idx];
                    }
                    runner.call(ctx, obj, idx, list);
                    idx++;
                }
            }
            return list;
        },
        // array, startIndex, endIndex
        subset = function (list, startIdx, endIdx) {
            var ret = [];
            find(list, function (idx, item) {
                if (startIdx === idx) {
                    open = true;
                    startIdx = idx;
                }
                if (idx >= startIdx + limit) {
                    return true;
                }
                if (open) {
                    ret.push(model);
                }
            });
            // return foldl(list, function(memo,item,idx){
            //     return memo;
            // },[]);
        },
        listFromMixed = function (obj) {
            if (!hasArrayNature(obj)) {
                return [obj];
            } else if (Array.isArray(obj)) {
                return obj.slice();
            } else {
                return toArray(obj);
            }
        },
        /**
         * @func
         */
        closest = function (list, target) {
            var match, path, diff, valuesLen, possible, i = 0,
                previousAbs = Infinity;
            // trying to avoid running through 20 matchs
            // when i'm already at the exact one
            if (isArrayLike(list)) {
                valuesLen = getLength(list);
                if (valuesLen === 1) {
                    match = list[0];
                }
                if (_.indexOf(list, target) !== -1) {
                    match = target;
                }
                if (!match) {
                    // try doing this later with no sorting
                    sort(list);
                    for (i = valuesLen - 1;
                        (i >= 0 && !match); i--) {
                        path = list[i];
                        diff = Math.abs(target - path);
                        if (diff < previousAbs) {
                            possible = path;
                            previousAbs = diff;
                        }
                    }
                    match = possible;
                }
                if (!match) {
                    match = target;
                }
            }
            return match;
        },
        countTo = function (list, num, runner) {
            return count(list, 0, num, runner);
        },
        countFrom = function (list, num, runner) {
            return count(list, num, list.length, runner);
        },
        /**
         * @func
         */
        posit = function (list, item, lookAfter) {
            return _.indexOf(list, item, lookAfter) + 1;
        },
        /**
         * @func
         */
        concat = function () {
            var array = [];
            duff(arguments, function (arg) {
                duff(arg, function (item) {
                    array.push(item);
                });
            });
            return array;
        },
        /**
         * @func
         */
        concatUnique = function () {
            var array = [],
                all = concat.apply(null, arguments);
            duff(all, function (item) {
                if (!posit(array, item)) {
                    array.push(item);
                }
            });
            return array;
        },
        cycle = function (arr, num) {
            var piece, len = getLength(arr);
            if (_.isNumber(len)) {
                num = num % len;
                piece = arr.splice(num);
                arr.unshift.apply(arr, piece);
            }
            return arr;
        },
        internalMambo = function (fn) {
            return function (arr) {
                arr.reverse();
                fn.apply(this, arguments);
                arr.reverse();
                return arr;
            };
        },
        // Returns whether an object has a given set of `key:value` pairs.
        isMatch = function (object, attrs) {
            var key, i = 0,
                keys = _.keys(attrs),
                obj = Object(object);
            return !find(keys, function (val) {
                if (attrs[val] !== obj[val] || !(val in obj)) {
                    return true;
                }
            });
        },
        // Returns a predicate for checking whether an object has a given set of
        // `key:value` pairs.
        matches = function (obj1) {
            return function (obj2) {
                return isMatch(obj2, obj1);
            };
        },
        uncycle = internalMambo(cycle),
        externalMambo = internalMambo(function (list, fn) {
            return fn.apply(this, arguments);
        }),
        pluck = function (arr, key) {
            var items = [];
            duff(arr, function (item) {
                if (isObject(item)) {
                    if (item[key] !== void 0) {
                        items.push(item[key]);
                    }
                }
            });
            return items;
        },
        // Convenience version of a common use case of `filter`: selecting only objects
        // containing specific `key:value` pairs.
        where = function (obj, attrs) {
            return filter(obj, matches(attrs));
        },
        // Convenience version of a common use case of `find`: getting the first object
        // containing specific `key:value` pairs.
        findWhere = function (obj, attrs) {
            return find(obj, matches(attrs));
        },
        // Convenience version of a common use case of `find`: getting the first object
        // containing specific `key:value` pairs.
        findLastWhere = function (obj, attrs) {
            return findLast(obj, matches(attrs));
        },
        whereNot = function (obj, attrs) {
            return filter(obj, _.negate(matches(attrs)));
        },
        flatten = function () {
            return foldl(arguments, function (memo, item) {
                if (isArrayLike(item)) {
                    memo = memo.concat(flatten.apply(null, item));
                } else {
                    memo.push(item);
                }
                return memo;
            }, []);
        },
        splat = function (fn, spliceat) {
            spliceat = spliceat || 0;
            return function () {
                var ctx = this,
                    arr = toArray(arguments),
                    args = splice(arr, spliceat);
                // return duff(args, fn, this, arr);
                duff(args, function (idx, item, list) {
                    fn.apply(ctx, arr.concat([idx, item, list]));
                });
            };
        },
        merge = splat(function (item, idx, list) {
            var len, collection = this,
                last = getLength(collection);
            if (isArrayLike(item)) {
                len = getLength(item);
                duff(item, function (key, val) {
                    if (val !== void 0) {
                        // removes any undefined items
                        len = key + 1;
                        collection[key] = val;
                    }
                });
                if (len > (last || 0)) {
                    collection[lengthString] = len;
                }
            }
        }),
        eq = function (list, num) {
            var n, thisNum, items = [],
                numb = num || 0,
                evaluatedIsNumber = isNumber(numb),
                isArray = isArrayLike(numb);
            if (numb < 0) {
                evaluatedIsNumber = !1;
            }
            if (getLength(list)) {
                if (evaluatedIsNumber) {
                    items = [list[numb]];
                }
                if (isArray) {
                    items = _.clone(numb);
                }
                if (!isArray && !evaluatedIsNumber && list[0]) {
                    items = [list[0]];
                }
            }
            return items;
        },
        tackRev = function (fn, index, ctx) {
            return function () {
                var args = toArray(arguments);
                while (args.length < index) {
                    // fill it out with null
                    args.push(null);
                }
                // put -1 on as the last arg
                args.push(-1);
                return fn.apply(ctx || _, args);
            };
        },
        duffRev = tackRev(duff, 3),
        eachRev = tackRev(each, 3),
        recreateSelf = function (fn, ctx) {
            return function () {
                return new this.__constructor__(fn.apply(ctx || this, arguments));
            };
        },
        /**
         * @func
         */
        // Create a reducing function iterating left or right.
        createReduce = function (dir) {
            // Optimized iterator function as using arguments[lengthString]
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
                    length = getLength(actualKeys || obj),
                    index = dir > 0 ? 0 : length - 1;
                // Determine the initial value if none is provided.
                if (getLength(arguments) < 3) {
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
        /**
         * @func
         */
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
        unwrapper = function (fn) {
            return function (args) {
                args[0] = args[0][itemsString];
                return fn.call(this, args);
            };
        },
        unwrapInstance = function (instance_) {
            var instance = instance_;
            if (_.isInstance(instance, _.Collection)) {
                instance = instance.un();
            }
            return instance;
        },
        unwrapAll = function (fn) {
            return function (args) {
                duff(args, function (arg, idx, args) {
                    args[idx] = unwrapInstance(arg);
                });
                return fn.call(this, args);
            };
        },
        unwrap = function () {
            return this[itemsString];
        },
        applyToSelf = function (fn) {
            return function () {
                return fn.apply(this, this[itemsString]);
            };
        },
        lengthFn = function () {
            return this[itemsString][lengthString];
        },
        wrappedCollectionMethods = _.extend(wrap({
            each: duff,
            duff: duff,
            forEach: duff,
            eachRev: duffRev,
            duffRev: duffRev,
            forEachRev: duffRev
        }, function (fn, val) {
            return function (iterator) {
                fn(this[itemsString], iterator, this);
                return this;
            };
        }), wrap(gapSplit('addAll removeAll'), function (name) {
            return function () {
                // unshiftContext
                var args = toArray(arguments);
                args.unshift(this);
                // unwrapAll
                duff(args, function (arg, idx, args) {
                    if (arg instanceof Collection) {
                        arg = arg.un();
                    }
                    args[idx] = arg;
                });
                // custom
                _[name].apply(_, args);
                return this;
            };
        }), wrap(gapSplit('sort unshift push cycle uncycle reverse count countTo countFrom eachCall eachRevCall'), function (name) {
            return function () {
                // unshiftContext
                var args = toArray(arguments);
                args.unshift(this[itemsString]);
                // unwrapper
                // custom
                _[name].apply(_, args);
                return this;
            };
        }), wrap(gapSplit('has add addAt remove removeAt pop shift indexOf find findLast findWhere findLastWhere posit foldr foldl reduce'), function (name) {
            return function () {
                // unshiftContext
                var args = toArray(arguments);
                args.unshift(this[itemsString]);
                // custom
                return _[name].apply(_, args);
            };
        }), wrap(gapSplit('merge eq map filter pluck where whereNot'), function (name) {
            // always responds with an array
            return function () {
                // unshiftContext
                var args = toArray(arguments);
                args.unshift(this[itemsString]);
                // unwrapper
                // custom
                return new Collection(_[name].apply(_, args));
            };
        })),
        ret = _.exports({
            eachCall: eachCall,
            eachRevCall: eachRevCall,
            closest: closest,
            // map: map,
            filter: filter,
            reduce: foldl,
            foldl: foldl,
            foldr: foldr,
            matches: matches,
            add: add,
            addAt: addAt,
            addAll: addAll,
            concatUnique: concatUnique,
            removeAt: removeAt,
            remove: remove,
            removeAll: removeAll,
            cycle: cycle,
            uncycle: uncycle,
            mamboWrap: internalMambo,
            mambo: externalMambo,
            concat: concat,
            listMerge: merge,
            pluck: pluck,
            where: where,
            findWhere: findWhere,
            findLastWhere: findLastWhere,
            // finder: finder,
            // find: find,
            // findLast: findLast,
            eq: eq,
            posit: posit,
            range: range,
            count: count,
            countTo: countTo,
            countFrom: countFrom,
            whereNot: whereNot,
            eachRev: eachRev,
            duffRev: duffRev,
            unshiftContext: unshiftContext,
            flatten: flatten
            // ,
            // between: between
        }),
        BY_ID = '_byId',
        Collection = extendFrom.Model('Collection', _.extend({
            un: unwrap,
            unwrap: unwrap,
            len: lengthFn,
            length: lengthFn,
            range: recreateSelf(range),
            flatten: recreateSelf(applyToSelf(flatten)),
            index: function (number) {
                return this[itemsString][number || 0];
            },
            first: recreateSelf(function () {
                return [this[itemsString][0]];
            }),
            last: recreateSelf(function () {
                var len = this.length();
                if (len) {
                    return [this[itemsString][len - 1]];
                }
            }),
            concat: recreateSelf(function () {
                var args = [],
                    base = this[itemsString];
                // this allows us to mix collections with regular arguments
                return base.concat.apply(base, map(arguments, function (arg) {
                    return _.Collection(arg)[itemsString];
                }));
            }),
            constructor: function (arr) {
                var collection = this;
                if (!_.isArray(arr) && isArrayLike(arr)) {
                    arr = toArray(arr);
                }
                if (arr !== blank && !isArrayLike(arr)) {
                    arr = [arr];
                }
                collection[itemsString] = arr || [];
                return collection;
            },
            toString: function () {
                return stringify(this);
            },
            toJSON: function () {
                // subtle distinction here
                return map(this[itemsString], function (item) {
                    var ret;
                    if (isObject(item) && _.isFunction(item.toJSON)) {
                        ret = item.toJSON();
                    } else {
                        ret = item;
                    }
                    return ret;
                });
            },
            join: function (delimiter) {
                return this[itemsString].join(delimiter);
            },
            get: function (id) {
                this[BY_ID] = this[BY_ID] || {};
                return this[BY_ID][id];
            },
            /**
             * @description gets the item on the _byId object or function. If the _byId is a function, than the methods are passed automatically to it to process away
             * @func
             * @name Box#find
             * @param {*} id - usually a string to lookup from the hash. could be an object that will be processed by a function
             * @returns {*} thing that was being held at that key value on the _byId hash, or whatever the _byId function returns
             */
            /**
             * @description registers a model by the id that is passed
             * @func
             * @name Box#register
             * @param {String} string - key that the object will be registered under
             * @param {*} thing - anything that you want to store
             * @returns {Box} instance
             */
            register: function (id, thing) {
                this[BY_ID] = this[BY_ID] || {};
                this[BY_ID][id] = thing;
                return this;
            },
            // match: objCondense(function () {}),
            /**
             * @description adds models to the children array
             * @param {Object|Object[]} objs - object or array of objects to be passed through the model factory and pushed onto the children array
             * @param {Object} [secondary] - secondary hash that is common among all of the objects being created. The parent property is automatically overwritten as the object that the add method was called on
             * @returns {Object|Box} the object that was just created, or the object that the method was called on
             * @name Box#add
             * @func
             */
            unRegister: function (id) {
                var box = this,
                    byid = this[BY_ID] = this[BY_ID] || {},
                    item = box[BY_ID][id];
                if (item !== void 0) {
                    box[BY_ID][id] = blank;
                }
                return item;
            },
            mambo: function (fn) {
                var collection = this;
                externalMambo(collection[itemsString], function () {
                    fn(collection);
                });
                return collection;
            }
        }, wrappedCollectionMethods), !0);
});
application.scope(function (app) {
    var blank, _ = app._,
        // extendFrom = app.extendFrom,
        // factories = app.factories,
        gapSplit = _.gapSplit,
        simpleObject = _.simpleObject,
        isObject = _.isObject,
        isString = _.isString,
        isNum = _.isNum,
        isFunction = _.isFunction,
        each = _.each,
        duff = _.duff,
        isBlank = _.isBlank,
        duffRev = _.duffRev,
        push = _.push,
        has = _.has,
        map = _.map,
        isInstance = _.isInstance,
        camelCase = _.camelCase,
        intendedObject = _.intendedObject,
        toArray = _.toArray,
        clone = _.clone,
        once = _.once,
        extend = _.extend,
        remove = _.remove,
        property = _.property,
        stringify = _.stringify,
        isArrayLike = _.isArrayLike,
        isArray = _.isArray,
        upCase = _.upCase,
        objCondense = _.objCondense,
        LENGTH = 'length',
        PARENT = 'parent',
        internalEventsString = '_events',
        EVENT_REMOVE = '_removeEventList',
        currentEventString = '_currentEventList',
        internalListeningToString = '_listeningTo',
        modifiedTriggerString = 'alter:',
        iPISString = 'immediatePropagationIsStopped',
        seriDataStr = 'serializedData',
        BOOLEAN_FALSE = !1,
        BOOLEAN_TRUE = !0,
        iterateOverObject = function (box, ctx, key, value, iterator, firstarg, allowNonFn) {
            intendedObject(key, value, function (evnts, funs_) {
                // only accepts a string or a function
                var fn = isString(funs_) ? box[funs_] : funs_;
                if (allowNonFn || isFunction(fn)) {
                    return duff(gapSplit(evnts), function (eventName) {
                        var namespace = eventName.split(':')[0];
                        iterator(box, eventName, {
                            disabled: !1,
                            namespace: namespace,
                            name: eventName,
                            handler: fn,
                            ctx: ctx,
                            origin: box
                        }, firstarg);
                    });
                }
            });
        },
        // user friendly version
        flattenMatrix = function (iterator, nameOrObjectIndex) {
            return function () {
                var names, box = this,
                    args = toArray(arguments),
                    handlersIndex = nameOrObjectIndex,
                    list = args.splice(nameOrObjectIndex),
                    nameOrObject = list[0];
                if (!nameOrObjectIndex || args[0]) {
                    iterateOverObject(box, args[handlersIndex + 1], nameOrObject, list[1], iterator, args[0]);
                }
                return box;
            };
        },
        removeEventObject = function (box, arr, handler, ctx) {
            var current = getCurrentEventList(box);
            duffRev(arr, function (obj, idx, array) {
                if ((!handler || obj.handler === handler) && (!ctx || obj.ctx === ctx)) {
                    // because event triggers are always syncronous,
                    // we can just wait until the dispatchEvent function is done
                    if (current[LENGTH]) {
                        getRemoveList(box).push(obj);
                    } else {
                        removeEvent(obj);
                    }
                }
            });
        },
        removeEvent = function (evnt) {
            var listeningTo, listening = evnt.listening;
            remove(evnt.list, evnt);
            // disconnect it from the list above it
            evnt.list = blank;
            // check to see if it was a listening type
            if (listening) {
                // if it was then decrement it
                listening.count--;
                if (!listening.count) {
                    listeningTo = listening.listeningTo;
                    listeningTo[listening.obj._listenId] = blank;
                }
            }
        },
        retreiveEventList = function (model, name) {
            if (!model[internalEventsString]) {
                model[internalEventsString] = {};
            }
            return model[internalEventsString][name];
        },
        getRemoveList = function (model) {
            var list = model[EVENT_REMOVE];
            if (!list) {
                list = model[EVENT_REMOVE] = [];
            }
            return list;
        },
        getCurrentEventList = function (box) {
            var list = box[currentEventString];
            if (!list) {
                list = box[currentEventString] = [];
            }
            return list;
        },
        attachEventObject = function (obj, name, eventObject) {
            var events, list;
            if (isObject(obj)) {
                eventObject.ctx = eventObject.ctx || eventObject.origin;
                eventObject.fn = eventObject.fn || eventObject.handler;
                eventObject.fn = _.bind(eventObject.fn, eventObject.ctx);
                events = obj[internalEventsString] = obj[internalEventsString] || {};
                list = events[name] = events[name] || [];
                // attached so event can remove itself
                eventObject.list = list;
                list.push(eventObject);
            }
        },
        extrapolateContext = function (fn) {
            return function () {
                var args = toArray(arguments);
                if (!args[2]) {
                    args.push(this);
                }
                return fn.apply(this, args);
            };
        },
        listenToWrap = function (fn) {
            return function () {
                var args = toArray(arguments);
                if (!args[3]) {
                    args.push(this);
                }
                args = _.cycle(args, 1);
                return fn.apply(this, args);
            };
        },
        unrollName = function (fn, expectsNameAt) {
            return function () {
                var args = toArray(arguments);
                if (isString(args[expectsNameAt])) {
                    args[expectsNameAt] = this[args[expectsNameAt]];
                }
                fn.apply(this, args);
            };
        },
        retreiveListeningObject = function (thing, obj) {
            var listeningTo, listening, thisId, id = obj._listenId;
            if (!id) {
                id = obj._listenId = _.uniqueId('l');
            }
            listeningTo = thing[internalListeningToString] || (thing[internalListeningToString] = {});
            listening = listeningTo[id];
            // This object is not listening to any other events on `obj` yet.
            // Setup the necessary references to track the listening callbacks.
            if (!listening) {
                thisId = thing._listenId;
                if (!thisId) {
                    thisId = thing._listenId = _.uniqueId('l');
                }
                listening = listeningTo[id] = {
                    obj: obj,
                    objId: id,
                    id: thisId,
                    listeningTo: listeningTo,
                    ctx: thing,
                    count: 0
                };
            }
            return listening;
        },
        ObjectEvent = _.extendFrom.Model('ObjectEvent', {
            constructor: function (name, target, data) {
                var evnt = this;
                if (isInstance(data, Event)) {
                    return data;
                }
                evnt.bubbles = BOOLEAN_FALSE;
                evnt.dispatchChildren = BOOLEAN_FALSE;
                evnt.dispatchTree = BOOLEAN_FALSE;
                evnt.onMethodName = upCase(camelCase('on:' + name, ':'));
                evnt.propagationIsStopped = evnt[iPISString] = BOOLEAN_FALSE;
                evnt.target = target;
                evnt.name = name;
                evnt.type = name.split(':')[0];
                evnt.timestamp = _.now();
                evnt.data(data);
                evnt.originalStack = BOOLEAN_TRUE;
                return evnt;
            },
            isStopped: function () {
                return this.propagationIsStopped || this.immediatePropagationIsStopped;
            },
            data: function (arg) {
                var ret = this[seriDataStr];
                if (arguments[LENGTH]) {
                    ret = this[seriDataStr] = _.parse(_.stringify((arg === void 0 || arg === null) ? {} : arg));
                }
                this[seriDataStr] = ret;
                ret = this[seriDataStr];
                return ret;
            },
            get: function (key) {
                return this[seriDataStr][key];
            },
            set: function (key, value) {
                var evnt = this;
                intendedObject(key, value, function (key, value) {
                    evnt[seriDataStr][key] = value;
                });
                return this;
            },
            stopImmediatePropagation: function () {
                this.stopPropagation();
                this[iPISString] = BOOLEAN_TRUE;
            },
            stopPropagation: function () {
                this.propagationIsStopped = BOOLEAN_TRUE;
            },
            toJSON: function () {
                return this.data(this.data());
            },
            toString: function () {
                return stringify(this.toJSON());
            },
            preventDefault: function () {
                this.defaultPrevented = BOOLEAN_TRUE;
            },
            action: function (fn) {
                var evnt = this;
                evnt._actions = evnt._actions || [];
                evnt._actions.push(fn);
                return evnt;
            },
            finished: function () {
                var evnt = this;
                duff(evnt._actions, function (fn) {
                    fn(evnt);
                });
                evnt.originalStack = BOOLEAN_FALSE;
            }
        }),
        bindOnce = function (box, name, obj) {
            var fn = obj.handler;
            obj.fn = _.once(function () {
                box.off();
                fn.apply(this, arguments);
            });
        },
        listenToHandler = function (box, name, obj, target) {
            var listeningObject = retreiveListeningObject(box, target);
            preBindListeners(obj, listeningObject);
            attachEventObject(target, name, obj);
        },
        onceHandler = function (box, name, obj) {
            bindOnce(box, name, obj);
            attachEventObject(box, name, obj);
        },
        preBindListeners = function (obj, listening) {
            listening.count++;
            obj.listening = listening;
        },
        listenToOnceHandler = function (box, name, obj, extra) {
            bindOnce(box, name, obj);
            listenToHandler(box, name, obj, extra);
        },
        // makeValidEvent = ,
        getEventList = function (box, name) {
            var events = box[internalEventsString] = box[internalEventsString] || {};
            return events[name] || [];
        },
        overrideEventCreation = function (obj) {
            return obj && (obj.bubbles || obj.dispatchChildren || opts.dispatchTree);
        },
        Events = _.extendFrom.Model('Events', {
            /**
             * @description attach event handlers to the Box event loop
             * @func
             * @name Box#on
             * @param {String} str - event name to listen to
             * @param {Function|String} fn - event handler or string corresponding to handler on prototype to use for handler
             * @param {Object} ctx - context that the handler will run in
             * @returns {Box} instance
             */
            initialize: _.noop,
            constructor: function (opts) {
                var model = this;
                model._makeValid();
                model.on(model.events);
                model.initialize(opts);
                return model;
            },
            _makeValid: function () {
                var model = this;
                model[currentEventString] = model[currentEventString] || [];
                model[internalEventsString] = model[internalEventsString] || {};
                model[EVENT_REMOVE] = model[EVENT_REMOVE] || [];
                return model;
            },
            on: flattenMatrix(attachEventObject, 0),
            once: flattenMatrix(onceHandler, 0),
            listenTo: flattenMatrix(listenToHandler, 1),
            /**
             * @description attaches an event handler to the events object, and takes it off as soon as it runs once
             * @func
             * @name Box#once
             * @param {String} string - event name that will be triggered
             * @param {Function} fn - event handler that will run only once
             * @param {Object} ctx - context that will be applied to the handler
             * @returns {Box} instance
             */
            listenToOnce: flattenMatrix(listenToOnceHandler, 1),
            /**
             * @description remove event objects from the _events object
             * @param {String|Function} type - event type or handler. If a match is found, then the event object is removed
             * @param {Function} handler - event handler to be matched and removed
             * @func
             * @name Box#off
             * @returns {Box} instance
             */
            offAll: function () {
                var box = this;
                each(box[internalEventsString], function (array, key, obj) {
                    duffRev(array, removeEvent);
                });
                return box;
            },
            off: function (name_, fn_, ctx_) {
                var currentEventList, currentObj, box = this,
                    // ctx = fn_,
                    name = name_;
                box._makeValid();
                if (arguments[LENGTH]) {
                    if (!name) {
                        each(box[internalEventsString], function (list, name) {
                            removeEventObject(box, list, fn_, ctx_);
                        });
                    } else {
                        iterateOverObject(box, isObject(name_) ? fn_ : ctx_, name, fn_, function (box, name, obj) {
                            removeEventObject(box, !name || box[internalEventsString][name], obj.handler, obj.ctx);
                        }, BOOLEAN_TRUE);
                    }
                } else {
                    currentEventList = getCurrentEventList(box);
                    currentObj = currentEventList[currentEventList[LENGTH] - 1];
                    if (currentObj) {
                        removeEventObject(box, [currentObj]);
                    }
                }
            },
            stopListening: function (obj, name, callback) {
                var ids, listening, stillListening = 0,
                    origin = this,
                    listeningTo = origin[internalListeningToString];
                if (listeningTo && (!obj || obj._listenId)) {
                    duff(obj ? [obj._listenId] : _.keys(listeningTo), function (id) {
                        var listening = listeningTo[id];
                        if (listening) {
                            listening.obj.off(name, callback);
                        }
                        stillListening += listeningTo[id] ? 1 : 0;
                    });
                    if (!stillListening && !find(ids, function (id, key) {
                        return listeningTo[id];
                    })) {
                        origin[internalListeningToString] = blank;
                    }
                }
                return origin;
            },
            /**
             * @description triggers a event loop
             * @func
             * @name Box#fire
             * @param {String} name of the event loop to be triggered
             * @returns {Box} object instance the method is being called on
             */
            dispatchEvents: function (names, data, eventOptions) {
                var box = this;
                duff(gapSplit(names), function (str) {
                    box.dispatchEvent(str, data, eventOptions);
                });
                return box;
            },
            _eventDispatcher: function (evnt) {
                var box = this,
                    valid = box._makeValid(),
                    name = evnt.name,
                    currentEventArray = getCurrentEventList(box),
                    list = getEventList(box, name),
                    ret = isFunction(box[evnt.methodName]) && box[evnt.methodName](evnt);
                    anotherRet = evnt[iPISString] || !!_.find(list, function (obj) {
                        var gah;
                        currentEventArray.push(obj);
                        obj.fn(evnt);
                        gah = currentEventArray.pop(name);
                        return evnt[iPISString];
                    });
                if (!currentEventArray[LENGTH] && box[EVENT_REMOVE][LENGTH] && box[EVENT_REMOVE][LENGTH]) {
                    duffRev(box[EVENT_REMOVE], removeEvent);
                    box[EVENT_REMOVE] = [];
                }
                return box;
            },
            _createEvent: function (name, data) {
                return new ObjectEvent(name, this, data);
            },
            dispatchEvent: function (name, data, evnt_) {
                var methodName = upCase(camelCase('on:' + name, ':')),
                    onMethod = isFunction(box[methodName]),
                    evnt = evnt_ || box._createEvent(name, data);
                box._eventDispatcher(evnt);
                evnt.finished();
                return evnt;
            }
        }, !0);
});
application.scope(function (app) {
    var _ = app._,
        // factories = app.factories,
        // Events = factories.Events,
        // extendFrom = app.extendFrom,
        basicData = function (basic) {
            return function () {
                return basic;
            };
        },
        messengerHash = {},
        attachToHash = function (key, obj) {
            if (messengerHash[key]) {
                messengerHash[key].destroy();
            }
            obj.name = key;
            messengerHash[key] = obj;
        },
        removeFromHash = function (obj) {
            messengerHash[obj.name] = void 0;
        },
        Events = _.factories.Events,
        Messenger = _.extendFrom.Events('Messenger', {
            constructor: function (parent) {
                var hash = {};
                this._getHash = function (key, args) {
                    return _.resultOf(hash[key], args);
                };
                this._setHash = function (key, val) {
                    hash[key] = val;
                };
                if (_.isObject(parent)) {
                    this.attachParent(parent);
                } else {
                    // is string
                    attachToHash(key, this);
                }
                return Events.call(this);
            },
            onDestroy: function () {
                var obj = this;
                if (obj.name) {
                    removeFromHash(obj);
                }
            },
            attachParent: function (parent) {
                this.parent = parent;
                parent.message = this;
                return this;
            },
            request: function (key, args) {
                return this._getHash(key, args);
            },
            reply: function (key, handler) {
                if (!_.isFunction(handler)) {
                    handler = basicData(handler);
                }
                this._setHash(key, handler);
                return this.parent;
            },
            replies: function (obj) {
                var messenger = this;
                _.each(obj, function (val, key) {
                    messenger._setHash(key, val);
                });
                return messenger.parent;
            }
        }, true);
    _.exports({
        reqres: function (obj) {
            return new Messenger(obj);
        }
    });
    _.reqres(app);
});
application.scope(function (app) {
    var blank, _ = app._,
        extendFrom = _.extendFrom,
        factories = _.factories,
        Collection = _.Collection,
        Events = factories.Events,
        gapSplit = _.gapSplit,
        isObject = _.isObject,
        isStr = _.isString,
        isNum = _.isNumber,
        isFn = _.isFunction,
        each = _.each,
        duff = _.duff,
        find = _.find,
        isBlank = _.isBlank,
        isFunction = _.isFunction,
        duffRev = _.duffRev,
        push = _.push,
        has = _.has,
        map = _.map,
        toArray = _.toArray,
        clone = _.clone,
        once = _.once,
        parse = _.parse,
        extend = _.extend,
        listDrop = _.remove,
        property = _.property,
        stringify = _.stringify,
        isInstance = _.isInstance,
        isArrayLike = _.isArrayLike,
        upCase = _.upCase,
        camelCase = _.camelCase,
        isArray = _.isArray,
        objCondense = _.objCondense,
        intendedObject = _.intendedObject,
        LENGTH = 'length',
        PARENT = 'parent',
        INTERNAL_EVENTS = '_events',
        ATTRIBUTES = 'attributes',
        DISPATCH_EVENT = 'dispatchEvent',
        EVENT_REMOVE = '_removeEventList',
        BOOLEAN_FALSE = !1,
        BOOLEAN_TRUE = !0,
        CHILDREN = 'children',
        CHANGE_COUNTER = '_changeCounter',
        toStringString = 'toString',
        prototypeString = 'prototype',
        CHANGED_STRING = 'change',
        constructorString = 'constructor',
        PREVIOUS_ATTRIBUTES = '_previousAttributes',
        /**
         * @class Box
         * @description event and attribute extensor object that creates the Box Constructor and convenience method at _.Box
         * @augments Model
         */
        Container = _.extendFrom.Events('Container', {
            constructor: function (attributes, secondary) {
                var model = this;
                model.cid = model.cid = _.uniqueId(model.cidPrefix);
                model.reset(attributes);
                _.extend(model, secondary);
                Events.apply(this, arguments);
                return model;
            },
            _reset: function (attributes_) {
                var childModel, children, model = this,
                    _altered = model._altered = {},
                    idAttr = _.result(model, 'idAttribute', arguments),
                    // automatically checks to see if the attributes are a string
                    attributes = parse(attributes_) || {},
                    // default attributes
                    attrs = _.result(model, 'defaults', arguments),
                    // build new attributes
                    newAttributes = extend(attrs, attributes),
                    // stale attributes
                    ret = model[ATTRIBUTES] || {};
                // set id and let parent know what your new id is
                this[DISPATCH_EVENT]('before:reset');
                model._setId(attributes[idAttr]);
                model[PREVIOUS_ATTRIBUTES] = {};
                // swaps attributes hash
                model[ATTRIBUTES] = newAttributes;
                // let everything know that it is changing
                model[DISPATCH_EVENT]('reset');
                return ret;
            },
            /**
             * @description remove attributes from the Box object. Does not completely remove from object with delete, but instead simply sets it to void 0 / undefined
             * @param {String} attr - property string that is on the attributes object
             * @returns {Box} instance the method was called on
             * @func
             * @name Box#unset
             */
            unset: function (attrs) {
                var attrObj = this[ATTRIBUTES];
                duff(gapSplit(attrs), function (attr) {
                    attrObj[attr] = blank;
                });
                return this;
            },
            /**
             * @description returns attribute passed into
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {*} value that is present on the attributes object
             * @func
             * @name Box#get
             */
            get: function (attr) {
                return this[ATTRIBUTES][attr];
            },
            /**
             * @func
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {Boolean} evaluation of whether or not the Box instance has a value at that attribute key
             * @description checks to see if the current attribute is on the attributes object as anything other an undefined
             * @name Box#has
             */
            has: function (attrs) {
                var box = this,
                    attributes = box[ATTRIBUTES];
                return !find(gapSplit(attrs), function (attr) {
                    return attributes[attr] === blank;
                });
            },
            /**
             * @description collects a splat of arguments and condenses them into a single object. Object is then extended onto the attributes object and any items that are different will be fired as events
             * @param {...*} series - takes a series of key value pairs. can be mixed with objects. All key value pairs will be placed on a new object, which is to be passed into the function below
             * @func
             * @name Box#set
             * @returns {Box} instance
             */
            _set: function (key, newValue) {
                var model = this,
                    didChange = BOOLEAN_FALSE,
                    attrs = model[ATTRIBUTES],
                    oldValue = attrs[key],
                    previousAttrsObject = model[PREVIOUS_ATTRIBUTES] = model[PREVIOUS_ATTRIBUTES] || {};
                if (!_.isEqual(oldValue, newValue)) {
                    didChange = BOOLEAN_TRUE;
                    previousAttrsObject[key] = oldValue;
                    attrs[key] = newValue;
                }
                return didChange;
            },
            set: function (key, value) {
                var changedList = [],
                    model = this,
                    compiled = {},
                    _changeCounter = model[CHANGE_COUNTER] = model[CHANGE_COUNTER] || 0;
                intendedObject(key, value, function (key, value) {
                    if (model._set(key, value)) {
                        changedList.push(key);
                    }
                });
                if (changedList[LENGTH]) {
                    model[CHANGE_COUNTER]++;
                    duff(changedList, function (name) {
                        model[DISPATCH_EVENT](CHANGED_STRING + ':' + name, {
                            key: name,
                            // uses get to prevent stale data
                            value: model.get(name)
                        });
                    });
                    model[DISPATCH_EVENT](CHANGED_STRING, model[PREVIOUS_ATTRIBUTES]);
                    model[CHANGE_COUNTER]--;
                }
                // this event should only ever exist here
                if (!model[CHANGE_COUNTER]) {
                    model[DISPATCH_EVENT]('digest', model[PREVIOUS_ATTRIBUTES]);
                    model[PREVIOUS_ATTRIBUTES] = {};
                }
                return model;
            },
            /**
             * @description basic json clone of the attributes object
             * @func
             * @name Box#toJSON
             * @returns {Object} json clone of the attributes object
             */
            toJSON: function () {
                // does not prevent circular dependencies.
                // swap this out for something else if you want
                // to prevent circular dependencies
                return clone(this[ATTRIBUTES]);
            },
            /**
             * @description stringified version of attributes object
             * @func
             * @name Box#stringify
             * @returns {String} stringified json version of
             */
            toString: function () {
                return stringify(this);
            },
            _setId: function (id_) {
                var model = this,
                    id = id_ === void 0 ? _.uniqueId(!1) : id_ + '';
                model.id = id;
            },
            reset: function (attrs) {
                this._reset(attrs);
                return this;
            }
        }, true),
        Box = _.extendFrom.Container('Box', {
            /**
             * @description constructor function for the Box Object
             * @name Box#constructor
             * @func
             */
            cidPrefix: 'c',
            idAttribute: 'id',
            constructor: function (attributes, secondary) {
                var model = this;
                model[CHILDREN] = Collection();
                Container.apply(model, arguments);
                return model;
            },
            _gatherChildren: function () {
                return [];
            },
            /**
             * @description resets the box's attributes to the object that is passed in
             * @name Box#reset
             * @func
             * @param {Object} attributes - non circular hash that is extended onto what the defaults object produces
             * @returns {Box} instance the method was called on
             */
            _registerChild: function (id, model) {
                var parent = this;
                if (id !== void 0) {
                    parent.children.register(id, model);
                }
            },
            _unRegisterChild: function (id) {
                var parent = this;
                if (id !== void 0) {
                    parent.children.unRegister(id);
                }
            },
            resetChildren: function (newChildren) {
                var child, box = this,
                    children = box[CHILDREN],
                    arr = children.un();
                while (arr.length) {
                    child = arr[0];
                    if (child && child.destroy) {
                        child.destroy();
                    }
                    // if it didn't remove itself,
                    // then you should remove it here
                    // this doesn't work if the child is a basic data type
                    if (arr[0] === child) {
                        _.remove(arr, child);
                    }
                }
                box.add(newChildren);
                return box;
            },
            /**
             * @description calls toJSON on all children and creates an array of clones
             * @func
             * @name Box#childrenToJSON
             * @returns {Object} array of toJSON'ed children
             */
            childrenToJSON: function () {
                return this[CHILDREN].toJSON();
            },
            /**
             * @description conbination of toJSON and kids to JSON, applied recurisvely. "kids" are applied as the children property
             * @func
             * @name Box#treeToJSON
             * @returns {Object} JSON clone of attributes and children
             */
            treeToJSON: function () {
                var model = this,
                    attrClone = model.toJSON(),
                    children = model[CHILDREN];
                if (children.length()) {
                    attrClone[CHILDREN] = children.toJSON();
                }
                return attrClone;
            },
            /**
             * @description stringified version of children array
             * @func
             * @name Box#stringifyChildren
             * @returns {String} string version of children
             */
            stringifyChildren: function () {
                return stringify(this.childrenToJSON());
            },
            /**
             * @description stringifies parent, child, attributes tree
             * @func
             * @name Box#stringifyTree
             * @returns {String} string version of tree
             */
            stringifyTree: function () {
                return stringify(this.treeToJSON());
            },
            // registers and actually adds child to hash
            _addToHash: function (newModel) {
                var parent = this,
                    children = this.children;
                // add to collection
                children.add(newModel);
                // register with parent
                parent._registerChild(newModel.id, newModel);
                parent._registerChild(newModel.cid, newModel);
            },
            // ties child events to new child
            _delegateChildEvents: function (model) {
                var parent = this,
                    childEvents = _.result(parent, 'childEvents');
                if (model && childEvents) {
                    model._parentDelgatedChildEvents = childEvents;
                    parent.listenTo(model, childEvents);
                }
            },
            // ties child events to new child
            _unDelegateChildEvents: function (model) {
                if (model && model._parentDelgatedChildEvents && this.stopListening) {
                    this.stopListening(model, model._parentDelgatedChildEvents);
                }
            },
            _delegateParentEvents: function (model) {
                var parent = model.parent,
                    parentEvents = _.result(model, 'parentEvents');
                if (parent && parentEvents) {
                    model._delegatedParentEvents = parentEvents;
                    model.listenTo(parent, parentEvents);
                }
            },
            // ties child events to new child
            _unDelegateParentEvents: function (model) {
                var parent = this;
                if (model.stopListening && model._delegatedParentEvents) {
                    model.stopListening(parent, model._delegatedParentEvents);
                }
            },
            _isChildType: function (child) {
                return isInstance(child, this.Model);
            },
            // this one forcefully adds
            _add: function (model) {
                var parent = this,
                    children = parent[CHILDREN],
                    evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT]('before:added');
                // let the child know it's about to be added
                // (tied to it's parent via events)
                // unties boxes
                parent._remove(model);
                // explicitly tie to parent
                model.parent = parent;
                // attach events from parent
                parent._addToHash(model);
                // ties boxes together
                parent._delegateParentEvents(model);
                parent._delegateChildEvents(model);
                evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT]('added');
                // notify that you were added
                return model;
            },
            // public facing version filters
            add: function (objs, secondary_) {
                var childWasAdded, newModel, returnNewModel, parent = this,
                    children = parent[CHILDREN],
                    list = [],
                    secondary = extend(_.result(parent, 'childOptions'), secondary_ || {});
                // unwrap it if you were passed a collection
                if (isInstance(objs, _.Collection)) {
                    objs = objs.un();
                }
                if (!isArrayLike(objs)) {
                    objs = [objs];
                }
                if (parent.Model && objs[0]) {
                    list = map(objs, function (obj) {
                        var foundModel, isChildType = parent._isChildType(obj);
                        // create a new model
                        newModel = isChildType ? obj : new parent.Model(obj, secondary);
                        // find by the newly created's id
                        foundModel = children.get(newModel.id);
                        // out with the old
                        if (foundModel) {
                            // update the old model with new info
                            foundModel.set(newModel.toJSON());
                            newModel = foundModel;
                        } else {
                            childWasAdded = true;
                            parent._add(newModel);
                            // list to return
                        }
                        return newModel;
                    });
                    if (childWasAdded) {
                        parent[DISPATCH_EVENT]('child:added');
                    }
                }
                return list;
            },
            _removeFromHash: function (child) {
                var parent = this,
                    children = parent.children;
                if (children && child) {
                    // remove the child from the children hash
                    children.remove(child);
                    parent._unRegisterChild(child.id);
                    // unregister from the child hash keys
                    parent._unRegisterChild(child.cid);
                }
            },
            // only place that we mention parents
            _collectParents: function () {
                var eventr = this,
                    parents = [],
                    parent = eventr[PARENT];
                while (parent) {
                    if (isInstance(parent, Events)) {
                        parents.push(parent);
                    }
                    parent = parent[PARENT];
                }
                return parents;
            },
            // has to completely replace previous event dispatcher
            dispatchEvent: function (name_, data, evnt_) {
                var origin = this,
                    name = (evnt_ && evnt_.methodName) || name_,
                    methodName = (evnt_ && evnt_.methodName) || upCase(camelCase('on:' + name, ':')),
                    childMethodName = upCase(camelCase('on:child:' + name, ':')),
                    // onMethod = isFunction(origin[methodName]),
                    evnt = evnt_ || origin._createEvent(name, data),
                    parents = origin._collectParents(),
                    i = parents[LENGTH] - 1;
                while (parents[LENGTH] && parents[i] && !evnt.isStopped()) {
                    parent = parents[i];
                    if (parent._isDestroyed) {
                        evnt.stopImmediatePropagation();
                        i = 0;
                    } else {
                        parent._eventDispatcher(evnt);
                    }
                    i--;
                }
                // if (!evnt.isStopped()) {
                //     origin._eventDispatcher(evnt);
                // }
                while (origin && origin._eventDispatcher && !evnt.isStopped()) {
                    origin._eventDispatcher(evnt);
                    origin = !evnt.isStopped() && evnt.bubbles && origin[PARENT];
                }
                evnt.finished();
                return evnt;
                // var evnt =
                // var evnt, box = makeValidEvent(this),
                //     originalBox = box,
                //     currentEventArray = getCurrentEventList(originalBox),
                //     methodName = upCase(camelCase('on:' + name, ':')),
                //     childMethodName = upCase(camelCase('on:child:' + name, ':')),
                //     onMethod = isFunction(box[methodName]);
                // if (onMethod || getEventList(box, name).length || overrideEventCreation(options)) {
                //     evnt = box._createEvent(name, data);
                //     evnt.originalStack = BOOLEAN_TRUE;
                //     evnt.onMethodName = methodName;
                //     while (box && box[internalEventsString] && box._eventDispatcher && !evnt.isStopped()) {
                //         box._eventDispatcher(evnt);
                //         box = !evnt.isStopped() && evnt.bubbles && box[PARENT];
                //     }
                //     evnt.originalStack = BOOLEAN_FALSE;
                // }
            },
            _remove: function (model) {
                var parent = this;
                model[DISPATCH_EVENT]('before:removed');
                // notify the child that the remove pipeline is starting
                // remove the parent listeners
                parent._unDelegateParentEvents(model);
                parent._unDelegateChildEvents(model);
                // attach events from parent
                parent._removeFromHash(model);
                // void out the parent member tied directly to the model
                model.parent = void 0;
                model[DISPATCH_EVENT]('removed');
                // notify the child that the remove pipeline is done
                return model;
            },
            remove: function (idModel_) {
                var removedSomething, parent = this,
                    children = parent[CHILDREN],
                    retList = _.Collection(),
                    args = _.toArray(arguments).splice(1),
                    idModel = idModel_;
                if (!isObject(idModel)) {
                    // it's a string
                    idModel = parent.children.get(idModel + '');
                }
                if (idModel && isObject(idModel)) {
                    if (isInstance(idModel, _.Collection)) {
                        idModel = idModel.un();
                    }
                    if (!_.isArray(idModel)) {
                        idModel = [idModel];
                    }
                    duff(idModel, function (model) {
                        removedSomething = true;
                        parent._remove(model);
                        retList.add(model);
                    });
                    if (removedSomething) {
                        parent[DISPATCH_EVENT]('child:removed');
                    }
                }
                return retList;
            },
            /**
             * @description removes pointers from parent
             * @func
             * @name Box#destroy
             * @returns {Box} instance
             */
            destroy: function () {
                var removeRet, box = this;
                // notify things like parent that it's about to destroy itself
                box[DISPATCH_EVENT]('before:destroy');
                // destroys it's children
                box.resetChildren();
                // removes all parent / parent's child listeners
                removeRet = box.parent && box.parent.remove(box);
                // stop listening to other views
                box[DISPATCH_EVENT]('destroy');
                // stops listening to everything
                box.stopListening();
                // takes off all other event handlers
                box.offAll();
                return box;
            },
            /**
             * @description basic sort function
             * @param {Function|String} comparator - argument to sort children against
             * @returns {Box} instance
             * @func
             * @name Box#sort
             */
            sort: function (comparator) {
                var compString, isReversed, model = this,
                    children = model[CHILDREN];
                if (!comparator) {
                    comparator = model.comparator;
                }
                if (_.isString(comparator)) {
                    isReversed = comparator[0] === '!';
                    compString = comparator;
                    if (isReversed) {
                        compString = comparator.slice(1, comparator[LENGTH]);
                    }
                    comparator = function (a, b) {
                        var val, valA = a.get(compString),
                            valB = b.get(compString);
                        if (isReversed) {
                            val = valB - valA;
                        } else {
                            val = valA - valB;
                        }
                        return val;
                    };
                }
                model[DISPATCH_EVENT]('before:sort', model);
                children.sort(comparator);
                model[DISPATCH_EVENT]('sort', model);
                return model;
            }
        }, !0);
});
application.scope(function (app) {
    var blank, _ = app._,
        // submodules = app.submodules = {},
        factories = _.factories,
        Box = _.factories.Box,
        startableMethods = {
            start: function () {
                var startable = this;
                if (!startable.started) {
                    startable.dispatchEvent('before:start', arguments);
                    startable.started = true;
                    startable.dispatchEvent('start', arguments);
                }
            },
            stop: function () {
                var startable = this;
                if (startable.started) {
                    startable.dispatchEvent('before:stop', arguments);
                    startable.started = false;
                    startable.dispatchEvent('stop', arguments);
                }
            },
            toggle: function () {
                var module = this;
                if (module.started) {
                    module.stop.apply(module, arguments);
                } else {
                    module.start.apply(module, arguments);
                }
                return module;
            }
        },
        Startable = _.extendFrom.Box('Startable', startableMethods, !0),
        doStart = function (e) {
            if (this.get('startWithParent')) {
                this.start(e);
            }
        },
        doStop = function (e) {
            if (this.get('stopWithParent')) {
                this.stop(e);
            }
        },
        moduleHandler = function (name_, fn) {
            var module, attrs, parentIsModule, nametree, parent = this,
                originalParent = parent,
                name = name_,
                namespace = name.split('.');
            while (namespace.length > 1) {
                parent = parent.module(namespace[0]);
                namespace.shift();
            }
            name = namespace.join('.');
            // module = parent.submodules[name];
            if (!module) {
                parentIsModule = _.isInstance(parent, Module);
                if (parentIsModule) {
                    namespace.unshift(parent.get('globalname'));
                }
                namespace = namespace.join('.');
                attrs = {
                    name: name,
                    globalname: namespace
                };
                if (parentIsModule) {
                    module = parent.add(attrs)[0];
                } else {
                    module = new Module(attrs, {
                        application: app,
                        parent: parent
                    });
                    parent.children.add(module);
                }
                // parent.registerModule(name, module);
            }
            if (!module.hasInitialized && _.isFunction(fn)) {
                module.hasInitialized = true;
                module.handler(fn);
            }
            return module;
        },
        Module = _.extendFrom.Box('Module', _.extend({}, startableMethods, {
            // registerModule: registerModule,
            // unRegisterModule: unRegisterModule,
            idAttribute: 'name',
            module: moduleHandler,
            parentEvents: {
                start: doStart,
                stop: doStop
            },
            exports: function (obj) {
                _.extend(this.get('exports'), obj);
                return this;
            },
            run: function (fn) {
                var module = this;
                fn.apply(module, module.createArguments());
                return module;
            },
            createArguments: function () {
                return [this].concat(this.application.createArguments());
            },
            constructor: function (attrs, opts) {
                var module = this;
                // module.submodules = {};
                module.name = attrs.name;
                module.application = opts.application;
                module.handlers = _.Collection();
                _.reqres(this);
                Box.apply(this, arguments);
                return module;
            },
            defaults: function () {
                return {
                    startWithParent: true,
                    stopWithParent: true,
                    exports: {}
                };
            },
            childOptions: function () {
                return {
                    application: this.application,
                    parent: this
                };
            },
            handler: function (fn) {
                var module = this;
                module.handlers.push(fn);
                module.run(fn);
                return module;
            }
        }), !0);
    app.extend({
        children: _.Collection(),
        // registerModule: registerModule,
        /**
         * @func
         * @name Specless#run
         * @returns {*}
         */
        run: Module.prototype.run,
        /**
         * @func
         * @name Specless#baseModuleArguments
         * @returns {Array} list of base arguments to apply to submodules
         */
        baseModuleArguments: function () {
            var app = this;
            return [app, app._];
        },
        /**
         * @func
         * @name Specless#addModuleArgs
         * @param {Array} arr - list of arguments that will be added to the extraModule args list
         * @returns {Specless} instance
         */
        addModuleArgs: function (arr) {
            var app = this;
            app.extraModuleArgs = app.extraModuleArgs || [];
            app._.addAll(app.extraModuleArgs, arr);
            return app;
        },
        /**
         * @func
         * @name Specless#removeModuleArgs
         * @param {Array} arr - list of objects or functions that will be removed from the extraModuleArgs
         * @returns {Specless} instance
         */
        removeModuleArgs: function (arr) {
            this.utils.removeAll(this.extraModuleArgs, arr);
            return this;
        },
        /**
         * @func
         * @name Specless#createArguments
         * @returns {Object[]}
         */
        createArguments: function () {
            return this.baseModuleArguments().concat(this.extraModuleArgs);
        },
        require: function (modulename) {
            var module = this.module(modulename);
            return module.getExports();
        },
        module: moduleHandler
    });
});
application.scope().module('Looper', function (module, app, _, extendFrom, factories) {
    var blank, LoopGen, x = 0,
        lastTime = 0,
        lengthString = 'length',
        isFn = _.isFn,
        isNum = _.isNum,
        pI = _.pI,
        posit = _.posit,
        nowish = _.now,
        getLength = _.property(lengthString),
        gapSplit = _.gapSplit,
        win = window,
        vendors = gapSplit('ms moz webkit o'),
        requestAnimationFrameString = 'requestAnimationFrame',
        allLoopGens = [],
        runningLoopGens = [],
        bind = _.bind,
        duff = _.duff,
        remove = _.remove,
        removeAll = _.removeAll,
        duffRev = _.duffRev,
        extend = _.extend,
        // extendFrom = _.extendFrom,
        running = false,
        setup = function () {
            running = true;
            win[requestAnimationFrameString](function (time) {
                duff(runningLoopGens, function (idx, loopGen) {
                    loopGen.run(time);
                });
                teardown();
            });
        },
        teardown = function () {
            duffRev(runningLoopGens, function (idx, loopGen) {
                if (loopGen.halted() || loopGen.stopped() || loopGen.destroyed() || !loopGen.length()) {
                    runningLoopGens.splice(idx, 1);
                }
            });
            running = false;
            if (runningLoopGens[lengthString]) {
                setup();
            }
        },
        add = function (loopGen) {
            allLoopGens.push(loopGen);
        },
        start = function (loopGen) {
            if (!posit(runningLoopGens, loopGen)) {
                runningLoopGens.push(loopGen);
            }
            if (!running) {
                setup();
            }
        };
    for (; x < getLength(vendors) && !win[requestAnimationFrameString]; ++x) {
        win[requestAnimationFrameString] = win[vendors[x] + 'RequestAnimationFrame'];
        win.cancelAnimationFrame = win[vendors[x] + 'CancelAnimationFrame'] || win[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!win[requestAnimationFrameString]) {
        win[requestAnimationFrameString] = function (callback) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = win.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!win.cancelAnimationFrame) {
        win.cancelAnimationFrame = function (id) {
            win.clearTimeout(id);
        };
    }
    LoopGen = _.extendFrom.Model('LoopGen', {
        constructor: function (_runner) {
            var fns, stopped = false,
                halted = false,
                destroyed = false,
                running = false,
                loopGen = this,
                counter = 0,
                fnList = [],
                addList = [],
                removeList = [],
                combineAdd = function () {
                    if (addList[lengthString]) {
                        fnList = fnList.concat(addList);
                        addList = [];
                    }
                };
            extend(loopGen, {
                length: function () {
                    return getLength(fnList);
                },
                destroy: function () {
                    destroyed = true;
                    remove(allLoopGens, this);
                    return this.halt();
                },
                destroyed: function () {
                    return destroyed;
                },
                running: function () {
                    return !!running;
                },
                run: function () {
                    var tween = this,
                        removeLater = [],
                        _nowish = nowish();
                    if (halted || stopped) {
                        return;
                    }
                    combineAdd();
                    // removeAll(fnList, removeList);
                    // removeList = [];
                    duff(fnList, function (idx, fnObj) {
                        if (!posit(removeList, fnObj)) {
                            if (!fnObj.disabled && !halted) {
                                running = fnObj;
                                fnObj.fn(_nowish);
                            }
                        } else {
                            removeLater.push(fnObj);
                        }
                    });
                    running = false;
                    combineAdd();
                    removeAll(fnList, removeList.concat(removeLater));
                    removeList = [];
                },
                remove: function (id) {
                    var ret, fnObj, i = 0;
                    if (!arguments[lengthString]) {
                        if (running) {
                            id = running.id;
                        }
                    }
                    if (isNumber(id)) {
                        for (; i < fnList[lengthString] && !ret; i++) {
                            fnObj = fnList[i];
                            if (fnObj.id === id) {
                                if (!posit(removeList, fnObj)) {
                                    removeList.push(fnObj);
                                    ret = 1;
                                }
                            }
                        }
                    }
                    return !!ret;
                },
                stop: function () {
                    stopped = !0;
                    return this;
                },
                start: function () {
                    var looper = this;
                    stopped = !1;
                    halted = !1;
                    return looper;
                },
                halt: function () {
                    halted = !0;
                    return this.stop();
                },
                halted: function () {
                    return halted;
                },
                stopped: function () {
                    return stopped;
                },
                reset: function () {
                    fnList = [];
                    removeList = [];
                    addList = [];
                    return this;
                },
                add: function (fn) {
                    var obj, id = counter,
                        tween = this;
                    if (isFunction(fn)) {
                        if (!fnList[lengthString]) {
                            tween.start();
                        }
                        start(tween);
                        obj = {
                            fn: bind(fn, tween),
                            id: id,
                            disabled: !1,
                            bound: tween
                        };
                        if (tween.running()) {
                            addList.push(obj);
                        } else {
                            fnList.push(obj);
                        }
                        counter++;
                        return id;
                    }
                }
            });
            add(loopGen);
            return loopGen;
        },
        once: function (fn) {
            return this.count(1, fn);
        },
        count: function (timey, fn) {
            var count = 0,
                times = pI(timey) || 1;
            if (!fn && isFunction(times)) {
                fn = timey;
                times = 1;
            }
            if (times < 1 || !isNumber(times)) {
                times = 1;
            }
            if (!isFunction(fn)) {
                return;
            }
            return this.add(function (ms) {
                var last = 1;
                count++;
                if (count >= times) {
                    this.remove();
                    last = 0;
                }
                fn.apply(this, [ms, !last, count]);
            });
        },
        tween: function (time, fn) {
            var added = nowish();
            if (!time) {
                time = 0;
            }
            if (!isFunction(fn)) {
                return;
            }
            return this.interval(0, function (ms) {
                var tween = 1,
                    diff = ms - added;
                if (diff >= time) {
                    tween = 0;
                    this.remove();
                }
                fn.call(this, ms, Math.min(1, (diff / time)), !tween);
            });
        },
        time: function (time, fn) {
            if (!isFunction(fn)) {
                return;
            }
            return this.interval(time, function (ms) {
                fn.call(this, ms);
                this.remove();
            });
        },
        frameRate: function (time, fn, min) {
            var tween = this,
                minimum = Math.min(min || 0.8, 0.8),
                expectedFrameRate = 30 * minimum,
                lastDate = 1,
                lastSkip = _.now();
            time = time || 125;
            if (isFunction(fn)) {
                return tween.add(function (ms) {
                    var frameRate = 1000 / (ms - lastDate);
                    if (frameRate > 40) {
                        expectedFrameRate = 60 * minimum;
                    }
                    if (frameRate < expectedFrameRate) {
                        lastSkip = ms;
                    }
                    if (ms - lastSkip > time) {
                        this.remove();
                        fn.call(this, ms);
                    }
                    lastDate = ms;
                });
            }
        },
        interval: function (time, fn) {
            var last = nowish();
            if (!time) {
                time = 0;
            }
            if (!isFunction(fn)) {
                return;
            }
            return this.add(function (ms) {
                if (ms - time >= last) {
                    fn.call(this, ms);
                    last = ms;
                }
            });
        }
    }, !0);
    _.exports({
        AF: new LoopGen()
    });
});
application.scope().module('Promise', function (module, app, _) {
    var blank, flatten = _.flatten,
        extendFrom = _.extendFrom,
        factories = _.factories,
        lengthString = 'length',
        duff = _.duff,
        each = _.each,
        extend = _.extend,
        toArray = _.toArray,
        isFunction = _.isFunction,
        foldr = _.foldr,
        result = _.result,
        collapse = function (args) {
            return foldr(args, function (memo, item) {
                if (item) {
                    memo.push(item);
                }
                return memo;
            }, []);
        },
        when = function () {
            var promise = _.Promise();
            promise.add(_.foldl(flatten(arguments), function (memo, pro) {
                if (promise._isChildType(pro)) {
                    memo.push(pro);
                }
                return memo;
            }, []));
            return promise;
        },
        preventDoOver = {
            success: true,
            failure: true
        },
        dispatch = function (promise, name, opts) {
            promise.dispatchEvent(name, opts);
            if (!preventDoOver[name]) {
                promise.dispatchEvent(promise.isFulfilled() ? 'success' : 'failure', opts);
            }
            promise.dispatchEvent('always', opts);
        },
        executeIfNeeded = function (promise, name) {
            return function () {
                var stashed = promise.get('stashed'),
                    resolved = promise.resolved(),
                    apply = stashed && resolved,
                    // takes N functions from arrays or nested arrays
                    passedFns = each(flatten(arguments), function (fn) {
                        if (isFunction(fn)) {
                            if (apply) {
                                fn.apply(promise, stashed);
                            } else {
                                promise.once(name, fn);
                            }
                        }
                    });
                return promise;
            };
        },
        associativeStates = {
            success: true,
            failure: true,
            error: true,
            always: true
        },
        addState = function (doit, key) {
            var promise = this;
            if (!promise[key] && doit !== false) {
                promise[key] = executeIfNeeded(promise, key);
            }
            return promise;
        },
        Promise = extendFrom.Box('Promise', {
            addState: addState,
            childEvents: {
                always: 'check'
            },
            events: {
                'child:added': 'check'
            },
            constructor: function () {
                var promise = this;
                factories.Box.call(promise);
                promise.restart();
                // cannot have been resolved in any way yet
                _.each(_.extend({}, associativeStates, result(promise, 'associativeStates')), addState, promise);
                // add passed in success handlers
                promise.success(arguments);
                return promise;
            },
            check: function () {
                var notSuccessful, resolveAs, parent = this,
                    children = parent.children;
                if (!children.find(function (idx, child) {
                    notSuccessful = notSuccessful || child.state() !== 'success';
                    return !child.resolved();
                })) {
                    if (notSuccessful) {
                        resolveAs = 'failure';
                    } else {
                        resolveAs = 'success';
                    }
                    parent.resolveAs(resolveAs);
                }
            },
            _isChildType: function (promise) {
                return promise.success && promise.failure && promise.resolve;
            },
            state: function () {
                return this.get('state');
            },
            // returns an object -- always
            auxilarySuccess: function () {
                return {};
            },
            successfulResolves: function () {
                var resultResult = result(this, 'auxilarySuccess') || {};
                resultResult.success = true;
                return resultResult;
            },
            resolved: function () {
                // allows resolved to be defined in a different way
                return this.get('resolved');
            },
            isFulfilled: function () {
                return !!_.resultOf(result(this, 'successfulResolves')[this.get('state')], this);
            },
            isRejected: function () {
                return !this.isFulfilled();
            },
            isPending: function () {
                return this.get('state') === 'pending';
            },
            defaults: function () {
                return {
                    state: 'pending',
                    resolved: false,
                    stashed: {}
                };
            },
            restart: function () {
                var promise = this;
                if (promise.resolved()) {
                    promise.set(promise.defaults());
                }
                return promise;
            },
            resolveAs: function (resolveAs_, opts_) {
                var opts = opts_,
                    resolveAs = resolveAs_,
                    promise = this,
                    stashed = promise.get('stashed');
                if (!promise.resolved()) {
                    if (!_.isString(resolveAs)) {
                        opts = resolveAs;
                        resolveAs = false;
                    }
                    promise.set({
                        resolved: true,
                        state: resolveAs || 'success',
                        stashed: opts || stashed
                    });
                    opts = promise.get('stashed');
                    resolveAs = promise.get('state');
                    try {
                        dispatch(promise, resolveAs, opts);
                    } catch (e) {
                        dispatch(promise, 'error', {
                            // nest the sucker again in case it's an array or something else
                            options: opts,
                            message: 'javascript execution error'
                        });
                    }
                }
                return promise;
            },
            // convenience functions
            resolve: function (opts) {
                return this.resolveAs('success', opts);
            },
            reject: function (opts) {
                return this.resolveAs('failure', opts);
            }
        }, 1);
    _.exports({
        when: when
    });
});
application.scope().module('Ajax', function (module, app, _, factories) {
    var gapSplit = _.gapSplit,
        duff = _.duff,
        extendFrom = _.extendFrom,
        validTypes = gapSplit('GET POST PUT DELETE'),
        baseEvents = gapSplit('progress timeout error abort'),
        cache = {},
        /**
         * @description helper function to attach a bunch of event listeners to the request object as well as help them trigger the appropriate events on the Ajax object itself
         * @private
         * @arg {Ajax} instance to listen to
         * @arg {Xhr} instance to place event handlers to trigger events on the Ajax instance
         * @arg {string} event name
         */
        attachBaseListeners = function (ajax) {
            var prog = 0, req = ajax.requestObject;
            duff(baseEvents, function (evnt) {
                if (evnt === 'progress') {
                    req['on' + evnt] = function (e) {
                        prog++;
                        ajax.dispatchEvent(evnt, {
                            percent: (e.loaded / e.total) || (prog / (prog + 1)),
                            counter: prog
                        });
                    };
                } else {
                    req['on' + evnt] = function (e) {
                        ajax.rejectAs(evnt);
                    };
                }
            });
        },
        sendthething = function (xhrReq, args) {
            return function () {
                try {
                    xhrReq.send.apply(xhrReq, args);
                } catch (e) {
                    // reports on send error
                    factories.reportError('xhr', e + '');
                }
            };
        },
        sendRequest = function (ajax, xhrReq, type, url) {
            var args = [],
                data = ajax.get('data');
            if (url) {
                xhrReq.open(type, url, ajax.get('async'));
                if (data) {
                    args.push(_.stringify(data));
                }
                ajax.setHeaders(ajax.get('headers'));
                attachBaseListeners(ajax);
                // have to wrap in set timeout for ie
                setTimeout(sendthething(xhrReq, args));
            }
        },
        decide = {
            /**
             * @description get pathway for actually sending out a get request
             * @private
             */
            GET: function (ajax, xhrReq, type) {
                var url = ajax.getUrl();
                ajax.attachResponseHandler();
                sendRequest(ajax, xhrReq, type, url);
            },
            /**
             * @description pathway for actually sending out a put request
             * @private
             */
            PUT: function () {},
            /**
             * @description pathway for actually sending out a post request
             * @private
             */
            POST: function (ajax, xhrReq, type) {
                var url = ajax.getUrl();
                ajax.attachResponseHandler();
                sendRequest(ajax, xhrReq, type, url);
            },
            /**
             * @description pathway for actually sending out a delete request
             * @private
             */
            DELETE: function () {}
        };
    /**
     * @class Ajax
     * @alias _.Ajax
     * @augments Box
     * @augments Model
     * @classdesc XHR object wrapper Triggers events based on xhr state changes and abstracts many anomalies that have to do with IE
     */
    _.factories.Ajax = _.extendFrom.Promise('Ajax', {
        events: {
            'alter:url': function () {
                var ajax = this,
                    xhrReq = ajax.requestObject,
                    type = ajax.get('type'),
                    thingToDo = decide[type] || decide.GET;
                if (thingToDo) {
                    thingToDo(ajax, xhrReq, type);
                }
            }
        },
        associativeStates: {
            timeout: true,
            abort: true
        },
        defaults: function () {
            return {
                async: true,
                type: 'GET'
            };
        },
        /**
         * @func
         * @name Ajax#constructor
         * @param {string} str - url to get from
         * @returns {Ajax} new ajax object
         */
        constructor: function (str, secondary) {
            var promise, url, thingToDo, typeThing, type, xhrReq, ajax = this,
                method = 'onreadystatechange';
            // Add a cache buster to the url
            // ajax.async = true;
            xhrReq = new XMLHttpRequest();
            // covers ie9
            if (typeof XDomainRequest !== 'undefined') {
                xhrReq = new XDomainRequest();
                method = 'onload';
            }
            if (!_.isObject(str)) {
                str = str || '';
                type = 'GET';
                typeThing = str.toUpperCase();
                if (_.listHas(validTypes, typeThing)) {
                    type = typeThing;
                } else {
                    url = str;
                }
                str = {
                    url: url || '',
                    type: type
                };
            }
            str.type = (str.type || 'GET').toUpperCase();
            str.method = method;
            factories.Promise.apply(ajax);
            _.extend(ajax, secondary);
            /** @member {XMLHttpRequest} */
            ajax.requestObject = xhrReq;
            return ajax.on('error abort timeout', function (e) {
                factories.reportError('xhr error', e.type);
            }).set(str).always(function (evnt) {
                ajax.dispatchEvent('status:' + evnt.status, evnt);
            });
        },
        status: function (code, handler) {
            return this.once(_.simpleObject('status:' + code, handler));
        },
        setHeaders: function (headers) {
            var ajax = this,
                xhrReq = ajax.requestObject;
            _.each(headers, function (val, key) {
                xhrReq.setRequestHeader(_.unCamelCase(key), val);
            });
            return ajax;
        },
        /**
         * @description specialized function to stringify url if it is an object
         * @returns {string} returns the completed string that will be fetched / posted / put / or deleted against
         * @name Ajax#getUrl
         */
        getUrl: function () {
            var url = this.get('url');
            if (_.isObject(url) && !_.isArray(url)) {
                url = _.stringifyQuery(url);
            }
            return url;
        },
        /**
         * @description makes public the ability to attach a response handler if one has not already been attached. We recommend not passing a function in and instead just listening to the various events that the xhr object will trigger directly, or indirectly on the ajax object
         * @param {function} [fn=handler] - pass in a function to have a custom onload, onreadystatechange handler
         * @returns {ajax}
         * @name Ajax#attachResponseHandler
         */
        attachResponseHandler: function (fn) {
            var ajax = this,
                xhrReqObj = ajax.requestObject,
                hasSucceeded = 0,
                method = ajax.get('method'),
                handler = function (evnt) {
                    var doIt, responseTxt, xhrReqObj = this;
                    if (xhrReqObj && !hasSucceeded) {
                        responseTxt = xhrReqObj.responseText;
                        ajax.dispatchEvent('readychange', [evnt, xhrReqObj]);
                        if (method === 'onreadystatechange') {
                            if (xhrReqObj.readyState === 4) {
                                doIt = 1;
                            }
                        }
                        if (method === 'onload') {
                            doIt = 1;
                        }
                        if (doIt) {
                            if ((xhrReqObj.status >= 200 && xhrReqObj.status <= 205) || xhrReqObj.status === 304 || xhrReqObj.status === 302) {
                                responseTxt = _.parse(responseTxt);
                                ajax.resolve(responseTxt);
                                ajax.dispatchEvent('load', [responseTxt, evnt, xhrReqObj]);
                                hasSucceeded = 1;
                            } else {
                                ajax.reject(evnt, responseTxt);
                            }
                        }
                    }
                };
            if (_.isFunction(fn)) {
                handler = fn;
            }
            if (!xhrReqObj[method]) {
                xhrReqObj[method] = handler;
            }
            return ajax;
        }
    }, !0);
});
application.scope().module('Associator', function (module, app, _) {
    /**
     * @class Associator
     * @augments Model
     */
    var lengthString = 'length';
    _.extendFrom.Model('Associator', {
        /**
         * @func
         * @name Associator#get
         * @param {Object} obj - object that data is being gotten against in the Associator
         * @param {String} [type] - toString version of the object being passed in
         */
        get: function (obj, type) {
            var returnData, idxOf, dataset, n, els, dataArray, current,
                instance = this,
                canRead = 0,
                data = {
                    dataset: {}
                };
            current = this.sameType(obj);
            els = current.items;
            dataArray = current.data;
            if (!els) {
                els = current.items = [];
            }
            if (!dataArray) {
                dataArray = current.data = [];
            }
            if (obj && _.isDom && current.readData) {
                dataset = obj.dataset;
                // copy dataset over from one to the other
                if (_.isObject(dataset) && _.isDom(obj)) {
                    data.dataset = _.extend(data.dataset, dataset);
                }
            }
            idxOf = current.items.indexOf(obj);
            if (idxOf === -1) {
                idxOf = current.items[lengthString];
                current.items.push(obj);
                dataArray[idxOf] = data;
            }
            return dataArray[idxOf];
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
            _.extend(data, extensor || {});
            return data;
        },
        remove: function (el) {
            var type = this.sameType(el);
            var idx = _.indexOf(type.items, el);
            var ret = _.removeAt(type.data, idx);
            _.removeAt(type.items, idx);
            return ret;
        },
        /**
         * @func
         * @name Associator#sameType
         * @param {Object} obj - object to find matched types against
         */
        sameType: function (obj) {
            var instance = this,
                type = _.toString(obj),
                current = instance[type],
                lowerType = type.toLowerCase();
            if (!current) {
                // makes things easier to find
                current = instance[type] = {};
            }
            // skip reading data
            if (lowerType.indexOf('global') === -1 && lowerType.indexOf('window') === -1) {
                current.readData = 1;
            }
            return current;
        }
    }, !0);
    _.exports({
        associator: _.Associator()
    });
});
application.scope().module('DOMM', function (module, app, _) {
    var blank, sizzleDoc = document,
        eq = _.eq,
        uniqueId = _.uniqueId,
        extendFrom = _.extendFrom,
        factories = _.factories,
        isFunction = _.isFunction,
        each = _.each,
        duff = _.duff,
        find = _.find,
        foldl = _.foldl,
        isString = _.isString,
        isObject = _.isObject,
        isNumber = _.isNumber,
        merge = _.merge,
        remove = _.splice,
        extend = _.extend,
        negate = _.negate,
        intendedObject = _.intendedObject,
        isInstance = _.isInstance,
        isBlank = _.isBlank,
        gapJoin = _.gapJoin,
        isArray = _.isArray,
        toArray = _.toArray,
        duffRev = _.duffRev,
        indexOf = _.indexOf,
        listHas = _.listHas,
        gapSplit = _.gapSplit,
        // dataCache = _.associator,
        camelCase = _.camelCase,
        unCamelCase = _.unCamelCase,
        objCondense = _.objCondense,
        parseDecimal = _.parseDecimal,
        LENGTH_STRING = 'length',
        itemsString = '_items',
        __delegateCountString = '__delegateCount',
        removeQueueString = 'removeQueue',
        addQueueString = 'addQueue',
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        getComputed = window.getComputedStyle,
        allStyles = getComputed(sizzleDoc.body),
        devicePixelRatio = (window.devicePixelRatio || 1),
        ua = navigator.userAgent,
        /**
         * @func
         */
        isAndroid = function () {
            return ua.match(/Android/i);
        },
        /**
         * @func
         */
        isBlackBerry = function () {
            return ua.match(/BlackBerry/i);
        },
        /**
         * @func
         */
        isIos = function () {
            return ua.match(/iPhone|iPad|iPod/i);
        },
        /**
         * @func
         */
        isOpera = function () {
            return ua.match(/Opera Mini/i);
        },
        /**
         * @func
         */
        isWindows = function () {
            return ua.match(/IEMobile/i);
        },
        ELID_STRING = '__elid__',
        __privateDataCache__ = {},
        elementData = {
            make: function (el) {
                var elId = el[ELID_STRING] = uniqueId('elid');
                var ret = __privateDataCache__[elId] = __privateDataCache__[elId] || {
                    dataset: {},
                    queued: {},
                    handlers: {},
                    events: {}
                };
                return ret;
            },
            get: function (el) {
                var id = el[ELID_STRING];
                var ret = id ? (__privateDataCache__[id] = __privateDataCache__[id] || this.make(el)) : this.make(el);
                return ret;
            },
            remove: function (el) {
                var id = el[ELID_STRING];
                __privateDataCache__[id] = el[ELID_STRING] = void 0;
                return id;
            }
        },
        internalListAddRemove = function (keymaker, itemmaker) {
            return function (setto) {
                return function (base, items, subdata_, dirtifier) {
                    var ret, subdata;
                    if (items && items.length) {
                        subdata = subdata_ || this.get(base);
                        ret = !subdata.loaded && this.load(base, subdata);
                        subdata.dirty = !dirtifier;
                        // each item that i was passed
                        duff(gapSplit(items), function (item) {
                            var listitem, key = keymaker(item),
                                index = subdata.hash[item];
                            // do i have you?
                            if (index === blank) {
                                // lets make you
                                listitem = itemmaker(subdata, key);
                                // do i want you after you have been made?
                                if (listitem) {
                                    index = subdata.hash[item] = subdata.list.length;
                                    subdata.list.push(listitem);
                                }
                            }
                            // are you made and did i want you?
                            if (index + 1) {
                                listitem = subdata.list[index];
                                setto(listitem, index, key, subdata);
                            }
                        });
                    }
                };
            };
        },
        listAddRemove = function (datastorage, propertyname, getter, setter, keymaker, itemmaker) {
            var madewithkey = internalListAddRemove(keymaker, itemmaker);
            return {
                add: madewithkey(function (listitem, index, key, subdata) {
                    listitem.flag = BOOLEAN_TRUE;
                }),
                remove: madewithkey(function (listitem, index, key, subdata) {
                    listitem.flag = BOOLEAN_FALSE;
                }),
                toggle: madewithkey(function (listitem, index, key, subdata) {
                    listitem.flag = !listitem.flag;
                }),
                load: function (base, subdata_) {
                    var subdata = subdata_ || this.get(base);
                    // don't call this function again
                    subdata.loaded = true;
                    // load all of the base data
                    this.add(base, getter(base), subdata, true);
                },
                unload: function (base, subdata_) {
                    var subdata = subdata_ || this.get(base);
                    // check to make sure it has at least been loaded
                    if (subdata.loaded && subdata.dirty) {
                        setter(base, subdata.list);
                        this.reset();
                    }
                },
                // requires base object that data is tied to
                get: function (base) {
                    var data = datastorage.get(base),
                        queued = data.queued;
                    queued[propertyname] = queued[propertyname] || this.reset();
                    return queued[propertyname];
                },
                // requires subdata
                reset: function (queued) {
                    return {
                        loaded: false,
                        dirty: false,
                        list: [],
                        hash: {}
                    };
                }
            };
        },
        getClassName = function (el) {
            var className = el.className;
            if (!isString(className)) {
                className = el.getAttribute('class') || '';
            }
            return className;
        },
        setClassName = function (el, val) {
            var value = val.join('');
            if (isString(el.className)) {
                el.className = value;
            } else {
                el.setAttribute('class', value);
            }
        },
        queuedata = {
            className: listAddRemove(elementData, 'className', getClassName, setClassName, function (item) {
                return item;
            }, function (subdata, item) {
                return item ? {
                    valueOf: function () {
                        return item;
                    },
                    toString: function () {
                        var adding = this.flag,
                            classname = adding ? item : '',
                            value = (adding && !subdata.firstAdded ? '' : ' ');
                        if (classname) {
                            subdata.firstAdded = true;
                        }
                        return value + classname;
                    }
                } : false;
            })
        },
        /**
         * @func
         */
        // isTablet = function () {
        //     return ua.match(/Mobile|iPad|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/);
        // },
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rforceEvent = /^webkitmouseforce/,
        /**
         * @func
         */
        isMobile = function () {
            return (isAndroid() || isBlackBerry() || isIos() || isOpera() || isWindows());
        },
        /**
         * @func
         */
        isTouch = function () {
            var ret = BOOLEAN_FALSE;
            if ('ontouchstart' in window || 'onmsgesturechange' in window) {
                ret = BOOLEAN_TRUE;
            }
            if (window.DocumentTouch) {
                ret = sizzleDoc instanceof window.DocumentTouch;
            }
            return ret;
        },
        hasWebP = (function () {
            var len = 4,
                result = BOOLEAN_TRUE,
                queue = [],
                emptyqueue = function (fn) {
                    return function () {
                        len--;
                        fn();
                        if (!len) {
                            duff(queue, function (item) {
                                item(result);
                            });
                            queue = [];
                        }
                    };
                };
            duff(["UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==", "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==", "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"], function (val) {
                var img = new Image();
                img.onload = emptyqueue(function () {
                    // is this code even doing anything?
                    // if (result && (img.width > 0) && (img.height > 0)) {
                    //     result = result;
                    // }
                });
                img.onerror = emptyqueue(function () {
                    result = false;
                });
                img.src = "data:image/webp;base64," + val;
            });
            return function (cb) {
                if (!len || !result) {
                    cb(result);
                } else {
                    queue.push(cb);
                }
            };
        }()),
        /**
         * @func
         */
        deviceCheck = _.wrap({
            isAndroid: isAndroid,
            isBlackBerry: isBlackBerry,
            isIos: isIos,
            isOpera: isOpera,
            isWindows: isWindows,
            isMobile: isMobile,
            isTouch: isTouch
        }, function (fn) {
            return !!(fn());
        }),
        saveDOMContentLoadedEvent = function (doc) {
            var data = elementData.get(doc);
            if (data.isReady === void 0) {
                data.isReady = BOOLEAN_FALSE;
                _.DOMM(doc).on('DOMContentLoaded', function (e) {
                    data.DOMContentLoadedEvent = e;
                    data.isReady = BOOLEAN_TRUE;
                });
            }
        },
        _DOMM = _.factories._DOMM = function (doc) {
            saveDOMContentLoadedEvent(doc);
            return function (sel, ctx) {
                return _.DOMM(sel, ctx || doc);
            };
        },
        triggerEventWrapper = function (attr, api) {
            attr = attr || api;
            return function (fn, fn2) {
                var args, evnt, count = 0,
                    domm = this;
                if (isFunction(fn) || isFunction(fn2)) {
                    args = toArray(arguments);
                    args.unshift(attr);
                    domm.on.apply(domm, args);
                } else {
                    domm.duff(function (el) {
                        var whichever = api || attr;
                        if (isFunction(el[whichever])) {
                            el[whichever]();
                        } else {
                            $(el).dispatchEvent(whichever);
                        }
                    });
                }
                return domm;
            };
        },
        /**
         * @private
         * @func
         */
        htmlDataMatch = function (string, regexp, callback, nameFinder) {
            var matches = string.trim().match(regexp);
            duff(matches, function (idx, match) {
                var value;
                match = match.trim();
                value = match.match(/~*=[\'|\"](.*?)[\'|\"]/);
                name = match.match(/(.*)(?:~*=)/igm);
                name = _.join(_.split(name, '='), '').trim();
                callback(value[1], name, match);
            });
        },
        Events = gapSplit('abort afterprint beforeprint blocked cached canplay canplaythrough change chargingchange chargingtimechange checking close complete dischargingtimechange DOMContentLoaded downloading durationchange emptied ended error fullscreenchange fullscreenerror input invalid languagechange levelchange loadeddata loadedmetadata message noupdate obsolete offline online open pagehide pageshow paste pause pointerlockchange pointerlockerror play playing ratechange reset seeked seeking stalled storage submit success suspend timeupdate updateready upgradeneeded versionchange visibilitychange'),
        SVGEvent = gapSplit('SVGAbort SVGError SVGLoad SVGResize SVGScroll SVGUnload SVGZoom volumechange waiting'),
        KeyboardEvent = gapSplit('keydown keypress keyup'),
        GamePadEvent = gapSplit('gamepadconnected gamepadisconnected'),
        CompositionEvent = gapSplit('compositionend compositionstart compositionupdate drag dragend dragenter dragleave dragover dragstart drop'),
        MouseEvents = gapSplit('click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup show wheel'),
        TouchEvents = gapSplit('touchcancel touchend touchenter touchleave touchmove touchstart'),
        DeviceEvents = gapSplit('devicemotion deviceorientation deviceproximity devicelight'),
        FocusEvent = gapSplit('blur focus'),
        // BeforeUnloadEvent = gapSplit(''),
        TimeEvent = gapSplit('beginEvent endEvent repeatEvent'),
        AnimationEvent = gapSplit('animationend animationiteration animationstart transitionend'),
        AudioProcessingEvent = gapSplit('audioprocess complete'),
        UIEvents = gapSplit('abort error hashchange load orientationchange readystatechange resize scroll select unload beforeunload'),
        ProgressEvent = gapSplit('abort error load loadend loadstart popstate progress timeout'),
        AllEvents = _.concatUnique(Events, SVGEvent, KeyboardEvent, CompositionEvent, GamePadEvent, MouseEvents, TouchEvents, DeviceEvents, FocusEvent, TimeEvent, AnimationEvent, AudioProcessingEvent, UIEvents, ProgressEvent),
        knownPrefixes = gapSplit('-o- -ms- -moz- -webkit- mso- -xv- -atsc- -wap- -khtml- -apple- prince- -ah- -hp- -ro- -rim- -tc-'),
        trustedEvents = gapSplit('load scroll resize orientationchange click dblclick mousedown mouseup mouseover mouseout mouseenter mouseleave mousemove change contextmenu hashchange load mousewheel wheel readystatechange'),
        setClass = function (el, val) {
            if (isString(el.className)) {
                el.className = val;
            } else {
                el.setAttribute('class', val);
            }
        },
        knownPrefixesHash = _.wrap(knownPrefixes, true),
        /**
         * @private
         * @func
         */
        getClass = function (el) {
            var className = el.className;
            if (!isString(className)) {
                className = el.getAttribute('class') || '';
            }
            return gapSplit(className);
        },
        changeClass = function (el, remove, add) {
            var subdata = queuedata.className.get(el);
            queuedata.className.remove(el, remove, subdata);
            queuedata.className.add(el, add, subdata);
            queuedata.className.unload(el, subdata);
        },
        removeClass = function (el, remove) {
            var subdata = queuedata.className.get(el);
            queuedata.className.remove(el, remove, subdata);
            queuedata.className.unload(el, subdata);
        },
        addClass = function (el, add) {
            var subdata = queuedata.className.get(el);
            queuedata.className.add(el, add, subdata);
            queuedata.className.unload(el, subdata);
        },
        eventNameProperties = function (str) {},
        /**
         * @private
         * @func
         */
        toStyleString = function (css) {
            var cssString = [];
            each(css, function (name, val) {
                var nameSplit;
                name = unCamelCase(name);
                nameSplit = name.split('-');
                if (knownPrefixesHash[nameSplit[0]]) {
                    nameSplit.unshift('');
                }
                name = nameSplit.join('-');
                cssString.push(name + ': ' + val + ';');
            });
            return cssString.join(' ');
        },
        // toCssObject = function () {},
        /**
         * @private
         * @func
         */
        isDom = function (el) {
            var hasAttr, retVal = BOOLEAN_FALSE;
            if (isObject(el)) {
                if (isObject(el.style)) {
                    if (isString(el.tagName)) {
                        if (isFunction(el.getBoundingClientRect)) {
                            retVal = BOOLEAN_TRUE;
                        }
                    }
                }
            }
            return retVal;
        },
        ensureDOM = function (fn) {
            return function (el) {
                if (isDom(el)) {
                    fn(el);
                }
            };
        },
        /**
         * @private
         * @func
         */
        // returns the flow of the element passed on relative to the element's bounding window
        position = function (el) {
            var clientRect = el.getBoundingClientRect(),
                computedStyle = getComputed(el),
                marginTop = parseFloat(computedStyle.marginTop),
                marginLeft = parseFloat(computedStyle.marginLeft),
                marginRight = parseFloat(computedStyle.marginRight),
                marginBottom = parseFloat(computedStyle.marginBottom);
            return {
                height: clientRect.height,
                width: clientRect.width,
                top: clientRect.top - marginTop,
                left: clientRect.left - marginLeft,
                right: clientRect.left - marginLeft + clientRect.width - marginRight,
                bottom: clientRect.top - marginTop + clientRect.height - marginBottom
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
        css = (function () {
            var i, j, n, found, prefixIndex, __prefix, styleName, currentCheck, deprefixed, currentLen,
                validCssNames = [],
                prefixed = {},
                len = 0,
                valueModifiers = {
                    '-webkit-transform': function (val) {
                        return val;
                    }
                },
                modifyFinalProp = function (prop, val) {
                    if (valueModifiers[prop]) {
                        val = valueModifiers[prop](val);
                    }
                    return val;
                },
                addPrefix = function (list, prefix) {
                    if (!_.listHas(list, __prefix)) {
                        list.push(__prefix);
                    }
                };
            for (i = 0; i < knownPrefixes[LENGTH_STRING]; i++) {
                currentLen = knownPrefixes[i][LENGTH_STRING];
                if (len < currentLen) {
                    len = currentLen;
                }
            }
            for (n in allStyles) {
                found = 0;
                currentCheck = '';
                __prefix = '';
                if (isNumber(+n)) {
                    styleName = allStyles[n];
                } else {
                    styleName = unCamelCase(n);
                }
                deprefixed = styleName;
                for (j = 0; j < len && styleName[j] && !found; j++) {
                    currentCheck += styleName[j];
                    prefixIndex = indexOf(knownPrefixes, currentCheck);
                    if (prefixIndex !== -1) {
                        __prefix = knownPrefixes[prefixIndex];
                        deprefixed = styleName.split(__prefix).join('');
                        found = 1;
                    }
                    prefixIndex = indexOf(knownPrefixes, '-' + currentCheck);
                    if (prefixIndex !== -1) {
                        __prefix = knownPrefixes[prefixIndex];
                        deprefixed = styleName.split(currentCheck).join('');
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
            return function (el, key, value) {
                var n, m, j, firstEl, lastKey, prefixes, unCameled, computed, _ret, retObj, finalProp, i = 0,
                    ret = {},
                    count = 0,
                    nuCss = {};
                if (isObject(el)) {
                    if (_.isBool(obj)) {
                        obj = el;
                        retObj = 1;
                    }
                    firstEl = el[0];
                    intendedObject(key, value, function (key, value) {
                        if (!isBlank(value)) {
                            count++;
                            prefixes = [''];
                            if (prefixed[m]) {
                                prefixes = prefixed[m].concat(prefixes);
                            }
                            for (j = 0; j < prefixes[LENGTH_STRING]; j++) {
                                finalProp = camelCase(prefixes[j] + m);
                                nuCss[finalProp] = modifyFinalProp(finalProp, value);
                            }
                        } else {
                            ret[m] = value;
                        }
                    });
                    if (retObj) {
                        return nuCss;
                    }
                    if (isDom(el)) {
                        el = [el];
                    }
                    if (!count) {
                        if (isDom(firstEl)) {
                            _ret = {};
                            computed = getComputed(firstEl);
                            count--;
                            each(ret, function (val_, key, obj) {
                                _ret[key] = convertStyleValue(key, computed[key]);
                                count++;
                                lastKey = key;
                            });
                            if (count + 1) {
                                if (count) {
                                    return _ret;
                                } else {
                                    return _ret[lastKey];
                                }
                            }
                        }
                    } else {
                        style(el, nuCss);
                    }
                }
            };
        }()),
        convertStyleValue = function (key, value_) {
            var value = value_;
            if (value === +value) {
                if (timeBasedCss[key]) {
                    value += 'ms';
                }
                if (!numberBasedCss[key]) {
                    value += 'px';
                }
            }
            return value;
        },
        style = function (els, key, value) {
            if (els[LENGTH_STRING]) {
                intendedObject(key, value, function (key, value_) {
                    var value = convertStyleValue(value_);
                    duff(els, ensureDOM(function (el) {
                        el.style[key] = value;
                    }));
                });
            }
        },
        prefixer = function (obj) {
            var rez = css(obj, BOOLEAN_TRUE);
            return rez;
        },
        jsToCss = function (obj) {
            var nuObj = {};
            each(obj, function (key, val) {
                var deCameled = unCamelCase(key),
                    split = deCameled.split('-'),
                    starter = split[0],
                    idx = indexOf(knownPrefixes, '-' + starter + '-');
                if (idx !== -1) {
                    split[0] = '-' + starter;
                }
                nuObj[split.join('-')] = val;
            });
            return nuObj;
        },
        /**
         * @private
         * @func
         */
        box = function (el) {
            var computed, ret = {};
            if (isDom(el)) {
                computed = getComputed(el);
                ret = merge({
                    borderBottom: parseFloat(computed.borderBottomWidth) || 0,
                    borderRight: parseFloat(computed.borderRightWidth) || 0,
                    borderLeft: parseFloat(computed.borderLeftWidth) || 0,
                    borderTop: parseFloat(computed.borderTopWidth) || 0,
                    paddingBottom: parseFloat(computed.paddingBottom) || 0,
                    paddingRight: parseFloat(computed.paddingRight) || 0,
                    paddingLeft: parseFloat(computed.paddingLeft) || 0,
                    paddingTop: parseFloat(computed.paddingTop) || 0,
                    marginBottom: parseFloat(computed.marginBottom) || 0,
                    marginRight: parseFloat(computed.marginRight) || 0,
                    marginLeft: parseFloat(computed.marginLeft) || 0,
                    marginTop: parseFloat(computed.marginTop) || 0,
                    computedBottom: parseFloat(computed.bottom) || 0,
                    computedRight: parseFloat(computed.right) || 0,
                    computedLeft: parseFloat(computed.left) || 0,
                    computedTop: parseFloat(computed.top) || 0
                }, clientRect(el));
            }
            return ret;
        },
        clientRect = function (item) {
            var ret = {};
            if (item) {
                if (isDom(item) && item.parentNode) {
                    ret = item.getBoundingClientRect();
                }
            }
            return extend({
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: 0,
                height: 0
            }, ret);
        },
        /**
         * @private
         * @func
         */
        unitRemoval = function (str, unit) {
            return parseFloat(str.split(unit || 'px').join('').trim()) || 0;
        },
        /**
         * @private
         * @func
         */
        getStyleSize = function (el, attr) {
            var val, elStyle, num = el;
            if (isObject(el)) {
                if (isDom(el)) {
                    elStyle = getComputed(el);
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
        numToUnitsConverters = {
            'in': function (val, el, win, styleAttr) {
                return val / 96;
            },
            vh: function (val, el, win, styleAttr) {
                return (val / win.innerHeight) * 100;
            },
            px: function (val, el, win, styleAttr) {
                return val;
            },
            cm: function (val, el, win, styleAttr) {
                return val / 37.79527559055118;
            },
            vw: function (val, el, win, styleAttr) {
                return (val / win.innerWidth) * 100;
            },
            em: function (val, el, win, styleAttr) {
                return val / getStyleSize(el, 'fontSize');
            },
            mm: function (val, el, win, styleAttr) {
                return val / 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                var mult = Math.min(win.innerHeight, win.innerWidth);
                return (val / mult) * 100;
            },
            rem: function (val, el, win, styleAttr) {
                return val / getStyleSize(win.document.body.parentNode, 'fontSize');
            },
            pt: function (val, el, win, styleAttr) {
                return val / 1.333333333333333;
            },
            vmax: function (val, el, win, styleAttr) {
                var mult = Math.max(win.innerHeight, win.innerWidth);
                return (val / mult) * 100;
            },
            '%': function (val, el, win, styleAttr) {
                var parent = _.isDom(el) ? el.parentNode : el,
                    _val = getStyleSize(parent, styleAttr);
                return (val / _val) * 100;
            },
            pc: function (val, el, win, styleAttr) {
                return val / 16;
            }
        },
        numToUnits = function (num, unit, el, winTop, styleAttr, returnNum) {
            var number = num;
            if (num) {
                number = numToUnitsConverters[unit](num, el, winTop, styleAttr);
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
        unitsToNumConverters = {
            // 'in'
            // vh
            // px
            // cm
            // vw
            // em
            // mm
            // vmin
            // rem
            // pt
            // vmax
            // '%'
            // pc
            'in': function (val, el, win, styleAttr) {
                return val * 96;
            },
            vh: function (val, el, win, styleAttr) {
                return win.innerHeight * val / 100;
            },
            px: function (val, el, win, styleAttr) {
                return val;
            },
            cm: function (val, el, win, styleAttr) {
                return val * 37.79527559055118;
            },
            vw: function (val, el, win, styleAttr) {
                return win.innerWidth * val / 100;
            },
            em: function (val, el, win, styleAttr) {
                return getStyleSize(el, 'fontSize') * val;
            },
            mm: function (val, el, win, styleAttr) {
                return val * 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                return ((Math.min(win.innerHeight, win.innerWidth) || 1) * val / 100);
            },
            rem: function (val, el, win, styleAttr) {
                return getStyleSize(win.document.body.parentNode, 'fontSize') * val;
            },
            pt: function (val, el, win, styleAttr) {
                return val * 1.333333333333333;
            },
            vmax: function (val, el, win, styleAttr) {
                return ((Math.max(win.innerHeight, win.innerWidth) || 1) * val / 100);
            },
            '%': function (val, el, win, styleAttr) {
                var parent = _.isDom(el) ? el.parentNode : el,
                    _val = getStyleSize(parent, styleAttr);
                return (val * _val) / 100;
            },
            pc: function (val, el, win, styleAttr) {
                return val * 16;
            }
        },
        unitsToNum = function (str, el, winTop, styleAttr) {
            var ret, number, unit = _.units(str);
            if (unit) {
                number = +(str.split(unit).join('')) || 0;
                if (unitsToNumConverters[unit]) {
                    number = unitsToNumConverters[unit](number, el, winTop, styleAttr) || 0;
                }
            } else {
                // you passed in a number
                number = str;
            }
            return number;
        },
        /**
         * @private
         * @func
         */
        containsClass = function (el, className) {
            var idxOf, original = getClass(el),
                nuClasses = gapSplit(className),
                nuClassesLen = nuClasses[LENGTH_STRING],
                i = 0,
                has = 0;
            for (; i < nuClassesLen; i++) {
                idxOf = indexOf(original, nuClasses[i]);
                if (idxOf !== -1) {
                    has++;
                }
            }
            return (has === nuClassesLen);
        },
        /**
         * @private
         * @func
         */
        tagIs = function (el, str) {
            var tagName;
            if (el && isObject(el)) {
                tagName = el.tagName;
                if (isString(tagName)) {
                    return tagName.toLowerCase() === str.toLowerCase();
                }
            }
        },
        /**
         * @private
         * @func
         */
        isWin = function (obj) {
            return obj && obj === obj.window;
        },
        /**
         * @private
         * @func
         */
        isDoc = function (obj) {
            return obj && isNumber(obj.nodeType) && obj.nodeType === obj.DOCUMENT_NODE;
        },
        isFrag = function (frag) {
            return frag && frag.nodeType === sizzleDoc.DOCUMENT_FRAGMENT_NODE;
        },
        /**
         * @private
         * @func
         */
        isTrustedEvent = function (name) {
            return (indexOf(trustedEvents, name) !== -1);
        },
        /**
         * @private
         * @func
         */
        createEl = function (str) {
            return sizzleDoc.createElement(str);
        },
        makeEmptyFrame = function (str) {
            var frame, div = createEl('div');
            div.innerHTML = str;
            frame = div.children[0];
            return $(frame);
        },
        makeTree = function (str) {
            var div = createEl('div');
            div.innerHTML = str;
            return $(div.children).remove().un();
        },
        /**
         * @private
         * @func
         */
        // makeScriptTag = function (src) {
        //     var scriptTag = createEl('script');
        //     scriptTag.type = 'text/javascript';
        //     scriptTag.src = src;
        //     return scriptTag;
        // },
        /**
         * @private
         * @func
         */
        matches = function (element, selector) {
            var match, parent, temp, matchesSelector;
            if (!selector || !element || element.nodeType !== 1) {
                return BOOLEAN_FALSE;
            }
            matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
            if (matchesSelector) {
                return matchesSelector.call(element, selector);
            }
            // fall back to performing a selector:
            parent = element.parentNode;
            temp = !parent;
            if (temp) {
                parent = createEl('div');
                parent.appendChild(element);
            }
            // temp && tempParent.removeChild(element);
            return !!_.posit(_.Sizzle(selector, parent), element);
        },
        setAttribute = function (el, key, val) {
            if (val === true) {
                val = '';
            }
            val = _.stringify(val);
            val += '';
            el.setAttribute(key, val);
        },
        getAttribute = function (el, key, val) {
            var converted;
            val = el.getAttribute(key);
            if (val === '') {
                val = BOOLEAN_TRUE;
            }
            if (isString(val)) {
                if (val[0] === '{' || val[0] === '[') {
                    val = JSON.parse(val);
                } else {
                    converted = +val;
                    if (converted === converted) {
                        val = converted;
                    } else {
                        // if for whatever reason you have a function
                        if (val[val.length - 1] === '}') {
                            if (val.slice(0, 8) === 'function') {
                                val = new Function.constructor('return ' + val);
                            }
                        }
                    }
                }
            } else {
                if (isBlank(val)) {
                    val = BOOLEAN_FALSE;
                }
            }
            return val;
        },
        /**
         * @private
         * @func
         */
        attributeInterface = function (el, key, val) {
            // set or remove if not undefined
            // undefined fills in the gap by returning some value, which is never undefined
            if (val !== blank) {
                if (!val && val !== 0) {
                    el.removeAttribute(key);
                } else {
                    setAttribute(el, key, val);
                }
            } else {
                return getAttribute(el, key, val);
            }
        },
        /**
         * @private
         * @func
         */
        eachProc = function (fn) {
            return function () {
                var args = toArray(arguments),
                    domm = this;
                args.unshift(domm);
                domm.duff(function (el) {
                    args[0] = el;
                    fn.apply(domm, args);
                });
                return domm;
            };
        },
        /**
         * @private
         * @func
         */
        makeEl = function (tagName) {
            return $(foldl(gapSplit(tagName), function (memo, name) {
                memo.push(createEl(name));
                return memo;
            }, []));
        },
        createDocFrag = function () {
            return sizzleDoc.createDocumentFragment();
        },
        frag = function (el) {
            var frag = createDocFrag(),
                els = el[itemsString] || el;
            if (!_.isArrayLike(els)) {
                els = [els];
            }
            duff(els, function (el) {
                frag.appendChild(el);
            });
            return frag;
        },
        makeEls = function (arr, tag, style, props, attrs) {
            var frag = createDocFrag();
            map(arr, function (idx, str) {
                var div = createEl(tag || 'div');
                div.innerHTML = str;
                each(style, function (key, val) {
                    div.style[key] = val;
                });
                each(props, function (key, val) {
                    div[key] = val;
                });
                each(attrs, function (key, val) {
                    attributeInterface(div, key, val);
                });
                frag.appendChild(div);
            });
            return frag;
        },
        /**
         * @private
         * @func
         */
        htmlTextManipulator = function (attr) {
            return function (str) {
                var dom = this,
                    nuStr = '';
                if (isString(str)) {
                    return dom.duff(function (el) {
                        el[attr] = str;
                    });
                } else {
                    dom.duff(function (el) {
                        nuStr += el[attr];
                    });
                    return nuStr;
                }
            };
        },
        horizontalTraverser = function (_idxChange) {
            return attachPrevious(function (idxChange) {
                var domm = this,
                    collected = [],
                    list = domm[itemsString];
                idxChange = _idxChange || idxChange;
                if (idxChange) {
                    duff(list, function (idx_, el) {
                        var parent = el.parentNode,
                            idx = (indexOf(parent.children, el) + idxChange),
                            item = parent.children[idx];
                        if (item && !_.listHas(list, item)) {
                            _.add(collected, item);
                        }
                    });
                } else {
                    collected = list;
                }
                return collected;
            });
        },
        domAttrManipulator = function (fn, getData) {
            // cant wrap in each because need to return custom data
            return function (key, value) {
                var dataKeys = [],
                    dom = this,
                    ret = {},
                    count = 0,
                    cachedData = [],
                    domList = dom.un();
                // moved to outside because iterating over objects is more
                // time consuming than iterating over a straight list
                intendedObject(key, value, function (__key, val) {
                    var __keys = gapSplit(__key);
                    dataKeys.push(__key);
                    duff(domList, function (el, idx) {
                        var data;
                        if (getData) {
                            data = cachedData[idx] = cachedData[idx] || elementData.get(el);
                        }
                        duff(__keys, function (_key) {
                            var value = fn(el, _key, val, data, dom);
                            if (value !== blank) {
                                ret[_key] = value;
                                count++;
                            }
                        });
                    });
                });
                if (dataKeys[LENGTH_STRING] === 1) {
                    if (count === 1) {
                        ret = ret[dataKeys[0]];
                    } else {
                        if (!count) {
                            ret = dom;
                        }
                    }
                } else {
                    ret = dom;
                }
                return ret;
            };
        },
        attachPrevious = function (fn) {
            return function () {
                var prev = this;
                // ensures it's still a dom object
                var obj = $(fn.apply(this, arguments));
                obj._previous = prev;
                return obj;
            };
        },
        // coordinates
        covers = function (element, coords) {
            var _clientRect = clientRect(element),
                bottom = _clientRect.bottom,
                right = _clientRect.right,
                left = _clientRect.left,
                tippytop = _clientRect.top,
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
                x: clientRect.left + (clientRect.width / 2),
                y: clientRect.top + (clientRect.height / 2)
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
        flattenBlock = function (block, selector, spaced) {
            var children = [],
                _flat = {},
                flat = {};
            _.each(block, function (property, value) {
                var gah;
                if (_.isObject(value)) {
                    children.push(flattenBlock(value, selector + ' ' + property));
                } else {
                    flat[property] = value;
                }
            });
            _flat[selector] = flat;
            _flat = [_flat];
            return _flat.concat.apply(_flat, children);
        },
        buildBlocks = function (blocks) {
            var allBlocks = coll();
            _.each(blocks, function (block, selector) {
                allBlocks = allBlocks.concat(flattenBlock(block, selector));
            });
            return allBlocks;
        },
        stringifyPair = function (property, value) {
            return property + ':' + value + ';';
        },
        stringifyBlock = function (block, selector, opts) {
            var blockString = '' + selector + '{';
            opts = extend({
                line: '\n',
                tab: '\t',
                minify: 1
            }, opts || {});
            each(jsToCss(prefixer(block)), function (property, value) {
                if (_.isObject(value)) {
                    blockString += stringifyBlock(value, property, opts);
                } else {
                    blockString += stringifyPair(property, value);
                }
            });
            if (blockString[blockString[LENGTH_STRING] - 1] !== '{') {
                blockString += '}';
            } else {
                blockString = '';
            }
            return blockString;
        },
        buildStyles = function (obj, opts) {
            return coll(obj).foldl(function (memo, idx, item) {
                memo += buildBlocks(item).foldl(function (memo, idx, block) {
                    _.each(block, function (block, idx, selector) {
                        memo += stringifyBlock(block, selector, opts);
                    });
                    return memo;
                }, '');
                memo += '\n';
                return memo;
            }, '').split(' &').join('');
        },
        // parseEventName = function (name) {
        //     var ret = [
        //         [],
        //         []
        //     ];
        //     duff(gapSplit(name), function (nme) {
        //         var captures = BOOLEAN_FALSE;
        //         if (nme[0] === '_') {
        //             nme = nme.slice(1);
        //             captures = BOOLEAN_TRUE;
        //         }
        //         duff(gapSplit(eventExpander[nme] || nme), function (nm) {
        //             ret[0].push(nm);
        //             ret[1].push(captures);
        //         });
        //     });
        //     return ret;
        // },
        createSelector = function (domm, args, fn) {
            var fun, selector, name = args.shift();
            if (isString(args[0]) || isBlank(args[0])) {
                selector = args.shift();
            }
            // if (isFunction(args[0])) {
            //     args[0] = [args[0]];
            // }
            if (isFunction(args[0])) {
                fn = _.bind(fn, domm);
                fun = args[0];
                // duff(args[0], function (fun) {
                duff(gapSplit(name), function (nme) {
                    var split = eventToNamespace(nme),
                        captures = BOOLEAN_FALSE,
                        namespaceSplit = nme.split('.'),
                        nm = namespaceSplit.shift(),
                        namespace = namespaceSplit.join('.');
                    if (nm[0] === '_') {
                        nm = nm.slice(1);
                        captures = BOOLEAN_TRUE;
                    }
                    fn(nm, namespace, selector, fun, captures);
                });
            }
        },
        ensureOne = function (fn) {
            return function () {
                if (this.length()) {
                    fn.apply(this, arguments);
                }
                return this;
            };
        },
        expandEventListenerArguments = function (fn) {
            return ensureOne(function () {
                var args, obj, selector, domm = this;
                // if there's nothing selected, then do nothing
                args = toArray(arguments);
                obj = args.shift();
                if (isObject(obj)) {
                    if (isString(args[0])) {
                        selector = args.shift();
                    }
                    each(obj, function (key, handlers) {
                        createSelector(domm, [key, selector, handlers].concat(args), fn);
                    });
                } else {
                    args.unshift(obj);
                    createSelector(domm, args, fn);
                }
            });
        },
        validateEvent = function (evnt, el) {
            if (isString(evnt)) {
                evnt = {
                    type: evnt,
                    bubbles: BOOLEAN_FALSE,
                    eventPhase: 2,
                    cancelable: BOOLEAN_FALSE,
                    defaultPrevented: BOOLEAN_FALSE,
                    data: '',
                    isTrusted: BOOLEAN_FALSE,
                    timeStamp: _.nowish(),
                    target: el
                };
            }
            return evnt;
        },
        isCapturing = function (evnt) {
            var capturing = BOOLEAN_FALSE,
                eventPhase = evnt.eventPhase;
            if (eventPhase === 1) {
                capturing = BOOLEAN_TRUE;
            }
            if (eventPhase === 2 && !evnt.bubbles && isDom(evnt.srcElement)) {
                capturing = BOOLEAN_TRUE;
            }
            return capturing;
        },
        findMatch = function (el, target, selector) {
            var parent, found = null;
            if (selector && isString(selector)) {
                parent = target;
                while (parent && !found && isDom(parent) && parent !== el) {
                    if (matches(parent, selector)) {
                        found = parent;
                    }
                    parent = parent.parentNode;
                }
            }
            return found;
        },
        getMainHandler = function (data, name, capturing) {
            return data.handlers[capturing + ':' + name];
        },
        dispatchEvent = function (el, evnt, capturing, data, args, selector) {
            var e, gah, eventNameStack, capturingStack, events, stack, currentEventStack, selectorIsString, mainHandler, eventType, removeStack, $el, matches = 1;
            evnt = validateEvent(evnt, el);
            if (evnt && evnt.type) {
                capturing = !!capturing;
                if (!_.isObject(data)) {
                    data = elementData.get(el);
                }
                events = data.events;
                capturingStack = events[capturing];
                if (capturingStack) {
                    eventType = evnt.type;
                    eventNameStack = capturingStack[eventType];
                    // currentEventStack = data[currentEventStackString];
                    mainHandler = getMainHandler(data, eventType, capturing);
                    if (mainHandler) {
                        removeStack = mainHandler[removeQueueString];
                        $el = $(el);
                        e = new Event(evnt, el);
                        args = [e].concat(args || []);
                        // selectorIsString = isString(selector);
                        find(eventNameStack, function (obj) {
                            var selectorsMatch, ctx, originalTarget = e.currentTarget,
                                mainHandler = obj.mainHandler;
                            if (mainHandler.currentEvent) {
                                return BOOLEAN_TRUE;
                            }
                            mainHandler.currentEvent = obj;
                            if (obj && obj.persist && !obj.disabled) {
                                if (obj.selector) {
                                    ctx = findMatch(el, evnt.target, obj.selector);
                                    if (ctx) {
                                        e.currentTarget = ctx;
                                    } else {
                                        mainHandler.currentEvent = null;
                                        return;
                                    }
                                }
                                // e.type = obj.passedName;
                                obj.fn.apply(ctx || $el, args);
                            }
                            if (!obj.persist) {
                                // puts it on the event queue
                                removeEventQueue(obj);
                            }
                            e.currentTarget = originalTarget;
                            mainHandler.currentEvent = null;
                            return e.isImmediatePropagationStopped;
                        });
                        duffRev(removeStack, removeEventQueue);
                        while (mainHandler[addQueueString].length) {
                            addEventQueue(mainHandler[addQueueString][0]);
                            gah = mainHandler[addQueueString].shift();
                        }
                    }
                }
            }
        },
        matchesHandler = function (handler, obj) {
            return !handler || obj.fn === handler;
        },
        _eventExpander = (function (__obj) {
            var obj = {};
            each(__obj, function (key, val, object) {
                obj[key] = gapSplit(val);
            });
            return obj;
        }({
            deviceorientation: 'deviceorientation mozOrientation',
            fullscreenalter: 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange',
            hover: 'mouseenter mouseleave',
            forcetouch: 'webkitmouseforcewillbegin webkitmouseforcedown webkitmouseforceup webkitmouseforcechanged'
        })),
        distilledEventName = (function () {
            var obj = {};
            each(_eventExpander, function (key, arr) {
                duff(arr, function (idx, item) {
                    obj[item] = key;
                });
            });
            return obj;
        }()),
        eventExpander = function (fn_) {
            return function (nme, idx) {
                var fn = _.bind(fn_, this);
                duff(gapSplit(_eventExpander[nme] || nme), function (name, idx) {
                    fn(name, nme);
                });
            };
        },
        addEventListener = expandEventListenerArguments(function (name, namespace, selector, callback, capture) {
            var dom = this;
            if (isFunction(callback)) {
                dom.duff(function (el) {
                    _addEventListener(el, name, namespace, selector, callback, capture);
                });
            }
            return dom;
        }),
        eventToNamespace = function (evnt) {
            if (!isString(evnt)) {
                evnt = evnt.type;
            }
            evnt = evnt.split('.');
            var evntName = evnt.shift();
            return [evntName, evnt.sort().join('.')];
        },
        _addEventListener = function (el, types, namespace, selector, fn, capture) {
            var handleObj, eventHandler, data = elementData.get(el),
                handlers = data.handlers = data.handlers || {},
                events = data.events = data.events || {},
                capturehash = events[capture] = events[capture] || {};
            duff(gapSplit(types), eventExpander(function (name, passedName) {
                var attach, mainHandler, handlerKey = capture + ':' + name,
                    namespaceCache = capturehash[name] = capturehash[name] || [];
                mainHandler = handlers[handlerKey];
                if (!mainHandler) {
                    eventHandler = function (e) {
                        return dispatchEvent(this, e, capture, data);
                    };
                    handlers[handlerKey] = mainHandler = {
                        fn: eventHandler,
                        __delegateCount: 0,
                        addQueue: [],
                        removeQueue: [],
                        currentEvent: null,
                        capturing: capture
                    };
                    el.addEventListener(name, eventHandler, capture);
                }
                attach = _.find(namespaceCache, function (obj) {
                    // remove any duplicates
                    if (fn === obj.fn && obj.namespace === namespace && selector === obj.selector) {
                        return true;
                    }
                });
                if (!attach) {
                    addEventQueue({
                        fn: fn,
                        persist: BOOLEAN_TRUE,
                        disabled: BOOLEAN_FALSE,
                        list: namespaceCache,
                        namespace: namespace,
                        mainHandler: mainHandler,
                        selector: selector,
                        name: name,
                        passedName: passedName
                    });
                }
            }));
        },
        addEventQueue = function (obj) {
            var mainHandler = obj.mainHandler,
                selector = obj.selector;
            if (!mainHandler.currentEvent) {
                if (selector) {
                    obj.list.splice(mainHandler[__delegateCountString]++, 0, obj);
                } else {
                    obj.list.push(obj);
                }
            } else {
                mainHandler[addQueueString].push(obj);
            }
        },
        removeEventQueue = function (obj, idx) {
            var gah, mainHandler = obj.mainHandler,
                list = obj.list,
                selector = obj.selector;
            if (!mainHandler.currentEvent) {
                if (!obj.isDestroyed) {
                    obj.isDestroyed = true;
                    idx = idx === void 0 ? list.indexOf(obj) : idx;
                    if (idx + 1) {
                        if (selector) {
                            mainHandler[__delegateCountString]--;
                        }
                        gah = list.splice(idx, 1);
                    }
                    obj.list = null;
                }
            } else {
                if (obj.persist) {
                    mainHandler[removeQueueString].push(obj);
                }
            }
            obj.persist = BOOLEAN_FALSE;
        },
        ensureHandlers = function (fn) {
            return function (name) {
                // var args = toArray(arguments);
                var args = ['', blank, []],
                    origArgs = _.filter(arguments, negate(isBlank)),
                    argLen = origArgs.length;
                if (!isObject(name)) {
                    if (argLen === 1) {
                        args = [name, blank, [blank]];
                    }
                    if (argLen === 2) {
                        args = [name, blank, arguments[1]];
                    }
                }
                if (argLen === 3) {
                    args = arguments;
                }
                fn.apply(this, args);
            };
        },
        removeEventListener = ensureHandlers(expandEventListenerArguments(function (name, namespace, selector, handler, capture) {
            this.duff(function (idx, el) {
                _removeEventListener(el, name, namespace, selector, handler, capture);
            });
        })),
        removeEvent = function (obj) {
            var mainHandler = obj.mainHandler;
            if (obj.selector) {
                mainHandler[__delegateCountString] = Math.max(mainHandler[__delegateCountString] - 1, 0);
            }
            _.remove(obj.list, obj);
        },
        _removeEventListener = function (el, name, namespace, selector, handler, capture) {
            var objs, vent, current, data = elementData.get(el),
                // currentStack = data[currentEventStackString],
                events = data.events,
                removeFromList = function (list, name) {
                    duffRev(list, function (obj) {
                        if ((!name || name === obj.name) && (!handler || obj.fn === handler) && (!namespace || obj.namespace === namespace) && (!selector || obj.selector === selector)) {
                            removeEventQueue(obj);
                        }
                    });
                };
            if (events) {
                objs = events[capture];
                if (name) {
                    // scan a select list
                    removeFromList(objs[name], name);
                } else {
                    // scan all of the lists
                    each(objs, removeFromList);
                }
            }
        },
        /**
         * @class DOMM
         * @augments Model
         * @augments Collection
         */
        coll = _.Collection,
        Collection = _.factories.Collection,
        fixHooks = {
            // Includes some event props shared by KeyEvent and MouseEvent
            props: gapSplit("data altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which"),
            fixedHooks: {},
            keyHooks: {
                props: gapSplit("char charCode key keyCode"),
                filter: function (evnt, original) {
                    var charCode;
                    // Add which for key evnts
                    if (isBlank(evnt.which)) {
                        charCode = original.charCode;
                        evnt.which = !isBlank(charCode) ? charCode : original.keyCode;
                    }
                    return evnt;
                }
            },
            forceHooks: {
                props: [],
                filter: function (evnt, original) {
                    evnt.value = (original.webkitForce / 3) || original;
                    return evnt;
                }
            },
            mouseHooks: {
                props: gapSplit("button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement"),
                filter: function (evnt, original) {
                    var eventDoc, doc, body,
                        button = original.button;
                    // Calculate pageX/Y if missing and clientX/Y available
                    if (isBlank(evnt.pageX) && !isBlank(original.clientX)) {
                        evntDoc = evnt.target.ownerDocument || sizzleDoc;
                        doc = evntDoc.documentElement;
                        body = evntDoc.body;
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
                    if (!evnt.which && button !== undefined) {
                        evnt.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                    }
                    return evnt;
                }
            },
            make: function (evnt) {
                var doc, target, val, originalEvent = evnt.originalEvent,
                    // Create a writable copy of the event object and normalize some properties
                    i, prop, copy,
                    type = originalEvent.type,
                    fixHook = fixHooks.fixedHooks[type];
                if (!fixHook) {
                    fixHooks.fixedHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : rforceEvent.test(type) ? this.forceHooks : {};
                }
                copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
                i = copy.length;
                while (i--) {
                    prop = copy[i];
                    val = originalEvent[prop];
                    if (!isBlank(val)) {
                        evnt[prop] = val;
                    }
                }
                evnt.originalType = originalEvent.type;
                // Support: Cordova 2.5 (WebKit) (#13255)
                // All events should have a target; Cordova deviceready doesn't
                // ie also does not have a target... so use current target
                target = evnt.target || (evnt.view ? evnt.view.event.currentTarget : event.currentTarget);
                if (!target) {
                    target = evnt.target = sizzleDoc;
                }
                // Support: Safari 6.0+, Chrome<28
                // Target should not be a text node (#504, #13143)
                if (target.nodeType === 3) {
                    evnt.target = target.parentNode;
                }
                if (isFunction(fixHook.filter)) {
                    fixHook.filter(evnt, originalEvent);
                }
                evnt.type = distilledEventName[originalEvent.type] || originalEvent.type;
                evnt.data = originalEvent.data || '';
                evnt.isImmediatePropagationStopped = evnt.isPropagationStopped = evnt.isDefaultPrevented = BOOLEAN_FALSE;
                // special
                if (evnt.type === 'fullscreenchange') {
                    doc = evnt.target;
                    if (isWin(doc)) {
                        doc = doc.document;
                    } else {
                        while (doc && !isDoc(doc) && doc.parentNode) {
                            doc = doc.parentNode;
                        }
                    }
                    evnt.fullscreenDocument = doc;
                    if (isDoc(doc)) {
                        evnt.isFullScreen = (doc.fullScreen || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.fullscreenElement) ? true : false;
                    }
                }
                return evnt;
            }
        },
        Event = _.extendFrom.Model('Event', {
            constructor: function (evnt, el) {
                var e = this;
                e.originalEvent = evnt;
                fixHooks.make(e);
                evnt.delegateTarget = el;
                return e;
            },
            preventDefault: function () {
                var e = this.originalEvent;
                this.isDefaultPrevented = BOOLEAN_TRUE;
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
            },
            stopPropagation: function () {
                var e = this.originalEvent;
                this.isPropagationStopped = BOOLEAN_TRUE;
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
            },
            stopImmediatePropagation: function () {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = BOOLEAN_TRUE;
                if (e && e.stopImmediatePropagation) {
                    e.stopImmediatePropagation();
                }
                this.stopPropagation();
            }
        }, BOOLEAN_TRUE),
        createDomFilter = function (items, filtr) {
            var filter;
            if (isFunction(filtr)) {
                filter = filtr;
            } else {
                if (isObject(filtr)) {
                    if (isDom(filtr)) {
                        filter = function (el) {
                            return !!_.posit(items, el);
                        };
                    } else {
                        filter = _.matches(filtr);
                    }
                } else {
                    if (isString(filtr)) {
                        filter = filterExpressions[filtr];
                        if (!filter) {
                            filter = function (item) {
                                return matches(item, filtr);
                            };
                        }
                    } else {
                        if (isNumber(filtr)) {
                            filter = function (el, idx) {
                                return idx === filtr;
                            };
                        }
                    }
                }
            }
            return filter;
        },
        domFilter = function (items, filtr) {
            var filter = createDomFilter(items, filtr);
            return _.filter(items, filter);
        },
        dimFinder = function (element, doc, win) {
            return function (num) {
                var ret, el = this.get(num);
                if (isDom(el)) {
                    ret = clientRect(el)[element];
                } else {
                    if (isDoc(el) && el.body) {
                        ret = el.body[doc];
                    } else {
                        if (isWin(el)) {
                            ret = el[win];
                        }
                    }
                }
                return ret || 0;
            };
        },
        dommFind = attachPrevious(function (str) {
            var dom = this,
                matchers = [],
                passedString = isString(str);
            duff(dom.un(), function (el) {
                if (passedString) {
                    duff(_.Sizzle(str, el), function (el) {
                        matchers.push(el);
                    });
                } else {
                    matchers.push(el);
                }
            });
            return matchers;
        }),
        canBeProcessed = function (item) {
            return isDom(item) || isWin(item) || isDoc(item) || isFrag(item);
        },
        DOMM = factories.DOMM = _.extendFrom.Collection('DOMM', extend({
            /**
             * @func
             * @name DOMM#constructor
             * @param {String|Node|Function} str - string to query the dom with, or a function to run on document load, or an element to wrap in a DOMM instance
             * @returns {DOMM} instance
             */
            constructor: function (str, ctx) {
                var i, els, elsLen, $doc, docEl, docData, dom = this;
                if (isFunction(str)) {
                    if (_.isDoc(ctx)) {
                        $doc = $(ctx);
                        docEl = $doc.get();
                        docData = elementData.get(docEl);
                        if (docData.isReady) {
                            // make it async
                            setTimeout(function () {
                                str.apply($doc, [$, docData.DOMContentLoadedEvent]);
                            });
                            els = dom.un();
                        } else {
                            dom = $doc.on('DOMContentLoaded', function (e) {
                                _.unshift(args, $);
                                str.apply(this, args);
                            });
                            els = dom.un();
                        }
                    }
                } else {
                    if (isString(str)) {
                        if (str[0] === '<') {
                            els = makeTree(str);
                        } else {
                            els = _.Sizzle(str, ctx);
                        }
                    } else {
                        els = str;
                        if (canBeProcessed(els)) {
                            els = [els];
                        }
                    }
                }
                Collection.call(dom, els);
                return dom;
            },
            /**
             * @func
             * @name DOMM#isWin
             * @description asks if the first or specified index of the object is a window type object
             * @returns {Boolean}
             */
            isWin: function (num) {
                return isWin(this.index(num || 0) || {});
            },
            isDom: function (num) {
                return isDom(this.index(num || 0) || {});
            },
            /**
             * @func
             * @name DOMM#isDoc
             * @description asks if the first or specified index of the object is a document type object
             * @returns {Boolean}
             */
            isDoc: function (num) {
                return isDoc(this.index(num || 0) || {});
            },
            isFrag: function (num) {
                return isFrag(this.index(num || 0) || {});
            },
            frag: function (el) {
                return _.frag(el || this[itemsString]);
            },
            /**
             * @func
             * @name DOMM#filter
             * @param {String|Function|Object} filtr - filter variable that will filter by matching the object that is passed in, or by selector if it is a string, or simply with a custom function
             * @returns {DOMM} new DOMM instance object
             */
            filter: attachPrevious(function (filter) {
                return domFilter(this.un(), filter);
            }),
            /**
             * @func
             * @name DOMM#find
             * @param {String} str - string to use sizzle to find against
             * @returns {DOMM} matching elements
             */
            find: dommFind,
            $: dommFind,
            /**
             * @func
             * @name DOMM#children
             * @param {Number} [eq] - index of the children to gather. If none is provided, then all children will be added
             * @returns {DOMM} all / matching children
             */
            children: attachPrevious(function (eq) {
                var dom = this,
                    items = dom.un(),
                    filter = createDomFilter(items, eq);
                return foldl(items, function (memo, el) {
                    return foldl(el.children || el.childNodes, function (memo, child, idx, children) {
                        if (!filter || filter(child, idx, children)) {
                            memo.push(child);
                        }
                        return memo;
                    }, memo);
                }, []);
            }),
            /**
             * @func
             * @name DOMM#offAll
             * @returns {DOMM} instance
             */
            offAll: function () {
                return this.duff(function (el) {
                    var data = elementData.get(el);
                    each(data.handlers, function (key, fn, eH) {
                        var wasCapt, split = key.split(':');
                        eH[key] = blank;
                        wasCapt = data.events[split[0]];
                        if (wasCapt) {
                            wasCapt[split[1]] = [];
                        }
                    });
                    elementData.remove(el);
                });
            },
            /**
             * @name DOMM#off
             * @param {String|Function} type - event type
             * @param {Function} handler - specific event handler to be removed
             * @returns {DOMM} instnace
             */
            on: addEventListener,
            off: removeEventListener,
            addEventListener: addEventListener,
            removeEventListener: removeEventListener,
            dispatchEvent: expandEventListenerArguments(eachProc(dispatchEvent)),
            /**
             * @func
             * @name DOMM#once
             * @param {String} space delimited list of event names to attach handlers to
             * @param {Function} fn - handler to put on the event loop
             * @returns {DOMM} instance
             */
            once: expandEventListenerArguments(eachProc(function (el, types, namespace, selector, fn, capture) {
                var args = toArray(arguments);
                args[4] = _.once(function () {
                    _removeEventListener.apply(null, args);
                    return fn.apply(this, arguments);
                });
                _addEventListener.apply(null, args);
            })),
            /**
             * @func
             * @name DOMM#css
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM} instance
             */
            css: function (key, value) {
                var dom = this,
                    ret = css(dom[itemsString], key, value);
                if (isBlank(ret)) {
                    ret = dom;
                }
                return ret;
            },
            style: ensureOne(function (key, value) {
                style(this.un(), key, value);
                return this;
            }),
            /**
             * @func
             * @name DOMM#allDom
             * @returns {Boolean} value indicating whether or not there were any non dom elements found in the collection
             */
            allDom: function () {
                var count = 0,
                    length = this.length(),
                    result = length && find(this.un(), negate(isDom));
                return length && result === void 0;
            },
            /**
             * @func
             * @name DOMM#height
             * @returns {Number} height of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            height: dimFinder('height', 'scrollHeight', 'innerHeight'),
            /**
             * @func
             * @name DOMM#width
             * @returns {Number} width of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            width: dimFinder('width', 'scrollWidth', 'innerWidth'),
            /**
             * @func
             * @name DOMM#getStyle
             * @retuns {Object} the get computed result or a blank object if first or defined index is not a dom element and therefore cannot have a style associated with it
             */
            getStyle: function (eq) {
                var ret = {},
                    first = this.get();
                if (first && isDom(first)) {
                    ret = getComputed(first);
                }
                return ret;
            },
            /**
             * @func
             * @name DOMM#data
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {Object|*} can return the value that is asked for by the initial function call
             */
            data: domAttrManipulator(function (el, _key, val, data, dom) {
                var value, dataStr = 'data-',
                    sliced = _key.slice(0, 5),
                    key = _key;
                if (dataStr !== sliced) {
                    key = dataStr + _key;
                }
                key = unCamelCase(key);
                value = attributeInterface(el, key, val);
                if (value !== blank) {
                    data.dataset[_key] = value;
                }
                return value;
            }, BOOLEAN_TRUE),
            /**
             * @func
             * @name DOMM#attr
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM|*} if multiple attributes were requested then a plain hash is returned, otherwise the DOMM instance is returned
             */
            attr: domAttrManipulator(function (el, _key, val, data, dom) {
                return attributeInterface(el, unCamelCase(_key), val);
            }),
            prop: domAttrManipulator(function (el, key, val, data, dom) {
                var value;
                if (isBlank(val)) {
                    value = el[key];
                    if (isBlank(value)) {
                        value = null;
                    }
                } else {
                    if (isBlank(val)) {
                        val = blank;
                    }
                    el[key] = val;
                }
                return value;
            }),
            /**
             * @func
             * @name DOMM#eq
             * @param {Number|Array} [num=0] - index or list of indexes to create a new DOMM element with.
             * @returns {DOMM} instance
             */
            eq: attachPrevious(function (num) {
                return eq(this.un(), num);
            }),
            /**
             * @func
             * @name DOMM#first
             * @returns {DOMM} instance
             */
            first: attachPrevious(function () {
                return eq(this.un(), 0);
            }),
            /**
             * @func
             * @name DOMM#last
             * @returns {DOMM} instance
             */
            last: attachPrevious(function () {
                return eq(this.un(), this.length() - 1);
            }),
            /**
             * @func
             * @name DOMM#clientRect
             * @param {Number} [num=0] - item who's bounding client rect will be assessed and extended
             * @returns {Object} hash of dimensional properties (getBoundingClientRect)
             */
            clientRect: function (num) {
                return clientRect(eq(this.un(), num)[0]);
            },
            /**
             * @func
             * @name DOMM#each
             * @param {Function} callback - iterator to apply to each item on the list
             * @param {Boolean} elOnly - switches the first argument from a DOMM wrapped object to the Node itself
             * @returns {DOMM} instance
             */
            each: function (callback) {
                var domm = this;
                if (domm.length()) {
                    callback = _.bind(callback, domm);
                    duff(domm[itemsString], function (item_, index, all) {
                        var item = $([item_]);
                        callback(item, index, all);
                    });
                }
                return domm;
            },
            /**
             * @func
             * @name DOMM#addClass
             * @param {String|Array} add - space delimited string that separates classes to be added through the change class function
             * @returns {DOMM} instance
             */
            addClass: eachProc(function (el, add) {
                changeClass(el, 0, add);
            }),
            /**
             * @func
             * @name DOMM#removeClass
             * @param {String|Array} remove - space delimited string that separates classes to be removed through the change class function
             * @returns {DOMM} instance
             */
            removeClass: eachProc(function (el, remove) {
                changeClass(el, remove);
            }),
            /**
             * @func
             * @name DOMM#toggleClass
             * @params {String|Array} list - space delimited string that separates classes to be removed and added through the change class function
             * @returns {DOMM} instance
             */
            toggleClass: eachProc(function (el, list) {
                var add = [],
                    remove = [];
                duff(gapSplit(list), function (item) {
                    if (containsClass(el, item)) {
                        remove.push(item);
                    } else {
                        add.push(item);
                    }
                });
                changeClass(el, remove, add);
            }),
            /**
             * @func
             * @name DOMM#hasClass
             * @param {String|Array} list - space delimited string that each element is checked againsts to ensure that it has the classs
             * @returns {Boolean} do all of the elements in the collection have all of the classes listed
             */
            hasClass: function (clas) {
                var dom = this,
                    retVals = [],
                    countLen = [],
                    classes = gapSplit(clas);
                dom.duff(function (el) {
                    countLen.push(1);
                    if (containsClass(el, clas)) {
                        retVals.push(1);
                    }
                });
                return (dom.length() && countLen[LENGTH_STRING] === retVals[LENGTH_STRING]);
            },
            /**
             * @func
             * @name DOMM#changeClass
             * @param {String|Array} [remove] - removes space delimited list or array of classes
             * @param {String|Array} [add] - adds space delimited list or array of classes
             * @returns {DOMM} instance
             */
            changeClass: eachProc(changeClass),
            booleanClass: eachProc(function (el, add, remove) {
                if (add) {
                    add = remove;
                    remove = [];
                }
                changeClass(el, remove, add);
            }),
            /**
             * @func
             * @name DOMM#box
             * @param {Number} [num=0] - index to get the boxmodel of
             */
            box: function (num) {
                return box(this.get(num));
            },
            /**
             * @func
             * @name DOMM#end
             * @returns {DOMM} object that started the traversal chain
             */
            end: function () {
                var that = this;
                while (that._previous) {
                    that = that._previous;
                }
                return that;
            },
            /**
             * @func
             * @name DOMM#hide
             * @description sets all elements to display
             * @returns {DOMM} instance
             */
            hide: eachProc(ensureDOM(function (el) {
                el.style.display = 'none';
            })),
            /**
             * @func
             * @name DOMM#show
             */
            show: eachProc(ensureDOM(function (el) {
                el.style.display = 'block';
            })),
            /**
             * @func
             * @name DOMM#append
             */
            append: function (el) {
                var dom = this,
                    frag = _.frag(el);
                dom.duff(function (el) {
                    el.appendChild(frag);
                });
                return dom;
            },
            /**
             * @func
             * @name DOMM#next
             * @returns {DOMM} instance
             */
            next: horizontalTraverser(1),
            /**
             * @func
             * @name DOMM#previous
             * @returns {DOMM} instance
             */
            prev: horizontalTraverser(-1),
            /**
             * @func
             * @name DOMM#skip
             * @returns {DOMM} instance
             */
            skip: horizontalTraverser(0),
            /**
             * @func
             * @name DOMM#insertAt
             * @returns {DOMM} instance
             */
            insertAt: function (els, idx) {
                var point, dom = this,
                    frag = _.frag(els),
                    children = dom.children();
                if (!idx && !isNumber(idx)) {
                    point = {};
                }
                if (isNumber(idx)) {
                    point = children.eq(idx);
                }
                if (isString(idx)) {
                    point = dom.children().filter(idx);
                }
                if (isInstance(point, DOMM)) {
                    point = point.get(0);
                }
                if (!_.isDom(point)) {
                    point = null;
                }
                dom.duff(function (el) {
                    el.insertBefore(frag, point);
                });
                return dom;
            },
            /**
             * @func
             * @name DOMM#remove
             * @returns {DOMM} instance
             */
            remove: eachProc(function (el) {
                var parent = el.parentNode;
                if (isObject(parent) && isFunction(parent.removeChild)) {
                    parent.removeChild(el);
                }
            }),
            /**
             * @func
             * @name DOMM#parent
             * @param {Number} [count=1] - number of elements to go up in the parent chain
             * @returns {DOMM} instance of collected, unique parents
             */
            parent: (function () {
                var finder = function (collect, fn, original) {
                        return function (el) {
                            var rets, found, parent = el,
                                next = original;
                            while (parent && !found) {
                                rets = fn(parent.parentNode || parent.defaultView, original, next);
                                parent = rets[0];
                                found = rets[1];
                                next = rets[2];
                            }
                            if (parent) {
                                collect.push(parent);
                            }
                        };
                    },
                    number = function (parent, original, next) {
                        next -= 1;
                        if (next < 0 || !isFinite(next) || isNaN(next)) {
                            next = 0;
                        }
                        return [parent, !next, next];
                    },
                    string = function (parent, original, next) {
                        return [parent, matches(parent, original)];
                    },
                    speshal = {
                        document: function (parent, original, next) {
                            return [parent, isDoc(parent)];
                        },
                        window: function (parent, original, next) {
                            return [parent, isWin(parent)];
                        },
                        iframe: function (parent, original, next) {
                            var win, found = 1;
                            if (isWin(parent) && parent !== window.top) {
                                if (parent.location.protocol.indexOf('http') === -1) {
                                    win = parent;
                                    found = 1;
                                    try {
                                        parent = win.frameElement;
                                        if (parent) {
                                            found = 0;
                                        }
                                    } catch (e) {
                                        found = 1;
                                    }
                                }
                            }
                            return [parent, (!found && parent)];
                        }
                    };
                return attachPrevious(function (original) {
                    var iterator, doDefault = 1,
                        collect = coll();
                    if (isNumber(original)) {
                        iterator = number;
                    } else {
                        if (isString(original)) {
                            if (speshal[original]) {
                                iterator = speshal[original];
                            } else {
                                iterator = string;
                            }
                        } else {
                            if (original) {
                                doDefault = 0;
                            }
                        }
                    }
                    if (doDefault) {
                        if (!iterator) {
                            iterator = number;
                            original = 1;
                        }
                        this.duff(finder(collect, iterator, original));
                    } else {
                        this.duff(finder(collect, function (el) {
                            return [el, original(el)];
                        }));
                    }
                    return collect[itemsString];
                });
            }()),
            /**
             * @func
             * @name DOMM#has
             * @param {Node|Array} els - list of elements to check the current instance against
             * @returns {Boolean} whether or not the current domm element has all of the elements that were passed in
             */
            has: function (els) {
                var has = 0,
                    domm = this,
                    list = domm[itemsString];
                if (_.isInstance(els, Collection)) {
                    els = els.un();
                } else {
                    if (isDom(els)) {
                        els = [els];
                    }
                }
                if (els[LENGTH_STRING]) {
                    has = els[LENGTH_STRING];
                }
                find(els, function (el) {
                    if (domm.posit(el)) {
                        has--;
                    }
                });
                return has === 0 && els && els[LENGTH_STRING];
            },
            /**
             * @func
             * @name DOMM#indexOf
             * @param {Node|Array} el - element to check against the collection
             * @returns {Number} index of the element
             */
            indexOf: function (el, lookAfter) {
                if (isInstance(el, DOMM)) {
                    el = el.get();
                }
                return indexOf(this[itemsString], el, lookAfter);
            },
            /**
             * @func
             * @name DOMM#html
             * @returns {DOMM} instance
             */
            html: htmlTextManipulator('innerHTML'),
            /**
             * @func
             * @name DOMM#text
             * @returns {DOMM} instance
             */
            text: htmlTextManipulator('innerText'),
            /**
             * @func
             * @name DOMM#contentRect
             * @returns {Object} dimensions of the content rectangle
             */
            contentRect: function (num) {
                var box = this.box(num),
                    pB = box.paddingBottom,
                    pT = box.paddingTop,
                    pR = box.paddingRight,
                    pL = box.paddingLeft,
                    bT = box.borderTop,
                    bB = box.borderBottom,
                    bR = box.borderRight,
                    bL = box.borderLeft;
                return {
                    bottom: box.bottom - pB - bB,
                    height: box.height - pT - bT - pB - bB,
                    right: box.right - pR - bR,
                    width: box.width - pL - bL - pR - bR,
                    left: box.left + pL - bL,
                    top: box.top + pT - bT
                };
            },
            /**
             * @func
             * @name DOMM#flowRect
             * @returns {Object} dimensions of the flow rectangle: the amount of space the element should take up in the dom
             */
            flowRect: function () {
                var box = this.box(0),
                    mT = box.marginTop,
                    mL = box.marginLeft,
                    mB = box.marginBottom,
                    mR = box.marginRight;
                return {
                    height: box.height + mT + mB,
                    bottom: box.bottom + mB,
                    width: box.width + mR + mL,
                    right: box.right + mR,
                    left: box.left + mL,
                    top: box.top + mT
                };
            },
            /**
             * @func
             * @name DOMM#stopEvent
             */
            stopEvent: function (e, now) {
                e = _.Event(e);
                e.stopPropagation();
                e.preventDefault();
                if (!isBlank(e.cancelBubble)) {
                    e.cancelBubble = BOOLEAN_TRUE;
                }
                if (!isBlank(e.cancel)) {
                    e.cancel = BOOLEAN_TRUE;
                }
                if (now) {
                    e.stopImmediatePropagation();
                }
            },
            /**
             * @func
             * @name DOMM#childOf
             */
            childOf: function (oParent) {
                var domm = this,
                    _oParent = $(oParent),
                    children = domm.un();
                oParent = _oParent.un();
                return !!domm.length() && !!_oParent.length() && !find(oParent, function (_parent) {
                    return find(children, function (child) {
                        var parent = child,
                            finding = BOOLEAN_TRUE;
                        while (parent && finding) {
                            if (_parent === parent) {
                                finding = BOOLEAN_FALSE;
                            }
                            parent = parent.parentNode;
                        }
                        return finding;
                    });
                });
            },
            serialize: function () {
                var domm = this,
                    arr = [];
                domm.each(function (idx, $node) {
                    var node = $node.get(),
                        children = $node.children().serialize(),
                        obj = {
                            tag: node.localName
                        };
                    if (children.length) {
                        obj.children = children;
                    }
                    if (node.innerText) {
                        obj.innerText = node.innerText;
                    }
                    duff(node.attributes, function (idx, attr) {
                        obj[camelCase(attr.localName)] = attr.nodeValue;
                    });
                    arr.push(obj);
                });
                return arr;
            },
            stringify: function () {
                return JSON.stringify(this.serialize());
            }
        }, _.wrap({
            id: 0,
            src: 0,
            checked: 0,
            disabled: 0,
            tag: 'localName',
            classes: 'className'
        }, function (attr, api) {
            if (!attr) {
                attr = api;
            }
            return function (str) {
                var item, setter = {};
                if (isString(str)) {
                    setter[attr] = str;
                    return this.attr(setter);
                }
                item = this.get(str);
                if (item) {
                    return item[attr];
                }
            };
        }), _.wrap({
            play: 'playing',
            pause: 'paused'
        }, triggerEventWrapper), _.wrap(gapSplit('blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'), function (attr) {
            return triggerEventWrapper(attr);
        })), BOOLEAN_TRUE),
        $ = _DOMM(sizzleDoc);
    app.addModuleArgs([$]);
    _.exports({
        covers: covers,
        center: center,
        closer: closer,
        distance: distance,
        css: css,
        box: box,
        frag: frag,
        isDom: isDom,
        isWin: isWin,
        isDoc: isDoc,
        isFrag: isFrag,
        device: deviceCheck,
        makeEl: makeEl,
        makeEls: makeEls,
        createDocFrag: createDocFrag,
        hasWebP: hasWebP,
        makeTree: makeTree,
        numToUnits: numToUnits,
        unitsToNumConverters: unitsToNumConverters,
        numToUnitsConverters: numToUnitsConverters,
        position: position,
        unitsToNum: unitsToNum,
        buildStyles: buildStyles,
        changeClass: changeClass,
        unitRemoval: unitRemoval,
        getStyleSize: getStyleSize,
        htmlDataMatch: htmlDataMatch,
        toStyleString: toStyleString,
        trustedEvents: trustedEvents,
        makeEmptyFrame: makeEmptyFrame,
        isTrustedEvent: isTrustedEvent,
        devicePxRatio: devicePixelRatio,
        setAttribute: setAttribute,
        getAttribute: getAttribute,
        attributeInterface: attributeInterface,
        attributeRegExpMaker: function (attr, regex) {
            var stringified = regex.toString(),
                converted = stringified.slice(1, stringified[LENGTH_STRING] - 1).replace(new RegExp('{{{}}}'), attr);
            return new RegExp(converted, 'mgi');
        },
        Sizzle: function (str, ctx) {
            return (ctx || sizzleDoc).querySelectorAll(str);
        },
        stashAttrs: function (el, extras) {
            var data = _.stashedAttrs(el);
            duff(gapSplit('id class maxWidth width minWidth maxHeight height minHeight style').concat(gapSplit(extras) || []), function (idx, attr) {
                if (!_.has(data.backup, attr)) {
                    data.stashedCount++;
                }
                data.backup[attr] = _.attributeInterface(el, unCamelCase(attr));
            });
        },
        stashedAttrs: function (el) {
            var obj = {},
                data = elementData.get(el);
            if (!data.backup) {
                data.backup = {};
            }
            if (!data.stashedCount) {
                data.stashedCount = 0;
            }
            return data;
        },
        resetAttrs: function (el) {
            var data = elementData.get(el);
            each(data.backup, function (key, val) {
                _.attributeInterface(el, unCamelCase(key), val);
            });
        },
        elementData: elementData,
        eventLists: {
            Event: Event,
            SVGEvent: SVGEvent,
            KeyboardEvent: KeyboardEvent,
            GamePadEvent: GamePadEvent,
            CompositionEvent: CompositionEvent,
            MouseEvents: MouseEvents,
            TouchEvents: TouchEvents,
            DeviceEvents: DeviceEvents,
            FocusEvent: FocusEvent,
            TimeEvent: TimeEvent,
            AnimationEvent: AnimationEvent,
            AudioProcessingEvent: AudioProcessingEvent,
            UIEvents: UIEvents,
            ProgressEvent: ProgressEvent,
            AllEvents: AllEvents
        }
    });
});
application.scope().module('Element', function (module, app, _, $) {
    var factories = _.factories,
        each = _.each,
        duff = _.duff,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        isUnitlessNumber = {
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
        * Support style names that may come passed in prefixed by adding permutations
        * of vendor prefixes.
        */
        prefixes = ['Webkit', 'ms', 'Moz', 'O'],


        /**
        * Most style properties can be unset by doing .style[prop] = '' but IE8
        * doesn't like doing that with shorthand properties so for the properties that
        * IE8 breaks on, which are listed here, we instead unset each of the
        * individual properties. See http://bugs.jquery.com/ticket/12385.
        * The 4-value 'clock' properties like margin, padding, border-width seem to
        * behave without any problems. Curiously, list-style works too without any
        * special prodding.
        */
        shorthandPropertyExpansions = {
            background: {
                backgroundAttachment: BOOLEAN_TRUE,
                backgroundColor: BOOLEAN_TRUE,
                backgroundImage: BOOLEAN_TRUE,
                backgroundPositionX: BOOLEAN_TRUE,
                backgroundPositionY: BOOLEAN_TRUE,
                backgroundRepeat: BOOLEAN_TRUE
            },
            backgroundPosition: {
                backgroundPositionX: BOOLEAN_TRUE,
                backgroundPositionY: BOOLEAN_TRUE
            },
            border: {
                borderWidth: BOOLEAN_TRUE,
                borderStyle: BOOLEAN_TRUE,
                borderColor: BOOLEAN_TRUE
            },
            borderBottom: {
                borderBottomWidth: BOOLEAN_TRUE,
                borderBottomStyle: BOOLEAN_TRUE,
                borderBottomColor: BOOLEAN_TRUE
            },
            borderLeft: {
                borderLeftWidth: BOOLEAN_TRUE,
                borderLeftStyle: BOOLEAN_TRUE,
                borderLeftColor: BOOLEAN_TRUE
            },
            borderRight: {
                borderRightWidth: BOOLEAN_TRUE,
                borderRightStyle: BOOLEAN_TRUE,
                borderRightColor: BOOLEAN_TRUE
            },
            borderTop: {
                borderTopWidth: BOOLEAN_TRUE,
                borderTopStyle: BOOLEAN_TRUE,
                borderTopColor: BOOLEAN_TRUE
            },
            font: {
                fontStyle: BOOLEAN_TRUE,
                fontVariant: BOOLEAN_TRUE,
                fontWeight: BOOLEAN_TRUE,
                fontSize: BOOLEAN_TRUE,
                lineHeight: BOOLEAN_TRUE,
                fontFamily: BOOLEAN_TRUE
            },
            outline: {
            outlineWidth: BOOLEAN_TRUE,
            outlineStyle: BOOLEAN_TRUE,
            outlineColor: BOOLEAN_TRUE
            }
        },

        CSSProperty = {
            isUnitlessNumber: isUnitlessNumber,
            shorthandPropertyExpansions: shorthandPropertyExpansions
        },
        convertStyleType = function (key, value) {
            if (value === +value) {
                if (timeBasedCss[n]) {
                    value += 'ms';
                }
                if (!isUnitlessNumber[n]) {
                    value += 'px';
                }
            }
            return value;
        },
        isNode = function (object) {
          return !!(object && (_.isFunction(Node) ? _.isInstance(object, Node) : _.isObject(object) && _.isNumber(object.nodeType) && _.isString(object.nodeName)));
        },
        isWin = function (obj) {
            return obj && obj === obj.window;
        },
        /**
         * @private
         * @func
         */
        isDoc = function (obj) {
            return obj && isNumber(obj.nodeType) && obj.nodeType === obj.DOCUMENT_NODE;
        },
        isFrag = function (frag) {
            return frag && frag.nodeType === sizzleDoc.DOCUMENT_FRAGMENT_NODE;
        },
        styles = function (el, css_) {
            _.each(css_, function (key_, value) {
                var key = _.camelCase(key_);
                el.style[key] = convertStyleType(key, value);
            });
        },
        Element = factories.Element = _.extendFrom.Model('Element', {
            constructor: function (el, skip) {
                var element = this;
                element._el = el;
                element._validated = !skip;
                element.validate();
                element.apply();
                return element;
            },
            apply: function () {
                var element = this;
                _.each(element._queue, function (key, value) {});
                element._queue = {};
                return element;
            },
            validate: function () {
                var element = this;
                var el = element._el;
                element._isNode = isNode(el);
                element._isDoc = element._isNode ? BOOLEAN_FALSE : isDoc(el);
                element._isWin = element._isNode || element._isDoc ? BOOLEAN_FALSE : isWin(el);
                element._isFrag = element._isNode || element._isDoc || element._isWin ? BOOLEAN_FALSE : isFrag(el);
                element._isValid =  element._isWin || element._isNode || element._isDoc || element._isFrag;
            },
            valid: function (type, preventRevalidation) {
                var element = this;
                if (!element._validated && !preventRevalidation) {
                    element.validate();
                }
                return this['_is' + type];
            },
            style: function (css) {
                var element = this;
                if (element.valid('DOM')) {
                    styles(element._el, css);
                }
                return element;
            }
        }, BOOLEAN_TRUE);
        /**
         * @param {string} prefix vendor-specific prefix, eg: Webkit
         * @param {string} key style name, eg: transitionDuration
         * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
         * WebkitTransitionDuration
         */
        function prefixKey(prefix, key) {
          return prefix + key.charAt(0).toUpperCase() + key.substring(1);
        }
        // Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
        // infinite loop, because it iterates over the newly added props too.
        each(isUnitlessNumber, function (truth, prop) {
            duff(prefixes, function (prefix) {
                isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
            });
        });
});
application.scope().module('View', function (module, app, _, $) {
    var blank, each = _.each,
        isFn = _.isFn,
        duff = _.duff,
        factories = _.factories,
        Box = factories.Box,
        extendFrom = _.extendFrom,
        isString = _.isString,
        gapSplit = _.gapSplit,
        isArray = _.isArray,
        bind = _.bind,
        has = _.has,
        protoProp = _.protoProp,
        lengthString = 'length',
        optionsString = 'options',
        templates = {},
        compile = function (id, force) {
            var matches, tag, template, attrs, templateFn = templates[id];
            if (!templateFn || force) {
                tag = $(id);
                template = tag.html();
                matches = template.match(/\{\{([\w\s\d]*)\}\}/mgi);
                attrs = _.map(matches, function (match) {
                    return {
                        match: match,
                        attr: match.split('{{').join('').split('}}').join('').trim()
                    };
                });
                template = template.trim();
                templateFn = templates[id] = function (obj) {
                    var str = template,
                        clone = _.clone(obj);
                    duff(attrs, function (idx, match) {
                        if (!clone[match.attr]) {
                            clone[match.attr] = '';
                        }
                        str = str.replace(match.match, clone[match.attr]);
                    });
                    return str;
                };
            }
            return templateFn;
        },
        scrapeData = function (model, el, attributes) {
            var val, value, str = model.dataScrape;
            if (str) {
                value = el.data(str);
                if (isString(value)) {
                    val = {};
                    val[_.camelCase(str)] = value;
                    value = val;
                }
                _.extend(attributes, value);
            }
        },
        ensureUIObj = function (fn) {
            return function () {
                var ui, view = this,
                    viewEl = view.el;
                if (!_.has(view, 'ui')) {
                    ui = view.ui || {};
                    view.ui = {};
                    each(ui, function (domm, key) {
                        view.ui[key] = $();
                        viewEl.find(domm).duff(function (el) {
                            view.attachUIElement(key, el);
                        });
                    });
                }
                return fn.apply(view, arguments);
            };
        },
        makeDelegateEventKey = function (view, name) {
            return name + '.delegateEvents' + view.cid;
        },
        makeDelegateEventKeys = function (view, key, namespace) {
            if (namespace) {
                namespace = '.' + namespace;
            } else {
                namespace = '';
            }
            var viewNamespace = 'delegateEvents' + view.cid;
            return _.map(gapSplit(key), function (_key) {
                var __key = _key.split('.');
                if (__key[1] !== viewNamespace) {
                    __key.splice(1, 0, viewNamespace);
                    _key = __key.join('.');
                }
                return _key += namespace;
            }).join(' ');
        },
        normalizeUIString = function(uiString, ui) {
            return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function (r) {
                return ui[r.slice(4)];
            });
        },
        // allows for the use of the @ui. syntax within
        // a given key for triggers and events
        // swaps the @ui with the associated selector.
        // Returns a new, non-mutated, parsed events hash.
        normalizeUIKeys = function(hash, ui) {
            return _.reduce(hash, function (memo, val, key) {
                var normalizedKey = Marionette.normalizeUIString(key, ui);
                memo[normalizedKey] = val;
                return memo;
            }, {});
        },
        viewGetRegion = function (key) {
            var region, view = this,
                regionManager = view.regionManager;
            if (regionManager) {
                region = regionManager.get(key);
            }
            return region;
        },
        /**
         * @class View
         * @augments Model
         * @augments Box
         * @classDesc Objects that have one or more element associated with them, such as a template that needs constant updating from the data
         */
        // region views are useful if you're constructing different components
        // from a separate place and just want it to be in the attach pipeline
        // very useful for componentizing your ui
        viewplucks = ['el', 'regionViews'],
        pluckviews = function (from, to, props) {
            duff(props, function (idx, prop) {
                if (has(from, prop)) {
                    to[prop] = from[prop];
                    from[prop] = void 0;
                }
            });
        },
        View = extendFrom.Box('View', {
            /**
             * @func
             * @name View#constructor
             * @description constructor for new view object
             * @param {Object|DOMM|Node} attributes - hash with non-circular data on it. Is set later with the Box constructor
             * @param {Object} secondary - options such as defining the parent object, or the element if necessary
             * @param {DOMM|Node} el - element or Node that is attached directly to the View object
             * @returns {View} instance
             */
            tagName: 'div',
            getRegion: viewGetRegion,
            constructor: function (attributes, secondary) {
                var model = this;
                pluckviews(secondary, model, viewplucks);
                model._ensureElement();
                Box.apply(model, arguments);
                return model;
            },
            childViewContainer: function () {
                return this.el;
            },
            $: function (selector) {
                return this.el.find(selector);
            },
            template: function (ctx) {
                return '';
            },
            _renderHTML: function () {
                var view = this,
                    innerHtml = view.template(view.toJSON());
                view.el.html(innerHtml);
            },
            _ensureRegionManager: function () {
                var view = this;
                // weak association
                var regionManager = view.regionsManager = view.regionsManager || new RegionManager({}, {
                    parent: view
                });
                return regionsManager;
            },
            _appendChildElements: function () {
                var view = this,
                    // scoped under view because it always has to be inside of view
                    el = view.$(_.result(view, 'childViewContainer'));
                // view.children.eachCall('render');
                view.children.each(function (idx, child) {
                    if (_.result(child, 'filter')) {
                        child.render();
                    }
                });
                if (view.parent && !view.parent.rendered()) {
                    view._passBufferedViews();
                }
                // if any were rendered
                el.append(view._bufferedEls);
            },
            _establishRegions: function () {
                var regionsManager, view = this,
                    regions = view._establishedRegions || _.result(view, 'regions');
                if (regions) {
                    view._establishedRegions = regions;
                }
                if (view._establishedRegions) {
                    // hold off making the region manager as long as possible
                    view._ensureRegionManager();
                    // add regions to the region manager
                    view.regionManager.establishRegions(regions);
                }
            },
            render: function () {
                var frag = _.createDocFrag(),
                    view = this;
                view.isRendered = !1;
                view._ensureBufferedViews();
                // detach this element so we don't cause more reflows than necessary
                // view._detachElement();
                // remove the child elements
                // request extra data or something before rendering: is still intact
                view.dispatchEvent('before:render');
                // set render flat
                view.isRendered = !1;
                // unbinds and rebinds element only if it changes
                view.setElement(view.el);
                view._setElAttributes();
                // renders the html
                view._renderHTML();
                // gathers the ui elements
                view._bindUIElements();
                // ties regions back to newly formed parent template
                view._establishRegions();
                // puts children back inside parent
                view._appendChildElements();
                view._attachBufferedViews();
                view.isRendered = !0;
                view.dispatchEvent('render');
                return view;
            },
            filter: function () {
                return true;
            },
            setElement: function (element) {
                var view = this,
                    previousElement = view.el;
                // detaches events with this view's namespace
                // view._unDelegateEvents();
                view._setElement(element);
                if (previousElement !== view.el) {
                    view._unDelegateEvents(previousElement);
                    view._delegateEvents();
                }
                // attaches events with this view's namespace
                return view;
            },
            // Creates the `this.el` and `this.$el` references for this view using the
            // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
            // context or an element. Subclasses can override this to utilize an
            // alternative DOM manipulation API and are only required to set the
            // `this.el` property.
            _setElement: function (el) {
                this.el = $(el);
            },
            _createElement: function (tag) {
                return $('<' + tag + '>');
            },
            // Ensure that the View has a DOM element to render into.
            // If `this.el` is a string, pass it through `$()`, take the first
            // matching element, and re-assign it to `el`. Otherwise, create
            // an element from the `id`, `className` and `tagName` properties.
            _ensureElement: function () {
                var el, view = this,
                    _elementSelector = view._elementSelector || _.result(view, 'el');
                if (_elementSelector) {
                    view._elementSelector = _elementSelector;
                }
                if (!_.isInstance(_elementSelector, _.DOMM)) {
                    if (_.isString(_elementSelector)) {
                        // sets external element
                        el = _elementSelector;
                    } else {
                        // defauts back to wrapping the element
                        // creates internal element
                        el = view._createElement(_.result(view, 'tagName'));
                        // subclassed to expand the attributes that can be used
                    }
                    view.setElement(el);
                }
            },
            _setElAttributes: function () {
                var view = this;
                var attrs = _.result(view, 'elementAttributes') || {};
                if (view.className) {
                    attrs['class'] = _.result(view, 'className');
                }
                view._setAttributes(attrs);
            },
            // Set attributes from a hash on this view's element.  Exposed for
            // subclasses using an alternative DOM manipulation API.
            _setAttributes: function (attributes) {
                this.el.attr(attributes);
            },
            // pairs. Callbacks will be bound to the view, with `this` set properly.
            // Uses event delegation for efficiency.
            // Omitting the selector binds the event to `this.el`.
            _delegateEvents: function (el, bindings_) {
                var key, method, match,
                    view = this,
                    _elementEventBindings = view._elementEventBindings || view.elementEvents,
                    bindings = bindings_ || _elementEventBindings,
                    __events = {};
                if (_elementEventBindings) {
                    view._elementEventBindings = _elementEventBindings;
                }
                if (el) {
                    each(bindings, function (key, methods_) {
                        // assumes is array
                        var methods = gapSplit(methods_);
                        if (isFunction(methods_)) {
                            methods = [methods_];
                        }
                        __events[makeDelegateEventKeys(view, key)] = _.map(methods, function (idx, method) {
                            return _.bind(view[method] || method, view);
                        });
                    });
                    el.on(__events);
                }
                return view;
            },
            _unDelegateEvents: function (el, bindings_) {
                var key, method, match,
                    view = this,
                    _elementEventBindings = view._elementEventBindings || view.elementEvents,
                    bindings = bindings_ || _elementEventBindings,
                    __events = {};
                if (_elementEventBindings) {
                    view._elementEventBindings = _elementEventBindings;
                }
                if (el) {
                    each(bindings, function (key, methods_) {
                        // assumes is array
                        var methods = gapSplit(methods_);
                        if (isFunction(methods_)) {
                            methods = [methods_];
                        }
                        __events[makeDelegateEventKeys(view, key)] = _.map(methods, function (idx, method) {
                            return _.bind(view[method] || method, view);
                        });
                    });
                    el.on(__events);
                }
                return view;
            },
            parentView: function () {
                var found, view = this,
                    parent = view.parent;
                while (found && parent && !_.isInstance(parent, View)) {
                    parent = parent.parent;
                    if (_.isInstance(parent, View)) {
                        found = parent;
                    }
                }
                return found;
            },
            _bindUIElements: function () {
                var view = this,
                    _uiBindings = view._uiBindings || _.result(view, 'ui');
                view.ui = view.ui || {};
                if (_uiBindings) {
                    // save it to skip the result call later
                    view._uiBindings = _uiBindings;
                    view.ui = _.hashMap(_uiBindings, function (key, selector) {
                        return view.$(selector);
                    });
                }
                return view;
            },
            _unBindUIElements: function () {
                var view = this;
                view.ui = view._uiBindings;
            },
            remove: function () {
                var el, view = this;
                Box.prototype.remove.apply(view, arguments);
                // if you were not told to select something in
                // _ensureElements then remove the view from the dom
                view.detach();
                return view;
            },
            _detachElement: function () {
                var view = this,
                    el = view.el && view.el.get(0);
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            },
            _ensureBufferedViews: function () {
                var bufferedViews = isArray(this._bufferedViews) ? 1 : this._resetBufferedViews();
                var _bufferedEls = _.isFrag(this._bufferedEls) ? 1 : this._resetBufferedEls();
            },
            _resetBuffered: function () {
                this._resetBufferedEls();
                this._resetBufferedViews();
            },
            _addBufferedView: function (view) {
                var parent = this;
                parent._bufferedEls.appendChild(view.el.get(0));
                parent._bufferedViews.push(view);
            },
            _removeViewElement: function (el, frag) {
                var parent = this;
                if (frag) {
                    frag.appendChild(el);
                } else {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                }
            },
            _add: function (view) {
                var parent = this;
                Box.prototype._add.call(parent, view);
                // ensure the element buffer
                // append to the view list buffer
                // attached buffered element here so we don't have to loop through the list later
                parent._addBufferedView(view);
            },
            add: function (models_) {
                var ret, _bufferedViews, view = this;
                view._ensureBufferedViews();
                ret = Box.prototype.add.call(view, _.isArrayLike(models_) ? models_ : [models_]);
                _.duff(ret, function (view) {
                    view._attemptAttach();
                });
                return ret;
            },
            _attemptAttach: function () {
                var view = this,
                    parent = view.parent;
                if (view.attached() || parent && parent.attached()) {
                    view.attach(view.parent);
                }
            },
            _passBufferedViews: function () {
                var child = this,
                    parent = child.parent;
                if (parent && child._bufferedViews) {
                    parent._ensureBufferedViews();
                    parent._bufferedEls.appendChild(child.el.get(0));
                    parent._bufferedViews.push.apply(parent._bufferedViews, child._bufferedViews);
                    child._resetBufferedViews();
                }
            },
            _resetBufferedViews: function () {
                this._bufferedViews = [];
            },
            _resetBufferedEls: function () {
                this._bufferedEls = _.createDocFrag();
            },
            _attachBufferedChildren: function () {
                var childView, idx = 0,
                    view = this,
                    el = view.$(_.result(view, 'childViewContainer'));
                if (view._bufferedEls) {
                    el.append(view._bufferedEls);
                }
                while (view._bufferedViews && view._bufferedViews[lengthString] && view._bufferedViews[idx]) {
                    childView = view._bufferedViews[idx];
                    idx++;
                    // appends children to parent el
                    childView.attach(childView.parent);
                }
                if (!view.attached()) {
                    view._passBufferedViews();
                }
            },
            _attachBufferedViews: function () {
                var parent = this;
                parent.el.append(parent._bufferedEls);
                _.duff(parent._bufferedViews, function (idx, buffered) {
                    buffered.isAttached = true;
                    buffered.dispatchEvent('attach');
                });
            },
            // _attachTrigger: function () {
            //     var parent = this;
            //     // only has to happen once
            //     parent._attachBufferedViews();
            //     parent._resetBuffered();
            // },
            attach: function (parent_) {
                var view = this;
                if (view.attached()) {
                    if (parent_ && view.parent && parent_ !== view.parent) {
                        view.detach();
                        view.attach(parent_);
                    }
                    view._attachBufferedChildren();
                } else {
                    // resets the html
                    // queue children for attachment
                    view.dispatchEvent('before:attach');
                    // render / attach children to self
                    view._attachBufferedChildren();
                    if (parent_.attached() && !view.attached()) {
                        view.render();
                        // parent_._attachTrigger();
                        parent_._attachBufferedViews();
                        parent_._resetBuffered();
                    }
                }
            },
            // _conditionallyDispachAttached: function () {
            //     var view = this,
            //         parent = view.parent;
            //     if (!view.attached() && parent && parent.attached()) {
            //         view.isAttached = true;
            //         parent.el.append(view.el);
            //         view.dispatchEvent('attach');
            //     }
            // },
            detach: function () {
                var view = this;
                view.dispatchEvent('before:detach');
                view._detachElement();
            },
            /**
             * @func
             * @name View#destroy
             * @description removes dom elemenets as well as all elements on the ui
             * @returns {View} instance
             */
            destroy: function (opts) {
                var view = this;
                view.isRendered = false;
                // done here for redundancy when using iframes
                view.detach();
                // remove all events
                // should internally call remove
                Box.prototype.destroy.call(view);
                return view;
            },
            rendered: function () {
                return this.isRendered;
            },
            destroyed: function () {
                return this.isDestroyed;
            },
            attached: function () {
                return this.isAttached;
            }
        }, !0),
        Region = factories.View.extend('Region', {
            Model: View,
            _delegateEvents: _.noop,
            _unDelegateEvents: _.noop,
            fill: function (newView) {
                var region = this,
                    currentView = region.currentView;
                if (!newView) {
                    return;
                }
                if (currentView !== newView) {
                    region.empty();
                    region.add(newView);
                    region.currentView = newView;
                    newView.attach(region);
                }
                return currentView;
            },
            empty: function () {
                var region = this,
                    currentView = region.currentView;
                if (currentView) {
                    currentView.detach();
                }
            }
        }, true),
        RegionManager = factories.Collection.extend('RegionManager', {
            Model: Region,
            createRegion: function (where, region_) {
                var scope, regionManager = this,
                    // assume that it is a region
                    region = region_;
                if (!(region instanceof regionManager.Model)){
                    region = new regionManager.Model({
                        id: where
                    }, {
                        el: regionManager._getElementFromDom(region)
                    });
                }
                regionManager.add(region);
                regionManager.register(region.get('id'), region);
            },
            _getElementFromDom: function (selector) {
                var regionManager = this;
                var $ = regionManager.getElementContext();
                var $selected = $(selector);
                return $selected;
            },
            removeRegion: function (region_) {
                var regionManager = this;
                var region = _.isString(region_) ? regionManager.get(region_) : region_;
                regionManager.remove(region);
                regionManager.unregister(region.get('id'), region);
            },
            _setElementContext: function ($) {
                this.$ = $;
            },
            _resetElementContext: function () {
                this.$ = void 0;
            },
            defaultContext: function () {
                return $;
            },
            getElementContext: function () {
                var regionManager = this;
                var parent = regionManager.parent;
                var _$ = _.has(regionManager, '$') ? regionManager.$ : $;
                if (parent && parent.$ && !regionManager.$) {
                    regionManager.$ = _.bind(parent.$, parent);
                    _$ = regionManager.$;
                }
                return _$;
            },
            establishRegion: function (key, value) {
                var regionManager = this;
                var region = regionManager.get(key);
                if (!region) {
                    regionManager.createRegion(key, value);
                }
            },
            establishRegions: function (regions) {
                var regionManager = this;
                var reversed = _.reverseParams(_.bind(regionManager.establishRegion, regionManager));
                _.each(regions, reversed, regionManager);
                return regionManager;
            }
        }, true);
    _.exports({
        htmlCompile: compile
    });
    app.regionManager = new RegionManager();
    app.extend({
        addRegion: function (where, selector) {
            var app = this;
            var regionManager = app.regionManager;
            _.intendedObject(where, selector, function (key, value) {
                var region;
                regionManager.establishRegion(key, value);
                region = regionManager.get(key);
                region.isAttached = true;
            });
            return app;
        },
        getRegion: viewGetRegion,
        addRegions: function (obj) {
            var app = this;
            app.addRegion(obj);
            return app;
        }
    });
});
application.scope().module('Buster', function (module, app, _, $) {
    var blank, isReceiving = 0,
        get = _.get,
        duff = _.duff,
        gapSplit = _.gapSplit,
        associator = _.associator,
        unitsToNum = _.unitsToNum,
        roundFloat = _.roundFloat,
        extend = _.extend,
        factories = _.factories,
        infin = 32767,
        attributesString = 'attributes',
        // 0 is first positive -1 is first non positive
        nInfin = -infin - 1,
        lengthString = 'length',
        heightString = 'height',
        widthString = 'width',
        bottomString = 'bottom',
        rightString = 'right',
        leftString = 'left',
        topString = 'top',
        marginBottomString = 'marginBottom',
        marginRightString = 'marginRight',
        minHeightString = 'minHeight',
        maxHeightString = 'maxHeight',
        minWidthString = 'minWidth',
        maxWidthString = 'minWidth',
        queuedMessageIndexString = 'queuedMessageIndex',
        pI = _.pI,
        _setupInit = function (e) {
            var i, currentCheck, src, parentEl, frameWin, frameEl, allFrames, tippyTop, spFacts, spOFacts, shouldRespond, sameSide, topDoc, wrapper, buster = this,
                frame = e.frame,
                data = e.data(),
                packet = data.packet,
                responder = e.responder,
                attrs = get(buster),
                parts = buster.parts;
            if (app.topAccess) {
                tippyTop = window[topString];
                topDoc = tippyTop.document;
                wrapper = topDoc.body;
            }
            if (!frame) {
                if (!data.toInner) {
                    /**
                     * when the buster has to go through an unfriendly iframe, it has to find the iframe it belonged to from the top document
                     * @private
                     * @arg {string} url that is the iframe. also, secondarily checks the window objects in the while loop
                     */
                    buster.el = (function (specFrame) {
                        var frame, frameWin, src, currentCheck, i,
                            frames = topDoc.getElementsByTagName('iframe'),
                            srcEl = e.srcElement;
                        if (specFrame) {
                            for (i in frames) {
                                frame = frames[i];
                                frameWin = frame.contentWindow;
                                src = frame.src;
                                if (src === specFrame) {
                                    currentCheck = srcEl;
                                    while (currentCheck !== tippyTop) {
                                        if (frameWin === currentCheck) {
                                            return frame;
                                        }
                                        currentCheck = currentCheck.parent;
                                    }
                                }
                            }
                        }
                        return 0;
                    }(attrs.srcOrigin));
                }
                if (data.toInner) {
                    buster.el = document.body;
                }
                if (buster.el) {
                    buster.el = $(buster.el);
                    buster.set({
                        sameSide: 0,
                        id: data.from,
                        referrer: _.getReference(parts.doc)
                    });
                    extend(parts, {
                        srcElement: e.source,
                        top: tippyTop || {},
                        doc: topDoc || {},
                        wrapper: wrapper || {}
                    });
                    shouldRespond = 1;
                    attrs.isConnected = 1;
                }
            }
            if (frame) {
                buster.el = frame;
                buster.responder = e.responder;
                shouldRespond = 1;
                buster.set({
                    sameSide: 1,
                    referrer: packet.referrer
                });
                extend(buster.parts, {
                    srcElement: e.srcElement,
                    wrapper: wrapper,
                    top: tippyTop,
                    doc: topDoc
                });
            }
            if (shouldRespond) {
                parentEl = buster.el.parent();
                buster.respond(data, {
                    parent: {
                        height: parentEl[heightString](),
                        width: parentEl[widthString](),
                        style: {
                            height: parentEl.get(0).style[heightString],
                            width: parentEl.get(0).style[widthString]
                        }
                    }
                });
            }
        },
        /**
         * single handler for all busters under same window makes it easy to remove from window when the time comes to unload
         * @private
         * @arg {event} event object passed in by browser
         */
        receive = function (evt) {
            var buster, bustersCache, data = _.parse(evt.data),
                postTo = data.postTo;
            if (data && postTo && !app.isDestroying) {
                bustersCache = associator.get(postTo);
                if (bustersCache) {
                    buster = bustersCache.buster;
                    if (buster && buster.run) {
                        buster.run(data, evt);
                    }
                }
            }
        },
        /**
         * single function to stringify and post message an object to the other side
         * @private
         * @arg {object} object to be stringified and sent to the receive function,
         * either through a post message, or through a setTimeout
         * @arg {buster}
         */
        postMessage = function (base, buster) {
            var busterAttrs = buster[attributesString],
                sameSide = busterAttrs.sameSide,
                parts = buster.parts,
                message = JSON.stringify(base),
                timestamp = _.nowish(),
                doReceive = function () {
                    receive({
                        data: message,
                        frame: buster.el,
                        responder: receive,
                        srcElement: window,
                        timestamp: timestamp
                    });
                };
            if (!sameSide) {
                if (busterAttrs.referrer) {
                    parts.sendWin.postMessage(message, busterAttrs.referrer);
                } else {
                    window.console.trace('missing referrer', buster);
                }
            }
            if (sameSide) {
                doReceive();
            }
            return timestamp;
        },
        /**
         * object for 4 different setup cases. probably belongs elsewhere
         * @private
         * @arg {buster}
         */
        setups = {
            /**
             * @private
             */
            toInner: function (buster) {
                var attrs = buster[attributesString],
                    parts = buster.parts;
                parts.sendWin = buster.parent.el.get(0).contentWindow;
                attrs.referrer = attrs.referrer || _.getReference(parts.doc);
                attrs.sameSide = !buster.parent.parent.get('unfriendlyCreative');
            },
            /**
             * @private
             */
            fromInner: function (buster) {
                var attrs = buster[attributesString],
                    parts = buster.parts;
                parts.sendWin = parts.receiveWin.parent;
                attrs.referrer = attrs.referrer || _.getReference(parts.doc);
            },
            notInner: {
                /**
                 * @private
                 */
                noAccess: function (buster) {
                    var url, attrs = buster[attributesString],
                        parts = buster.parts,
                        doc = parts.doc,
                        iframe = doc.createElement('iframe'),
                        allMods = _.clone(app.allModules);
                    allMods.push('initPublisherConfig');
                    if (attrs.busterLocation) {
                        iframe.style.display = 'none';
                        url = attrs.referrer + attrs.busterLocation;
                        iframe.src = _.stringifyQuery({
                            url: attrs.referrer + attrs.busterLocation,
                            query: {
                                origin: doc.location.href,
                                sessionId: attrs.sessionId,
                                src: app.BASEURL + buster.get('scriptUrl') + app.addVersionNumber(allMods).join()
                            }
                        });
                        parts.wrapper.appendChild(iframe);
                        parts.sendWin = iframe.contentWindow;
                        buster.el = $(iframe);
                        _.Ajax(url).failure(function () {
                            var time = 2000;
                            if (_.isMobile) {
                                time = 10000;
                            }
                            setTimeout(function () {
                                // handle no buster file here
                                var ret, ad = buster.parent,
                                    adAttrs = ad[attributesString],
                                    banner = ad.children.index(1),
                                    panel = ad.children.index(2);
                                if (!ad.busterLoaded) {
                                    if (!banner) {
                                        banner = panel;
                                    }
                                    ret = panel.destroy && panel.destroy();
                                    buster.unSendAll();
                                    buster.on('message:queued', buster.unSendAll);
                                }
                            }, time);
                        });
                    }
                },
                /**
                 * @private
                 */
                topAccess: function (buster) {
                    var commands, newParent = buster.el.get(0),
                        attrs = buster[attributesString];
                    // if preventselfinit is true, then that means that
                    // this is being triggered by the buster file
                    if (!attrs.preventSelfInit) {
                        if (attrs.publisherConfig) {
                            // // does need some special functions
                            _.Ajax('http:' + app.SERVERURL + app.SCRIPTPATH + attrs.publisherConfig).success(function (responseText) {
                                new Function.constructor('return ' + responseText)();
                                buster.begin();
                            });
                        } else {
                            // doesn't need any special functions
                            buster.addCommand(factories.publisherConfig());
                            buster.begin();
                        }
                    } else {
                        buster.addCommand(factories.publisherConfig());
                    }
                }
            }
        },
        containerSize = function (components) {
            return components.foldr(function (memo, idx, com) {
                var preventScrollCounter = 0,
                    hPushCount = 0,
                    vPushCount = 0,
                    calced = com.calculatedSize,
                    verticalPush = com.pushVertical,
                    horizontalPush = com.pushHorizontal;
                if (verticalPush !== '') {
                    vPushCount++;
                }
                if (horizontalPush !== '') {
                    hPushCount++;
                }
                if (com.isShowing && com.container === 'ad') {
                    if (com.preventScroll) {
                        preventScrollCounter = 1;
                    }
                    memo = {
                        top: Math.min(memo[topString], calced[topString]),
                        left: Math.min(memo[leftString], calced[leftString]),
                        right: Math.max(memo[rightString], (calced[leftString] + calced[widthString])),
                        bottom: Math.max(memo[bottomString], (calced[topString] + calced[heightString])),
                        zIndex: Math.max(memo.zIndex, (+com.zIndex || 0)),
                        marginRight: Math.max(memo[marginRightString], horizontalPush || 0),
                        marginBottom: Math.max(memo[marginBottomString], verticalPush || 0),
                        vPushCount: vPushCount + memo.vPushCount,
                        hPushCount: hPushCount + memo.hPushCount,
                        transitionDuration: Math.max(memo.transitionDuration, com.duration),
                        preventScrollCount: memo.preventScrollCount + preventScrollCounter
                    };
                }
                return memo;
            }, {
                top: infin,
                left: infin,
                right: nInfin,
                bottom: nInfin,
                marginBottom: 0,
                marginRight: 0,
                zIndex: 0,
                vPushCount: 0,
                hPushCount: 0,
                transitionDuration: 0,
                preventScrollCount: 0
            });
        };
    if (app.topAccess) {
        $(window[topString]).on('message', receive);
    }
    /**
     * @class Buster
     * @augments Model
     * @augments Box
     * @augments View
     * @classDesc constructor for buster objects, which have the ability to talk across windows
     */
    var Message = _.extendFrom.Container('Message', {
        // idAttribute: 'command',
        packet: function (data) {
            var ret = this;
            if (arguments[0]) {
                this.set({
                    packet: data || {}
                });
            } else {
                ret = _.parse(_.stringify(this.get('packet')));
            }
            return ret;
        },
        defaults: function () {
            return {
                command: 'null',
                packet: {}
            };
        },
        deferred: function (fn) {
            this.on('deferred', fn);
            return this;
        },
        respond: function (fn) {
            var message = this,
                buster = message.parent;
            if (_.isFunction(fn)) {
                message.once('respond', fn);
            }
            if (message.responseOptions) {
                message.dispatchEvent('respond', message.responseOptions, buster.currentPoint());
            }
            return message;
        }
    });
    factories.Buster = _.extendFrom.Box('Buster', {
        Model: Message,
        events: {
            unload: 'destroy',
            'alter:isConnected': function () {
                this.set(queuedMessageIndexString, 1);
            },
            'alter:isConnected child:added': 'flush'
        },
        parentEvents: {
            destroy: 'destroy'
        },
        /**
         * @func
         * @name Buster#destroy
         */
        currentPoint: function () {
            var currentPoint = this.get('currentPoint') || {};
            return {
                source: currentPoint.source,
                srcElement: currentPoint.srcElement,
                originTimestamp: currentPoint.timestamp,
                frame: currentPoint.frame,
                responder: currentPoint.responder
            };
        },
        destroy: function () {
            var buster = this,
                attrs = get(buster);
            buster.set({
                isConnected: !1
            });
            buster.resetElements();
            clearTimeout(attrs.__lastMouseMovingTimeout__);
            _.AF.remove(attrs.elQueryId);
            _.AF.remove(attrs.componentTransitionAFID);
            buster.allListeners.each(function (idx, obj) {
                obj.els.off(obj.name, obj.fn, obj.capture);
            });
            buster.el.offAll();
            buster.el.shift();
            buster.parts = {};
            associator.remove(buster.id);
            factories.Box.prototype.destroy.apply(this, arguments);
            return buster;
        },
        tellMouseMovement: function () {
            if (this.get('mouseMoveDataObject')) {
                this.respond(this.get('mouseMoveDataObject'));
            }
        },
        reapplyCss: function (extend) {
            var containerSize, hw = {},
                buster = this,
                attrs = get(buster);
            if (attrs.frameAlwaysFillHeight) {
                hw[heightString] = '100%';
            }
            if (attrs.frameAlwaysFillWidth) {
                hw[widthString] = '100%';
            }
            hw = _.extend(buster.calculateContainerSize(), extend, hw);
            buster.el.css(hw);
            if (buster.get('applyImportant')) {
                buster.applyImportantStyles(buster.el.get(0));
            }
            return buster;
        },
        applyImportantStyles: function (el) {
            var panel = buster.components.get(2);
            var hasDuration;
            var style = (el.getAttribute('style') || '').split(' !important').join('').split('!important').join('').split('important').join('').split('!').join('').split(';');
            el.setAttribute('style', _.foldl(style, function (memo, idx, val) {
                var split;
                if (val) {
                    split = val.trim().split(': ');
                    if (val && split[0] && split[1]) {
                        memo.push(split[0].trim() + ': ' + split[1].trim() + ' !important;');
                    }
                }
                return memo;
            }, []).join(' '));
        },
        unSend: function (obj) {
            var buster = this,
                every = buster.get('every');
            every.apply(buster, [obj, {},
                buster.parent
            ]);
            if (obj.packet.onRespond) {
                obj.packet.onRespond.apply(buster, [obj, {},
                    buster.parent
                ]);
            }
        },
        unSendAll: function () {
            var queued = this.get('queued');
            while (queued[0]) {
                this.unSend(queued.shift());
            }
        },
        /**
         * @func
         * @name Buster#defaults
         */
        defaults: function () {
            return {
                currentState: 'collapse',
                connectedUnder: [],
                isConnected: 0,
                sameSide: 0,
                queuedMessageIndex: 0,
                sent: []
            };
        },
        // belongs on the outside
        _stateCss: function (set0) {
            var busterAttrs = get(this),
                _sizing = busterAttrs._sizing,
                margin = {
                    transitionProperty: 'all'
                };
            if (_sizing) {
                if (_sizing.vPushCount) {
                    margin[marginBottomString] = busterAttrs.pushVerticalVal;
                    margin.transitionDuration = _sizing.transitionDuration;
                } else {
                    if (set0) {
                        margin[marginBottomString] = 0;
                    } else {
                        margin[marginBottomString] = 'auto';
                    }
                }
                if (_sizing.hPushCount) {
                    margin[marginRightString] = busterAttrs.pushHorizontalVal;
                    margin.transitionDuration = _sizing.transitionDuration;
                } else {
                    if (set0) {
                        margin[marginRightString] = 0;
                    } else {
                        margin[marginRightString] = 'auto';
                    }
                }
            }
            return margin;
        },
        /**
         * initial setup for all busters
         * @func
         * @name Buster#initialize
         */
        initialize: function (opts, options) {
            var receiveWin, registered, buster = this,
                attrs = buster[attributesString];
            buster.components = _.Collection();
            buster.showing = _.Collection();
            buster.on('before:responded', attrs.every);
            buster.addCommand({
                initialize: _setupInit,
                begin: this.begin,
                update: function (e) {
                    this.respond(e.data());
                },
                unload: function () {
                    this.destroy();
                },
                // belongs on the outside
                updateAttributes: function (e) {
                    var buster = this,
                        data = e.data(),
                        packet = data.packet;
                    buster.set(packet.update);
                    duff(packet.components, function (idx, com) {
                        var component = buster.component(com.registeredAs);
                        if (!component) {
                            buster.components.add(com);
                        } else {
                            extend(component, com);
                        }
                    });
                    buster.components.each(function (idx, com) {
                        if (_.posit(packet.showing, com.registeredAs)) {
                            com.isShowing = !0;
                        } else {
                            com.isShowing = !1;
                        }
                    });
                    if (packet.shouldRespond) {
                        buster.respond();
                    }
                }
            });
            buster.allListeners = _.Collection();
            extend(attrs, {
                frame: null
            });
            buster.el = $(buster.parts.frame);
            registered = associator.get(attrs.id);
            registered.buster = buster;
            registered.postListener = receive;
            receiveWin = $(buster.parts.receiveWin);
            receiveWin.on('message', receive);
            buster.allListeners.push({
                els: receiveWin,
                fn: receive,
                name: 'message'
            });
            if (attrs.type === 'buster') {
                if (!attrs.sameSide) {
                    setups.notInner.noAccess(buster);
                } else {
                    setups.notInner.topAccess(buster);
                }
            }
            // always assume the need to bust for these two
            if (attrs.type !== 'buster') {
                if (attrs.toInner) {
                    setups.toInner(buster);
                }
                if (attrs.fromInner) {
                    setups.fromInner(buster);
                }
            }
            return buster;
        },
        component: function (registeredAs) {
            return this.components.find(function (com, idx) {
                return com.registeredAs === registeredAs || idx === registeredAs;
            });
        },
        // this belongs on the outside
        /**
         * quick get parser to figure out if the wrapper, the frame element, it's parent, the document, or an other item is being selected by a post message
         * @arg {string} target selector
         * @returns {DOMM} with targets
         * @func
         * @name Buster#getTargets
         */
        getTargets: function (target) {
            var buster = this,
                attrs = buster[attributesString],
                parts = buster.parts,
                top = parts.top,
                targets = [],
                wrapper = parts.wrapper;
            if (!target) {
                targets = [top];
            }
            if (target === 'wrapper') {
                targets = [wrapper];
            }
            if (target === 'self') {
                targets = buster.el;
            }
            if (target === 'document') {
                targets = [parts.doc];
            }
            if (target === 'parent') {
                targets = buster.el.parent();
            }
            if (!targets[lengthString]) {
                targets = parts.doc.querySelectorAll(target);
            }
            return $(targets);
        },
        /**
         * tries to flush the cache. only works if the isConnected attribute is set to true. If it is, then the post message pipeline begins
         * @returns {buster} returns this;
         * @func
         * @name Buster#flush
         */
        flush: function () {
            var n, item, gah, childrenLen, queuedMsg, nuData, i = 0,
                buster = this,
                currentIdx = buster.get(queuedMessageIndexString),
                connected = buster.get('isConnected'),
                initedFrom = buster.get('initedFromPartner'),
                flushing = buster.get('flushing');
            if (!initedFrom || connected && ((connected || !currentIdx) && !flushing)) {
                buster.set({
                    flushing: !0
                });
                childrenLen = buster.children.length();
                queuedMsg = buster.children.index(currentIdx);
                while (queuedMsg && currentIdx < childrenLen) {
                    queuedMsg.set({
                        runCount: 0
                    });
                    postMessage(queuedMsg, buster);
                    if (currentIdx) {
                        currentIdx = (buster.get(queuedMessageIndexString) + 1) || 0;
                        buster.set(queuedMessageIndexString, currentIdx);
                        queuedMsg = buster.children.index(currentIdx);
                    } else {
                        childrenLen = false;
                    }
                }
                buster.set({
                    flushing: !1
                });
                if (buster.get('isConnected')) {
                    if (buster.children.length() > buster.get(queuedMessageIndexString)) {
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
        send: function (command, packet, extra) {
            var message, buster = this,
                defaultObj = buster.defaultMessage();
            message = buster.add(_.extend({
                command: command,
                packet: packet
            }, defaultObj, extra));
            return buster.children.index(defaultObj.index);
        },
        /**
         * shorthand for creating a function that gets called after the buster's partner has responded
         * @func
         * @name Buster#sync
         */
        sync: function (fn) {
            return this.send('update').respond(fn);
        },
        /**
         * if a buster is found on the receive function, by the data's postTo property, then the run method is called
         * @arg {object} the parsed data object
         * @arg {event} the event object that wrapped the stringified data object
         * @returns {buster}
         * @func
         * @name Buster#run
         */
        run: function (data, currentPoint_) {
            var packet, format, retVal, messageJSON, responded, onResponse, originalMessage, responseType, methodName, buster = this,
                attrs = buster[attributesString],
                currentPoint = attrs.currentPoint = currentPoint_,
                event = currentPoint,
                messages = attrs.sent,
                runCount = data.runCount,
                children = buster.children,
                eventname = 'respond',
                args = _.toArray(arguments);
            if (runCount) {
                originalMessage = children.index(data.index);
                if (originalMessage) {
                    // messageJSON = originalMessage.toJSON();
                    // found the message that i originally sent you
                    // packet = originalMessage.packet;
                    // allow the buster to set some things up
                    buster.dispatchEvent('before:responded', data, buster.currentPoint());
                    if (runCount === 1) {
                        // stash it for later
                        originalMessage.responseOptions = data;
                    } else {
                        eventname = 'deferred';
                    }
                    originalMessage.dispatchEvent(eventname, data, buster.currentPoint());
                }
            } else {
                buster.dispatchEvent('receive:' + data.command, data, buster.currentPoint());
                buster.dispatchEvent('receive', data, buster.currentPoint());
            }
            return buster;
        },
        /**
         * skip the queue, and simply send a message
         * @arg {object} message object to be sent
         * @arg {object} optional object that is the original object. Usually only applicable when passed in through the send function, so that the response event can have all of the correct information
         * @returns {buster}
         * @func
         * @name Buster#sendMessage
         */
        // sendMessage: function (message) {
        //     var buster = this;
        //     // set again to make sure that it has all the right info
        //     // message.set(buster.defaultMessage());
        //     postMessage(_.fullClone(message), buster);
        //     return buster;
        // },
        /**
         * creates a default message based on the attributes of the buster
         * @returns {object} blank / default message object
         * @func
         * @name Buster#defaultMessage
         */
        defaultMessage: function () {
            var attrs = get(this);
            return {
                from: attrs.id,
                postTo: attrs.postTo,
                sameSide: attrs.sameSide,
                fromInner: attrs.fromInner,
                toInner: attrs.toInner,
                // runCount: 0,
                index: this.children.length(),
                preventResponse: false
            };
        },
        /**
         * @func
         * @name Buster#shouldUpdate
         */
        shouldUpdate: function (args) {
            var ret, buster = this,
                attrs = _.get(buster),
                lastUpdate = attrs.lastRespondUpdate,
                lastFrameRect = attrs.lastFrameRect,
                top = buster.parts.top || {},
                width = top.innerWidth,
                height = top.innerHeight,
                nowish = _.nowish();
            if (lastUpdate > nowish - 1000 && _.isObject(lastFrameRect)) {
                ret = !(lastFrameRect[bottomString] < -height * 0.5 || lastFrameRect.top > height * 1.5 || lastFrameRect[rightString] < -width * 0.5 || lastFrameRect[leftString] > width * 1.5);
            } else {
                ret = 1;
            }
            clearTimeout(attrs.lastUpdateThrottledId);
            if (!ret) {
                attrs.lastUpdateThrottledId = setTimeout(function () {
                    buster.respond.apply(buster, args);
                }, -(nowish - lastUpdate - 1000));
            }
            return !buster.startThrottle || ret;
        },
        /**
         * respond trigger.
         * @arg {object} original data object (same pointer) that was sent over
         * @arg {object} extend object, that will be applied to a base object, that is created by the responseExtend attribute set on the buster object
         * @returns {buster}
         * @func
         * @name Buster#respond
         */
        respond: function (data, extendObj) {
            var lastRespondUpdate, message, buster = this,
                attrs = buster[attributesString],
                sameSide = attrs.sameSide,
                base = {};
            if (!extendObj || !_.isObject(extendObj)) {
                extendObj = {};
            }
            if (buster.el && (!data.canThrottle || buster.shouldUpdate(arguments))) {
                // on the inner functions, we don't want to allow this
                // module to be present, so the inner does not influence the outer
                if (attrs.responseExtend) {
                    base = attrs.responseExtend(buster, data);
                }
                ++data.runCount;
                base = {
                    from: data.postTo,
                    postTo: data.from,
                    index: data.index,
                    isResponse: 1,
                    isDeferred: data.isDeferred,
                    runCount: data.runCount,
                    command: data.command,
                    packet: extend(base, extendObj)
                };
                // used for throttling
                attrs.lastRespondUpdate = postMessage(base, buster);
                buster.dispatchEvent('respond:' + data.command, buster, buster.currentPoint());
                if (data.isDeferred) {
                    buster.dispatchEvent('deferred:' + data.command, buster, buster.currentPoint());
                }
                data.isDeferred = 1;
            }
            return buster;
        },
        /**
         * @returns {object} client rect duplicate of element
         * @func
         * @name Buster#getFrameRect
         */
        getFrameRect: function () {
            var clientRect = this[attributesString].lastFrameRect = this.el.clientRect();
            return clientRect;
        },
        /**
         * @returns {object} client rect duplicate of parent element
         * @func
         * @name Buster#getParentRect
         */
        getParentRect: function () {
            var parentRect = this[attributesString].lastParentRect = this.el.parent().clientRect();
            return parentRect;
        },
        updateTopData: function () {
            var buster = this,
                attrs = get(buster),
                parts = buster.parts,
                topWin = parts.top || {},
                location = topWin.location || {
                    hash: '',
                    pathname: '',
                    protocol: '',
                    search: ''
                },
                topData = attrs.topData = {
                    location: {
                        hash: location.hash.slice(1),
                        host: location.host,
                        href: location.href,
                        origin: location.origin,
                        pathname: location.pathname.slice(1),
                        port: location.port,
                        protocol: location.protocol.slice(0, location.protocol.length - 1),
                        search: location.search.slice(1)
                    },
                    innerHeight: topWin.innerHeight || 0,
                    outerHeight: topWin.outerHeight || 0,
                    innerWidth: topWin.innerWidth || 0,
                    outerWidth: topWin.outerWidth || 0,
                    scrollX: topWin.scrollX || 0,
                    scrollY: topWin.scrollY || 0
                };
            return topData;
        },
        /**
         * gets the wrapper info, such as scroll height, id, and the classname
         * @returns {object} key value pairs of all of the data that defines the wrapper
         * @func
         * @name Buster#wrapperInfo
         */
        wrapperInfo: function () {
            var info, buster = this,
                parts = buster.parts,
                el = parts.wrapper || {},
                doc = parts.doc || {
                    body: {}
                },
                root = doc.body.parentNode,
                getBoundingClientRect = {},
                attrs = get(buster);
            if (el.tagName) {
                getBoundingClientRect = $(el).clientRect();
            }
            info = attrs.wrapperInfo = {
                readyState: (doc.readyState === 'complete'),
                scrollHeight: el.scrollHeight,
                scrollWidth: el.scrollWidth,
                scrollLeft: el.scrollLeft,
                scrollTop: el.scrollTop,
                className: el.className,
                pageTitle: doc.title,
                id: el.id,
                height: pI(getBoundingClientRect.height),
                bottom: pI(getBoundingClientRect.bottom),
                width: pI(getBoundingClientRect.width),
                right: pI(getBoundingClientRect.right),
                left: pI(getBoundingClientRect.left),
                top: pI(getBoundingClientRect.top)
            };
            return info;
        },
        /**
         * @returns {object} position in document as calculated by the buster attributes
         * @func
         * @name Buster#positionInDocument
         */
        positionInDocument: function () {
            var attrs = this[attributesString],
                wrapperInfo = attrs.wrapperInfo,
                contentRect = attrs.lastParentRect,
                pos = attrs.lastPosInDoc = {
                    top: pI(contentRect[topString] - wrapperInfo[topString]),
                    bottom: pI(wrapperInfo[heightString] - contentRect[topString] - wrapperInfo.scrollTop - contentRect[heightString]),
                    left: pI(contentRect[leftString] - wrapperInfo[leftString]),
                    right: pI(wrapperInfo[widthString] - contentRect[rightString] - wrapperInfo.scrollLeft - wrapperInfo[leftString])
                };
            return pos;
        },
        calculateSizes: function () {
            var buster = this,
                attrs = get(buster),
                parentStyle = attrs.lastParentStyle = buster.el.parent().getStyle(),
                comSizes = attrs.componentSizes = buster.components.map(function (idx, com) {
                    return buster.calculateSize(com);
                });
            return comSizes;
        },
        showComponents: function (showList) {
            var buster = this;
            duff(gapSplit(showList), function (id) {
                var com = buster.component(id);
                if (com) {
                    com.isShowing = !0;
                }
            });
        },
        hideComponents: function (hideList) {
            var buster = this;
            duff(gapSplit(hideList), function (id) {
                var com = buster.component(id);
                if (com) {
                    com.isShowing = !1;
                }
            });
        },
        calculateContainerSize: function (components) {
            var buster = this,
                attrs = get(buster),
                parentRect = attrs.lastParentRect,
                sizing = containerSize(components || buster.components);
            attrs._sizing = sizing;
            attrs.containerSize = {
                top: sizing[topString],
                left: sizing[leftString],
                width: sizing[rightString] - sizing[leftString],
                height: sizing[bottomString] - sizing[topString]
            };
            attrs.pushVerticalVal = Math.min(Math.max(sizing[bottomString] - parentRect[bottomString], 0), sizing[marginBottomString]);
            attrs.pushHorizontalVal = Math.min(Math.max(sizing[rightString] - parentRect[rightString], 0), sizing[marginRightString]);
            sizing = attrs.containerCss = {
                top: sizing[topString] - parentRect[topString],
                left: sizing[leftString] - parentRect[leftString],
                width: sizing[rightString] - sizing[leftString],
                height: sizing[bottomString] - sizing[topString],
                zIndex: sizing.zIndex || 'inherit'
            };
            return sizing;
        },
        calculateSize: function (component) {
            var buster = this,
                attrs = get(buster),
                expansion = factories.expansion[component.dimensionType || 'match'],
                parentRect = attrs.lastParentRect,
                parentStyle = attrs.lastParentStyle,
                result = (expansion || factories.expansion.match).call(buster, component, parentRect, parentStyle, buster.parts[topString]),
                // these are always relative to the viewport
                calcSize = component.calculatedSize = _.floor({
                    top: result[topString],
                    left: result[leftString],
                    width: result[widthString],
                    height: result[heightString]
                }, 2);
            return calcSize;
        },
        /**
         * uses the object condense utility to compress key, function pairs and applies them to the .commands object that handles all receive method commands
         * @returns {buster}
         * @func
         * @name Buster#addCommand
         */
        addCommand: function (obj) {
            this.on(_.foldl(obj, function (memo, name, handler) {
                memo['receive:' + name] = handler;
                return memo;
            }, {}));
            return this;
        },
        /**
         * constantly posts until it gets a response
         * @arg {object} message to go to the opposite buster pair
         * @arg {number} optionally pass a number to change the setInterval time
         * @returns {number} interval id that corresponds to the setInterval call id
         * @func
         * @name Buster#shout
         */
        shout: function (command, obj, extra, timer) {
            var intervalId, buster = this,
                message = buster.send(command, obj, extra);
            // message.respond(_.once(function () {
            //     _.AF.remove(intervalId);
            //     if (_.isFunction(respondFn)) {
            //         respondFn.apply(this, arguments);
            //     }
            // }));
            intervalId = _.AF.time(timer || 100, function () {
                postMessage(obj, buster);
            });
            return intervalId;
        },
        resetElements: function () {
            var buster = this,
                nextEl = buster.el,
                finalRes = buster.parts.finalResponsified;
            do {
                _.resetAttrs(nextEl.get(0));
                nextEl = nextEl.parent();
            } while (nextEl.childOf(finalRes));
            _.resetAttrs(finalRes.get(0));
        },
        /**
         * starts a relationship between two busters. simplifies the initialization process.
         * @returns {number} just for responding to the original message in case there's a handler
         * @func
         * @name Buster#begin
         */
        begin: function () {
            var buster = this,
                attrs = buster[attributesString],
                inited = buster.initialized = 1,
                message = buster.send('initialize', {
                    expandConfig: attrs.expandConfig,
                    referrer: attrs.publisher
                });
            message.respond(function (e) {
                var data = e.data(),
                    packet = data.packet;
                buster.parent.set({
                    initParentData: packet.parent
                });
                buster.set({
                    isConnected: !0
                });
            });
            return 1;
        }
    }, !0);
    _.exports({
        containerSize: containerSize
    });
});
//# sourceMappingURL=all.js.map
