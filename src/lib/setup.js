
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