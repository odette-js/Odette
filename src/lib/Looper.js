app.scope(function (app) {
    var lastAFId, lastTId, lastOverrideId, _ = app._,
        factories = _.factories,
        x = 0,
        lastTime = 0,
        frameTime = 0,
        pI = _.pI,
        posit = _.posit,
        nowish = _.now,
        gapSplit = _.gapSplit,
        vendors = gapSplit('ms moz webkit o'),
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
            if (focused) {
                lastAFId = win[REQUEST_ANIMATION_FRAME](handler);
            } else {
                lastTId = win.setTimeout(handler, nextFrame);
            }
            if (Looper.playWhileBlurred) {
                lastOverrideId = win.setTimeout(function () {
                    focused = BOOLEAN_FALSE;
                    handler();
                }, nextFrame + 50);
            }
        },
        basicHandler = function () {
            win[CANCEL_ANIMATION_FRAME](lastAFId);
            win[CLEAR_TIMEOUT](lastTId);
            win[CLEAR_TIMEOUT](lastOverrideId);
            frameTime = _.now();
            eachCall(runningLoopers, 'run', frameTime);
            teardown();
        },
        setup = function () {
            running = BOOLEAN_TRUE;
            request(basicHandler);
        },
        teardown = function () {
            duffRight(runningLoopers, function (looper, idx) {
                if (looper.halted() || looper.stopped() || looper.destroyed() || !looper.length()) {
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
            if (!posit(runningLoopers, looper)) {
                runningLoopers.push(looper);
            }
            if (!running) {
                setup();
            }
        },
        shim = (function () {
            for (; x < vendors[LENGTH] && !win[REQUEST_ANIMATION_FRAME]; ++x) {
                win[REQUEST_ANIMATION_FRAME] = win[vendors[x] + 'RequestAnimationFrame'];
                win[CANCEL_ANIMATION_FRAME] = win[vendors[x] + _.upCase(CANCEL_ANIMATION_FRAME)] || win[vendors[x] + 'CancelRequestAnimationFrame'];
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
        Looper = factories.Directive.extend('Looper', {
            constructor: function (_runner) {
                var fns, stopped = BOOLEAN_TRUE,
                    halted = BOOLEAN_FALSE,
                    destroyed = BOOLEAN_FALSE,
                    running = BOOLEAN_FALSE,
                    looper = this,
                    counter = 0,
                    fnList = [],
                    addList = [],
                    removeList = [],
                    combineAdd = function () {
                        if (addList[LENGTH]) {
                            fnList = fnList.concat(addList);
                            addList = [];
                        }
                    };
                // keeps things private
                extend(looper, {
                    length: function () {
                        return fnList[LENGTH];
                    },
                    destroy: function () {
                        destroyed = BOOLEAN_TRUE;
                        // remove(allLoopers, this);
                        return this.halt();
                    },
                    destroyed: function () {
                        return destroyed;
                    },
                    running: function () {
                        // actual object that is currently being run
                        return !!running;
                    },
                    started: function () {
                        return !stopped;
                    },
                    run: function (_nowish) {
                        var tween = this,
                            removeLater = [];
                        if (halted || stopped) {
                            return;
                        }
                        combineAdd();
                        duff(fnList, function (fnObj) {
                            if (indexOf(removeList, fnObj) !== -1) {
                                removeLater.push(fnObj);
                            } else {
                                if (fnObj.disabled || halted) {
                                    return;
                                }
                                running = fnObj;
                                wraptry(function () {
                                    fnObj.fn(_nowish);
                                }, function () {
                                    tween.remove(fnObj.id);
                                });
                            }
                        });
                        running = BOOLEAN_FALSE;
                        combineAdd();
                        duff(removeList.concat(removeLater), function (item) {
                            remove(fnList, item);
                        });
                        removeList = [];
                    },
                    remove: function (id) {
                        var fnObj, i = 0,
                            ret = BOOLEAN_FALSE;
                        if (!arguments[LENGTH]) {
                            if (running) {
                                removeList.push(running);
                                return BOOLEAN_TRUE;
                            }
                        }
                        if (isNumber(id)) {
                            for (; i < fnList[LENGTH] && !ret; i++) {
                                fnObj = fnList[i];
                                if (fnObj.id === id) {
                                    if (!posit(removeList, fnObj)) {
                                        removeList.push(fnObj);
                                        ret = BOOLEAN_TRUE;
                                    }
                                }
                            }
                        }
                        return !!ret;
                    },
                    stop: function () {
                        stopped = BOOLEAN_TRUE;
                        return this;
                    },
                    start: function () {
                        var looper = this;
                        stopped = BOOLEAN_FALSE;
                        halted = BOOLEAN_FALSE;
                        return looper;
                    },
                    halt: function () {
                        halted = BOOLEAN_TRUE;
                        return this.stop();
                    },
                    halted: function () {
                        return halted;
                    },
                    stopped: function () {
                        return stopped;
                    },
                    reset: function () {
                        fnList = [];
                        removeList = [];
                        addList = [];
                        return this;
                    },
                    add: function (fn) {
                        var obj, id = counter,
                            tween = this;
                        if (!isFunction(fn)) {
                            return;
                        }
                        if (!fnList[LENGTH]) {
                            tween.start();
                        }
                        start(tween);
                        obj = {
                            fn: tween.bind(fn),
                            id: id,
                            disabled: BOOLEAN_FALSE,
                            bound: tween
                        };
                        if (tween.running()) {
                            addList.push(obj);
                        } else {
                            fnList.push(obj);
                        }
                        counter++;
                        return id;
                    }
                });
                add(looper);
                return looper;
            },
            bind: function (fn) {
                return bind(fn, this);
            },
            once: function (fn) {
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
                return this.add(function (ms) {
                    var last = 1;
                    count++;
                    if (count >= times) {
                        this.remove();
                        last = 0;
                    }
                    fn(ms, !last, count);
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
                        this.remove();
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
                    this.remove();
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
                return tween.add(function (ms) {
                    var frameRate = 1000 / (ms - lastDate);
                    if (frameRate > 40) {
                        expectedFrameRate = 60 * minimum;
                    }
                    if (frameRate < expectedFrameRate) {
                        lastSkip = ms;
                    }
                    if (ms - lastSkip > time_) {
                        tween.remove();
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
                return tweener.add(function (ms) {
                    if (ms - time >= last) {
                        last = ms;
                        fn(ms);
                    }
                });
            }
        }, BOOLEAN_TRUE);
    Looper.playWhileBlurred = BOOLEAN_TRUE;
    app.undefine(function () {});
    _.exports({
        AF: Looper()
    });
});