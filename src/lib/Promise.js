var PROMISE = 'Promise';
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
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
        UP_CATCH = capitalize(CATCH),
        PROMISE = 'Promise',
        EMPTYING_CATCH = EMPTYING + UP_CATCH,
        ALL_STATES = 'allStates',
        STASHED_ARGUMENT = 'stashedArgument',
        STASHED_HANDLERS = 'stashedHandlers',
        LISTENING = 'listening',
        noop = _.noop,
        flatten = _.flatten,
        bind = _.bind,
        isString = _.isString,
        intendedObject = _.intendedObject,
        duff = _.duff,
        each = _.each,
        extend = _.extend,
        toArray = _.toArray,
        isFunction = _.isFunction,
        foldl = _.foldl,
        result = _.result,
        wraptry = _.wraptry,
        indexOf = _.indexOf,
        returnsStash = function (promise) {
            return has(promise, REASON) ? promise[REASON] : (has(promise, STASHED_ARGUMENT) ? promise[STASHED_ARGUMENT] : NULL);
        },
        basicFailures = {
            failure: BOOLEAN_TRUE,
            always: BOOLEAN_TRUE
        },
        executeHandlers = function (promise, obj) {
            var handler, catches = [],
                lastCaught,
                arg = promise[REASON],
                argument = returnsStash(promise),
                // catchesCanRun, arg = promise[STASHED_ARGUMENT] || promise[REASON],
                handlers = promise[STASHED_HANDLERS],
                countLimit = handlers[LENGTH],
                callIt = function () {
                    var key = handler.key;
                    if (arg ? basicFailures[key] : obj[key]) {
                        handler.fn(argument);
                    }
                },
                catchIt = function (e) {
                    var catching;
                    arg = promise[REASON] = e;
                };
            if (handlers && handlers[LENGTH]) {
                promise.mark(EMPTYING);
                while (handlers[0] && --countLimit >= 0) {
                    handler = handlers.shift();
                    wraptry(callIt, catchIt);
                }
                promise.unmark(EMPTYING);
            }
        },
        stateCollector = function (promise, allstates, opts, name, collected, collectedKeys) {
            var finalName = name;
            if (!isString(finalName)) {
                exception(unknownStateErrorMessage);
            }
            do {
                if (collected[finalName]) {
                    // check for circularity
                    finalName = BOOLEAN_FALSE;
                } else {
                    if (finalName === SUCCESS) {
                        fulfillment(promise, BOOLEAN_TRUE);
                        promise[STASHED_ARGUMENT] = opts;
                    }
                    if (finalName === FAILURE) {
                        fulfillment(promise, BOOLEAN_FALSE);
                        promise[REASON] = opts;
                    }
                    if (allstates[finalName]) {
                        if (!collected[finalName]) {
                            collected[finalName] = BOOLEAN_TRUE;
                            collectedKeys.push(finalName);
                            finalName = allstates[finalName];
                        } else {
                            // terminate the chain
                            finalName = BOOLEAN_FALSE;
                        }
                    } else {
                        // terminate the chain
                        exception(1 + unknownStateErrorMessage);
                    }
                }
            } while (isString(finalName));
            return collectedKeys;
        },
        unknownStateErrorMessage = 'promise cannot resolve to an unknown or invalid ("", false, null, 0, etc.) state. Please check your resolution tree as well as your resolveAs method input',
        dispatch = function (promise, name, opts_) {
            var finalName = name,
                allstates = result(promise, ALL_STATES),
                // think about stashing these
                collected = {},
                opts = opts_ === NULL ? returnsStash(promise) : opts_,
                collectedKeys = collectedKeys || stateCollector(promise, allstates, opts, name, collected, []);
            if (!collectedKeys[LENGTH]) {
                exception(unknownStateErrorMessage);
            }
            executeHandlers(promise, collected, opts);
            return promise;
        },
        addMethod = function (key) {
            // if you haven't already attached a method, then do so now
            if (!this[key]) {
                this[key] = function () {
                    return this.handle(key, toArray(arguments));
                };
            }
            return this;
        },
        checkAll = function () {
            var notSuccessful, allSettled = BOOLEAN_TRUE,
                parent = this,
                collection = parent.directive(COLLECTION),
                argumentAggregate = [],
                found = collection.find(function (child) {
                    notSuccessful = notSuccessful || child.is(REJECTED);
                    allSettled = allSettled && child.is(SETTLED);
                    argumentAggregate.push(child[STASHED_ARGUMENT]);
                    return notSuccessful;
                });
            if (notSuccessful) {
                parent.resolveAs(FAILURE, found[REASON]);
            } else {
                // none were found that were not resolved
                if (allSettled) {
                    parent.resolveAs(SUCCESS, argumentAggregate);
                }
            }
            return parent;
        },
        checkAny = function () {
            var first, parent = this,
                collection = parent.directive(COLLECTION);
            if ((first = collection.find(function (child) {
                    return child.is(SETTLED);
                }))) {
                parent.resolveAs(first[STATE], first[STASHED_ARGUMENT]);
            }
            return parent;
        },
        baseStates = {
            success: ALWAYS,
            failure: ALWAYS,
            // catch: BOOLEAN_TRUE,
            always: BOOLEAN_TRUE
        },
        collect = function (promise, list) {
            var collection = promise.directive(COLLECTION);
            flatten(list, function (pro) {
                if (promise.isChildType(pro)) {
                    collection.add(pro);
                    collection.keep('cid', pro.cid, pro);
                }
            }, BOOLEAN_TRUE);
        },
        listen = function (promise, unbound) {
            var bound = bind(unbound, promise),
                collection = promise.directive(COLLECTION);
            collection.each(function (pro) {
                if (collection.get(LISTENING, pro.cid)) {
                    return;
                }
                collection.keep(LISTENING, pro.cid, BOOLEAN_TRUE);
                pro.always(function () {
                    bound();
                });
            });
        },
        distillAllRaces = function (check) {
            return function () {
                var promise = this;
                if (promise[STATE] !== PENDING) {
                    return promise;
                }
                collect(promise, toArray(arguments));
                listen(promise, check);
                if (!promise.Collection.length()) {
                    promise.resolve();
                }
                return promise;
            };
        },
        fulfillment = function (promise, bool) {
            promise.remark(FULFILLED, bool);
            promise.remark(REJECTED, !bool);
        },
        followAndResolve = function (newP, key) {
            if (!promise.isChildType(watch)) {
                return promise;
            }
        },
        isPromise = function (promise) {
            return promise && promise[THEN] && promise[CATCH];
        },
        capture = function (success, failure, fn) {
            return fn && isFunction(fn) && function (val) {
                return isPromise(val) ? val.then(success, failure) : fn && fn.call(this, val);
            };
        },
        Events = factories.Events,
        /**
         * A class for creating promises that execute synchonously whenever possible. Promises have a long and complex history. While it is generally accepted that promises will operate the way they do now under the [Promises]{@see mdn} documentation on mdn. While it is best to use the callback, then, catch pattern available for promises, it may also be necessary to resolve promises externally, preventing extra logic from being needed, but allowing for logic to be customized whenever needed.
         * @example <caption>To reiterate: It is best to use the callback, then, catch pattern as defined below. Note the only difference is the <code>_.Promise</code> piece. This is so we can provide extra methods to our users.</caption>
         * return _.Promise(function (success, failure) {
         *     // runs async code
         * }).then(function () {
         *     // promise and internal promises are complete
         * }).catch(function () {
         *     // promise or internal promises failed
         * });
         * @example <caption>if you do not want to have the leading underscore then simply use the following code to set a <code>Promise</code> variable and to back it up with the window.</caption>
         * var Promise = (_ && _.Promise) || function (promise) {
         *     return promise instanceof window.Promise ? promise : return new window.Promise(promise);
         * };
         * @example <caption>members of the constructor have also been included for consistancy</caption>
         * var allDone = Promise.all([p1, p2, p3]);
         * allDone.then(function (results) {
         *     // just like the all / race members on the Promise constructor
         * });
         * @class Promise
         */
        Promise = factories[PROMISE] = _[PROMISE] = Events.extend(PROMISE,
            /**
             * @lends Promise.prototype
             */
            {
                /**
                 * The add handler method is a convenience function that makes the meat of the promise object slightly easier to grasp. The real value offering of an odette promise is that it is extensible and custom resolution states can be fulfilled. This is generally done using the [handle]{@link Promise#handle} function, outlined below. However, if you would like to create a convenience function then you can use the addMethod method to directly add a method and tie it to a resolution state of the same name.
                 * @method
                 * @param {String} method_name name of the method to be added to the promise.
                 * @example <caption>In the following example a promise is created, and a custom handle method is added to the promise. The [handle]{@link Promise#handle} is not inhibited by what methods have already been added.</caption>
                 * var promise = _.Promise();
                 * _.isFunction(promise.circle); // false
                 * promise.handle('circle', function () {
                 *     // do something
                 * });
                 * _.isFunction(promise.circle); // false
                 * promise.addMethod('circle');
                 * _.isFunction(promise.circle); // true
                 * promise.circle(function () {
                 *     // do another thing
                 * });
                 */
                addMethod: addMethod,
                fulfillKey: 'success',
                rejectKey: 'reject',
                /**
                 * In order to add more states than the base 4, odette's promise implementation allows you to extend the state tree by overwriting the auxiliaryStates method. An example of an auxiliary state being used is the {@link HTTP} object. These auxiliary states, compounded with the original state resolution types, give a full tree that can be followed until it resolves to always. For example, a request with a status of 200 would follow the following resolution tree: <code class="inline-code"> "status:200" > "status:2xx" > "success" > "always"</code>, whereas a request with a status of 400 would follow this resolution tree: <code class="inline-code">"status:400" > "status:4xx" > "failure" > "always"</code>
                 * @method
                 * @override
                 * @example <caption>An example of an extra resolution state being added to the promise.</caption>
                 * var promise = _.Promise();
                 * promise.auxiliaryStates = function () {
                 *     return {
                 *         "other": "success"
                 *     };
                 * };
                 */
                auxiliaryStates: returns(BOOLEAN_FALSE),
                constructor: function (handler, bool) {
                    var erred, promise = this;
                    promise.state = PENDING;
                    promise[STASHED_HANDLERS] = [];
                    // promise[REASON] = BOOLEAN_FALSE;
                    promise[CONSTRUCTOR + COLON + 'Events']();
                    // cannot have been resolved in any way yet
                    // attach some convenience handlers to the
                    // instance so we can call crazy custom methods
                    intendedObject(extend({}, baseStates, result(promise, 'associativeStates')), NULL, addMethod, promise);
                    // add passed in success handlers
                    // i do not understand this line,
                    // but it is part of the js spec
                    var call = function () {
                        handler(bind(promise.fulfill, promise), bind(promise.reject, promise), bind(promise.resolveAs, promise));
                    };
                    if (!isFunction(handler)) {
                        console.error("Uncaught TypeError: Promise resolver undefined is not a function");
                        erred = BOOLEAN_TRUE;
                    }
                    if (bool) {
                        promise.mark('synchonous');
                    }
                    if (!erred) {
                        if (bool) {
                            call();
                        } else {
                            setTimeout(call);
                        }
                    }
                    return promise;
                },
                /**
                 * Discerns whether object is a valid promise, i.e. whether it has a catch and try method available to it. This method can be overwritten and when it is, will still be used to discern internally whether or not the object being checked is a promise.
                 * @method
                 * @param {Promise} promise object that needs to be checked to see if it is a promise.
                 * @returns {Boolean}
                 * @example <caption>the following will return true unless the isChildType is overwritten on the instance or prototype.</caption>
                 * promise.isChildType(_.Promise());
                 */
                isChildType: isPromise,
                /**
                 * It is useful when creating a resolution tree to have all of the possible state resolutions available at any given time.
                 * @method
                 * @returns {Object} Hash of the states and what they resolve to.
                 * @example <caption>Below is the base state resolution.</caption>
                 * _.Promise().allStates();
                 * // {
                 * //     success: 'always',
                 * //     failure: 'always',
                 * //     error: 'always',
                 * //     always: true
                 * // }
                 */
                allStates: function () {
                    return extend({}, baseStates, result(this, 'auxiliaryStates'));
                },
                /**
                 * Odette's promises can be resolved in as many ways as they can be configured. In order to resolve promises in the correct state and trigger the subsequent tree, Promises proved a resolveAs method which simplifies this process.
                 * @description Note: In order to resolve the promise to a non base state, (always, success, failure, error) you need to first add to the auxiliary states. Please see [Auxiliary States]{@link Promise#auxiliaryStates}.
                 * @method
                 * @example <caption>If you have all of your auxiliary states setup, then you can simply resolve the promise and the tree will be triggered. Below is an example which uses the same auxiliary states used in the <a href="/api/v0/ajax">Ajax</a> constructor, which is outlined in the [Auxiliary States]{@link Promise#auxiliaryStates}.</caption>
                 * factories.HTTP().handle("status:200", function () {
                 *     // 200 (never hit)
                 * }).handle("status:204", function () {
                 *     // no content (hit)
                 * }).success(function () {
                 *     // success (hit)
                 * }).always(function () {
                 *     // finally finished (hit)
                 * }).then(function () {
                 *     // do another async action from the argument
                 * }).resolveAs('status:204');
                 */
                resolveAs: function (resolveAs_, opts_) {
                    var dispatched, opts = opts_,
                        resolveAs = resolveAs_,
                        promise = this;
                    if (promise.is(SETTLED)) {
                        return promise;
                    }
                    promise.mark(SETTLED);
                    promise.state = resolveAs || FAILURE;
                    resolveAs = promise.state;
                    promise[DISPATCH_EVENT](BEFORE_COLON + 'resolve');
                    dispatched = dispatch(promise, resolveAs, opts === UNDEFINED ? NULL : opts);
                    return promise;
                },
                /**
                 * A Promise can be fulfilled in either a failure state, or a success state. Fulfill resolves into a success state.
                 * @method
                 * @param {*} value resolution value.
                 * @example <caption>resolve the promise externally with any value. Only the first will travel through.</caption>
                 * promise.fulfill(1);
                 */
                fulfill: function (opts) {
                    return this.resolveAs(SUCCESS, opts);
                },
                /**
                 * Proxy for the [fulfill]{@link Promise#fulfill} method
                 * @method
                 * @see Promise#fulfill
                 * @example
                 * return Promise(function () {
                 *     // some async code
                 * }).resolve({});
                 */
                resolve: function (opts) {
                    return this.fulfill(opts);
                },
                /**
                 * A Promise can be resolved in either a failure state, or a success state. Reject resolves into a failure state.
                 * @param  {*} reason description of why the promise failed for error handlers
                 * @return {Promise}
                 * @example <caption>pass a reason if you want to tell failure handlers about the failure.</caption>
                 * promise.reject("I'm going to need you to come in on saturday. M'kay?");
                 */
                reject: function (reason) {
                    return this.resolveAs(FAILURE, reason);
                },
                /**
                 * Comparable to the ECMAScript6's implementation of a Promise's then method.
                 * @method
                 * @param {Function} success callback for resolved state
                 * @param {Function} failure callback for rejected state
                 * @example
                 * var p = Promise(function (success, failure) {
                 *     if (window === window.top) {
                 *         success();
                 *     } else {
                 *         failure();
                 *     }
                 * }).then(function () {
                 *     // i am successful
                 * }, function () {
                 *     // i failed :(
                 * });
                 */
                then: function (success, failure) {
                    var promise = this;
                    return promise.success(capture(success, failure, success)).failure(capture(success, failure, failure));
                },
                /**
                 * Just a proxy for the then method. provides a clearer understanding of what is going on in the code.
                 * @method
                 * @param {Function} failure callback when the code errs out or simply fails.
                 * @returns {this}
                 * @example <caption>the examples below produce identical results.</caption>
                 * return Promise(function () {
                 *     // some async code
                 * }).then(function () {
                 *     // success
                 * }, function () {
                 *     // something failed
                 * });
                 * @example
                 * return Proimse(function () {
                 *     // some async code
                 * }).then(function () {
                 *     // success
                 * }).catch(function () {
                 *     // something failed
                 * });
                 */
                catch: function (failure) {
                    return this.then(NULL, failure);
                },
                /**
                 * Provides a way to serialize the Promise by simply serializing it's result.
                 * @method
                 * @returns {Object} serializable result of getting the stashed resolution argument or failure reason.
                 * @example <caption>returns the resolution as a serializable value.</caption>
                 * var result = promise.toJSON();
                 */
                toJSON: function () {
                    return cloneJSON(returnsStash(this));
                },
                /**
                 * Stringifies the toJSON result.
                 * @method
                 * @returns {String} serialized value (json)
                 * @example
                 * var stringified = promise.toString();
                 */
                toString: function () {
                    return stringify(this);
                },
                /**
                 * When is a convenience function to wrap multiple Promises in an all or nothing manner. If you are waiting for 3 different promises to resolve, then you can use the all method, as well as the _.all method to wrap those 3 promises into a singular promise that will only be fulfilled if all of the promises added to it are also fulfilled. If any are rejected, then the parent promise is also rejected.
                 * @method
                 * @param {...Promise} [promises] Pass a list, or a splat of promises or arrays of promises nested n layers deep (as long as they're not circular) and the all method will recognize them and
                 * @example <caption>Below is an example of three independently resolved promises that both sychronously and asychronously resolve, and use the all wrapping.</caption>
                 * var promise1 = _.Promise();
                 * var promise2 = _.Promise();
                 * var promise3 = _.Promise();
                 * var parentPromise = _.Promise();
                 * promise2.fulfill();
                 * parentPromise.all(promise2, promise1, promise3) //
                 *     .success(function () {
                 *         console.log('everyone is fulfilled');
                 *     }).failure(function () {
                 *         console.log('someone was rejected');
                 *     });
                 * setTimeout(function () {
                 *     promise1.fulfill(); // logs "everyone is fulfilled"
                 * });
                 * promise3.fulfill();
                 * @description Interesting conditions can be created when using all. Take the following for example. Because promises are only resolved once, and they automatically try to resolve as soon as the all method ends, certain conditions and groupings can be created.
                 * @example
                 * var p1 = _.Promise();
                 * var p2 = _.Promise();
                 * var p3 = _.Promise();
                 * var p4 = _.Promise();
                 * p2.resolve(2);
                 * _.Promise().all(p1, p2).all(p3, p4).success(function (list) {
                 *     console.log('finished', list);
                 * });
                 * p3.resolve(3);
                 * p1.resolve(1);
                 * p4.resolve(4); // logs "finished", [1, 2, 3, 4]
                 */
                all: distillAllRaces(checkAll),
                /**
                 * Manages a race method, where the first promise to be resolved will win out and that param will be sent through.
                 * @method
                 * @param {Array} promises list of promises to consider under race conditions.
                 * @returns {this}
                 * @example
                 * var p1 = _.Promise();
                 * var p2 = _.Promise();
                 * p2.resolve(2);
                 * _.Promise().race([p1, p2]).then(function (result) {
                 *     console.log('finished', result);
                 * }); // logs "finished", 2
                 */
                race: distillAllRaces(checkAny),
                /**
                 * Sometimes you only want to stash a handler against a resolve state instead of emptying the resolve tree. If you do not want to trigger that same function if the promise has already resolved to that state, then you can just the stash method to stash the handler against that resolution state / branch.
                 * @method
                 * @param {String} state resolution state to stash the handler against.
                 * @param {Function} handler
                 * @returns {this}
                 * @example <caption>the following example willl not trigger even if the promise is resolved. In order to trigger it, the promise has to have a dispatch executed on it.</caption>
                 * promise.stash('state', function (resolutionArgument) {
                 *     // handle when the state is met
                 * });
                 */
                stash: intendedApi(function (name, list) {
                    var promise = this,
                        stashedHandlers = promise[STASHED_HANDLERS];
                    // do the hard work now, so later you can
                    // iterate through the stack quickly
                    flatten(isFunction(list) ? [list] : list, function (fn) {
                        if (!isFunction(fn)) {
                            return;
                        }
                        stashedHandlers.push({
                            key: name,
                            fn: bind(fn, promise),
                            handler: fn
                        });
                    }, BOOLEAN_TRUE);
                }),
                /**
                 * When the handle method is called, the callback will first be stashed in a queue against that state, then the promise will check to see if it is resolved, and if it is, then it will empty it's resolved state's queue.
                 * @method
                 * @param {String} name name of the resolution state that should be watched for and will be triggered if this handler is hit.
                 * @param {Function} callback handler to be called when the name matches a step on the resolution tree.
                 * @example
                 * promise.handle("circle", function () {
                 *     // circle was hit somewhere on the tree
                 * });
                 */
                handle: intendedApi(function (name, fn_) {
                    var promise = this,
                        arg = promise[STASHED_ARGUMENT],
                        fn = fn_;
                    promise.stash(name, fn);
                    if (promise.is(SETTLED)) {
                        // could be anywhere on the stack chain
                        dispatch(promise, promise[STATE], NULL);
                    }
                })
            }),
        PromisePrototype = Promise[CONSTRUCTOR][PROTOTYPE],
        resulting = PromisePrototype.addMethod(SUCCESS).addMethod(FAILURE).addMethod(ALWAYS).addMethod(CATCH),
        // appPromise = Promise(function (success,failure) {
        //     // body...
        // }),
        instanceExposure = function (key) {
            return function () {
                var promise = Promise();
                return promise[key].apply(promise, arguments);
            };
        };
    /**
     * Returns a resolved promise with a noop as the first argument and true as the second to make it synchronous. (most useful for testing)
     * @name Promise#resolveAs
     * @param  {String} state
     * @param  {*} value argument to pass through the resolution tree.
     * @return {Promise} a new promise
     * @example
     * var resolved = Promise.resolveAs('success', true);
     * resolved.then(function (truth) {
     *     // truth === true
     * });
     */
    Promise.resolveAs = function (key, value) {
        return this(noop, BOOLEAN_TRUE).resolveAs(key, value);
    };
    /**
     * Returns a resolved promise with the value passed as the resolution value
     * @name Promise#resolve
     * @param {*} value the value that will be passed through resolution handlers
     * @returns {Promise} new promise
     * @example <caption>Returns an already resolved promise.</caption>
     * return Promise.resolve("made it!");
     */
    /**
     * Returns a rejected promise with the value passed as the resolution value
     * @name Promise#reject
     * @param {*} value the value that will be passed through resolution handlers
     * @returns {Promise} new promise
     * @example <caption>Returns an already resolved promise.</caption>
     * return Promise.reject("19&3s*oi(s)ee0w");
     */
    // toArray('resolve,reject')
    each({
        resolve: SUCCESS,
        reject: FAILURE
    }, function (val, key) {
        Promise[key] = function (value) {
            return this.resolveAs(val, value);
        };
    });
    /**
     * Returns a promise that handles when all other promises passed in first argument are finished.
     * @name Promise#all
     * @param {Array} promises list of promises to watch and wait until complete
     * @returns {Promise} a new promise
     * @example
     * var allDone = Promise.all([p1, p2, p3]);
     * allDone.then(function (results) {
     *     // results => [1, 2, 3];
     * });
     */
    duff(toArray('all,race'), function (key) {
        Promise[key] = function () {
            var promise = Promise(noop);
            return promise[key].apply(promise, arguments);
        };
    });
    app.extend({
        dependency: bind(Promise.all)
    });
    _.publicize({
        isPromise: isPromise
    });
});
var Promise = _.Promise;