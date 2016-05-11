app.scope(function (app) {
    var lastAFId, lastTId, lastOverrideId, _ = app._,
        factories = _.factories,
        x = 0,
        lastTime = 0,
        frameTime = 0,
        pI = _.pI,
        nowish = _.now,
        gapSplit = _.gapSplit,
        vendors = gapSplit('ms moz webkit o'),
        RUNNING = 'running',
        HALTED = 'halted',
        STOPPED = 'stopped',
        DESTROYED = 'destroyed',
        TIMEOUT = 'Timeout',
        SET_TIMEOUT = 'set' + TIMEOUT,
        CLEAR_TIMEOUT = 'clear' + TIMEOUT,
        ANIMATION_FRAME = 'AnimationFrame',
        REQUEST_ANIMATION_FRAME = 'request' + ANIMATION_FRAME,
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
                win[REQUEST_ANIMATION_FRAME] = win[vendors[x] + 'RequestAnimationFrame'];
                win[CANCEL_ANIMATION_FRAME] = win[vendors[x] + upCase(CANCEL_ANIMATION_FRAME)] || win[vendors[x] + 'CancelRequestAnimationFrame'];
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
        LOOPER = 'Looper',
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
            }, function (e) {
                console.error(e);
                tween.dequeue(obj.id);
            });
        },
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
                var sliced, finished, i = 0,
                    tween = this;
                if (tween.is(HALTED) || tween.is(STOPPED) || !tween.length()) {
                    return;
                }
                sliced = factories.Collection(tween.unwrap().slice(0));
                tween.lastRun = _nowish;
                for (; i < tween[LENGTH]() && !finished; i++) {
                    finished = runner(tween, tween.item(i), i);
                }
                // sliced.find(runner, tween);
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
                    time_ = time(time__);
                if (!time_) {
                    time_ = 0;
                }
                if (!isFunction(fn_)) {
                    return;
                }
                fn = this.bind(fn_);
                return this.interval(0, function (ms) {
                    var tween = 1,
                        diff = ms - added;
                    if (diff >= time_) {
                        tween = 0;
                        this.dequeue();
                    }
                    fn(ms, Math.min(1, (diff / time_)), !tween);
                });
            },
            time: function (time_, fn_) {
                var fn;
                if (!isFunction(fn_)) {
                    return this;
                }
                fn = this.bind(fn_);
                return this.interval(time(time_), function (ms) {
                    this.dequeue();
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
            interval: function (time, fn_) {
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
                        last = ms;
                        fn(ms);
                    }
                });
            },
            onceInterval: function (handler, time_) {
                var fn = handler,
                    tweener = this,
                    timey = time(time_);
                if (!isFunction(fn)) {
                    return;
                }
                if (!isNumber(timey)) {
                    return;
                }
                return this.interval(timey, handler);
            },
            defer: function (handler, time) {
                var id, tweener = this;
                return function () {
                    var args = toArray(arguments);
                    var context = this || tweener;
                    tweener.dequeue(id);
                    id = tweener.time(time, function () {
                        handler.apply(context, args);
                    });
                    return id;
                };
            }
        }),
        Scheduler = factories.Scheduler = factories.Directive.extend('Scheduler', {
            //
        });
    Looper.playWhileBlurred = BOOLEAN_TRUE;
    app.defineDirective('Scheduler', Scheduler[CONSTRUCTOR]);
    _.exports({
        AF: Looper()
    });
});