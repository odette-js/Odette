var Deferred = app.block(function (app) {
    var UP_CATCH = capitalize(CATCH),
        ALL_STATES = 'allStates',
        STASHED_ARGUMENT = 'stashedArgument',
        STASHED_HANDLERS = 'stashedHandlers',
        LISTENING = 'listening',
        returnsStash = function (deferred) {
            return has(deferred, REASON) ? deferred[REASON] : (has(deferred, STASHED_ARGUMENT) ? deferred[STASHED_ARGUMENT] : NULL);
        },
        basicFailures = {
            failure: BOOLEAN_TRUE,
            always: BOOLEAN_TRUE
        },
        makeCollection = function () {
            return Collection();
        },
        getHandlers = function (deferred) {
            return deferred.directive(REGISTRY).get(INSTANCES, STASHED_HANDLERS, makeCollection);
        },
        executeHandlers = function (deferred, obj) {
            var handler, catches = [],
                lastCaught,
                err = deferred[REASON],
                argument = returnsStash(deferred),
                handlers = getHandlers(deferred).toArray(),
                countLimit = handlers[LENGTH],
                callIt = function () {
                    var key = handler.key;
                    if (err ? obj[key] || basicFailures[key] : obj[key]) {
                        handler.fn(argument);
                    }
                },
                catchIt = function (e) {
                    var catching;
                    err = deferred[REASON] = e;
                };
            if (handlers && handlers[LENGTH]) {
                deferred.mark(EMPTYING);
                while (handlers[0]) {
                    handler = handlers.shift();
                    wraptry(callIt, catchIt);
                }
                deferred.unmark(EMPTYING);
            }
        },
        stateCollector = function (deferred, allstates, opts, name, collected, collectedKeys) {
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
                        fulfillment(deferred, BOOLEAN_TRUE);
                        deferred[STASHED_ARGUMENT] = opts;
                    }
                    if (finalName === FAILURE) {
                        fulfillment(deferred, BOOLEAN_FALSE);
                        deferred[REASON] = opts;
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
        unknownStateErrorMessage = 'deferred cannot resolve to an unknown or invalid ("", false, null, 0, etc.) state. Please check your resolution tree as well as your resolveAs method input',
        dispatch = function (deferred, name, opts_) {
            var finalName = name,
                allstates = result(deferred, ALL_STATES),
                // think about stashing these
                collected = {},
                opts = opts_ === NULL ? returnsStash(deferred) : opts_,
                collectedKeys = collectedKeys || stateCollector(deferred, allstates, opts, name, collected, []);
            if (!collectedKeys[LENGTH]) {
                exception(unknownStateErrorMessage);
            }
            executeHandlers(deferred, collected, opts);
            return deferred;
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
        collect = function (deferred, list) {
            var collection = deferred.directive(COLLECTION);
            flatten(list, function (pro) {
                if (deferred.isChildType(pro)) {
                    collection.add(pro);
                    collection.keep('cid', pro.cid, pro);
                }
            }, BOOLEAN_TRUE);
        },
        listen = function (deferred, unbound) {
            var bound = bind(unbound, deferred),
                collection = deferred.directive(COLLECTION);
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
                var deferred = this;
                if (deferred[STATE] !== PENDING) {
                    return deferred;
                }
                collect(deferred, toArray(arguments));
                listen(deferred, check);
                if (!deferred.Collection.length()) {
                    deferred.resolve();
                }
                return deferred;
            };
        },
        fulfillment = function (deferred, bool) {
            deferred.remark(FULFILLED, bool);
            deferred.remark(REJECTED, !bool);
        },
        followAndResolve = function (newP, key) {
            if (!deferred.isChildType(watch)) {
                return deferred;
            }
        },
        isDeferred = function (deferred) {
            return deferred && deferred[THEN] && deferred[CATCH];
        },
        capture = function (success, failure, fn) {
            return fn && isFunction(fn) && function (val) {
                return isDeferred(val) ? val.then(success, failure) : fn && fn.call(this, val);
            };
        },
        /**
         * A class for creating deferred objects. If you are looking for async process management and are able to contain your resolution logic in a single place, then [Promises]{@link Promise} may be for you. Deferred objects allow async processes that may need to be resolved externally. (good for aborts or other types of cancels)
         * @class Deferred
         * @extends {Events}
         */
        Deferred = factories[DEFERRED] = _[DEFERRED] = Events.extend(DEFERRED,
            /**
             * @lends Deferred.prototype
             */
            {
                /**
                 * The add handler method is a convenience function that makes the meat of the deferred object slightly easier to grasp. The real value offering of an odette deferred is that it is extensible and custom resolution states can be fulfilled. This is generally done using the [handle]{@link Deferred#handle} function, outlined below. However, if you would like to create a convenience function then you can use the addMethod method to directly add a method and tie it to a resolution state of the same name.
                 * @method
                 * @param {String} method_name name of the method to be added to the deferred.
                 * @example <caption>In the following example a deferred is created, and a custom handle method is added to the deferred. The [handle]{@link Deferred#handle} is not inhibited by what methods have already been added.</caption>
                 * var deferred = _.Deferred();
                 * _.isFunction(deferred.circle); // false
                 * deferred.handle('circle', function () {
                 *     // do something
                 * });
                 * _.isFunction(deferred.circle); // false
                 * deferred.addMethod('circle');
                 * _.isFunction(deferred.circle); // true
                 * deferred.circle(function () {
                 *     // do another thing
                 * });
                 */
                addMethod: addMethod,
                fulfillKey: 'success',
                rejectKey: 'reject',
                /**
                 * In order to add more states than the base 4, odette's deferred implementation allows you to extend the state tree by overwriting the auxiliaryStates method. An example of an auxiliary state being used is the {@link HTTP} object. These auxiliary states, compounded with the original state resolution types, give a full tree that can be followed until it resolves to success / failure, and then always. For example, a request with a status of 200 would follow the following resolution tree: <code class="inline-code"> "status:200" > "status:2xx" > "success" > "always"</code>, whereas a request with a status of 400 would follow this resolution tree: <code class="inline-code">"status:400" > "status:4xx" > "failure" > "always"</code>
                 * @method
                 * @override
                 * @example <caption>An example of an extra resolution state being added to the deferred.</caption>
                 * var deferred = _.Deferred();
                 * deferred.auxiliaryStates = function () {
                 *     return {
                 *         "other": "success"
                 *     };
                 * };
                 */
                auxiliaryStates: returns(BOOLEAN_FALSE),
                constructor: function (handler, bool) {
                    var erred, deferred = this;
                    deferred.state = PENDING;
                    deferred[CONSTRUCTOR + COLON + 'Events']();
                    // cannot have been resolved in any way yet
                    // attach some convenience handlers to the
                    // instance so we can call crazy custom methods
                    intendedObject(extend([{}, baseStates, result(deferred, 'associativeStates')]), NULL, addMethod, deferred);
                    return deferred;
                },
                /**
                 * Discerns whether object is a valid deferred, i.e. whether it has a catch and try method available to it. This method can be overwritten and when it is, will still be used to discern internally whether or not the object being checked is a deferred.
                 * @method
                 * @param {Deferred} deferred object that needs to be checked to see if it is a deferred.
                 * @returns {Boolean}
                 * @example <caption>the following will return true unless the isChildType is overwritten on the instance or prototype.</caption>
                 * deferred.isChildType(_.Deferred());
                 */
                isChildType: isDeferred,
                /**
                 * It is useful when creating a resolution tree to have all of the possible state resolutions available at any given time.
                 * @method
                 * @returns {Object} Hash of the states and what they resolve to.
                 * @example <caption>Below is the base state resolution.</caption>
                 * _.Deferred().allStates();
                 * // {
                 * //     success: 'always',
                 * //     failure: 'always',
                 * //     error: 'always',
                 * //     always: true
                 * // }
                 */
                allStates: function () {
                    return extend([{}, baseStates, result(this, 'auxiliaryStates')]);
                },
                /**
                 * Odette's deferreds can be resolved in as many ways as they can be configured. In order to resolve deferreds in the correct state and trigger the subsequent tree, Deferreds proved a resolveAs method which simplifies this process.
                 * @description Note: In order to resolve the deferred to a non base state, (always, success, failure, error) you need to first add to the auxiliary states. Please see [Auxiliary States]{@link Deferred#auxiliaryStates}.
                 * @method
                 * @example <caption>If you have all of your auxiliary states setup, then you can simply resolve the deferred and the tree will be triggered. Below is an example which uses the same auxiliary states used in the <a href="/api/v0/ajax">Ajax</a> constructor, which is outlined in the [Auxiliary States]{@link Deferred#auxiliaryStates}.</caption>
                 * $.HTTP().handle("status:200", function () {
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
                        deferred = this;
                    if (deferred.is(SETTLED)) {
                        return deferred;
                    }
                    deferred.mark(SETTLED);
                    deferred.state = resolveAs || FAILURE;
                    resolveAs = deferred.state;
                    deferred[DISPATCH_EVENT](BEFORE_COLON + 'resolve');
                    dispatched = dispatch(deferred, resolveAs, opts === UNDEFINED ? NULL : opts);
                    return deferred;
                },
                /**
                 * A Deferred can be fulfilled in either a failure state, or a success state. Fulfill resolves into a success state.
                 * @method
                 * @param {*} value resolution value.
                 * @example <caption>resolve the deferred externally with any value. Only the first will travel through.</caption>
                 * deferred.fulfill(1);
                 */
                fulfill: function (opts) {
                    return this.resolveAs(SUCCESS, opts);
                },
                /**
                 * Proxy for the [fulfill]{@link Deferred#fulfill} method
                 * @method
                 * @see Deferred#fulfill
                 * @example
                 * return Deferred(function () {
                 *     // some async code
                 * }).resolve({});
                 */
                resolve: function (opts) {
                    return this.fulfill(opts);
                },
                /**
                 * A Deferred can be resolved in either a failure state, or a success state. Reject resolves into a failure state.
                 * @param  {*} reason description of why the deferred failed for error handlers
                 * @return {Deferred}
                 * @example <caption>pass a reason if you want to tell failure handlers about the failure.</caption>
                 * deferred.reject("I'm going to need you to come in on saturday. M'kay?");
                 */
                reject: function (reason) {
                    return this.resolveAs(FAILURE, reason);
                },
                /**
                 * Comparable to the ECMAScript6's implementation of a Deferred's then method.
                 * @method
                 * @param {Function} success callback for resolved state
                 * @param {Function} failure callback for rejected state
                 * @example
                 * var p = Deferred(function (success, failure) {
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
                    var deferred = this;
                    return deferred.success(capture(success, failure, success)).failure(capture(success, failure, failure));
                },
                /**
                 * Just a proxy for the then method. provides a clearer understanding of what is going on in the code.
                 * @method
                 * @param {Function} failure callback when the code errs out or simply fails.
                 * @returns {this}
                 * @example <caption>Use the same pattern as the Promise object, (though, with less sophistocated routing).</caption>
                 * return Deferred(function () {
                 *     // some async code
                 * }).then(function () {
                 *     // success
                 * }, function () {
                 *     // something failed
                 * });
                 */
                catch: function (failure) {
                    return this.then(NULL, failure);
                },
                /**
                 * Provides a way to serialize the Deferred by simply serializing it's result.
                 * @method
                 * @returns {Object} serializable result of getting the stashed resolution argument or failure reason.
                 * @example <caption>returns the resolution as a serializable value.</caption>
                 * var result = deferred.toJSON();
                 */
                toJSON: function () {
                    return cloneJSON(returnsStash(this));
                },
                /**
                 * Stringifies the toJSON result.
                 * @method
                 * @returns {String} serialized value (json)
                 * @example
                 * var stringified = deferred.toString();
                 */
                toString: function () {
                    return stringify(this);
                },
                /**
                 * When is a convenience function to wrap multiple Deferreds in an all or nothing manner. If you are waiting for 3 different deferreds to resolve, then you can use the all method, as well as the _.all method to wrap those 3 deferreds into a singular deferred that will only be fulfilled if all of the deferreds added to it are also fulfilled. If any are rejected, then the parent deferred is also rejected.
                 * @method
                 * @param {...Deferred} [deferreds] Pass a list, or a splat of deferreds or arrays of deferreds nested n layers deep (as long as they're not circular) and the all method will recognize them and
                 * @example <caption>Below is an example of three independently resolved deferreds that both sychronously and asychronously resolve, and use the all wrapping.</caption>
                 * var deferred1 = _.Deferred();
                 * var deferred2 = _.Deferred();
                 * var deferred3 = _.Deferred();
                 * var parentDeferred = _.Deferred();
                 * deferred2.fulfill();
                 * parentDeferred.all(deferred2, deferred1, deferred3) //
                 *     .success(function () {
                 *         console.log('everyone is fulfilled');
                 *     }).failure(function () {
                 *         console.log('someone was rejected');
                 *     });
                 * setTimeout(function () {
                 *     deferred1.fulfill(); // logs "everyone is fulfilled"
                 * });
                 * deferred3.fulfill();
                 * @description Interesting conditions can be created when using all. Take the following for example. Because deferreds are only resolved once, and they automatically try to resolve as soon as the all method ends, certain conditions and groupings can be created.
                 * @example
                 * var p1 = _.Deferred();
                 * var p2 = _.Deferred();
                 * var p3 = _.Deferred();
                 * var p4 = _.Deferred();
                 * p2.resolve(2);
                 * _.Deferred().all(p1, p2).all(p3, p4).success(function (list) {
                 *     console.log('finished', list);
                 * });
                 * p3.resolve(3);
                 * p1.resolve(1);
                 * p4.resolve(4); // logs "finished", [1, 2, 3, 4]
                 */
                all: distillAllRaces(checkAll),
                /**
                 * Manages a race method, where the first deferred to be resolved will win out and that param will be sent through.
                 * @method
                 * @param {Array} deferreds list of deferreds to consider under race conditions.
                 * @returns {this}
                 * @example
                 * var p1 = _.Deferred();
                 * var p2 = _.Deferred();
                 * p2.resolve(2);
                 * _.Deferred().race([p1, p2]).then(function (result) {
                 *     console.log('finished', result);
                 * }); // logs "finished", 2
                 */
                race: distillAllRaces(checkAny),
                /**
                 * Sometimes you only want to stash a handler against a resolve state instead of emptying the resolve tree. If you do not want to trigger that same function if the deferred has already resolved to that state, then you can just the stash method to stash the handler against that resolution state / branch.
                 * @method
                 * @param {String} state resolution state to stash the handler against.
                 * @param {Function} handler
                 * @returns {this}
                 * @example <caption>the following example willl not trigger even if the deferred is resolved. In order to trigger it, the deferred has to have a dispatch executed on it.</caption>
                 * deferred.stash('state', function (resolutionArgument) {
                 *     // handle when the state is met
                 * });
                 */
                stash: intendedApi(function (name, list) {
                    var deferred = this,
                        stashedHandlers = getHandlers(deferred);
                    // do the hard work now, so later you can
                    // iterate through the stack quickly
                    flatten(isFunction(list) ? [list] : list, function (fn) {
                        if (!isFunction(fn)) {
                            return;
                        }
                        stashedHandlers.push({
                            key: name,
                            fn: bind(fn, deferred),
                            handler: fn
                        });
                    }, BOOLEAN_TRUE);
                }),
                /**
                 * When the handle method is called, the callback will first be stashed in a queue against that state, then the deferred will check to see if it is resolved, and if it is, then it will empty it's resolved state's queue.
                 * @method
                 * @param {String} name name of the resolution state that should be watched for and will be triggered if this handler is hit.
                 * @param {Function} callback handler to be called when the name matches a step on the resolution tree.
                 * @example
                 * deferred.handle("circle", function () {
                 *     // circle was hit somewhere on the tree
                 * });
                 */
                handle: intendedApi(function (name, fn_) {
                    var deferred = this,
                        arg = deferred[STASHED_ARGUMENT],
                        fn = fn_;
                    deferred.stash(name, fn);
                    if (deferred.is(SETTLED)) {
                        // could be anywhere on the stack chain
                        dispatch(deferred, deferred[STATE], NULL);
                    }
                })
            });
    Deferred.fn //
        .addMethod(SUCCESS) //
        .addMethod(FAILURE) //
        .addMethod(ALWAYS);
    /**
     * Returns a resolved deferred with a noop as the first argument and true as the second to make it synchronous. (most useful for testing)
     * @name Deferred#resolveAs
     * @param  {String} state
     * @param  {*} value argument to pass through the resolution tree.
     * @return {Deferred} a new deferred
     * @example
     * var resolved = Deferred.resolveAs('success', true);
     * resolved.then(function (truth) {
     *     // truth === true
     * });
     */
    // Deferred.resolveAs = function (key, value) {
    //     return this().resolveAs(key, value);
    // };
    /**
     * Returns a resolved deferred with the value passed as the resolution value
     * @name Deferred#resolve
     * @param {*} value the value that will be passed through resolution handlers
     * @returns {Deferred} new deferred
     * @example <caption>Returns an already resolved deferred.</caption>
     * return Deferred.resolve("made it!");
     */
    /**
     * Returns a rejected deferred with the value passed as the resolution value
     * @name Deferred#reject
     * @param {*} value the value that will be passed through resolution handlers
     * @returns {Deferred} new deferred
     * @example <caption>Returns an already resolved deferred.</caption>
     * return Deferred.reject("19&3s*oi(s)ee0w");
     */
    // toArray('resolve,reject')
    // each({
    //     resolve: SUCCESS,
    //     reject: FAILURE
    // }, function (val, key) {
    //     Deferred[key] = function (value) {
    //         return this.resolveAs(val, value);
    //     };
    // });
    /**
     * Returns a deferred that handles when all other deferreds passed in first argument are finished.
     * @name Deferred#all
     * @param {Array} deferreds list of deferreds to watch and wait until complete
     * @returns {Deferred} a new deferred
     * @example
     * var allDone = Deferred.all([p1, p2, p3]);
     * allDone.then(function (results) {
     *     // results => [1, 2, 3];
     * });
     */
    duff(toArray('all,race'), function (key) {
        Deferred[key] = function () {
            var deferred = Deferred();
            return deferred[key].apply(deferred, arguments);
        };
    });
    // app.extend({
    //     dependency: Deferred.all
    // });
    _.publicize({
        isDeferred: isDeferred
    });
    return Deferred;
});