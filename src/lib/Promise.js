application.scope().module('Promise', function (module, app, _, factories) {
    var blank, FAILURE = 'failure',
        SUCCESS = 'success',
        STATE = 'state',
        ALWAYS = 'always',
        IS_EMPTYING = 'isEmptying',
        ALL_STATES = 'allStates',
        STASHED_ARGUMENT = 'stashedArgument',
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
        when = function () {
            var promise = factories.Promise();
            promise.add(foldl(flatten(arguments), function (memo, pro) {
                if (promise._isChildType(pro)) {
                    memo.push(pro);
                }
                return memo;
            }, []));
            return promise;
        },
        dispatch = function (promise, name, opts) {
            var shouldstop, finalName = name,
                allstates = result(promise, ALL_STATES),
                collected = [];
            while (!shouldstop) {
                if (indexOf(collected, finalName) === -1) {
                    collected.push(finalName);
                    promise.executeHandlers(finalName);
                    finalName = allstates[finalName];
                } else {
                    finalName = BOOLEAN_FALSE;
                }
                shouldstop = !isString(finalName);
            }
        },
        executeIfNeeded = function (promise, name) {
            return function () {
                each(flatten(arguments), function (fn) {
                    if (isFunction(fn)) {
                        promise.executeHandler(name, fn, BOOLEAN_TRUE);
                    }
                });
                return promise;
            };
        },
        addState = function (key) {
            var promise = this;
            // if you haven't already attached a method, then do so now
            if (!promise[key]) {
                promise[key] = executeIfNeeded(promise, key);
            }
            return promise;
        },
        stateChecker = function (lookingfor) {
            return function () {
                var resulting = BOOLEAN_FALSE,
                    allstates = result(this, ALL_STATES),
                    next = this.get(STATE);
                while (isString(next) && !resulting) {
                    if (next === lookingfor) {
                        resulting = BOOLEAN_TRUE;
                    }
                }
                return resulting;
            };
        },
        Promise = factories.Box.extend('Promise', {
            addState: addState,
            childEvents: {
                always: 'check'
            },
            events: {
                'child:added': 'check'
            },
            baseStates: function () {
                return {
                    success: ALWAYS,
                    failure: ALWAYS,
                    error: ALWAYS,
                    always: BOOLEAN_TRUE
                };
            },
            constructor: function () {
                var promise = this;
                factories.Box.constructor.call(promise);
                promise.restart();
                // cannot have been resolved in any way yet
                intendedObject(extend({}, result(promise, 'baseStates'), result(promise, 'associativeStates')), NULL, addState, promise);
                // add passed in success handlers
                promise.success(arguments);
                return promise;
            },
            check: function () {
                var notSuccessful, resolveAs, parent = this,
                    children = parent.directive(CHILDREN),
                    argumentAggregate = [];
                if (children.length() && !children.find(function (child) {
                    notSuccessful = notSuccessful || child.state() !== SUCCESS;
                    argumentAggregate.push(child.get(STASHED_ARGUMENT));
                    return !child.resolved();
                })) {
                    parent.resolveAs(notSuccessful ? FAILURE : SUCCESS, argumentAggregate);
                }
            },
            _isChildType: function (promise) {
                return promise[SUCCESS] && promise[FAILURE] && promise[ALWAYS];
            },
            defaults: function () {
                return {
                    state: 'pending',
                    resolved: BOOLEAN_FALSE,
                    stashedArgument: NULL,
                    stashedHandlers: {},
                    reason: BOOLEAN_FALSE
                };
            },
            restart: function () {
                return this.set(this.defaults());
            },
            state: function () {
                return this.get(STATE);
            },
            auxilaryStates: function () {
                return BOOLEAN_FALSE;
            },
            allStates: function () {
                var resultResult = this._allStates = this._allStates || extend({}, result(this, 'baseStates'), result(this, 'auxilaryStates') || {});
                return resultResult;
            },
            fullfillments: function () {
                var allstates = result(this, ALL_STATES);
                var results = this._fullfillments = this._fullfillments || wrap(allstates, function (value, key_) {
                    var key = key_;
                    while (isString(key)) {
                        key = allstates[key];
                    }
                    // has to end in a boolean
                    return key;
                });
                return results;
            },
            isFulfilled: stateChecker(SUCCESS),
            isRejected: stateChecker(FAILURE),
            resolved: function () {
                // allows resolved to be defined in a different way
                return this.get('resolved');
            },
            isPending: function () {
                return this.get(STATE) === 'pending';
            },
            resolveAs: function (resolveAs_, opts_, reason_) {
                var opts = opts_,
                    resolveAs = resolveAs_,
                    promise = this;
                if (promise.resolved()) {
                    return promise;
                }
                if (!isString(resolveAs)) {
                    opts = resolveAs;
                    resolveAs = BOOLEAN_FALSE;
                }
                promise.set({
                    resolved: BOOLEAN_TRUE,
                    // default state if none is given, is to have it succeed
                    state: resolveAs || FAILURE,
                    stashedArgument: opts,
                    reason: reason_ ? reason_ : BOOLEAN_FALSE
                });
                resolveAs = promise.get(STATE);
                wraptry(function () {
                    dispatch(promise, resolveAs);
                }, function () {
                    promise.set(STASHED_ARGUMENT, {
                        // nest the sucker again in case it's an array or something else
                        options: opts,
                        message: 'javascript execution error'
                    });
                    dispatch(promise, 'error');
                });
                return promise;
            },
            // convenience functions
            resolve: function (opts) {
                return this.resolveAs(SUCCESS, opts);
            },
            reject: function (opts) {
                return this.resolveAs(FAILURE, opts);
            },
            executeHandlers: function (name) {
                var handler, countLimit, promise = this,
                    arg = promise.get(STASHED_ARGUMENT),
                    handlers = promise.get('stashedHandlers')[name];
                if (handlers && handlers[LENGTH]) {
                    countLimit = handlers[LENGTH];
                    promise.set(IS_EMPTYING, BOOLEAN_TRUE);
                    while (handlers[0] && --countLimit >= 0) {
                        handler = handlers.shift();
                        // should already be bound
                        handler(arg);
                    }
                    promise.set(IS_EMPTYING, BOOLEAN_FALSE);
                }
                promise.dispatchEvent(name);
                return promise;
            },
            executeHandler: function (name, fn_, needsbinding) {
                var promise = this,
                    arg = promise.get(STASHED_ARGUMENT),
                    fn = fn_;
                promise.stashHandler(name, fn);
                if (promise.resolved() && !promise.get(IS_EMPTYING)) {
                    promise.executeHandlers(name);
                }
                return promise;
            },
            stashHandler: function (name, fn, needsbinding) {
                var promise = this,
                    stashedHandlers = promise.get('stashedHandlers'),
                    byName = stashedHandlers[name] = stashedHandlers[name] || [];
                if (isFunction(fn)) {
                    byName.push(bind(fn, this));
                }
            },
            handle: function (resolutionstate, fun) {
                this.addState(resolutionstate);
                this.executeHandler(resolutionstate, fun, BOOLEAN_TRUE);
                return this;
            }
        }, BOOLEAN_TRUE);
    _.exports({
        when: when
    });
});