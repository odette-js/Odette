application.scope().module('Promise', function (module, app, _) {
    var blank, flatten = _.flatten,
        extendFrom = _.extendFrom,
        factories = _.factories,
        lengthString = 'length',
        duff = _.duff,
        each = _.each,
        extend = _.extend,
        toArray = _.toArray,
        isFunction = _.isFunction,
        foldr = _.foldr,
        result = _.result,
        collapse = function (args) {
            return foldr(args, function (memo, item) {
                if (item) {
                    memo.push(item);
                }
                return memo;
            }, []);
        },
        when = function () {
            var promise = _.Promise();
            promise.add(_.foldl(flatten(arguments), function (memo, pro) {
                if (promise._isChildType(pro)) {
                    memo.push(pro);
                }
                return memo;
            }, []));
            return promise;
        },
        preventDoOver = {
            success: true,
            failure: true
        },
        dispatch = function (promise, name, opts) {
            promise.dispatchEvent(name, opts);
            if (!preventDoOver[name]) {
                promise.dispatchEvent(promise.isFulfilled() ? 'success' : 'failure', opts);
            }
            promise.dispatchEvent('always', opts);
        },
        executeIfNeeded = function (promise, name) {
            return function () {
                var stashed = promise.get('stashed'),
                    resolved = promise.resolved(),
                    apply = stashed && resolved,
                    // takes N functions from arrays or nested arrays
                    passedFns = each(flatten(arguments), function (fn) {
                        if (isFunction(fn)) {
                            if (apply) {
                                fn.apply(promise, stashed);
                            } else {
                                promise.once(name, fn);
                            }
                        }
                    });
                return promise;
            };
        },
        associativeStates = {
            success: true,
            failure: true,
            error: true,
            always: true
        },
        addState = function (doit, key) {
            var promise = this;
            if (!promise[key] && doit !== false) {
                promise[key] = executeIfNeeded(promise, key);
            }
            return promise;
        },
        Promise = extendFrom.Box('Promise', {
            addState: addState,
            childEvents: {
                always: 'check'
            },
            events: {
                'child:added': 'check'
            },
            constructor: function () {
                var promise = this;
                factories.Box.call(promise);
                promise.restart();
                // cannot have been resolved in any way yet
                _.each(_.extend({}, associativeStates, result(promise, 'associativeStates')), addState, promise);
                // add passed in success handlers
                promise.success(arguments);
                return promise;
            },
            check: function () {
                var notSuccessful, resolveAs, parent = this,
                    children = parent.children;
                if (!children.find(function (idx, child) {
                    notSuccessful = notSuccessful || child.state() !== 'success';
                    return !child.resolved();
                })) {
                    if (notSuccessful) {
                        resolveAs = 'failure';
                    } else {
                        resolveAs = 'success';
                    }
                    parent.resolveAs(resolveAs);
                }
            },
            _isChildType: function (promise) {
                return promise.success && promise.failure && promise.resolve;
            },
            state: function () {
                return this.get('state');
            },
            // returns an object -- always
            auxilarySuccess: function () {
                return {};
            },
            successfulResolves: function () {
                var resultResult = result(this, 'auxilarySuccess') || {};
                resultResult.success = true;
                return resultResult;
            },
            resolved: function () {
                // allows resolved to be defined in a different way
                return this.get('resolved');
            },
            isFulfilled: function () {
                return !!_.resultOf(result(this, 'successfulResolves')[this.get('state')], this);
            },
            isRejected: function () {
                return !this.isFulfilled();
            },
            isPending: function () {
                return this.get('state') === 'pending';
            },
            defaults: function () {
                return {
                    state: 'pending',
                    resolved: false,
                    stashed: {}
                };
            },
            restart: function () {
                var promise = this;
                if (promise.resolved()) {
                    promise.set(promise.defaults());
                }
                return promise;
            },
            resolveAs: function (resolveAs_, opts_) {
                var opts = opts_,
                    resolveAs = resolveAs_,
                    promise = this,
                    stashed = promise.get('stashed');
                if (!promise.resolved()) {
                    if (!_.isString(resolveAs)) {
                        opts = resolveAs;
                        resolveAs = false;
                    }
                    promise.set({
                        resolved: true,
                        state: resolveAs || 'success',
                        stashed: opts || stashed
                    });
                    opts = promise.get('stashed');
                    resolveAs = promise.get('state');
                    try {
                        dispatch(promise, resolveAs, opts);
                    } catch (e) {
                        dispatch(promise, 'error', {
                            // nest the sucker again in case it's an array or something else
                            options: opts,
                            message: 'javascript execution error'
                        });
                    }
                }
                return promise;
            },
            // convenience functions
            resolve: function (opts) {
                return this.resolveAs('success', opts);
            },
            reject: function (opts) {
                return this.resolveAs('failure', opts);
            }
        }, 1);
    _.exports({
        when: when
    });
});