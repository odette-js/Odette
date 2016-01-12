application.scope().module('Looper', function (module, app, _, extendFrom, factories) {
    var blank, LoopGen, x = 0,
        lastTime = 0,
        lengthString = 'length',
        isFn = _.isFn,
        isNum = _.isNum,
        pI = _.pI,
        posit = _.posit,
        nowish = _.now,
        getLength = _.property(lengthString),
        gapSplit = _.gapSplit,
        win = window,
        vendors = gapSplit('ms moz webkit o'),
        requestAnimationFrameString = 'requestAnimationFrame',
        allLoopGens = [],
        runningLoopGens = [],
        bind = _.bind,
        duff = _.duff,
        remove = _.remove,
        removeAll = _.removeAll,
        duffRev = _.duffRev,
        extend = _.extend,
        // extendFrom = _.extendFrom,
        running = false,
        setup = function () {
            running = true;
            win[requestAnimationFrameString](function (time) {
                duff(runningLoopGens, function (idx, loopGen) {
                    loopGen.run(time);
                });
                teardown();
            });
        },
        teardown = function () {
            duffRev(runningLoopGens, function (idx, loopGen) {
                if (loopGen.halted() || loopGen.stopped() || loopGen.destroyed() || !loopGen.length()) {
                    runningLoopGens.splice(idx, 1);
                }
            });
            running = false;
            if (runningLoopGens[lengthString]) {
                setup();
            }
        },
        add = function (loopGen) {
            allLoopGens.push(loopGen);
        },
        start = function (loopGen) {
            if (!posit(runningLoopGens, loopGen)) {
                runningLoopGens.push(loopGen);
            }
            if (!running) {
                setup();
            }
        };
    for (; x < getLength(vendors) && !win[requestAnimationFrameString]; ++x) {
        win[requestAnimationFrameString] = win[vendors[x] + 'RequestAnimationFrame'];
        win.cancelAnimationFrame = win[vendors[x] + 'CancelAnimationFrame'] || win[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!win[requestAnimationFrameString]) {
        win[requestAnimationFrameString] = function (callback) {
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
    LoopGen = _.extendFrom.Model('LoopGen', {
        constructor: function (_runner) {
            var fns, stopped = false,
                halted = false,
                destroyed = false,
                running = false,
                loopGen = this,
                counter = 0,
                fnList = [],
                addList = [],
                removeList = [],
                combineAdd = function () {
                    if (addList[lengthString]) {
                        fnList = fnList.concat(addList);
                        addList = [];
                    }
                };
            extend(loopGen, {
                length: function () {
                    return getLength(fnList);
                },
                destroy: function () {
                    destroyed = true;
                    remove(allLoopGens, this);
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
                    // removeAll(fnList, removeList);
                    // removeList = [];
                    duff(fnList, function (idx, fnObj) {
                        if (!posit(removeList, fnObj)) {
                            if (!fnObj.disabled && !halted) {
                                running = fnObj;
                                fnObj.fn(_nowish);
                            }
                        } else {
                            removeLater.push(fnObj);
                        }
                    });
                    running = false;
                    combineAdd();
                    removeAll(fnList, removeList.concat(removeLater));
                    removeList = [];
                },
                remove: function (id) {
                    var ret, fnObj, i = 0;
                    if (!arguments[lengthString]) {
                        if (running) {
                            id = running.id;
                        }
                    }
                    if (isNumber(id)) {
                        for (; i < fnList[lengthString] && !ret; i++) {
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
                    stopped = !0;
                    return this;
                },
                start: function () {
                    var looper = this;
                    stopped = !1;
                    halted = !1;
                    return looper;
                },
                halt: function () {
                    halted = !0;
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
                    if (isFunction(fn)) {
                        if (!fnList[lengthString]) {
                            tween.start();
                        }
                        start(tween);
                        obj = {
                            fn: bind(fn, tween),
                            id: id,
                            disabled: !1,
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
                }
            });
            add(loopGen);
            return loopGen;
        },
        once: function (fn) {
            return this.count(1, fn);
        },
        count: function (timey, fn) {
            var count = 0,
                times = pI(timey) || 1;
            if (!fn && isFunction(times)) {
                fn = timey;
                times = 1;
            }
            if (times < 1 || !isNumber(times)) {
                times = 1;
            }
            if (!isFunction(fn)) {
                return;
            }
            return this.add(function (ms) {
                var last = 1;
                count++;
                if (count >= times) {
                    this.remove();
                    last = 0;
                }
                fn.apply(this, [ms, !last, count]);
            });
        },
        tween: function (time, fn) {
            var added = nowish();
            if (!time) {
                time = 0;
            }
            if (!isFunction(fn)) {
                return;
            }
            return this.interval(0, function (ms) {
                var tween = 1,
                    diff = ms - added;
                if (diff >= time) {
                    tween = 0;
                    this.remove();
                }
                fn.call(this, ms, Math.min(1, (diff / time)), !tween);
            });
        },
        time: function (time, fn) {
            if (!isFunction(fn)) {
                return;
            }
            return this.interval(time, function (ms) {
                fn.call(this, ms);
                this.remove();
            });
        },
        frameRate: function (time, fn, min) {
            var tween = this,
                minimum = Math.min(min || 0.8, 0.8),
                expectedFrameRate = 30 * minimum,
                lastDate = 1,
                lastSkip = _.now();
            time = time || 125;
            if (isFunction(fn)) {
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
                        fn.call(this, ms);
                    }
                    lastDate = ms;
                });
            }
        },
        interval: function (time, fn) {
            var last = nowish();
            if (!time) {
                time = 0;
            }
            if (!isFunction(fn)) {
                return;
            }
            return this.add(function (ms) {
                if (ms - time >= last) {
                    fn.call(this, ms);
                    last = ms;
                }
            });
        }
    }, !0);
    _.exports({
        AF: new LoopGen()
    });
});