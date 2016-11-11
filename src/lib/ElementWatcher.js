var ELEMENT_WATCHER = 'ElementWatcher',
    WATCHERS = 'watchers',
    RESIZE = 'resize',
    BLINKING = 'blinking',
    DISABLED = 'disabled',
    OBSERVER = 'observer',
    AF = _.AF,
    ElementWatcher = factories[ELEMENT_WATCHER] = app.block(function (app) {
        var ro, namespacer = function () {
            return 'watcher-' + app.counter();
        };
        return factories.Registry.extend(ELEMENT_WATCHER, {
            namespace: function () {
                return this.get(WATCHERS, 'namespace', namespacer);
            },
            element: function (object) {
                return object && object.isValidDomManager ? object.element() : object;
            },
            observe: function (el_, fn) {
                var elementWatcher = this,
                    el = elementWatcher.element(el_);
                if (!el) {
                    return elementWatcher;
                }
                elementWatcher[OBSERVER]().observe(el);
                elementWatcher.watcher(el).push(fn);
                return elementWatcher;
            },
            unobserve: function (el_, fn) {
                var unobserve, dropped, observer, elementWatcher = this,
                    el = elementWatcher.element(el_),
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
                dropped.mark(DISABLED);
                elementWatcher[OBSERVER]().unobserve(el);
                return elementWatcher;
            },
            resize: function (observation) {
                var elementWatcher = this,
                    target = observation && observation.target,
                    watcher = elementWatcher.get(WATCHERS, target[__ELID__]);
                if (!watcher || watcher.is(DISABLED)) {
                    return elementWatcher;
                }
                if (watcher.is(BLINKING)) {
                    watcher.unmark(BLINKING);
                } else {
                    watcher.slice(0).eachCallBound(observation.contentRect);
                }
            },
            observer: function () {
                return this.get(INSTANCES, OBSERVER, function (registry) {
                    return ro || (ro = new ResizeObserver(function (observations) {
                        duff(observations, registry.resize, registry);
                    }, registry.interval));
                });
            },
            watcher: function (el) {
                return this.get(WATCHERS, this.element(el)[__ELID__], function () {
                    return Collection();
                });
            },
            blink: function (el) {
                this.watcher(el).mark(BLINKING);
                return this;
            }
        });
    });
app.defineDirective(ELEMENT_WATCHER, ElementWatcher);