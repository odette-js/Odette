var ELEMENT_WATCHER = 'ElementWatcher',
    WATCHERS = 'watchers',
    RESIZE = 'resize',
    BLINKING = 'blinking',
    DISABLED = 'disabled',
    OBSERVER = 'observer',
    AF = _.AF,
    namespacer = function () {
        return 'watcher-' + app.counter();
    },
    ElementWatcher = factories[ELEMENT_WATCHER] = Registry.extend(ELEMENT_WATCHER, {
        namespace: function () {
            return this.get(WATCHERS, 'namespace', namespacer);
        },
        element: function (object) {
            return object && object.isValidDomManager ? object.element() : object;
        },
        observe: function (el_, fn) {
            var watcher, elementWatcher = this,
                el = elementWatcher.element(el_);
            if (!el) {
                return elementWatcher;
            }
            watcher = elementWatcher.watcher(el);
            if (isWindow(el)) {
                if (watcher.mark('eventAttached')) {
                    elementWatcher.owner$.returnsManager(el).on('resize', function () {
                        elementWatcher.resize({
                            target: el,
                            contentRect: box(el)
                        });
                    });
                }
            } else {
                elementWatcher[OBSERVER]().observe(el);
            }
            watcher.push(fn);
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
            dropped = this.drop(WATCHERS, id);
            if (!dropped) {
                return elementWatcher;
            }
            dropped.mark(DISABLED);
            if (watcher.unmark('eventAttached')) {
                //
            } else {
                elementWatcher[OBSERVER]().unobserve(el);
            }
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
                return registry.createObserver();
            });
        },
        createHandler: function () {
            var registry = this;
            return function (observations) {
                duff(observations, registry.resize, registry);
            };
        },
        createObserver: function () {
            return new ResizeObserver(this.createHandler(), this.interval);
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
app.undefine(function (app, windo, passed) {
    passed.$[ELEMENT_WATCHER] = ElementWatcher.extend({
        createObserver: function () {
            return passed.$.ResizeObserver(this.createHandler(), this.interval());
        }
    });
});
app.defineDirective(ELEMENT_WATCHER, function (one, two, three) {
    return one.owner$[ELEMENT_WATCHER](one, two, three);
});