app.defineDirective('Tests', (function (app) {
    var id = 0,
        NULL = null,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        EXPECTED = 'expected',
        SPACE_NOT = ' not',
        TO_EQUAL = ' to equal ',
        TO_EVALUATE_TO = ' to evaluate to ',
        AN_ERROR = ' an error',
        TO_BE_THROWN = ' to be thrown',
        TO_BE_STRICTLY_EQUAL_TO_STRING = ' to be strictly equal to ',
        checkFinished = function (states, fn) {
            return function () {
                if (!states || states.finished) {
                    throw new Error('Testing is done! No more tests can be defined.');
                }
                return fn.apply(this, arguments);
            };
        },
        afterEach = function (aeQ) {
            return function (callback) {
                aeQ[aeQ.length - 1].push(callback);
            };
        },
        beforeEach = function (beQ) {
            return function (callback) {
                beQ[beQ.length - 1].push(callback);
            };
        },
        errIfFalse = function (it, finishedExpecting, retreiver, handler, makemessage, execute) {
            return function (arg) {
                var result, expectation = {},
                    retreived = retreiver(),
                    tiedTo = it();
                if (execute) {
                    retreived = retreived();
                }
                result = handler(retreived, arg);
                finishedExpecting();
                if (result !== BOOLEAN_TRUE && result !== BOOLEAN_FALSE) {
                    exception('expectation results from the maker method must be of type boolean.');
                }
                if (result) {
                    expectation.success = BOOLEAN_TRUE;
                } else {
                    expectation = new Error(makemessage.call(this, retreived, arg));
                    expectation.message = expectation.toString();
                    expectation.success = BOOLEAN_FALSE;
                    err(expectation);
                }
                tiedTo.expectations.push(expectation);
                expectation.tiedTo = tiedTo;
                return result;
            };
        },
        testy = function () {
            var cached, focused, expectationsHash = {
                    not: {}
                },
                retreiver = function () {
                    return cached;
                },
                itRetreiver = function () {
                    return focused;
                },
                finishedExpecting = function () {
                    focusing = BOOLEAN_FALSE;
                },
                focusing,
                currentExpectation,
                maker = function (where, test, positive, negative, execute) {
                    expectationsHash[where] = errIfFalse(itRetreiver, finishedExpecting, retreiver, test, positive, execute);
                    expectationsHash.not[where] = errIfFalse(itRetreiver, finishedExpecting, retreiver, negate(test), negative, execute);
                };
            return {
                group: expectationsHash,
                maker: maker,
                focus: function (it) {
                    currentExpectation = NULL;
                    focused = it;
                },
                expect: function (anything) {
                    if (focusing) {
                        throw new Error('Expectations cannot be nested');
                    }
                    focusing = BOOLEAN_TRUE;
                    cached = anything;
                    return expectationsHash;
                }
            };
        },
        describe = function (descriptions, beQ, aeQ) {
            function add(description) {
                descriptions.push(description);
                aeQ.push([]);
                beQ.push([]);
            }

            function remove() {
                descriptions.pop();
                aeQ.pop();
                beQ.pop();
            }
            return function (description, callback) {
                add(description);
                var result = callback.apply(this, arguments);
                remove();
                return result;
            };
        },
        it = function (its, descriptions, afterEach, beforeEach) {
            return function (name, callback, counter) {
                its.push({
                    name: descriptions.concat([name]),
                    callback: callback,
                    expecting: counter || 0,
                    before: beforeEach.slice(0),
                    after: afterEach.slice(0),
                    delta: 0,
                    expectations: []
                });
            };
        },
        finished = function (fin) {
            return function (callback) {
                fin.push(callback);
            };
        },
        wraptries = function (one, two, three) {
            var res, er;
            try {
                res = one();
            } catch (e) {
                er = e;
                err(e);
                if (two) {
                    res = two(er, res);
                }
            } finally {
                if (three) {
                    res = three(er, res);
                }
            }
            return res;
        },
        time = function () {
            return performance.now();
        },
        runList = function (list) {
            var cancels, items = [].concat.apply([], list);
            wraptries(function () {
                var item, i;
                for (i = 0; i < items.length; i++) {
                    item = items[i];
                    item();
                }
            }, function (e) {
                cancels = e;
            });
            return cancels;
        },
        err = function (item) {
            return console.error ? console.error(item) : console.log(item);
        },
        makeName = function (list) {
            return list.join('\n');
        },
        run = function (it, settings, finished) {
            var startTime = 0,
                ran = BOOLEAN_FALSE,
                three = function () {
                    var expecting, expectations;
                    if (ran) {
                        return;
                    }
                    ran = BOOLEAN_TRUE;
                    it.delta = time() - startTime;
                    it.running = BOOLEAN_FALSE;
                    clearTimeout(it.timeoutId);
                    runList(it.after);
                    expecting = it.expecting;
                    expectations = it.expectations;
                    if (expecting && expecting !== expectations.length) {
                        err('Number of expectations expected did not match number of expectations called in: ' + makeName(it.name) + ' expected: ' + expecting + ', got: ' + expectations.length);
                    }
                    finished();
                },
                done = three,
                callback = it.callback,
                one = function () {
                    startTime = time();
                    callback(done);
                },
                callLength = callback.length,
                two = err;
            if (callLength) {
                three = BOOLEAN_FALSE;
            }
            it.running = BOOLEAN_TRUE;
            setTimeout(function () {
                var cancelled;
                if ((cancelled = runList(it.before))) {
                    err(cancelled);
                    finished();
                } else {
                    it.timeoutId = setTimeout(function (argument) {
                        done(new Error('Timeout'));
                    }, 5000);
                    wraptries(one, two, three);
                }
            });
        },
        triesToRun = function (its, focus, finished) {
            var settings = {
                running: BOOLEAN_FALSE,
                index: 0
            };
            return function recurse() {
                if (settings.running) {
                    return;
                }
                var current = its.length <= settings.index ? NULL : its[settings.index];
                if (!current) {
                    return finished();
                }
                if (current.running) {
                    return;
                }
                focus(current);
                run(current, settings, function (argument) {
                    settings.index++;
                    settings.running = BOOLEAN_FALSE;
                    recurse();
                });
            };
        },
        done = function (states, descriptions, its, tryToRun, aQ) {
            return function (afterward) {
                states.finished = BOOLEAN_TRUE;
                aQ.push(afterward);
                tryToRun();
            };
        },
        basicTests = function (maker) {
            maker('toThrow', function (handler) {
                var errRan = BOOLEAN_FALSE;
                return wraptries(handler, function () {
                    errRan = BOOLEAN_TRUE;
                }, function () {
                    return errRan;
                });
            }, function () {
                return EXPECTED + AN_ERROR + TO_BE_THROWN;
            }, function () {
                return EXPECTED + AN_ERROR + SPACE_NOT + TO_BE_THROWN;
            });
            maker('toBe', function (current, comparison) {
                return current === comparison;
            }, function (current, comparison) {
                return EXPECTED + SPACE + stringify(current) + TO_BE_STRICTLY_EQUAL_TO_STRING + stringify(comparison);
            }, function (current, comparison) {
                return EXPECTED + SPACE + stringify(current) + SPACE_NOT + TO_BE_STRICTLY_EQUAL_TO_STRING + stringify(comparison);
            });
            maker('toEqual', function (current, comparison) {
                return isEqual(current, comparison);
            }, function (current, comparison) {
                return EXPECTED + SPACE + stringify(current) + TO_EQUAL + stringify(comparison);
            }, function (current, comparison) {
                return EXPECTED + SPACE + stringify(current) + SPACE_NOT + TO_EQUAL + stringify(comparison);
            });
            maker('toEvaluateTo', function (current, comparison) {
                return isEqual(current, comparison);
            }, function (current, comparison) {
                return EXPECTED + SPACE + 'function' + TO_EVALUATE_TO + stringify(comparison);
            }, function (current, comparison) {
                return EXPECTED + SPACE + 'function not' + TO_EVALUATE_TO + stringify(comparison);
            }, BOOLEAN_TRUE);
        },
        group = function (target) {
            var aeQ = [];
            var beQ = [];
            var aQ = [];
            var its = [];
            var descriptions = [];
            var fin = fin;
            var states = {};
            var tester = testy();
            var identifier = target.id;
            var tryToRun = triesToRun(its, tester.focus, function () {
                var i, item;
                for (i = 0; i < aQ.length; i++) {
                    item = aQ[i];
                    item(its);
                }
            });
            basicTests(tester.maker);
            return {
                afterEach: checkFinished(states, afterEach(aeQ)),
                beforeEach: checkFinished(states, beforeEach(beQ)),
                expect: tester.expect,
                describe: checkFinished(states, describe(descriptions, aeQ, beQ)),
                it: checkFinished(states, it(its, descriptions, aeQ, beQ)),
                finished: finished(fin),
                done: done(states, descriptions, its, tryToRun, aQ),
                maker: tester.maker,
                group: group.bind(NULL, (identifier ? (identifier + HYPHEN) : EMPTY_STRING) + (++id))
            };
        };
    return group;
}(app)));