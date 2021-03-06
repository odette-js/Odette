var PROMISE = 'Promise',
    DEFERRED = 'Deferred',
    QUEUE = 'queue',
    RESULTS = 'results',
    INSTANCES = 'instances',
    FAILURE = 'failure',
    SUCCESS = 'success',
    PENDING = 'pending',
    THEN = 'then',
    STATE = 'state',
    CATCH = 'catch',
    ALWAYS = 'always',
    REASON = 'reason',
    SETTLED = 'settled',
    REJECTED = 'rejected',
    EMPTYING = 'emptying',
    FULFILLED = 'fulfilled',
    isPromise = _.is.promise = function (p) {
        return p && isObject(p) && isFunction(p.then) && isFunction(p.catch);
    },
    Promise = app.block(function (app) {
        var makeCollection = function () {
                return Collection();
            },
            addToQueue = function (promise, key, list) {
                var queue = getQueue(promise, key);
                queue.push([list]);
            },
            getQueue = function (p, key) {
                return p.directive(REGISTRY).get(INSTANCES, key, makeCollection);
            },
            distillary = function (fn, arg) {
                return fn ? fn(arg) : arg;
            },
            emptyQueue = function (p, bool, result, original) {
                var nextresolution, erred, sliced, resultIsPromise, i, current, execute, argument, caught, nextp, registry = p.directive(REGISTRY),
                    queue = registry.get(INSTANCES, QUEUE);
                if (original && !p.unmark(PENDING)) {
                    return result;
                }
                p.unmark(PENDING);
                p.mark(bool ? FULFILLED : REJECTED);
                registry.keep(INSTANCES, RESULTS, result);
                if (!queue || !queue.length()) {
                    return result;
                }
                sliced = queue.slice(0).toArray();
                registry.drop(INSTANCES, QUEUE);
                execute = function () {
                    return wraptry(function () {
                        var target, res = result;
                        if (bool) {
                            target = current[1];
                        } else {
                            target = current[2];
                            if (!target) {
                                throw res;
                            }
                        }
                        res = distillary(target, res);
                        nextp.directive(REGISTRY).keep(INSTANCES, RESULTS, res);
                        return res;
                    }, function (e) {
                        var nextpReg = nextp.directive(REGISTRY);
                        nextresolution = BOOLEAN_FALSE;
                        nextpReg.keep(INSTANCES, RESULTS, result);
                        return e;
                    });
                };
                for (i = 0; i < sliced.length; i++) {
                    current = sliced[i];
                    nextp = current[0];
                    nextresolution = BOOLEAN_TRUE;
                    argument = execute();
                    if (isPromise(argument)) {
                        argument.then(emptiesQueue(nextp, nextresolution)).catch(emptiesQueue(nextp));
                    } else {
                        emptyQueue(nextp, nextresolution, argument, BOOLEAN_FALSE);
                    }
                }
                return result;
            },
            emptiesQueue = function (p, bool, original) {
                return function (argument) {
                    return emptyQueue(p, bool, argument, original);
                };
            },
            decision = function (p, bool) {
                return once(emptiesQueue(p, bool));
            },
            promiseProxy = function (fn) {
                var s, f, doit = function (pro) {
                    if (s && f) {
                        fn(pro, s, f);
                    } else {
                        setTimeout(function () {
                            doit(pro);
                        });
                    }
                    return pro;
                };
                return doit(Promise(function (success, failure) {
                    s = success;
                    f = failure;
                }));
            },
            resultant = function (promise) {
                return promise.directive(REGISTRY).get(INSTANCES, RESULTS);
            },
            /**
             * Implementation just like the native one. Use this object in order to ensure that your promises will work across all browsers, including those that do not support Promises natively. Pass true as the second argument to make the class execute the function synchronously. This prevents the stack jump that regular promises enforce.
             * @class Promise
             * @example <caption>The following promise executes and waits until the success or failure callback is called to resolve.</caption>
             * _.Promise(function (success, failure) {
             *     success();
             * });
             */
            Promise = _[PROMISE] = factories.Directive.extend(PROMISE,
                /**
                 * @lends Promise.prototype
                 */
                {
                    constructor: function (one_, bool) {
                        var pro, p = this,
                            one = one_;
                        p.mark(PENDING);
                        if (isPromise(one) && !Promise.isInstance(one)) {
                            // native promise
                            pro = one;
                            one = function (s, f) {
                                pro.then(s, f);
                            };
                        }
                        one(once(emptiesQueue(p, BOOLEAN_TRUE, BOOLEAN_TRUE)), once(emptiesQueue(p, BOOLEAN_FALSE, BOOLEAN_TRUE)));
                        return p;
                    },
                    /**
                     * Creates a new promise and fulfills it, if the current context is fulfilled / rejected then the new promise will be resolved in the same way.
                     * @param  {Function} success handler to be called when the promise is fulfilled
                     * @param  {Function} failure handler to be called when the promise is rejected
                     * @return {Promise} new promise
                     */
                    then: function (whensuccessful, whenfailed) {
                        var promise = this;
                        return promiseProxy(function (pro) {
                            addToQueue(promise, QUEUE, [pro, whensuccessful, whenfailed]);
                            if (promise.is(PENDING)) {
                                return;
                            }
                            emptyQueue(promise, promise.is(FULFILLED), resultant(promise));
                        });
                    },
                    /**
                     * Catches errors in the then success / failure handlers.
                     * @param  {Function} erred Handler to run if a previous handler errs out.
                     * @return {Promise}
                     * @example
                     * Promise(function () {
                     *     // async process
                     * }).then(function () {
                     *     throw new Error("invalid result detected");
                     * }).catch(function (e) {
                     *     e.message // "invalid result detected"
                     *     return "default value";
                     * }).then(function (result) {
                     *     result === "default value"; // true
                     * });
                     */
                    catch: function (erred) {
                        var promise = this;
                        return promiseProxy(function (pro, success, failure) {
                            var caught, result;
                            addToQueue(promise, QUEUE, [pro, NULL, erred]);
                            if (promise.is(PENDING)) {
                                return;
                            }
                            emptyQueue(promise, promise.is(FULFILLED), resultant(promise));
                        });
                    }
                }),
            raceAllCurry = function (waits) {
                return function (list, bool) {
                    if (!isArrayLike(list)) {
                        exception('promise list is not iteratable.');
                    }
                    return Promise(function (success, failure) {
                        var failed, length = list[LENGTH];
                        var memo = [];
                        if (!list[LENGTH]) {
                            success([]);
                            return;
                        }
                        forEach(list, function (promise, index) {
                            if (isPromise(promise)) {
                                promise.then(function (data) {
                                    counter(index, data);
                                }).catch(function (res) {
                                    failed = BOOLEAN_TRUE;
                                    return counter(index, res);
                                });
                            } else {
                                counter(index, promise);
                            }
                        });

                        function counter(index, data) {
                            length--;
                            if (failed) {
                                return failure(data);
                            }
                            if (waits) {
                                memo[index] = data;
                                if (!length) {
                                    success(memo);
                                }
                            } else {
                                success(data);
                            }
                        }
                    });
                };
            },
            autoResolve = function (bool) {
                return function (value) {
                    if (bool && isPromise(value)) {
                        return value;
                    } else {
                        return Promise(function (success, failure) {
                            return bool ? success(value) : failure(value);
                        });
                    }
                };
            };
        /**
         * Waits for all promises passed into it to wait and succeed. Will be rejected if any of the promises are rejcted
         * @name Promise#all
         * @param {Array} promises list of promises to wait to complete.
         * @example
         * var newpromise = Promise.all([p1, p2, p3]).then(function (results) {
         *     _.isArray(results); // true
         * });
         */
        Promise.all = raceAllCurry(BOOLEAN_TRUE);
        /**
         * Waits for any of the promises to complete. A fulfillment or rejection of any of the promises passed in would trigger the resolution in the same direction of the promise that gets created.
         * @name Promise#race
         * @param {Array} promises list of promises to wait to complete.
         * @example
         * var racePromise = Promise.race([p1, p2, p3]).then(function (first) {
         *     // first one to finish wins!
         * });
         */
        Promise.race = raceAllCurry();
        Promise.resolve = autoResolve(BOOLEAN_TRUE);
        Promise.reject = autoResolve();
        _.is.promise = isPromise;
        _.publicize({
            Promise: Promise,
            isPromise: isPromise
        });
        return Promise;
    });