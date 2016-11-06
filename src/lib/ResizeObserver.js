var ResizeObserver = factories.ResizeObserver = app.block(function (app, window, options) {
    var rect = function (el) {
            var doc;
            return _.box(el, (doc = el.ownerDocument) ? doc.defaultView : el.defaultView || el);
        },
        list = toArray('height,width,paddingTop,paddingRight,paddingBottom,paddingLeft,borderTop,borderRight,borderBottom,borderLeft'),
        diff = function (previous, next) {
            return find(list, function (item) {
                return previous[item] !== next[item];
            });
        },
        observerMap = {},
        getFromMap = function (observer) {
            return observerMap[observer.id];
        },
        elementEventDispatcher = _.elementEventDispatcher,
        bindResizeObserver = function (observer, cb, interval) {
            var queue, id = app.counter('resize-observer'),
                q = function () {
                    var queue = hash.queue;
                    if (!queue.length()) {
                        hash.remove();
                        return;
                    }
                    var resized = hash.resized = queue.reduce(function (memo, watcher) {
                        var el = watcher.target;
                        if (watcher.isEl && !el.parentNode) {
                            return;
                        }
                        var client = rect(el);
                        if (watcher.isActive || !diff(watcher.contentRect, client)) {
                            return;
                        }
                        watcher.contentRect = client;
                        watcher.isActive = BOOLEAN_TRUE;
                        memo.watchers.push(watcher);
                        memo.observations.push({
                            // might want to take some of these properties off
                            contentRect: client,
                            target: watcher.target
                        });
                    }, {
                        watchers: [],
                        observations: []
                    });
                    if (!resized.watchers.length) {
                        return;
                    }
                    wraptry(function () {
                        cb(resized.observations);
                    }, function () {
                        elementEventDispatcher(window, new ErrorEvent('ResizeObserver loop completed with undelivered notifications.'));
                    }, function () {
                        duff(resized.watchers, function (watcher) {
                            watcher.isActive = BOOLEAN_FALSE;
                        });
                    });
                };
            observer.id = id;
            var hash = observerMap[id] = {
                observer: observer,
                queue: (queue = Collection()),
                resized: [],
                id: id,
                interval: interval,
                add: function () {
                    if (hash.afId) {
                        return;
                    }
                    hash.afId = AF.interval(baseClamp(hash.interval, 15), q);
                },
                remove: function () {
                    AF.dequeue(hash.afId);
                    delete hash.afId;
                }
            };
        };
    return factories.Directive.extend('ResizeObserver', {
        observe: function (target) {
            var hash = getFromMap(this),
                queue = hash.queue;
            hash.add();
            if (!queue.findWhere({
                    target: target
                })) {
                hash.queue.push({
                    target: target,
                    contentRect: rect(target),
                    isEl: isWindow(target) ? BOOLEAN_FALSE : isElement(target)
                });
            }
        },
        unobserve: function (target) {
            getFromMap(this).queue.removeWhere({
                target: target
            });
        },
        disconnect: function () {
            getFromMap(this).remove();
        },
        constructor: function (cb, interval) {
            if (!isFunction(cb)) {
                return this;
            }
            bindResizeObserver(this, cb, interval);
        }
    });
});