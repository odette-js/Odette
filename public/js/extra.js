app.module('Socket', function (module, app, _, factories) {
    var list = _.gapSplit('open message error close'),
        delegate = function (socket) {
            _.duff(list, function (evnt) {
                socket.pipe.addEventListener(evnt, socket.handlers[evnt]);
            });
        },
        undelegate = function (socket) {
            _.duff(list, function (evnt) {
                socket.pipe.removeEventListener(evnt, socket.handlers[evnt]);
            });
        },
        handlers = {
            open: function () {
                this.isConnected = true;
                return this.dispatchEvent('connect');
            },
            message: function (evnt) {
                var promise, data = parse(evnt.data);
                if (data.type === 'success') {
                    promise = this.promises.get(ID, data.packet);
                    return promise && promise.resolve();
                } else {
                    if (data.type === 'failure') {
                        promise = this.promises.get(ID, data.packet);
                        return promise && promise.reject();
                    } else {
                        if (data.command) {
                            return this.dispatchEvent(data.command, data.packet);
                        }
                    }
                }
            },
            close: function () {
                this.isConnected = false;
                return this.dispatchEvent('disconnect');
            },
            error: function (evnt) {
                this.promises.eachCall('reject');
                return this.dispatchEvent(evnt.data.type, evnt.data.packet);
            }
        },
        SocketConstructor = (window.MozWebSocket || window.WebSocket),
        messageId = 0,
        Socket = _.Socket = factories.Container.extend('Socket', {
            constructor: function (options) {
                var socket = this;
                socket.handlers = _.foldl(list, function (memo, item) {
                    memo[item] = _.bind(handlers[item], socket);
                    return memo;
                }, {});
                if (isString(options)) {
                    options = {
                        path: options
                    };
                }
                factories.Container[CONSTRUCTOR].call(socket, options);
                socket.promises = factories.Collection();
                if (socket.get('autoConnect')) {
                    socket.connect();
                }
                return socket;
            },
            connect: function (path_) {
                var url, socket = this,
                    path = path_ || socket.get('path'),
                    formerConnect = socket.connectPromise,
                    promise = socket.connectPromise = _.Promise();
                if (path && !socket.isConnected) {
                    promise.listenTo(socket, 'connect', promise.resolve);
                    url = parseUrl(path).toString().replace('http', 'ws');
                    socket.pipe = socket.pipe || new SocketConstructor(url);
                    delegate(socket);
                }
                if (formerConnect) {
                    formerConnect.reject();
                }
                return promise;
            },
            disconnect: function () {
                var socket = this;
                if (socket.pipe && socket.isConnected) {
                    socket.pipe.close();
                    socket.isConnected = false;
                    undelegate(socket);
                    delete socket.pipe;
                }
                if (socket.connectPromise) {
                    socket.connectPromise.reject();
                }
                return socket;
            },
            emit: function (command, data_, type_) {
                var socket = this,
                    data = data_ || {},
                    promise = _.Promise();
                if (!socket.isConnected) {
                    return promise;
                }
                var messageID = (messageId++) + EMPTY_STRING;
                socket.promises.push(promise);
                socket.promises.register(ID, messageID, promise);
                socket.pipe.send(stringify({
                    type: type_ || 'message',
                    command: command,
                    data: data,
                    id: messageID
                }));
                return promise;
            },
            received: function (data) {
                return this.isConnected ? this.emit(NULL, data, 'received') : _.Promise();
            }
        });
});
application.scope().module('Router', function (module, app, _, factories) {
    var EMPTY_STRING = '',
        NULL = null,
        SLASH = '/',
        ROUTES = 'routes',
        HISTORY = 'history',
        WATCHING = 'watching',
        SUPPORTS_PUSH = 'supportsPush',
        watchingEvents = 'popstate hashchange',
        Router = factories.Events.extend('Router', {
            constructor: function (watching, config) {
                var router = this;
                router.flush();
                router[WATCHING] = watching;
                router[SUPPORTS_PUSH] = router[WATCHING].history.pushState;
                router.config(config);
                return router;
            },
            parsePath: function (regexp) {
                return isString(regexp) ? this.parseString(regexp) : regexp;
            },
            parseString: function (string) {
                var router = this;
                return new RegExp('^\/' + router.clearSlashes(_.map(string.split(SLASH), function (string) {
                    return string && string.replace(/\:(.*)/g, function (item) {
                        return '(.*)';
                    });
                }).join(SLASH)), 'gim');
            },
            config: function (options) {
                var router = this;
                router.mode = options && options.mode && options.mode == HISTORY && !!(router[SUPPORTS_PUSH]) ? HISTORY : 'hash';
                router.root = options && options.root ? (SLASH + router.clearSlashes(options.root) + SLASH) : SLASH;
                return router;
            },
            getFragment: function () {
                var match, router = this,
                    fragment = EMPTY_STRING;
                if (router.mode === HISTORY) {
                    fragment = router.clearSlashes(decodeURI(location.pathname + location.search));
                    fragment = fragment.replace(/\?(.*)$/, EMPTY_STRING);
                    fragment = router.root != SLASH ? fragment.replace(router.root, EMPTY_STRING) : fragment;
                } else {
                    match = router[WATCHING].location.href.match(/#(.*)$/);
                    fragment = match ? match[1] : EMPTY_STRING;
                }
                return router.clearSlashes(fragment);
            },
            clearSlashes: function (path) {
                return path.toString().replace(/\/$/, EMPTY_STRING).replace(/^\//, EMPTY_STRING);
            },
            route: function (regexp, handler_, trigger) {
                var router = this;
                intendedObject(regexp, handler_, function (regexp, handler, third) {
                    var parsedRegExp = router.parsePath(regexp),
                        keys = parsedRegExp.exec(regexp),
                        keyedResult = _.map(keys.slice(1), function (key) {
                            // take off the (:)
                            return key.slice(1);
                        }),
                        trigger = third === UNDEFINED ? trigger : handler_;
                    router[ROUTES].push({
                        original: regexp,
                        trigger: trigger,
                        regexp: parsedRegExp,
                        keys: keyedResult,
                        handler: handler
                    });
                });
                return router;
            },
            use: function (handler) {
                return this.route('.*', handler);
            },
            remove: function (param) {
                var router = this;
                _.duffRev(router[ROUTES], function (r) {
                    if (r.handler === param || r.original === param.toString()) {
                        router[ROUTES].splice(i, 1);
                    }
                });
                return router;
            },
            flush: function () {
                var router = this;
                router[ROUTES] = [];
                router.mode = NULL;
                router.root = SLASH;
                return router;
            },
            check: function () {
                var fragment, router = this;
                if (router.current === router.getFragment()) {
                    return router;
                }
                fragment = router.current = router.getFragment();
                _.duff(router[ROUTES], function (route) {
                    var variables = route.regexp.lastIndex = 0,
                        match = route.regexp.exec(SLASH + fragment);
                    if (!match) {
                        return;
                    }
                    match.shift();
                    variables = _.foldl(match, function (memo, item, index) {
                        memo[route.keys[index]] = item;
                        return memo;
                    }, {});
                    route.handler.call(router, variables);
                    variables = router.trigger && router.dispatchEvent(router.trigger, variables);
                });
                router.dispatchEvent('updatestate');
                return router;
            },
            start: function () {
                var ret, router = this,
                    current = router.getFragment(),
                    boundCheck = router._boundCheck = router._boundCheck || _.bind(router.check, router);
                router.stop();
                if (router[SUPPORTS_PUSH]) {
                    $(router[WATCHING]).on(watchingEvents, boundCheck);
                } else {
                    router.interval = setInterval(boundCheck, 50);
                }
                return router;
            },
            stop: function () {
                var router = this;
                if (router[SUPPORTS_PUSH]) {
                    $(router[WATCHING]).off(watchingEvents, router.boundCheck);
                } else {
                    ret = isNumber(router.interval) ? clearInterval(router.interval) : false;
                }
                return router;
            },
            navigate: function (path) {
                var router = this;
                path = path ? path : EMPTY_STRING;
                if (router.mode === HISTORY) {
                    history.pushState(NULL, NULL, router.root + router.clearSlashes(path));
                } else {
                    router[WATCHING].location.href = router[WATCHING].location.href.replace(/#(.*)$/, EMPTY_STRING) + '#' + path;
                }
                return router;
            }
        }, true),
        router = app.router = Router(window).navigate(SLASH).start();
});
application.scope().module('LocalStorage', function (module, app, _, factories) {
    var LocalStorage = factories.Directive.extend('LocalStorage', {
        prefix: '',
        constructor: function (win) {
            this.global = win;
            return this;
        },
        get: function (key) {
            return _.parse(this.global.localStorage.getItem(this.prefix + key));
        },
        set: function (key, value) {
            var storage = this;
            intendedObject(key, value, function (key, value) {
                storage.global.localStorage.setItem(storage.prefix + key, _.stringify(value));
            });
            return this;
        },
        clear: function () {
            return this.map(function (value_, key) {
                var value = _.parse(value_);
                this.unset(key);
                return value;
            });
        },
        parse: function () {
            return this.map(_.parse);
        },
        copy: function () {
            return _.parse(_.stringify(this.global.localStorage));
        },
        length: function () {
            return this.global.localStorage.length;
        },
        has: function (key) {
            return this.global.localStorage.key(this.prefix + key) != NULL;
        },
        unset: function (key) {
            this.global.localStorage.removeItem(this.prefix + key);
            return this;
        },
        map: function (parser) {
            return _.map(this.copy(), parser, this);
        },
        each: function (handler) {
            var copy = this.copy();
            _.each(copy, handler, this);
            return copy;
        }
    });
    _.exports({
        storage: LocalStorage(window)
    });
});