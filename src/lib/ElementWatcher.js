app.undefine(function (app, window, options) {
    var box = _.box;
    var rect = function (el) {
        return box(el, el.ownerDocument.defaultView);
    };
    var list = toArray('height,width,paddingTop,paddingRight,paddingBottom,paddingLeft,borderTop,borderRight,borderBottom,borderLeft');
    var diff = function (previous, next) {
        return find(list, function (item) {
            return previous[item] !== next[item];
        });
    };
    var observerMap = {};
    var getFromHash = function (observer) {
        return observerMap[observer.id];
    };
    var bindResizeObserver = function (observer, cb) {
        var id = app.counter('resize-observer');
        var hash = observerMap[id] = {
            observer: observer,
            queue: (queue = Collection()),
            resized: [],
            add: function () {
                if (hash.afId) {
                    return;
                }
                hash.afId = AF.queue(function () {
                    var queue = hash.queue;
                    if (!queue.length()) {
                        hash.remove();
                        return;
                    }
                    var resized = hash.resized = queue.reduce(function (memo, watcher) {
                        var el = watcher.target;
                        var client = rect(el);
                        if (watcher.isActive || diff(watcher.contentRect, client)) {
                            return;
                        }
                        watcher.contentRect = client;
                        watcher.isActive = BOOLEAN_TRUE;
                        memo.push({
                            // might want to take some of these properties off
                            contentRect: client,
                            target: watcher.target
                        });
                    }, []);
                    if (resized.length) {
                        wraptry(function () {
                            cb(resized);
                        }, function () {
                            elementEventDispatcher(window, new ErrorEvent('ResizeObserver loop completed with undelivered notifications.'));
                        });
                    }
                });
            },
            remove: function () {
                AF.dequeue(hash.afId);
                delete hash.afId;
            }
        };
    };
    if (!window.ResizeObserver) {
        options.ResizeObserver = window.ResizeObserver = factories.Directive.extend('ResizeObserver', {
            observe: function (target) {
                var hash = getFromHash(this);
                hash.add();
                hash.queue.push({
                    target: target,
                    client: rect(target)
                });
            },
            unobserve: function (target) {
                getFromHash(this).queue.removeWhere({
                    target: target
                });
            },
            disconnect: function () {
                getFromHash(this).remove();
            },
            constructor: function (cb) {
                if (!isFunction(cb)) {
                    return this;
                }
                bindResizeObserver(this);
            }
        });
    }
});
var ELEMENT_WATCHER = 'ElementWatcher';
var WATCHERS = 'watchers';
var RESIZE = 'resize';
var AF = _.AF;
factories[ELEMENT_WATCHER] = app.defineDirective(ELEMENT_WATCHER, app.block(function (app) {
    var namespacer = function () {
        return 'watcher-' + app.counter();
    };
    return factories.Registry.extend(ELEMENT_WATCHER, {
        namespace: function () {
            return this.get(WATCHERS, 'namespace', namespacer);
        },
        watch: function (el, fn) {
            var cached, elementWatcher = this,
                id = el[__ELID__],
                count = watchers.count && ++watchers.count;
            elementWatcher.get(WATCHERS, id, function () {
                return elementWatcher.setupResize(el);
            });
            el.on(RESIZE, elementWatcher.namespace(), fn);
            return elementWatcher;
        },
        observeChange: function () {},
        setupResize: function (el) {
            var fn, queue, elementWatcher = this,
                watcher = {
                    el: el,
                    count: 1,
                    queue: Collection(),
                    observeChange: function () {
                        if (watcher.blinking) {
                            watcher.blinking = BOOLEAN_FALSE;
                            return;
                        }
                        watcher.queue.eachCallBound({
                            height: watcher.height,
                            width: watcher.width
                        });
                    }
                };
            elementWatcher.bind(watcher);
            return watcher;
        },
        bind: function (watcher) {
            var fn, el = watcher.el;
            if (el.is('window')) {
                fn = watcher.fn = watcher.observeChange;
                el.on('resize', elementWatcher.namespace(), fn);
            } else {
                watcher.id = AF.queue(function () {
                    var client = el.client();
                    if (client.height === watcher.height && client.width === watcher.width) {
                        return;
                    }
                    var height = watcher.height = client.height;
                    var width = watcher.width = client.width;
                    watcher.observeChange();
                });
            }
        },
        observer: function () {
            return this.directive(REGISTRY).get(INSTANCES, 'observer', function (registry) {
                var watcher = registry.target;
                return new ResizeObserver(watcher.observeChange.bind(watcher));
            });
        },
        unbind: function (watcher) {
            var el = watcher.el;
            if (el.is('window')) {
                el.off('resize', elementWatcher.namespace(), watcher.fn);
            } else {
                if (watcher.id) {
                    AF.dequeue(watcher.id);
                } else {
                    //
                }
            }
        },
        blink: function (el) {
            var watcher, elementWatcher = this;
            var result = (watcher = elementWatcher.get(WATCHERS, el[__ELID__])) && (watcher.blinking = BOOLEAN_TRUE);
            return elementWatcher;
        },
        stop: function (el, fn) {
            var elementWatcher = this,
                id = el[__ELID__],
                watcher = elementWatcher.get(WATCHERS, id),
                namespace = elementWatcher.namespace();
            if (!watcher) {
                return elementWatcher;
            }
            if (!fn) {
                watcher.count = 0;
            } else {
                watcher.count--;
            }
            if (!watcher.count) {
                elementWatcher.drop(WATCHERS, id);
                if (watcher.id) {
                    AF.dequeue(watcher.id);
                }
            }
            return elementWatcher;
        }
    });
}));