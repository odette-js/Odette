application.scope().run(function (app, _, factories) {
    var currentTest, current, pollerTimeout, failedTests = 0,
        testisrunning = BOOLEAN_FALSE,
        console = _.console,
        stringify = _.stringify,
        negate = _.negate,
        allIts = [],
        successfulIts = [],
        failedIts = [],
        stack = [],
        queue = [],
        allExpectations = [],
        successful = [],
        failures = [],
        successfulExpectations = [],
        failedExpectations = [],
        globalBeforeEachStack = [],
        globalAfterEachStack = [],
        errIfFalse = function (handler, makemessage) {
            return function () {
                var err, expectation = {};
                if (handler.apply(this, arguments)) {
                    successfulExpectations.push(expectation);
                } else {
                    ++failedTests;
                    expectation = new Error(makemessage.apply(this, arguments));
                    console.error(expectation);
                    failedExpectations.push(expectation);
                }
                allExpectations.push(expectation);
                return this;
            };
        },
        internalToThrow = function (handler) {
            var errRan = false;
            return _.wraptry(handler, function () {
                errRan = true;
            }, function () {
                return errRan;
            });
        },
        toThrow = function () {
            errIfFalse(internalToThrow, function () {
                return 'expected an error to be thrown';
            });
        },
        notToThrow = function () {
            errIfFalse(negate(internalToThrow), function () {
                return 'expected an error not to be thrown';
            });
        },
        internalToEqual = function (comparison) {
            return _.isEqual(current, comparison);
        },
        toEqual = errIfFalse(internalToEqual, function (comparison) {
            return 'expected ' + current + ' to equal ' + comparison;
        }),
        notToEqual = errIfFalse(negate(internalToEqual), function (comparison) {
            return 'expected ' + stringify(current) + ' not to equal ' + stringify(comparison);
        }),
        internalToBe = function (comparison) {
            return current === comparison;
        },
        toBe = errIfFalse(internalToBe, function (comparison) {
            return 'expected ' + stringify(current) + ' to be strictly equal to ' + stringify(comparison);
        }),
        notToBe = errIfFalse(negate(internalToBe), function (comparison) {
            return 'expected ' + stringify(current) + ' to be strictly equal to ' + stringify(comparison);
        }),
        expect = function (start) {
            current = start;
            return {
                toEqual: toEqual,
                toThrow: toThrow,
                not: {
                    toEqual: notToEqual,
                    toThrow: notToThrow,
                    toBe: notToBe
                }
            };
        },
        errHandler = function (e) {
            console.error(e);
        },
        executedone = function (expectation) {
            var queued;
            expectation.endTime = _.performance.now();
            stack.pop();
            if (failedTests) {
                failedIts.push(expectation);
            } else {
                successfulIts.push(expectation);
            }
            failedTests = 0;
            runningEach(expectation.afterStack);
            testisrunning = BOOLEAN_FALSE;
            if (queue[0]) {
                queued = queue.shift();
                setup(queued);
            }
            setupPoller();
        },
        describe = function (string, handler) {
            stack.push(string);
            globalBeforeEachStack.push([]);
            globalAfterEachStack.push([]);
            _.wraptry(handler, errHandler, function () {
                globalAfterEachStack.pop();
                globalBeforeEachStack.pop();
                stack.pop();
            });
        },
        makesOwnCallback = function (handler) {
            var stringHandler = handler.toString();
            var split = stringHandler.split('(');
            var shifted = split.shift();
            var sliced = split.join('(');
            split = sliced.split(')');
            var target = split.shift();
            return target.trim().length;
        },
        timeoutErr = function (stack) {
            console.error('timeout:\n' + stack.join('\n'));
        },
        setup = function (expectation) {
            testisrunning = BOOLEAN_TRUE;
            expectation.runId = setTimeout(function () {
                var doThis, errThis, finallyThis;
                currentTest = expectation;
                runningEach(expectation.beforeStack);
                if (makesOwnCallback(expectation.handler)) {
                    expectation.timeoutId = setTimeout(function () {
                        timeoutErr(expectation.current);
                        executedone(expectation);
                    }, 5000);
                    doThis = function () {
                        expectation.handler(function () {
                            clearTimeout(expectation.timeoutId);
                            executedone(expectation);
                        });
                    };
                    errThis = function () {
                        console.error(stack);
                        executedone(expectation);
                    };
                    finallyThis = _.noop;
                } else {
                    doThis = expectation.handler;
                    errThis = errHandler;
                    finallyThis = function () {
                        executedone(expectation);
                    };
                }
                expectation.startTime = _.performance.now();
                _.wraptry(doThis, errThis, finallyThis);
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
                beforeStack: globalBeforeEachStack.slice(0),
                afterStack: globalAfterEachStack.slice(0)
            };
            allIts.push(expectation);
            if (testisrunning) {
                queue.push(expectation);
                return;
            }
            setup(expectation);
        },
        runningEach = function (globalStack) {
            for (var i = 0; i < globalStack[LENGTH]; i++) {
                var itemized = globalStack[i];
                for (var j = 0; j < itemized[LENGTH]; j++) {
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
        setupPoller = function () {
            pollerTimeout = pollerTimeout === void 0 ? setTimeout(function loops() {
                var theIt, i = 0,
                    totalTime = 0;
                if (!testisrunning) {
                    for (; i < allIts[LENGTH]; i++) {
                        theIt = allIts[i];
                        totalTime += (theIt.endTime - theIt.startTime);
                    }
                    console.log(successfulExpectations.length + ' successful expectations\n' + failedExpectations.length + ' failed expectations\n' + allExpectations.length + ' expectations ran\n' + allIts.length + ' out of ' + allIts.length + ' tests passed\nin ' + totalTime + 'ms');
                } else {
                    pollerTimeout = setTimeout(loops, 100);
                }
            }, 100) : pollerTimeout;
        };
    _.exports({
        afterEach: afterEach,
        beforeEach: beforeEach,
        expect: expect,
        describe: describe,
        it: it
    });
});