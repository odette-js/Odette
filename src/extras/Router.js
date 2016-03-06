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