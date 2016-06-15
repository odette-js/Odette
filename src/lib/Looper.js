app.scope(function (app) {
    var lastAFId, lastTId, lastOverrideId, _ = app._,
        factories = _.factories,
        x = 0,
        lastTime = 0,
        frameTime = 0,
        pI = _.pI,
        nowish = _.now,
        vendors = toArray('ms,moz,webkit,o'),
        RUNNING = 'running',
        HALTED = 'halted',
        // SCHEDULER = 'Scheduler',
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
                win[CLEAR_TIMEOUT](lastTId);
                lastTId = win.setTimeout(handler, nextFrame + 1);
            }
            if (Looper.playWhileBlurred) {
                win[CLEAR_TIMEOUT](lastOverrideId);
                lastOverrideId = win.setTimeout(function () {
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
            eachCall(runningLoopers, 'run', frameTime);
            // do it all over again
            teardown();
        },
        setup = function () {
            running = BOOLEAN_TRUE;
            request(basicHandler);
        },
        teardown = function () {
            duffRight(runningLoopers, function (looper, idx) {
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
            if (!has(runningLoopers, looper)) {
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
                    var currTime = new Date().getTime(),
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
        Collection = factories.Collection,
        runner = function (tween, obj) {
            tween.current = obj;
            if (obj.disabled) {
                tween.dequeue(obj.id);
                return;
            }
            if (tween.is(HALTED)) {
                // stops early
                return BOOLEAN_TRUE;
            }
            wraptry(function () {
                obj.fn(tween.lastRun);
            }, function () {
                tween.dequeue(obj.id);
            });
        },
        // timeout = ,
        Looper = factories[LOOPER] = Collection.extend(LOOPER, {
            constructor: function (_runner) {
                var looper = this;
                looper.mark(STOPPED);
                looper.unmark(HALTED);
                looper.unmark(DESTROYED);
                looper.unmark(RUNNING);
                Collection[CONSTRUCTOR].call(looper);
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
                if (tween.is(HALTED) || tween.is(STOPPED) || !tween[LENGTH]()) {
                    return;
                }
                sliced = factories.Collection(tween.unwrap().slice(0));
                tween.lastRun = _nowish;
                slicedLength = sliced[LENGTH]();
                for (; i < slicedLength && !finished; i++) {
                    finished = runner(tween, sliced.item(i), i);
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
                        tween.drop(ID, tween.current.id);
                        id = tween.remove(tween.current);
                    }
                    return !!id;
                }
                if (!isNumber(id)) {
                    return BOOLEAN_FALSE;
                }
                found = tween.get(ID, id);
                if (found) {
                    tween.drop(ID, id);
                    return tween.remove(found);
                }
            },
            stop: function () {
                this.mark(STOPPED);
                return this;
            },
            start: function () {
                var looper = this;
                if (looper.is(STOPPED)) {
                    looper.unmark(STOPPED);
                    looper.unmark(HALTED);
                }
                return looper;
            },
            halt: function () {
                this.mark(HALTED);
                return this.stop();
            },
            queue: function (fn) {
                var obj, id = uniqueId(BOOLEAN_FALSE),
                    tween = this;
                if (!isFunction(fn)) {
                    return;
                }
                if (!tween[LENGTH]()) {
                    tween.start();
                }
                obj = {
                    fn: tween.bind(fn),
                    id: id,
                    disabled: BOOLEAN_FALSE,
                    bound: tween
                };
                tween.push(obj);
                tween.keep(ID, obj.id, obj);
                start(tween);
                return id;
            },
            bind: function (fn) {
                return bind(fn, this);
            },
            once: function (fn, time_) {
                return this.frames(1, fn);
            },
            frames: function (timey, fn_) {
                var fn, count = 0,
                    times = pI(timey) || 1;
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
                if (!time_) {
                    time_ = 0;
                }
                if (!isFunction(fn_)) {
                    return;
                }
                fn = tween.bind(fn_);
                return tween.timeout(0, function (ms) {
                    var finished = BOOLEAN_FALSE,
                        diff = ms - added;
                    if (diff >= time_) {
                        finished = BOOLEAN_TRUE;
                        tween.dequeue();
                    }
                    fn(ms, Math.min(1, (diff / time_)), finished);
                });
            },
            time: function (time_, fn_) {
                var fn, tween = this;
                if (!isFunction(fn_)) {
                    return tween;
                }
                fn = tween.bind(fn_);
                return tween.timeout(time(time_), function (ms) {
                    tween.dequeue();
                    fn(ms);
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
            timeout: function (time, fn_) {
                var fn, tweener = this,
                    last = nowish();
                if (!isFunction(fn_)) {
                    return;
                }
                if (!time) {
                    time = 0;
                }
                fn = tweener.bind(fn_);
                return tweener.queue(function (ms) {
                    if (ms - time >= last) {
                        // last = ms;
                        tweener.dequeue();
                        fn(ms);
                    }
                });
            },
            // onceInterval: function (handler, time_) {
            //     var fn = handler,
            //         tweener = this,
            //         timey = time(time_);
            //     if (!isFunction(fn)) {
            //         return;
            //     }
            //     if (!isNumber(timey)) {
            //         return;
            //     }
            //     return this.timeout(timey, handler);
            // },
            interval: function (handler, time_) {
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
                bound = bind(handler, tweener);
                return tweener.queue(function (t) {
                    if (t - timey >= last) {
                        last = t;
                        fn(t);
                    }
                });
            },
            defer: function (handler, time) {
                var id, tweener = this;
                return function () {
                    var args = toArray(arguments);
                    var context = this || tweener;
                    tweener.dequeue(id);
                    id = tweener.time(time, bind(handler, this, tweener));
                    return id;
                };
            }
        });
    Looper.playWhileBlurred = BOOLEAN_TRUE;
    _.publicize({
        AF: Looper()
    });
});