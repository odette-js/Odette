application.scope().module('Promise', function (module, app, _, factories) {
    var blank, flatten = _.flatten,
        LENGTH = 'length',
        FAILURE = 'failure',
        SUCCESS = 'success',
        STATE = 'state',
        ALWAYS = 'always',
        IS_EMPTYING = 'isEmptying',
        ALL_STATES = 'allStates',
        STASHED_ARGUMENT = 'stashedArgument',
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
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        when = function () {
            var promise = _.Promise();
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
                everalways = BOOLEAN_FALSE,
                allstates = result(promise, ALL_STATES);
            while (!shouldstop) {
                everalways = everalways || finalName === ALWAYS;
                promise.executeHandlers(finalName);
                finalName = allstates[finalName];
                shouldstop = !isString(finalName);
            }
            if (!everalways) {
                promise.executeHandlers(ALWAYS);
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
        // associativeStates = {
        //     success: BOOLEAN_TRUE,
        //     failure: BOOLEAN_FALSE,
        //     error: FAILURE,
        //     always: BOOLEAN_TRUE
        // },
        addState = function (key) {
            var promise = this;
            // if you haven't already attached a method, then do so now
            if (!promise[key]) {
                promise[key] = executeIfNeeded(promise, key);
            }
            return promise;
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
                    success: BOOLEAN_TRUE,
                    failure: BOOLEAN_FALSE,
                    error: BOOLEAN_FALSE,
                    always: BOOLEAN_TRUE
                };
            },
            constructor: function () {
                var promise = this;
                factories.Box.constructor.call(promise);
                promise.restart();
                // cannot have been resolved in any way yet
                intendedObject(extend({}, result(promise, 'baseStates'), result(promise, 'associativeStates')), null, bind(addState, promise));
                // add passed in success handlers
                promise.success(arguments);
                return promise;
            },
            check: function () {
                var notSuccessful, resolveAs, parent = this,
                    children = parent.children,
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
                return promise.success && promise.failure && promise.resolve;
            },
            defaults: function () {
                return {
                    state: 'pending',
                    resolved: BOOLEAN_FALSE,
                    stashedArgument: null,
                    stashedHandlers: {}
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
            recognizedState: function (state, states_) {
                var states = states_ || result(this, ALL_STATES);
                return states[state] === BOOLEAN_FALSE || states[state] === BOOLEAN_TRUE;
            },
            resolved: function () {
                // allows resolved to be defined in a different way
                return this.get('resolved');
            },
            isFulfilled: function () {
                return result(this, ALL_STATES)[this.get(STATE)] === BOOLEAN_TRUE;
            },
            isRejected: function () {
                return result(this, ALL_STATES)[this.get(STATE)] === BOOLEAN_FALSE;
            },
            isPending: function () {
                return this.get(STATE) === 'pending';
            },
            resolveAs: function (resolveAs_, opts_) {
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
                    stashedArgument: opts
                });
                resolveAs = promise.get(STATE);
                return wraptry(function () {
                    dispatch(promise, resolveAs);
                    return promise;
                }, function () {
                    promise.set(STASHED_ARGUMENT, {
                        // nest the sucker again in case it's an array or something else
                        options: opts,
                        message: 'javascript execution error'
                    });
                    dispatch(promise, 'error');
                    return promise;
                }, function () {
                    return promise;
                });
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
                if (!handlers || !handlers[LENGTH]) {
                    return promise;
                }
                countLimit = handlers[LENGTH];
                promise.set(IS_EMPTYING, BOOLEAN_TRUE);
                while (handlers[0] && --countLimit >= 0) {
                    handler = handlers.shift();
                    // should already be bound
                    handler(arg);
                }
                promise.set(IS_EMPTYING, BOOLEAN_FALSE);
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