application.scope().module('Looper', function (module, app, _, factories) {
    var blank, x = 0,
        lastTime = 0,
        LENGTH = 'length',
        isFunction = _.isFunction,
        isNumber = _.isNumber,
        pI = _.pI,
        posit = _.posit,
        nowish = _.now,
        gapSplit = _.gapSplit,
        vendors = gapSplit('ms moz webkit o'),
        REQUEST_ANIMATION_FRAME = 'requestAnimationFrame',
        allLoopers = [],
        runningLoopers = [],
        bind = _.bind,
        duff = _.duff,
        remove = _.remove,
        removeAll = _.removeAll,
        duffRev = _.duffRight,
        extend = _.extend,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        running = BOOLEAN_FALSE,
        setup = function () {
            running = BOOLEAN_TRUE;
            win[REQUEST_ANIMATION_FRAME](function (time) {
                duff(runningLoopers, function (looper) {
                    looper.run(time);
                });
                teardown();
            });
        },
        teardown = function () {
            duffRight(runningLoopers, function (looper, idx) {
                if (looper.halted() || looper.stopped() || looper.destroyed() || !looper.length()) {
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
                win.cancelAnimationFrame = win[vendors[x] + 'CancelAnimationFrame'] || win[vendors[x] + 'CancelRequestAnimationFrame'];
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
            if (!win.cancelAnimationFrame) {
                win.cancelAnimationFrame = function (id) {
                    win.clearTimeout(id);
                };
            }
        }()),
        Looper = factories.Directive.extend('Looper', {
            constructor: function (_runner) {
                var fns, stopped = BOOLEAN_FALSE,
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
                extend(looper, {
                    length: function () {
                        return fnList[LENGTH];
                    },
                    destroy: function () {
                        destroyed = BOOLEAN_TRUE;
                        remove(allLoopers, this);
                        return this.halt();
                    },
                    destroyed: function () {
                        return destroyed;
                    },
                    running: function () {
                        return !!running;
                    },
                    run: function () {
                        var tween = this,
                            removeLater = [],
                            _nowish = nowish();
                        if (halted || stopped) {
                            return;
                        }
                        combineAdd();
                        duff(fnList, function (fnObj) {
                            if (!posit(removeList, fnObj)) {
                                if (!fnObj.disabled && !halted) {
                                    running = fnObj;
                                    fnObj.fn(_nowish);
                                }
                            } else {
                                removeLater.push(fnObj);
                            }
                        });
                        running = BOOLEAN_FALSE;
                        combineAdd();
                        removeAll(fnList, removeList.concat(removeLater));
                        removeList = [];
                    },
                    remove: function (id) {
                        var ret, fnObj, i = 0;
                        if (!arguments[LENGTH]) {
                            if (running) {
                                id = running.id;
                            }
                        }
                        if (isNumber(id)) {
                            for (; i < fnList[LENGTH] && !ret; i++) {
                                fnObj = fnList[i];
                                if (fnObj.id === id) {
                                    if (!posit(removeList, fnObj)) {
                                        removeList.push(fnObj);
                                        ret = 1;
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
                return this.count(1, fn);
            },
            count: function (timey, fn_) {
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
            tween: function (time, fn_) {
                var fn, added = nowish();
                if (!time) {
                    time = 0;
                }
                if (!isFunction(fn)) {
                    return;
                }
                fn = this.bind(fn_);
                return this.interval(0, function (ms) {
                    var tween = 1,
                        diff = ms - added;
                    if (diff >= time) {
                        tween = 0;
                        this.remove();
                    }
                    fn(ms, Math.min(1, (diff / time)), !tween);
                });
            },
            time: function (time, fn_) {
                var fn;
                if (!isFunction(fn)) {
                    return this;
                }
                fn = this.bind(fn_);
                return this.interval(time, function (ms) {
                    this.remove();
                    fn(ms);
                });
            },
            frameRate: function (time, fn_, min) {
                var fn, tween = this,
                    minimum = Math.min(min || 0.8, 0.8),
                    expectedFrameRate = 30 * minimum,
                    lastDate = 1,
                    lastSkip = nowish();
                time = time || 125;
                if (!isFunction(fn_)) {
                    return tween;
                }
                fn = bind(fn_, this);
                return tween.add(function (ms) {
                    var frameRate = 1000 / (ms - lastDate);
                    if (frameRate > 40) {
                        expectedFrameRate = 60 * minimum;
                    }
                    if (frameRate < expectedFrameRate) {
                        lastSkip = ms;
                    }
                    if (ms - lastSkip > time) {
                        this.remove();
                        fn(ms);
                    }
                    lastDate = ms;
                });
            },
            interval: function (time, fn_) {
                var fn, last = nowish();
                if (!isFunction(fn)) {
                    return;
                }
                if (!time) {
                    time = 0;
                }
                fn = this.bind(fn);
                return this.add(function (ms) {
                    if (ms - time >= last) {
                        last = ms;
                        fn(ms);
                    }
                });
            }
        }, !0);
    _.exports({
        AF: new Looper()
    });
});