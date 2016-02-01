(function (win, WHERE, version, fn) {
    'use strict';
    var blank, topmostDoc, app, MAKE_SCRIPT = 'makeScript',
        LENGTH = 'length',
        PARENT = 'parent',
        doc = document,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        now = function () {
            return +(new Date());
        },
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
                console.log(e);
                return try_ && try_(e);
            } finally {
                return finally_ && finally_();
            }
        };

    function Application(name, parent) {
        this.version = name;
        this.scoped = BOOLEAN_TRUE;
        this.global = BOOLEAN_FALSE;
        return this;
    }
    Application.prototype.wraptry = wraptry;
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
        for (; i < list[LENGTH]; i++) {
            extendor[list[i]] = makeParody(parent, parent[list[i]]);
        }
        this.extend(extendor);
        return this;
    };
    var application = win[WHERE] = win[WHERE] || {
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
            saved[PARENT] = blank;
            application.versions[name] = blank;
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
            if (typeof fn === 'function') {
                this.wraptry(function () {
                    fn.call(app, hash[name]);
                });
            }
            return hash[name];
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
                    var version, i = 1,
                        args = arguments,
                        args_ = args,
                        argLen = args[LENGTH];
                    // expects is equivalent to what it would be if the version was passed in
                    if (argLen < expects) {
                        version = application.defaultVersion;
                    } else {
                        args_ = [];
                        version = args[1];
                        for (; i < args[LENGTH]; i++) {
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
                lastScript = allScripts[allScripts[LENGTH] - 1];
            return currentScript || lastScript;
        },
        loadScript: function (url, callback, docu_) {
            var scriptTag, application = this,
                // allow top doc to be overwritten
                docu = docu_ || topmostDoc || doc;
            scriptTag = application[MAKE_SCRIPT](url, callback);
            docu.head.appendChild(scriptTag);
            return application;
        },
        makeScript: function (src, onload, docu_, preventappend) {
            var docu = docu_ || topmostDoc || doc,
                script = docu.createElement('script');
            script.type = 'text/javascript';
            if (!preventappend) {
                docu.head.appendChild(script);
            }
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
            if (application.topAccess === blank) {
                application.wraptry(function () {
                    href = win.top.location.href;
                    // safari bug WHERE unfriendly frame returns undefined
                    if (href) {
                        topAccess = BOOLEAN_TRUE;
                        application = win.top[WHERE] || application;
                    }
                }, function () {
                    topAccess = BOOLEAN_FALSE;
                });
                if (win === win.top) {
                    topAccess = BOOLEAN_TRUE;
                }
                if (topAccess) {
                    topmostDoc = win.top.document;
                    win.top[WHERE] = application;
                }
                application.topAccess = topAccess;
            }
            win[WHERE] = application;
            return application;
        }
    };
    if (!application.get(version)) {
        app = application.registerVersion(version);
        fn(application, app);
    }
}(window, 'application', 'dev', function (application, app) {
    var blank, win = window,
        doc = document,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        configCacheparams = 3,
        cacheparams = 78,
        timestamp = +(new Date()),
        pushString = 'push',
        CONCAT = 'concat',
        LENGTH = 'length',
        OUTER_AD = 'OuterAd',
        MAKE_SCRIPT = 'makeScript',
        READY_STATE = 'readyState',
        RECEIVED_CONFIG = 'receivedConfig',
        LOCATION = 'location',
        PARENT = 'parent',
        REGISTER_SCOPED_METHOD = 'registerScopedMethod',
        getType = function (obj) {
            return typeof obj;
        },
        typeConstructor = function (type) {
            return function (thing) {
                return getType(thing) === type;
            };
        },
        isObject = typeConstructor('object'),
        isString = typeConstructor('string'),
        isFunction = typeConstructor('function'),
        gapSplit = function (str) {
            if (isString(str)) {
                str = str.split(' ');
            }
            return str;
        },
        configList = gapSplit('loaderConfig creativeConfig formatConfig publisherConfig placementConfig'),
        /**
         * list of modules, broken up by where they are used in the framework
         */
        extraModules = [],
        libraryModules = gapSplit('shims utils Strings Collection Events Messenger Box Module speclessExtend Looper Promise Ajax Associator DOMM View Cookie'),
        baseModules = gapSplit('Buster Ad Timer BustedData expansion publisherConfig reporting tagTranslation autoExpandCollapse'),
        outerModules = gapSplit('outerAdProto creativeDataConvert visibility xpDirProx creativeToSpeclessMethods'),
        innerModules = gapSplit('contextList innerAdProto speclessToCreativeMethods AttributesManager exiting'),
        allModules = libraryModules[CONCAT](baseModules, outerModules, innerModules),
        allScopedModules = ['scopeStart'][CONCAT](allModules, ['scopeEnd']),
        startFn = function (key, config) {
            var sp = this;
            sp.configs[key] = config || {};
            sp[RECEIVED_CONFIG](key);
            return sp;
        },
        scopedToWindow = function (name, number) {
            number = number || 0;
            return function () {
                var search = this.parseSearch(arguments[number].location.search);
                var scope = this.scope(search.version);
                return scope[name].apply(scope, arguments);
            };
        };
    app.ads = [];
    app._byId = {};
    app.configs = {};
    app.parody(gapSplit('map loadScript makeScript'));
    app.extend({
        CDNURL: '//c.specless.io',
        SERVERURL: '//s.specless.io',
        SCRIPTPATH: '/frame/2/scripts/',
        CONFIGPATH: '/ads/2/config/',
        plugins: {},
        _startHandlers: [],
        allModules: allModules,
        baseModules: baseModules,
        outerModules: outerModules,
        innerModules: innerModules,
        extraModules: extraModules,
        allScopedModules: allScopedModules,
        configList: configList,
        start: startFn,
        config: startFn,
        userJS: scopedToWindow('userJS'),
        scope: function (name, fn_) {
            var fn = name && (isFunction(name) ? name : (isFunction(fn_) ? fn_ : null));
            if (fn) {
                this[PARENT].scope(this.version, fn);
            }
            return this;
        },
        touchTop: function () {
            // allows the top part of this script to be swapped out against different windows
            return this[PARENT].touchTop(win);
        },
        // parseSearch: function (search) {
        //     return this[PARENT].parseSearch(search || win.location.search);
        // },
        getCurrentScript: function (d) {
            return this[PARENT].getCurrentScript(d || doc);
        },
        topAccess: function () {
            this.touchTop();
            return this[PARENT].topAccess;
        },
        /**
         * @func
         * @name Specless#parseSearch
         * @param {String} [search] - search string from the location.search attribute on the window object
         * @returns {Object} key value pairs of the search string
         */
        parseSearch: function (search) {
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
                        temp[pushString]("");
                    }
                    val = temp[1];
                    val = dcUriComp(val);
                    if (val[0] === "'" || val[0] === '"') {
                        val = val.slice(1, val[LENGTH] - 1);
                    }
                    if (val === BOOLEAN_TRUE + '') {
                        val = BOOLEAN_TRUE;
                    }
                    if (val === BOOLEAN_FALSE + '') {
                        val = BOOLEAN_FALSE;
                    }
                    if (isString(val)) {
                        converted = +val;
                        if (converted == val && converted + '' === val) {
                            val = converted;
                        }
                    }
                    parms[dcUriComp(temp[0])] = val;
                }
            }
            return parms;
        },
        receivedConfig: function (key) {
            var app = this,
                _ = app._ || {},
                factories = _.factories,
                configs = app.configs,
                config = configs[key],
                keySplit = key.split(':'),
                configType = keySplit[0],
                configName = keySplit[1];
            if (config && isObject(config) && isString(key)) {
                app.each(function (ad) {
                    if (factories && factories[OUTER_AD]) {
                        if (ad instanceof factories[OUTER_AD]) {
                            return;
                        }
                    }
                    ad = ad.attrs;
                    if (ad[configType] === configName) {
                        ad[READY_STATE] = Math.max(--ad[READY_STATE], 0);
                    }
                });
            }
            return app;
        },
        each: function (fn) {
            this.map(this.ads, fn, this);
            return this;
        },
        makeModuleUrl: function (subfolder, modules, preventprepend) {
            var url = this.map(modules, function (module) {
                return [currentVersion, subfolder, module].join('_');
            }).join(',');
            if (!preventprepend) {
                url = this.CDNURL + this.SCRIPTPATH + url;
            }
            return url;
        },
        loadModules: function (modules, callback, subfolder, debug, docu) {
            var url, app = this;
            subfolder = subfolder || 'lib';
            url = app.makeModuleUrl(subfolder, modules, BOOLEAN_FALSE);
            if (!debug) {
                url += '?t=' + cacheparams + '&f=' + cacheparams;
            }
            app.loadScript(url, callback, docu);
            return app;
        },
        addStartHandler: function (func) {
            var app = this,
                _startHandlers = app._startHandlers;
            _startHandlers.push(func);
            return app;
        },
        load: function (sAdTag, attrs) {
            var scriptTag, configType, src, data, module, list, item, endUrl, configsUrl, itemName, i = 0,
                configItems = [],
                application = this.touchTop(),
                app = application.get(currentVersion),
                parts = {},
                getById = app._byId,
                getModules = function () {
                    if (app.tryToMakeAds) {
                        app.tryToMakeAds();
                    }
                };
            if (!attrs) {
                attrs = {};
            }
            if (!sAdTag) {
                sAdTag = application.parseSearch(win[LOCATION].search);
            }
            if (isObject(sAdTag)) {
                attrs = sAdTag;
                sAdTag = attrs.ad || attrs.serverAdId;
                attrs.ad = blank;
                attrs.serverAdId = blank;
            }
            attrs.requestTime = attrs.requestTime || timestamp;
            attrs.serverAdId = sAdTag;
            parts.win = win;
            parts.doc = doc;
            attrs[READY_STATE] = 0;
            attrs.neededModules = allModules[CONCAT](attrs.modules || []);
            if ((currentVersion.indexOf('dev') !== -1 || currentVersion === 'hotfix') && !attrs.hasOwnProperty('debug')) {
                attrs.debug = BOOLEAN_TRUE;
            }
            if (attrs.wrapperId) {
                parts.slot = (doc.getElementById(attrs.wrapperId) || doc.body);
                parts.scriptTag = parts.slot;
            }
            parts.scriptTag = app.getCurrentScript(doc);
            if (parts.scriptTag) {
                // have you loaded the lib yet?
                if (!app[READY_STATE]) {
                    app[READY_STATE] = 1;
                    // readyState = 1 === modules are being loaded
                    app.loadModules(allScopedModules, function () {
                        app[READY_STATE]++;
                        getModules();
                    }, null, attrs.debug, doc, attrs);
                }
                if (!attrs.loaderConfig) {
                    attrs.loaderConfig = sAdTag + '00';
                }
                if (!attrs.creativeConfig) {
                    attrs.creativeConfig = sAdTag;
                    if (attrs.creativeConfig.length < 8) {
                        attrs.creativeConfig += '01';
                    }
                }
                data = {
                    parts: parts,
                    attrs: attrs
                };
                if (!getById[sAdTag]) {
                    getById[sAdTag] = [];
                }
                app.ads[pushString](data);
                getById[sAdTag][pushString](data);
                for (; i < configList[LENGTH]; i++) {
                    configType = configList[i];
                    item = attrs[configType];
                    // if it has a config
                    if (item) {
                        itemName = configType + ':' + item;
                        // always count up on the ready state number
                        attrs[READY_STATE]++;
                        // if the config has not already been requested
                        if (!isObject(app.configs[itemName])) {
                            // then push it to the request and create an object to
                            // prevent it from being requested again
                            configItems[pushString]({
                                type: configType.slice(0, configType[LENGTH] - 6),
                                name: item
                            });
                        } else {
                            app[RECEIVED_CONFIG](itemName);
                        }
                    }
                }
                if (configItems[LENGTH]) {
                    configsUrl = (attrs.CDNURL || this.CDNURL) + (attrs.CONFIGPATH || app.CONFIGPATH) + app.map(configItems, function (item) {
                        return item.type + '_' + item.name;
                    }).join(',');
                    if (!attrs.debug) {
                        configsUrl += '?t=' + configCacheparams;
                    }
                    doc.head.appendChild(application[MAKE_SCRIPT](configsUrl, getModules));
                }
            }
            getModules();
            return app;
        }
    });
    application[REGISTER_SCOPED_METHOD]('load');
    application[REGISTER_SCOPED_METHOD]('start');
    application[REGISTER_SCOPED_METHOD]('run');
    application[REGISTER_SCOPED_METHOD]('module');
    application[REGISTER_SCOPED_METHOD]('addStartHandler', 2);
    // make inner specless object
    application[REGISTER_SCOPED_METHOD]('makeInner');
    // handles user js
    application[REGISTER_SCOPED_METHOD]('userJS');
    // plugins
    application[REGISTER_SCOPED_METHOD]('component', 4);
}));
application.scope('dev', function (app) {
    var blank, _, object = Object,
        win = window,
        factories = {},
        fn = Function,
        array = Array,
        string = String,
        TO_STRING = 'toString',
        PROTOTYPE = 'prototype',
        CONSTRUCTOR = 'constructor',
        LENGTH = 'length',
        CONSTRUCTOR_KEY = '__constructor__',
        stringProto = string[PROTOTYPE],
        objectProto = object[PROTOTYPE],
        arrayProto = array[PROTOTYPE],
        funcProto = fn[PROTOTYPE],
        nativeKeys = object.keys,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        NULL = null,
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
        isUndefined = function (thing) {
            return thing === void 0;
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
            return key !== -1 && key === key && key !== blank && key !== null && key !== BOOLEAN_FALSE && key !== BOOLEAN_TRUE;
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
            child.extend = constructorExtend;
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
            __.extend = function () {
                return Constructor.extend.apply(Constructor, arguments);
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
                var aCtor = a[CONSTRUCTOR],
                    bCtor = b[CONSTRUCTOR];
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
        // log = function (type, args) {
        //     if (!_.isFunction(console[type])) {
        //         type = 'log';
        //     }
        //     console[type].apply(console, args);
        // },
        /**
         * @func
         */
        parse = function (val_) {
            var val = val_;
            if (isString(val)) {
                val = val.trim();
                if (val[0] === '{' || val[0] === '[') {
                    wraptry(function () {
                        val = JSON.parse(val);
                    }, function () {
                        console.error('could not parse', val);
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
        result = function (obj, str, arg) {
            return isFunction(obj[str]) ? obj[str](arg) : obj[str];
        },
        mathArray = function (method) {
            return function (args) {
                return Math[method].apply(maths, args);
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
    Model.extend = constructorExtend;
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
        cssTemplater: cssTemplater,
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
        isBlank: isBlank,
        isUndefined: isUndefined,
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
        isFunction: isFunction,
        parse: parse,
        shift: shift,
        eachProxy: eachProxy,
        exports: exports,
        slice: slice,
        bind: bind,
        duff: duff,
        sort: sort,
        join: join,
        wrap: wrap,
        uuid: uuid,
        allKeys: allKeys,
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
        floor: floor,
        ceil: ceil,
        min: mathArray('min'),
        max: mathArray('max'),
        math: wrap(gapSplit('E LN2 LN10 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos acosh asin asinh atan atan2 atanh cbrt ceil clz32 cos cosh exp expm1 floor fround hypot imul log log1p log2 log10 max min pow random round sign sin sinh sqrt tan tanh trunc'), function (key) {
            return Math[key];
        })
    };
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
        extend = _.extend,
        wrap = _.wrap,
        LENGTH = 'length',
        HTTP = 'http',
        falseBool = false,
        has = _.has,
        join = _.join,
        cacheable = function (fn) {
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
        string = extend(wrap(gapSplit('toLowerCase toUpperCase trim'), function (method) {
            return cacheable(function (item) {
                return item[method]();
            });
        }), wrap(gapSplit('indexOf match search'), function (method) {
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
                    for (i = s[LENGTH] - 1; i >= 1; i--) {
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
                i = str[LENGTH];
                // work from the back
                while (str[--i]) {
                    // for (i = str[LENGTH] - 1; i >= 0; i--) {
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
        isHttp = cacheable(function (str) {
            var ret = !1;
            if ((str.indexOf(HTTP) === 0 && str.split('//').length >= 2) || str.indexOf('//') === 0) {
                ret = !0;
            }
            return ret;
        }),
        parseHash = cacheable(function (url) {
            var hash = '',
                hashIdx = indexOf(url, '#') + 1;
            if (hashIdx) {
                hash = url.slice(hashIdx - 1);
            }
            return hash;
        }),
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
                protocols = [HTTP, HTTP + 's', 'file', 'about'],
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
                    protocol = HTTP;
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
        // constants
        customUnits: customUnits,
        // cache makers
        cacheable: cacheable,
        categoricallyCacheable: categoricallyCacheable,
        // cacheable
        deprefix: deprefix,
        deprefixAll: deprefixAll,
        prefix: prefix,
        prefixAll: prefixAll,
        upCase: upCase,
        unCamelCase: unCamelCase,
        camelCase: camelCase,
        string: string,
        units: units,
        baseUnitList: baseUnitList,
        isHttp: isHttp,
        parseHash: parseHash,
        parseURL: parseURL,
        parseObject: parseObject
    });
});
application.scope(function (app) {
    var blank, _ = app._,
        factories = _.factories,
        isObject = _.isObject,
        isNumber = _.isNumber,
        isFunction = _.isFunction,
        isInstance = _.isInstance,
        LENGTH = 'length',
        ITEMS = '_items',
        BY_ID = '_byId',
        ID = 'id',
        PREVIOUS = '_previous',
        each = _.each,
        duff = _.duff,
        push = _.push,
        wrap = _.wrap,
        keys = _.keys,
        find = _.find,
        map = _.map,
        has = _.has,
        isBlank = _.isBlank,
        stringify = _.stringify,
        findLast = _.findLast,
        allKeys = _.allKeys,
        splice = _.splice,
        toArray = _.toArray,
        gapSplit = _.gapSplit,
        sort = _.sort,
        bind = _.bind,
        extend = _.extend,
        result = _.result,
        isArrayLike = _.isArrayLike,
        negate = _.negate,
        isArray = _.isArray,
        indexOf = _.indexOf,
        clone = _.clone,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        eachCall = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            });
        },
        eachRevCall = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            }, null, -1);
        },
        doToEverything = function (doLater, direction) {
            return function () {
                var args = toArray(arguments),
                    one = args.shift();
                duff(args, function (items) {
                    duff(items, function (item) {
                        doLater(one, item);
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
            var len = list[LENGTH],
                lastIdx = len || 0;
            splice(list, index || 0, 0, item);
            return len !== list[LENGTH];
        },
        range = function (start, stop, step, inclusive) {
            var length, range, idx;
            if (isBlank(stop)) {
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
        count = function (list, start, end, runner_) {
            var runner, obj, idx, ctx = this;
            if (start < end && isNumber(start) && isNumber(end) && isFinite(start) && isFinite(end)) {
                end = Math.abs(end);
                idx = start;
                runner = bind(runner_, ctx);
                while (idx < end) {
                    obj = null;
                    if (has(list, idx)) {
                        obj = list[idx];
                    }
                    runner(obj, idx, list);
                    idx++;
                }
            }
            return list;
        },
        // array, startIndex, endIndex
        between = function (fn) {
            return function (list, startIdx_, endIdx_) {
                var ret = [],
                    startIdx = startIdx_ || 0,
                    endIdx = endIdx_ || list[LENGTH],
                    findResult = find(list, function (item, idx, list) {
                        fn(ret, item, idx, list);
                    }, null, endIdx);
                return ret;
            };
        },
        /**
         * @func
         */
        closest = function (list, target) {
            var match, path, diff, valuesLen, possible, i = 0,
                previousAbs = Infinity;
            // trying to avoid running through 20 matchs
            // when i'm already at the exact one
            if (!isArrayLike(list)) {
                return;
            }
            valuesLen = list[LENGTH];
            if (valuesLen === 1) {
                match = list[0];
            }
            if (indexOf(list, target) !== -1) {
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
            return match;
        },
        countTo = function (list, num, runner) {
            return count(list, 0, num, runner);
        },
        countFrom = function (list, num, runner) {
            return count(list, num, list[LENGTH], runner);
        },
        /**
         * @func
         */
        posit = function (list, item, lookAfter) {
            return indexOf(list, item, lookAfter) + 1;
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
            var array = [];
            duff(concat.apply(null, arguments), function (item) {
                if (!posit(array, item)) {
                    array.push(item);
                }
            });
            return array;
        },
        cycle = function (arr, num) {
            var piece, len = arr[LENGTH];
            if (isNumber(len)) {
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
            var items = [];
            duff(arr, function (item) {
                if (isObject(item) && item[key] !== void 0) {
                    items.push(item[key]);
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
            return filter(obj, negate(matches(attrs)));
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
        // merge = splat(function (item, idx, list) {
        //     var len, collection = this,
        //         last = collection[LENGTH];
        //     if (isArrayLike(item)) {
        //         len = item[LENGTH];
        //         duff(item, function (key, val) {
        //             if (val !== blank) {
        //                 // removes any undefined items
        //                 len = key + 1;
        //                 collection[key] = val;
        //             }
        //         });
        //         if (len > (last || 0)) {
        //             collection[LENGTH] = len;
        //         }
        //     }
        // }),
        eq = function (list, num) {
            var n, thisNum, items = [],
                numb = num || 0,
                evaluatedIsNumber = isNumber(numb),
                isArray = isArrayLike(numb);
            if (numb < 0) {
                evaluatedIsNumber = BOOLEAN_FALSE;
            }
            if (list[LENGTH]) {
                if (evaluatedIsNumber) {
                    items = [list[numb]];
                }
                if (isArray) {
                    items = clone(numb);
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
                while (args[LENGTH] < index) {
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
        unwrapper = function (fn) {
            return function (args) {
                args[0] = args[0][ITEMS];
                return fn.call(this, args);
            };
        },
        unwrapInstance = function (instance_) {
            return isInstance(instance, factories.Collection) ? instance_ : instance.unwrap();
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
            return this[ITEMS];
        },
        // canRunHash = {},
        wrappedCollectionMethods = extend(wrap({
            each: duff,
            duff: duff,
            forEach: duff,
            eachRev: duffRev,
            duffRev: duffRev,
            forEachRev: duffRev,
            eachCall: eachCall,
            eachRevCall: eachRevCall
        }, function (handler) {
            // canRunHash[key] = 1;
            return function (iterator, context) {
                var items = this[ITEMS];
                if (items[LENGTH]) {
                    handler(items, iterator, context);
                }
                return this;
            };
        }), wrap(gapSplit('addAll removeAll'), function (name) {
            return function () {
                var args = toArray(arguments);
                args.unshift(this);
                // unwrapAll
                duff(args, function (arg, idx, args) {
                    if (isInstance(arg, Collection)) {
                        arg = arg.unwrap();
                    }
                    args[idx] = arg;
                });
                // custom
                _[name].apply(_, args);
                return this;
            };
        }), wrap(gapSplit('sort unshift push cycle uncycle reverse count countTo countFrom'), function (name) {
            return function () {
                var args = toArray(arguments);
                args.unshift(this[ITEMS]);
                // unwrapper
                // custom
                _[name].apply(_, args);
                return this;
            };
        }), wrap(gapSplit('has add addAt remove removeAt pop shift indexOf find findLast findWhere findLastWhere posit foldr foldl reduce'), function (name) {
            return function () {
                var args = toArray(arguments);
                args.unshift(this[ITEMS]);
                // custom
                return _[name].apply(_, args);
            };
        }), wrap(gapSplit('merge eq map filter pluck where whereNot'), function (name) {
            // always responds with an array
            return function () {
                var args = toArray(arguments);
                args.unshift(this[ITEMS]);
                // unwrapper
                // custom
                return new Collection(_[name].apply(_, args));
            };
        })),
        ret = _.exports({
            eachCall: eachCall,
            eachRevCall: eachRevCall,
            closest: closest,
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
            pluck: pluck,
            where: where,
            findWhere: findWhere,
            findLastWhere: findLastWhere,
            between: between,
            eq: eq,
            posit: posit,
            range: range,
            count: count,
            countTo: countTo,
            countFrom: countFrom,
            whereNot: whereNot,
            eachRev: eachRev,
            duffRev: duffRev,
            flatten: flatten
        }),
        interactWithById = function (fun, expecting) {
            return function (one, two, three) {
                var instance = this,
                    bycategories = instance[BY_ID],
                    passedCategory = arguments[LENGTH] === expecting,
                    category = passedCategory ? one : ID,
                    categoryHash = bycategories[category] = bycategories[category] || {},
                    key = passedCategory ? two : one,
                    thing = passedCategory ? three : two;
                return fun(instance, categoryHash, category, key, thing, passedCategory);
            };
        },
        Collection = factories.Model.extend('Collection', extend({
            unwrap: unwrap,
            range: recreateSelf(range),
            flatten: recreateSelf(function () {
                // return
                return flatten.apply(null, this[ITEMS]);
            }),
            concat: recreateSelf(function () {
                var args = [],
                    base = this[ITEMS];
                // this allows us to mix collections with regular arguments
                return base.concat.apply(base, map(arguments, function (arg) {
                    return Collection(arg).unwrap();
                }));
            }),
            length: function () {
                return this[ITEMS][LENGTH];
            },
            first: function () {
                return this[ITEMS][0];
            },
            last: function () {
                return this[ITEMS][this[LENGTH]() - 1];
            },
            index: function (number) {
                return this[ITEMS][number || 0];
            },
            constructor: function (arr) {
                var collection = this;
                if (!isArray(arr) && isArrayLike(arr)) {
                    arr = toArray(arr);
                }
                if (!isBlank(arr) && !isArrayLike(arr)) {
                    arr = [arr];
                }
                collection[BY_ID] = {};
                collection[ITEMS] = arr || [];
                return collection;
            },
            toString: function () {
                return stringify(this);
            },
            toJSON: function () {
                // subtle distinction here
                return map(this[ITEMS], function (item) {
                    var ret;
                    if (isObject(item) && isFunction(item.toJSON)) {
                        ret = item.toJSON();
                    } else {
                        ret = item;
                    }
                    return ret;
                });
            },
            join: function (delimiter) {
                return this[ITEMS].join(delimiter);
            },
            get: interactWithById(function (instance, categoryHash, category, key) {
                return categoryHash[key];
            }, 2),
            register: interactWithById(function (instance, categoryHash, category, key, newItem) {
                categoryHash[key] = newItem;
            }, 3),
            unRegister: interactWithById(function (instance, categoryHash, category, key) {
                var registeredItem = categoryHash[key];
                if (registeredItem !== blank) {
                    categoryHash[key] = blank;
                }
                return registeredItem;
            }, 2),
            swapRegister: interactWithById(function (instance, categoryHash, category, key, newItem) {
                var registeredItem = categoryHash[key];
                if (registeredItem !== blank) {
                    categoryHash[key] = blank;
                }
                categoryHash[key] = newItem;
                return registeredItem;
            }, 3),
            /**
             * @description adds models to the children array
             * @param {Object|Object[]} objs - object or array of objects to be passed through the model factory and pushed onto the children array
             * @param {Object} [secondary] - secondary hash that is common among all of the objects being created. The parent property is automatically overwritten as the object that the add method was called on
             * @returns {Object|Box} the object that was just created, or the object that the method was called on
             * @name Box#add
             * @func
             */
            mambo: function (fn) {
                var collection = this;
                externalMambo(collection[ITEMS], function () {
                    fn(collection);
                });
                return collection;
            }
        }, wrappedCollectionMethods), !0);
});
application.scope(function (app) {
    var blank, _ = app._,
        factories = _.factories,
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
        bind = _.bind,
        find = _.find,
        isInstance = _.isInstance,
        camelCase = _.camelCase,
        intendedObject = _.intendedObject,
        toArray = _.toArray,
        clone = _.clone,
        once = _.once,
        extend = _.extend,
        remove = _.remove,
        stringify = _.stringify,
        isArrayLike = _.isArrayLike,
        isArray = _.isArray,
        upCase = _.upCase,
        LENGTH = 'length',
        PARENT = 'parent',
        _EVENTS = '_events',
        EVENT_REMOVE = '_removeEventList',
        CURRENT_EVENTS = '_currentEventList',
        _LISTENING_TO = '_listeningTo',
        modifiedTriggerString = 'change:',
        IMMEDIATE_PROP_IS_STOPPED = 'immediatePropagationIsStopped',
        SERIALIZED_DATA = 'serializedData',
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        iterateOverObject = function (box, ctx, key, value, iterator, firstarg, allowNonFn) {
            intendedObject(key, value, function (evnts, funs_) {
                // only accepts a string or a function
                var fn = isString(funs_) ? box[funs_] : funs_,
                    splitevents = gapSplit(evnts);
                if (!allowNonFn && !isFunction(fn)) {
                    return splitevents;
                }
                return duff(splitevents, function (eventName) {
                    var namespace = eventName.split(':')[0];
                    iterator(box, eventName, {
                        disabled: BOOLEAN_FALSE,
                        namespace: namespace,
                        name: eventName,
                        handler: fn,
                        ctx: ctx,
                        origin: box
                    }, firstarg);
                });
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
            var internalevents = model[_EVENTS] = model[_EVENTS] || {};
            return internalevents[name];
        },
        getRemoveList = function (model) {
            var list = model[EVENT_REMOVE] = model[EVENT_REMOVE] = [];
            return list;
        },
        getCurrentEventList = function (box) {
            var list = box[CURRENT_EVENTS];
            if (!list) {
                list = box[CURRENT_EVENTS] = [];
            }
            return list;
        },
        attachEventObject = function (obj, name, eventObject) {
            var events, list;
            if (!obj) {
                return;
            }
            eventObject.ctx = eventObject.ctx || eventObject.origin;
            eventObject.fn = eventObject.fn || eventObject.handler;
            eventObject.fn = bind(eventObject.fn, eventObject.ctx);
            events = obj[_EVENTS] = obj[_EVENTS] || {};
            list = events[name] = events[name] || [];
            // attached so event can remove itself
            eventObject.list = list;
            list.push(eventObject);
        },
        retreiveListeningObject = function (thing, obj) {
            var listeningTo, listening, thisId, id = obj._listenId;
            if (!id) {
                id = obj._listenId = _.uniqueId('l');
            }
            listeningTo = thing[_LISTENING_TO] || (thing[_LISTENING_TO] = {});
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
        ObjectEvent = factories.Model.extend('ObjectEvent', {
            constructor: function (name, target, data) {
                var evnt = this;
                if (isInstance(data, Event)) {
                    return data;
                }
                evnt.bubbles = BOOLEAN_FALSE;
                evnt.dispatchChildren = BOOLEAN_FALSE;
                evnt.dispatchTree = BOOLEAN_FALSE;
                evnt.onMethodName = upCase(camelCase('on:' + name, ':'));
                evnt.propagationIsStopped = evnt[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_FALSE;
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
                var ret = this[SERIALIZED_DATA];
                if (arguments[LENGTH]) {
                    ret = this[SERIALIZED_DATA] = _.parse(_.stringify(isBlank(arg) ? {} : arg));
                }
                this[SERIALIZED_DATA] = ret;
                ret = this[SERIALIZED_DATA];
                return ret;
            },
            get: function (key) {
                return this[SERIALIZED_DATA][key];
            },
            set: function (key, value) {
                var evnt = this;
                intendedObject(key, value, function (key, value) {
                    evnt[SERIALIZED_DATA][key] = value;
                });
                return this;
            },
            stopImmediatePropagation: function () {
                this.stopPropagation();
                this[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_TRUE;
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
            var events = box[_EVENTS] = box[_EVENTS] || {};
            return events[name] || [];
        },
        overrideEventCreation = function (obj) {
            return obj && (obj.bubbles || obj.dispatchChildren || opts.dispatchTree);
        },
        Events = factories.Model.extend('Events', {
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
                model[CURRENT_EVENTS] = model[CURRENT_EVENTS] || [];
                model[_EVENTS] = model[_EVENTS] || {};
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
            wipeEvents: function () {
                var box = this;
                each(box[_EVENTS], function (array, key, obj) {
                    duffRev(array, removeEvent);
                });
                return box;
            },
            off: function (name_, fn_, ctx_) {
                var currentEventList, currentObj, box = this,
                    name = name_;
                box._makeValid();
                if (arguments[LENGTH]) {
                    if (!name) {
                        each(box[_EVENTS], function (list, name) {
                            removeEventObject(box, list, fn_, ctx_);
                        });
                    } else {
                        iterateOverObject(box, isObject(name_) ? fn_ : ctx_, name, fn_, function (box, name, obj) {
                            removeEventObject(box, !name || box[_EVENTS][name], obj.handler, obj.ctx);
                        });
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
                    listeningTo = origin[_LISTENING_TO];
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
                        origin[_LISTENING_TO] = blank;
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
                    ret = isFunction(box[evnt.methodName]) && box[evnt.methodName](evnt),
                    anotherRet = !evnt[IMMEDIATE_PROP_IS_STOPPED] && !!find(list, function (obj) {
                        var gah;
                        currentEventArray.push(obj);
                        obj.fn(evnt);
                        gah = currentEventArray.pop();
                        return evnt[IMMEDIATE_PROP_IS_STOPPED];
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
                var box = this,
                    methodName = upCase(camelCase('on:' + name, ':')),
                    evnt = evnt_ || box._createEvent(name, data);
                box._eventDispatcher(evnt);
                evnt.finished();
                return evnt;
            }
        }, BOOLEAN_TRUE);
});
application.scope(function (app) {
    var blank, _ = app._,
        factories = _.factories,
        Events = factories.Events,
        result = _.result,
        isFunction = _.isFunction,
        isObject = _.isObject,
        intendedObject = _.intendedObject,
        PARENT = 'parent',
        NAME = 'name',
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
            obj[NAME] = key;
            messengerHash[key] = obj;
        },
        removeFromHash = function (obj) {
            messengerHash[obj[NAME]] = blank;
        },
        Messenger = factories.Events.extend('Messenger', {
            constructor: function (parent) {
                var ret, scopedHash = {};
                this._getHash = function (key, arg) {
                    return result(scopedHash, key, arg);
                };
                this._setHash = function (key, val) {
                    scopedHash[key] = val;
                };
                ret = isObject(parent) ? this.attachParent(parent) : attachToHash(key, this);
                this.on('before:destroy', function () {
                    var obj = this;
                    if (obj[NAME]) {
                        removeFromHash(obj);
                    }
                });
                return Events.constructor.call(this);
            },
            attachParent: function (parent) {
                this[PARENT] = parent;
                parent.message = this;
                return this;
            },
            request: function (key, arg) {
                return this._getHash(key, arg);
            },
            reply: function (key, handler) {
                var messenger = this;
                intendedObject(key, handler, function (key, handler_) {
                    var handler = handler_;
                    if (!isFunction(handler_)) {
                        handler = basicData(handler_);
                    }
                    messenger._setHash(key, bind(handler, this[PARENT] || {}));
                });
                return messenger[PARENT];
            }
        }, true);
    factories.Messenger(app);
});
application.scope(function (app) {
    var blank, _ = app._,
        factories = _.factories,
        Collection = factories.Collection,
        Events = factories.Events,
        gapSplit = _.gapSplit,
        isObject = _.isObject,
        isString = _.isString,
        isNumber = _.isNumber,
        isEqual = _.isEqual,
        isBlank = _.isBlank,
        isFunction = _.isFunction,
        each = _.each,
        duff = _.duff,
        find = _.find,
        duffRev = _.duffRev,
        push = _.push,
        has = _.has,
        map = _.map,
        result = _.result,
        toArray = _.toArray,
        remove = _.remove,
        clone = _.clone,
        once = _.once,
        parse = _.parse,
        extend = _.extend,
        listDrop = _.remove,
        stringify = _.stringify,
        isInstance = _.isInstance,
        isArrayLike = _.isArrayLike,
        upCase = _.upCase,
        camelCase = _.camelCase,
        isArray = _.isArray,
        intendedObject = _.intendedObject,
        uniqueId = _.uniqueId,
        BOOLEAN_FALSE = !1,
        BOOLEAN_TRUE = !0,
        ID = 'id',
        SORT = 'sort',
        ADDED = 'added',
        UNWRAP = 'unwrap',
        REMOVED = 'removed',
        LENGTH = 'length',
        PARENT = 'parent',
        DESTROY = 'destroy',
        BEFORE_COLON = 'before:',
        INTERNAL_EVENTS = '_events',
        ATTRIBUTES = 'attributes',
        STOP_LISTENING = 'stopListening',
        DISPATCH_EVENT = 'dispatchEvent',
        EVENT_REMOVE = '_removeEventList',
        ATTRIBUTE_HISTORY = '_attributeHistory',
        _DELEGATED_CHILD_EVENTS = '_delegatedParentEvents',
        _PARENT_DELEGATED_CHILD_EVENTS = '_parentDelgatedChildEvents',
        CHILD = 'child',
        CHILDREN = CHILD + 'ren',
        CHANGE = 'change',
        CHANGE_COUNTER = '_changeCounter',
        PREVIOUS_ATTRIBUTES = '_previousAttributes',
        /**
         * @class Box
         * @description event and attribute extensor object that creates the Box Constructor and convenience method at _.Box
         * @augments Model
         */
        Container = factories.Events.extend('Container', {
            // this id prefix is nonsense
            // define the actual key
            uniqueKey: 'cid',
            idAttribute: ID,
            constructor: function (attributes, secondary) {
                var model = this;
                model[model.uniqueKey] = model[model.uniqueKey] = uniqueId(model.uniqueKey);
                extend(model, secondary);
                model.reset(attributes);
                Events.constructor.apply(this, arguments);
                return model;
            },
            _reset: function (attributes_) {
                var childModel, children, model = this,
                    _altered = model._altered = {},
                    // automatically checks to see if the attributes are a string
                    attributes = parse(attributes_) || {},
                    // default attributes
                    attrs = result(model, 'defaults', attributes),
                    // build new attributes
                    newAttributes = extend(attrs, attributes),
                    // get the id
                    idAttr = result(model, 'idAttribute', newAttributes),
                    // stale attributes
                    ret = model[ATTRIBUTES] || {},
                    history = model[ATTRIBUTE_HISTORY] = {};
                // set id and let parent know what your new id is
                this[DISPATCH_EVENT](BEFORE_COLON + 'reset');
                model._setId(model.id || newAttributes[idAttr] || uniqueId(BOOLEAN_FALSE, BOOLEAN_TRUE));
                model[PREVIOUS_ATTRIBUTES] = {};
                // swaps attributes hash
                model[ATTRIBUTES] = newAttributes;
                // let everything know that it is changing
                model[DISPATCH_EVENT]('reset');
                return ret;
            },
            /**
             * @description remove attributes from the Box object. Does not completely remove from object with delete, but instead simply sets it to blank / undefined
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
                return find(gapSplit(attrs), function (attr) {
                    return attributes[attr] === blank;
                }) === blank;
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
                    history = model[ATTRIBUTE_HISTORY],
                    oldValue = attrs[key],
                    previousAttrsObject = model[PREVIOUS_ATTRIBUTES] = model[PREVIOUS_ATTRIBUTES] || {};
                if (!isEqual(oldValue, newValue)) {
                    previousAttrsObject[key] = oldValue;
                    history[key] = oldValue;
                    attrs[key] = newValue;
                    didChange = BOOLEAN_TRUE;
                }
                return didChange;
            },
            _destroy: function () {
                var container = this,
                    // removes all parent / parent's child listeners
                    removeRet = container[PARENT] && container[PARENT].remove(container);
            },
            destroy: function () {
                var removeRet, box = this;
                // notify things like parent that it's about to destroy itself
                box[DISPATCH_EVENT](BEFORE_COLON + 'destroy');
                // actually detach
                box._destroy();
                // stop listening to other views
                box[DISPATCH_EVENT](DESTROY);
                // stops listening to everything
                box[STOP_LISTENING]();
                // takes off all other event handlers
                box.wipeEvents();
                return box;
            },
            digester: function (fn) {
                var ret, model = this;
                model[CHANGE_COUNTER] = model[CHANGE_COUNTER] || 0;
                ++model[CHANGE_COUNTER];
                ret = fn();
                --model[CHANGE_COUNTER];
                // this event should only ever exist here
                if (!model[CHANGE_COUNTER]) {
                    model[DISPATCH_EVENT]('digest', model[PREVIOUS_ATTRIBUTES]);
                    model[PREVIOUS_ATTRIBUTES] = {};
                }
                return ret;
            },
            set: function (key, value) {
                var changedList = [],
                    model = this,
                    compiled = {};
                intendedObject(key, value, function (key, value) {
                    if (model._set(key, value)) {
                        changedList.push(key);
                        compiled[key] = value;
                    }
                });
                if (!changedList[LENGTH]) {
                    // do not digest... this time
                    return model;
                }
                model.digester(function () {
                    duff(changedList, function (name) {
                        model[DISPATCH_EVENT](CHANGE + ':' + name);
                    });
                    model[DISPATCH_EVENT](CHANGE, compiled);
                });
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
            comparator: 'id',
            valueOf: function () {
                var datapoint = +this.attributes[this.comparator];
                if (datapoint === blank) {
                    datapoint = +this[this.comparator];
                }
                if (datapoint === blank) {
                    datapoint = +this.id;
                }
                return datapoint;
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
                    id = id_ === blank ? uniqueId(BOOLEAN_FALSE) : id_;
                model.id = id;
            },
            reset: function (attrs) {
                this._reset(attrs);
                return this;
            }
        }, BOOLEAN_TRUE),
        modelMaker = function (attributes, options) {
            return Box(attributes, options);
        },
        Box = factories.Container.extend('Box', {
            Model: modelMaker,
            /**
             * @description constructor function for the Box Object
             * @name Box#constructor
             * @func
             */
            constructor: function (attributes, secondary) {
                var model = this;
                model._ensureChildren();
                Container.constructor.apply(model, arguments);
                return model;
            },
            _ensureChildren: function () {
                this[CHILDREN] = Collection();
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
            resetChildren: function (newChildren) {
                var length, child, box = this,
                    children = box[CHILDREN],
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
                box.add(newChildren);
                return box;
            },
            // registers and actually adds child to hash
            _addToHash: function (newModel, where) {
                var parent = this,
                    children = this[where || CHILDREN];
                // add to collection
                children.add(newModel);
                // register with parent
                children.register(newModel.id, newModel);
                children.register(newModel.uniqueKey, newModel[newModel.uniqueKey], newModel);
            },
            // ties child events to new child
            _delegateChildEvents: function (model) {
                var parent = this,
                    childEvents = _.result(parent, CHILD + 'Events');
                if (model && childEvents) {
                    model[_PARENT_DELEGATED_CHILD_EVENTS] = childEvents;
                    parent.listenTo(model, childEvents);
                }
            },
            // ties child events to new child
            _unDelegateChildEvents: function (model) {
                if (model && model[_PARENT_DELEGATED_CHILD_EVENTS] && this[STOP_LISTENING]) {
                    this[STOP_LISTENING](model, model[_PARENT_DELEGATED_CHILD_EVENTS]);
                }
            },
            _delegateParentEvents: function (model) {
                var parent = model[PARENT],
                    parentEvents = _.result(model, 'parentEvents');
                if (parent && parentEvents) {
                    model[_DELEGATED_CHILD_EVENTS] = parentEvents;
                    model.listenTo(parent, parentEvents);
                }
            },
            // ties child events to new child
            _unDelegateParentEvents: function (model) {
                var parent = this;
                if (model[STOP_LISTENING] && model[_DELEGATED_CHILD_EVENTS]) {
                    model[STOP_LISTENING](parent, model[_DELEGATED_CHILD_EVENTS]);
                }
            },
            _isChildType: function (child) {
                return isInstance(child, this.Model);
            },
            // this one forcefully adds
            _add: function (model) {
                var parent = this,
                    children = parent[CHILDREN],
                    evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](BEFORE_COLON + ADDED);
                // let the child know it's about to be added
                // (tied to it's parent via events)
                // unties boxes
                parent._remove(model);
                // explicitly tie to parent
                model[PARENT] = parent;
                // attach events from parent
                parent._addToHash(model);
                // ties boxes together
                parent._delegateParentEvents(model);
                parent._delegateChildEvents(model);
                evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](ADDED);
                // notify that you were added
                return model;
            },
            // public facing version filters
            add: function (objs_, secondary_) {
                var childAdded, parent = this,
                    children = parent[CHILDREN],
                    secondary = extend(result(parent, CHILD + 'Options'), secondary_ || {}),
                    list = Collection(objs_);
                // unwrap it if you were passed a collection
                if (!parent.Model || !list[LENGTH]()) {
                    return list[UNWRAP]();
                }
                list = list.foldl(function (memo, obj) {
                    var isChildType = parent._isChildType(obj),
                        // create a new model
                        // call it with new in case they use a constructor
                        newModel = isChildType ? obj : new parent.Model(obj, secondary),
                        // find by the newly created's id
                        foundModel = children.get(newModel.id);
                    if (foundModel) {
                        // update the old
                        foundModel.set(obj);
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
                    parent[DISPATCH_EVENT](CHILD + ':' + ADDED);
                }
                return list;
            },
            _removeFromHash: function (child) {
                var parent = this,
                    children = parent[CHILDREN];
                if (!children || !child) {
                    return;
                }
                // remove the child from the children hash
                children.remove(child);
                parent[CHILDREN].unRegister(ID, child.id);
                // unregister from the child hash keys
                parent[CHILDREN].unRegister(child.uniqueKey, child[child.uniqueKey]);
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
                    childMethodName = upCase(camelCase('on:bubble:' + name, ':')),
                    // onMethod = isFunction(origin[methodName]),
                    evnt = evnt_ || origin._createEvent(name, data),
                    parents = origin._collectParents(),
                    i = parents[LENGTH] - 1;
                // should all be BOOLEAN_TRUE the first time around
                while (origin && origin._eventDispatcher && !evnt.isStopped()) {
                    origin._eventDispatcher(evnt);
                    origin = !evnt.isStopped() && evnt.bubbles && origin[PARENT];
                }
                evnt.finished();
                return evnt;
            },
            _remove: function (model) {
                // cache the parent
                var parent = this;
                // let everyone know that this object is about to be removed
                model[DISPATCH_EVENT](BEFORE_COLON + REMOVED);
                // notify the child that the remove pipeline is starting
                // remove the parent events
                parent._unDelegateParentEvents(model);
                // have parent remove it's child events
                parent._unDelegateChildEvents(model);
                // attach events from parent
                parent._removeFromHash(model);
                // void out the parent member tied directly to the model
                model[PARENT] = blank;
                // let everyone know that you've offically separated
                model[DISPATCH_EVENT](REMOVED);
                // notify the child that the remove pipeline is done
                return model;
            },
            remove: function (idModel_) {
                var parent = this,
                    children = parent[CHILDREN],
                    retList = Collection(),
                    args = toArray(arguments).splice(1),
                    idModel = idModel_;
                if (!isObject(idModel)) {
                    // it's a string
                    idModel = parent[CHILDREN].get(ID, idModel + '');
                }
                if (!idModel || !isObject(idModel)) {
                    return retList;
                }
                if (isInstance(idModel, Collection)) {
                    idModel = idModel[UNWRAP]();
                }
                if (!isArray(idModel)) {
                    idModel = [idModel];
                }
                duff(idModel, function (model) {
                    parent._remove(model);
                    retList.add(model);
                });
                if (retList[LENGTH]()) {
                    parent[DISPATCH_EVENT](CHILD + ':' + REMOVED);
                }
                return retList;
            },
            /**
             * @description removes pointers from parent
             * @func
             * @name Box#destroy
             * @returns {Box} instance
             */
            _destroy: function () {
                var box = this,
                    // removes all parent / parent's child listeners
                    removeRet = box[PARENT] && box[PARENT].remove(box);
                // destroys it's children
                box.resetChildren();
            },
            /**
             * @description basic sort function
             * @param {Function|String} comparator - argument to sort children against
             * @returns {Box} instance
             * @func
             * @name Box#sort
             */
            sort: function (comparator_) {
                var compString, isReversed, model = this,
                    children = model[CHILDREN],
                    comparator = comparator_ || result(model, 'comparator');
                if (isString(comparator)) {
                    isReversed = comparator[0] === '!';
                    compString = comparator;
                    if (isReversed) {
                        compString = comparator.slice(1);
                    }
                    comparator = function (a, b) {
                        var val_, val_A = a.get(compString),
                            val_B = b.get(compString);
                        if (isReversed) {
                            val_ = val_B - val_A;
                        } else {
                            val_ = val_A - val_B;
                        }
                        return val_;
                    };
                }
                model[DISPATCH_EVENT](BEFORE_COLON + SORT, model);
                children[SORT](comparator);
                model[DISPATCH_EVENT](SORT, model);
                return model;
            }
        }, BOOLEAN_TRUE);
    modelMaker.constructor = Box;
});
application.scope(function (app) {
    var blank, _ = app._,
        factories = _.factories,
        Box = factories.Box,
        Collection = factories.Collection,
        isFunction = _.isFunction,
        extend = _.extend,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        PARENT = 'parent',
        STOP = 'stop',
        START = 'start',
        _EXTRA_MODULE_ARGS = '_extraModuleArgs',
        startableMethods = {
            start: function (evnt) {
                var startable = this;
                if (!startable.started) {
                    startable.dispatchEvent('before:' + START, evnt);
                    startable.started = BOOLEAN_TRUE;
                    startable.dispatchEvent(START, evnt);
                }
                return startable;
            },
            stop: function (evnt) {
                var startable = this;
                if (startable.started) {
                    startable.dispatchEvent('before:' + STOP, evnt);
                    startable.started = BOOLEAN_FALSE;
                    startable.dispatchEvent(STOP, evnt);
                }
                return startable;
            },
            toggle: function () {
                var startable = this;
                if (startable.started) {
                    startable[STOP](evnt);
                } else {
                    startable[START](evnt);
                }
                return startable;
            }
        },
        Startable = factories.Box.extend('Startable', startableMethods, BOOLEAN_TRUE),
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
        // moduleHandler = ,
        // moduleRunner = ,
        moduleMethods = extend({}, startableMethods, {
            // idAttribute: 'name',
            module: function (name_, fn) {
                var modules, attrs, parentIsModule, nametree, parent = this,
                    originalParent = parent,
                    name = name_,
                    globalname = name,
                    namespace = name.split('.'),
                    module = parent.modules.get(name_);
                while (namespace.length > 1) {
                    parent = parent.module(namespace[0]);
                    namespace.shift();
                }
                modules = parent.modules;
                name = namespace.join('.');
                module = parent.modules.get(name);
                if (!module) {
                    parentIsModule = _.isInstance(parent, Module);
                    if (parentIsModule) {
                        namespace.unshift(globalname);
                    }
                    namespace = namespace.join('.');
                    module = Module({
                        id: name,
                        globalname: namespace
                    }, {
                        application: app,
                        parent: parent
                    });
                    if (module.topLevel()) {
                        modules.add(module);
                    } else {
                        parent.add(module);
                    }
                    modules.register(name, module);
                    app.modules.register(globalname, module);
                }
                if (!module.hasInitialized && isFunction(fn)) {
                    module.hasInitialized = BOOLEAN_TRUE;
                    module.handler(fn);
                }
                return module;
            },
            run: function (fn) {
                var module = this;
                fn.apply(module, module.createArguments());
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
            createArguments: function () {
                return [this].concat(this.application.createArguments());
            },
            constructor: function (attrs, opts) {
                var module = this;
                module.application = opts.application;
                module.handlers = Collection();
                factories.Messenger(this);
                module.modules = Collection();
                Box.constructor.apply(this, arguments);
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
            },
            handler: function (fn) {
                var module = this;
                module.handlers.push(fn);
                module.run(fn);
                return module;
            }
        }),
        Module = factories.Box.extend('Module', moduleMethods, BOOLEAN_TRUE),
        appextendresult = app.extend(extend({}, factories.Events.constructor.prototype, moduleMethods, {
            _extraModuleArgs: [],
            children: Collection(),
            // module: moduleHandler,
            modules: Collection(),
            /**
             * @func
             * @name Specless#baseModuleArguments
             * @returns {Array} list of base arguments to apply to submodules
             */
            baseModuleArguments: function () {
                var app = this;
                return [app, app._, app._ && app._.factories];
            },
            /**
             * @func
             * @name Specless#addModuleArgs
             * @param {Array} arr - list of arguments that will be added to the extraModule args list
             * @returns {Specless} instance
             */
            addModuleArgs: function (arr) {
                var app = this;
                app._.addAll(app[_EXTRA_MODULE_ARGS], arr);
                return app;
            },
            /**
             * @func
             * @name Specless#removeModuleArgs
             * @param {Array} arr - list of objects or functions that will be removed from the extraModuleArgs
             * @returns {Specless} instance
             */
            removeModuleArgs: function (arr) {
                this.utils.removeAll(this[_EXTRA_MODULE_ARGS], arr);
                return this;
            },
            /**
             * @func
             * @name Specless#createArguments
             * @returns {Object[]}
             */
            createArguments: function () {
                return this.baseModuleArguments().concat(this[_EXTRA_MODULE_ARGS]);
            },
            require: function (modulename) {
                var module = this.module(modulename);
                return module.getExports();
            }
        }));
});
application.scope().module('Looper', function (module, app, _, factories) {
    'use strict';
    var blank, x = 0,
        lastTime = 0,
        LENGTH = 'length',
        isFunction = _.isFunction,
        isNumber = _.isNumber,
        pI = _.pI,
        posit = _.posit,
        nowish = _.now,
        gapSplit = _.gapSplit,
        win = window,
        vendors = gapSplit('ms moz webkit o'),
        REQUEST_ANIMATION_FRAME = 'requestAnimationFrame',
        allLoopers = [],
        runningLoopers = [],
        bind = _.bind,
        duff = _.duff,
        remove = _.remove,
        removeAll = _.removeAll,
        duffRev = _.duffRev,
        extend = _.extend,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        running = BOOLEAN_FALSE,
        setup = function () {
            running = BOOLEAN_TRUE;
            win[REQUEST_ANIMATION_FRAME](function (time) {
                duff(runningLoopers, function (looper) {
                    looper.run(time);
                });
                teardown();
            });
        },
        teardown = function () {
            duffRev(runningLoopers, function (looper, idx) {
                if (looper.halted() || looper.stopped() || looper.destroyed() || !looper.length()) {
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
                win.cancelAnimationFrame = win[vendors[x] + 'CancelAnimationFrame'] || win[vendors[x] + 'CancelRequestAnimationFrame'];
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
            if (!win.cancelAnimationFrame) {
                win.cancelAnimationFrame = function (id) {
                    win.clearTimeout(id);
                };
            }
        }()),
        Looper = factories.Model.extend('Looper', {
            constructor: function (_runner) {
                var fns, stopped = BOOLEAN_FALSE,
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
                extend(looper, {
                    length: function () {
                        return fnList[LENGTH];
                    },
                    destroy: function () {
                        destroyed = BOOLEAN_TRUE;
                        remove(allLoopers, this);
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
                        duff(fnList, function (fnObj) {
                            if (!posit(removeList, fnObj)) {
                                if (!fnObj.disabled && !halted) {
                                    running = fnObj;
                                    fnObj.fn(_nowish);
                                }
                            } else {
                                removeLater.push(fnObj);
                            }
                        });
                        running = BOOLEAN_FALSE;
                        combineAdd();
                        removeAll(fnList, removeList.concat(removeLater));
                        removeList = [];
                    },
                    remove: function (id) {
                        var ret, fnObj, i = 0;
                        if (!arguments[LENGTH]) {
                            if (running) {
                                id = running.id;
                            }
                        }
                        if (isNumber(id)) {
                            for (; i < fnList[LENGTH] && !ret; i++) {
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
            tween: function (time, fn_) {
                var fn, added = nowish();
                if (!time) {
                    time = 0;
                }
                if (!isFunction(fn)) {
                    return;
                }
                fn = this.bind(fn_);
                return this.interval(0, function (ms) {
                    var tween = 1,
                        diff = ms - added;
                    if (diff >= time) {
                        tween = 0;
                        this.remove();
                    }
                    fn(ms, Math.min(1, (diff / time)), !tween);
                });
            },
            time: function (time, fn_) {
                var fn;
                if (!isFunction(fn)) {
                    return this;
                }
                fn = this.bind(fn_);
                return this.interval(time, function (ms) {
                    this.remove();
                    fn(ms);
                });
            },
            frameRate: function (time, fn_, min) {
                var fn, tween = this,
                    minimum = Math.min(min || 0.8, 0.8),
                    expectedFrameRate = 30 * minimum,
                    lastDate = 1,
                    lastSkip = nowish();
                time = time || 125;
                if (!isFunction(fn_)) {
                    return tween;
                }
                fn = bind(fn_, this);
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
                        fn(ms);
                    }
                    lastDate = ms;
                });
            },
            interval: function (time, fn_) {
                var fn, last = nowish();
                if (!isFunction(fn)) {
                    return;
                }
                if (!time) {
                    time = 0;
                }
                fn = this.bind(fn);
                return this.add(function (ms) {
                    if (ms - time >= last) {
                        last = ms;
                        fn(ms);
                    }
                });
            }
        }, !0);
    _.exports({
        AF: new Looper()
    });
});
application.scope().module('Promise', function (module, app, _, factories) {
    var blank, LENGTH = 'length',
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
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        NULL = null,
        when = function () {
            var promise = factories.Promise();
            promise.add(foldl(flatten(arguments), function (memo, pro) {
                if (promise._isChildType(pro)) {
                    memo.push(pro);
                }
                return memo;
            }, []));
            return promise;
        },
        dispatch = function (promise, name, opts) {
            var shouldstop, finalName = name,
                allstates = result(promise, ALL_STATES),
                collected = [];
            while (!shouldstop) {
                if (indexOf(collected, finalName) === -1) {
                    collected.push(finalName);
                    promise.executeHandlers(finalName);
                    finalName = allstates[finalName];
                } else {
                    finalName = BOOLEAN_FALSE;
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
        Promise = factories.Box.extend('Promise', {
            addState: addState,
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
                    error: ALWAYS,
                    always: BOOLEAN_TRUE
                };
            },
            constructor: function () {
                var promise = this;
                factories.Box.constructor.call(promise);
                promise.restart();
                // cannot have been resolved in any way yet
                intendedObject(extend({}, result(promise, 'baseStates'), result(promise, 'associativeStates')), NULL, bind(addState, promise));
                // add passed in success handlers
                promise.success(arguments);
                return promise;
            },
            check: function () {
                var notSuccessful, resolveAs, parent = this,
                    children = parent.children,
                    argumentAggregate = [];
                if (children.length() && !children.find(function (child) {
                    notSuccessful = notSuccessful || child.state() !== SUCCESS;
                    argumentAggregate.push(child.get(STASHED_ARGUMENT));
                    return !child.resolved();
                })) {
                    parent.resolveAs(notSuccessful ? FAILURE : SUCCESS, argumentAggregate);
                }
            },
            _isChildType: function (promise) {
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
            isFulfilled: stateChecker(SUCCESS),
            isRejected: stateChecker(FAILURE),
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
                if (!handlers || !handlers[LENGTH]) {
                    return promise;
                }
                countLimit = handlers[LENGTH];
                promise.set(IS_EMPTYING, BOOLEAN_TRUE);
                while (handlers[0] && --countLimit >= 0) {
                    handler = handlers.shift();
                    // should already be bound
                    handler(arg);
                }
                promise.set(IS_EMPTYING, BOOLEAN_FALSE);
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
            }
        }, BOOLEAN_TRUE);
    _.exports({
        when: when
    });
});
application.scope().module('Ajax', function (module, app, _, factories) {
    var gapSplit = _.gapSplit,
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
        isObject = _.isObject,
        isArray = _.isArray,
        stringify = _.stringify,
        parse = _.parse,
        extend = _.extend,
        stringifyQuery = _.stringifyQuery,
        validTypes = gapSplit('GET POST PUT DELETE'),
        baseEvents = gapSplit('progress timeout abort error'),
        cache = {},
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
        sendthething = function (xhrReq, args) {
            return function () {
                wraptry(function () {
                    xhrReq.send.apply(xhrReq, args);
                }, function (e) {
                    // handle an xhr req send error here
                    factories.reportError('xhr', e + '');
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
            setTimeout(sendthething(xhrReq, args));
        },
        /**
         * @class Ajax
         * @alias factories.Ajax
         * @augments Box
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
                if (typeof XDomainRequest !== 'undefined') {
                    xhrReq = new XDomainRequest();
                    method = 'onload';
                }
                if (!_.isObject(str)) {
                    str = str || '';
                    type = 'GET';
                    typeThing = str.toUpperCase();
                    if (posit(validTypes, typeThing)) {
                        type = typeThing;
                    } else {
                        url = str;
                    }
                    str = {
                        url: url || '',
                        type: type
                    };
                }
                str.async = BOOLEAN_TRUE;
                str.type = (str.type || 'GET').toUpperCase();
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
                type: key,
                url: url
            });
        };
        return memo;
    }, {}));
});
application.scope().module('Associator', function (module, app, _, factories) {
    /**
     * @class Associator
     * @augments Model
     */
    var blank, DATA = 'data',
        ITEMS = 'items',
        LENGTH = 'length',
        DATASET = DATA + 'set',
        IS_ELEMENT = 'isElement',
        INDEX_OF = 'indexOf',
        __ELID__ = '__elid__',
        BOOLEAN_TRUE = !0,
        extend = _.extend,
        isObject = _.isObject,
        removeAt = _.removeAt,
        Associator = factories.Model.extend('Associator', {
            /**
             * @func
             * @name Associator#get
             * @param {Object} obj - object that data is being gotten against in the Associator
             * @param {String} [type] - toString version of the object being passed in
             */
            get: function (obj, type) {
                var returnData, idxOf, dataset, n, key, instance = this,
                    canRead = 0,
                    data = {
                        dataset: {}
                    },
                    current = instance.sameType(obj),
                    els = current[ITEMS] = current[ITEMS] || [],
                    eldata = current[__ELID__] = current[__ELID__] || {},
                    dataArray = current[DATA] = current[DATA] || [];
                if (obj && current.readData) {
                    dataset = obj[DATASET];
                    key = obj[__ELID__] = obj[__ELID__] || _.uniqueId('el');
                    if (key) {
                        data = eldata[key] = eldata[key] = {};
                    }
                    // copy dataset over from one to the other
                    if (isObject(dataset) && _[IS_ELEMENT](obj)) {
                        data[DATASET] = extend(data[DATASET], dataset);
                    }
                    return data;
                } else {
                    idxOf = current[ITEMS][INDEX_OF](obj);
                    if (idxOf === blank || idxOf === -1) {
                        idxOf = current[ITEMS][LENGTH];
                        current[ITEMS].push(obj);
                        dataArray[idxOf] = data;
                    }
                    return dataArray[idxOf];
                }
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
                var type = this.sameType(el),
                    idx = _[INDEX_OF](type[ITEMS], el),
                    ret = removeAt(type[DATA], idx);
                removeAt(type[ITEMS], idx);
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
                    current = instance[type] = instance[type] || {},
                    lowerType = type.toLowerCase(),
                    globalindex = lowerType[INDEX_OF]('global');
                // skip reading data
                if (globalindex === -1 && lowerType[INDEX_OF]('window') === -1) {
                    current.readData = BOOLEAN_TRUE;
                }
                return current;
            }
        }, BOOLEAN_TRUE);
    _.exports({
        associator: factories.Associator()
    });
});
application.scope().module('DOMM', function (module, app, _, factories) {
    var blank, sizzleDoc = document,
        eq = _.eq,
        once = _.once,
        elementData = _.associator,
        result = _.result,
        uniqueId = _.uniqueId,
        isFunction = _.isFunction,
        Collection = factories.Collection,
        wraptry = _.wraptry,
        now = _.now,
        each = _.each,
        bind = _.bind,
        duff = _.duff,
        find = _.find,
        wrap = _.wrap,
        trace = _.trace,
        posit = _.posit,
        foldl = _.foldl,
        filter = _.filter,
        isString = _.isString,
        isObject = _.isObject,
        isNumber = _.isNumber,
        isBoolean = _.isBoolean,
        stringify = _.stringify,
        parse = _.parse,
        isArrayLike = _.isArrayLike,
        objectMatches = _.matches,
        merge = _.merge,
        console = _.console,
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
        clone = _.clone,
        units = _.units,
        gapSplit = _.gapSplit,
        camelCase = _.camelCase,
        unCamelCase = _.unCamelCase,
        parseDecimal = _.parseDecimal,
        add = _.add,
        removeAll = _.removeAll,
        addAll = _.addAll,
        NODE_TYPE = 'nodeType',
        PARENT_NODE = 'parentNode',
        LENGTH = 'length',
        ITEMS = '_items',
        DELEGATE_COUNT = '__delegateCount',
        REMOVE_QUEUE = 'removeQueue',
        ADD_QUEUE = 'addQueue',
        CLASSNAME = 'className',
        DEFAULT_VIEW = 'defaultView',
        WINDOW = 'window',
        DOCUMENT = 'document',
        CLASS = 'class',
        STYLE = 'style',
        BODY = 'body',
        TOP = 'top',
        LEFT = 'left',
        RIGHT = 'right',
        BOTTOM = 'bottom',
        WIDTH = 'width',
        HEIGHT = 'height',
        INDEX = 'index',
        INNER_HEIGHT = 'innerHeight',
        INNER_WIDTH = 'innerWidth',
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        NULL = null,
        win = window,
        devicePixelRatio = (win.devicePixelRatio || 1),
        ua = navigator.userAgent,
        isElement = function (object) {
            return !!(object && isNumber(object[NODE_TYPE]) && object[NODE_TYPE] === object.ELEMENT_NODE);
        },
        /**
         * @private
         * @func
         */
        isWindow = function (obj) {
            return obj && obj === obj[WINDOW];
        },
        /**
         * @private
         * @func
         */
        isDocument = function (obj) {
            return obj && isNumber(obj[NODE_TYPE]) && obj[NODE_TYPE] === obj.DOCUMENT_NODE;
        },
        isFragment = function (frag) {
            return frag && frag[NODE_TYPE] === sizzleDoc.DOCUMENT_FRAGMENT_NODE;
        },
        getClosestWindow = function (windo_) {
            var windo = windo_ || win;
            return isWindow(windo) ? windo : (windo && windo[DEFAULT_VIEW] ? windo[DEFAULT_VIEW] : (windo.ownerGlobal ? windo.ownerGlobal : $(windo).parent(WINDOW)[INDEX](0) || win));
        },
        getComputed = function (el, ctx) {
            var ret = getClosestWindow(ctx).getComputedStyle(el);
            return ret ? ret : getClosestWindow(el).getComputedStyle(el) || clone(el[STYLE]) || {};
        },
        allStyles = getComputed(sizzleDoc[BODY], win),
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
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
                img.onload = emptyqueue(_.noop);
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
        saveDOMContentLoadedEvent = function (doc) {
            var data = elementData.get(doc);
            if (data.isReady === blank) {
                data.isReady = BOOLEAN_FALSE;
                DOMM(doc).on('DOMContentLoaded', function (e) {
                    data.DOMContentLoadedEvent = e;
                    data.isReady = BOOLEAN_TRUE;
                });
            }
        },
        _DOMM = factories._DOMM = function (doc) {
            saveDOMContentLoadedEvent(doc);
            return function (sel, ctx) {
                return DOMM(sel, ctx || doc);
            };
        },
        setAttribute = function (el, key, val_) {
            var val = val_;
            if (val === BOOLEAN_TRUE) {
                val = '';
            } else {
                val = stringify(val);
            }
            val += '';
            el.setAttribute(key, val);
        },
        getAttribute = function (el, key, val) {
            var converted;
            val = parse(el.getAttribute(key));
            val = +val == val ? +val : val;
            if (val === '') {
                val = BOOLEAN_TRUE;
            }
            if (isBlank(val)) {
                val = BOOLEAN_FALSE;
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
        getClassName = function (el, key) {
            var className = el[CLASSNAME];
            if (!isString(className)) {
                className = getAttribute(el, CLASS);
            }
            return (className || '').split(' ');
        },
        setClassName = function (el, val) {
            var value = val.join(' ').trim();
            if (isString(el[CLASSNAME])) {
                el[CLASSNAME] = value;
            } else {
                setAttribute(el, CLASS, value);
            }
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
            duff(matches, function (match) {
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
        ALL_EVENTS_HASH = wrap(AllEvents, BOOLEAN_TRUE),
        knownPrefixesHash = wrap(knownPrefixes, BOOLEAN_TRUE),
        /**
         * @private
         * @func
         */
        // changeClass = function (el, remove, add) {
        //     var subdata = queuedata.className.get(el);
        //     queuedata.className.remove(el, remove, subdata);
        //     queuedata.className.add(el, add, subdata);
        // },
        changeClass = function (el, remove, add) {
            var n, val, command, classList;
            if (el) {
                classList = getClassName(el);
                if (remove) {
                    removeAll(classList, gapSplit(remove));
                }
                if (add) {
                    addAll(classList, gapSplit(add));
                }
                // val = gapJoin(classList).trim();
                setClassName(el, classList);
                return el;
            }
        },
        // removeClass = function (el, remove) {
        //     var subdata = queuedata.className.get(el);
        //     queuedata.className.remove(el, remove, subdata);
        // },
        // addClass = function (el, add) {
        //     var subdata = queuedata.className.get(el);
        //     queuedata.className.add(el, add, subdata);
        // },
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
        ensureDOM = function (fn) {
            return function (el) {
                if (isElement(el)) {
                    fn(el);
                }
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
                marginTop = parseFloat(computedStyle.marginTop),
                marginLeft = parseFloat(computedStyle.marginLeft),
                marginRight = parseFloat(computedStyle.marginRight),
                marginBottom = parseFloat(computedStyle.marginBottom);
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
                if (!isObject(el)) {
                    return;
                }
                if (isBoolean(key)) {
                    key = el;
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
                        for (j = 0; j < prefixes[LENGTH]; j++) {
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
                if (isElement(el)) {
                    el = [el];
                }
                if (!count) {
                    if (isElement(firstEl)) {
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
            var ensuredDom;
            if (els[LENGTH]) {
                ensuredDom = ensureDOM(function (el) {
                    el[STYLE][key] = value;
                });
                intendedObject(key, value, function (key, value_) {
                    var value = convertStyleValue(value_);
                    duff(els, ensuredDom);
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
            var ret = {};
            if (isElement(item)) {
                ret = item.getBoundingClientRect();
            }
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
            return +(str.split(unit || 'px').join('').trim()) || 0;
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
                return val / getStyleSize(el, 'fontSize', win);
            },
            mm: function (val, el, win, styleAttr) {
                return val / 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                var mult = Math.min(win[INNER_HEIGHT], win[INNER_WIDTH]);
                return (val / mult) * 100;
            },
            rem: function (val, el, win, styleAttr) {
                return val / getStyleSize(win[DOCUMENT][BODY][PARENT_NODE], 'fontSize', win);
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
                return getStyleSize(el, 'fontSize') * val;
            },
            mm: function (val, el, win, styleAttr) {
                return val * 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                return ((Math.min(win[INNER_HEIGHT], win[INNER_WIDTH]) || 1) * val / 100);
            },
            rem: function (val, el, win, styleAttr) {
                return getStyleSize(win[DOCUMENT][BODY][PARENT_NODE], 'fontSize') * val;
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
            number = +(str.split(unit).join('')) || 0;
            if (unitToNumber[unit]) {
                number = unitToNumber[unit](number, el, winTop, styleAttr) || 0;
            }
            return number;
        },
        /**
         * @private
         * @func
         */
        containsClass = function (el, className) {
            var original = getClassName(el),
                nuClasses = gapSplit(className),
                nuClassesLen = nuClasses[LENGTH],
                i = 0,
                has = 0;
            for (; i < nuClassesLen; i++) {
                if (posit(original, nuClasses[i])) {
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
        isTrustedEvent = function (name) {
            return (indexOf(trustedEvents, name) !== -1);
        },
        /**
         * @private
         * @func
         */
        createElement = function (str) {
            return sizzleDoc.createElement(str);
        },
        makeEmptyFrame = function (str) {
            var frame, div = createElement('div');
            div.innerHTML = str;
            frame = div.children[0];
            return $(frame);
        },
        makeTree = function (str) {
            var div = createElement('div');
            div.innerHTML = str;
            return $(div.children).remove().unwrap();
        },
        /**
         * @private
         * @func
         */
        matches = function (element, selector) {
            var match, parent, temp, matchesSelector;
            if (!selector || !element || element[NODE_TYPE] !== 1) {
                return BOOLEAN_FALSE;
            }
            matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
            if (matchesSelector) {
                return matchesSelector.call(element, selector);
            }
            // fall back to performing a selector:
            parent = element[PARENT_NODE];
            temp = !parent;
            if (temp) {
                parent = createElement('div');
                parent.appendChild(element);
            }
            // temp && tempParent.removeChild(element);
            return !!posit(Sizzle(selector, parent), element);
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
        createDocumentFragment = function () {
            return sizzleDoc.createDocumentFragment();
        },
        /**
         * @private
         * @func
         */
        createElements = function (tagName) {
            return $(foldl(gapSplit(tagName), function (memo, name) {
                memo.push(createElement(name));
                return memo;
            }, []));
        },
        fragment = function (el) {
            var frag;
            if (isFragment(el)) {
                frag = el;
            } else {
                frag = createDocumentFragment();
                $(el).duff(ensureDOM(function (el) {
                    frag.appendChild(el);
                }));
            }
            return frag;
        },
        // createElements = function (arr, tag, style, props, attrs) {
        //     var frag = createDocumentFragment();
        //     map(arr, function (str) {
        //         var div = createElement(tag || 'div');
        //         div.innerHTML = str;
        //         each(style, function (key, val) {
        //             div[STYLE][key] = val;
        //         });
        //         each(props, function (key, val) {
        //             div[key] = val;
        //         });
        //         each(attrs, function (key, val) {
        //             attributeInterface(div, key, val);
        //         });
        //         frag.appendChild(div);
        //     });
        //     return frag;
        // },
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
                    list = domm.unwrap();
                idxChange = _idxChange || idxChange;
                if (idxChange) {
                    duff(list, function (idx_, el) {
                        var parent = el[PARENT_NODE],
                            idx = (indexOf(parent.children, el) + idxChange),
                            item = parent.children[idx];
                        if (item && !posit(list, item)) {
                            add(collected, item);
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
                    domList = dom.unwrap();
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
                if (dataKeys[LENGTH] === 1) {
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
            if (isString(args[0]) || isBlank(args[0])) {
                selector = args.shift();
            }
            if (isFunction(args[0])) {
                fn = bind(fn, domm);
                fun = args[0];
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
                if (this[LENGTH]()) {
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
            return !isString(evnt) ? evnt : {
                type: evnt,
                bubbles: BOOLEAN_FALSE,
                eventPhase: 2,
                cancelable: BOOLEAN_FALSE,
                defaultPrevented: BOOLEAN_FALSE,
                data: '',
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
            if (eventPhase === 2 && !evnt.bubbles && isElement(evnt.srcElement)) {
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
        getMainHandler = function (data, name, capturing) {
            return data.handlers[capturing + ':' + name];
        },
        eventDispatcher = function (el, e, args, list) {
            var $el = DOMM(el);
            return find(list, function (obj) {
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
                            mainHandler.currentEvent = NULL;
                            return;
                        }
                    }
                    obj.fn.apply(ctx || $el, args);
                }
                if (!obj.persist) {
                    // puts it on the event queue
                    removeEventQueue(obj);
                }
                e.currentTarget = originalTarget;
                mainHandler.currentEvent = NULL;
                return e.isImmediatePropagationStopped;
            });
        },
        dispatchEvent = function (el, evnt_, capturing, data, args, selector) {
            var e, gah, list, capturingStack, events, stack, currentEventStack, selectorIsString, mainHandler, eventType, removeStack, $el, matches = 1,
                evnt = validateEvent(evnt_, el);
            if (!evnt || !evnt.type) {
                return;
            }
            capturing = !!capturing;
            if (!_.isObject(data)) {
                data = elementData.get(el);
            }
            events = data.events;
            capturingStack = events[capturing];
            if (!capturingStack) {
                return;
            }
            eventType = evnt.type;
            list = capturingStack[eventType];
            mainHandler = getMainHandler(data, eventType, capturing);
            if (!mainHandler) {
                return;
            }
            removeStack = mainHandler[REMOVE_QUEUE];
            e = new Event(evnt, el);
            args = [e].concat(args || []);
            wraptry(function () {
                eventDispatcher(el, e, args, list);
            }, function () {
                console.trace(e);
            });
            duffRev(removeStack, removeEventQueue);
            while (mainHandler[ADD_QUEUE][LENGTH]) {
                addEventQueue(mainHandler[ADD_QUEUE][0]);
                gah = mainHandler[ADD_QUEUE].shift();
            }
        },
        matchesHandler = function (handler, obj) {
            return !handler || obj.fn === handler;
        },
        _eventExpander = wrap({
            ready: 'DOMContentLoaded',
            deviceorientation: 'deviceorientation mozOrientation',
            fullscreenalter: 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange',
            hover: 'mouseenter mouseleave',
            forcetouch: 'webkitmouseforcewillbegin webkitmouseforcedown webkitmouseforceup webkitmouseforcechanged'
        }, function (val) {
            return gapSplit(val);
        }),
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
            var dom = this;
            if (!isFunction(callback)) {
                return dom;
            }
            dom.duff(function (el) {
                _addEventListener(el, name, namespace, selector, callback, capture);
            });
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
                        currentEvent: NULL,
                        capturing: capture
                    };
                    el.addEventListener(name, eventHandler, capture);
                }
                attach = find(namespaceCache, function (obj) {
                    // remove any duplicates
                    if (fn === obj.fn && obj.namespace === namespace && selector === obj.selector) {
                        return BOOLEAN_TRUE;
                    }
                });
                if (attach) {
                    return;
                }
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
            }));
        },
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
                    idx = idx === blank ? list.indexOf(obj) : idx;
                    if (idx + 1) {
                        if (selector) {
                            mainHandler[DELEGATE_COUNT]--;
                        }
                        gah = list.splice(idx, 1);
                    }
                    obj.list = NULL;
                }
            } else {
                if (obj.persist) {
                    mainHandler[REMOVE_QUEUE].push(obj);
                }
            }
            obj.persist = BOOLEAN_FALSE;
        },
        ensureHandlers = function (fn) {
            return function (name) {
                // var args = toArray(arguments);
                var args = ['', blank, []],
                    origArgs = filter(arguments, negate(isBlank)),
                    argLen = origArgs[LENGTH];
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
                return fn.apply(this, args);
            };
        },
        removeEventListener = ensureHandlers(expandEventListenerArguments(function (name, namespace, selector, handler, capture) {
            this.duff(function (el) {
                _removeEventListener(el, name, namespace, selector, handler, capture);
            });
        })),
        removeEvent = function (obj) {
            var mainHandler = obj.mainHandler;
            if (obj.selector) {
                mainHandler[DELEGATE_COUNT] = Math.max(mainHandler[DELEGATE_COUNT] - 1, 0);
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
                    if (!evnt.which && button !== blank) {
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
                i = copy[LENGTH];
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
                if (target[NODE_TYPE] === 3) {
                    evnt.target = target[PARENT_NODE];
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
                return evnt;
            }
        },
        Event = factories.Model.extend('Event', {
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
        createDomFilter = function (filtr) {
            var filter;
            if (isFunction(filtr)) {
                filter = filtr;
            } else {
                if (isObject(filtr)) {
                    filter = objectMatches(filtr);
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
                        } else {
                            filter = function () {
                                return BOOLEAN_TRUE;
                            };
                        }
                    }
                }
            }
            return filter;
        },
        domFilter = function (items, filtr) {
            var filter = createDomFilter(filtr);
            return _.filter(items, filter);
        },
        dimFinder = function (element, doc, win) {
            return function (num) {
                var ret, el = this[INDEX](num);
                if (isElement(el)) {
                    ret = clientRect(el)[element];
                } else {
                    if (isDocument(el) && el[BODY]) {
                        ret = el[BODY][doc];
                    } else {
                        if (isWindow(el)) {
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
            duff(dom.unwrap(), function (el) {
                if (passedString) {
                    duff(Sizzle(str, el), function (el) {
                        matchers.push(el);
                    });
                } else {
                    matchers.push(el);
                }
            });
            return matchers;
        }),
        canBeProcessed = function (item) {
            return isElement(item) || isWindow(item) || isDocument(item) || isFragment(item);
        },
        append = function (el) {
            var dom = this,
                firstEl = dom.first();
            if (firstEl) {
                firstEl.appendChild(fragment(el));
            }
            return dom;
        },
        DOMM = factories.DOMM = factories.Collection.extend('DOMM', extend({
            /**
             * @func
             * @name DOMM#constructor
             * @param {String | Node | Function} str - string to query the dom with, or a function to run on document load, or an element to wrap in a DOMM instance
             * @returns {DOMM} instance
             */
            constructor: function (str, ctx) {
                var i, els, handler, elsLen, $doc, docEl, docData, dom = this;
                dom.context = ctx || win[DOCUMENT];
                if (isFunction(str)) {
                    if (isDocument(ctx)) {
                        $doc = $(ctx);
                        docEl = $doc[INDEX]();
                        docData = elementData.get(docEl);
                        handler = bind(str, $doc);
                        if (docData.isReady) {
                            // make it async
                            _.AF.once(function () {
                                handler($, docData.DOMContentLoadedEvent);
                            });
                            els = dom.unwrap();
                        } else {
                            dom = $doc.on('DOMContentLoaded', function (e) {
                                handler($, e);
                            });
                            els = dom.unwrap();
                        }
                    }
                } else {
                    if (isString(str)) {
                        if (str[0] === '<') {
                            els = makeTree(str);
                        } else {
                            els = Sizzle(str, ctx);
                        }
                    } else {
                        els = str;
                        if (!isArray(els) && canBeProcessed(els)) {
                            els = [els];
                        }
                    }
                }
                Collection.constructor.call(dom, els);
                return dom;
            },
            /**
             * @func
             * @name DOMM#isWin
             * @description asks if the first or specified index of the object is a window type object
             * @returns {Boolean}
             */
            isWindow: function (num) {
                return isWindow(this[INDEX](num || 0) || {});
            },
            isElement: function (num) {
                return isElement(this[INDEX](num || 0) || {});
            },
            /**
             * @func
             * @name DOMM#isDoc
             * @description asks if the first or specified index of the object is a document type object
             * @returns {Boolean}
             */
            isDocument: function (num) {
                return isDocument(this[INDEX](num || 0) || {});
            },
            isFragment: function (num) {
                return isFragment(this[INDEX](num || 0) || {});
            },
            fragment: function (el) {
                return fragment(el || (this && this[ITEMS]));
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
                    items = dom.unwrap(),
                    filter = createDomFilter(eq);
                return foldl(items, function (memo, el) {
                    return foldl(el.children || el.childNodes, function (memo, child, idx, children) {
                        if (filter(child, idx, children)) {
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
            wipeEvents: function () {
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
                args[4] = once(function () {
                    _removeEventListener.apply(NULL, args);
                    return fn.apply(this, arguments);
                });
                _addEventListener.apply(NULL, args);
            })),
            /**
             * @func
             * @name DOMM#css
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM} instance
             */
            css: ensureOne(function (key, value) {
                var dom = this,
                    ret = css(dom.unwrap(), key, value);
                if (isBlank(ret)) {
                    ret = dom;
                }
                return ret;
            }),
            style: ensureOne(function (key, value) {
                style(this.unwrap(), key, value);
                return this;
            }),
            /**
             * @func
             * @name DOMM#allDom
             * @returns {Boolean} value indicating whether or not there were any non dom elements found in the collection
             */
            allElements: function () {
                var count = 0,
                    length = this[LENGTH](),
                    result = length && find(this.unwrap(), negate(isElement));
                return length && result === blank;
            },
            /**
             * @func
             * @name DOMM#height
             * @returns {Number} height of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            height: dimFinder(HEIGHT, 'scrollHeight', 'innerHeight'),
            /**
             * @func
             * @name DOMM#width
             * @returns {Number} width of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            width: dimFinder(WIDTH, 'scrollWidth', 'innerWidth'),
            /**
             * @func
             * @name DOMM#getStyle
             * @retuns {Object} the get computed result or a blank object if first or defined index is not a dom element and therefore cannot have a style associated with it
             */
            getStyle: function (eq) {
                var ret = {},
                    first = this.get();
                if (first && isElement(first)) {
                    ret = getComputed(first, this.context);
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
                        value = NULL;
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
                return eq(this.unwrap(), num);
            }),
            /**
             * @func
             * @name DOMM#clientRect
             * @param {Number} [num=0] - item who's bounding client rect will be assessed and extended
             * @returns {Object} hash of dimensional properties (getBoundingClientRect)
             */
            clientRect: function (num) {
                return clientRect(eq(this.unwrap(), num)[0]);
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
                if (domm[LENGTH]()) {
                    callback = bind(callback, domm);
                    duff(domm[ITEMS], function (item_, index, all) {
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
                return (dom[LENGTH]() && countLen[LENGTH] === retVals[LENGTH]);
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
                return box(this[INDEX](num), this.context);
            },
            flow: function (num) {
                return flow(this[index](num), this.context);
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
                el[STYLE].display = 'none';
            })),
            /**
             * @func
             * @name DOMM#show
             */
            show: eachProc(ensureDOM(function (el) {
                el[STYLE].display = 'block';
            })),
            /**
             * @func
             * @name DOMM#append
             */
            append: append,
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
                    frag = fragment(els),
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
                    point = point[INDEX](0);
                }
                if (!_.isElement(point)) {
                    point = NULL;
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
                var parent = el[PARENT_NODE];
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
                                rets = fn(parent[PARENT_NODE] || parent[DEFAULT_VIEW], original, next);
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
                            return [parent, isDocument(parent)];
                        },
                        window: function (parent, original, next) {
                            return [parent, isWindow(parent)];
                        },
                        iframe: function (parent, original, next) {
                            var win, found = 1;
                            if (isWindow(parent) && parent !== window[TOP]) {
                                if (parent.location.protocol.indexOf('http') === -1) {
                                    win = parent;
                                    found = 1;
                                    wraptry(function () {
                                        parent = win.frameElement;
                                        if (parent) {
                                            found = 0;
                                        }
                                    }, function () {
                                        found = 1;
                                    });
                                }
                            }
                            return [parent, (!found && parent)];
                        }
                    };
                return attachPrevious(function (original) {
                    var iterator, doDefault = 1,
                        collect = Collection();
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
                    return collect[ITEMS];
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
                    list = domm[ITEMS];
                if (_.isInstance(els, Collection)) {
                    els = els.unwrap();
                } else {
                    if (isElement(els)) {
                        els = [els];
                    }
                }
                if (els[LENGTH]) {
                    has = els[LENGTH];
                }
                find(els, function (el) {
                    if (domm.posit(el)) {
                        has--;
                    }
                });
                return has === 0 && els && els[LENGTH];
            },
            /**
             * @func
             * @name DOMM#indexOf
             * @param {Node|Array} el - element to check against the collection
             * @returns {Number} index of the element
             */
            indexOf: function (el, lookAfter) {
                if (isInstance(el, DOMM)) {
                    el = el[INDEX]();
                }
                return indexOf(this[ITEMS], el, lookAfter);
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
                    _oParent = $(oParent_),
                    children = domm.unwrap(),
                    oParent = _oParent.unwrap();
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
            serialize: function () {
                var domm = this,
                    arr = [];
                domm.each(function ($node) {
                    var node = $node[INDEX](),
                        children = $node.children().serialize(),
                        obj = {
                            tag: node.localName
                        };
                    if (children[LENGTH]) {
                        obj.children = children;
                    }
                    if (node.innerText) {
                        obj.innerText = node.innerText;
                    }
                    duff(node.attributes, function (attr) {
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
            id: BOOLEAN_FALSE,
            src: BOOLEAN_FALSE,
            checked: BOOLEAN_FALSE,
            disabled: BOOLEAN_FALSE,
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
                item = this[INDEX](str);
                if (item) {
                    return item[attr];
                }
            };
        }), wrap({
            play: 'playing',
            pause: 'paused'
        }, triggerEventWrapper), wrap(gapSplit('blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'), function (attr) {
            return triggerEventWrapper(attr);
        })), BOOLEAN_TRUE),
        Sizzle = function (str, ctx) {
            return (ctx || sizzleDoc).querySelectorAll(str);
        },
        $;
    _.exports({
        covers: covers,
        center: center,
        closer: closer,
        distance: distance,
        css: css,
        box: box,
        fragment: fragment,
        isElement: isElement,
        isWindow: isWindow,
        isDocument: isDocument,
        isFragment: isFragment,
        createElement: createElement,
        createElements: createElements,
        createDocumentFragment: createDocumentFragment,
        Sizzle: Sizzle,
        unitToNumber: unitToNumber,
        numberToUnit: numberToUnit
    });
    $ = _DOMM(sizzleDoc);
    app.addModuleArgs([$]);
});
application.scope().module('View', function (module, app, _, factories, $) {
    var blank, appVersion = app.version,
        each = _.each,
        duff = _.duff,
        Box = factories.Box,
        Collection = factories.Collection,
        isArray = _.isArray,
        isString = _.isString,
        gapSplit = _.gapSplit,
        bind = _.bind,
        map = _.map,
        has = _.has,
        clone = _.clone,
        result = _.result,
        reduce = _.reduce,
        protoProp = _.protoProp,
        isFragment = _.isFragment,
        isInstance = _.isInstance,
        isFunction = _.isFunction,
        isArrayLike = _.isArrayLike,
        reverseParams = _.reverseParams,
        intendedObject = _.intendedObject,
        createDocumentFragment = _.createDocumentFragment,
        EMPTY = '',
        INDEX = 'index',
        LENGTH = 'length',
        RENDER = 'render',
        PARENT = 'parent',
        OPTIONS = 'options',
        CHILDREN = 'children',
        IS_RENDERED = '_isRendered',
        PARENT_NODE = 'parentNode',
        CONSTRUCTOR = 'constructor',
        ESTABLISH_REGIONS = 'establishRegions',
        ESTABLISHED_REGIONS = '_establishedRegions',
        APPEND_CHILD_ELEMENTS = '_appendChildElements',
        PROTOTYPE = 'prototype',
        DISPATCH_EVENT = 'dispatchEvent',
        REGION_MANAGER = 'regionManager',
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        templates = {},
        compile = function (id, force) {
            var matches, tag, template, attrs, templates_ = templates[appVersion] = templates[appVersion] || {},
                templateFn = templates_[id];
            if (templateFn && !force) {
                return templateFn;
            }
            tag = $(id);
            template = tag.html();
            matches = template.match(/\{\{([\w\s\d]*)\}\}/mgi);
            attrs = map(matches || [], function (match) {
                return {
                    match: match,
                    attr: match.split('{{').join(EMPTY).split('}}').join(EMPTY).trim()
                };
            });
            // template = template.trim();
            templateFn = templates_[id] = function (obj) {
                var str = template,
                    cloneResult = clone(obj);
                duff(attrs, function (match) {
                    if (!cloneResult[match.attr]) {
                        cloneResult[match.attr] = EMPTY;
                    }
                    str = str.replace(match.match, cloneResult[match.attr]);
                });
                return str;
            };
            return templateFn;
        },
        makeDelegateEventKey = function (view, name) {
            return name + '.delegateEvents' + view.cid;
        },
        makeDelegateEventKeys = function (view, key, namespace) {
            if (namespace) {
                namespace = '.' + namespace;
            } else {
                namespace = EMPTY;
            }
            var viewNamespace = 'delegateEvents' + view.cid;
            return map(gapSplit(key), function (_key) {
                var __key = _key.split('.');
                if (__key[1] !== viewNamespace) {
                    __key.splice(1, 0, viewNamespace);
                    _key = __key.join('.');
                }
                return _key += namespace;
            }).join(' ');
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
                var normalizedKey = Marionette.normalizeUIString(key, ui);
                memo[normalizedKey] = val;
                return memo;
            }, {});
        },
        viewGetRegionPlacer = function (place) {
            return function (key) {
                var region, view = this,
                    regionManager = view[place] = view[place] || RegionManager();
                if (regionManager) {
                    region = regionManager.get(key);
                }
                return region;
            };
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
        View = factories.Box.extend('View', {
            /**
             * @func
             * @name View # constructor
             * @description constructor for new view object
             * @param {Object | DOMM | Node} attributes - hash with non - circular data on it. Is set later with the Box constructor
             * @param {Object} secondary - options such as defining the parent object, or the element if necessary
             * @param {DOMM|Node} el - element or Node that is attached directly to the View object
             * @returns {View} instance
             */
            tagName: 'div',
            filter: BOOLEAN_TRUE,
            getRegion: viewGetRegionPlacer(CHILDREN),
            constructor: function (attributes, secondary) {
                var model = this;
                Box[CONSTRUCTOR].apply(model, arguments);
                model._ensureElement();
                model._establishRegions();
                return model;
            },
            _ensureChildren: function () {
                this[CHILDREN] = RegionManager();
                this[CHILDREN][PARENT] = this;
            },
            $: function (selector) {
                return this.el.find(selector);
            },
            template: function (ctx) {
                return EMPTY;
            },
            _renderHTML: function () {
                var view = this,
                    innerHtml = result(view, 'template', view.toJSON());
                view.el.html(innerHtml);
            },
            _appendChildElements: function () {
                var view = this;
                view[CHILDREN].eachCall(APPEND_CHILD_ELEMENTS);
                return view;
            },
            _establishRegions: function () {
                var regionsManager, view = this,
                    regions = view[ESTABLISHED_REGIONS] = view[ESTABLISHED_REGIONS] || result(view, 'regions');
                if (!view[ESTABLISHED_REGIONS]) {
                    return;
                }
                // add regions to the region manager
                view[CHILDREN][ESTABLISH_REGIONS](regions);
            },
            render: function () {
                var view = this;
                view[IS_RENDERED] = BOOLEAN_FALSE;
                // prep the object with extra members (doc frags on regionviews,
                // list of children to trigger events on)
                // view._ensureBufferedViews();
                // request extra data or something before rendering: dom is still completely intact
                view[DISPATCH_EVENT]('before:' + RENDER);
                // unbinds and rebinds element only if it changes
                view.setElement(view.el);
                // update new element's attributes
                view._setElAttributes();
                // renders the html
                view._renderHTML();
                // gathers the ui elements
                view._bindUIElements();
                // ties regions back to newly formed parent template
                view._establishRegions();
                // console.log(view.parent.parent);
                // tie the children of the region the the region's el
                view[CHILDREN].eachCall(RENDER);
                // mark the view as rendered
                view[IS_RENDERED] = BOOLEAN_TRUE;
                // dispatch the render event
                view[DISPATCH_EVENT](RENDER);
                return view;
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
                    _elementSelector = view._elementSelector || result(view, 'el');
                if (_elementSelector) {
                    view._elementSelector = _elementSelector;
                }
                if (!isInstance(_elementSelector, factories.DOMM)) {
                    if (isString(_elementSelector)) {
                        // sets external element
                        el = _elementSelector;
                    } else {
                        // defauts back to wrapping the element
                        // creates internal element
                        el = view._createElement(result(view, 'tagName'));
                        // subclassed to expand the attributes that can be used
                    }
                    view.setElement(el);
                }
            },
            _setElAttributes: function () {
                var view = this;
                var attrs = result(view, 'elementAttributes') || {};
                if (view.className) {
                    attrs['class'] = result(view, 'className');
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
                        __events[makeDelegateEventKeys(view, key)] = map(methods, function (method, idx) {
                            return bind(view[method] || method, view);
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
                if (!el) {
                    return view;
                }
                each(bindings, function (key, methods_) {
                    var method = bind(isString(methods_) ? view[methods_] : methods_, view);
                    __events[makeDelegateEventKeys(view, key)] = method;
                });
                el.on(__events);
                return view;
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
            _bindUIElements: function () {
                var view = this,
                    _uiBindings = view._uiBindings || result(view, 'ui');
                view.ui = view.ui || {};
                if (_uiBindings) {
                    return view;
                }
                // save it to skip the result call later
                view._uiBindings = _uiBindings;
                view.ui = map(_uiBindings, function (key, selector) {
                    return view.$(selector);
                });
                return view;
            },
            _unBindUIElements: function () {
                var view = this;
                view.ui = view._uiBindings;
            },
            remove: function () {
                var el, view = this;
                Box[CONSTRUCTOR][PROTOTYPE].remove.apply(view, arguments);
                // if you were not told to select something in
                // _ensureElements then remove the view from the dom
                view.detach();
                return view;
            },
            _detachElement: function () {
                var view = this,
                    el = view.el && view.el[INDEX](0);
                if (el && el[PARENT_NODE]) {
                    el[PARENT_NODE].removeChild(el);
                }
            },
            _removeViewElement: function (el, frag) {
                var parent = this;
                if (frag) {
                    frag.appendChild(el);
                } else {
                    if (el[PARENT_NODE]) {
                        el[PARENT_NODE].removeChild(el);
                    }
                }
            },
            detach: function () {
                var view = this;
                if (view.isDetaching) {
                    return;
                }
                view.isDetaching = BOOLEAN_TRUE;
                view[DISPATCH_EVENT]('before:detach');
                view.isDetached = BOOLEAN_TRUE;
                view._detachElement();
            },
            destroy: function (opts) {
                var view = this;
                view[IS_RENDERED] = BOOLEAN_FALSE;
                view.detach();
                // remove all events
                // should internally call remove
                Box[CONSTRUCTOR][PROTOTYPE].destroy.call(view);
                return view;
            },
            rendered: function () {
                return this[IS_RENDERED];
            },
            destroyed: function () {
                return this.isDestroyed;
            }
        }, BOOLEAN_TRUE),
        _View = factories.View,
        Region = View.extend('Region', {
            Model: _View,
            _ensureElement: function () {
                this._setElement();
            },
            constructor: function (options) {
                var view = this;
                _View[CONSTRUCTOR].call(view, {}, options);
                return view;
            },
            add: function (models_) {
                var ret, _bufferedViews, view = this;
                view._ensureBufferedViews();
                ret = Box[CONSTRUCTOR][PROTOTYPE].add.call(view, models_);
                return ret;
            },
            _add: function (view) {
                var parent = this;
                Box[CONSTRUCTOR][PROTOTYPE]._add.call(parent, view);
                // ensure the element buffer
                // append to the view list buffer
                // attached buffered element here so we don't have to loop through the list later
                view._setElement(view.el);
                parent._addBufferedView(view);
            },
            _ensureChildren: function () {
                this[CHILDREN] = this[CHILDREN] || Collection();
            },
            _ensureBufferedViews: function () {
                var view = this,
                    bufferedViews = isArray(view._bufferedViews) ? 1 : view._resetBufferedViews(),
                    _bufferedEls = isFragment(view._bufferedEls) ? 1 : view._resetBufferedEls();
            },
            _addBufferedView: function (view) {
                var parent = this;
                parent._bufferedEls.appendChild(view.el[INDEX](0));
                parent._bufferedViews.push(view);
            },
            _resetBuffered: function () {
                this._resetBufferedEls();
                this._resetBufferedViews();
            },
            _resetBufferedViews: function () {
                this._bufferedViews = [];
            },
            _resetBufferedEls: function () {
                this._bufferedEls = createDocumentFragment();
            },
            _setElement: function () {
                var region = this,
                    selector = region.selector,
                    parent = region[PARENT];
                if (parent !== app) {
                    region.el = parent.$(selector);
                } else {
                    region.el = $($(selector)[INDEX](0));
                }
            },
            render: function () {
                var region = this;
                region[IS_RENDERED] = BOOLEAN_FALSE;
                // doc frags on regionviews, list of children to trigger events on
                region._ensureBufferedViews();
                // request extra data or something before rendering: dom is still completely intact
                region[DISPATCH_EVENT]('before:' + RENDER);
                // unbinds and rebinds element only if it changes
                region._setElement();
                // update new element's attributes
                region._setElAttributes();
                // puts children back inside parent
                region._attachBufferedViews();
                // attach region element
                // appends child elements
                region[APPEND_CHILD_ELEMENTS]();
                // mark the view as rendered
                region[IS_RENDERED] = BOOLEAN_TRUE;
                // reset buffered objects
                region._resetBuffered();
                // dispatch the render event
                region[DISPATCH_EVENT](RENDER);
                return region;
            },
            _appendChildElements: function () {
                var region = this,
                    buffered = region._bufferedEls,
                    el = region.el[INDEX](0);
                if (buffered && el) {
                    el.appendChild(buffered);
                }
            },
            _getElementFromParent: function (selector) {
                var $selected, region = this,
                    parent = region[PARENT];
                if (parent !== app) {
                    $selected = $(parent.$(selector)[INDEX](0));
                } else {
                    $selected = $($(selector)[INDEX](0));
                }
                region.el = $selected;
            },
            _attachBufferedViews: function () {
                var region = this,
                    parentView = region.parentView();
                region[CHILDREN].duff(function (child) {
                    if (result(child, 'filter')) {
                        child[RENDER]();
                        region._addBufferedView(child);
                    }
                });
            }
        }, BOOLEAN_TRUE),
        RegionManager = factories.Collection.extend('RegionManager', {
            createRegion: function (where, region_) {
                var key, regionManager = this,
                    parent = regionManager[PARENT],
                    // assume that it is a region
                    region = region_;
                if (isInstance(region, Region)) {
                    return region;
                }
                region = Region({
                    id: where,
                    selector: isString(region) ? region : EMPTY,
                    parent: parent
                });
                key = REGION_MANAGER;
                if (parent !== app) {
                    key = CHILDREN;
                    parent.add(region);
                }
                parent._addToHash(region, key);
                return region;
            },
            removeRegion: function (region_) {
                var regionManager = this;
                var region = isString(region_) ? regionManager.get(region_) : region_;
                regionManager.remove(region);
                regionManager.unRegister(region.id, region);
            },
            establishRegions: function (key, value) {
                var regionManager = this,
                    parentView = regionManager[PARENT];
                intendedObject(key, value, function (key, value) {
                    var region = regionManager.get(key);
                    if (!region) {
                        region = regionManager.createRegion(key, value);
                    }
                    region._getElementFromParent();
                });
                return regionManager;
            }
        }, BOOLEAN_TRUE);
    _.exports({
        compile: compile
    });
    app.extend({
        _addToHash: Box[CONSTRUCTOR][PROTOTYPE]._addToHash,
        getRegion: viewGetRegionPlacer(REGION_MANAGER),
        addRegion: function (id, selector) {
            var app = this;
            // ensure region manager
            var blank = app.getRegion();
            var regionManager = app[REGION_MANAGER];
            regionManager[PARENT] = app;
            regionManager[ESTABLISH_REGIONS](id, selector);
            return app;
        }
    });
});
application.scope().module('Buster', function (module, app, _, factories, $) {
    var blank, isReceiving = 0,
        get = _.get,
        duff = _.duff,
        collection = factories.Collection,
        gapSplit = _.gapSplit,
        associator = _.associator,
        unitsToNum = _.unitsToNum,
        roundFloat = _.roundFloat,
        isFunction = _.isFunction,
        extend = _.extend,
        console = _.console,
        reference = _.reference,
        now = _.now,
        parse = _.parse,
        foldl = _.foldl,
        stringify = _.stringify,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        infin = 32767,
        nInfin = -infin - 1,
        ATTRIBUTES = 'attributes',
        COMPONENT = 'component',
        COMPONENTS = COMPONENT + 's',
        RESPONSE_OPTIONS = 'responseOptions',
        PARENT = 'parent',
        LENGTH = 'length',
        HEIGHT = 'height',
        WIDTH = 'width',
        BOTTOM = 'bottom',
        RIGHT = 'right',
        LEFT = 'left',
        TOP = 'top',
        DISPATCH_EVENT = 'dispatchEvent',
        MARGIN_BOTTOM = 'marginBottom',
        MARGIN_RIGHT = 'marginRight',
        MIN_HEIGHT = 'minHeight',
        MAX_HEIGHT = 'maxHeight',
        MIN_WIDTH = 'minWidth',
        MAX_WIDTH = 'minWidth',
        BEFORE_RESPONDED = 'before:responded',
        QUEUED_MESSAGE_INDEX = 'queuedMessageIndex',
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
                tippyTop = window[TOP];
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
                                        currentCheck = currentCheck[PARENT];
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
                        referrer: reference(parts.doc)
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
                parentEl = buster.el[PARENT]();
                buster.respond(data, {
                    parent: {
                        height: parentEl[HEIGHT](),
                        width: parentEl[WIDTH](),
                        style: {
                            height: parentEl.index(0).style[HEIGHT],
                            width: parentEl.index(0).style[WIDTH]
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
            var buster, bustersCache, data = parse(evt.data),
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
            var busterAttrs = buster[ATTRIBUTES],
                sameSide = busterAttrs.sameSide,
                parts = buster.parts,
                message = stringify(base),
                timestamp = now(),
                doReceive = function () {
                    receive({
                        data: message,
                        frame: buster.el,
                        responder: receive,
                        srcElement: window,
                        timestamp: timestamp
                    });
                };
            if (sameSide) {
                if (busterAttrs.referrer) {
                    throw new Error('missing referrer: ' + buster.get('sessionId'));
                } else {
                    parts.sendWin.postMessage(message, busterAttrs.referrer);
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
                var attrs = buster[ATTRIBUTES],
                    parts = buster.parts;
                parts.sendWin = buster[PARENT].el.index(0).contentWindow;
                attrs.referrer = attrs.referrer || reference(parts.doc);
                attrs.sameSide = !buster[PARENT][PARENT].get('unfriendlyCreative');
            },
            /**
             * @private
             */
            fromInner: function (buster) {
                var attrs = buster[ATTRIBUTES],
                    parts = buster.parts;
                parts.sendWin = parts.receiveWin[PARENT];
                attrs.referrer = attrs.referrer || reference(parts.doc);
            },
            notInner: {
                /**
                 * @private
                 */
                noAccess: function (buster) {
                    var url, attrs = buster[ATTRIBUTES],
                        parts = buster.parts,
                        doc = parts.doc,
                        iframe = doc.createElement('iframe'),
                        allMods = _.clone(app.allModules);
                    allMods.push('initPublisherConfig');
                    if (!attrs.busterLocation) {
                        return;
                    }
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
                    promise.Ajax(url).failure(function () {
                        var time = 2000;
                        if (_.isMobile) {
                            time = 10000;
                        }
                        setTimeout(function () {
                            // handle no buster file here
                            var ret, ad = buster[PARENT],
                                adAttrs = ad[ATTRIBUTES],
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
                },
                /**
                 * @private
                 */
                topAccess: function (buster) {
                    var commands, newParent = buster.el.index(0),
                        attrs = buster[ATTRIBUTES];
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
                        top: Math.min(memo[TOP], calced[TOP]),
                        left: Math.min(memo[LEFT], calced[LEFT]),
                        right: Math.max(memo[RIGHT], (calced[LEFT] + calced[WIDTH])),
                        bottom: Math.max(memo[BOTTOM], (calced[TOP] + calced[HEIGHT])),
                        zIndex: Math.max(memo.zIndex, (+com.zIndex || 0)),
                        marginRight: Math.max(memo[MARGIN_RIGHT], horizontalPush || 0),
                        marginBottom: Math.max(memo[MARGIN_BOTTOM], verticalPush || 0),
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
        },
        /**
         * @class Buster
         * @augments Model
         * @augments Box
         * @augments View
         * @classDesc constructor for buster objects, which have the ability to talk across windows
         */
        Message = factories.Container.extend('Message', {
            initialize: function () {
                var message = this;
                message.deferredHandlers = [];
                message.respondHandlers = [];
            },
            packet: function (data) {
                var ret = this;
                if (arguments[0]) {
                    this.set('packet', data || {});
                } else {
                    ret = parse(stringify(this.get('packet')));
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
                    buster = message[PARENT];
                if (isFunction(fn)) {
                    message.respondHandlers.push(bind(fn, message));
                }
                if (message[RESPONSE_OPTIONS]) {
                    while (message.respondHandlers[0]) {
                        handler = message.respondHandlers.shift();
                        handler(message[RESPONSE_OPTIONS]);
                    }
                }
                return message;
            }
        }),
        showHideBoolean = function (bool) {
            return function (showList) {
                var buster = this;
                duff(gapSplit(showList), function (id) {
                    var com = buster[COMPONENT](id);
                    if (com) {
                        com.isShowing = bool;
                    }
                });
            };
        },
        Buster = factories.Buster = factories.Box.extend('Buster', {
            Model: Message,
            events: {
                unload: 'destroy',
                'change:isConnected': function () {
                    this.set(QUEUED_MESSAGE_INDEX, 1);
                },
                'change:isConnected child:added': 'flush'
            },
            parentEvents: function () {
                return {
                    destroy: 'destroy'
                };
            },
            /**
             * @func
             * @name Buster#destroy
             */
            currentPoint: function () {
                var currentPoint = this.get('currentPoint');
                return currentPoint ? {
                    source: currentPoint.source,
                    srcElement: currentPoint.srcElement,
                    originTimestamp: currentPoint.timestamp,
                    frame: currentPoint.frame,
                    responder: currentPoint.responder
                } : {};
            },
            destroy: function () {
                var buster = this,
                    attrs = buster[ATTRIBUTES];
                buster.set('isConnected', BOOLEAN_FALSE);
                clearTimeout(attrs.__lastMouseMovingTimeout__);
                _.AF.remove(attrs.elQueryId);
                _.AF.remove(attrs.componentTransitionAFID);
                buster.parts = {};
                associator.remove(buster.id);
                factories.Box.constructor.prototype.destroy.apply(this, arguments);
                return buster;
            },
            tellMouseMovement: function () {
                if (this.get('mouseMoveDataObject')) {
                    this.respond(this.get('mouseMoveDataObject'));
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
                var busterAttrs = this[ATTRIBUTES],
                    _sizing = busterAttrs._sizing,
                    margin = {
                        transitionProperty: 'all'
                    };
                if (_sizing) {
                    if (_sizing.vPushCount) {
                        margin[MARGIN_BOTTOM] = busterAttrs.pushVerticalVal;
                        margin.transitionDuration = _sizing.transitionDuration;
                    } else {
                        if (set0) {
                            margin[MARGIN_BOTTOM] = 0;
                        } else {
                            margin[MARGIN_BOTTOM] = 'auto';
                        }
                    }
                    if (_sizing.hPushCount) {
                        margin[MARGIN_RIGHT] = busterAttrs.pushHorizontalVal;
                        margin.transitionDuration = _sizing.transitionDuration;
                    } else {
                        if (set0) {
                            margin[MARGIN_RIGHT] = 0;
                        } else {
                            margin[MARGIN_RIGHT] = 'auto';
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
                    attrs = buster[ATTRIBUTES];
                buster[COMPONENTS] = collection();
                buster.showing = collection();
                buster.on(BEFORE_RESPONDED, attrs.every);
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
                        duff(packet[COMPONENTS], function (com) {
                            var component = buster[COMPONENT](com.registeredAs);
                            if (!component) {
                                buster[COMPONENTS].add(com);
                            } else {
                                extend(component, com);
                            }
                        });
                        buster[COMPONENTS].each(function (com) {
                            if (_.posit(packet.showing, com.registeredAs)) {
                                com.isShowing = BOOLEAN_TRUE;
                            } else {
                                com.isShowing = BOOLEAN_FALSE;
                            }
                        });
                        if (packet.shouldRespond) {
                            buster.respond();
                        }
                    }
                });
                buster.allListeners = collection();
                attrs.frame = null;
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
            /**
             * quick get parser to figure out if the wrapper, the frame element, it's parent, the document, or an other item is being selected by a post message
             * @arg {string} target selector
             * @returns {DOMM} with targets
             * @func
             * @name Buster#getTargets
             */
            getTargets: function (target) {
                var buster = this,
                    attrs = buster[ATTRIBUTES],
                    parts = buster.parts,
                    top = parts[TOP],
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
                if (target === PARENT) {
                    targets = buster.el[PARENT]();
                }
                if (!targets[LENGTH]) {
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
                    currentIdx = buster.get(QUEUED_MESSAGE_INDEX),
                    connected = buster.get('isConnected'),
                    initedFrom = buster.get('initedFromPartner'),
                    flushing = buster.get('flushing');
                if (!initedFrom || connected && ((connected || !currentIdx) && !flushing)) {
                    buster.set('flushing', BOOLEAN_TRUE);
                    childrenLen = buster.children[LENGTH]();
                    queuedMsg = buster.children.index(currentIdx);
                    while (queuedMsg && currentIdx < childrenLen) {
                        queuedMsg.set({
                            runCount: 0
                        });
                        postMessage(queuedMsg, buster);
                        if (currentIdx) {
                            currentIdx = (buster.get(QUEUED_MESSAGE_INDEX) + 1) || 0;
                            buster.set(QUEUED_MESSAGE_INDEX, currentIdx);
                            queuedMsg = buster.children.index(currentIdx);
                        } else {
                            childrenLen = BOOLEAN_FALSE;
                        }
                    }
                    buster.set({
                        flushing: BOOLEAN_FALSE
                    });
                    if (buster.get('isConnected')) {
                        if (buster.children[LENGTH]() > buster.get(QUEUED_MESSAGE_INDEX)) {
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
                var buster = this,
                    defaultObj = buster.defaultMessage(),
                    message = buster.add(extend({
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
                var packet, format, retVal, responded, onResponse, originalMessage, responseType, methodName, buster = this,
                    attrs = buster[ATTRIBUTES],
                    currentPoint = attrs.currentPoint = currentPoint_,
                    event = currentPoint,
                    messages = attrs.sent,
                    runCount = data.runCount,
                    children = buster.children,
                    eventname = 'respond',
                    args = _.toArray(arguments);
                if (runCount) {
                    originalMessage = children.index(data.index);
                    if (!originalMessage) {
                        return buster;
                    }
                    // found the message that i originally sent you
                    // packet = originalMessage.packet;
                    // allow the buster to set some things up
                    buster[DISPATCH_EVENT](BEFORE_RESPONDED);
                    if (runCount === 1) {
                        // stash it for later
                        originalMessage[RESPONSE_OPTIONS] = data;
                    } else {
                        eventname = 'deferred';
                    }
                    originalMessage[DISPATCH_EVENT](eventname);
                } else {
                    buster[DISPATCH_EVENT]('receive:' + data.command);
                    buster[DISPATCH_EVENT]('receive');
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
                var attrs = this[ATTRIBUTES];
                return {
                    from: attrs.id,
                    postTo: attrs.postTo,
                    sameSide: attrs.sameSide,
                    fromInner: attrs.fromInner,
                    toInner: attrs.toInner,
                    index: this.children[LENGTH](),
                    preventResponse: BOOLEAN_FALSE
                };
            },
            /**
             * @func
             * @name Buster#shouldUpdate
             */
            shouldUpdate: function (args) {
                var ret, buster = this,
                    attrs = buster[ATTRIBUTES],
                    lastUpdate = attrs.lastRespondUpdate,
                    lastFrameRect = attrs.lastFrameRect,
                    top = buster.parts[TOP] || {},
                    width = top.innerWidth,
                    height = top.innerHeight,
                    nowish = now();
                if (lastUpdate > nowish - 1000 && _.isObject(lastFrameRect)) {
                    ret = !(lastFrameRect[BOTTOM] < -height * 0.5 || lastFrameRect.top > height * 1.5 || lastFrameRect[RIGHT] < -width * 0.5 || lastFrameRect[LEFT] > width * 1.5);
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
                    attrs = buster[ATTRIBUTES],
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
                    buster[DISPATCH_EVENT]('respond:' + data.command);
                    if (data.isDeferred) {
                        buster[DISPATCH_EVENT]('deferred:' + data.command);
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
                var clientRect = this[ATTRIBUTES].lastFrameRect = this.el.clientRect();
                return clientRect;
            },
            /**
             * @returns {object} client rect duplicate of parent element
             * @func
             * @name Buster#getParentRect
             */
            getParentRect: function () {
                var parentRect = this[ATTRIBUTES].lastParentRect = this.el[PARENT]().clientRect();
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
                        innerHeight: topWin.innerHeight || 0,
                        outerHeight: topWin.outerHeight || 0,
                        innerWidth: topWin.innerWidth || 0,
                        outerWidth: topWin.outerWidth || 0,
                        scrollX: topWin.scrollX || 0,
                        scrollY: topWin.scrollY || 0,
                        location: {
                            hash: location.hash.slice(1),
                            host: location.host,
                            href: location.href,
                            origin: location.origin,
                            pathname: location.pathname.slice(1),
                            port: location.port,
                            protocol: location.protocol.slice(0, location.protocol[LENGTH] - 1),
                            search: location.search.slice(1)
                        }
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
                    height: pI(getBoundingClientRect[HEIGHT]),
                    bottom: pI(getBoundingClientRect[BOTTOM]),
                    width: pI(getBoundingClientRect[WIDTH]),
                    right: pI(getBoundingClientRect[RIGHT]),
                    left: pI(getBoundingClientRect[LEFT]),
                    top: pI(getBoundingClientRect[TOP])
                };
                return info;
            },
            /**
             * @returns {object} position in document as calculated by the buster attributes
             * @func
             * @name Buster#positionInDocument
             */
            positionInDocument: function () {
                var attrs = this[ATTRIBUTES],
                    wrapperInfo = attrs.wrapperInfo,
                    contentRect = attrs.lastParentRect,
                    pos = attrs.lastPosInDoc = {
                        top: pI(contentRect[TOP] - wrapperInfo[TOP]),
                        bottom: pI(wrapperInfo[HEIGHT] - contentRect[TOP] - wrapperInfo.scrollTop - contentRect[HEIGHT]),
                        left: pI(contentRect[LEFT] - wrapperInfo[LEFT]),
                        right: pI(wrapperInfo[WIDTH] - contentRect[RIGHT] - wrapperInfo.scrollLeft - wrapperInfo[LEFT])
                    };
                return pos;
            },
            calculateSizes: function () {
                var buster = this,
                    attrs = get(buster),
                    parentStyle = attrs.lastParentStyle = buster.el[PARENT]().getStyle(),
                    comSizes = attrs[COMPONENTS] = buster[COMPONENTS].map(function (idx, com) {
                        return buster.calculateSize(com);
                    });
                return comSizes;
            },
            showComponents: showHideBoolean(BOOLEAN_TRUE),
            hideComponents: showHideBoolean(BOOLEAN_FALSE),
            calculateContainerSize: function (components) {
                var buster = this,
                    attrs = get(buster),
                    parentRect = attrs.lastParentRect,
                    sizing = containerSize(components || buster[COMPONENTS]);
                attrs._sizing = sizing;
                attrs.containerSize = {
                    top: sizing[TOP],
                    left: sizing[LEFT],
                    width: sizing[RIGHT] - sizing[LEFT],
                    height: sizing[BOTTOM] - sizing[TOP]
                };
                attrs.pushVerticalVal = Math.min(Math.max(sizing[BOTTOM] - parentRect[BOTTOM], 0), sizing[MARGIN_BOTTOM]);
                attrs.pushHorizontalVal = Math.min(Math.max(sizing[RIGHT] - parentRect[RIGHT], 0), sizing[MARGIN_RIGHT]);
                sizing = attrs.containerCss = {
                    top: sizing[TOP] - parentRect[TOP],
                    left: sizing[LEFT] - parentRect[LEFT],
                    width: sizing[RIGHT] - sizing[LEFT],
                    height: sizing[BOTTOM] - sizing[TOP],
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
                    method = (expansion || factories.expansion.match),
                    result = method.call(buster, component, parentRect, parentStyle, buster.parts[TOP]),
                    // these are always relative to the viewport
                    calcSize = component.calculatedSize = _.floor({
                        top: result[TOP],
                        left: result[LEFT],
                        width: result[WIDTH],
                        height: result[HEIGHT]
                    }, 2);
                return calcSize;
            },
            /**
             * starts a relationship between two busters. simplifies the initialization process.
             * @returns {number} just for responding to the original message in case there's a handler
             * @func
             * @name Buster#begin
             */
            begin: function () {
                var buster = this,
                    attrs = buster[ATTRIBUTES],
                    message = buster.send('initialize', {
                        referrer: attrs.publisher
                    });
                message.respond(function (e) {
                    var data = e.data(),
                        packet = data.packet;
                    buster.set('isConnected', BOOLEAN_TRUE);
                });
                return message;
            }
        }, BOOLEAN_TRUE);
    if (app.topAccess()) {
        $(window[TOP]).on('message', receive);
    }
    _.exports({
        containerSize: containerSize
    });
});
//# sourceMappingURL=all.js.map
