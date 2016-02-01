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