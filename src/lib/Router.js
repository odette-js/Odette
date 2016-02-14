application.scope().module('Router', function (module, app, _, factories, $) {
    // Cached regex for stripping a leading hash/slash and trailing space.
    var routeStripper = /^[#\/]|\s+$/g,
        // Cached regex for stripping leading and trailing slashes.
        rootStripper = /^\/+|\/+$/g,
        // Cached regex for stripping urls of hash.
        pathStripper = /#.*$/,
        COLON0 = ':0',
        jsNull = 'javascript' + COLON0,
        // Has the history handling already been started?
        Router = factories.Events.extend('Router', {
            constructor: function (windo, options) {
                var router = this;
                factories.Events[CONSTRUCTOR].call(router, options);
                router.handlers = [];
                router.watching = windo;
                router.checkUrl = _.bind(router.checkUrl, router);
                return router;
            },
            // The default interval to poll for hash changes, if necessary, is
            // twenty times a second.
            interval: 50,
            // Are we at the app root?
            atRoot: function () {
                var path = this.watching.location.pathname.replace(/[^\/]$/, '$&/');
                return path === this.root && !this.getSearch();
            },
            // Does the pathname match the root?
            matchRoot: function () {
                var path = this.decodeFragment(this.watching.location.pathname);
                var root = path.slice(0, this.root.length - 1) + '/';
                return root === this.root;
            },
            // Unicode characters in `location.pathname` are percent encoded so they're
            // decoded for comparison. `%25` should not be decoded since it may be part
            // of an encoded parameter.
            decodeFragment: function (fragment) {
                return decodeURI(fragment.replace(/%25/g, '%2525'));
            },
            // In IE6, the hash fragment and search params are incorrect if the
            // fragment contains `?`.
            getSearch: function () {
                var match = this.watching.location.href.replace(/#.*/, '').match(/\?.+/);
                return match ? match[0] : '';
            },
            // Gets the true hash value. Cannot use location.hash directly due to bug
            // in Firefox where location.hash will always be decoded.
            getHash: function (watching) {
                var match = (watching || this.watching).location.href.match(/#(.*)$/);
                return match ? match[1] : '';
            },
            // Get the pathname and search params, without the root.
            getPath: function () {
                var path = this.decodeFragment(this.watching.location.pathname + this.getSearch()).slice(this.root.length - 1);
                return path.charAt(0) === '/' ? path.slice(1) : path;
            },
            // Get the cross-browser normalized URL fragment from the path or hash.
            getFragment: function (fragment) {
                if (fragment == NULL) {
                    if (this._usePushState || !this._wantsHashChange) {
                        fragment = this.getPath();
                    } else {
                        fragment = this.getHash();
                    }
                }
                return fragment.replace(routeStripper, '');
            },
            // Start the hash change handling, returning `BOOLEAN_TRUE` if the current URL matches
            // an existing route, and `BOOLEAN_FALSE` otherwise.
            start: function (options) {
                var root, router = this;
                if (Router.started) {
                    return router;
                }
                Router.started = BOOLEAN_TRUE;
                // Figure out the initial configuration. Do we need an iframe?
                // Is pushState desired ... is it available?
                router.options = _.extend({
                    root: '/'
                }, router.options, options);
                router.root = router.options.root;
                router._wantsHashChange = router.options.hashChange !== BOOLEAN_FALSE;
                router._hasHashChange = 'onhashchange' in router.watching && (document.documentMode === UNDEFINED || document.documentMode > 7);
                router._useHashChange = router._wantsHashChange && router._hasHashChange;
                router._wantsPushState = !!router.options.pushState;
                router._hasPushState = !!(router.watching.history && router.watching.history.pushState);
                router._usePushState = router._wantsPushState && router._hasPushState;
                router.fragment = router.getFragment();
                // Normalize root to always include a leading and trailing slash.
                router.root = ('/' + router.root + '/').replace(rootStripper, '/');
                // Transition from hashChange to pushState or vice versa if both are
                // requested.
                if (router._wantsHashChange && router._wantsPushState) {
                    // If we've started off with a route from a `pushState`-enabled
                    // browser, but we're currently in a browser that doesn't support it...
                    if (!router._hasPushState && !router.atRoot()) {
                        root = router.root.slice(0, -1) || '/';
                        router.location.replace(root + '#' + router.getPath());
                        // Return immediately as browser will do redirect to new url
                        return BOOLEAN_TRUE;
                        // Or if we've started out with a hash-based route, but we're currently
                        // in a browser where it could be `pushState`-based instead...
                    } else if (router._hasPushState && router.atRoot()) {
                        router.navigate(router.getHash(), {
                            replace: BOOLEAN_TRUE
                        });
                    }
                }
                // Proxy an iframe to handle location events if the browser doesn't
                // support the `hashchange` event, HTML5 history, or the user wants
                // `hashChange` but not `pushState`.
                if (!router._hasHashChange && router._wantsHashChange && !router._usePushState) {
                    router.iframe = document.createElement('iframe');
                    router.iframe.src = jsNull;
                    router.iframe.style.display = NONE;
                    router.iframe.tabIndex = -1;
                    var body = document.body;
                    // Using `appendChild` will throw on IE < 9 if the document is not ready.
                    var iWindow = body.insertBefore(router.iframe, body.firstChild).contentWindow;
                    iWindow.document.open();
                    iWindow.document.close();
                    iWindow.location.hash = '#' + router.fragment;
                }
                // Add a cross-platform `addEventListener` shim for older browsers.
                var addEventListener = router.watching.addEventListener || function (eventName, listener) {
                    return attachEvent('on' + eventName, listener);
                };
                // Depending on whether we're using pushState or hashes, and whether
                // 'onhashchange' is supported, determine how we check the URL state.
                if (router._usePushState) {
                    addEventListener('popstate', router.checkUrl, BOOLEAN_FALSE);
                } else if (router._useHashChange && !router.iframe) {
                    addEventListener('hashchange', router.checkUrl, BOOLEAN_FALSE);
                } else if (router._wantsHashChange) {
                    router._checkUrlInterval = setInterval(router.checkUrl, router.interval);
                }
                if (!router.options.silent) return router.loadUrl();
            },
            // Disable Backbone.watching.history, perhaps temporarily. Not useful in a real app,
            // but possibly useful for unit testing Routers.
            stop: function () {
                // Add a cross-platform `removeEventListener` shim for older browsers.
                var removeEventListener = this.watching.removeEventListener || function (eventName, listener) {
                    return detachEvent('on' + eventName, listener);
                };
                // Remove window listeners.
                if (this._usePushState) {
                    removeEventListener('popstate', this.checkUrl, BOOLEAN_FALSE);
                } else if (this._useHashChange && !this.iframe) {
                    removeEventListener('hashchange', this.checkUrl, BOOLEAN_FALSE);
                }
                // Clean up the iframe if necessary.
                if (this.iframe) {
                    document.body.removeChild(this.iframe);
                    this.iframe = null;
                }
                // Some environments will throw when clearing an undefined interval.
                if (this._checkUrlInterval) {
                    clearInterval(this._checkUrlInterval);
                }
                Router.started = BOOLEAN_FALSE;
            },
            // Add a route to be tested when the fragment changes. Routes added later
            // may override previous routes.
            route: function (route, callback) {
                this.handlers.unshift({
                    route: route,
                    callback: callback
                });
            },
            // Checks the current URL to see if it has changed, and if it has,
            // calls `loadUrl`, normalizing across the hidden iframe.
            checkUrl: function (e) {
                var current = this.getFragment();
                // If the user pressed the back button, the iframe's hash will have
                // changed and we should use that for comparison.
                if (current === this.fragment && this.iframe) {
                    current = this.getHash(this.iframe.contentWindow);
                }
                if (current === this.fragment) return BOOLEAN_FALSE;
                if (this.iframe) this.navigate(current);
                this.loadUrl();
            },
            // Attempt to load the current URL fragment. If a route succeeds with a
            // match, returns `BOOLEAN_TRUE`. If no defined routes matches the fragment,
            // returns `BOOLEAN_FALSE`.
            loadUrl: function (fragment) {
                // If the root doesn't match, no routes can match either.
                if (!this.matchRoot()) return BOOLEAN_FALSE;
                fragment = this.fragment = this.getFragment(fragment);
                return _.some(this.handlers, function (handler) {
                    if (handler.route.test(fragment)) {
                        handler.callback(fragment);
                        return BOOLEAN_TRUE;
                    }
                });
            },
            // Save a fragment into the hash history, or replace the URL state if the
            // 'replace' option is passed. You are responsible for properly URL-encoding
            // the fragment in advance.
            //
            // The options object can contain `trigger: BOOLEAN_TRUE` if you wish to have the
            // route callback be fired (not usually desirable), or `replace: BOOLEAN_TRUE`, if
            // you wish to modify the current URL without adding an entry to the history.
            navigate: function (fragment, options) {
                if (!Router.started) return BOOLEAN_FALSE;
                if (!options || options === BOOLEAN_TRUE) options = {
                    trigger: BOOLEAN_TRUE
                };
                options.trigger = options.trigger === UNDEFINED ? BOOLEAN_TRUE : BOOLEAN_FALSE;
                // Normalize the fragment.
                fragment = this.getFragment(fragment || '');
                // Don't include a trailing slash on the root.
                var root = this.root;
                if (fragment === '' || fragment.charAt(0) === '?') {
                    root = root.slice(0, -1) || '/';
                }
                var url = root + fragment;
                // Strip the hash and decode for matching.
                fragment = this.decodeFragment(fragment.replace(pathStripper, ''));
                if (this.fragment && this.fragment === fragment) {
                    return;
                }
                this.fragment = fragment;
                // If pushState is available, we use it to set the fragment as a real URL.
                if (this._usePushState) {
                    this.watching.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
                    // If hash changes haven't been explicitly disabled, update the hash
                    // fragment to store history.
                } else if (this._wantsHashChange) {
                    this._updateHash(this.watching.location, fragment, options.replace);
                    if (this.iframe && (fragment !== this.getHash(this.iframe.contentWindow))) {
                        var iWindow = this.iframe.contentWindow;
                        // Opening and closing the iframe tricks IE7 and earlier to push a
                        // history entry on hash-tag change.  When replace is BOOLEAN_TRUE, we don't
                        // want this.
                        if (!options.replace) {
                            iWindow.document.open();
                            iWindow.document.close();
                        }
                        this._updateHash(iWindow.location, fragment, options.replace);
                    }
                    // If you've told us that you explicitly don't want fallback hashchange-
                    // based history, then `navigate` becomes a page refresh.
                } else {
                    return this.watching.location.assign(url);
                }
                if (options.trigger) {
                    return this.loadUrl(fragment);
                }
            },
            // Update the hash location, either replacing the current entry, or adding
            // a new one to the browser history.
            _updateHash: function (location, fragment, replace) {
                if (replace) {
                    var href = location.href.replace(/(javascript:|#).*$/, '');
                    location.replace(href + '#' + fragment);
                } else {
                    // Some browsers require that `hash` contains a leading #.
                    location.hash = '#' + fragment;
                }
            }
        }, BOOLEAN_TRUE),
        started = Router.started = BOOLEAN_FALSE,
        router = app.router = Router(window);
    // console.log(router);
    $(function () {
        return !Router.started && router.start({
            pushState: true
        });
    });
});