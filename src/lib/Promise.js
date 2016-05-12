app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        FAILURE = 'failure',
        SUCCESS = 'success',
        PENDING = 'pending',
        STATE = 'state',
        CATCH = 'catch',
        ALWAYS = 'always',
        FULFILLED = 'fulfilled',
        SETTLED = 'settled',
        REJECTED = 'rejected',
        EMPTYING = 'emptying',
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
        executeHandlers = function (name) {
            var handler, countLimit, promise = this,
                arg = promise[STASHED_ARGUMENT],
                handlers = promise[STASHED_HANDLERS][name];
            if (handlers && handlers[LENGTH]) {
                countLimit = handlers[LENGTH];
                promise.mark(EMPTYING);
                while (handlers[0] && --countLimit >= 0) {
                    handler = handlers.shift();
                    // should already be bound
                    handler(arg);
                }
                promise.unmark(EMPTYING);
            }
            return promise;
        },
        dispatch = function (promise, name) {
            var shouldstop, finalName = name,
                allstates = result(promise, ALL_STATES),
                collected = [];
            while (!shouldstop) {
                if (indexOf(collected, finalName) !== -1) {
                    finalName = BOOLEAN_FALSE;
                } else {
                    if (finalName === SUCCESS) {
                        promise.mark(FULFILLED);
                        promise.unmark(REJECTED);
                    }
                    if (finalName === FAILURE) {
                        promise.unmark(FULFILLED);
                        promise.mark(REJECTED);
                    }
                    finalName = allstates[finalName] && _.add(collected, finalName) ? allstates[finalName] : BOOLEAN_FALSE;
                }
                shouldstop = !isString(finalName);
            }
            return collected[LENGTH] ? duff(collected, executeHandlers, promise) : exception({
                message: 'promise cannot resolve to an unknown state'
            });
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
        Model = factories.Model,
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
                parent.resolveAs(FAILURE, found[STASHED_ARGUMENT]);
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
            catch: ALWAYS,
            always: BOOLEAN_TRUE
        },
        collect = function (promise, list) {
            var collection = promise.directive(COLLECTION);
            flatten(list, BOOLEAN_TRUE, function (pro) {
                if (promise.isChildType(pro)) {
                    collection.add(pro);
                    collection.keep('cid', pro.cid, pro);
                }
            });
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
        Promise = factories.Promise = _.Promise = Model.extend('Promise', {
            addHandler: addHandler,
            constructor: function () {
                var promise = this;
                promise.state = PENDING;
                promise[STASHED_ARGUMENT] = NULL;
                promise[STASHED_HANDLERS] = {};
                promise.reason = BOOLEAN_FALSE;
                Model[CONSTRUCTOR].call(promise);
                // cannot have been resolved in any way yet
                intendedObject(extend({}, baseStates, result(promise, 'associativeStates')), NULL, addHandler, promise);
                // add passed in success handlers
                promise.success(arguments);
                return promise;
            },
            isChildType: function (promise) {
                return promise[SUCCESS] && promise[FAILURE] && promise[ALWAYS] && promise[CATCH];
            },
            auxiliaryStates: function () {
                return BOOLEAN_FALSE;
            },
            allStates: function () {
                return extend({}, baseStates, result(this, 'auxiliaryStates') || {});
            },
            resolveAs: function (resolveAs_, opts_, reason_) {
                var opts = opts_,
                    resolveAs = resolveAs_,
                    promise = this;
                if (promise.is(SETTLED)) {
                    return promise;
                }
                promise.mark(SETTLED);
                promise.state = resolveAs || FAILURE;
                promise[STASHED_ARGUMENT] = opts;
                promise.reason = reason_ ? reason_ : BOOLEAN_FALSE;
                resolveAs = promise.state;
                promise.dispatchEvent('before:resolve');
                promise.dispatchEvents(wraptry(function () {
                    return dispatch(promise, resolveAs);
                }, function (e) {
                    promise.unmark(FULFILLED);
                    e.options = opts;
                    promise[STASHED_ARGUMENT] = e;
                    return dispatch(promise, CATCH);
                }, function (err, returnValue) {
                    return returnValue || [];
                }));
                return promise;
            },
            fulfill: function (opts) {
                return this.resolveAs(SUCCESS, opts);
            },
            resolve: function (opts) {
                return this.fulfill(opts);
            },
            reject: function (opts, reason) {
                return this.resolveAs(FAILURE, opts, reason);
            },
            stash: function (name, list) {
                var promise = this,
                    stashedHandlers = promise[STASHED_HANDLERS];
                intendedObject(name, list, function (name, list) {
                    var byName = stashedHandlers[name] = stashedHandlers[name] || [];
                    flatten(isFunction(list) ? [list] : list, BOOLEAN_TRUE, function (fn) {
                        if (isFunction(fn)) {
                            byName.push(bind(fn, promise));
                        }
                    });
                });
                return promise;
            },
            handle: function (name, fn_) {
                var promise = this,
                    arg = promise[STASHED_ARGUMENT],
                    fn = fn_;
                promise.stash(name, fn);
                if (promise.is(SETTLED)) {
                    dispatch(promise, promise[STATE]);
                }
                return promise;
            },
            when: function () {
                return this.all(arguments);
            },
            all: function () {
                var promise = this;
                if (promise[STATE] !== PENDING) {
                    return promise;
                }
                collect(promise, arguments);
                listen(promise, checkAll);
                return promise;
            },
            race: function () {
                var promise = this;
                if (promise[STATE] !== PENDING) {
                    return promise;
                }
                collect(promise, arguments);
                listen(promise, checkAny);
                return promise;
            },
            then: function (handlers) {
                return this.handle(ALWAYS, handlers);
            }
        }),
        PromisePrototype = Promise[CONSTRUCTOR][PROTOTYPE],
        resulting = PromisePrototype.addHandler(SUCCESS).addHandler(FAILURE).addHandler(ALWAYS).addHandler(CATCH),
        appPromise = Promise();
    app.extend({
        dependency: bind(appPromise.all, appPromise)
    });
});
Promise = _.Promise;