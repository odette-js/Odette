this.Odette = function (global, WHERE, version, fn) {
    'use strict';
    var UNDEFINED, topmostDoc, LENGTH = 'length',
        PARENT = 'parent',
        PROTOTYPE = 'prototype',
        TOUCH_TOP = 'touchTop',
        TOP_ACCESS = 'topAccess',
        global_ = this || global || window,
        doc = global_.document,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        NULL = null,
        typeConstructor = function (str) {
            return function (thing) {
                return typeof thing === str;
            };
        },
        now = function () {
            return +(new Date());
        },
        isString = typeConstructor('string'),
        isFunction = typeConstructor('function'),
        executionTime = now(),
        makeParody = function (parent, fn) {
            return function () {
                return fn.apply(parent, arguments);
            };
        },
        wraptry = function (fn, try_, finally_) {
            try {
                return fn();
            } catch (e) {
                return try_ && try_(e);
            } finally {
                return finally_ && finally_();
            }
        };

    function Application(name, parent) {
        this.version = name;
        this.scoped = BOOLEAN_TRUE;
        this.global = BOOLEAN_FALSE;
        this.missedDefinitions = [];
        return this;
    }
    Application[PROTOTYPE].wraptry = wraptry;
    Application[PROTOTYPE].now = now;
    Application[PROTOTYPE].extend = function (obj) {
        var n, app = this;
        for (n in obj) {
            if (obj.hasOwnProperty(n)) {
                app[n] = obj[n];
            }
        }
        return app;
    };
    Application[PROTOTYPE].undefine = function (handler) {
        this.missedDefinitions.push(handler);
        return this;
    };
    Application[PROTOTYPE].parody = function (list) {
        var app = this,
            i = 0,
            extendor = {},
            parent = app.parent;
        for (; i < list[LENGTH]; i++) {
            extendor[list[i]] = makeParody(parent, parent[list[i]]);
        }
        app.extend(extendor);
        return app;
    };
    Application[PROTOTYPE].scope = function (name_, fn_) {
        var name = name_ && isString(name_) ? name_ : this.version;
        var fn = name_ && (isFunction(name_) ? name_ : (isFunction(fn_) ? fn_ : NULL));
        return this[PARENT].scope(name, fn);
    };
    // Application[PROTOTYPE].loadedAgainst = function (win) {};
    // Application[PROTOTYPE].lastLoaded = function () {};
    Application[PROTOTYPE][TOUCH_TOP] = function () {
        // allows the top part of this script to be swapped out against different globals_
        return this[PARENT][TOUCH_TOP](global_);
    };
    Application[PROTOTYPE][TOP_ACCESS] = function () {
        this[TOUCH_TOP]();
        return this[PARENT][TOP_ACCESS];
    };
    var app, application = global_[WHERE] = global_[WHERE] || {
        versions: {},
        executionTime: executionTime,
        versionOrder: [],
        global: BOOLEAN_TRUE,
        scoped: BOOLEAN_FALSE,
        wraptry: wraptry,
        registerVersion: function (name) {
            var application = this,
                cachedOrCreated = application.versions[name],
                newApp = application.versions[name] = cachedOrCreated || new Application(name, application);
            newApp[PARENT] = application;
            application.currentVersion = name;
            application.upsetDefaultVersion(name);
            if (!cachedOrCreated) {
                application.versionOrder.push(name);
            }
            return newApp;
        },
        definition: function (version, windo, handler) {
            var application = this,
                app = application.registerVersion(version);
            if (app.isDefined) {
                application.map(app.missedDefinitions, function (handler) {
                    handler.call(app, windo);
                });
            } else {
                app.isDefined = BOOLEAN_TRUE;
                handler.call(app, app);
            }
            return app;
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
            saved[PARENT] = UNDEFINED;
            application.versions[name] = UNDEFINED;
            return saved;
        },
        scope: function (name_, fn_) {
            var name, fn, scoped, app = this,
                hash = app.versions;
            if (isString(name_)) {
                name = name_;
                fn = fn_;
            } else {
                fn = name_;
                name = app.defaultVersion;
            }
            if (!hash[name]) {
                app.registerVersion(name);
            } else {
                app.currentVersion = name;
            }
            scoped = hash[name];
            if (!isFunction(fn)) {
                return scoped;
            }
            this.wraptry(function () {
                fn.call(app, scoped);
            });
            return scoped;
        },
        map: function (arra, fn, ctx) {
            var i = 0,
                len = arra[LENGTH],
                arr = [];
            while (len > i) {
                arr[i] = fn.call(ctx, arra[i], i, arra);
                i++;
            }
            return arr;
        },
        registerScopedMethod: function (name, expects_) {
            var application = this,
                expects = expects_ || 3,
                method = application[name] = application[name] || function () {
                    var i = 0,
                        args = arguments,
                        args_ = args,
                        argLen = args[LENGTH],
                        version = args[0];
                    // expects is equivalent to what it would be if the version was passed in
                    if (argLen < expects) {
                        version = application.currentVersion;
                    } else {
                        args_ = [];
                        for (; i < args[LENGTH]; i++) {
                            args_.push(args[i]);
                        }
                        version = args_.shift();
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
            return app && app[method] && app[method].apply(app, args);
        },
        getCurrentScript: function (d) {
            var allScripts = (d || doc).scripts,
                currentScript = d.currentScript,
                lastScript = allScripts[allScripts[LENGTH] - 1];
            return currentScript || lastScript;
        },
        touchTop: function (global_) {
            // assume you have top access
            var href, topAccess = 1,
                application = this;
            if (application[TOP_ACCESS] === UNDEFINED) {
                application.wraptry(function () {
                    href = global_.top.location.href;
                    // safari bug WHERE unfriendly frame returns undefined
                    if (href) {
                        topAccess = BOOLEAN_TRUE;
                        application = global_.top[WHERE] || application;
                    }
                }, function () {
                    topAccess = BOOLEAN_FALSE;
                });
                if (global_ === global_.top) {
                    topAccess = BOOLEAN_TRUE;
                }
                if (topAccess) {
                    topmostDoc = global_.top.document;
                    global_.top[WHERE] = application;
                }
                application[TOP_ACCESS] = topAccess;
            }
            global_[WHERE] = application;
            return application;
        }
    };
    app = application.get(version);
    if (app) {
        // there is already an app with this same version that originated from this window
        return app;
    }
    app = application.registerVersion(version, global_);
    fn.call(global_, application, app);
    return app;
};
// arguments: context, where, version, handler
Odette(this, 'application', 'dev', function (innerGlobalApp, scopedApp) {
    // custom setup code for this version
    var global = this;
    // global app is the object that will be shared with all other iframes
    var globalApplication = innerGlobalApp.touchTop(global);
    // puts the scoped app on the global object
    // global.app = scopedApp;
});
application.definition('dev', window, function (app) {
        'use strict';
var UNDEFINED, win = window,
    doc = win.document,
    EMPTY_STRING = '',
    SPACE = ' ',
    HYPHEN = '-',
    PERIOD = '.',
    SLASH = '/',
    HASHTAG = '#',
    PIXELS = 'px',
    ID = 'id',
    TO_STRING = 'toString',
    TO_JSON = 'toJSON',
    VALUE_OF = 'valueOf',
    PROTOTYPE = 'prototype',
    CONSTRUCTOR = 'constructor',
    CURRENT = 'current',
    PREVIOUS = 'previous',
    NAME = 'name',
    TYPE = 'type',
    SELECTOR = 'selector',
    ELEMENT = 'element',
    CURRENT = 'current',
    CHILD = 'child',
    CHILDREN = CHILD + 'ren',
    COLON = ':',
    BEFORE = 'before',
    CHANGE = 'change',
    TARGET = 'target',
    ORIGIN = 'origin',
    BEFORE_COLON = BEFORE + COLON,
    CHANGE_COLON = CHANGE + COLON,
    RESET = 'reset',
    ATTRIBUTES = 'attributes',
    DATA = 'data',
    PARENT = 'parent',
    DESTROY = 'destroy',
    LENGTH = 'length',
    OBJECT = 'object',
    STRING = 'string',
    BOOLEAN = 'boolean',
    FUNCTION = 'function',
    INDEX_OF = 'indexOf',
    WINDOW = 'window',
    DOCUMENT = 'document',
    WRITE = 'write',
    STACK = 'stack',
    START = 'start',
    STOP = 'stop',
    COMPONENTS = 'components',
    CLASS = 'class',
    CLASSNAME = 'className',
    TOP = 'top',
    LEFT = 'left',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    WIDTH = 'width',
    INDEX_OF = 'indexOf',
    __ELID__ = '__elid__',
    HEIGHT = 'height',
    INDEX = 'index',
    INNER_HEIGHT = 'innerHeight',
    INNER_WIDTH = 'innerWidth',
    DISPATCH_EVENT = 'dispatchEvent',
    HTTP = 'http',
    HTTPS = HTTP + 's',
    TO_ARRAY = 'toArray',
    CONSTRUCTOR_KEY = '__' + CONSTRUCTOR + '__',
    LOCATION = 'location',
    EXTEND = 'extend',
    STYLE = 'style',
    BODY = 'body',
    BOOLEAN_TRUE = !0,
    BOOLEAN_FALSE = !1,
    INFINITY = Infinity,
    NEGATIVE_INFINITY = -INFINITY,
    BIG_INTEGER = 32767,
    NEGATIVE_BIG_INTEGER = BIG_INTEGER - 1,
    TWO_TO_THE_31 = 2147483647,
    NULL = null;
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
                            obj1[key] = returnDysmorphicBase(obj2[key]);
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
            child = new FunctionConstructor('parent', 'return function ' + name + '(){return parent.apply(this,arguments);}')(passedParent);
        } else {
            child = child || new FunctionConstructor('parent', 'return ' + parent.toString())(parent);
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
        child = constructorWrapper(constructor);
        child.__super__ = parent;
        constructor[PROTOTYPE][CONSTRUCTOR_KEY] = child;
        if (nameIsStr && attach && !_._preventConstructorAttach) {
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
    evaluate = function (context, string_) {
        var split, string = string_.toString();
        if (isFunction(string_)) {
            split = string.split('{');
            string = split.shift();
            string = (string = split.join('{')).slice(0, string[LENGTH] - 1)
        }
        return new FunctionConstructor('context', 'with(context) {\n' + string + '\n}')(context);
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
    returnDysmorphicBase = function (obj) {
        return isArrayLike(obj) ? [] : {};
    },
    map = function (objs, iteratee, context) {
        var collection = returnDysmorphicBase(objs),
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
 * @class Extendable
 */
function Extendable(attributes, options) {
    return this;
}
factories.Extendable = constructorWrapper(Extendable);
app.scope(function (app) {
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
});
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
    string = _.extend(wrap(gapSplit('toLowerCase toUpperCase trim'), function (method) {
        return cacheable(function (item) {
            return item[method]();
        });
    }), wrap(gapSplit('match search'), function (method) {
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
                cache[string] = found = new Function.constructor('return ' + string);
            }
            return found();
        };
    }()),
    uniqueId = (function () {
        var cache = {};
        return function (prefix, isInt) {
            var val;
            if (!prefix) {
                prefix = EMPTY_STRING;
            }
            prefix += EMPTY_STRING;
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
                for (i = s[LENGTH] - 1; i >= 1; i--) {
                    if (s[i]) {
                        s[i] = upCase(s[i]);
                    }
                }
                val = join(s, EMPTY_STRING);
            }
            return val;
        };
    }, HYPHEN),
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
    }, HYPHEN),
    snakeCase = function (string) {
        return unCamelCase(string, '_');
    },
    /**
     * @func
     */
    customUnits = categoricallyCacheable(function (unitList_) {
        var lengthHash = {},
            hash = {},
            lengths = [],
            unitList = gapSplit(unitList_),
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
    baseUnitList = gapSplit('px em rem ex in cm % vh vw pc pt mm vmax vmin'),
    units = function (str) {
        return customUnits(str, baseUnitList);
    },
    isHttp = cacheable(function (str) {
        var ret = !1;
        if ((str.indexOf(HTTP) === 0 && str.split('//')[LENGTH] >= 2) || str.indexOf('//') === 0) {
            ret = !0;
        }
        return ret;
    }),
    parseHash = cacheable(function (url) {
        var hash = EMPTY_STRING,
            hashIdx = smartIndexOf(url, '#') + 1;
        if (hashIdx) {
            hash = url.slice(hashIdx - 1);
        }
        return hash;
    }),
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
        if (str) {
            if (!isString(str)) {
                str = str.referrer;
            }
            if (isString(str)) {
                // gives it a chance to match
                str += SLASH;
                match = str.match(/^http?:\/\/.*?\//);
                if (match) {
                    match = match[0].slice(0, match[0][LENGTH] - 1);
                }
            }
        }
        return match || EMPTY_STRING;
    }),
    protocols = [HTTP, HTTPS, 'file', 'about', 'javascript'],
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
            hash = parseHash(search);
        } else {
            hash = parseHash(url);
        }
        if (searchIdx) {
            search = search.split(hash).join(EMPTY_STRING);
            searchObject = parseSearch(search);
            url = url.slice(0, searchIdx - 1);
        }
        if (url[0] === SLASH && url[1] === SLASH) {
            protocol = win.location.protocol;
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
            protocol: protocol.slice(0, protocol[LENGTH] - 1),
            friendlyProtocol: !extraslashes[protocol],
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
    THIRTY_ONE_BILLION_FIVE_HUNDRED_THIRTY_SIX_MILLION = THREE_HUNDRED_SIXTY_THOUSAND * THREE_HUNDRED_SIXTY_FIVE,
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
    commaSplit = splitGen(','),
    weekdays = gapSplit('sunday monday tuesday wednesday thursday friday saturday'),
    months = gapSplit('january feburary march april may june july august september october november december'),
    monthsHash = wrap(months, BOOLEAN_TRUE),
    time = cacheable(function (number_) {
        var time = 0;
        duff(commaSplit(number_ + EMPTY_STRING), function (num_) {
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
    });
_.exports({
    monthIndex: monthsHash,
    months: months,
    weekdays: weekdays,
    // constants
    customUnits: customUnits,
    // cache makers
    uniqueId: uniqueId,
    cacheable: cacheable,
    categoricallyCacheable: categoricallyCacheable,
    // cacheable
    deprefix: deprefix,
    deprefixAll: deprefixAll,
    prefix: prefix,
    prefixAll: prefixAll,
    upCase: upCase,
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
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        returnsNull = returns(NULL),
        returnsObject = function () {
            return {};
        };
    factories.Extendable.extend('Directive', {
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
    }, BOOLEAN_TRUE);
    var directives = {
        creation: {},
        destruction: {}
    };
    app.defineDirective = function (name, creation, destruction_) {
        var alreadyCreated, err = (!isString(name) && exception({
            message: 'directives must be registered with a string for a name'
        })) || (!isFunction(creation)) && exception({
            message: 'directives must be registered with at least a create function'
        });
        directives.creation[name] = (alreadyCreated = directives.creation[name]) || creation;
        directives.destruction[name] = directives.destruction[name] || destruction_;
        // returns whether or not that directive is new or not
        return !alreadyCreated;
    };
    app.extendDirective = function (oldName, newName, handler_, destruction_) {
        var Destruction = destruction_ || returnsThird;
        var Handler = handler_ || returnsThird;
        var oldDirective = directives.creation[oldName] || exception({
            message: 'directives must exist before they can be extended'
        });
        return app.defineDirective(newName, function (instance, name, third) {
            var directive = directives.creation[oldName](instance, name, third);
            return new Handler(instance, name, directive);
        }, function (instance, name, third) {
            var directive = directives.destruction[oldName](instance, name, third);
            return new Destruction(instance, name, directive);
        });
    };
    var returnsThird = function (one, two, three) {
        return three;
    };
    // var directiveMod = function (key, instance, name) {
    //     var Handler = (instance['directive:' + key + COLON + name] || directives[key][name] || noop);
    //     return new Handler(instance, name);
    // };
    var parody = function (directive, method) {
        return function (one, two, three) {
            return this.directive(directive)[method](one, two, three);
        };
    };
    var iterate = function (directive, method) {
        return function (list) {
            var instance = this,
                dir = instance.directive(directive);
            duff(list, dir[method], dir);
            return instance;
        };
    };
    var checkParody = function (directive, method, defaultValue) {
        return function (one, two, three, four, five, six) {
            return this[directive] ? this[directive][method](one, two, three, four, five, six) : defaultValue;
        };
    };
    // var parodyRead = function (directive, attribute, defaultValue) {
    //     return function () {
    //         return this[directive] === UNDEFINED ? defaultValue : this[directive][attribute];
    //     };
    // };
    _.exports({
        directives: {
            parody: parody,
            checkParody: checkParody,
            // parodyRead: parodyRead,
            iterate: iterate
        }
    });
});
app.scope(function (app) {
    var ITEMS = '_items',
        BY_ID = '_byId',
        // ID = ID,
        eachCall = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            });
        },
        mapCall = function (array, method, arg) {
            return map(array, function (item) {
                return result(item, method, arg);
            });
        },
        eachCallRight = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            }, NULL, -1);
        },
        /**
         * @func
         */
        remove = function (list, item, lookAfter, lookBefore, fromRight) {
            var index = posit(list, item, lookAfter, lookBefore, fromRight);
            if (index) {
                removeAt(list, index - 1);
            }
            return !!index;
        },
        removeAt = function (list, index) {
            return splice(list, index, 1)[0];
        },
        add = function (list, item, lookAfter, lookBefore, fromRight) {
            var val = 0,
                index = posit(list, item, lookAfter, lookBefore, fromRight);
            if (!index) {
                val = list.push(item);
            }
            return !!val;
        },
        addAt = function (list, item, index) {
            var len = list[LENGTH],
                lastIdx = len || 0;
            splice(list, index || 0, 0, item);
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
            var runner, obj, idx, ctx = ctx_ || this;
            if (start < end && isNumber(start) && isNumber(end) && isFinite(start) && isFinite(end)) {
                end = Math.abs(end);
                idx = start;
                runner = bind(runner_, ctx);
                while (idx < end) {
                    obj = NULL;
                    if (has(list, idx)) {
                        obj = list[idx];
                    }
                    runner(obj, idx, list);
                    idx++;
                }
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
        closest = function (array, searchElement, minIndex_, maxIndex_) {
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
        posit = function (list, item, lookAfter, lookBefore, fromRight) {
            return indexOf(list, item, lookAfter, lookBefore, fromRight) + 1;
        },
        /**
         * @func
         */
        concat = function () {
            return foldl(arguments, function (memo, arg) {
                duff(arg, function (item) {
                    memo.push(item);
                });
                return memo;
            }, []);
        },
        /**
         * @func
         */
        concatUnique = function () {
            return foldl(arguments, function (memo, argument) {
                duff(argument, function (item) {
                    if (binaryIndexOf(memo, item) === -1) {
                        memo.push(item);
                    }
                });
                return memo;
            }, []);
        },
        cycle = function (arr, num_) {
            var num, piece, length = arr[LENGTH];
            if (isNumber(length)) {
                num = num_ % length;
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
                keysResult = keys(attrs),
                obj = Object(object);
            return !find(keysResult, function (val) {
                if (attrs[val] !== obj[val] || !(val in obj)) {
                    return BOOLEAN_TRUE;
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
            return map(arr, function (item) {
                return result(item, key);
            });
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
            return filter(obj, negate(matches(attrs)));
        },
        splat = function (fn, spliceat) {
            spliceat = spliceat || 0;
            return function () {
                var ctx = this,
                    arr = toArray(arguments),
                    args = splice(arr, spliceat);
                duff(args, function (idx, item, list) {
                    fn.apply(ctx, arr.concat([idx, item, list]));
                });
            };
        },
        recreateSelf = function (fn, ctx) {
            return function () {
                return new this.__constructor__(fn.apply(ctx || this, arguments));
            };
        },
        /**
         * @func
         */
        filter = function (obj, iteratee, context) {
            var isArrayResult = isArrayLike(obj),
                bound = bind(iteratee, context),
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
        unwrapInstance = function (instance_) {
            return isInstance(instance, factories.Collection) ? instance_ : instance.unwrap();
        },
        recreatingSelfList = gapSplit('eq map mapCall filter pluck where whereNot cycle uncycle flatten'),
        eachHandlers = {
            each: duff,
            duff: duff,
            forEach: duff,
            eachCall: eachCall,
            eachRight: duffRight,
            duffRight: duffRight,
            forEachRight: duffRight,
            eachCallRight: eachCallRight
        },
        eachHandlerKeys = keys(eachHandlers),
        reverseList = gapSplit('reverse'),
        pushUnshiftHandlers = gapSplit('push unshift'),
        joinPopShiftHandlers = gapSplit('join pop shift'),
        countingList = gapSplit('count countTo countFrom merge'),
        foldIteration = gapSplit('foldr foldl reduce'),
        findIteration = gapSplit('find findLast findWhere findLastWhere'),
        indicesIteration = gapSplit('add addAt remove removeAt indexOf posit splice'),
        foldFindIndexIteration = indicesIteration.concat(foldIteration, findIteration),
        marksIterating = function (fn) {
            return function (one, two, three, four, five, six) {
                var result, list = this;
                ++list.iterating;
                result = fn(list, one, two, three, four, five, six);
                --list.iterating;
                return result;
            };
        },
        wrappedListMethods = extend(wrap(joinPopShiftHandlers, function (name) {
            return function (arg) {
                return this.items[name](arg);
            };
        }), wrap(pushUnshiftHandlers, function (name) {
            return function (args) {
                var list = this;
                list.items[name].apply(list.items, args);
                return list;
            };
        }), wrap(reverseList, function (name) {
            return function () {
                var list = this;
                list.directive('status').toggle('reversed');
                list.items[name]();
                return list;
            };
        }), wrap(eachHandlers, function (fn) {
            return marksIterating(function (list, handler, context) {
                var args0 = list.items,
                    args1 = handler,
                    args2 = arguments[LENGTH] > 1 ? context : list;
                fn(args0, args1, args2);
                return list;
            });
        }), wrap(countingList, function (name) {
            return marksIterating(function (list, runner, context, fromHere, toThere) {
                _[name](list.items, runner, context, fromHere, toThere);
                return list;
            });
        }), wrap(foldFindIndexIteration.concat(recreatingSelfList), function (name) {
            return marksIterating(function (list, one, two, three) {
                return _[name](list.items, one, two, three);
            });
        })),
        ret = _.exports({
            eachCall: eachCall,
            eachCallRight: eachCallRight,
            filter: filter,
            matches: matches,
            mapCall: mapCall,
            add: add,
            addAt: addAt,
            concatUnique: concatUnique,
            removeAt: removeAt,
            remove: remove,
            cycle: cycle,
            uncycle: uncycle,
            mamboWrap: internalMambo,
            mambo: externalMambo,
            concat: concat,
            pluck: pluck,
            where: where,
            findWhere: findWhere,
            findLastWhere: findLastWhere,
            posit: posit,
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
        directives = _.directives,
        REGISTRY = 'registry',
        Registry = factories.Directive.extend(upCase(REGISTRY), {
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
                    this.count--;
                }
                if (cat[id] === UNDEFINED) {
                    this.count++;
                }
                cat[id] = value;
                return this;
            },
            swap: function (category, id, value) {
                var cached = this.get(category, id);
                this.keep(category, id, value);
                return cached;
            },
            drop: function (category, id) {
                return this.swap(category, id);
            },
            reset: function (registry) {
                var cached = this.register;
                this.register = registry || {};
                this.count = 0;
                return cached;
            }
        }),
        LIST = 'list',
        List = factories.Directive.extend(upCase(LIST), extend({
            constructor: function () {
                this.reset();
                return this;
            },
            empty: function () {
                return this.reset();
            },
            reset: function (items) {
                // can be array like
                var list = this;
                var old = list.items || [];
                list.items = items == NULL ? [] : (isArray(items) ? items : (isArrayLike(items) ? toArray(items) : [items]));
                list.iterating = list.iterating ? exception({
                    message: 'can\'t reset a list while it is iterating'
                }) : 0;
                list.reversed = BOOLEAN_FALSE;
                return list;
            },
            unwrap: function () {
                return this.items;
            },
            length: function () {
                return this.items.length;
            },
            first: function () {
                return this.items[0];
            },
            last: function () {
                return this.items[this.items.length - 1];
            },
            indexOf: function (object) {
                return smartIndexOf(this.items, object);
            },
            index: function (number) {
                return this.items[number || 0];
            },
            has: function (object) {
                return this.indexOf(object) !== -1;
            },
            sort: function (fn_) {
                // normalization sort function for cross browsers
                sort(this.items, fn_);
                return this;
            },
            toString: function () {
                return stringify(this.items);
            },
            toJSON: function () {
                return map(this.items, function (item) {
                    return result(item, TO_JSON);
                });
            }
        }, wrappedListMethods), BOOLEAN_TRUE),
        directiveResult = app.defineDirective(LIST, List[CONSTRUCTOR]),
        Collection = factories.Directive.extend('Collection', extend({
            has: directives.parody(LIST, 'has'),
            unwrap: directives.parody(LIST, 'unwrap'),
            empty: _.flow(directives.parody(LIST, 'reset'), directives.parody(REGISTRY, 'reset')),
            reset: directives.parody(LIST, 'reset'),
            length: directives.parody(LIST, 'length'),
            first: directives.parody(LIST, 'first'),
            last: directives.parody(LIST, 'last'),
            index: directives.parody(LIST, 'index'),
            toString: directives.parody(LIST, 'toString'),
            toJSON: directives.parody(LIST, TO_JSON),
            sort: directives.parody(LIST, 'sort'),
            get: directives.parody(REGISTRY, 'get'),
            register: directives.parody(REGISTRY, 'keep'),
            unRegister: directives.parody(REGISTRY, 'drop'),
            swapRegister: directives.parody(REGISTRY, 'swap'),
            constructor: function (arr) {
                this.directive(LIST).reset(arr);
                return this;
            },
            range: recreateSelf(range),
            concat: recreateSelf(function () {
                // this allows us to mix collections with regular arguments
                var base = this.unwrap();
                return base.concat.apply(base, map(arguments, function (arg) {
                    return Collection(arg).unwrap();
                }));
            }),
            call: function (arg) {
                this.each(function (fn) {
                    fn(arg);
                });
                return this;
            },
            results: function (key, arg) {
                return this.map(function (obj) {
                    return result(obj, key, arg);
                });
            }
            /**
             * @description adds models to the children array
             * @param {Object|Object[]} objs - object or array of objects to be passed through the model factory and pushed onto the children array
             * @param {Object} [secondary] - secondary hash that is common among all of the objects being created. The parent property is automatically overwritten as the object that the add method was called on
             * @returns {Object|Model} the object that was just created, or the object that the method was called on
             * @name Model#add
             * @func
             */
        }, wrap(recreatingSelfList, function (key) {
            return recreateSelf(function (one) {
                return this.list[key](one);
            });
        }), wrap(joinPopShiftHandlers.concat(indicesIteration), function (key) {
            return function (one, two, three) {
                return this.list[key](one, two, three);
            };
        }), wrap(pushUnshiftHandlers, function (key) {
            return function () {
                this.list[key](arguments);
                return this;
            };
        }), wrap(countingList, function (key) {
            return function (runner, countFrom, countTo) {
                this.list[key](runner, this, countFrom, countTo);
                return this;
            };
        }), wrap(reverseList.concat(eachHandlerKeys), function (key) {
            return function (one, two, three, four) {
                this.list[key](one, two || this);
                return this;
            };
        }), wrap(foldIteration, function (key) {
            return function (handler, memo, context) {
                return this.list[key](handler, memo, context || this);
            };
        }), wrap(findIteration, function (key) {
            return function (handler, context) {
                return this.list[key](handler, context || this);
            };
        })), BOOLEAN_TRUE),
        isNullMessage = {
            message: 'object must not be null or undefined'
        },
        validIdMessage = {
            message: 'objects in sorted collections must have either a number or string for their valueOf result'
        },
        SortedCollection = Collection.extend('SortedCollection', {
            constructor: function (list_, skip) {
                var sorted = this;
                Collection[CONSTRUCTOR].call(sorted);
                if (list_ && !skip) {
                    sorted.load(isArrayLike(list_) ? list_ : [list_]);
                }
                return sorted;
            },
            sort: function () {
                var sorted = this;
                sort(sorted.unwrap(), sorted.reversed ? function (a, b) {
                    return a < b;
                } : function (a, b) {
                    return a > b;
                });
                return sorted;
            },
            reverse: function () {
                var sorted = this;
                sorted.reversed = !sorted.reversed;
                sorted.sort();
                return sorted;
            },
            closest: function (value) {
                return closest(this.unwrap(), value);
            },
            validIDType: function (id) {
                return isNumber(id) || isString(id);
            },
            indexOf: function (object) {
                return smartIndexOf(this.unwrap(), object);
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
                if (!retrieved) {
                    ret = !sorted.validIDType(valueOfResult) && exception(validIdMessage);
                    sorted.addAt(object, sorted.closest(valueOfResult) + 1);
                    (registryDirective || sorted.directive(REGISTRY)).keep(ID, valueOfResult, object);
                    return BOOLEAN_TRUE;
                }
            },
            remove: function (object, index) {
                var where, sorted = this,
                    isNotNull = object == NULL && exception(isNullMessage),
                    valueOfResult = object && object.valueOf();
                if (object != NULL && sorted.get(ID, valueOfResult) != NULL) {
                    sorted.removeAt(index === UNDEFINED ? sorted.indexOf(object) : index);
                    sorted.unRegister(ID, valueOfResult);
                }
            },
            pop: function () {
                return this.remove(this.last());
            },
            shift: function () {
                return this.remove(this.first());
            }
        }, BOOLEAN_TRUE),
        StringObject = factories.Extendable.extend('StringObject', {
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
                return this.value;
            },
            generate: function () {
                return this.isValid() ? this.valueOf() : EMPTY_STRING;
            }
        }, BOOLEAN_TRUE),
        StringManager = SortedCollection.extend('StringManager', {
            Child: StringObject,
            add: function (string) {
                var sm = this,
                    found = sm.get(ID, string);
                if (string) {
                    if (found) {
                        found.isValid(BOOLEAN_TRUE);
                    } else {
                        found = new sm.Child(string, sm);
                        sm.unwrap().push(found);
                        sm.register(ID, string, found);
                    }
                }
                return found;
            },
            empty: function () {
                var sm = this;
                // wipes array and id hash
                Collection[CONSTRUCTOR][PROTOTYPE].empty.call(sm);
                // resets change counter
                sm.current(EMPTY_STRING);
                return sm;
            },
            increment: function () {
                this._changeCounter++;
            },
            decrement: function () {
                this._changeCounter--;
            },
            remove: function (string) {
                var sm = this,
                    found = sm.get(ID, string);
                if (string) {
                    if (found) {
                        found.isValid(BOOLEAN_FALSE);
                    }
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
            rebuild: function () {
                // rebuilds the registry
                var parent = this,
                    validResult = parent.foldl(function (memo, stringInstance) {
                        if (stringInstance.isValid()) {
                            memo.items.push(stringInstance);
                            memo.registry.id[stringInstance.value] = stringInstance;
                        }
                        return memo;
                    }, {
                        items: [],
                        registry: {
                            id: {}
                        }
                    });
                parent.directive(LIST).reset(validResult.items);
                parent.directive(REGISTRY).reset(validResult.registry);
            },
            generate: function (delimiter_) {
                var validResult, string = EMPTY_STRING,
                    parent = this,
                    previousDelimiter = parent.delimiter,
                    delimiter = delimiter_;
                if (!parent._changeCounter && delimiter === previousDelimiter) {
                    return parent.current();
                }
                parent.delimiter = delimiter;
                parent.rebuild();
                string = parent.join(delimiter);
                parent.current(string);
                return string;
            },
            current: function (current_) {
                var sm = this;
                if (arguments[LENGTH]) {
                    sm._changeCounter = 0;
                    sm._currentValue = current_;
                    return sm;
                } else {
                    return sm._currentValue;
                }
            },
            ensure: function (value_, splitter) {
                var sm = this,
                    value = value_,
                    delimiter = splitter === UNDEFINED ? SPACE : splitter,
                    isArrayResult = isArray(value),
                    madeString = (isArrayResult ? value.join(delimiter) : value);
                if (sm.current() === madeString) {
                    return sm;
                }
                sm.load(isArrayResult ? value : _.split(value, delimiter));
                sm.current(madeString);
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
        }, BOOLEAN_TRUE);
    app.defineDirective(REGISTRY, Registry[CONSTRUCTOR]);
});
app.scope(function (app) {
    var request = function (key, arg) {
            return this.hash[key] && this.hash[key](arg);
        },
        returns = function (affection) {
            return function () {
                return affection;
            };
        },
        reply = function (key, handler) {
            var hash = this.hash;
            intendedObject(key, handler, function (key, handler) {
                hash[key] = bind(isFunction(handler) ? handler : returns(handler), NULL);
            });
            return this;
        };
    app.defineDirective('messenger', function () {
        return {
            hash: {},
            reply: reply,
            request: request
        };
    });
});
var DISPATCH_EVENT = 'dispatchEvent',
    EVENTS = 'eventManager',
    STOP_LISTENING = 'stopListening',
    TALKER_ID = 'talkerId',
    LISTENING_TO = 'listeningTo',
    REGISTERED = 'registered',
    LISTENING_PREFIX = 'l',
    STATE = 'state',
    STATUS = 'status',
    STATUSES = STATUS + 'es',
    ACTIONS = 'actions',
    IS_STOPPED = 'isStopped',
    UPCASED_IS_STOPPED = upCase(IS_STOPPED),
    PROPAGATION = 'propagation',
    PROPAGATION_IS_STOPPED = PROPAGATION + UPCASED_IS_STOPPED,
    IMMEDIATE_PROP_IS_STOPPED = 'immediate' + upCase(PROPAGATION) + UPCASED_IS_STOPPED,
    HANDLERS = 'handlers';
app.scope(function (app) {
    var remove = _.remove,
        iterateOverObject = function (box, context, events, handler, iterator, firstArg) {
            // only accepts a string or a function
            var fn = isString(handler) ? box[handler] : handler,
                valid = !isFunction(fn) && exception({
                    message: 'handler must be a function or a string with a method on the prototype of the listener'
                });
            return duff(gapSplit(events), function (eventName) {
                iterator(box, eventName, {
                    disabled: BOOLEAN_FALSE,
                    namespace: eventName.split(COLON)[0],
                    name: eventName,
                    handler: fn,
                    context: context,
                    origin: box
                }, firstArg);
            });
        },
        // user friendly version
        flattenMatrix = function (iterator, _nameOrObjectIndex) {
            return function (first) {
                var context, args, nameOrObjectIndex, handlersIndex, list, nameOrObject, box = this;
                // if no name or no listen target then fail
                if (!first) {
                    return box;
                }
                args = toArray(arguments);
                if (!args[_nameOrObjectIndex]) {
                    return box;
                }
                nameOrObjectIndex = _nameOrObjectIndex;
                handlersIndex = _nameOrObjectIndex;
                list = args.splice(nameOrObjectIndex);
                nameOrObject = list[0];
                context = list[(isObject(nameOrObject) ? 1 : 2)] || box;
                intendedObject(nameOrObject, list[1], function (events, handlers) {
                    iterateOverObject(box, context, events, handlers, iterator, args[0]);
                });
                return box;
            };
        },
        curriedEquality = function (key, original) {
            return function (e) {
                return isEqual(original, e[ORIGIN].get(key));
            };
        },
        turnOff = function (e) {
            return e && e[ORIGIN] && e[ORIGIN].off && e[ORIGIN].off();
        },
        setupWatcher = function (iterator, nameOrObjectIndex, triggersOnce) {
            var after = triggersOnce ? turnOff : noop;
            return function () {
                var context, list, args, firstArg, handlersIndex, nameOrObject, original_handler, box = this,
                    ret = {};
                if (!arguments[0]) {
                    return ret;
                }
                args = toArray(arguments);
                handlersIndex = nameOrObjectIndex;
                list = args.splice(nameOrObjectIndex);
                nameOrObject = list[0];
                context = list[(isObject(nameOrObject) ? 2 : 3)] || box;
                if (nameOrObjectIndex && !args[0]) {
                    return ret;
                }
                intendedObject(nameOrObject, list[1], function (key_, value_, isObject_) {
                    // only allow one to be watched
                    var key = key_.split(SPACE)[0],
                        fun_things = original_handler || bind(list[isObject_ ? 1 : 2], context || box),
                        value = isFunction(value_) ? value_ : curriedEquality(key, value_),
                        handler = function (e) {
                            if (e && value(e)) {
                                fun_things(e);
                                after(e);
                            }
                        };
                    original_handler = fun_things;
                    iterateOverObject(box, context, CHANGE + COLON + key, handler, iterator, args[0]);
                    ret[key] = handler;
                });
                return ret;
            };
        },
        seekAndDestroy = function (box, list, handler, context) {
            var events = box[EVENTS];
            return events && list.duffRight(function (obj) {
                if (obj.disabled || (handler && obj.handler !== handler) || (context && obj.context !== context)) {
                    return;
                }
                events.detach(obj);
            });
        },
        attachEventObject = function (box, name, eventObject) {
            box.directive(EVENTS).attach(name, eventObject);
        },
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
            listenerDirective[TALKER_ID] = listenerDirective[TALKER_ID] || uniqueId(LISTENING_PREFIX);
            listening = listeningTo[talkerId] = {
                talker: talker,
                talkerId: talkerId,
                id: listenerDirective[TALKER_ID],
                listeningTo: listeningTo,
                // context: listener,
                count: 0
            };
            return listening;
        },
        DEFAULT_PREVENTED = 'defaultPrevented',
        SERIALIZED_DATA = '_sharedData',
        ObjectEvent = factories.Directive.extend('ObjectEvent', {
            constructor: function (data, target, name, options) {
                var evnt = this;
                evnt[PROPAGATION_IS_STOPPED] = evnt[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_FALSE;
                evnt[ORIGIN] = target;
                evnt[NAME] = name;
                evnt[TYPE] = name.split(COLON)[0];
                evnt.timeStamp = now();
                evnt[SERIALIZED_DATA] = {};
                evnt.data(data);
                if (options) {
                    extend(evnt, options);
                }
                return evnt;
            },
            isStopped: function () {
                return this[PROPAGATION_IS_STOPPED] || this[IMMEDIATE_PROP_IS_STOPPED];
            },
            data: function (datum) {
                return arguments[LENGTH] ? this.set(datum) : this[SERIALIZED_DATA];
            },
            get: function (key) {
                return this[SERIALIZED_DATA][key];
            },
            set: function (data) {
                var evnt = this;
                evnt[SERIALIZED_DATA] = isObject(data) ? data : {};
                return evnt;
            },
            stopImmediatePropagation: function () {
                this.stopPropagation();
                this[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_TRUE;
            },
            stopPropagation: function () {
                this[PROPAGATION_IS_STOPPED] = BOOLEAN_TRUE;
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
                evnt.isTrusted = BOOLEAN_FALSE;
                if (evnt.defaultIsPrevented()) {
                    return;
                }
                if ((actions = evnt[ACTIONS])) {
                    actions.call(evnt);
                }
            }
        }, BOOLEAN_TRUE),
        onceHandler = function (box, name, obj) {
            var fn = obj.fn || obj.handler;
            obj.fn = once(function (e) {
                box.off();
                return fn.apply(this, arguments);
            });
            attachEventObject(box, name, obj);
        },
        listenToHandler = function (box, name, obj, target) {
            var valid, targetDirective = target.directive(EVENTS),
                listeningObject = retreiveListeningObject(box, target),
                eventsDirective = target.directive(EVENTS),
                handlers = eventsDirective[HANDLERS] = eventsDirective[HANDLERS] || {};
            listeningObject.count++;
            obj.listening = listeningObject;
            attachEventObject(target, name, obj);
        },
        listenToOnceHandler = function (box, name, obj, extra) {
            bindOnce(box, name, obj);
            listenToHandler(box, name, obj, extra);
        },
        secretOffIterator = function (box, name, obj) {
            seekAndDestroy(box, !name || box.directive(EVENTS)[HANDLERS][name], obj.handler, obj.context);
        },
        directives = _.directives,
        Events = factories.Directive.extend('Events', {
            /**
             * @description attach event handlers to the Model event loop
             * @func
             * @name Model#on
             * @param {String} str - event name to listen to
             * @param {Function|String} fn - event handler or string corresponding to handler on prototype to use for handler
             * @param {Object} context - context that the handler will run in
             * @returns {Model} instance
             */
            uniqueKey: 'c',
            initialize: noop,
            on: flattenMatrix(attachEventObject, 0),
            once: flattenMatrix(onceHandler, 0),
            listenTo: flattenMatrix(listenToHandler, 1),
            listenToOnce: flattenMatrix(listenToOnceHandler, 1),
            watch: setupWatcher(attachEventObject, 0),
            watchOnce: setupWatcher(attachEventObject, 0, 1),
            watchOther: setupWatcher(listenToHandler, 1),
            watchOtherOnce: setupWatcher(listenToHandler, 1, 1),
            request: directives.parody('messenger', 'request'),
            reply: directives.parody('messenger', 'reply'),
            when: directives.parody('Linguistics', 'when'),
            mark: directives.parody(STATUS, 'mark'),
            unmark: directives.parody(STATUS, 'unmark'),
            is: directives.checkParody(STATUS, 'is', BOOLEAN_FALSE),
            constructor: function (opts) {
                var model = this;
                extend(model, opts);
                model[model.uniqueKey + ID] = model[model.uniqueKey + ID] || uniqueId(model.uniqueKey);
                // reacting to self
                model.on(model.events);
                model.initialize(opts);
                return model;
            },
            destroy: function () {
                this[STOP_LISTENING]();
                // this.directive(EVENTS).reset();
                return this;
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
                var context, currentObj, box = this,
                    name = name_,
                    events = box[EVENTS];
                if (!events) {
                    return;
                }
                context = isObject(name) ? fn_ : context_;
                if (arguments[LENGTH]) {
                    if (!name) {
                        each(events[HANDLERS], function (list, name) {
                            seekAndDestroy(box, list, fn_, context_);
                        });
                    } else {
                        intendedObject(name, fn_, function (name, fn_) {
                            iterateOverObject(box, context, name, fn_, secretOffIterator);
                        });
                    }
                } else {
                    currentObj = events[STACK].last();
                    if (currentObj) {
                        events.detach(currentObj);
                    }
                }
                return box;
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
            createEvent: function (data, name, options) {
                return ObjectEvent(data, this, name, options);
            },
            dispatchEvents: function (names) {
                var box = this;
                return duff(gapSplit(names), box.dispatchStack, box) && box;
            },
            dispatchStack: function (name) {
                return this[DISPATCH_EVENT](name);
            },
            dispatchEvent: function (name, data, options) {
                var eventsDirective, evnt, box = this;
                eventsDirective = (eventsDirective = box[EVENTS]) && eventsDirective.has(name) && box[EVENTS];
                if (eventsDirective && !eventsDirective.running[name]) {
                    evnt = box.createEvent(data, name, options);
                    eventsDirective.dispatch(name, evnt);
                    return evnt.returnValue;
                }
            }
        }, BOOLEAN_TRUE),
        StatusMarker = factories.Extendable.extend('StatusMarker', {
            constructor: function () {
                this[STATUSES] = {};
                return this;
            },
            has: function (status) {
                return this[STATUSES][status] !== UNDEFINED;
            },
            mark: function (status) {
                this[STATUSES][status] = BOOLEAN_TRUE;
            },
            unmark: function (status) {
                this[STATUSES][status] = BOOLEAN_FALSE;
            },
            toggle: function (status, direction) {
                this[STATUSES][status] = direction === UNDEFINED ? !this[STATUSES][status] : !!direction;
            },
            is: function (status) {
                return this[STATUSES][status];
            },
            isNot: function (status) {
                return !this.is(status);
            }
        });
    app.defineDirective(STATUS, StatusMarker[CONSTRUCTOR]);
});
app.scope(function (app) {
    var Collection = factories.Collection,
        Events = factories.Events,
        SORT = 'sort',
        ADDED = 'added',
        UNWRAP = 'unwrap',
        REMOVED = 'removed',
        // _COUNTER = '_counter',
        DESTROY = 'destroy',
        BEFORE_DESTROY = BEFORE_COLON + DESTROY,
        STOP_LISTENING = 'stopListening',
        _DELEGATED_CHILD_EVENTS = '_delegatedParentEvents',
        _PARENT_DELEGATED_CHILD_EVENTS = '_parentDelgatedChildEvents',
        modelMaker = function (attributes, options) {
            return Model(attributes, options);
        },
        // registers and actually adds child to hash
        _addToHash = function (parent, newModel, where) {
            var children = parent.directive(CHILDREN);
            // add to collection
            children.add(newModel);
            // register with parent
            children.register(ID, newModel.id, newModel);
            children.register(newModel.uniqueKey + ID, newModel[newModel.uniqueKey + ID], newModel);
        },
        // ties child events to new child
        _delegateChildEvents = function (parent, model) {
            var childsEventDirective, childEvents = _.result(parent, CHILD + 'Events');
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
                parentEvents = _.result(model, PARENT + 'Events');
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
        _removeFromHash = function (parent, child) {
            var children = parent.directive(CHILDREN);
            if (!children || !child) {
                return;
            }
            // remove the child from the children hash
            children.remove(child);
            children.unRegister(ID, child.id);
            // unregister from the child hash keys
            children.unRegister(child.uniqueKey + ID, child[child.uniqueKey + ID]);
        },
        /**
         * @class Model
         * @description event and attribute extensor object that creates the Model Constructor and convenience method at _.Model
         * @augments Model
         */
        Model = factories.Events.extend('Model', {
            // this id prefix is nonsense
            // define the actual key
            idAttribute: ID,
            constructor: function (attributes, secondary) {
                var model = this;
                model.reset(attributes);
                Events[CONSTRUCTOR].call(this, secondary);
                return model;
            },
            /**
             * @description remove attributes from the Model object. Does not completely remove from object with delete, but instead simply sets it to UNDEFINED / undefined
             * @param {String} attr - property string that is on the attributes object
             * @returns {Model} instance the method was called on
             * @func
             * @name Model#unset
             */
            unset: _.directives.checkParody(DATA, 'unset'),
            /**
             * @description returns attribute passed into
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {*} value that is present on the attributes object
             * @func
             * @name Model#get
             */
            get: _.directives.checkParody(DATA, 'get'),
            /**
             * @func
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {Boolean} evaluation of whether or not the Model instance has a value at that attribute key
             * @description checks to see if the current attribute is on the attributes object as anything other an undefined
             * @name Model#has
             */
            has: _.directives.checkParody(DATA, 'has', BOOLEAN_FALSE),
            setId: function (id) {
                var model = this;
                model.id = id === UNDEFINED ? uniqueId(BOOLEAN_FALSE, BOOLEAN_TRUE) : id;
                return model;
            },
            reset: function (data_) {
                var dataDirective, keysResult, hadDataDirective, childModel, children, model = this,
                    // automatically checks to see if the data is a string
                    passed = parse(data_) || {},
                    // build new data
                    defaultsResult = result(model, 'defaults', passed),
                    newAttributes = extend(defaultsResult, passed),
                    // try to get the id from the attributes
                    idAttributeResult = result(model, 'idAttribute', newAttributes),
                    idResult = model.setId(newAttributes[idAttributeResult]);
                // set id and let parent know what your new id is
                // setup previous data
                if (!model[DATA] && !((keysResult = keys(newAttributes))[LENGTH])) {
                    return model;
                }
                keysResult = keysResult || keys(newAttributes);
                model[DISPATCH_EVENT](BEFORE_COLON + RESET);
                dataDirective = model.directive(DATA);
                if (keysResult[LENGTH]) {
                    dataDirective.reset(newAttributes);
                } else {
                    model.directiveDestruction(DATA);
                }
                // let everything know that it is changing
                model[DISPATCH_EVENT](RESET);
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
                var removeRet, model = this;
                // notify things like parent that it's about to destroy itself
                model[DISPATCH_EVENT](BEFORE_DESTROY);
                // actually detach
                removeRet = model[PARENT] && model[PARENT].remove(model);
                // stop listening to other views
                model[DISPATCH_EVENT](DESTROY);
                // stops listening to everything
                factories.Events[CONSTRUCTOR][PROTOTYPE].destroy.call(model);
                delete model.id;
                return model;
            },
            set: function (key, value) {
                var changedList = [],
                    model = this,
                    dataDirective = model.directive(DATA),
                    previous = {};
                intendedObject(key, value, function (key, value) {
                    // definitely set the value, and let us know what happened
                    // and if you're not changing already, (already)
                    if (dataDirective.set(key, value) && !dataDirective.changing[name]) {
                        changedList.push(key);
                    }
                });
                // do not digest... this time
                if (!changedList[LENGTH]) {
                    return model;
                }
                // list
                dataDirective.digest(model, function () {
                    duff(changedList, function (name) {
                        dataDirective.changing[name] = BOOLEAN_TRUE;
                        model[DISPATCH_EVENT](CHANGE_COLON + name);
                        dataDirective.changing[name] = BOOLEAN_FALSE;
                    });
                });
                return model;
            },
            setDeep: function (where, value) {
                var former, lastkey, model = this,
                    dataDirective = model.directive(DATA),
                    triggers = [],
                    path = toArray(where, PERIOD);
                if (!dataDirective.setDeep(path, value)) {
                    return model;
                }
                dataDirective.digest(model, function () {
                    eachRight(path, function (item) {
                        var name = path.join(PERIOD);
                        dataDirective.changing[name] = BOOLEAN_TRUE;
                        model[DISPATCH_EVENT](CHANGE_COLON + name);
                        dataDirective.changing[name] = BOOLEAN_FALSE;
                        path.pop();
                    });
                });
                return model;
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
                return clone(this.directive(DATA)[CURRENT]);
            },
            current: function () {
                return clone(this.directive(DATA)[CURRENT]);
            },
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
            },
            Child: modelMaker,
            /**
             * @description resets the model's attributes to the object that is passed in
             * @name Model#reset
             * @func
             * @param {Object} attributes - non circular hash that is extended onto what the defaults object produces
             * @returns {Model} instance the method was called on
             */
            resetChildren: function (newChildren) {
                var length, child, model = this,
                    children = model.directive(CHILDREN),
                    arr = children[UNWRAP]();
                // this can be made far more efficient
                while (arr[LENGTH]) {
                    child = arr[0];
                    length = arr[LENGTH];
                    if (child) {
                        result(child, DESTROY);
                    }
                    // if it didn't remove itself,
                    // then you should remove it here
                    // this gets run if the child is a basic data type
                    if (arr[0] === child && arr[LENGTH] === length) {
                        remove(arr, child);
                    }
                }
                model.add(newChildren);
                return model;
            },
            isChildType: function (child) {
                return isInstance(child, this.Child);
            },
            // this one forcefully adds
            _add: function (model) {
                var parent = this,
                    children = parent.directive(CHILDREN),
                    evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](BEFORE_COLON + ADDED);
                // let the child know it's about to be added
                // (tied to it's parent via events)
                // unties models
                parent._remove(model);
                // explicitly tie to parent
                model[PARENT] = parent;
                // attach events from parent
                _addToHash(parent, model);
                // ties models together
                _delegateParentEvents(parent, model);
                _delegateChildEvents(parent, model);
                evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](ADDED);
                // notify that you were added
                return model;
            },
            // public facing version filters
            add: function (objs_, secondary_) {
                var childAdded, parent = this,
                    children = parent.directive(CHILDREN),
                    secondary = extend(result(parent, CHILD + 'Options'), secondary_ || {}),
                    list = Collection(objs_);
                // unwrap it if you were passed a collection
                if (!parent.Child || !list[LENGTH]()) {
                    return list[UNWRAP]();
                }
                list = list.foldl(function (memo, obj) {
                    var isChildType = parent.isChildType(obj),
                        // create a new model
                        // call it with new in case they use a constructor
                        newModel = isChildType ? obj : new parent.Child(obj, secondary),
                        // unfortunately we can only find by the newly created's id
                        // which we only know for sure after the child has been created ^
                        foundModel = children.get(ID, newModel.id);
                    if (foundModel) {
                        // update the old
                        foundModel.set(isChildType ? obj[TO_JSON]() : obj);
                        newModel = foundModel;
                    } else {
                        // add the new
                        childAdded = BOOLEAN_TRUE;
                        parent._add(newModel);
                    }
                    memo.push(newModel);
                    return memo;
                }, []);
                if (childAdded) {
                    parent[DISPATCH_EVENT](CHILD + COLON + ADDED);
                }
                return list;
            },
            // lots of private events
            _remove: function (model) {
                // cache the parent
                var parent = this;
                // let everyone know that this object is about to be removed
                model[DISPATCH_EVENT](BEFORE_COLON + REMOVED);
                // notify the child that the remove pipeline is starting
                // remove the parent events
                _unDelegateParentEvents(parent, model);
                // have parent remove it's child events
                _unDelegateChildEvents(parent, model);
                // attach events from parent
                _removeFromHash(parent, model);
                // void out the parent member tied directly to the model
                model[PARENT] = UNDEFINED;
                // let everyone know that you've offically separated
                model[DISPATCH_EVENT](REMOVED);
                // notify the child that the remove pipeline is done
                return model;
            },
            remove: function (idModel_) {
                var models, parent = this,
                    retList = Collection(),
                    idModel = idModel_;
                if (idModel_ == NULL) {
                    parent = this.parent;
                    retList = parent.remove(this);
                    return this;
                }
                if (!isObject(idModel)) {
                    // it's an id
                    idModel = parent.directive(CHILDREN).get(ID, idModel + EMPTY_STRING);
                }
                if (!idModel || !isObject(idModel)) {
                    return retList;
                }
                models = idModel && idModel.unwrap ? idModel.unwrap() : idModel;
                Collection(models).duff(function (model) {
                    var parent = model[PARENT];
                    var removeResult = parent && parent._remove(model);
                    retList.add(model);
                });
                if (retList[LENGTH]()) {
                    parent[DISPATCH_EVENT](CHILD + COLON + REMOVED);
                }
                return retList;
            },
            /**
             * @description basic sort function
             * @param {Function|String} comparator - argument to sort children against
             * @returns {Model} instance
             * @func
             * @name Model#sort
             */
            sort: function (comparator_) {
                var comparingAttribute, isReversed, model = this,
                    children = model[CHILDREN],
                    comparator = comparator_ || result(model, 'comparator');
                if (!children) {
                    return model;
                }
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
            }
        }, BOOLEAN_TRUE);
    // children should actually extend from collection.
    // it should require certain things of the children it is tracking
    // and should be able to listen to them
    app.defineDirective(CHILDREN, function () {
        return new Collection[CONSTRUCTOR](NULL, BOOLEAN_TRUE);
    });
    // trick the modelMaker into thinking it is a Model Constructor
    modelMaker[CONSTRUCTOR] = Model[CONSTRUCTOR];
});
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        __FN_ID__ = '__fnid__',
        event_incrementer = 1,
        Collection = factories.Collection,
        SortedCollection = factories.SortedCollection,
        REMOVE_QUEUE = 'removeQueue',
        listeningCounter = 0,
        returnsId = function () {
            return this.id;
        },
        EventsDirective = factories.Directive.extend('EventsDirective', {
            constructor: function () {
                var eventsDirective = this;
                eventsDirective.listenId = 'l' + (++listeningCounter);
                eventsDirective.handlers = {};
                eventsDirective.listeningTo = {};
                eventsDirective.running = {};
                eventsDirective.stack = Collection();
                eventsDirective.removeQueue = Collection();
                return eventsDirective;
            },
            destroy: function () {},
            attach: function (name, eventObject) {
                var list, eventsDirective = this,
                    handlers = eventsDirective[HANDLERS],
                    ret = !handlers && exception({
                        message: 'events directive needs a handler object'
                    });
                eventObject.id = ++event_incrementer;
                eventObject.valueOf = returnsId;
                eventObject.context = eventObject.context || eventObject.origin;
                eventObject.fn = bind(eventObject.fn || eventObject.handler, eventObject.context);
                // attach the id to the bound function because that instance is private
                eventObject.fn[__FN_ID__] = eventObject.id;
                list = handlers[name] = handlers[name] || SortedCollection();
                // attaching name so list can remove itself from hash
                list[NAME] = name;
                // attached so event can remove itself
                eventObject.list = list;
                list.add(eventObject);
            },
            detach: function (evnt) {
                var listeningTo, events = this,
                    listening = evnt.listening,
                    list = evnt.list,
                    disabled = evnt.disabled = BOOLEAN_TRUE;
                if (events[STACK][LENGTH]()) {
                    events[REMOVE_QUEUE].add(evnt);
                    return BOOLEAN_FALSE;
                } else {
                    list.remove(evnt);
                    // disconnect it from the list above it
                    evnt.list = UNDEFINED;
                    // check to see if it was a listening type
                    if (!listening) {
                        return BOOLEAN_TRUE;
                    }
                    // if it was then decrement it
                    listening.count--;
                    if (listening.count) {
                        return BOOLEAN_TRUE;
                    }
                    listeningTo = listening.listeningTo;
                    listeningTo[listening[TALKER_ID]] = UNDEFINED;
                    this.wipe(list);
                    return BOOLEAN_TRUE;
                }
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
                return stack.add(handler);
            },
            unQueue: function (stack, handler, evnt) {
                return stack.pop();
            },
            has: function (key) {
                return this.handlers[key] && this.handlers[key][LENGTH]();
            },
            dispatch: function (name, evnt) {
                var handler, listLength, i = 0,
                    events = this,
                    stack = events[STACK],
                    handlers = events[HANDLERS],
                    list = handlers[name],
                    removeList = events[REMOVE_QUEUE],
                    running = events.running,
                    cached = running[name];
                if (cached || evnt[IMMEDIATE_PROP_IS_STOPPED] || !list || !list[LENGTH]()) {
                    return;
                }
                running[name] = BOOLEAN_TRUE;
                list = list.unwrap();
                listLength = list[LENGTH];
                for (; i < listLength && !cached; i++) {
                    handler = list[i];
                    if (!handler.disabled && events.queue(stack, handler, evnt)) {
                        handler.fn(evnt);
                        cached = !!evnt[IMMEDIATE_PROP_IS_STOPPED];
                        events.unQueue(stack, handler, evnt);
                    }
                }
                if (!stack[LENGTH]() && removeList[LENGTH]()) {
                    removeList.duffRight(events.detach, events);
                    removeList.empty();
                }
                if (cached === UNDEFINED) {
                    delete running[name];
                } else {
                    running[name] = cached;
                }
                evnt.finished();
                return evnt.returnValue;
            }
        }, BOOLEAN_TRUE);
    app.defineDirective(EVENTS, factories.EventsDirective[CONSTRUCTOR]);
});
app.scope(function (app) {
    var _ = app._,
        periodSplit = splitGen(PERIOD),
        factories = _.factories,
        CHANGE_COUNTER = 'counter',
        CHANGING = 'changing',
        DataDirective = factories.Directive.extend('DataDirective', {
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
            unset: function (key) {
                var current = this[CURRENT];
                var previous = current[key];
                return (delete current[key]) && previous !== UNDEFINED;
            },
            reset: function (hash) {
                this[CURRENT] = hash;
            },
            setDeep: function (path, value) {
                var previous, dataDirective = this,
                    current = dataDirective[CURRENT];
                duff(periodSplit(path), function (key, index, path) {
                    var no_more = index === path[LENGTH] - 1;
                    previous = current;
                    current = no_more ? current[key] : isObject(current[key]) ? current[key] : (previous[key] = {});
                });
                if (previous && !isEqual(current, value)) {
                    previous[key] = value;
                    return BOOLEAN_TRUE;
                }
            },
            digest: function (model, fn) {
                var dataDirective = this;
                dataDirective[CHANGE_COUNTER]++;
                fn();
                dataDirective[CHANGE_COUNTER]--;
                // this event should only ever exist here
                if (!dataDirective[CHANGE_COUNTER]) {
                    model[DISPATCH_EVENT](CHANGE, dataDirective[CHANGING]);
                    dataDirective[CHANGING] = {};
                    dataDirective.previous = {};
                }
            },
            getDeep: function (key) {
                var lastkey, previous, dataDirective = this,
                    current = dataDirective[CURRENT];
                return duff(periodSplit(key), function (key, index, path) {
                    var no_more = index === path[LENGTH];
                    lastkey = key;
                    if (!no_more) {
                        current = isObject(current[key]) ? current[key] : {};
                    }
                }) && isString(lastkey) && current[lastkey];
            },
            has: function (key) {
                return this[CURRENT][key] != NULL;
            },
            each: function (fn) {
                return each(this[CURRENT], fn, this);
            }
        }, BOOLEAN_TRUE);
    app.defineDirective(DATA, DataDirective[CONSTRUCTOR]);
});
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Collection = factories.Collection,
        SUCCESS = 'success',
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
        Linguistics = factories.Events.extend(LINGUISTICS, {
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
                    change: sequencer.apply,
                    destroy: sequencer.stopListening
                });
                return this;
            },
            when: function (key) {
                return this[PARENT] ? this[PARENT].when(key) : exception({
                    message: 'this sequencer has been destroyed'
                });
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
                sequencer.logic.index(sequencer[GROUP_INDEX]).list.push(made);
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
        }, BOOLEAN_TRUE),
        LinguisticsManager = factories.Model.extend(LINGUISTICS + 'Manager', {
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
        }, BOOLEAN_TRUE);
    app.defineDirective(LINGUISTICS, LinguisticsManager[CONSTRUCTOR]);
});
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        FAILURE = 'failure',
        SUCCESS = 'success',
        STATE = 'state',
        ALWAYS = 'always',
        IS_EMPTYING = 'isEmptying',
        ALL_STATES = 'allStates',
        STASHED_ARGUMENT = 'stashedArgument',
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
        when = function () {
            var promise = Promise();
            return promise.when.apply(promise, arguments);
        },
        dispatch = function (promise, name, opts) {
            var shouldstop, finalName = name,
                allstates = result(promise, ALL_STATES),
                collected = [];
            while (!shouldstop) {
                if (_.posit(collected, finalName)) {
                    finalName = BOOLEAN_FALSE;
                } else {
                    collected.push(finalName);
                    promise.executeHandlers(finalName);
                    finalName = allstates[finalName];
                }
                shouldstop = !isString(finalName);
            }
        },
        executeIfNeeded = function (promise, name) {
            return function () {
                each(flatten(arguments), function (fn) {
                    if (isFunction(fn)) {
                        promise.executeHandler(name, fn, BOOLEAN_TRUE);
                    }
                });
                return promise;
            };
        },
        addState = function (key) {
            var promise = this;
            // if you haven't already attached a method, then do so now
            if (!promise[key]) {
                promise[key] = executeIfNeeded(promise, key);
            }
            return promise;
        },
        stateChecker = function (lookingfor) {
            return function () {
                var resulting = BOOLEAN_FALSE,
                    allstates = result(this, ALL_STATES),
                    next = this.get(STATE);
                while (isString(next) && !resulting) {
                    if (next === lookingfor) {
                        resulting = BOOLEAN_TRUE;
                    }
                }
                return resulting;
            };
        },
        Promise = _.Promise = factories.Model.extend('Promise', {
            addState: addState,
            isFulfilled: stateChecker(SUCCESS),
            isRejected: stateChecker(FAILURE),
            childEvents: {
                always: 'check'
            },
            events: {
                'child:added': 'check'
            },
            baseStates: function () {
                return {
                    success: ALWAYS,
                    failure: ALWAYS,
                    error: FAILURE,
                    always: BOOLEAN_TRUE
                };
            },
            constructor: function () {
                var promise = this;
                factories.Model[CONSTRUCTOR].call(promise);
                promise.restart();
                // cannot have been resolved in any way yet
                intendedObject(extend({}, result(promise, 'baseStates'), result(promise, 'associativeStates')), NULL, addState, promise);
                // add passed in success handlers
                promise.success(arguments);
                return promise;
            },
            check: function () {
                var notSuccessful, resolveAs, parent = this,
                    children = parent.directive(CHILDREN),
                    argumentAggregate = [];
                if (children.length() && !children.find(function (child) {
                    notSuccessful = notSuccessful || child.state() !== SUCCESS;
                    argumentAggregate.push(child.get(STASHED_ARGUMENT));
                    return !child.resolved();
                })) {
                    parent.resolveAs(notSuccessful ? FAILURE : SUCCESS, argumentAggregate);
                }
            },
            isChildType: function (promise) {
                return promise[SUCCESS] && promise[FAILURE] && promise[ALWAYS];
            },
            defaults: function () {
                return {
                    state: 'pending',
                    resolved: BOOLEAN_FALSE,
                    stashedArgument: NULL,
                    stashedHandlers: {},
                    reason: BOOLEAN_FALSE
                };
            },
            restart: function () {
                return this.set(this.defaults());
            },
            state: function () {
                return this.get(STATE);
            },
            auxilaryStates: function () {
                return BOOLEAN_FALSE;
            },
            allStates: function () {
                var resultResult = this._allStates = this._allStates || extend({}, result(this, 'baseStates'), result(this, 'auxilaryStates') || {});
                return resultResult;
            },
            fullfillments: function () {
                var allstates = result(this, ALL_STATES);
                var results = this._fullfillments = this._fullfillments || wrap(allstates, function (value, key_) {
                    var key = key_;
                    while (isString(key)) {
                        key = allstates[key];
                    }
                    // has to end in a boolean
                    return key;
                });
                return results;
            },
            resolved: function () {
                // allows resolved to be defined in a different way
                return this.get('resolved');
            },
            isPending: function () {
                return this.get(STATE) === 'pending';
            },
            resolveAs: function (resolveAs_, opts_, reason_) {
                var opts = opts_,
                    resolveAs = resolveAs_,
                    promise = this;
                if (promise.resolved()) {
                    return promise;
                }
                if (!isString(resolveAs)) {
                    opts = resolveAs;
                    resolveAs = BOOLEAN_FALSE;
                }
                promise.set({
                    resolved: BOOLEAN_TRUE,
                    // default state if none is given, is to have it succeed
                    state: resolveAs || FAILURE,
                    stashedArgument: opts,
                    reason: reason_ ? reason_ : BOOLEAN_FALSE
                });
                resolveAs = promise.get(STATE);
                wraptry(function () {
                    dispatch(promise, resolveAs);
                }, function () {
                    promise.set(STASHED_ARGUMENT, {
                        // nest the sucker again in case it's an array or something else
                        options: opts,
                        message: 'javascript execution error'
                    });
                    dispatch(promise, 'error');
                });
                return promise;
            },
            // convenience functions
            resolve: function (opts) {
                return this.resolveAs(SUCCESS, opts);
            },
            reject: function (opts) {
                return this.resolveAs(FAILURE, opts);
            },
            executeHandlers: function (name) {
                var handler, countLimit, promise = this,
                    arg = promise.get(STASHED_ARGUMENT),
                    handlers = promise.get('stashedHandlers')[name];
                if (handlers && handlers[LENGTH]) {
                    countLimit = handlers[LENGTH];
                    promise.set(IS_EMPTYING, BOOLEAN_TRUE);
                    while (handlers[0] && --countLimit >= 0) {
                        handler = handlers.shift();
                        // should already be bound
                        handler(arg);
                    }
                    promise.set(IS_EMPTYING, BOOLEAN_FALSE);
                }
                promise.dispatchEvent(name);
                return promise;
            },
            executeHandler: function (name, fn_, needsbinding) {
                var promise = this,
                    arg = promise.get(STASHED_ARGUMENT),
                    fn = fn_;
                promise.stashHandler(name, fn);
                if (promise.resolved() && !promise.get(IS_EMPTYING)) {
                    promise.executeHandlers(name);
                }
                return promise;
            },
            stashHandler: function (name, fn, needsbinding) {
                var promise = this,
                    stashedHandlers = promise.get('stashedHandlers'),
                    byName = stashedHandlers[name] = stashedHandlers[name] || [];
                if (isFunction(fn)) {
                    byName.push(bind(fn, this));
                }
            },
            handle: function (resolutionstate, fun) {
                this.addState(resolutionstate);
                this.executeHandler(resolutionstate, fun, BOOLEAN_TRUE);
                return this;
            },
            when: function () {
                var promise = this;
                promise.add(foldl(flatten(arguments), function (memo, pro) {
                    if (promise.isChildType(pro)) {
                        memo.push(pro);
                    }
                    return memo;
                }, []));
                return promise;
            }
        }, BOOLEAN_TRUE),
        appPromise = Promise();
    app.extend({
        dependency: function (promise) {
            return appPromise.when.apply(appPromise, arguments);
        }
    });
    _.exports({
        when: when
    });
});
app.scope(function (app) {
    /**
     * @class Associator
     * @augments Model
     */
    var _ = app._,
        factories = _.factories,
        ITEMS = 'items',
        DATASET = DATA + 'set',
        IS_ELEMENT = 'isElement',
        extend = _.extend,
        isObject = _.isObject,
        removeAt = _.removeAt,
        objectToString = {}.toString,
        Associator = factories.Directive.extend('Associator', {
            /**
             * @func
             * @name Associator#get
             * @param {Object} obj - object that data is being gotten against in the Associator
             * @param {String} [type] - toString version of the object being passed in
             */
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
                        key = obj[__ELID__] = obj[__ELID__] || uniqueId('el');
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
                    current = instance[type] = instance[type] || {},
                    lowerType = type.toLowerCase(),
                    globalindex = lowerType[INDEX_OF]('global'),
                    indexOfWindow = lowerType[INDEX_OF](WINDOW) === -1;
                // skip reading data
                if (globalindex === -1 && indexOfWindow && isObj) {
                    current.readData = BOOLEAN_TRUE;
                }
                return current;
            }
        }, BOOLEAN_TRUE);
    // _.exports({
    //     associator: Associator()
    // });
});
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        gapSplit = _.gapSplit,
        duff = _.duff,
        each = _.each,
        unCamelCase = _.unCamelCase,
        posit = _.posit,
        result = _.result,
        wraptry = _.wraptry,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        STATUS = 'status',
        FAILURE = 'failure',
        SUCCESS = 'success',
        READY_STATE = 'readyState',
        XDomainRequest = win.XDomainRequest,
        isObject = _.isObject,
        isArray = _.isArray,
        stringify = _.stringify,
        parse = _.parse,
        extend = _.extend,
        stringifyQuery = _.stringifyQuery,
        GET = 'GET',
        validTypes = gapSplit(GET + ' POST PUT DELETE'),
        baseEvents = gapSplit('progress timeout abort error'),
        /**
         * @description helper function to attach a bunch of event listeners to the request object as well as help them trigger the appropriate events on the Ajax object itself
         * @private
         * @arg {Ajax} instance to listen to
         * @arg {Xhr} instance to place event handlers to trigger events on the Ajax instance
         * @arg {string} event name
         */
        attachBaseListeners = function (ajax) {
            var prog = 0,
                req = ajax.requestObject;
            duff(baseEvents, function (evnt) {
                if (evnt === 'progress') {
                    req['on' + evnt] = function (e) {
                        prog++;
                        ajax.executeHandlers(evnt, {
                            percent: (e.loaded / e.total) || (prog / (prog + 1)),
                            counter: prog
                        });
                    };
                } else {
                    req['on' + evnt] = function (e) {
                        ajax.resolveAs(evnt);
                    };
                }
            });
        },
        sendthething = function (xhrReq, args, ajax) {
            return function () {
                wraptry(function () {
                    xhrReq.send.apply(xhrReq, args);
                }, function (e) {
                    ajax.resolveAs('error', e, e.message);
                });
            };
        },
        alterurlHandler = function () {
            var ajax = this,
                xhrReq = ajax.requestObject,
                type = ajax.get('type'),
                url = ajax.getUrl(),
                args = [],
                data = ajax.get('data');
            if (!url) {
                return;
            }
            ajax.attachResponseHandler();
            xhrReq.open(type, url, ajax.get('async'));
            if (data) {
                args.push(stringify(data));
            }
            ajax.setHeaders(ajax.get('headers'));
            attachBaseListeners(ajax);
            // have to wrap in set timeout for ie
            setTimeout(sendthething(xhrReq, args, ajax));
        },
        /**
         * @class Ajax
         * @alias factories.Ajax
         * @augments Model
         * @augments Model
         * @classdesc XHR object wrapper Triggers events based on xhr state changes and abstracts many anomalies that have to do with IE
         */
        Ajax = factories.Promise.extend('Ajax', {
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
                // ajax.async = BOOLEAN_TRUE;
                xhrReq = new XMLHttpRequest();
                // covers ie9
                if (!_.isUndefined(XDomainRequest)) {
                    xhrReq = new XDomainRequest();
                    method = 'onload';
                }
                if (!_.isObject(str)) {
                    str = str || EMPTY_STRING;
                    type = GET;
                    typeThing = str.toUpperCase();
                    if (posit(validTypes, typeThing)) {
                        type = typeThing;
                    } else {
                        url = str;
                    }
                    str = {
                        url: url || EMPTY_STRING,
                        type: type
                    };
                }
                str.async = BOOLEAN_TRUE;
                str.type = (str.type || GET).toUpperCase();
                str.method = method;
                factories.Promise.constructor.apply(ajax);
                ajax.on('change:url', alterurlHandler);
                extend(ajax, secondary);
                ajax.requestObject = xhrReq;
                ajax.set(str);
                return ajax;
            },
            status: function (code, handler) {
                return this.handle(STATUS + ':' + code, handler);
            },
            setHeaders: function (headers) {
                var ajax = this,
                    xhrReq = ajax.requestObject;
                each(headers, function (val, key) {
                    xhrReq.setRequestHeader(unCamelCase(key), val);
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
                if (isObject(url) && !isArray(url)) {
                    url = stringifyQuery(url);
                }
                return url;
            },
            /**
             * @description makes public the ability to attach a response handler if one has not already been attached. We recommend not passing a function in and instead just listening to the various events that the xhr object will trigger directly, or indirectly on the ajax object
             * @param {function} [fn=handler] - pass in a function to have a custom onload, onreadystatechange handler
             * @returns {ajax}
             * @name Ajax#attachResponseHandler
             */
            auxilaryStates: function () {
                return {
                    'status:200': SUCCESS,
                    'status:202': SUCCESS,
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
                    timeout: FAILURE,
                    abort: FAILURE
                };
            },
            parse: function (rawData) {
                return parse(rawData);
            },
            attachResponseHandler: function () {
                var ajax = this,
                    xhrReqObj = ajax.requestObject,
                    hasFinished = BOOLEAN_FALSE,
                    method = ajax.get('method'),
                    handler = function (evnt) {
                        var status, doIt, allStates, rawData, readystate, xhrReqObj = this;
                        if (!xhrReqObj || hasFinished) {
                            return;
                        }
                        status = xhrReqObj[STATUS];
                        readystate = xhrReqObj[READY_STATE];
                        rawData = xhrReqObj.responseText;
                        ajax.currentEvent = evnt;
                        ajax.set('readystate', readystate);
                        if (method === 'onload' || (method === 'onreadystatechange' && readystate === 4)) {
                            ajax.set(STATUS, status);
                            allStates = result(ajax, 'allStates');
                            if (allStates[STATUS + ':' + xhrReqObj[STATUS]] === SUCCESS) {
                                rawData = result(ajax, 'parse', rawData);
                            }
                            rawData = parse(rawData);
                            hasFinished = BOOLEAN_TRUE;
                            ajax.resolveAs(STATUS + ':' + xhrReqObj[STATUS], rawData);
                        }
                    };
                if (!xhrReqObj[method]) {
                    xhrReqObj[method] = handler;
                }
                return ajax;
            }
        }, BOOLEAN_TRUE);
    _.exports(_.foldl(validTypes, function (memo, key_) {
        var key = key_;
        key = key.toLowerCase();
        memo[key] = function (url) {
            return Ajax({
                type: key_,
                url: url
            });
        };
        return memo;
    }, {}));
});
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Model = factories.Model,
        Collection = factories.Collection,
        _EXTRA_MODULE_ARGS = '_extraModuleArguments',
        MODULES = 'modules',
        startableMethods = {
            start: function (evnt) {
                var startable = this;
                if (!startable.started) {
                    startable.started = BOOLEAN_TRUE;
                    startable[DISPATCH_EVENT](START, evnt);
                }
                return startable;
            },
            stop: function (evnt) {
                var startable = this;
                if (startable.started) {
                    startable.started = BOOLEAN_FALSE;
                    startable[DISPATCH_EVENT](STOP, evnt);
                }
                return startable;
            },
            toggle: function (evnt) {
                var startable = this;
                if (startable.started) {
                    startable[STOP](evnt);
                } else {
                    startable[START](evnt);
                }
                return startable;
            },
            restart: function (evnt) {
                var startable = this;
                if (startable.started) {
                    startable[STOP](evnt);
                }
                startable[START](evnt);
                return startable;
            }
        },
        Startable = factories.Model.extend('Startable', startableMethods, BOOLEAN_TRUE),
        doStart = function (e) {
            if (this.get('startWithParent')) {
                this[START](e);
            }
        },
        doStop = function (e) {
            if (this.get('stopWithParent')) {
                this[STOP](e);
            }
        },
        moduleMethods = extend({}, factories.Events[CONSTRUCTOR][PROTOTYPE], startableMethods, {
            module: function (name_, windo, fn) {
                var parentModulesDirective, modules, attrs, parentIsModule, nametree, parent = this,
                    originalParent = parent,
                    name = name_,
                    globalname = name,
                    namespace = name.split(PERIOD),
                    module = parent.directive(CHILDREN).get(name_);
                if (module) {
                    // hey, i found it. we're done here
                    parent = module.parent;
                    if (!fn) {
                        return module;
                    }
                    namespace = [module.id];
                } else {
                    // crap, now i have to make the chain
                    while (namespace.length > 1) {
                        parent = parent.module(namespace[0]);
                        namespace.shift();
                    }
                }
                parentModulesDirective = parent.directive(CHILDREN);
                name = namespace.join(PERIOD);
                module = parentModulesDirective.get(ID, name);
                if (!module) {
                    parentIsModule = _.isInstance(parent, Module);
                    if (parentIsModule) {
                        namespace.unshift(globalname);
                    }
                    namespace = namespace.join(PERIOD);
                    module = Module({
                        id: name,
                        globalname: namespace
                    }, {
                        application: app,
                        parent: parent
                    });
                    if (module.topLevel()) {
                        parentModulesDirective.add(module);
                    } else {
                        parent.add(module);
                    }
                    parentModulesDirective.register(ID, name, module);
                    app[CHILDREN].register(ID, globalname, module);
                }
                if (isWindow(windo) || isFunction(windo) || isFunction(fn)) {
                    module.isInitialized = BOOLEAN_TRUE;
                    module.run(windo, fn);
                }
                return module;
            },
            run: function (windo, fn_) {
                var module = this;
                var fn = isFunction(windo) ? windo : fn_;
                var args = isWindow(windo) ? [windo.DOMM] : [];
                if (isFunction(fn)) {
                    fn.apply(module, module.createArguments(args));
                }
                return module;
            },
            parentEvents: function () {
                return {
                    start: doStart,
                    stop: doStop
                };
            },
            exports: function (obj) {
                extend(BOOLEAN_TRUE, this.get('exports'), obj);
                return this;
            },
            createArguments: function (args) {
                return [this].concat(this.application.createArguments(), args || []);
            },
            constructor: function (attrs, opts) {
                var module = this;
                module.application = opts.application;
                module.handlers = Collection();
                Model[CONSTRUCTOR].apply(this, arguments);
                return module;
            },
            defaults: function () {
                return {
                    startWithParent: BOOLEAN_TRUE,
                    stopWithParent: BOOLEAN_TRUE,
                    exports: {}
                };
            },
            topLevel: function () {
                return this.application === this[PARENT];
            },
            childOptions: function () {
                return {
                    application: this.application,
                    parent: this
                };
            }
        }),
        Module = factories.Model.extend('Module', moduleMethods, BOOLEAN_TRUE),
        appextendresult = app.extend(extend({}, moduleMethods, {
            // _startPromise: _.when(domPromise),
            _extraModuleArguments: [],
            /**
             * @func
             * @name Specless#baseModuleArguments
             * @returns {Array} list of base arguments to apply to submodules
             */
            baseModuleArguments: function () {
                var app = this,
                    _ = app._;
                return [app, _, _ && _.factories];
            },
            /**
             * @func
             * @name Specless#addModuleArguments
             * @param {Array} arr - list of arguments that will be added to the extraModule args list
             * @returns {Specless} instance
             */
            addModuleArguments: function (arr) {
                var app = this;
                duff(arr, function (item) {
                    _.add(app[_EXTRA_MODULE_ARGS], item);
                });
                return app;
            },
            /**
             * @func
             * @name Specless#removeModuleArguments
             * @param {Array} arr - list of objects or functions that will be removed from the extraModuleArgs
             * @returns {Specless} instance
             */
            removeModuleArguments: function (arr) {
                var app = this;
                duff(arr, function (item) {
                    _.remove(app[_EXTRA_MODULE_ARGS], item);
                });
                return app;
            },
            /**
             * @func
             * @name Specless#createArguments
             * @returns {Object[]}
             */
            createArguments: function (args) {
                return this.baseModuleArguments().concat(this[_EXTRA_MODULE_ARGS], args || []);
            },
            require: function (modulename) {
                var module = this[CHILDREN].get(ID, modulename) || exception({
                    message: 'that module does not exist yet'
                });
                return module.get('exports');
            }
        }));
    app.defineDirective('modules', function () {
        return Collection();
    });
});
var isWindow = function (obj) {
    return obj && obj === obj[WINDOW];
};
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        posit = _.posit,
        Collection = factories.Collection,
        globalAssociator = factories.Associator(),
        DOM_MANAGER_STRING = 'DomManager',
        NODE_TYPE = 'nodeType',
        LOCAL_NAME = 'localName',
        APPEND_CHILD = 'appendChild',
        REMOVE_CHILD = 'removeChild',
        PARENT_NODE = 'parentNode',
        ITEMS = '_items',
        INNER_HTML = 'innerHTML',
        INNER_TEXT = 'innerText',
        DELEGATE_COUNT = '__delegateCount',
        REMOVE_QUEUE = 'removeQueue',
        IS_ATTACHED = 'isAttached',
        ADD_QUEUE = 'addQueue',
        CUSTOM_KEY = 'data-custom',
        CUSTOM_ATTRIBUTE = '[' + CUSTOM_KEY + ']',
        CLASS__NAME = (CLASS + HYPHEN + NAME),
        FONT_SIZE = 'fontSize',
        DEFAULT_VIEW = 'defaultView',
        DIV = 'div',
        IFRAME = 'iframe',
        devicePixelRatio = (win.devicePixelRatio || 1),
        ensure = function (el, owner) {
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
        // By default, Underscore uses ERB-style template delimiters, change the
        // following template settings to use alternative delimiters.
        // When customizing `templateSettings`, if you don't want to define an
        // interpolation, evaluation or escaping regex, we need one that is
        // guaranteed not to match.
        noMatch = /(.)^/,
        // Certain characters need to be escaped so that they can be put into a
        // string literal.
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
        // List of HTML entities for escaping,
        escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        },
        unescapeMap = invert(escapeMap),
        // Functions for escaping and unescaping strings to/from HTML interpolation,
        createEscaper = function (map) {
            var escaper = function (match) {
                return map[match];
            };
            // Regexes for identifying a key that needs to be escaped.
            var source = '(?:' + keys(map).join('|') + ')';
            var testRegexp = RegExp(source);
            var replaceRegexp = RegExp(source, 'g');
            return function (string) {
                string = string == NULL ? EMPTY_STRING : EMPTY_STRING + string;
                return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
            };
        },
        escape = createEscaper(escapeMap),
        unescape = createEscaper(unescapeMap),
        // JavaScript micro-templating, similar to John Resig's implementation.
        // Underscore templating handles arbitrary delimiters, preserves whitespace,
        // and correctly escapes quotes within interpolated code.
        // NB: `oldSettings` only exists for backwards compatibility.
        templateGenerator = function (text, templateSettings) {
            var settings = extend({}, templateSettings);
            // Combine delimiters into one regular expression via alternation.
            var matcher = RegExp([
                (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');
            // Compile the template source, escaping string literals appropriately.
            var index = 0;
            var source = "__p+='";
            text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
                source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
                index = offset + match.length;
                if (escape) {
                    source += "'+\n((__t=(this." + escape + "))==null?'':_.escape(__t))+\n'";
                } else if (interpolate) {
                    source += "'+\n((__t=(this." + interpolate + "))==null?'':__t)+\n'";
                } else if (evaluate) {
                    source += "';\n" + evaluate + "\n__p+='";
                }
                // Adobe VMs need the match returned to produce the correct offset.
                return match;
            });
            source += "';\n";
            // If a variable is not specified, place data values in local scope.
            // if (!settings.variable) source = 'with(this||{}){\n' + source + '}\n';
            source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
            var render;
            try {
                render = new Function.constructor(settings.variable || '_', source);
            } catch (e) {
                e.source = source;
                throw e;
            }
            var template = function (data) {
                return render.call(data || {}, _);
            };
            // Provide the compiled source as a convenience for precompilation.
            var argument = settings.variable || 'obj';
            template.source = 'function(' + argument + '){\n' + source + '}';
            return template;
        },
        compile = function (id, template_, context) {
            var template, templates = context.templates = context.templates || Collection(),
                templateHandler = templates.get(ID, id);
            if (templateHandler) {
                return templateHandler;
            }
            template = template_ || context.$('#' + id).html();
            templateHandler = templateGenerator(template, context.templateSettings);
            templateHandler.id = id;
            templates.push(templateHandler);
            templates.register(ID, id, templateHandler);
            return templateHandler;
        },
        isElement = function (object) {
            return !!(object && isNumber(object[NODE_TYPE]) && object[NODE_TYPE] === object.ELEMENT_NODE);
        },
        /**
         * @private
         * @func
         */
        /**
         * @private
         * @func
         */
        isDocument = function (obj) {
            return obj && isNumber(obj[NODE_TYPE]) && obj[NODE_TYPE] === obj.DOCUMENT_NODE;
        },
        isFragment = function (frag) {
            return frag && frag[NODE_TYPE] === doc.DOCUMENT_FRAGMENT_NODE;
        },
        getClosestWindow = function (windo_) {
            var windo = windo_ || win;
            return isWindow(windo) ? windo : (windo && windo[DEFAULT_VIEW] ? windo[DEFAULT_VIEW] : (windo.ownerGlobal ? windo.ownerGlobal : DOMM(windo).parent(WINDOW)[INDEX](0) || win));
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
        hasWebP = (function () {
            var countdown = 4,
                result = BOOLEAN_TRUE,
                queue = [],
                emptyqueue = function (fn) {
                    return function () {
                        countdown--;
                        fn();
                        if (!countdown) {
                            duff(queue, function (item) {
                                item(result);
                            });
                            queue = [];
                        }
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
        writeAttribute = function (el, key, val_) {
            el.setAttribute(key, (val_ === BOOLEAN_TRUE ? EMPTY_STRING : stringify(val_)) + EMPTY_STRING);
        },
        readAttribute = function (el, key) {
            var coerced, val = el.getAttribute(key);
            if (val === EMPTY_STRING) {
                val = BOOLEAN_TRUE;
            } else {
                if (val == NULL) {
                    val = BOOLEAN_FALSE;
                } else {
                    coerced = +val;
                    val = coerced === coerced ? coerced : val;
                }
            }
            return val;
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
        addRemoveAttributes = function (value_, stringManager) {
            // handle complex adding and removing
            var value = value_,
                isArrayResult = isArray(value);
            if (isObject(value) && !isArrayResult) {
                // toggles add remove value
                each(value, function (value, key) {
                    stringManager.add(key).toggle(!!value);
                });
            } else {
                if (!isArrayResult) {
                    value += EMPTY_STRING;
                }
                stringManager.refill(gapSplit(value));
            }
            return stringManager;
        },
        DO_NOT_TRUST = BOOLEAN_FALSE,
        cannotTrust = function (fn) {
            return function () {
                var ret, cachedTrust = DO_NOT_TRUST;
                DO_NOT_TRUST = BOOLEAN_TRUE;
                ret = fn.apply(this, arguments);
                DO_NOT_TRUST = cachedTrust;
                return ret;
            };
        },
        makeEachTrigger = function (attr, api) {
            var whichever = api || attr;
            return cannotTrust(function (manager) {
                var el = manager.element();
                if (ALL_EVENTS_HASH[whichever] && isFunction(el[whichever])) {
                    el[whichever]();
                } else {
                    manager[DISPATCH_EVENT](whichever);
                }
            });
        },
        triggerEventWrapper = function (attr_, api) {
            var attr = attr_ || api,
                eachHandler = makeEachTrigger(attr, api);
            return function (fn, fn2, capturing) {
                var domm = this;
                if (isFunction(fn) || isFunction(fn2)) {
                    domm.on(attr, fn, fn2, capturing);
                } else {
                    domm.duff(eachHandler);
                }
                return domm;
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
        Events = gapSplit('abort afterprint beforeprint blocked cached canplay canplaythrough change chargingchange chargingtimechange checking close complete dischargingtimechange DOMContentLoaded downloading durationchange emptied ended error fullscreenchange fullscreenerror input invalid languagechange levelchange loadeddata loadedmetadata message noupdate obsolete offline online open pagehide pageshow paste pause pointerlockchange pointerlockerror play playing ratechange reset seeked seeking stalled storage submit success suspend timeupdate updateready upgradeneeded versionchange visibilitychange'),
        SVGEvent = gapSplit('SVGAbort SVGError SVGLoad SVGResize SVGScroll SVGUnload SVGZoom volumechange waiting'),
        KeyboardEvent = gapSplit('keydown keypress keyup'),
        GamePadEvent = gapSplit('gamepadconnected gamepadisconnected'),
        CompositionEvent = gapSplit('compositionend compositionstart compositionupdate drag dragend dragenter dragleave dragover dragstart drop'),
        MouseEvents = gapSplit('click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup show wheel'),
        TouchEvents = gapSplit('touchcancel touchend touchenter touchleave touchmove touchstart'),
        DeviceEvents = gapSplit('devicemotion deviceorientation deviceproximity devicelight'),
        FocusEvent = gapSplit('blur focus'),
        TimeEvent = gapSplit('beginEvent endEvent repeatEvent'),
        AnimationEvent = gapSplit('animationend animationiteration animationstart transitionend'),
        AudioProcessingEvent = gapSplit('audioprocess complete'),
        UIEvents = gapSplit('abort error hashchange load orientationchange readystatechange resize scroll select unload beforeunload'),
        ProgressEvent = gapSplit('abort error load loadend loadstart popstate progress timeout'),
        AllEvents = _.concatUnique(Events, SVGEvent, KeyboardEvent, CompositionEvent, GamePadEvent, MouseEvents, TouchEvents, DeviceEvents, FocusEvent, TimeEvent, AnimationEvent, AudioProcessingEvent, UIEvents, ProgressEvent),
        knownPrefixes = gapSplit('-o- -ms- -moz- -webkit- mso- -xv- -atsc- -wap- -khtml- -apple- prince- -ah- -hp- -ro- -rim- -tc-'),
        trustedEvents = gapSplit('load scroll resize orientationchange click dblclick mousedown mouseup mouseover mouseout mouseenter mouseleave mousemove change contextmenu hashchange load mousewheel wheel readystatechange'),
        validTagNames = gapSplit('a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup data datalist dd del dfn div dl dt em embed fieldset figcaption figure footer form h1 - h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark meta meter nav noscript object ol optgroup option output p param pre progress q rb rp rt rtc ruby s samp script section select small source span strong style sub sup table tbody td template textarea tfoot th thead time title tr track u ul var video wbr'),
        validTagsNamesHash = wrap(validTagNames, BOOLEAN_TRUE),
        ALL_EVENTS_HASH = wrap(AllEvents, BOOLEAN_TRUE),
        knownPrefixesHash = wrap(knownPrefixes, BOOLEAN_TRUE),
        StringManager = factories.StringManager,
        readProperty = function (el, property) {
            return el[property];
        },
        writeProperty = function (el, property, value) {
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
        ensureManager = function (manager, attribute, currentValue) {
            var _attributeManager = manager.get(attribute);
            return _attributeManager.ensure(currentValue === BOOLEAN_TRUE ? EMPTY_STRING : currentValue, SPACE);
        },
        DOMIterator = function (fn, key, applies) {
            return function (one, two) {
                return fn(this.unwrap(), one, two, key, applies);
            };
        },
        DomManagerIterator = function (fn, key, applies) {
            return function (one, two) {
                return fn([this], one, two, key, applies);
            };
        },
        /**
         * @private
         * @func
         */
        // returns the flow of the element passed on relative to the element's bounding window
        flow = function (el, ctx) {
            var clientRect = el.getBoundingClientRect(),
                computedStyle = getComputed(el, ctx),
                marginTop = unitRemoval(computedStyle.marginTop),
                marginLeft = unitRemoval(computedStyle.marginLeft),
                marginRight = unitRemoval(computedStyle.marginRight),
                marginBottom = unitRemoval(computedStyle.marginBottom);
            return {
                height: clientRect[HEIGHT],
                width: clientRect[WIDTH],
                top: clientRect[TOP] - marginTop,
                left: clientRect[LEFT] - marginLeft,
                right: clientRect[LEFT] - marginLeft + clientRect[WIDTH] - marginRight,
                bottom: clientRect[TOP] - marginTop + clientRect[HEIGHT] - marginBottom
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
                    if (!posit(list, __prefix)) {
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
                bound(key, convertStyleValue(value_));
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
            var ret = isElement(item) ? item.getBoundingClientRect() : {};
            return {
                top: ret[TOP] || 0,
                left: ret[LEFT] || 0,
                right: ret[RIGHT] || 0,
                bottom: ret[BOTTOM] || 0,
                width: ret[WIDTH] || 0,
                height: ret[HEIGHT] || 0
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
        tag = function (el, str) {
            var tagName;
            if (!el || !isElement(el)) {
                return BOOLEAN_FALSE;
            }
            tagName = el[LOCAL_NAME].toLowerCase();
            return str ? tagName === str.toLowerCase() : tagName;
        },
        /**
         * @private
         * @func
         */
        createElement = function (str, manager) {
            var newManager, element = manager && manager.element(),
                registeredElements = manager && manager.registeredElements,
                foundElement = registeredElements && registeredElements[str],
                elementName = foundElement === BOOLEAN_TRUE ? str : foundElement,
                // native create
                newElement = elementName ? element.createElement(elementName) : exception({
                    message: 'tag name must be registered'
                });
            if (foundElement && foundElement !== BOOLEAN_TRUE) {
                // registeredElements
                attributeApi.write(newElement, CUSTOM_KEY, str);
            }
            return manager.returnsManager(newElement);
        },
        makeTree = function (str, manager) {
            var div = createElement(DIV, manager);
            // collect custom element
            div.html(str);
            return DOMM(div).children().remove().unwrap();
        },
        /**
         * @private
         * @func
         */
        matches = function (element, selector) {
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
            return !!posit(query(selector, parent), element);
        },
        createDocumentFragment = function (nulled, context) {
            return context.element().createDocumentFragment();
        },
        /**
         * @private
         * @func
         */
        createElements = function (tagName, context) {
            return DOMM(foldl(gapSplit(tagName), function (memo, name) {
                memo.push(createElement(name, context));
                return memo;
            }, []), NULL, NULL, NULL, context);
        },
        fragment = function (els_, context) {
            var frag, els = els_;
            if (isFragment(els)) {
                frag = els;
            } else {
                if (DOMM.isInstance(els)) {
                    els = els.unwrap();
                }
                if (!isArrayLike(els)) {
                    els = els && toArray(els);
                }
                frag = context.createDocumentFragment();
                duff(els, function (manager_) {
                    var parentNode, manager = context.returnsManager(manager_),
                        el = manager.element();
                    if (!manager.isElement || manager.isFragment) {
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
                return isString(string) ? dom.eachCall(attr, string) && dom : dom.map(getInnard.bind(NULL, attr)).join(EMPTY_STRING);
            };
        },
        horizontalTraverser = function (method, _idxChange) {
            return attachPrevious(function (idxChange_) {
                var domm = this,
                    collected = [],
                    list = domm.unwrap(),
                    idxChange = _idxChange || idxChange_;
                if (idxChange) {
                    domm.duff(function (manager) {
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
            if (manager.isElement) {
                if (value === BOOLEAN_TRUE) {
                    return element[STYLE][key];
                } else {
                    element[STYLE][key] = value;
                }
            }
        },
        styleValueModifiers = {
            '-webkit-transform': function (val) {
                return val;
            }
        },
        modifyFinalStyle = function (prop, val) {
            if (styleValueModifiers[prop]) {
                val = styleValueModifiers[prop](val);
            }
            return val;
        },
        styleAttributeMeat = function (manager, key, value, list, hash, handler, isProperty) {
            var finalProp, j, prefixes, cameledKey = camelCase(key),
                element = manager.element();
            list.push(cameledKey);
            if (value != NULL) {
                prefixes = [EMPTY_STRING] || prefixedStyles[cameledKey];
                for (j = 0; j < prefixes[LENGTH]; j++) {
                    finalProp = camelCase(prefixes[j] + cameledKey);
                    handler(manager, finalProp, modifyFinalStyle(finalProp, value));
                }
            } else {
                hash[key] = getComputed(firstEl)[cameledKey];
            }
        },
        DomManagerRunsInstances = function (handler, key, value, list, hash, diffHandler, isProperty) {
            return function (manager) {
                return handler(manager, key, value, list, hash, diffHandler, isProperty);
            };
        },
        ManagerProducesKeyValues = function (context, list, hash, totalHandler, handler, isProperty) {
            return function (key, value) {
                DomManagerRunsInstances(totalHandler, key, value, list, hash, handler, isProperty)(context);
            };
        },
        DOMproducesKeyValues = function (context, list, hash, totalHandler, handler, isProperty) {
            return function (key, value) {
                context.duff(DomManagerRunsInstances(totalHandler, key, value, list, hash, handler, isProperty));
            };
        },
        domAttributeManipulator = function (totalHandler, innerHandler, isProperty) {
            return function (understandsContext) {
                return function (key, value) {
                    var context = this,
                        hash = {},
                        list = [];
                    intendedObject(key, value, understandsContext(context, list, hash, totalHandler, innerHandler, isProperty));
                    return list[LENGTH] === 1 ? hash[list[0]] : context;
                };
            };
        },
        attachPrevious = function (fn) {
            return function () {
                var prev = this,
                    // ensures it's still a dom object
                    result = fn.apply(this, arguments),
                    // don't know if we went up or down, so use null as context
                    obj = new DOMM[CONSTRUCTOR](result, NULL, BOOLEAN_TRUE, NULL, prev.context.owner);
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
        createSelector = function (domm, args, fn) {
            var fun, selector, name = args.shift();
            if (isString(args[0]) || args[0] == NULL) {
                selector = args.shift();
            }
            if (isFunction(args[0])) {
                fn = bind(fn, domm);
                fun = args[0];
                duff(gapSplit(name), function (nme) {
                    var split = eventToNamespace(nme),
                        captures = BOOLEAN_FALSE,
                        namespaceSplit = nme.split(PERIOD),
                        nm = namespaceSplit.shift(),
                        namespace = namespaceSplit.join(PERIOD);
                    if (nm[0] === '_') {
                        nm = nm.slice(1);
                        captures = BOOLEAN_TRUE;
                    }
                    fn(nm, namespace, selector, fun, captures);
                });
            }
            return this;
        },
        expandEventListenerArguments = function (fn) {
            return function () {
                var selector, domm = this,
                    // if there's nothing selected, then do nothing
                    args = toArray(arguments),
                    nameOrObject = args.shift();
                if (isObject(nameOrObject)) {
                    if (isString(args[0])) {
                        selector = args.shift();
                    }
                    each(nameOrObject, function (handler, key) {
                        createSelector(domm, [key, selector, handler].concat(args), fn);
                    });
                    return domm;
                } else {
                    args.unshift(nameOrObject);
                    return createSelector(domm, args, fn);
                }
            };
        },
        validateEvent = function (evnt, el, name_) {
            return !isObject(evnt) ? {
                type: evnt || name_,
                bubbles: BOOLEAN_FALSE,
                eventPhase: 2,
                cancelable: BOOLEAN_FALSE,
                defaultPrevented: BOOLEAN_FALSE,
                data: EMPTY_STRING,
                isTrusted: BOOLEAN_FALSE,
                timeStamp: now(),
                target: el
            } : evnt;
        },
        isCapturing = function (evnt) {
            var capturing = BOOLEAN_FALSE,
                eventPhase = evnt.eventPhase;
            if (eventPhase === 1) {
                capturing = BOOLEAN_TRUE;
            }
            return capturing;
        },
        findMatch = function (el, target, selector) {
            var parent, found = NULL;
            if (selector && isString(selector)) {
                parent = target;
                while (parent && !found && isElement(parent) && parent !== el) {
                    if (matches(parent, selector)) {
                        found = parent;
                    }
                    parent = parent[PARENT_NODE];
                }
            }
            return found;
        },
        _eventExpander = wrap({
            ready: 'DOMContentLoaded',
            deviceorientation: 'deviceorientation mozOrientation',
            fullscreenalter: 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange',
            hover: 'mouseenter mouseleave',
            forcewillbegin: 'mouseforcewillbegin webkitmouseforcewillbegin',
            forcechange: 'mouseforcechange webkitmouseforcechange',
            forcedown: 'mouseforcedown webkitmouseforcedown',
            forceup: 'mouseforceup webkitmouseforceup',
            force: 'mouseforcewillbegin webkitmouseforcewillbegin mouseforcechange webkitmouseforcechange mouseforcedown webkitmouseforcedown mouseforceup webkitmouseforceup'
        }, gapSplit),
        distilledEventName = foldl(_eventExpander, function (memo, arr, key) {
            duff(arr, function (item) {
                memo[item] = key;
            });
            return memo;
        }, {}),
        eventExpander = function (fn_) {
            return function (nme) {
                var fn = bind(fn_, this);
                duff(gapSplit(_eventExpander[nme] || nme), function (name) {
                    fn(name, nme);
                });
            };
        },
        addEventListener = expandEventListenerArguments(function (name, namespace, selector, callback, capture) {
            var manager = this;
            return isFunction(callback) ? _addEventListener(manager, name, namespace, selector, callback, capture) : manager;
        }),
        addEventListenerOnce = expandEventListenerArguments(function (types, namespace, selector, callback, capture) {
            var _callback, manager = this;
            return isFunction(callback) && _addEventListener(manager, types, namespace, selector, (_callback = once(function () {
                _removeEventListener(manager, types, namespace, selector, _callback, capture);
                return callback.apply(this, arguments);
            })), capture);
        }),
        removeEventListener = expandEventListenerArguments(function (name, namespace, selector, handler, capture) {
            var manager = this;
            return isFunction(handler) ? _removeEventListener(manager, name, namespace, selector, handler, capture) : manager;
        }),
        _addEventListener = function (manager, types, namespace, selector, fn_, capture) {
            var handleObj, eventHandler, el = manager.element(),
                events = manager.directive(EVENTS),
                elementHandlers = events.elementHandlers = events.elementHandlers || {},
                fn = bind(fn_, manager),
                wasCustom = manager.isCustom;
            duff(gapSplit(types), eventExpander(function (name, passedName) {
                var foundDuplicate, handlerKey = capture + COLON + name,
                    handlers = events[HANDLERS][handlerKey] = events[HANDLERS][handlerKey] || SortedCollection(),
                    mainHandler = elementHandlers[handlerKey];
                if (!mainHandler) {
                    eventHandler = function (e) {
                        return eventDispatcher(manager, e.type, e, capture);
                    };
                    if (el.addEventListener) {
                        el.addEventListener(name, eventHandler, capture);
                    } else {
                        if (capture) {
                            return;
                        }
                        el.attachEvent(name, eventHandler);
                    }
                    mainHandler = elementHandlers[handlerKey] = {
                        fn: eventHandler,
                        __delegateCount: 0,
                        events: events,
                        currentEvent: NULL,
                        capturing: capture
                    };
                }
                foundDuplicate = handlers.find(function (obj) {
                    return fn_ === obj.handler && obj.namespace === namespace && selector === obj.selector;
                });
                if (foundDuplicate) {
                    return;
                }
                if (!ALL_EVENTS_HASH[name]) {
                    manager.customListeners = BOOLEAN_TRUE;
                }
                addEventQueue({
                    id: ++eventIdIncrementor,
                    valueOf: returnsId,
                    fn: fn,
                    handler: fn_,
                    disabled: BOOLEAN_FALSE,
                    list: handlers,
                    name: name,
                    namespace: namespace,
                    mainHandler: mainHandler,
                    selector: selector,
                    passedName: passedName
                });
            }));
            if (!wasCustom && manager.customListeners) {
                markCustom(manager, BOOLEAN_TRUE);
                manager.isAttached = isAttached(manager.element(), manager.owner);
            }
            return manager;
        },
        eventToNamespace = function (evnt) {
            if (!isString(evnt)) {
                evnt = evnt.type;
            }
            evnt = evnt.split(PERIOD);
            var evntName = evnt.shift();
            return [evntName, evnt.sort().join(PERIOD)];
        },
        SortedCollection = factories.SortedCollection,
        eventIdIncrementor = 0,
        returnsId = function () {
            return this.id;
        },
        appendChild = function (el) {
            return this.insertAt(el, NULL);
        },
        attributeParody = function (method) {
            return function (one, two) {
                return attributeApi[method](this.element(), one, two);
            };
        },
        getInnard = function (attribute, manager) {
            var windo, win, doc, parentElement, returnValue = EMPTY_STRING;
            if (manager.isIframe) {
                testIframe(manager);
                windo = manager.window();
                if (windo.isAccessable) {
                    parentElement = windo.element();
                    doc = parentElement[DOCUMENT];
                    returnValue = doc.body ? doc.body[PARENT_NODE].outerHTML : EMPTY_STRING;
                }
            } else {
                if (manager.isElement) {
                    parentElement = manager.element();
                    returnValue = parentElement[attribute];
                }
            }
            return returnValue;
        },
        setInnard = function (attribute, manager, value) {
            var win, doc, windo, parentElement;
            if (manager.isIframe) {
                windo = manager.window();
                testIframe(manager);
                if (windo.isAccessable) {
                    parentElement = windo.element();
                    doc = parentElement[DOCUMENT];
                    doc.open();
                    doc.write(value);
                    doc.close();
                }
            } else {
                if (manager.isElement) {
                    parentElement = manager.element();
                    parentElement[attribute] = value || EMPTY_STRING;
                    duff(query(CUSTOM_ATTRIBUTE, parentElement), manager.owner.returnsManager, manager.owner);
                }
            }
        },
        innardManipulator = function (attribute) {
            return function (value) {
                var manager = this,
                    returnValue = manager;
                if (value === UNDEFINED) {
                    returnValue = getInnard(attribute, manager);
                } else {
                    setInnard(attribute, manager, value);
                }
                return returnValue;
            };
        },
        /**
         * @func
         */
        testIframe = function (manager) {
            var contentWindow, contentWindowManager, element = manager.element();
            manager.isIframe = manager.tagName === IFRAME;
            if (!manager.isIframe) {
                return;
            }
            contentWindow = element.contentWindow;
            manager.windowReady = !!contentWindow;
            if (manager.windowReady) {
                contentWindowManager = manager.owner.returnsManager(contentWindow);
                contentWindowManager.iframe = manager;
                markGlobal(contentWindowManager);
            }
        },
        eventDispatcher = function (manager, name, e, capturing_) {
            var capturing = !!capturing_,
                fullName = capturing + COLON + name;
            return factories.Events[CONSTRUCTOR][PROTOTYPE][DISPATCH_EVENT].call(manager, fullName, validateEvent(e, manager.element(), name), capturing);
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
        directEvents = gapSplit('blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'),
        // collected here so DOMM can do what it wants
        allDirectMethods = directEvents.concat(_.keys(videoDirectEvents), _.keys(directAttributes)),
        isAttached = function (element_, owner) {
            var parent, potential, manager = owner.returnsManager(element_),
                element = manager.element();
            if (manager[IS_ATTACHED]) {
                return manager[IS_ATTACHED];
            }
            if (manager.isWindow) {
                return BOOLEAN_TRUE;
            }
            while (!parent && element[PARENT_NODE]) {
                potential = element[PARENT_NODE];
                if (isFragment(potential)) {
                    return BOOLEAN_FALSE;
                }
                if (!isElement(potential)) {
                    return BOOLEAN_TRUE;
                }
                if (potential[__ELID__]) {
                    manager[IS_ATTACHED] = isAttached(potential, owner);
                    return manager[IS_ATTACHED];
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
                    var original = manager.isAttached;
                    manager.isAttached = mark;
                    if (mark !== original && manager.isElement && manager.customListeners) {
                        managers.push(manager);
                    }
                });
                _.eachCall(managers, DISPATCH_EVENT, evnt);
            };
        },
        dispatchDetached = dispatchDomEvent('detach', BOOLEAN_FALSE),
        dispatchAttached = dispatchDomEvent('attach', BOOLEAN_TRUE),
        applyStyle = function (key, value, manager) {
            var cached, element = manager.element();
            if (manager.isElement && element[STYLE][key] !== value) {
                cached = attributeApi.read(element, STYLE);
                element[STYLE][key] = convertStyleValue(key, value);
                return attributeApi.read(element, STYLE) !== cached;
            }
            return BOOLEAN_FALSE;
        },
        attributeValuesHash = {
            set: function (attributeManager, set, nulled, read) {
                attributeManager.refill(set === BOOLEAN_TRUE ? [] : set);
                if (set === BOOLEAN_FALSE) {
                    attributeManager.isRemoving = BOOLEAN_TRUE;
                }
                return attributeManager;
            },
            add: function (attributeManager, add) {
                duff(add, attributeManager.add, attributeManager);
                return attributeManager;
            },
            remove: function (attributeManager, remove) {
                duff(remove, attributeManager.remove, attributeManager);
                return attributeManager;
            },
            toggle: function (attributeManager, togglers, direction) {
                duff(togglers, function (toggler) {
                    attributeManager.toggle(toggler, direction);
                });
                return attributeManager;
            },
            change: function (attributeManager, remove, add_) {
                var add = gapSplit(add_);
                return this.add(this.remove(attributeManager, remove), add);
            }
        },
        unmarkChange = function (fn) {
            return function (manager, idx) {
                var returnValue = fn(manager, idx);
                if (manager.attributesChanging) {
                    manager[DISPATCH_EVENT]('attributeChange');
                }
                return returnValue;
            };
        },
        queueAttributeValues = function (attribute_, second_, third_, api, domHappy_, merge, passedTrigger_) {
            var attribute = attribute_ === CLASS ? CLASSNAME : attribute_,
                domHappy = domHappy_ || unCamelCase,
                unCamelCased = api.preventUnCamel ? attribute : domHappy(attribute),
                withClass = unCamelCased === CLASSNAME || unCamelCased === CLASS__NAME,
                trigger = (withClass ? (api = propertyApi) && (unCamelCased = CLASSNAME) && CLASSNAME : passedTrigger_) || unCamelCased;
            return function (manager, idx) {
                var generated, el = manager.element(),
                    read = api.read(el, unCamelCased),
                    returnValue = manager,
                    attributeManager = ensureManager(manager, unCamelCased, read);
                if (merge === 'get') {
                    if (!idx) {
                        returnValue = read;
                    }
                    return returnValue;
                }
                attributeManager.api = api;
                intendedObject(second_, third_, function (second, third) {
                    var currentMerge = merge || (third === BOOLEAN_TRUE ? 'add' : (third === BOOLEAN_FALSE ? 'remove' : 'toggle'));
                    attributeValuesHash[currentMerge](attributeManager, gapSplit(second), third, read);
                });
                if (attributeManager._changeCounter) {
                    if (attributeManager.isRemoving) {
                        attributeManager.isRemoving = BOOLEAN_FALSE;
                        api.remove(el, unCamelCased);
                    } else {
                        generated = attributeManager.generate(SPACE);
                        api.write(el, unCamelCased, generated);
                    }
                }
                if (generated !== read && manager.customListeners) {
                    manager.attributesChanging = BOOLEAN_TRUE;
                    manager[DISPATCH_EVENT]('attributeChange:' + trigger, {
                        previous: read,
                        current: generated
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
            var values = gapSplit(values_);
            return function (manager) {
                var el = manager.element(),
                    attributeManager = manager.get(property),
                    read = api.read(el, property);
                attributeManager.ensure(read, SPACE);
                return find(values, function (value) {
                    var stringInstance = attributeManager.get(ID, value);
                    return stringInstance ? !stringInstance.isValid() : BOOLEAN_TRUE;
                });
            };
        },
        setValue = unmarkChange(domAttributeManipulatorExtended(queueAttributeValues, 'set', attributeApi)),
        addValue = unmarkChange(domAttributeManipulatorExtended(queueAttributeValues, 'add', attributeApi)),
        removeValue = unmarkChange(domAttributeManipulatorExtended(queueAttributeValues, 'remove', attributeApi)),
        toggleValue = unmarkChange(domAttributeManipulatorExtended(queueAttributeValues, 'toggle', attributeApi)),
        changeValue = unmarkChange(domAttributeManipulatorExtended(queueAttributeValues, 'change', attributeApi)),
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
                        context = context.index(0);
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
        propApi = getSetter(queueAttributeValues, propertyApi, unCamelCase),
        domFirst = function (handler, context) {
            var first = context.index(0);
            return first && handler(first, 0);
        },
        domIterates = function (handler, context) {
            context.each(handler);
            return context;
        },
        returnsFirst = function (fn, context) {
            return fn(context.index(), 0);
        },
        domContextFind = function (fn, context) {
            return !context.find(fn);
        },
        makeValueTarget = function (target, passed_, api, domHappy) {
            var passed = passed_ || target;
            return _.foldl(gapSplit('add remove toggle change has set'), function (memo, method_) {
                var method = method_ + 'Value';
                memo[method_ + upCase(target)] = function (one, two) {
                    return this[method](passed, one, two, api, domHappy, target);
                };
                return memo;
            }, {});
        },
        markCustom = function (manager, forceCustom) {
            var isCustomValue = readAttribute(manager.element(), CUSTOM_KEY),
                isCustom = manager.isCustom = forceCustom || !!isCustomValue;
            (isCustom ? writeAttribute : removeAttribute)(manager.element(), CUSTOM_KEY, isCustomValue || BOOLEAN_TRUE);
            if (isCustomValue) {
                manager.registeredAs = isCustomValue;
            }
        },
        markElement = function (manager) {
            var element;
            manager.isElement = BOOLEAN_FALSE;
            manager.isIframe = BOOLEAN_FALSE;
            manager.tagName = BOOLEAN_FALSE;
            if (manager.isWindow) {
                // manager.windowReady = BOOLEAN_TRUE;
                return;
            }
            element = manager.element();
            if ((manager.isElement = isElement(element))) {
                manager.tagName = tag(element);
                testIframe(manager);
                markCustom(manager);
            }
        },
        markGlobal = function (manager) {
            var element = manager.element();
            manager.isWindow = isWindow(element);
            if (!manager.isWindow || !manager.owner) {
                return;
            }
            manager.isAccessable = !!wraptry(function () {
                return element[DOCUMENT];
            });
            manager.isTop = !!(window && element === window.top);
            manager.setAddress();
            if (!manager.isAccessable) {
                return;
            }
            if (manager.isTop) {
                // tests do not fail on top window
                return;
            }
            // more accessable tests
            manager.isAccessable = manager.sameOrigin();
        },
        test = function (manager, owner) {
            var el = manager.element();
            markGlobal(manager);
            markElement(manager);
            manager.isDocument = BOOLEAN_FALSE;
            manager.isFragment = BOOLEAN_FALSE;
            manager[IS_ATTACHED] = BOOLEAN_FALSE;
            if (manager.isWindow) {
                manager[IS_ATTACHED] = BOOLEAN_TRUE;
                return;
            }
            manager.isDocument = isDocument(el);
            manager.isFragment = isFragment(el);
            if (manager.isDocument || manager.isFragment) {
                manager[IS_ATTACHED] = BOOLEAN_TRUE;
                return;
            }
            manager[IS_ATTACHED] = isAttached(manager, owner);
        },
        registeredElementName = function (name, manager) {
            return ELEMENT + HYPHEN + manager.documentId + HYPHEN + name;
        },
        query = function (str, ctx) {
            return toArray((ctx || doc_).querySelectorAll(str));
        },
        DOMM_SETUP = factories.DOMM_SETUP = function (doc_) {
            var registeredElements, setup, query, wrapped, manager = returnsManager(doc_, BOOLEAN_TRUE);
            if (manager.documentId) {
                return manager.query;
            }
            registeredElements = clone(validTagsNamesHash);
            setup = function (e) {
                manager.DOMContentLoadedEvent = e;
                manager.isReady = BOOLEAN_TRUE;
            };
            query = function (sel, ctx) {
                var context = ctx || manager;
                return DOMM(sel, context, BOOLEAN_FALSE, manager === context, manager);
            };
            manager.documentId = uniqueId('doc');
            wrapped = extend(wrap({
                makeTree: makeTree,
                createElement: createElement,
                createElements: createElements,
                createDocumentFragment: createDocumentFragment,
                registeredElementName: registeredElementName,
                query: query,
                fragment: function () {
                    return returnsManager(fragment(NULL, manager), manager);
                },
                $: query,
                // returnsManager: returnsManager
            }, function (handler) {
                return function (one) {
                    return handler(one, manager);
                };
            }), {
                returnsManager: function (item) {
                    return item === manager || item === manager[TARGET] ? manager : returnsManager(item, manager);
                },
                data: factories.Associator(),
                documentId: manager.documentId,
                document: manager,
                constructor: DOMM[CONSTRUCTOR],
                registeredElements: registeredElements,
                templateSettings: {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /<%=([\s\S]+?)%>/g,
                    escape: /<%-([\s\S]+?)%>/g
                },
                compile: function (id, string) {
                    return compile(id, string, manager);
                },
                collectTemplates: function () {
                    query('script[id]').each(function (script) {
                        compile(script.element().id, script.html(), manager);
                        script.remove();
                    });
                },
                registerElement: function (name, options_) {
                    var generatedTagName, wasDefined, options = options_ || {},
                        lastKey = [],
                        prototype = options.prototype,
                        creation = options.onCreate || noop,
                        destruction = options.onDestroy,
                        newName = manager.registeredElementName(name),
                        directiveCreation = function (instance, name, directive) {
                            var extendResult = prototype && extend(instance, prototype);
                            var newDirective = directive || {};
                            var createResult = creation(instance, newDirective);
                            if (destruction) {
                                instance.on('destroy', destruction);
                            }
                            return newDirective;
                        },
                        directiveDestruction = function (directive, instance, name) {
                            each(prototype, function (value, key) {
                                if (instance[key] === value) {
                                    delete instance[key];
                                }
                            });
                            if (destruction) {
                                instance.dispatchEvent('destroy');
                                instance.off('destroy', destruction);
                            }
                        };
                    if (validTagsNamesHash[name]) {
                        exception({
                            message: 'element names must not be used natively by browsers'
                        });
                    } else {
                        wasDefined = (options.extends && !validTagsNamesHash[options.extends] ? app.extendDirective(manager.registeredElementName(options.extends), newName, directiveCreation, directiveDestruction) : app.defineDirective(newName, directiveCreation, directiveDestruction)) || exception({
                            message: 'element names can only be registered once per document'
                        });
                        registeredElements[name] = options.extends ? registeredElements[options.extends] : DIV;
                    }
                }
            });
            extend(manager, wrapped);
            extend(query, wrapped);
            if (manager.isReady === UNDEFINED) {
                manager.isReady = BOOLEAN_FALSE;
                if (manager.element().readyState === 'complete') {
                    setup({});
                } else {
                    manager.on('DOMContentLoaded', setup);
                }
            }
            return query;
        },
        styleManipulator = function (one, two) {
            var manager, styles;
            if (isString(one) && two === UNDEFINED) {
                return (manager = this.index(0)) && (styles = manager.getStyle()) && (prefix = _.find(prefixes[camelCase(one)], function (prefix) {
                    return styles[prefix + unCameled] !== UNDEFINED;
                })) && styles[prefix + unCameled];
            } else {
                if (this.length()) {
                    this.each(unmarkChange(intendedIteration(one, two, applyStyle)));
                }
                return this;
            }
        },
        getValueCurried = getValue(returnsFirst),
        setValueCurried = setValue(domIterates),
        classApi = makeValueTarget('class', 'className', propertyApi),
        manager_query = function (selector) {
            var target = this.element();
            return $(query(selector, target), target);
        },
        isAppendable = function (els) {
            return els.isValidDomManager || isElement(els) || isFragment(els);
        },
        iframeChangeHandler = function () {
            testIframe(this);
        },
        managerHorizontalTraverser = function (property, _idxChange_) {
            return function (_idxChange) {
                var parent, children, currentIndex, startIndex, target, idxChange = _idxChange || _idxChange_,
                    manager = this,
                    element = manager.element();
                if (property && element[property]) {
                    return element[property];
                }
                if (!element[PARENT_NODE]) {
                    return;
                }
                parent = element[PARENT_NODE];
                startIndex = indexOf(parent[CHILDREN], element);
                children = collectChildren(parent[CHILDREN]);
                target = children[(currentIndex = startIndex + idxChange)];
                while (target && target[NODE_TYPE] === 3) {
                    target = children[currentIndex += idxChange];
                }
                return target && manager.owner.returnsManager(target);
            };
        },
        DomManager = factories.Events.extend(DOM_MANAGER_STRING, extend(classApi, {
            constructor: function (el, hash, owner_) {
                var owner = owner_,
                    manager = this;
                manager[TARGET] = el;
                test(manager, owner);
                if (manager.isElement || manager.isFragment) {
                    hash[DOM_MANAGER_STRING] = manager;
                    owner = ensure(el.ownerDocument, BOOLEAN_TRUE);
                } else {
                    if (manager.isDocument) {
                        owner = manager;
                    } else {
                        hash[DOM_MANAGER_STRING] = manager;
                    }
                }
                manager.owner = owner || BOOLEAN_FALSE;
                if (manager.isIframe) {
                    manager.on('attributeChange:src detach attach', iframeChangeHandler);
                }
                if (manager.isWindow) {
                    markGlobal(manager);
                }
                manager.registerAs(manager.registeredAs);
                return manager;
            },
            sameOrigin: function () {
                var parsedReference, manager = this,
                    element = manager.element(),
                    windo = manager.owner.window(),
                    windoElement = windo.element();
                if (windo === manager) {
                    return BOOLEAN_TRUE;
                }
                if (manager.isAccessable) {
                    parsedReference = reference(element.location.href);
                    if (!parsedReference && manager.iframe) {
                        parsedReference = reference(manager.iframe.src());
                    }
                    return !parsedReference || parsedReference === reference(windoElement.location.href);
                }
                return BOOLEAN_FALSE;
                // return !!(windo === this || (this.isAccessable && (parsedReference = reference(element.location.href) || reference(windoElement.location.href)) && parsedReference === reference(windoElement.location.href)));
            },
            $: manager_query,
            query: manager_query,
            getValue: getValueCurried,
            setValue: setValueCurried,
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
            isValidDomManager: BOOLEAN_TRUE,
            appendChild: appendChild,
            append: appendChild,
            getAttribute: getValueCurried,
            setAttribute: setValueCurried,
            removeAttribute: attributeParody('remove'),
            attr: attrApi(domIterates),
            data: dataApi(domIterates),
            prop: propApi(domIterates),
            html: innardManipulator(INNER_HTML),
            text: innardManipulator(INNER_TEXT),
            style: styleManipulator,
            css: styleManipulator,
            next: managerHorizontalTraverser('nextElementSibling', 1),
            prev: managerHorizontalTraverser('previousElementSibling', -1),
            skip: managerHorizontalTraverser(NULL, 0),
            parent: (function () {
                var finder = function (manager, fn, original) {
                        var parentElement, rets, found, parentManager = manager,
                            next = original;
                        while (parentManager && parentManager.element() && !found) {
                            parentElement = parentManager.element();
                            rets = fn(parentManager, original, next);
                            parentManager = rets[0] && parentManager.owner.returnsManager(rets[0]);
                            found = rets[1];
                            next = rets[2];
                        }
                        return parentManager;
                    },
                    number = function (parent, original, next) {
                        var element = parent.element();
                        next -= 1;
                        if (next < 0 || !isFinite(next) || isNaN(next)) {
                            next = 0;
                        }
                        return [element[PARENT_NODE], !next, next];
                    },
                    string = function (parent_, original, next) {
                        var element = parent_.element();
                        var parent = element[PARENT_NODE];
                        return [parent, matches(parent, original)];
                    },
                    speshal = {
                        document: function (parent, original, next) {
                            if (parent.isDocument) {
                                return [parent, BOOLEAN_TRUE];
                            } else {
                                if (parent.isElement) {
                                    return [parent.element()[PARENT_NODE], BOOLEAN_FALSE];
                                } else {
                                    if (parent.isFragment) {
                                        return [NULL, BOOLEAN_TRUE];
                                    }
                                }
                            }
                        },
                        window: function (parent_, original, next) {
                            var element = parent_.element();
                            var parent = element[DEFAULT_VIEW] || element[PARENT_NODE];
                            return [parent, isWindow(parent)];
                        },
                        iframe: function (parent_, original, next) {
                            var found, element, parent = parent_;
                            if (parent.isWindow) {
                                if (parent.isTop) {
                                    return [NULL, BOOLEAN_TRUE];
                                } else {
                                    if (parent.iframe) {
                                        return [parent.iframe, BOOLEAN_TRUE];
                                    } else {
                                        found = wraptry(function () {
                                            var element = win.frameElement;
                                            if (element) {
                                                return BOOLEAN_TRUE;
                                            }
                                            return BOOLEAN_FALSE;
                                        }, function () {
                                            return BOOLEAN_FALSE;
                                        });
                                    }
                                }
                            } else {
                                element = parent.element();
                                element = element[DEFAULT_VIEW] || element[PARENT_NODE];
                            }
                            return [element, found];
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
                        return finder(manager, function (manager) {
                            var element = manager.element();
                            var parent = element[PARENT_NODE];
                            return [parent, !!original(parent)];
                        });
                    } else {
                        if (!iterator) {
                            iterator = number;
                            original = 1;
                        }
                        return finder(manager, iterator, original);
                    }
                };
            }()),
            setAddress: function (address) {
                var manager = this;
                address = manager.address = address || manager.address || uuid();
                return address;
            },
            emit: function (message, referrer_, handler) {
                var windo = this.window(),
                    element = windo.element();
                if (windo.isAccessable) {
                    handler({
                        data: message,
                        srcElement: element,
                        timeStamp: _.now()
                    });
                } else {
                    wraptry(function () {
                        if (!referrer_) {
                            throw new Error('missing referrer: ' + windo.address);
                        }
                        element.postMessage(message, referrer_);
                    }, console.error);
                }
            },
            insertAt: function (els, index) {
                var manager = this,
                    owner = manager.owner,
                    // normalize into a fragment
                    fragmentManager = isAppendable(els) ? owner.returnsManager(els) : DOMM(els).fragment(),
                    fragment = fragmentManager.element(),
                    children = index == NULL ? NULL : manager.children(),
                    child = children && children.index(index) || NULL,
                    element = child && child.element() || NULL,
                    managerElement = manager && manager.element(),
                    fragmentChildren = (fragmentManager.isElement && fragmentManager.customListeners ? [fragment] : []).concat(query(CUSTOM_ATTRIBUTE, fragment)),
                    detachNotify = dispatchDetached(fragmentChildren, owner),
                    returnValue = managerElement && managerElement.insertBefore(fragment, element),
                    notify = isAttached(managerElement, owner) && dispatchAttached(fragmentChildren, owner);
                return returnValue;
            },
            window: function () {
                var manager = this;
                if (manager.isWindow) {
                    // yay we're here!
                    return manager;
                }
                if (manager.isDocument) {
                    // it's a document, so return the manager relative to the inside
                    return manager.returnsManager(manager.element().defaultView);
                }
                if (manager.isIframe) {
                    // it's an iframe, so return the manager relative to the outside
                    return manager.owner.returnsManager(manager.element().contentWindow);
                }
                // it's an element so go up
                return manager.owner.window();
            },
            element: function () {
                return this[TARGET];
            },
            elements: function () {
                return [this[TARGET]];
            },
            length: function () {
                return 1;
            },
            registerAs: function () {
                var newName, oldName, manager = this,
                    registeredAs = manager.registeredAs;
                if (!manager.isCustom || registeredAs === manager._lastCustom) {
                    return manager;
                }
                oldName = manager.owner.registeredElementName(manager._lastCustom);
                manager.directiveDestruction(oldName);
                manager._lastCustom = registeredAs;
                newName = manager.owner.registeredElementName(registeredAs);
                manager.directive(newName);
                return manager;
            },
            wrap: function (list) {
                return this.owner.query(list || this);
            },
            children: function (eq, memo) {
                var filter, result, manager = this,
                    children = collectChildren(manager.element());
                if (eq === UNDEFINED) {
                    return memo ? (memo.push.apply(memo, map(children, manager.owner.returnsManager, manager.owner)) ? memo : memo) : manager.wrap(children);
                } else {
                    filter = createDomFilter(eq);
                    result = foldl(children, function (memo, child, idx, children) {
                        if (filter(child, idx, children)) {
                            memo.push(manager.owner.returnsManager(child));
                        }
                        return memo;
                    }, memo || []);
                }
                return memo ? result : manager.wrap(result);
            },
            hide: function () {
                return this.applyStyle('display', 'none');
            },
            show: function () {
                return this.applyStyle('display', 'block');
            },
            applyStyle: function (key, value) {
                applyStyle(key, value, this);
                return this;
            },
            getStyle: function (eq) {
                var returnValue = {},
                    manager = this,
                    first = manager.element();
                if (first && manager.isElement) {
                    returnValue = getComputed(first, manager.context);
                }
                return returnValue;
            },
            remove: function (fragment) {
                var el, parent, manager = this,
                    cachedRemoving = manager.isRemoving || BOOLEAN_FALSE;
                if (!cachedRemoving && (el = manager.element()) && (parent = el[PARENT_NODE])) {
                    manager.isRemoving = BOOLEAN_TRUE;
                    if (fragment) {
                        fragment.appendChild(el);
                    } else {
                        parent.removeChild(el);
                    }
                    dispatchDetached([el], manager.owner);
                    manager.isRemoving = cachedRemoving;
                }
                return manager;
            },
            // rework how to destroy elements
            destroy: function () {
                var customName, manager = this,
                    registeredAs = manager.registeredAs,
                    element = manager.element();
                if (manager.isIframe) {
                    manager.owner.data.remove(element.contentWindow);
                }
                manager.remove();
                if (registeredAs) {
                    customName = manager.owner.registeredElementName(registeredAs);
                    manager.directiveDestruction(customName);
                }
                // destroy events
                factories.Events[CONSTRUCTOR][PROTOTYPE].destroy.call(manager);
                // remove from global hash
                manager.owner.data.remove(element);
                return manager;
            },
            createEvent: function (original, type, opts) {
                return DomEvent(original, {
                    target: this.target,
                    origin: this,
                    capturing: toBoolean(type.split(COLON)[0]),
                    arg2: opts
                });
            },
            index: function () {
                return this;
            },
            each: function (fn, ctx) {
                var manager = this;
                var wrapped = [manager];
                var result = ctx ? fn.call(ctx, manager, 0, wrapped) : fn(manager, 0, wrapped);
                return wrapped;
            },
            find: function (fn) {
                var manager = this;
                return fn(manager, 0, [manager]) ? manager : UNDEFINED;
            },
            get: function (where) {
                var events = this,
                    attrs = events.directive(ATTRIBUTES),
                    found = attrs[where] = attrs[where] || StringManager();
                return found;
            },
            // revisit this
            queueHandler: function (evnt, handler, list) {
                var selectorsMatch, ctx, domManager = this,
                    originalTarget = evnt.currentTarget,
                    el = domManager.element(),
                    mainHandler = handler.mainHandler;
                domManager.stashed = originalTarget;
                if (mainHandler.currentEvent) {
                    // cancel this event because this stack has already been called
                    return exception({
                        message: 'queue prevented: this element is already being dispatched with the same event'
                    });
                }
                mainHandler.currentEvent = handler;
                if (!handler) {
                    return;
                }
                if (handler.selector) {
                    ctx = findMatch(el, evnt.target, handler.selector);
                    if (ctx) {
                        e.currentTarget = ctx;
                    } else {
                        mainHandler.currentEvent = NULL;
                        return;
                    }
                }
                return BOOLEAN_TRUE;
            },
            tag: function (str) {
                return tag(this.element(), str);
            },
            rect: function () {
                return clientRect(this.element());
            },
            box: function (context) {
                return box(this.element(), context);
            },
            flow: function (context) {
                return flow(this.element(), context);
            },
            dispatchEvent: cannotTrust(function (name, e, capturing_) {
                return eventDispatcher(this, name, e, capturing_);
            }),
            unQueueHandler: function (e, handler, list) {
                var domManager = this;
                e.currentTarget = domManager.stashed;
                domManager.stashed = NULL;
                handler.mainHandler.currentEvent = NULL;
            },
            toJSON: function () {
                var children, obj, manager = this,
                    node = manager.element();
                if (!canBeProcessed(node)) {
                    return node;
                }
                children = manager.children()[TO_JSON]();
                obj = {
                    tag: tag(node)
                };
                if (children[LENGTH]) {
                    obj.children = children;
                }
                if (node[INNER_TEXT]) {
                    obj[INNER_TEXT] = node[INNER_TEXT];
                }
                duff(node[ATTRIBUTES], function (attr) {
                    obj[camelCase(attr[LOCAL_NAME])] = attr.nodeValue;
                });
                return obj;
            }
        }, wrap({
            id: BOOLEAN_FALSE,
            src: BOOLEAN_FALSE,
            checked: BOOLEAN_FALSE,
            disabled: BOOLEAN_FALSE,
            classes: 'className'
        }, function (attr, api) {
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
        })), BOOLEAN_TRUE),
        addEventQueue = function (obj) {
            var mainHandler = obj.mainHandler,
                selector = obj.selector;
            if (!mainHandler.currentEvent) {
                if (selector) {
                    obj.list.splice(mainHandler[DELEGATE_COUNT]++, 0, obj);
                } else {
                    obj.list.push(obj);
                }
            } else {
                mainHandler[ADD_QUEUE].push(obj);
            }
        },
        removeEventQueue = function (obj, idx) {
            var gah, mainHandler = obj.mainHandler,
                list = obj.list,
                selector = obj.selector;
            if (!mainHandler.currentEvent) {
                if (!obj.isDestroyed) {
                    obj.isDestroyed = BOOLEAN_TRUE;
                    idx = idx === UNDEFINED ? list.indexOf(obj) : idx;
                    if (selector) {
                        mainHandler[DELEGATE_COUNT]--;
                    }
                    mainHandler.events.detach(obj);
                }
            } else {
                if (!obj.disabled) {
                    mainHandler[REMOVE_QUEUE].push(obj);
                }
            }
            obj.disabled = BOOLEAN_TRUE;
        },
        _removeEventListener = function (manager, name, namespace, selector, handler, capture_) {
            var capture = !!capture_,
                directive = manager.directive(EVENTS),
                removeFromList = function (list, name) {
                    return list && list.duffRight(function (obj) {
                        if ((!name || name === obj[NAME]) && (!handler || obj.handler === handler) && (!namespace || obj.namespace === namespace) && (!selector || obj.selector === selector)) {
                            removeEventQueue(obj);
                        }
                    });
                };
            return name ? removeFromList(directive[HANDLERS][capture + COLON + name], name) : each(directive[HANDLERS], removeFromList);
        },
        /**
         * @class DOMM
         * @augments Model
         * @augments Collection
         */
        IS_TRUSTED = 'isTrusted',
        fixHooks = {
            // Includes some event props shared by KeyEvent and MouseEvent
            props: gapSplit("data altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which"),
            fixedHooks: {},
            keyHooks: {
                props: gapSplit("char charCode key keyCode"),
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
                filter: function () {
                    this.watchingMotion = BOOLEAN_TRUE;
                }
            },
            mouseHooks: {
                props: gapSplit("button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement"),
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
            make: (function () {
                var cached = {};
                return function (evnt, originalEvent, data) {
                    var acc, acc_, doc, target, val, i, prop, copy, type = originalEvent.type,
                        // Create a writable copy of the event object and normalize some properties
                        fixHook = fixHooks.fixedHooks[type];
                    if (!fixHook) {
                        fixHooks.fixedHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : rforceEvent.test(type) ? this.forceHooks : motionMorph.test(type) ? this.motionHooks : {};
                        // rfocusMorph
                        // motionMorph
                    }
                    copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
                    i = copy[LENGTH];
                    while (i--) {
                        prop = copy[i];
                        val = originalEvent[prop];
                        if (val != NULL) {
                            evnt[prop] = val;
                        }
                    }
                    evnt.originalType = originalEvent.type;
                    // Support: Cordova 2.5 (WebKit) (#13255)
                    // All events should have a target; Cordova deviceready doesn't
                    // ie also does not have a target... so use current target
                    target = evnt.target || (evnt.view ? evnt.view.event.currentTarget : event && event.currentTarget) || evnt.delegateTarget;
                    if (!target) {
                        target = evnt.target = doc;
                    }
                    // Support: Safari 6.0+, Chrome<28
                    // Target should not be a text node (#504, #13143)
                    if (target[NODE_TYPE] === 3) {
                        evnt.target = target[PARENT_NODE];
                    }
                    if (isFunction(fixHook.filter)) {
                        fixHook.filter(evnt, originalEvent);
                    }
                    evnt.type = distilledEventName[originalEvent.type] || originalEvent.type;
                    evnt.set(originalEvent.data || data || EMPTY_STRING);
                    evnt.isImmediatePropagationStopped = evnt.isPropagationStopped = evnt.isDefaultPrevented = BOOLEAN_FALSE;
                    // special
                    if (evnt.type === 'fullscreenchange') {
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
                            evnt.isFullScreen = (doc.fullScreen || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.fullscreenElement) ? BOOLEAN_TRUE : BOOLEAN_FALSE;
                        }
                    }
                    evnt[IS_TRUSTED] = _.has(originalEvent, IS_TRUSTED) ? originalEvent[IS_TRUSTED] : !DO_NOT_TRUST;
                    if (this.watchingMotion) {
                        acc = original.acceleration;
                        if (!acc) {
                            acc_ = original.accelerationIncludingGravity;
                            acc = {
                                x: acc_.x - 9.81,
                                y: acc_.y - 9.81,
                                z: acc_.z - 9.81
                            };
                        }
                        if (acc) {
                            cached.x = acc.x;
                            cached.y = acc.y;
                            cached.z = acc.z;
                            cached.interval = original.interval;
                            cached.rotationRate = original.rotationRate;
                        }
                        if (cached.x != NULL) {
                            evnt.motionX = cached.x;
                            evnt.motionY = cached.y;
                            evnt.motionZ = cached.z;
                            evnt.interval = cached.interval;
                            evnt.rotationRate = cached.rotationRate;
                        }
                        if (original.alpha != NULL) {
                            cached.alpha = original.alpha;
                            cached.beta = original.beta;
                            cached.gamma = original.gamma;
                            cached.absolute = original.absolute;
                        }
                        if (cached.alpha != NULL) {
                            evnt.alpha = cached.alpha;
                            evnt.beta = cached.beta;
                            evnt.gamma = cached.gamma;
                            evnt.absolute = cached.absolute;
                        }
                    }
                    return evnt;
                };
            }())
        },
        DomEvent = factories.ObjectEvent.extend('DomEvent', {
            constructor: function (evnt, opts) {
                var e = this;
                if (DomEvent.isInstance(evnt)) {
                    return evnt;
                }
                e.origin = opts.origin;
                e.originalEvent = evnt;
                e.delegateTarget = opts.target;
                fixHooks.make(e, evnt, opts.arg2);
                e.capturing = opts.capturing === UNDEFINED ? isCapturing(e) : opts.capturing;
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
        eq = _.eq,
        objectMatches = _.matches,
        createDomFilter = function (filtr) {
            return isFunction(filtr) ? filtr : (isString(filtr) ? (filterExpressions[filtr] || function (item) {
                return matches(item, filtr);
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
        dataReconstructor = function (list, fn) {
            return foldl(list, function (memo, arg1, arg2, arg3) {
                if (fn(arg1, arg2, arg3)) {
                    memo.push(arg1);
                }
                return memo;
            }, []);
        },
        domFilter = function (items, filtr) {
            var filter = createDomFilter(filtr);
            return dataReconstructor(items, unwrapsOnLoop(filter));
        },
        dimensionFinder = function (element, doc, win) {
            return function (num) {
                var ret, manager = this[INDEX](num);
                if (manager.isElement) {
                    ret = clientRect(manager)[element];
                } else {
                    if (manager.isDocument && manager.element()[BODY]) {
                        ret = manager.element()[BODY][doc];
                    } else {
                        if (manager.isWindow) {
                            ret = manager.element()[win];
                        }
                    }
                }
                return ret || 0;
            };
        },
        dommFind = attachPrevious(function (str) {
            var passedString = isString(str),
                matchers = [],
                domm = this,
                push = function (el) {
                    matchers.push(domm.context.owner.returnsManager(el));
                };
            return duff(domm.unwrap(), function (manager) {
                if (passedString) {
                    duff(query(str, manager.element()), push);
                } else {
                    push(manager);
                }
            }) && matchers;
        }),
        canBeProcessed = function (item) {
            return isWindow(item) || isElement(item) || isDocument(item) || isFragment(item);
        },
        collectChildren = function (element) {
            return toArray(element.children || element.childNodes);
        },
        appendChildDOMM = function (els, clone) {
            return this.insertAt(els, NULL, clone);
        },
        prependChildDOMM = function (els, clone) {
            return this.insertAt(els, 0, clone);
        },
        returnsManager = function (element, owner) {
            return element && !isWindow(element) && element.isValidDomManager ? element : ensure(element, owner);
        },
        exportResult = _.exports({
            covers: covers,
            center: center,
            closer: closer,
            distance: distance,
            // query: query,
            escape: escape,
            unescape: unescape,
            // css: css,
            box: box,
            isElement: isElement,
            isWindow: isWindow,
            isDocument: isDocument,
            isFragment: isFragment,
            unitToNumber: unitToNumber,
            numberToUnit: numberToUnit
        }),
        setupDomContentLoaded = function (handler, documentManager) {
            var bound = bind(handler, documentManager);
            if (documentManager.isReady) {
                bound($, documentManager.DOMContentLoadedEvent);
            } else {
                documentManager.on('DOMContentLoaded', function (e) {
                    bound($, e);
                });
            }
            return documentManager;
        },
        applyToEach = function (method) {
            return function (one, two, three, four, five, six) {
                return this.each(function (manager) {
                    manager[method](one, two, three, four, five, six);
                });
            };
        },
        allEachMethods = gapSplit('destroy show hide style remove on off once addEventListener removeEventListener dispatchEvent').concat(allDirectMethods),
        firstMethods = gapSplit('tag element rect box flow'),
        applyToFirst = function (method) {
            var shouldBeContext = method !== 'tag';
            return function (one, two) {
                var element = this.index(one);
                return element && element[method](shouldBeContext ? this.context : two);
            };
        },
        readMethods = gapSplit('isWindow isElement isDocument isFragment'),
        applyToTarget = function (property) {
            return function (one) {
                var element = this.index(one);
                return element && element[property];
            };
        },
        DOMM = factories.Collection.extend('DOMM', extend(makeValueTarget(CLASS, CLASSNAME, propertyApi, BOOLEAN_TRUE), {
            /**
             * @func
             * @name DOMM#constructor
             * @param {String | Node | Function} str - string to query the dom with, or a function to run on document load, or an element to wrap in a DOMM instance
             * @returns {DOMM} instance
             */
            constructor: function (str, ctx, isValid, validContext, documentContext) {
                var isArrayResult, els = str,
                    dom = this,
                    context = dom.context = validContext ? ctx.index(0) : documentContext, // returnsManager(ctx || win[DOCUMENT], documentContext),
                    unwrapped = context.element();
                if (isFunction(str)) {
                    if (isDocument(unwrapped)) {
                        return setupDomContentLoaded(str, documentContext).wrap();
                    }
                } else {
                    if (!isValid) {
                        if (isString(str)) {
                            if (str[0] === '<') {
                                els = makeTree(str, documentContext);
                            } else {
                                els = map(query(str, unwrapped), documentContext.returnsManager, documentContext);
                            }
                        } else {
                            els = str;
                            if (DomManager.isInstance(els)) {
                                els = [els];
                            } else {
                                if (Collection.isInstance(els)) {
                                    els = els.unwrap();
                                }
                                if (canBeProcessed(els)) {
                                    els = [documentContext.returnsManager(els)];
                                } else {
                                    els = els && map(els, documentContext.returnsManager, documentContext);
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
            push: function (el) {
                this.unwrap().push(this.context.owner.returnsManager(el));
            },
            elements: function () {
                // to array of DOMManagers
                return map(this.unwrap(), function (manager) {
                    // to element
                    return manager.element();
                });
            },
            /**
             * @func
             * @name DOMM#isWin
             * @description asks if the first or specified index of the object is a window type object
             * @returns {Boolean}
             */
            /**
             * @func
             * @name DOMM#isDoc
             * @description asks if the first or specified index of the object is a document type object
             * @returns {Boolean}
             */
            fragment: function (els) {
                return this.context.returnsManager(fragment(els || this.unwrap(), this.context));
            },
            /**
             * @func
             * @name DOMM#filter
             * @param {String|Function|Object} filtr - filter variable that will filter by matching the object that is passed in, or by selector if it is a string, or simply with a custom function
             * @returns {DOMM} new DOMM instance object
             */
            filter: attachPrevious(function (filter) {
                return domFilter(this.unwrap(), filter);
            }),
            /**
             * @func
             * @name DOMM#find
             * @param {String} str - string to use query to find against
             * @returns {DOMM} matching elements
             */
            // find: dommFind,
            $: dommFind,
            /**
             * @func
             * @name DOMM#children
             * @param {Number} [eq] - index of the children to gather. If none is provided, then all children will be added
             * @returns {DOMM} all / matching children
             */
            children: attachPrevious(function (eq) {
                return foldl(this.unwrap(), function (memo, manager) {
                    return manager.children(eq, memo);
                }, []);
            }),
            /**
             * @func
             * @name DOMM#once
             * @param {String} space delimited list of event names to attach handlers to
             * @param {Function} fn - handler to put on the event loop
             * @returns {DOMM} instance
             */
            /**
             * @func
             * @name DOMM#css
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM} instance
             */
            css: styleManipulator,
            style: styleManipulator,
            /**
             * @func
             * @name DOMM#allDom
             * @returns {Boolean} value indicating whether or not there were any non dom elements found in the collection
             */
            allElements: function () {
                return !!(this[LENGTH]() && !find(this.unwrap(), function (manager) {
                    return !manager.isElement;
                }));
            },
            /**
             * @func
             * @name DOMM#height
             * @returns {Number} height of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            height: dimensionFinder(HEIGHT, 'scrollHeight', INNER_HEIGHT),
            /**
             * @func
             * @name DOMM#width
             * @returns {Number} width of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            width: dimensionFinder(WIDTH, 'scrollWidth', INNER_WIDTH),
            /**
             * @func
             * @name DOMM#data
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {Object|*} can return the value that is asked for by the initial function call
             */
            /**
             * @func
             * @name DOMM#attr
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM|*} if multiple attributes were requested then a plain hash is returned, otherwise the DOMM instance is returned
             */
            attr: attrApi(domIterates),
            data: dataApi(domIterates),
            prop: propApi(domIterates),
            /**
             * @func
             * @name DOMM#eq
             * @param {Number|Array} [num=0] - index or list of indexes to create a new DOMM element with.
             * @returns {DOMM} instance
             */
            eq: attachPrevious(function (num) {
                return eq(this.unwrap(), num);
            }),
            /**
             * @func
             * @name DOMM#box
             * @param {Number} [num=0] - index to get the boxmodel of
             */
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
             * @name DOMM#append
             */
            append: appendChildDOMM,
            appendChild: appendChildDOMM,
            prepend: prependChildDOMM,
            prependChild: prependChildDOMM,
            /**
             * @func
             * @name DOMM#next
             * @returns {DOMM} instance
             */
            next: horizontalTraverser('next', 1),
            /**
             * @func
             * @name DOMM#previous
             * @returns {DOMM} instance
             */
            prev: horizontalTraverser('prev', -1),
            /**
             * @func
             * @name DOMM#skip
             * @returns {DOMM} instance
             */
            skip: horizontalTraverser('skip', 0),
            /**
             * @func
             * @name DOMM#insertAt
             * @returns {DOMM} instance
             */
            insertAt: function (els_, index, clone) {
                var manager = this,
                    owner = manager.context,
                    els = isAppendable(els_) ? this.context.returnsManager(els_) : owner.query(els_).fragment();
                return this.each(function (manager) {
                    var elements = els;
                    if (clone) {
                        elements = elements.clone();
                    }
                    manager.insertAt(elements, index);
                });
            },
            /**
             * @func
             * @name DOMM#parent
             * @param {Number} [count=1] - number of elements to go up in the parent chain
             * @returns {DOMM} instance of collected, unique parents
             */
            parent: attachPrevious(function (original) {
                return this.foldl(function (memo, manager) {
                    var parent;
                    if ((parent = manager.parent(original))) {
                        _.add(memo, parent);
                    }
                    return memo;
                }, []);
            }),
            /**
             * @func
             * @name DOMM#has
             * @param {Node|Array} els - list of elements to check the current instance against
             * @returns {Boolean} whether or not the current domm element has all of the elements that were passed in
             */
            has: function (els) {
                var domm = this,
                    collection = Collection(els),
                    length = collection[LENGTH]();
                return !!length && collection.find(function (el) {
                    return domm.posit(el) ? BOOLEAN_FALSE : BOOLEAN_TRUE;
                });
            },
            /**
             * @func
             * @name DOMM#html
             * @returns {DOMM} instance
             */
            html: htmlTextManipulator(INNER_HTML),
            /**
             * @func
             * @name DOMM#text
             * @returns {DOMM} instance
             */
            text: htmlTextManipulator(INNER_TEXT),
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
                    bottom: box[BOTTOM] - pB - bB,
                    height: box[HEIGHT] - pT - bT - pB - bB,
                    right: box[RIGHT] - pR - bR,
                    width: box[WIDTH] - pL - bL - pR - bR,
                    left: box[LEFT] + pL - bL,
                    top: box[TOP] + pT - bT
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
                    height: box[HEIGHT] + mT + mB,
                    bottom: box[BOTTOM] + mB,
                    width: box[WIDTH] + mR + mL,
                    right: box[RIGHT] + mR,
                    left: box[LEFT] + mL,
                    top: box[TOP] + mT
                };
            },
            /**
             * @func
             * @name DOMM#childOf
             */
            childOf: function (oParent_) {
                var domm = this,
                    _oParent = DOMM(oParent_),
                    children = domm.unwrap(),
                    oParent = _oParent.unwrap();
                // has to use utility find because the DOMM find is just a scoped query ($)
                return !!children[LENGTH] && !!oParent[LENGTH] && !find(oParent, function (_parent) {
                    return find(children, function (child) {
                        var parent = child,
                            finding = BOOLEAN_TRUE;
                        while (parent && finding) {
                            if (_parent === parent) {
                                finding = BOOLEAN_FALSE;
                            }
                            parent = parent[PARENT_NODE];
                        }
                        return finding;
                    });
                });
            },
            map: function (handler, context) {
                return Collection(map(this.unwrap(), handler, context));
            },
            toJSON: function () {
                return this.mapCall(TO_JSON);
            },
            toString: function () {
                return JSON.stringify(this);
            }
        }, wrap(allEachMethods, applyToEach), wrap(firstMethods, applyToFirst), wrap(readMethods, applyToTarget)), BOOLEAN_TRUE),
        setupWindow = function (windo) {
            windo.DOMM = DOMM_SETUP(windo[DOCUMENT]);
            windo.$ = has(windo, '$') ? windo.$ : windo.DOMM;
            return windo.DOMM;
        },
        $ = setupWindow(win);
    app.undefine(setupWindow);
    // collect all templates with an id
    $.collectTemplates();
    // register all custom elements...
    // everything that's created after this should go through the DomManager to be marked appropriately
    duff($.query(CUSTOM_ATTRIBUTE), returnsManager);
    // add $ to module madness
    // app.addModuleArguments([$]);
    // define a hash for attribute caching
    app.defineDirective('attributes', function () {
        return {};
    });
    app.defineDirective('customElement', function (instance) {
        //
    });
});
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        x = 0,
        lastTime = 0,
        pI = _.pI,
        posit = _.posit,
        nowish = _.now,
        gapSplit = _.gapSplit,
        vendors = gapSplit('ms moz webkit o'),
        REQUEST_ANIMATION_FRAME = 'requestAnimationFrame',
        CANCEL_ANIMATION_FRAME = 'cancelAnimationFrame',
        allLoopers = [],
        runningLoopers = [],
        eachCall = _.eachCall,
        time = _.time,
        remove = _.remove,
        running = BOOLEAN_FALSE,
        setup = function () {
            running = BOOLEAN_TRUE;
            win[REQUEST_ANIMATION_FRAME](function (time) {
                eachCall(runningLoopers, 'run', _.now());
                teardown();
            });
        },
        teardown = function () {
            duffRight(runningLoopers, function (looper, idx) {
                if (looper.halted() || looper.stopped() || looper.destroyed() || !looper.length()) {
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
            if (!posit(runningLoopers, looper)) {
                runningLoopers.push(looper);
            }
            if (!running) {
                setup();
            }
        },
        shim = (function () {
            for (; x < vendors[LENGTH] && !win[REQUEST_ANIMATION_FRAME]; ++x) {
                win[REQUEST_ANIMATION_FRAME] = win[vendors[x] + 'RequestAnimationFrame'];
                win[CANCEL_ANIMATION_FRAME] = win[vendors[x] + _.upCase(CANCEL_ANIMATION_FRAME)] || win[vendors[x] + 'CancelRequestAnimationFrame'];
            }
            if (!win[REQUEST_ANIMATION_FRAME]) {
                win[REQUEST_ANIMATION_FRAME] = function (callback) {
                    var currTime = new Date().getTime(),
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
                    win.clearTimeout(id);
                };
            }
        }()),
        Looper = factories.Directive.extend('Looper', {
            constructor: function (_runner) {
                var fns, stopped = BOOLEAN_TRUE,
                    halted = BOOLEAN_FALSE,
                    destroyed = BOOLEAN_FALSE,
                    running = BOOLEAN_FALSE,
                    looper = this,
                    counter = 0,
                    fnList = [],
                    addList = [],
                    removeList = [],
                    combineAdd = function () {
                        if (addList[LENGTH]) {
                            fnList = fnList.concat(addList);
                            addList = [];
                        }
                    };
                // keeps things private
                extend(looper, {
                    length: function () {
                        return fnList[LENGTH];
                    },
                    destroy: function () {
                        destroyed = BOOLEAN_TRUE;
                        // remove(allLoopers, this);
                        return this.halt();
                    },
                    destroyed: function () {
                        return destroyed;
                    },
                    running: function () {
                        // actual object that is currently being run
                        return !!running;
                    },
                    started: function () {
                        return !stopped;
                    },
                    run: function (_nowish) {
                        var tween = this,
                            removeLater = [];
                        if (halted || stopped) {
                            return;
                        }
                        combineAdd();
                        duff(fnList, function (fnObj) {
                            if (indexOf(removeList, fnObj) !== -1) {
                                removeLater.push(fnObj);
                            } else {
                                if (fnObj.disabled || halted) {
                                    return;
                                }
                                running = fnObj;
                                wraptry(function () {
                                    fnObj.fn(_nowish);
                                });
                            }
                        });
                        running = BOOLEAN_FALSE;
                        combineAdd();
                        duff(removeList.concat(removeLater), function (item) {
                            remove(fnList, item);
                        });
                        removeList = [];
                    },
                    remove: function (id) {
                        var fnObj, i = 0,
                            ret = BOOLEAN_FALSE;
                        if (!arguments[LENGTH]) {
                            if (running) {
                                removeList.push(running);
                                return BOOLEAN_TRUE;
                            }
                        }
                        if (isNumber(id)) {
                            for (; i < fnList[LENGTH] && !ret; i++) {
                                fnObj = fnList[i];
                                if (fnObj.id === id) {
                                    if (!posit(removeList, fnObj)) {
                                        removeList.push(fnObj);
                                        ret = BOOLEAN_TRUE;
                                    }
                                }
                            }
                        }
                        return !!ret;
                    },
                    stop: function () {
                        stopped = BOOLEAN_TRUE;
                        return this;
                    },
                    start: function () {
                        var looper = this;
                        stopped = BOOLEAN_FALSE;
                        halted = BOOLEAN_FALSE;
                        return looper;
                    },
                    halt: function () {
                        halted = BOOLEAN_TRUE;
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
                        if (!isFunction(fn)) {
                            return;
                        }
                        if (!fnList[LENGTH]) {
                            tween.start();
                        }
                        start(tween);
                        obj = {
                            fn: tween.bind(fn),
                            id: id,
                            disabled: BOOLEAN_FALSE,
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
                });
                add(looper);
                return looper;
            },
            bind: function (fn) {
                return bind(fn, this);
            },
            once: function (fn) {
                return this.count(1, fn);
            },
            count: function (timey, fn_) {
                var fn, count = 0,
                    times = pI(timey) || 1;
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
                return this.add(function (ms) {
                    var last = 1;
                    count++;
                    if (count >= times) {
                        this.remove();
                        last = 0;
                    }
                    fn(ms, !last, count);
                });
            },
            tween: function (time__, fn_) {
                var fn, added = nowish(),
                    time_ = _.time(time__);
                if (!time_) {
                    time_ = 0;
                }
                if (!isFunction(fn_)) {
                    return;
                }
                fn = this.bind(fn_);
                return this.interval(0, function (ms) {
                    var tween = 1,
                        diff = ms - added;
                    if (diff >= time_) {
                        tween = 0;
                        this.remove();
                    }
                    fn(ms, Math.min(1, (diff / time_)), !tween);
                });
            },
            time: function (time_, fn_) {
                var fn;
                if (!isFunction(fn_)) {
                    return this;
                }
                fn = this.bind(fn_);
                return this.interval(time(time_), function (ms) {
                    this.remove();
                    fn(ms);
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
                fn = this.bind(fn_);
                return tween.add(function (ms) {
                    var frameRate = 1000 / (ms - lastDate);
                    if (frameRate > 40) {
                        expectedFrameRate = 60 * minimum;
                    }
                    if (frameRate < expectedFrameRate) {
                        lastSkip = ms;
                    }
                    if (ms - lastSkip > time_) {
                        this.remove();
                        fn(ms);
                    }
                    lastDate = ms;
                });
            },
            interval: function (time, fn_) {
                var fn, last = nowish();
                if (!isFunction(fn_)) {
                    return;
                }
                if (!time) {
                    time = 0;
                }
                fn = this.bind(fn_);
                return this.add(function (ms) {
                    if (ms - time >= last) {
                        last = ms;
                        fn(ms);
                    }
                });
            }
        }, BOOLEAN_TRUE);
    _.exports({
        AF: Looper()
    });
});
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        parse = _.parse,
        stringify = _.stringify,
        ENCODED_BRACKET = '%7B',
        IS_LATE = 'isLate',
        DOCUMENT_READY = 'documentReady',
        IS_WINDOW = 'isWindow',
        DEFERRED = 'deferred',
        IS_DEFERRED = 'is' + upCase(DEFERRED),
        GROUP = 'group',
        POST_TO = 'postTo',
        COMMAND = 'command',
        RUN_COUNT = 'runCount',
        FLUSHING = 'flushing',
        CONNECT = 'connect',
        CONNECTED = CONNECT + 'ed',
        COMPONENT = 'component',
        INITIALIZE = 'initialize',
        RESPONSE = 'response',
        MESSAGE = 'message',
        RESPONSE_OPTIONS = RESPONSE + 'Options',
        CAPITAL_RESPONSE = upCase(RESPONSE),
        LATEST_RESPONSE = 'latest' + CAPITAL_RESPONSE,
        LAST_RESPONSE = 'last' + CAPITAL_RESPONSE,
        RESPONDED = 'responded',
        RESPONDED_WITH = RESPONDED + 'With',
        RECEIVED = 'received',
        BEFORE_RESPONDED = BEFORE_COLON + RESPONDED,
        BEFORE_RECEIVED = BEFORE_COLON + RECEIVED,
        QUEUED_MESSAGE_INDEX = 'queuedMessageIndex',
        RECEIVED_REFERRER = 'receiveReferrer',
        EMIT_REFERRER = 'emitReferrer',
        BUSTER = 'buster',
        PACKET = 'packet',
        VERSION = 'version',
        busterGroupHash = {},
        receive = function (evt) {
            var buster, data = parse(evt.data),
                postTo = data.postTo;
            if (!data) {
                return;
            }
            if (app[VERSION] !== data[VERSION] || app.isDestroyed) {
                return;
            }
            if (!postTo) {
                return;
            }
            buster = (busterGroupHash[data.group] || {})[data.postTo];
            if (!buster) {
                return;
            }
            var originalMessage, runCount = data.runCount,
                children = buster.children;
            if (runCount) {
                originalMessage = children.get(ID, data.messageId);
                if (!originalMessage) {
                    return buster;
                }
                // found the message that i originally sent you
                // allow the buster to set some things up
                buster.response(originalMessage, data);
            } else {
                buster.receive(data);
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
            var referrer, message = stringify(base);
            return buster.emitWindow.emit(message, buster.get(EMIT_REFERRER), receive);
        },
        defaultGroupId = uuid(),
        RESPOND_HANDLERS = 'respondHandlers',
        Message = factories.Model.extend(upCase(MESSAGE), {
            idAttribute: MESSAGE + 'Id',
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
                    message = parse(stringify(message.get(PACKET)));
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
            message: receive
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
            buster.set(CONNECTED, BOOLEAN_FALSE);
            buster.connectPromise = _.Promise();
        },
        connected = function (buster, message) {
            buster.connectPromise.resolve(message);
            buster.set(CONNECTED, BOOLEAN_TRUE);
        },
        connectReceived = function (e) {
            // first submit a response so the other side can flush
            var buster = this,
                dataDirective = buster.directive(DATA);
            if (dataDirective.get(IS_LATE)) {
                dataDirective.set(QUEUED_MESSAGE_INDEX, 1);
            }
            buster.respond((e.message || e.origin).id);
            buster.set(CONNECTED, BOOLEAN_TRUE);
        },
        Buster = factories.Buster = factories.Model.extend(upCase(BUSTER), {
            Child: Message,
            bounce: function (e) {
                return this.respond(e.message.id);
            },
            connected: function (handler) {
                this.connectPromise.success(handler);
                return this;
            },
            response: function (original, data) {
                var originalData = original[DATA];
                if (!originalData) {
                    return;
                }
                originalData.set(LATEST_RESPONSE, data);
                if (originalData.get('isResolved')) {
                    original[DISPATCH_EVENT](DEFERRED, data.packet);
                } else {
                    originalData.set(RESPONDED_WITH, data);
                    originalData.set('isResolved', BOOLEAN_TRUE);
                    original[DISPATCH_EVENT](RESPONSE, data.packet);
                }
            },
            receive: function (data) {
                var message, buster = this,
                    receiveHistory = buster.receiveHistory;
                data.originMessageId = data.messageId;
                data.messageId = receiveHistory.length();
                data.isDeferred = BOOLEAN_FALSE;
                message = new Message(data);
                receiveHistory.push(message);
                receiveHistory.register(ID, data.messageId, message);
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
            defaults: function () {
                return {
                    documentReady: BOOLEAN_TRUE,
                    version: app[VERSION],
                    group: defaultGroupId,
                    connected: BOOLEAN_FALSE,
                    friendly: BOOLEAN_FALSE
                };
            },
            defineWindows: function (receiveWindow, emitWindow) {
                var buster = this,
                    busterData = buster.directive(DATA);
                if (receiveWindow && receiveWindow[IS_WINDOW]) {
                    if (buster.receiveWindow) {
                        buster.receiveWindow.off(receiveWindowEvents);
                    }
                    buster.receiveWindow = receiveWindow.on(receiveWindowEvents);
                    // buster.receiveWindow.owner.$(function () {
                    buster.set(DOCUMENT_READY, BOOLEAN_TRUE);
                    // });
                }
                if (emitWindow && emitWindow[IS_WINDOW]) {
                    buster.emitWindow = emitWindow;
                    busterData.set(POST_TO, busterData.get(POST_TO) || buster.emitWindow.address);
                }
            },
            defineIframe: function (iframe) {
                var busterData, emitReferrer, receiveReferrer, iframeSrc, referrer, receiveWindow, data, href, windo, buster = this;
                if (!iframe || !iframe.isIframe) {
                    return;
                }
                buster.iframe = iframe;
                if (iframe.isAttached && (windo = iframe.window())) {
                    buster.defineWindows(NULL, windo);
                }
                if (iframe) {
                    buster.setupIframe();
                }
            },
            setupIframe: function () {
                var emitReferrer, buster = this,
                    iframe = buster.iframe,
                    busterData = buster.directive(DATA),
                    hrefSplit = buster.receiveWindow.element().location.href.split(ENCODED_BRACKET),
                    hrefShift = hrefSplit.shift(),
                    unshifted = hrefSplit.unshift(EMPTY_STRING),
                    href = hrefSplit.join(ENCODED_BRACKET),
                    receiveReferrer = parseUrl(busterData.get(RECEIVED_REFERRER) || href).origin,
                    iframeSrc = busterData.get('iframeSrc'),
                    iframeContent = busterData.get('iframeContent'),
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
                    data.receiveReferrer = emitReferrer;
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
                if (!receiveWindow || !receiveWindow[IS_WINDOW]) {
                    return;
                }
                hashString = receiveWindow.element().location.hash.slice(1);
                hashSplit = hashString.split(ENCODED_BRACKET);
                hashShift = hashSplit.shift();
                hashSplit.unshift(EMPTY_STRING);
                hashString = hashSplit.join(ENCODED_BRACKET);
                buster.set(parse(decodeURI(hashString || wraptry(function () {
                    return receiveWindow.parent('iframe').data(BUSTER);
                }))));
            },
            constructor: function (listen, talk, settings_, events) {
                var buster = this;
                var settings = settings_ || {};
                // normalize to manager
                var receiveWindow = $(listen).index(0);
                var manager = $(talk).index(0);
                settings.id = settings.id === UNDEFINED ? uuid() : settings.id;
                buster.receiveHistory = factories.Collection();
                disconnected.call(buster);
                factories.Model[CONSTRUCTOR].call(buster, settings);
                buster.once('change:connected', function (e) {
                    buster.connectPromise.resolve(buster.children.first());
                });
                buster.on({
                    'change:connected change:documentReady': 'flush',
                    'received:update': 'bounce',
                    'received:unload': 'destroy',
                    destroy: disconnected,
                    'received:initialize received:connect': connectReceived,
                    'change:group change:id': 'setGroup'
                });
                buster.on(events);
                buster.setGroup();
                if (receiveWindow && receiveWindow[IS_WINDOW]) {
                    buster.defineWindows(receiveWindow);
                }
                if (manager[IS_WINDOW]) {
                    buster.defineWindows(NULL, manager);
                    // window tests... because messages are going up
                } else {
                    buster.defineIframe(manager);
                    // iframe tests... because messages are going down
                }
                if (buster.get('strip')) {
                    buster.stripData();
                }
                buster.set(QUEUED_MESSAGE_INDEX, 0);
                if (buster.iframe) {
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
                var command, children, n, item, gah, childrenLen, queuedMsg, nuData, i = 0,
                    buster = this,
                    dataManager = buster.directive(DATA),
                    currentIdx = dataManager.get(QUEUED_MESSAGE_INDEX),
                    connected = dataManager.get(CONNECTED),
                    initedFrom = dataManager.get('initedFromPartner'),
                    flushing = dataManager.get(FLUSHING);
                if (!dataManager.get(DOCUMENT_READY)) {
                    return buster;
                }
                if (!initedFrom || connected && ((connected || !currentIdx) && !flushing)) {
                    dataManager.set(FLUSHING, BOOLEAN_TRUE);
                    children = buster.directive(CHILDREN);
                    childrenLen = children[LENGTH]();
                    queuedMsg = children.index(currentIdx);
                    while (queuedMsg && currentIdx < childrenLen) {
                        queuedMsg.directive(DATA).set(RUN_COUNT, 0);
                        if (currentIdx || connected) {
                            queuedMsg = children.index(currentIdx);
                            currentIdx = (dataManager.get(QUEUED_MESSAGE_INDEX) + 1) || 0;
                            dataManager.set(QUEUED_MESSAGE_INDEX, currentIdx);
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
                    if (buster.get(CONNECTED)) {
                        if (children[LENGTH]() > buster.get(QUEUED_MESSAGE_INDEX)) {
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
                    }, buster.defaultMessage(), extra));
                return message[0];
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
            defaultMessage: function () {
                var buster = this;
                return {
                    from: buster.get(ID),
                    postTo: buster.get(POST_TO),
                    group: buster.get(GROUP),
                    version: app[VERSION],
                    messageId: buster.directive(CHILDREN)[LENGTH](),
                    timeStamp: _.now()
                };
            },
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
                newMessage = extend(buster.defaultMessage(), {
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
                return children.index(0) || buster.create(command).response(function (e) {
                    connectReceived.call(buster, e);
                }).send();
            }
        }, BOOLEAN_TRUE);
    if (app.topAccess()) {
        $(win[TOP]).on(MESSAGE, receive);
    }
});
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        basicViewTrigger = function (name, e) {
            return this[DISPATCH_EVENT](name, e);
        },
        makeDelegateEventKeys = function (cid, bindings, key, namespace_) {
            var viewNamespace = 'delegateEvents' + cid,
                namespace = namespace_;
            if (namespace) {
                namespace = PERIOD + namespace;
            } else {
                namespace = EMPTY_STRING;
            }
            return foldl(gapSplit(key), function (memo, _key) {
                var __key = _key.split(PERIOD);
                if (__key[0][0] === '@') {
                    memo[SELECTOR] = normalizeUIString(_key, bindings);
                } else {
                    if (__key[1] !== viewNamespace) {
                        __key.splice(1, 0, viewNamespace);
                        _key = __key.join(PERIOD);
                    }
                    memo.events.push(_key + namespace);
                }
                return memo;
            }, {
                events: [],
                selector: ''
            });
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
                var normalizedKey = normalizeUIString(key, ui);
                memo[normalizedKey] = val;
                return memo;
            }, {});
        },
        Element = factories.Directive.extend('Element', {
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
                if (isInstance(selector, factories.DOMM)) {
                    return;
                }
                if (isString(selector)) {
                    // sets external element
                    el = selector;
                } else {
                    // defauts back to wrapping the element
                    // creates internal element
                    el = element.create(result(view, 'tagName'));
                    // subclassed to expand the attributes that can be used
                }
                element.set(el, BOOLEAN_FALSE);
            },
            create: function (tag) {
                return $.createElement(tag);
            },
            unset: function () {
                var element = this;
                // element.undelegateEvents();
                // element.undelegateTriggers();
                delete element.view.el;
                delete element.el;
            },
            set: function (el, render) {
                var directive = this;
                directive.view.el = directive.el = el;
                // directive.degenerateUIBindings();
                // if (render !== BOOLEAN_FALSE) {
                //     directive.render(render);
                //     directive.generateUIBindings();
                //     directive.bindUI();
                //     if (newelementisDifferent) {
                //         directive.delegateEvents();
                //         directive.delegateTriggers();
                //     }
                // }
            },
            render: function (html) {
                var element = this;
                element.el.html(html || '');
                return element;
            },
            degenerateUIBindings: function () {
                var directive = this;
                if (!directive.ui) {
                    return;
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
                each(elementBindings, function (method, key) {
                    var object = makeDelegateEventKeys(view.cid, directive.uiBindings, key),
                        bound = object.fn = bind(view[method] || method, view);
                    __events.push(object);
                    el.on(object.events.join(SPACE), object[SELECTOR], bound);
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
                    el.off(binding.events.join(SPACE), binding[SELECTOR], binding.fn);
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
                        bound = object.fn = basicViewTrigger.bind(view, method);
                    el.on(object.events.join(SPACE), object[SELECTOR], bound);
                });
                directive.cachedElementTriggers = __events;
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
            setAttributes: function () {
                var directive = this,
                    view = directive.view,
                    attrs = result(view, 'elementAttributes');
                if (view[CLASSNAME]) {
                    attrs = attrs || {};
                    attrs[CLASS] = result(view, CLASSNAME);
                }
                if (attrs) {
                    directive.el.attr(attrs);
                }
                return directive;
            },
            bindUI: function () {
                var directive = this,
                    uiBindings = directive.uiBindings;
                directive.ui = directive.view.ui = map(uiBindings, directive.el.$, directive.el);
                return directive;
            }
        });
    app.defineDirective(ELEMENT, Element[CONSTRUCTOR], function (directive, instance) {
        directive.el.destroy();
        directive.unset();
        var ui = directive.ui;
        directive.degenerateUIBindings();
        _.eachCall(ui, 'destroy');
    });
});
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Collection = factories.Collection,
        protoProp = _.protoProp,
        isFragment = _.isFragment,
        isInstance = _.isInstance,
        isFunction = _.isFunction,
        isArrayLike = _.isArrayLike,
        reverseParams = _.reverseParams,
        intendedObject = _.intendedObject,
        createDocumentFragment = _.createDocumentFragment,
        RENDER = 'render',
        RENDERED = RENDER + 'ed',
        OPTIONS = 'options',
        PARENT_NODE = 'parentNode',
        CONSTRUCTOR = 'constructor',
        BUFFERED_VIEWS = 'bufferedViews',
        REGION_MANAGER = 'regionManager',
        ESTABLISHED_REGIONS = '_establishedRegions',
        APPEND_CHILD_ELEMENTS = '_appendChildElements',
        getRegion = function (key) {
            return this.directive(REGION_MANAGER).list.get(ID, key);
        },
        addRegion = function (key, selector) {
            var regionManagerDirective = this.directive(REGION_MANAGER);
            intendedObject(key, selector, function (key, selector) {
                var region = regionManagerDirective.list.get(key);
                if (!region) {
                    regionManagerDirective.establish(key, selector);
                }
            });
        },
        /**
         * @class View
         * @augments Model
         * @augments Model
         * @classDesc Objects that have one or more element associated with them, such as a template that needs constant updating from the data
         */
        // region views are useful if you're constructing different components
        // from a separate place and just want it to be in the attach pipeline
        // very useful for componentizing your ui
        // LeafView = factories.
        // regionConstructor = ,
        Model = factories.Model,
        Region = factories.Model.extend('Region', {
            constructor: function (secondary) {
                var model = this;
                factories.Model[CONSTRUCTOR].call(model, {}, secondary);
                model.directive(CHILDREN);
                model.setElement();
                return model;
            },
            add: function (models_, options_) {
                var bufferedViewsDirective, region = this,
                    options = options_ || {},
                    unwrapped = Collection(models_).each(function (view_) {
                        var view = isInstance(view_, View) ? view_ : (options.Child || region.Child || factories.View)({
                                model: isInstance(view_, Model) ? view_ : view_ = Model(view_)
                            }),
                            nul = bufferedViewsDirective || ((bufferedViewsDirective = region.directive(BUFFERED_VIEWS)) && bufferedViewsDirective.ensure());
                        region.adopt(view);
                        bufferedViewsDirective.views.push(view);
                    }).unwrap();
                if (region.el) {
                    region.render();
                }
                return unwrapped;
            },
            adopt: function (view) {
                var region = this,
                    children = region[CHILDREN];
                if (view[PARENT]) {
                    if (view[PARENT] === region) {
                        return;
                    } else {
                        view[PARENT].disown(view);
                    }
                }
                view[PARENT] = region;
                children.add(view);
            },
            disown: function (view) {
                var region = this,
                    children = region[CHILDREN];
                view[PARENT] = NULL;
                children.remove(view);
            },
            attach: function (view) {
                var parentNode, bufferDirective, el = view.el && view.el.element();
                if (!el) {
                    return;
                }
                parentNode = el.parentNode;
                bufferDirective = this.directive(BUFFERED_VIEWS);
                if (parentNode && parentNode === bufferDirective.region.el.element()) {
                    return;
                }
                bufferDirective.els.appendChild(el);
            },
            // this needs to be modified for shared windows
            setElement: function () {
                var manager, region = this,
                    selector = region[SELECTOR],
                    parent = region[PARENT][PARENT];
                if (parent !== app) {
                    if (parent.is(RENDERED)) {
                        manager = parent.el.$(selector)[INDEX](0);
                    }
                } else {
                    manager = (region._owner$ || $)(selector)[INDEX](0);
                }
                if (!manager) {
                    return;
                }
                region.directive(ELEMENT).set(manager);
            },
            render: function () {
                var region = this,
                    bufferDirective = region.directive(BUFFERED_VIEWS),
                    elementDirective = region.directive(ELEMENT);
                region.unmark(RENDERED);
                // doc frags on regionviews, list of children to trigger events on
                bufferDirective.ensure();
                // request extra data or something before rendering: dom is still completely intact
                region[DISPATCH_EVENT]('before:' + RENDER);
                // unbinds and rebinds element only if it changes
                region.setElement();
                // update new element's attributes
                elementDirective.setAttributes();
                // puts children back inside parent
                region[CHILDREN].eachCall(RENDER);
                // attach region element
                // appends child elements
                elementDirective.el.append(bufferDirective.els);
                // pass the buffered views up
                // region.passBuffered(list);
                // mark the view as rendered
                region.mark(RENDERED);
                // reset buffered objects
                bufferDirective.reset();
                // dispatch the render event
                region[DISPATCH_EVENT](RENDER);
                return region;
            }
        }, BOOLEAN_TRUE),
        // view needs to be pitted against a document
        View = Region.extend('View', {
            tagName: 'div',
            filter: BOOLEAN_TRUE,
            templateIsElement: BOOLEAN_FALSE,
            getRegion: getRegion,
            template: function () {
                return EMPTY_STRING;
            },
            parentView: function () {
                var found, view = this,
                    parent = view[PARENT];
                while (found && parent && !isInstance(parent, View)) {
                    parent = parent[PARENT];
                    if (isInstance(parent, View)) {
                        found = parent;
                    }
                }
                return found;
            },
            constructor: function (secondary) {
                var model = this;
                factories.Model[CONSTRUCTOR].call(model, secondary);
                model.directive(ELEMENT).ensure();
                this.id = uniqueId(BOOLEAN_FALSE, BOOLEAN_TRUE);
                this.establishRegions();
                return model;
            },
            establishRegions: function () {
                var regions = result(this, 'regions');
                var regionsResult = keys(regions)[LENGTH] && this.directive(REGION_MANAGER).establish(regionsResult);
                return this;
            },
            valueOf: function () {
                return this.id;
            },
            destroy: function () {
                var view = this;
                if (view.is('destroying')) {
                    return view;
                }
                view.mark('destroying');
                if (view[REGION_MANAGER]) {
                    view[REGION_MANAGER].list.eachCall('destroy');
                }
                view.el.destroy();
                view.directiveDestruction(ELEMENT);
                Model[CONSTRUCTOR][PROTOTYPE].destroy.call(view);
                return view;
            },
            render: function () {
                var newelementisDifferent, element, json, html, renderResult, bufferedDirective, template, settingElement, view = this,
                    // you might be able to do this a better way
                    neverRendered = !view.is(RENDERED);
                view.unmark(RENDERED);
                if (!result(view, 'filter')) {
                    return view;
                }
                element = view.directive(ELEMENT);
                // prep the object with extra members (doc frags on regionviews,
                // list of children to trigger events on)
                // request extra data or something before rendering: dom is still completely intact
                view[DISPATCH_EVENT]('before:' + RENDER);
                // renders the html
                if (isFunction(view.template)) {
                    json = view.model && view.model.toJSON();
                    // try to generate template
                    html = view.template(json);
                } else {
                    html = view.template;
                }
                settingElement = view.el;
                if (result(view, 'templateIsElement')) {
                    settingElement = view.el.owner.fragment(html).children();
                    html = BOOLEAN_FALSE;
                }
                newelementisDifferent = settingElement !== element.el;
                if (newelementisDifferent) {
                    element.unset();
                }
                // turns ui into a string
                element.degenerateUIBindings();
                // unbinds and rebinds element only if it changes
                element.set(settingElement);
                if (html !== BOOLEAN_FALSE) {
                    element.render(html);
                }
                element.generateUIBindings();
                element.bindUI();
                if (newelementisDifferent || neverRendered) {
                    element.delegateEvents();
                    element.delegateTriggers();
                }
                // update new element's attributes
                element.setAttributes();
                // mark the view as rendered
                view.establishRegions();
                view.mark(RENDERED);
                // dispatch the render event
                view[DISPATCH_EVENT](RENDER);
                // pass buffered views up to region
                if (view[REGION_MANAGER]) {
                    view[REGION_MANAGER].list.eachCall(RENDER);
                }
                element = view[PARENT] && view[PARENT].attach(view);
                return view;
            }
        }, BOOLEAN_TRUE),
        _View = factories.View;
    var establishRegion = function (key, selector) {
            var regionManagerDirective = this,
                parentView = regionManagerDirective[PARENT];
            if (!key) {
                return regionManagerDirective;
            }
            intendedObject(key, selector, function (key, selector) {
                var $selected, region = regionManagerDirective.list.get(key);
                if (!region) {
                    region = regionManagerDirective.create(key, selector);
                }
                if (parentView !== app) {
                    $selected = parentView.$(region[SELECTOR])[INDEX](0);
                } else {
                    $selected = $(region[SELECTOR])[INDEX](0);
                }
                if ($selected) {
                    region.el = $selected;
                }
            });
            return regionManagerDirective;
        },
        removeRegion = function (region_) {
            // var regionManager = this;
            // var region = isString(region_) ? regionManager.get(region_) : region_;
            // regionManager.remove(region);
            // regionManager.unRegister(region.id, region);
        },
        createRegion = function (where, region_) {
            var key, regionManagerDirective = this,
                parent = regionManagerDirective[PARENT],
                // assume that it is a region
                selector = region_,
                region = region_;
            if (isInstance(region, Region)) {
                return region;
            }
            region = Region(extend({
                selector: selector || EMPTY_STRING
            }, isObject(region) ? region : {}, {
                id: where,
                parent: regionManagerDirective,
                isAttached: parent === app ? BOOLEAN_TRUE : parent.isAttached
            }));
            regionManagerDirective.list.push(region);
            regionManagerDirective.list.register(ID, where, region);
            return region;
        },
        bufferedEnsure = function () {
            var buffers = this,
                _bufferedViews = isArray(buffers.views) ? 1 : buffers.resetViews(),
                _bufferedEls = isFragment(buffers.els) ? 1 : buffers.resetEls();
        },
        bufferedReset = function () {
            var cached = this.views;
            this.resetEls();
            this.resetViews();
            return cached;
        },
        bufferedElsReset = function () {
            this.els = document.createDocumentFragment();
        },
        bufferedViewsReset = function () {
            this.views = [];
        };
    app.defineDirective(REGION_MANAGER, function (instance) {
        return {
            list: new Collection[CONSTRUCTOR](),
            parent: instance,
            create: createRegion,
            establish: establishRegion,
            remove: removeRegion,
            add: addRegion
        };
    });
    app.defineDirective(BUFFERED_VIEWS, function (instance) {
        return {
            region: instance,
            els: $.createDocumentFragment(),
            views: [],
            reset: bufferedReset,
            ensure: bufferedEnsure,
            resetViews: bufferedViewsReset,
            resetEls: bufferedElsReset
        };
    });
    app.extend({
        getRegion: getRegion,
        addRegion: addRegion,
        removeRegion: removeRegion
    });
});
});