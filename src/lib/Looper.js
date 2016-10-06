app.scope(function (app) {
    var lastAFId, lastTId, lastOverrideId, x = 0,
        lastTime = 0,
        frameTime = 0,
        int = _.pI,
        nowish = _.now,
        vendors = toArray('ms,moz,webkit,o'),
        RUNNING = 'running',
        HALTED = 'halted',
        STOPPED = 'stopped',
        DESTROYED = 'destroyed',
        LOOPER = 'Looper',
        TIMEOUT = 'Timeout',
        SET_TIMEOUT = 'set' + TIMEOUT,
        CLEAR_TIMEOUT = 'clear' + TIMEOUT,
        ANIMATION_FRAME = 'AnimationFrame',
        REQUEST_ANIMATION_FRAME = 'request' + ANIMATION_FRAME,
        UP_REQUEST_ANIMATION_FRAME = capitalize(REQUEST_ANIMATION_FRAME),
        CANCEL_ANIMATION_FRAME = 'cancel' + ANIMATION_FRAME,
        allLoopers = [],
        runningLoopers = [],
        eachCall = _.eachCall,
        time = _.time,
        remove = _.remove,
        running = BOOLEAN_FALSE,
        focused = BOOLEAN_TRUE,
        request = function (handler) {
            var nextFrame = Math.max(0, lastTime - frameTime);
            lastAFId = win[REQUEST_ANIMATION_FRAME](function () {
                // if this handler ever gets called, then you can call it focused
                focused = BOOLEAN_TRUE;
                handler();
            });
            if (!focused) {
                lastTId = win[SET_TIMEOUT](handler, nextFrame + 1);
            }
            if (Looper.playWhileBlurred) {
                lastOverrideId = win[SET_TIMEOUT](function () {
                    focused = BOOLEAN_FALSE;
                    handler();
                }, nextFrame + 50);
            }
        },
        basicHandler = function () {
            // snapshot the time
            frameTime = _.now();
            // clear all the things
            win[CANCEL_ANIMATION_FRAME](lastAFId);
            win[CLEAR_TIMEOUT](lastTId);
            win[CLEAR_TIMEOUT](lastOverrideId);
            // run the handlers
            var docManager = app.DocumentManager,
                currentlyRunning = runningLoopers.slice(0),
                dependant = docManager && docManager.dependency && docManager.dependency(),
                i = 0;
            for (; i < currentlyRunning[LENGTH]; i++) {
                currentlyRunning[i].run(frameTime);
            }
            // do it all over again
            teardown();
            return dependant && dependant();
        },
        setup = function () {
            running = BOOLEAN_TRUE;
            request(basicHandler);
        },
        teardown = function () {
            duff(runningLoopers.slice(0), function (looper, idx) {
                if (looper.is(HALTED) || looper.is(STOPPED) || looper.is(DESTROYED) || !looper[LENGTH]()) {
                    looper.stop();
                    runningLoopers.splice(idx, 1);
                }
            });
            running = BOOLEAN_FALSE;
            if (runningLoopers[LENGTH]) {
                setup();
            }
        },
        add = function (looper) {
            allLoopers.push(looper);
        },
        start = function (looper) {
            if (!has(runningLoopers, looper, BOOLEAN_TRUE)) {
                runningLoopers.push(looper);
            }
            if (!running) {
                setup();
            }
        },
        shim = (function () {
            for (; x < vendors[LENGTH] && !win[REQUEST_ANIMATION_FRAME]; ++x) {
                win[REQUEST_ANIMATION_FRAME] = win[vendors[x] + UP_REQUEST_ANIMATION_FRAME];
                win[CANCEL_ANIMATION_FRAME] = win[vendors[x] + capitalize(CANCEL_ANIMATION_FRAME)] || win[vendors[x] + 'Cancel' + UP_REQUEST_ANIMATION_FRAME];
            }
            if (!win[REQUEST_ANIMATION_FRAME]) {
                win[REQUEST_ANIMATION_FRAME] = function (callback) {
                    var currTime = now(),
                        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                        id = win.setTimeout(function () {
                            callback(currTime + timeToCall);
                        }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            if (!win[CANCEL_ANIMATION_FRAME]) {
                win[CANCEL_ANIMATION_FRAME] = function (id) {
                    win[CLEAR_TIMEOUT](id);
                };
            }
        }()),
        runner = function (tween, obj, lastrun) {
            tween.current = obj;
            if (!obj.filter(lastrun)) {
                return;
            }
            wraptry(function () {
                obj.fn(lastrun);
            }, function () {
                // takes queued object off of the queue
                tween.dequeue(obj.id);
            });
        },
        returnsNext = function () {
            return this.tween.lastRun;
        },
        actuallyDequeue = function (tween, obj) {
            tween.drop(ID, obj.id);
            return tween.remove(obj);
        },
        sorter = function (a, b) {
            var aVal, bVal;
            return (aVal = a.sort()) === (bVal = b.sort()) ? 0 : (isNaN(aVal) ? 1 : (isNaN(bVal) ? -1 : aVal < bVal ? -1 : 1));
        },
        Looper = factories[LOOPER] = Collection.extend(LOOPER, {
            constructor: function () {
                var looper = this;
                looper.mark(STOPPED);
                looper.unmark(HALTED);
                looper.unmark(DESTROYED);
                looper.unmark(RUNNING);
                looper[CONSTRUCTOR + COLON + COLLECTION]();
                add(looper);
                return looper;
            },
            destroy: function () {
                this.mark(DESTROYED);
                return this.halt();
            },
            run: function (_nowish) {
                var sliced, slicedLength, finished, i = 0,
                    tween = this;
                if (!tween.is(HALTED) && !tween.is(STOPPED) && tween[LENGTH]()) {
                    // stop early if it is halted, stopped, or there's nothing to run
                    tween.lastRun = _nowish;
                    tween.sort(sorter);
                    sliced = tween.toArray().slice(0);
                    slicedLength = sliced[LENGTH];
                    for (; i < slicedLength && !finished; i++) {
                        finished = !tween.is(HALTED) && runner(tween, sliced[i], _nowish);
                    }
                }
                tween.current = NULL;
                tween.unmark(RUNNING);
            },
            dequeue: function (id_) {
                var fnObj, found, i = 0,
                    tween = this,
                    id = id_,
                    ret = BOOLEAN_FALSE;
                if (id === UNDEFINED && !arguments[LENGTH]) {
                    if (tween.current) {
                        id = actuallyDequeue(tween, tween.current);
                    }
                    return !!id;
                }
                if (!isNumber(id)) {
                    return BOOLEAN_FALSE;
                }
                found = tween.get(ID, id);
                if (!found) {
                    return BOOLEAN_FALSE;
                }
                actuallyDequeue(tween, found);
                return BOOLEAN_TRUE;
            },
            stop: function () {
                this.mark(STOPPED);
                return this;
            },
            start: function () {
                var looper = this;
                looper.unmark(STOPPED);
                looper.unmark(HALTED);
                start(looper);
                return looper;
            },
            halt: function () {
                this.mark(HALTED);
                return this.stop();
            },
            queue: function (fn_) {
                var len, id = app.counter(BOOLEAN_FALSE),
                    tween = this,
                    obj = fn_;
                if (isFunction(obj)) {
                    obj = {
                        fn: tween.bind(obj)
                    };
                }
                if (!isObject(obj)) {
                    return;
                }
                len = tween[LENGTH]();
                obj.tween = tween;
                obj.sort = obj.sort || returnsNext;
                obj.filter = obj.filter || returnsTrue;
                obj.id = id;
                tween.push(obj);
                tween.keep(ID, id, obj);
                len = len ? start(tween) : tween.start();
                return id;
            },
            bind: function (fn) {
                return bindTo(fn, this);
            },
            once: function (fn) {
                return this.frames(1, fn);
            },
            frames: function (timey, fn_) {
                var fn, count = 0,
                    times = int(timey) || 1;
                if (!fn_ && isFunction(times)) {
                    fn_ = timey;
                    times = 1;
                }
                if (!isFunction(fn_)) {
                    return;
                }
                fn = this.bind(fn_);
                if (times < 1 || !isNumber(times)) {
                    times = 1;
                }
                return this.queue(function (ms) {
                    var last = BOOLEAN_FALSE;
                    count++;
                    if (count >= times) {
                        this.dequeue();
                        last = BOOLEAN_TRUE;
                    }
                    fn(ms, last, count);
                });
            },
            tween: function (time__, fn_) {
                var fn, added = nowish(),
                    time_ = time(time__),
                    tween = this;
                if (!isFunction(fn_)) {
                    return;
                }
                fn = tween.bind(fn_);
                // continuous update
                return tween.interval(0, function (ms) {
                    var finished = BOOLEAN_FALSE,
                        diff = ms - added;
                    if (diff >= time_) {
                        finished = BOOLEAN_TRUE;
                        tween.dequeue();
                    }
                    fn(ms, Math.min(1, (diff / time_)), finished);
                });
            },
            frameRate: function (time__, fn_, min) {
                var fn, tween = this,
                    minimum = Math.min(min || 0.8, 0.8),
                    expectedFrameRate = 30 * minimum,
                    lastDate = 1,
                    lastSkip = nowish(),
                    time_ = time__ || 125;
                if (!isFunction(fn_)) {
                    return tween;
                }
                fn = tween.bind(fn_);
                return tween.queue(function (ms) {
                    var frameRate = 1000 / (ms - lastDate);
                    if (frameRate > 40) {
                        expectedFrameRate = 60 * minimum;
                    }
                    if (frameRate < expectedFrameRate) {
                        lastSkip = ms;
                    }
                    if (ms - lastSkip > time_) {
                        tween.dequeue();
                        fn(ms);
                    }
                    lastDate = ms;
                });
            },
            timeout: function (time_, fn_) {
                var fn, tweener = this;
                if (!isFunction(fn_)) {
                    return;
                }
                fn = tweener.bind(fn_);
                return tweener.interval(time_, function (ms) {
                    tweener.dequeue();
                    fn(ms);
                });
            },
            interval: function (time_, handler) {
                var bound, fn = handler,
                    tweener = this,
                    timey = time(time_),
                    last = now();
                if (!isFunction(fn)) {
                    return;
                }
                if (!isNumber(timey)) {
                    timey = 0;
                }
                bound = tweener.bind(handler);
                return tweener.queue({
                    filter: function (t) {
                        return t - timey >= last;
                    },
                    fn: function (t) {
                        last = t;
                        bound(t);
                    },
                    sort: function () {
                        return last + timey;
                    }
                });
            },
            defer: function (time, handler) {
                var id, tweener = this;
                return function () {
                    var args = toArray(arguments);
                    tweener.dequeue(id);
                    id = tweener.timeout(time, bind.apply(_, [handler, this].concat(args)));
                    return id;
                };
            }
        });
    // use set timeout to play when visibility changes
    Looper.playWhileBlurred = BOOLEAN_TRUE;
    _.publicize({
        AF: Looper()
    });
});
var AF = _.AF;