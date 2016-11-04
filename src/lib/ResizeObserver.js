var ResizeObserver = factories.ResizeObserver = app.block(function (app, window, options) {
    var rect = function (el) {
            return _.box(el, el.ownerDocument.defaultView);
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
        bindResizeObserver = function (observer, cb) {
            var queue, id = app.counter('resize-observer'),
                q = function () {
                    var queue = hash.queue;
                    if (!queue.length()) {
                        hash.remove();
                        return;
                    }
                    var resized = hash.resized = queue.reduce(function (memo, watcher) {
                        var el = watcher.target;
                        if (!el.parentNode) {
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
                add: function () {
                    if (hash.afId) {
                        return;
                    }
                    hash.afId = AF.queue(q);
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
                    contentRect: rect(target)
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
        constructor: function (cb) {
            if (!isFunction(cb)) {
                return this;
            }
            bindResizeObserver(this, cb);
        }
    });
});