this.Odette = this.Odette || function (global, WHERE, version, fn, alt) {
    'use strict';
    var UNDEFINED, odette_version = '0.0.0',
        EMPTY_STRING = '',
        LENGTH = 'length',
        PARENT = 'global',
        PROTOTYPE = 'prototype',
        TOUCH = 'touch',
        HAS_ACCESS = 'hasAccess',
        PERIOD = '.',
        global_ = this || window || global,
        doc = global_.document,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        NULL = null,
        noop = function () {},
        typeConstructor = function (str) {
            return function (thing) {
                return typeof thing === str;
            };
        },
        now = function () {
            return +(new Date());
        },
        map = function (arra, fn) {
            var i = 0,
                len = arra[LENGTH],
                arr = [];
            while (len > i) {
                arr[i] = fn(arra[i], i, arra);
                i++;
            }
            return arr;
        },
        isString = typeConstructor('string'),
        isNumber = typeConstructor('number'),
        isFunction = typeConstructor('function'),
        executionTime = now(),
        makeParody = function (parent, fn) {
            return function () {
                return fn.apply(parent, arguments);
            };
        },
        wraptry = function (trythis, errthat, finalfunction) {
            var returnValue, err = NULL;
            try {
                returnValue = trythis();
            } catch (e) {
                err = e;
                returnValue = errthat ? errthat(e) : returnValue;
            } finally {
                returnValue = finalfunction ? finalfunction(err, returnValue) : returnValue;
            }
            return returnValue;
        },
        isVersionString = function (string) {
            return isNumber(string) || (isString(string) && (string.split(PERIOD)[LENGTH] > 1 || +string === +string)) ? BOOLEAN_TRUE : BOOLEAN_FALSE;
        },
        maxVersion = function (string1, string2) {
            // string 2 is always the underdog
            var split1, split2, provenLarger, cvs1Result = convertVersionString(string1);
            var cvs2Result = convertVersionString(string2);
            // keyword checks
            if (cvs1Result === BOOLEAN_TRUE) {
                return cvs1Result;
            }
            if (cvs2Result === BOOLEAN_TRUE) {
                return cvs2Result;
            }
            if (cvs1Result === BOOLEAN_FALSE && cvs2Result === BOOLEAN_FALSE) {
                // compare them as version strings
                split1 = string1.split(PERIOD);
                split2 = string2.split(PERIOD);
                map(split1, function (value, index) {
                    if (+value < +(split2[index] || 0)) {
                        provenLarger = BOOLEAN_TRUE;
                    }
                });
                if (provenLarger === UNDEFINED && split2[LENGTH] > split1[LENGTH]) {
                    provenLarger = BOOLEAN_TRUE;
                }
                return !!provenLarger ? string2 : string1;
            } else {
                return string1 > string2 ? string1 : string2;
            }
        },
        convertVersionString = function (string_) {
            var converted, string = string_;
            if (isNumber(string)) {
                return string;
            } else {
                string += EMPTY_STRING;
                converted = +string;
                // could be a number hiding as a string
                if (converted === converted) {
                    return converted;
                } else {
                    return string.split(PERIOD)[LENGTH] === 1;
                }
            }
        },
        parseSearch = function (search_) {
            var parms, temp, items, val, converted, i = 0,
                search = search_,
                dcUriComp = global_.decodeURIComponent;
            if (!isString(search)) {
                search = search[LOCATION].search;
            }
            if (search[0] === '?') {
                search = search.slice(1);
            }
            items = search.split('&');
            parms = {};
            for (; i < items[LENGTH]; i++) {
                temp = items[i].split('=');
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
        };

    function Application(name, parent) {
        this.SCOPED = BOOLEAN_TRUE;
        this.CREATED_AT = now();
        this.VERSION = name;
        this.application = this;
        this.missedDefinitions = [];
        return this;
    }
    Application[PROTOTYPE].destroy = noop;
    Application[PROTOTYPE].wraptry = wraptry;
    Application[PROTOTYPE].now = now;
    Application[PROTOTYPE].execute = function () {
        var fn = this[PARENT].lastLoaded;
        fn(this.scope());
    };
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
        if (this.isDefining) {
            handler.apply(this, [this, this.definingAgainst, this.definingWith]);
        }
        return this;
    };
    Application[PROTOTYPE].parody = function (list) {
        var app = this,
            i = 0,
            extendor = {},
            parent = app[PARENT];
        for (; i < list[LENGTH]; i++) {
            extendor[list[i]] = makeParody(parent, parent[list[i]]);
        }
        app.extend(extendor);
        return app;
    };
    Application[PROTOTYPE].scope = function (name_, fn_) {
        var name = name_ && isString(name_) ? name_ : this.VERSION;
        var fn = name_ && (isFunction(name_) ? name_ : (isFunction(fn_) ? fn_ : NULL));
        return this[PARENT].scope(name, fn);
    };
    var app, application = global_[WHERE] = global_[WHERE] || (function () {
        Odette.where.push(WHERE);
        return {
            EXECUTED_AT: executionTime,
            WHERE: WHERE,
            VERSION: odette_version,
            SHARED: BOOLEAN_TRUE,
            SCOPED: BOOLEAN_FALSE,
            versionOrder: [],
            versions: {},
            wraptry: wraptry,
            maxVersion: maxVersion,
            registerVersion: function (name, app) {
                var defaultVersion, application = this,
                    cachedOrCreated = application.versions[name],
                    newApp = application.versions[name] = cachedOrCreated || app || new Application(name, application);
                newApp[PARENT] = application;
                application.currentVersion = name;
                application.defaultVersion = (defaultVersion = application.defaultVersion) === UNDEFINED ? version : maxVersion(defaultVersion, version);
                if (!cachedOrCreated) {
                    application.versionOrder.push(name);
                }
                return newApp;
            },
            definition: function (version, globl, options) {
                var opts, context, application = this,
                    app = application.registerVersion(version),
                    odebt = globl.Odette,
                    definitionOptions = odebt.options;
                if (!definitionOptions) {
                    return app;
                }
                context = globl || definitionOptions.context;
                opts = options || {};
                if (app.defined) {
                    application.map(app.missedDefinitions, function (handler) {
                        handler.apply(app, [app, context, opts]);
                    });
                } else {
                    app.defined = BOOLEAN_TRUE;
                    app.isDefining = BOOLEAN_TRUE;
                    app.definingAgainst = context;
                    app.definingWith = opts;
                    definitionOptions.handler.apply(app, [app, context, opts]);
                    app.isDefining = BOOLEAN_FALSE;
                    delete odebt.options;
                }
                return app;
            },
            unRegisterVersion: function (name) {
                var application = this,
                    saved = application.versions[name],
                    orderIdx = application.versionOrder.indexOf(name);
                if (orderIdx === -1) {
                    return application;
                }
                saved.destroy();
                application.versionOrder.splice(orderIdx, 1);
                saved[PARENT] = UNDEFINED;
                application.versions[name] = UNDEFINED;
                return saved;
            },
            scope: function (name_, fn_) {
                var name, fn, scoped, app = this,
                    hash = app.versions;
                if (isString(name_) || isNumber(name_)) {
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
                    fn.apply(app, [scoped]);
                });
                return scoped;
            },
            map: map,
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
            touch: function (fromHere, toHere, preventMap) {
                // assume you have top access
                var hasAccess, origin = this,
                    application = origin;
                if (wraptry(function () {
                    // always errs
                    var doc = toHere.document;
                    // overwrite the scoped application variable
                    application = toHere[WHERE] || application;
                    return !!doc;
                }, function () {
                    return BOOLEAN_FALSE;
                })) {
                    toHere[WHERE] = application;
                    if (!preventMap && fromHere[WHERE] !== application) {
                        fromHere[WHERE] = application;
                        map(origin.versionOrder, function (version) {
                            application.registerVersion(version, origin.versions[version]);
                        });
                    }
                    return application;
                }
            }
        };
    }());
    app = application.get(version);
    if (app) {
        // there is already an app with this same version that originated from this global object
        if (alt) {
            alt.apply(global_, [application, app]);
        }
    } else {
        app = application.registerVersion(version);
        // call is used because apply is finicky and bind is not universal
        fn.apply(global_, [application, app]);
    }
    return app;
};
Odette.where = Odette.where || [];
Odette.definition = Odette.definition || function (context, handler) {
    this.options = {
        context: context,
        handler: handler
    };
};