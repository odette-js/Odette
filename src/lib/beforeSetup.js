this.Application = function (global, WHERE, version, fn) {
    'use strict';
    var UNDEFINED, topmostDoc, MAKE_SCRIPT = 'makeScript',
        LENGTH = 'length',
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
        this.loadedUnder = [];
        return this;
    }
    Application[PROTOTYPE].wraptry = wraptry;
    Application[PROTOTYPE].extend = function (obj) {
        var n, app = this;
        for (n in obj) {
            if (obj.hasOwnProperty(n)) {
                app[n] = obj[n];
            }
        }
        return app;
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
    Application[PROTOTYPE].scope = function (name, fn_) {
        var app = this,
            fn = name && (isFunction(name) ? name : (isFunction(fn_) ? fn_ : NULL));
        if (fn) {
            app[PARENT].scope(app.version, fn);
        }
        return app;
    };
    // Application[PROTOTYPE].loadedAgainst = function (win) {};
    // Application[PROTOTYPE].lastLoaded = function () {};
    Application[PROTOTYPE][TOUCH_TOP] = function () {
        // allows the top part of this script to be swapped out against different globaldows_
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
            saved[PARENT] = UNDEFINED;
            application.versions[name] = UNDEFINED;
            return saved;
        },
        scope: function (name_, fn_) {
            var scopedApp, app = this,
                hash = app.versions,
                name = fn_ ? name_ : app.defaultVersion,
                fn = fn_ ? fn_ : name_;
            if (isString(name_)) {
                app.currentVersion = name_;
            }
            app.registerVersion(name);
            scopedApp = hash[name];
            return isFunction(fn) ? this.wraptry(function () {
                fn.call(app, scopedApp);
            }) || scopedApp : scopedApp;
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
                    application.map(application.versionOrder, function (version) {
                        application.applyTo(version, name, args_);
                    });
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
                script = docu.createElement('script'),
                type = script.type = 'text/javascript';
            if (!src) {
                return script;
            }
            if (onload) {
                script.onload = onload;
            }
            // src applied last for ie
            script.src = src;
            return script;
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