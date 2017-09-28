var ResizeObserver = factories.ResizeObserver = app.block(function (app) {
    var doc = window.document;
    if (!doc) {
        return noop;
    }
    var rect = function (el) {
            return {
                client: _.box(el, el.ownerDocument.defaultView),
                parent: !!el.parentNode
            };
        },
        list = toArray('height,width,paddingTop,paddingRight,paddingBottom,paddingLeft,borderTop,borderRight,borderBottom,borderLeft'),
        diff = function (previous, next, parent) {
            var client = previous.client;
            return parent !== previous.parent || find(list, function (item) {
                return client[item] !== next[item];
            });
        },
        observerMap = {},
        getFromMap = function (observer) {
            return observerMap[observer.id];
        },
        body = doc.body,
        key = body.previousElemenetSibling ? 'previousElemenetSibling' : 'previousSibling',
        elementEventDispatcher = _.elementEventDispatcher,
        ResizeObserverError = function () {
            elementEventDispatcher(window, new ErrorEvent('ResizeObserver loop completed with undelivered notifications.'));
        },
        bindResizeObserver = function (observer, cb, interval) {
            var queue, id = app.counter('resize-observer'),
                q = function () {
                    var queue = hash.queue;
                    if (!queue.length()) {
                        hash.dequeue();
                        return;
                    }
                    var resized = hash.resized = queue.reduce(function (memo, watcher) {
                        var el = watcher.target;
                        var client = rect(el);
                        if (watcher.isActive() || !diff(watcher.previous, client.client, client.parent)) {
                            return;
                        }
                        watcher.previous = client;
                        watcher.isActive = returns.true;
                        memo.watchers.push(watcher);
                        memo.observations.push(new ResizeObserverEntry(client.client, watcher.target));
                    }, {
                        watchers: [],
                        observations: []
                    });
                    if (!resized.watchers.length) {
                        return;
                    }
                    hash.order(resized.observations);
                    wraptry(function () {
                        cb(resized.observations);
                    }, ResizeObserverError, function () {
                        forEach(resized.watchers, function (watcher) {
                            watcher.isActive = returns.false;
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
                    hash.afId = AF.interval(clamp(hash.interval, 15), q);
                },
                dequeue: function () {
                    var afId = hash.afId;
                    delete hash.afId;
                    AF.dequeue(afId);
                },
                disconnect: once(function () {
                    queue.forEachRight(hash.remove);
                    hash.dequeue();
                }),
                remove: function (watcher, idx) {
                    if (idx + 1) {
                        return queue.removeAt(idx);
                    } else {
                        return queue.remove(watcher);
                    }
                },
                order: function (list) {
                    // list.sort(function (a) {
                    //     var parent = a.target;
                    //     var doc = parent.ownerDocument;
                    //     while (parent !== doc) {
                    //         //
                    //         parent = parent.parentNode;
                    //     }
                    // });
                }
            };
        };

    function ResizeObserverEntry(client, target) {
        this.contentRect = client;
        this.target = target;
        return this;
    }
    return factories.Directive.extend('ResizeObserver', {
        observe: function (target) {
            var hash = getFromMap(this),
                queue = hash.queue;
            hash.add();
            // if (!isElement(target)) {
            //     exception('this is an exception');
            // }
            if (!queue.findWhere({
                    target: target
                })) {
                hash.queue.push({
                    target: target,
                    previous: rect(target),
                    isEl: isWindow(target) ? BOOLEAN_FALSE : isElement(target),
                    isActive: returns.false
                });
            }
        },
        unobserve: function (target) {
            getFromMap(this).queue.removeWhere({
                target: target
            });
        },
        disconnect: function () {
            getFromMap(this).disconnect();
        },
        constructor: function (cb, interval) {
            if (!isFunction(cb)) {
                return this;
            }
            bindResizeObserver(this, cb, interval);
        }
    });
});