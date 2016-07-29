(function (that) {
    var Odette = that.Odette = that.Odette || function (global, WHERE, version, fn, alt) {
        'use strict';
        var UNDEFINED, odette_version = Odette.VERSION = '0.0.0',
            EMPTY_STRING = '',
            LENGTH = 'length',
            PARENT = 'global',
            PROTOTYPE = 'prototype',
            TOUCH = 'touch',
            HAS_ACCESS = 'hasAccess',
            PERIOD = '.',
            global_ = this || window || this,
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
            isObject = typeConstructor('object'),
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
                    returnValue = errthat ? errthat(e, returnValue) : returnValue;
                } finally {
                    returnValue = finalfunction ? finalfunction(err, returnValue) : returnValue;
                }
                return returnValue;
            },
            isVersionString = function (string) {
                return isNumber(string) || (isString(string) && (string.split(PERIOD)[LENGTH] > 1 || +string === +string)) ? BOOLEAN_TRUE : BOOLEAN_FALSE;
            },
            maxVersion = function (string1, string2) {
                // string 2 is always the underdogl
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
            },
            exception = function (message) {
                throw new Error(message);
            };

        function Application(name, parent) {
            this.SCOPED = BOOLEAN_TRUE;
            this.CREATED_AT = now();
            this.VERSION = name;
            this.application = this;
            this.missedDefinitions = [];
            return this;
        }
        Application[PROTOTYPE].exception = exception;
        Application[PROTOTYPE].destroy = noop;
        Application[PROTOTYPE].wraptry = wraptry;
        Application[PROTOTYPE].now = now;
        Application[PROTOTYPE].extend = function (obj) {
            return this.merge(this, obj);
        };
        Application[PROTOTYPE].merge = function (obj1, obj2) {
            var n;
            if (isObject(obj2)) {
                for (n in obj2) {
                    if (obj2.hasOwnProperty(n)) {
                        obj1[n] = obj2[n];
                    }
                }
            }
            return obj1;
        };
        Application[PROTOTYPE].undefine = function (handler) {
            this.missedDefinitions.push(handler);
            if (this.defining) {
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
        Application[PROTOTYPE].counter = function (thing) {
            return Odette.counter(thing);
        };
        Application[PROTOTYPE].libraryUrl = function () {
            return './library.js';
        };
        Application[PROTOTYPE].loadLibrary = function (fn) {
            return this[PARENT].loadLibrary(this, this.libraryUrl(), fn);
        };
        var loadScriptWithQueue = function (handle) {
            var loading, queue = [];
            return function (version, url, fn) {
                var cachedContext, item, result, app = version,
                    application = this,
                    push = function () {
                        queue.push(item);
                    };
                if (isString(version)) {
                    app = application.get(version);
                }
                if (!app) {
                    Application[PROTOTYPE].exception('Application must have been created already.');
                }
                if (application.defined) {
                    return fn && fn(app);
                }
                cachedContext = application.buildContext;
                item = {
                    app: app,
                    context: cachedContext,
                    handler: function (app) {
                        fn(app);
                    }
                };
                if (loading) {
                    push();
                } else {
                    if (isString(url)) {
                        loading = BOOLEAN_TRUE;
                        push();
                        application.makeScript(url, function () {
                            loading = BOOLEAN_FALSE;
                            queue = [];
                            application.registerVersion(app.VERSION);
                            application.map(queue, function (item) {
                                handle.apply(application, [item]);
                                return item.handler && item.handler(item.app);
                            });
                        }, cachedContext.document);
                    } else {
                        // it's a window
                        application.registerVersion(app.VERSION);
                        handle.apply(application, [item]);
                        app = fn && fn(app);
                        return result;
                    }
                }
            };
        };
        var app, application = global_[WHERE] = global_[WHERE] || (function () {
            Odette.where.push(WHERE);
            return {
                Application: Application,
                EXECUTED_AT: executionTime,
                WHERE: WHERE,
                VERSION: odette_version,
                SHARED: BOOLEAN_TRUE,
                SCOPED: BOOLEAN_FALSE,
                versionOrder: [],
                versions: {},
                wraptry: wraptry,
                maxVersion: maxVersion,
                map: map,
                loadScriptWithQueue: loadScriptWithQueue,
                registerVersion: function (scopedV, app) {
                    var defaultVersion, application = this,
                        cachedOrPassed = application.versions[scopedV],
                        newApp = application.versions[scopedV] = cachedOrPassed || app || new Application(scopedV, application);
                    newApp[PARENT] = application;
                    application.currentVersion = scopedV;
                    application.defaultVersion = application.maxVersion(application.defaultVersion, scopedV) ? scopedV : application.defaultVersion;
                    if (!cachedOrPassed) {
                        application.versionOrder.push(scopedV);
                    }
                    return newApp;
                },
                definition: function (version_, globl_, options_) {
                    var app, odebt, definitionOptions, opts, context, application = this,
                        version = version_,
                        globl = globl_,
                        options = options_;
                    if (isObject(version)) {
                        options = globl;
                        globl = version;
                        version = application.scope().VERSION;
                    }
                    app = application.registerVersion(version);
                    odebt = globl.Odette;
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
                        app.defining = BOOLEAN_TRUE;
                        app.definingAgainst = context;
                        app.definingWith = opts;
                        definitionOptions.handler.apply(app, [app, context, opts]);
                        app.defining = BOOLEAN_FALSE;
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
                    fn.apply(app, [scoped]);
                    return scoped;
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
                touch: function (fromHere, toHere, preventMap) {
                    // assume you have top access
                    var hasAccess, origin = this,
                        application = origin;
                    if (wraptry(function () {
                        // always errs
                        var doc = toHere.document;
                        // overwrite the scoped application variable
                        application = (toHere && toHere[WHERE]) || application;
                        // doc has to be true, if it is undefined (safari) then we did not make it
                        return !!doc;
                    }, function () {
                        return BOOLEAN_FALSE;
                    })) {
                        toHere[WHERE] = application;
                        if (toHere.Odette.where.indexOf(application.WHERE) === -1) {
                            toHere.Odette.where.push(application.WHERE);
                        }
                        if (!preventMap && fromHere[WHERE] !== application) {
                            fromHere[WHERE] = application;
                            map(origin.versionOrder, function (version) {
                                application.registerVersion(version, origin.versions[version]);
                            });
                        }
                        return application;
                    }
                },
                makeScript: function (src, onload, docu_, preventappend) {
                    var docu = docu_ || doc,
                        script = docu.createElement('script');
                    script.type = 'text/javascript';
                    if (!preventappend) {
                        docu.head.appendChild(script);
                    }
                    if (src) {
                        if (onload) {
                            script.onload = onload;
                        }
                        if (isString(src)) {
                            // src applied last for ie
                            script.src = src;
                        } else {
                            script.innerHTML = src.join('\n');
                        }
                    }
                    return script;
                },
                loadLibrary: loadScriptWithQueue(function (item) {
                    this.definition(item.context);
                })
            };
        }());
        application.buildContext = global;
        app = application.get(version);
        if (!app) {
            // there is already an app with this same version that originated from this global object
            app = application.registerVersion(version);
            // call is used because apply is finicky and bind is not universal
            fn.apply(global_, [application, app]);
        }
        if (alt) {
            alt.apply(global_, [application, app]);
        }
        return app;
    };
    Odette.where = Odette.where || [];
    Odette.counter = Odette.counter || (function () {
        var stash = {};
        var globalPrefix = 0;
        return function (prefix) {
            var value;
            if (prefix) {
                stash[prefix] = stash[prefix] || 0;
                ++stash[prefix];
                value = stash[prefix];
            } else {
                ++globalPrefix;
                value = globalPrefix;
            }
            return prefix ? prefix + value : value;
        };
    }());
    Odette.definition = Odette.definition || function (context, handler) {
        this.options = {
            context: context,
            handler: handler
        };
    };
}(this));