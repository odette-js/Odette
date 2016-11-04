var ELEMENT_WATCHER = 'ElementWatcher',
    WATCHERS = 'watchers',
    RESIZE = 'resize',
    AF = _.AF,
    ElementWatcher = factories[ELEMENT_WATCHER] = app.block(function (app) {
        var namespacer = function () {
                return 'watcher-' + app.counter();
            },
            element = function (el) {
                return el && el.isValidDomManager ? el.element() : el;
            };
        return factories.Registry.extend(ELEMENT_WATCHER, {
            namespace: function () {
                return this.get(WATCHERS, 'namespace', namespacer);
            },
            observe: function (el_, fn) {
                var elementWatcher = this,
                    el = element(el_);
                if (!el) {
                    return elementWatcher;
                }
                elementWatcher.observer().observe(el);
                elementWatcher.watcher(el).push(fn);
                return elementWatcher;
            },
            unobserve: function (el_, fn) {
                var unobserve, dropped, observer, elementWatcher = this,
                    el = element(el_),
                    id = el[__ELID__],
                    watcher = elementWatcher.get(WATCHERS, id),
                    namespace = elementWatcher.namespace();
                if (!watcher) {
                    return elementWatcher;
                }
                if (fn) {
                    watcher.remove(fn);
                    if (!watcher.length()) {
                        unobserve = BOOLEAN_TRUE;
                    }
                } else {
                    unobserve = BOOLEAN_TRUE;
                }
                if (!unobserve) {
                    return elementWatcher;
                }
                dropped = this.drop(WATCHERS, el[__ELID__]);
                if (!dropped) {
                    return elementWatcher;
                }
                dropped.mark('disabled');
                observer = this.get(INSTANCES, 'observer');
                observer.unobserve(el);
                return elementWatcher;
            },
            sizeChange: function (observation) {
                var elementWatcher = this,
                    target = observation && observation.target,
                    watcher = elementWatcher.get(WATCHERS, target[__ELID__]);
                if (watcher.is('disabled')) {
                    return elementWatcher;
                }
                if (watcher.is('blinking')) {
                    watcher.unmark('blinking');
                } else {
                    watcher.eachCallBound(observation.contentRect);
                }
            },
            observer: function () {
                return this.get(INSTANCES, 'observer', function (registry) {
                    return new ResizeObserver(function (list) {
                        duff(list, registry.sizeChange, registry);
                    });
                });
            },
            watcher: function (el) {
                return this.get(WATCHERS, element(el)[__ELID__], function () {
                    return Collection();
                });
            },
            blink: function (el) {
                this.watcher(el).mark('blinking');
                return this;
            }
        });
    });
app.defineDirective(ELEMENT_WATCHER, ElementWatcher);