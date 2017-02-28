/*
 * @overview First script to be loaded onto page. Bare minimum for all apps and subapps to be built under
 * @author Michael McLaughlin
 * @version 6.2.4
 */
(function (root, KEY, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(root, KEY);
    } else {
        root[KEY] = factory(root, KEY);
    }
}(this, 'Odette', function (context, KEY) {
    'use strict';
    /**
     * Odette Object
     * @type {Function}
     * @lends Odette
     */
    var UNDEFINED, odette_version = '0.0.0',
        EMPTY_STRING = '',
        noFailures = 'definitions cannot fail due to errors',
        LENGTH = 'length',
        PARENT = 'global',
        PROTOTYPE = 'prototype',
        HAS_ACCESS = 'hasAccess',
        LOCATION = 'location',
        PERIOD = '.',
        global_ = this || context,
        doc = global_.document,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        NULL = null,
        openingBracket = {
            '{': 1,
            '[': 2
        },
        closingBracket = {
            '}': 1,
            ']': 2
        },
        noop = function () {},
        type = function (thing) {
            return typeof thing;
        },
        typeConstructor = function (str) {
            return function (thing) {
                return type(thing) === str;
            };
        },
        now = function () {
            return +(new Date());
        },
        /**
         * This function adds one to its input.
         * @param {Array} list array or arraylike object.
         * @param {Function} fn iterate over each item in the array
         * @returns {Array} result of the method passed in under the second argument
         */
        map = function (list, fn) {
            var i = 0,
                arra = list && list.slice(0),
                len = arra && arra[LENGTH],
                array = [];
            while (len > i) {
                array[i] = fn(arra[i], i, arra);
                i++;
            }
            return array;
        },
        isString = typeConstructor('string'),
        isNumber = typeConstructor('number'),
        isFunction = typeConstructor('function'),
        isObject = typeConstructor('object'),
        isArray = function (array) {
            return Array.isArray(array);
        },
        stringify = function (obj) {
            return (isObject(obj) ? JSON.stringify(obj) : isFunction(obj) ? obj.toString() : obj) + EMPTY_STRING;
        },
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
        /**
         * This function distinguishes major.minor.patch versions from one another and ranks them based on their values. Since strings that contain numbers cannot be ordered well, it is best to understand each version name holistically.
         * @param {String} string1 first version name to be compared
         * @param {String} string2 second version name to be compared
         * @returns {Boolean} returns true if string2 is "larger"
         */
        maxVersion = function (string1, string2) {
            // string 2 is always the underdogl
            var split1, split2, provenLarger, cvs1Result = convertVersionString(string1);
            var cvs2Result = convertVersionString(string2);
            // keyword checks
            if (cvs1Result === BOOLEAN_TRUE) {
                return BOOLEAN_TRUE;
            }
            if (cvs2Result === BOOLEAN_TRUE) {
                return BOOLEAN_TRUE;
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
                if (split1[LENGTH] === 1 && split2[LENGTH] === 3) {
                    return BOOLEAN_TRUE;
                }
                if (split1[LENGTH] === 3 && split2[LENGTH] === 1) {
                    return BOOLEAN_FALSE;
                }
                if (provenLarger === UNDEFINED && split2[LENGTH] > split1[LENGTH]) {
                    provenLarger = BOOLEAN_TRUE;
                }
                return !!provenLarger;
            } else {
                return string1 <= string2;
            }
        },
        returns = function (item) {
            return function () {
                return item;
            };
        },
        stringifyQuery = function (obj) {
            var val, n, base = obj.url,
                query = [];
            if (isObject(obj)) {
                forOwn(obj.query, function (val, n) {
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
        convertVersionString = function (string_) {
            var converted, string = string_;
            if (isNumber(string)) {
                return string;
            } else {
                string += EMPTY_STRING;
                converted = +string;
                if (converted === converted) {
                    return converted;
                } else {
                    return string.split(PERIOD)[LENGTH] === 1;
                }
            }
        },
        parseSearch = function (search_) {
            var parms, temp, items, val, converted, openingBracketType, closingBracketType,
                i = 0,
                search = search_,
                dcUriComp = global_.decodeURIComponent,
                tryparse = function () {
                    return JSON.parse(val);
                },
                returnval = function () {
                    return val;
                };
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
                        } else if ((openingBracketType = openingBracket[val[0]]) && (closingBracketType = closingBracket[val[val.length - 1]]) && openingBracketType === closingBracketType) {
                            val = wraptry(tryparse, returnval);
                        }
                    }
                    parms[dcUriComp(temp[0])] = val;
                }
            }
            return parms;
        },
        exception = function (message) {
            throw new Error(message);
        },
        forOwn = function (obj_, fn, ctx) {
            var n, keys, obj = obj_;
            if (isObject(obj)) {
                if (isArray(obj)) {
                    map(obj, fn);
                } else {
                    keys = [];
                    for (n in obj) {
                        if (obj.hasOwnProperty(n)) {
                            keys.push(n);
                        }
                    }
                    map(keys, function (key) {
                        fn.apply(ctx || this, [obj[key], key, obj]);
                    });
                }
            }
            return obj;
        },
        /**
         * This function merges two objects' key value pairs
         * @param {Object} object1 array or arraylike object.
         * @param {Object} object2 used to overwrite key value pairs on object1
         * @returns {Object} object1
         */
        merge = function (object1, object2) {
            forOwn(object2, function (value, key) {
                object1[key] = value;
            });
            return object1;
        },
        touchable = function (touchHere) {
            return wraptry(function () {
                var doc = touchHere.document;
                return !!doc;
            }, function () {
                return BOOLEAN_FALSE;
            });
        },
        definitions = [],
        Odette = function (global, WHERE, version, fn, alt, hoistFrom) {
            function Application(name, parent) {
                this.SCOPED = BOOLEAN_TRUE;
                this.CREATED_AT = now();
                this.VERSION = name;
                this.application = this;
                this.missedDefinitions = [];
                this.definedAgainst = [];
                return this;
            }
            var AppPrototype = Application[PROTOTYPE];
            AppPrototype.extend = function (obj) {
                return this.merge(this, obj);
            };
            AppPrototype.merge = merge;
            AppPrototype.each = forOwn;
            AppPrototype.extend({
                exception: exception,
                destroy: noop,
                wraptry: wraptry,
                now: now,
                map: map,
                touchable: touchable,
                isVersionString: isVersionString,
                Odette: Odette,
                stringifyQuery: stringifyQuery,
                parseSearch: parseSearch,
                toJSON: function () {
                    return {
                        CREATED_AT: this.CREATED_AT,
                        VERSION: this.VERSION,
                        SCOPED: this.SCOPED,
                        WHERE: this.global.WHERE
                    };
                },
                /**
                 * Pass a function to this method to have it run each time the app encounters a new window. When this happens all functions passed to the undefine method are run to set up the window properly.
                 * @param {Function} this function will run everytime a new window is encountered after this point.
                 * @memberOf Odette
                 */
                undefine: function (handler) {
                    this.missedDefinitions.push(handler);
                    if (this.defining) {
                        handler.apply(this, [this, this.definingAgainst, this.definingWith]);
                    }
                    return this;
                },
                parody: function (list) {
                    var app = this,
                        i = 0,
                        extendor = {},
                        parent = app[PARENT];
                    for (; i < list[LENGTH]; i++) {
                        extendor[list[i]] = makeParody(parent, parent[list[i]]);
                    }
                    app.extend(extendor);
                    return app;
                },
                scope: function (name_, fn_) {
                    var name = name_ && isString(name_) ? name_ : this.VERSION;
                    var fn = name_ && (isFunction(name_) ? name_ : (isFunction(fn_) ? fn_ : NULL));
                    return this[PARENT].scope(name, fn);
                },
                block: function (fn) {
                    var app = this;
                    return fn.apply(app, [app, app._, app.factories]);
                },
                /**
                 * Proxy for the global Odette counter
                 * @memberof Odette
                 * @param {String=} category a category to pull the id from
                 */
                counter: function (category) {
                    return Odette.counter(category);
                },
                /**
                 Define an app definition
                 * @memberof Odette
                 * @param {Window} globl pass a window object to root the definition against
                 * @param {Object=} options options that the method, and queued methods can be passed
                 */
                definition: function (globl, options) {
                    var odebt, defs, opts, app = this;
                    if (app.definedAgainst.indexOf(globl) > -1) {
                        return app;
                    }
                    app.definedAgainst.push(globl);
                    odebt = globl.Odette;
                    opts = options || {};
                    if (app.defined) {
                        map(app.missedDefinitions, function (handler) {
                            handler.apply(app, [app, globl, opts]);
                        });
                    } else {
                        defs = definitions.slice(0);
                        definitions = [];
                        map(defs, function (definitionOptions) {
                            if (app.defining) {
                                exception(noFailures);
                            }
                            app.defining = BOOLEAN_TRUE;
                            app.definingAgainst = globl;
                            app.definingWith = opts;
                            wraptry(function () {
                                definitionOptions.handler.apply(app, [app, globl, opts]);
                                app.defining = BOOLEAN_FALSE;
                                app.defined = BOOLEAN_TRUE;
                            }, function (e) {
                                console.log(e);
                            });
                        });
                    }
                    if (app.defining) {
                        exception(noFailures);
                    }
                    return app;
                }
            });
            var loadScriptWithQueue = function (url_, handle) {
                var loading, finished, endpoints = {};
                return function (fn_) {
                    var focused, fn = fn_ || noop,
                        url = url_,
                        app = this,
                        application = this.global,
                        cachedContext = application.buildContext,
                        push = function () {
                            focused.queue.push(item);
                        },
                        item = {
                            app: app,
                            context: cachedContext,
                            handler: fn
                        };
                    if (isString(url)) {
                        url = returns(url);
                    }
                    url = url(app);
                    if (!url) {
                        return BOOLEAN_FALSE;
                    }
                    focused = endpoints[url] = endpoints[url] || {};
                    if (focused.finished) {
                        handle.apply(application, [item]);
                        fn.apply(item, [app]);
                    } else {
                        if (focused.loading) {
                            push();
                        } else {
                            focused.queue = [];
                            focused.loading = BOOLEAN_TRUE;
                            push();
                            application.makeScript(url, function () {
                                var queued = focused.queue.slice(0);
                                focused.loading = BOOLEAN_FALSE;
                                focused.finished = BOOLEAN_TRUE;
                                focused.queue = [];
                                application.registerVersion(app.VERSION);
                                application.map(queued, function (item) {
                                    handle.apply(application, [item]);
                                    item.handler(item.app);
                                });
                            }, cachedContext.document);
                        }
                    }
                    return focused.queue;
                };
            };
            wraptry(function () {
                var hoisted, alreadyTried = [];
                map(hoistFrom, function (hoistFrom) {
                    if (!global_[WHERE] && touchable(hoistFrom) && hoistFrom[WHERE]) {
                        hoisted = BOOLEAN_TRUE;
                        global_[WHERE] = hoistFrom[WHERE];
                    }
                });
            });
            var queue = [];
            var app, application = global_[WHERE] = global_[WHERE] || (function () {
                Odette.where.push(WHERE);
                return {
                    Application: Application,
                    Odette: Odette,
                    LOADED_CONTEXT: context,
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
                    loadedAgainst: [global],
                    queue: function (context, handler) {
                        queue.push({
                            context: context,
                            handler: handler
                        });
                        return this;
                    },
                    emptyQueue: function (fn) {
                        var shared = this,
                            queued = queue.slice(0),
                            current = shared.scope(),
                            previous = current.defining;
                        queue = [];
                        current.defining = BOOLEAN_TRUE;
                        map(queued, fn || function (q) {
                            q.handler.apply(q.context, [shared, current]);
                        });
                        current.defining = previous;
                        return shared;
                    },
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
                        var app, odebt, defs, definitionOptions, opts, context, application = this,
                            version = version_,
                            globl = globl_,
                            options = options_;
                        if (isObject(version)) {
                            options = globl;
                            globl = version;
                            version = application.scope().VERSION;
                        }
                        app = application.registerVersion(version);
                        return app.definition(globl, options);
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
                        scoped.block(fn);
                        return scoped;
                    },
                    hoist: function (windo, toHere) {
                        var application = this,
                            target = (toHere || context);
                        if (!windo) {
                            return BOOLEAN_FALSE;
                        }
                        if (windo === this.LOADED_CONTEXT) {
                            return BOOLEAN_TRUE;
                        }
                        // it has already been hoisted
                        if (application.loadedAgainst.indexOf(windo) + 1) {
                            return BOOLEAN_TRUE;
                        }
                        // we have access
                        if (application.touch(windo)) {
                            if (windo[application.WHERE]) {
                                target[application.WHERE] = windo[application.WHERE];
                            }
                            return target[application.WHERE];
                        } else {
                            return BOOLEAN_FALSE;
                        }
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
                    touch: touchable,
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
                    }
                };
            }());
            application.buildContext = global;
            app = application.get(version);
            if (!app) {
                app = application.registerVersion(version);
                if (fn) {
                    fn.apply(global_, [application, app]);
                }
            }
            if (alt) {
                alt.apply(global_, [application, app]);
            }
            return app;
        };
    return merge(Odette, {
        VERSION: odette_version,
        where: [],
        touchable: touchable,
        counter: (function () {
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
        }()),
        definition: function (context, handler) {
            definitions.push({
                context: context,
                handler: handler
            });
        }
    });
}));