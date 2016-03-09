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