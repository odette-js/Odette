var PROMISE = 'Promise',
    DEFERRED = 'Deferred',
    QUEUE = 'queue',
    RESULTS = 'results',
    CAUGHT = 'caught',
    CATCHING = 'catching',
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
    FULFILLED = 'fulfilled';
var Promise = app.scope().block(function (app) {
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
        isPromise = function (p) {
            return p && isObject(p) && isFunction(p.then) && isFunction(p.catch);
        },
        distillary = function (fn, arg) {
            return fn ? fn(arg) : arg;
        },
        emptyQueue = function (p, bool, arg, original) {
            var catching, argument, sliced, resultIsPromise, registry = p.directive(REGISTRY),
                queue = registry.get(INSTANCES, QUEUE);
            if (original && !p.unmark(PENDING)) {
                return arg;
            }
            p.unmark(PENDING);
            p.mark(bool ? FULFILLED : REJECTED);
            p[REGISTRY].keep(INSTANCES, RESULTS, arg);
            if (!queue || !queue.length()) {
                return arg;
            }
            sliced = queue.slice(0);
            p[REGISTRY].drop(INSTANCES, QUEUE);
            sliced.each(function (current) {
                var caught = registry.get(INSTANCES, CAUGHT),
                    result = arg;
                if (!caught) {
                    argument = wraptry(function () {
                        var res, target;
                        if (bool) {
                            target = current[0];
                        } else {
                            target = current[1];
                        }
                        res = distillary(target, result);
                        current[2].directive(REGISTRY).keep(INSTANCES, RESULTS, res);
                        return res;
                    }, function (e) {
                        p.mark(CAUGHT);
                        registry.keep(INSTANCES, CAUGHT, e);
                        caught = e;
                    }, function (e, argument) {
                        return e ? UNDEFINED : argument;
                    });
                }
                if (caught) {
                    if (!(catching = getQueue(current[2], CATCHING)).length()) {
                        // discontinue
                        return;
                    } else {
                        return catching.each(function (item) {
                            item[0](caught);
                        });
                    }
                }
                var nextp = current[2];
                if (isPromise(argument)) {
                    argument.then(emptiesQueue(nextp, BOOLEAN_TRUE), emptiesQueue(nextp));
                } else {
                    emptyQueue(nextp, bool, argument);
                }
            });
            return arg;
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
            }, BOOLEAN_TRUE));
        },
        resultant = function (promise) {
            return promise.directive(REGISTRY).get(INSTANCES, RESULTS);
        },
        /**
         * Implementation just like the native one. Use this object in order to ensure that your promises will work across all browsers, including those that do not support Promises natively.
         * @class Promise
         */
        Promise = _[PROMISE] = factories.Events.extend(PROMISE,
            /**
             * @lends Promise.prototype
             */
            {
                constructor: function (one, bool) {
                    var p = this,
                        maker = function () {
                            one(once(emptiesQueue(p, BOOLEAN_TRUE, BOOLEAN_TRUE)), once(emptiesQueue(p, BOOLEAN_FALSE, BOOLEAN_TRUE)));
                        };
                    p.mark(PENDING);
                    if (bool) {
                        maker();
                    } else {
                        setTimeout(maker);
                    }
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
                        addToQueue(promise, QUEUE, [whensuccessful, whenfailed, pro]);
                        if (!promise.is(PENDING)) {
                            emptyQueue(promise, promise.is(FULFILLED), resultant(promise));
                        }
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
                        if (promise.is(CAUGHT)) {
                            success(erred(resultant(promise)));
                        } else {
                            addToQueue(promise, CATCHING, [erred, promise]);
                        }
                    });
                }
            }),
        raceAllCurry = function (waits) {
            return function (list, bool) {
                if (!isArrayLike(list)) {
                    exception('promise list is not iteratable.');
                }
                return Promise(function (success, failure) {
                    var length = list[LENGTH];
                    var memo = [];
                    var counter = function (index, data) {
                        length--;
                        if (waits) {
                            memo[index] = data;
                            if (!length) {
                                success(memo);
                            }
                        } else {
                            success(data);
                        }
                    };
                    duff(list, function (promise, index) {
                        if (isPromise(promise)) {
                            promise.then(function (data) {
                                counter(index, data);
                            }, failure);
                        } else {
                            counter(index, promise);
                        }
                    });
                }, BOOLEAN_TRUE);
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
    _.publicize({
        Promise: Promise,
        isPromise: isPromise
    });
    return Promise;
});