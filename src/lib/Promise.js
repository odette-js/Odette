var PROMISE = 'Promise';
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        FAILURE = 'failure',
        SUCCESS = 'success',
        PENDING = 'pending',
        STATE = 'state',
        CATCH = 'catch',
        ALWAYS = 'always',
        REASON = 'reason',
        FULFILLED = 'fulfilled',
        SETTLED = 'settled',
        REJECTED = 'rejected',
        EMPTYING = 'emptying',
        UP_CATCH = capitalize(CATCH),
        EMPTYING_CATCH = EMPTYING + UP_CATCH,
        ALL_STATES = 'allStates',
        STASHED_ARGUMENT = 'stashedArgument',
        STASHED_HANDLERS = 'stashedHandlers',
        LISTENING = 'listening',
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
        executeHandlers = function (promise, obj) {
            var handler, catches = [],
                lastCaught,
                catchesCanRun, arg = promise[STASHED_ARGUMENT] || promise[REASON],
                handlers = promise[STASHED_HANDLERS],
                countLimit = handlers[LENGTH],
                callIt = function () {
                    if (handler.key === CATCH) {
                        catches.push(handler);
                        if (lastCaught) {
                            catchIt(lastCaught);
                        }
                        return;
                    }
                    if (obj[handler.key]) {
                        handler.fn(arg);
                    }
                },
                catchIt = function (e) {
                    var catching;
                    lastCaught = e;
                    catchesCanRun = BOOLEAN_TRUE;
                    catching = catches.slice(0);
                    catches = [];
                    eachCallTry(catching, 'fn', lastCaught);
                };
            if (handlers && handlers[LENGTH]) {
                promise.mark(EMPTYING);
                while (handlers[0] && --countLimit >= 0) {
                    handler = handlers.shift();
                    // should already be bound to promise
                    wraptry(callIt, catchIt);
                }
                if (catchesCanRun) {
                    catchIt(lastCaught);
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
                opts = opts_ === NULL ? (has(promise, STASHED_ARGUMENT) ? promise[STASHED_ARGUMENT] : promise[REASON]) : opts_,
                collectedKeys = collectedKeys || stateCollector(promise, allstates, opts, name, collected, []);
            if (!collectedKeys[LENGTH]) {
                exception(unknownStateErrorMessage);
            }
            executeHandlers(promise, collected, opts);
            return promise;
        },
        addHandler = function (key) {
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
            catch: BOOLEAN_TRUE,
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
        Events = factories.Events,
        followAndResolve = function (newP, key) {
            if (!promise.isChildType(watch)) {
                return promise;
            }
        },
        isPromise = function (promise) {
            return promise && promise[SUCCESS] && promise[FAILURE] && promise[ALWAYS] && promise[CATCH];
        },
        Promise = factories.Promise = _.Promise = Events.extend('Promise', {
            addHandler: addHandler,
            fulfillKey: 'success',
            rejectKey: 'reject',
            auxiliaryStates: returns(BOOLEAN_FALSE),
            constructor: function (handler) {
                var promise = this;
                promise.state = PENDING;
                promise[STASHED_HANDLERS] = [];
                promise[REASON] = BOOLEAN_FALSE;
                promise[CONSTRUCTOR + COLON + 'Events']();
                // cannot have been resolved in any way yet
                // attach some convenience handlers to the
                // instance so we can call crazy custom methods
                intendedObject(extend({}, baseStates, result(promise, 'associativeStates')), NULL, addHandler, promise);
                // add passed in success handlers
                // i do not understand this line,
                // but it is part of the js spec
                if (handler) {
                    handler(bind(promise.fulfill, promise), bind(promise.reject, promise), bind(promise.resolveAs, promise));
                }
                // return the promise
                return promise;
            },
            isChildType: isPromise,
            allStates: function () {
                return extend({}, baseStates, result(this, 'auxiliaryStates'));
            },
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
            fulfill: function (opts) {
                return this.resolveAs(SUCCESS, opts);
            },
            resolve: function (opts) {
                return this.fulfill(opts);
            },
            reject: function (reason) {
                return this.resolveAs(FAILURE, reason);
            },
            when: function () {
                return this.all(arguments);
            },
            thenable: function () {
                return Promise.apply(NULL, arguments);
            },
            then: function (success, failure) {
                var promise = this,
                    newPromise = promise.__constructor__(),
                    capture = function (bool) {
                        return function (val) {
                            var result, proxy;
                            if (bool) {
                                result = success(val);
                            } else {
                                result = failure(val);
                            }
                            proxy = result;
                            if (promise.isChildType(proxy)) {
                                proxy.always(function (a) {
                                    newPromise.resolveAs(proxy.state, a);
                                });
                            } else {
                                newPromise.resolveAs(bool ? SUCCESS : FAILURE, val);
                            }
                        };
                    };
                promise.success(capture(BOOLEAN_TRUE)).failure(capture());
                return newPromise;
            },
            toJSON: function () {
                return {};
            },
            toString: function () {
                return JSON.stringify(this);
            },
            all: distillAllRaces(checkAll),
            race: distillAllRaces(checkAny),
            stash: intendedApi(function (name, list) {
                var promise = this,
                    stashedHandlers = promise[STASHED_HANDLERS];
                // do the hard work now so later you can
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
        resulting = PromisePrototype.addHandler(SUCCESS).addHandler(FAILURE).addHandler(ALWAYS).addHandler(CATCH),
        appPromise = Promise(),
        instanceExposure = function (key) {
            return function () {
                var promise = Promise();
                return promise[key].apply(promise, arguments);
            };
        };
    app.extend({
        dependency: bind(appPromise.all, appPromise)
    });
    Promise.all = instanceExposure('all');
    Promise.race = instanceExposure('race');
    _.publicize({
        isPromise: isPromise
    });
});
var Promise = _.Promise;