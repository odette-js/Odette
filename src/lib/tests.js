app.scope(function (app) {
    var testisrunning,
        expectationRunning, current, expectationCount, pollerTimeout, allIts, describes, successfulIts, failedIts, stack, queue, allExpectations, successful, failures, successfulExpectations, failedExpectations, globalBeforeEachStack, globalAfterEachStack, currentItFocus, failedTests = 0,
        EXPECTED = 'expected',
        SPACE_NOT = ' not',
        TO_EQUAL = ' to equal ',
        TO_EVALUATE_TO = ' to evaluate to ',
        AN_ERROR = ' an error',
        TO_BE_THROWN = ' to be thrown',
        TO_BE_STRICTLY_EQUAL_TO_STRING = ' to be strictly equal to ',
        errIfFalse = function (handler, makemessage, execute) {
            return function (arg) {
                var result, expectation = {};
                if (execute) {
                    current = current();
                }
                result = handler(current, arg);
                if (result !== BOOLEAN_TRUE && result !== BOOLEAN_FALSE) {
                    exception('expectation results from the maker method must be of type boolean.');
                }
                if (result) {
                    successfulExpectations.push(expectation);
                    expectation.success = BOOLEAN_TRUE;
                } else {
                    ++failedTests;
                    expectation = new Error(makemessage.call(this, current, arg));
                    expectation.message = expectation.toString();
                    expectation.success = BOOLEAN_FALSE;
                    failedExpectations.push(expectation);
                }
                allExpectations.push(expectation);
                expectation.tiedTo = currentItFocus;
                expectationRunning = BOOLEAN_FALSE;
                return result;
            };
        },
        expectationsHash = {
            not: {}
        },
        expect = function (start) {
            if (expectationRunning) {
                return exception('expectations cannot be nested or be running at the same time');
            }
            expectationRunning = BOOLEAN_TRUE;
            current = start;
            return expectationsHash;
        },
        maker = expect.maker = function (where, test, positive, negative, execute) {
            expectationsHash[where] = errIfFalse(test, positive, execute);
            expectationsHash.not[where] = errIfFalse(negate(test), negative, execute);
        },
        internalToThrowResult = maker('toThrow', function (handler) {
            var errRan = BOOLEAN_FALSE;
            return wraptry(handler, function () {
                errRan = BOOLEAN_TRUE;
            }, function () {
                return errRan;
            });
        }, function () {
            return EXPECTED + AN_ERROR + TO_BE_THROWN;
        }, function () {
            return EXPECTED + AN_ERROR + SPACE_NOT + TO_BE_THROWN;
        }),
        internalToBeResult = maker('toBe', function (current, comparison) {
            return current === comparison;
        }, function (current, comparison) {
            return EXPECTED + SPACE + stringify(current) + TO_BE_STRICTLY_EQUAL_TO_STRING + stringify(comparison);
        }, function (current, comparison) {
            return EXPECTED + SPACE + stringify(current) + SPACE_NOT + TO_BE_STRICTLY_EQUAL_TO_STRING + stringify(comparison);
        }),
        internalToEqualResult = maker('toEqual', function (current, comparison) {
            return isEqual(current, comparison);
        }, function (current, comparison) {
            return EXPECTED + SPACE + stringify(current) + TO_EQUAL + stringify(comparison);
        }, function (current, comparison) {
            return EXPECTED + SPACE + stringify(current) + SPACE_NOT + TO_EQUAL + stringify(comparison);
        }),
        internalToEvaluateTo = maker('toEvaluateTo', function (current, comparison) {
            return isEqual(current, comparison);
        }, function (current, comparison) {
            return EXPECTED + SPACE + 'function' + TO_EVALUATE_TO + stringify(comparison);
        }, function (current, comparison) {
            return EXPECTED + SPACE + 'function not' + TO_EVALUATE_TO + stringify(comparison);
        }, BOOLEAN_TRUE),
        errHandler = function (expectation) {
            return function (err) {
                expectation.erred = err;
                console.error(err);
            };
        },
        executedone = function (expectation) {
            var queued;
            expectation.endTime = _.performance.now();
            stack.pop();
            if (failedTests || expectation.erred) {
                failedIts.push(expectation);
                expectation.promise.reject(expectation.err);
            } else {
                successfulIts.push(expectation);
                expectation.promise.fulfill();
            }
            failedTests = 0;
            runningEach(expectation.afterStack);
            testisrunning = BOOLEAN_FALSE;
            // promise.resolveAs();
            if (queue[0]) {
                queued = queue.shift();
                clearTimeout(queued.runId);
                setup(queued);
            }
            setupPoller();
        },
        describe = function (string, handler) {
            var resolution = Promise(_.noop, BOOLEAN_TRUE);
            describes.push(resolution);
            stack.push(string);
            globalBeforeEachStack.push([]);
            globalAfterEachStack.push([]);
            wraptry(handler, function (e) {
                resolution.reject(e);
            }, function () {
                globalAfterEachStack.pop();
                globalBeforeEachStack.pop();
                stack.pop();
                resolution.resolve();
            });
            return resolution;
        },
        setup = function (expectation) {
            testisrunning = BOOLEAN_TRUE;
            expectation.runId = setTimeout(function () {
                var errThat, doThis, errThis, err, finallyThis,
                    current = expectation.current.slice(0);
                currentItFocus = expectation;
                testisrunning = BOOLEAN_TRUE;
                runningEach(expectation.beforeStack);
                errThis = errHandler(expectation);
                if (expectation.handler[LENGTH] === 1) {
                    err = new Error();
                    expectation.timeoutId = setTimeout(function () {
                        console.error('timeout:\n' + current.join('\n'));
                        errThat(err);
                        executedone(expectation);
                    }, 5000);
                    doThis = function () {
                        expectation.handler(function () {
                            clearTimeout(expectation.timeoutId);
                            executedone(expectation);
                        });
                    };
                    errThat = errThis;
                    errThis = function (e) {
                        errThat(e);
                        executedone(expectation);
                    };
                    finallyThis = noop;
                } else {
                    doThis = expectation.handler;
                    finallyThis = function () {
                        executedone(expectation);
                    };
                }
                expectation.startTime = _.performance.now();
                wraptry(doThis, errThis, finallyThis);
            });
        },
        it = function (string, handler) {
            var copy, expectation;
            stack.push(string);
            copy = stack.slice(0);
            stack.pop();
            expectation = {
                string: string,
                handler: handler,
                current: copy,
                afterStack: globalAfterEachStack.slice(0),
                beforeStack: globalBeforeEachStack.slice(0),
                promise: Promise(_.noop, BOOLEAN_TRUE)
            };
            allIts.push(expectation);
            if (testisrunning) {
                queue.push(expectation);
            } else {
                setup(expectation);
            }
            return expectation.promise;
        },
        runningEach = function (globalStack) {
            var i, j, itemized;
            for (i = 0; i < globalStack[LENGTH]; i++) {
                itemized = globalStack[i];
                for (j = 0; j < itemized[LENGTH]; j++) {
                    itemized[j]();
                }
            }
        },
        beforeEach = function (handler) {
            globalBeforeEachStack[globalBeforeEachStack[LENGTH] - 1].push(handler);
        },
        afterEach = function (handler) {
            globalAfterEachStack[globalAfterEachStack[LENGTH] - 1].push(handler);
        },
        resetTests = function () {
            pollerTimeout = UNDEFINED;
            _.each(describes, function (promise) {
                promise.resolve();
            });
            expectationCount = 0;
            describes = [];
            allIts = [];
            successfulIts = [];
            failedIts = [];
            stack = [];
            queue = [];
            allExpectations = [];
            successful = [];
            failures = [];
            successfulExpectations = [];
            failedExpectations = [];
            globalBeforeEachStack = [];
            globalAfterEachStack = [];
            testisrunning = BOOLEAN_FALSE;
            expectationRunning = BOOLEAN_FALSE;
        },
        makesItName = function (current, delimiter_) {
            var target, string, delimiter = delimiter_ || '\n',
                stringList = current.slice(0);
            while (stringList.length) {
                target = stringList.shift();
                if (string) {
                    string = string + delimiter + target;
                } else {
                    string = target;
                }
                delimiter = delimiter + '    ';
            }
            return string;
        },
        createResults = function (duration) {
            return {
                passed: successfulExpectations[LENGTH],
                failed: failedExpectations[LENGTH],
                total: allExpectations[LENGTH],
                duration: duration,
                tests: map(allExpectations, function (expectation) {
                    var target, tiedIt = expectation.tiedTo,
                        string = makesItName(tiedIt.current);
                    return {
                        name: expectation.success ? string : string + '\n',
                        duration: 0,
                        result: expectation.success,
                        message: expectation.message
                    };
                })
            };
        },
        setupPoller = function () {
            pollerTimeout = pollerTimeout === void 0 ? setTimeout(function loops() {
                var theIt, string, i = 0,
                    totalTime = 0;
                if (!testisrunning) {
                    for (; i < allIts[LENGTH]; i++) {
                        theIt = allIts[i];
                        totalTime += (theIt.endTime - theIt.startTime);
                    }
                    if (failedExpectations[LENGTH]) {
                        console.log('failed');
                        duff(failedExpectations, function (obj) {
                            console.log(obj);
                        });
                    }
                    string = successfulExpectations[LENGTH] + ' successful expectations\n' + failedExpectations[LENGTH] + ' failed expectations\n' + allExpectations[LENGTH] + ' expectations ran\n' + successfulIts[LENGTH] + ' out of ' + allIts[LENGTH] + ' tests passed\nin ' + totalTime + 'ms';
                    results = createResults(totalTime);
                    resetTests();
                    eachCallBound(afters, results);
                    console.log(string, results);
                } else {
                    pollerTimeout = setTimeout(loops, 500);
                }
            }, 100) : pollerTimeout;
        },
        afters = [],
        finished = function (fn) {
            afters.push(fn);
        };
    resetTests();
    _.publicize({
        test: {
            afterEach: afterEach,
            beforeEach: beforeEach,
            expect: expect,
            describe: describe,
            it: it,
            finished: finished
        }
    });
});