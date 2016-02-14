application.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Collection = factories.Collection,
        SUCCESS = 'success',
        REGISTERED = 'registered',
        STATE = 'state',
        EVERY = 'every',
        FAILURES = 'failures',
        COUNTER = 'counter',
        GROUP_INDEX = 'groupIndex',
        curriedEquivalence = function (value) {
            return function (current) {
                return isEqual(current, value);
            };
        },
        curriedGreaterThan = function (value) {
            return function (current) {
                return current > value;
            };
        },
        curriedLessThan = function (value) {
            return function (current) {
                return current < value;
            };
        },
        push = function (where) {
            return function (fn) {
                var sequencer = this;
                sequencer[where].push(bind(fn, sequencer));
                return sequencer;
            };
        },
        addValue = function (constant1, constant2) {
            return function () {
                var sequencer = this;
                duff(arguments, function (value) {
                    sequencer.add(value, constant1, constant2);
                });
                return sequencer;
            };
        },
        isNot = addValue(BOOLEAN_TRUE),
        makeLogic = function (context, key, handler, negate) {
            var bound = bind(handler, context),
                negative_bound = negate ? _.negate(bound) : bound;
            return {
                key: key,
                context: context,
                handler: handler,
                fn: negative_bound
            };
        },
        Linguistics = factories.Events.extend('Linguistics', {
            then: push(SUCCESS),
            always: push(EVERY),
            otherwise: push(FAILURES),
            constructor: function (origin) {
                var sequencer = this;
                sequencer.origin = origin;
                sequencer[COUNTER] = 0;
                sequencer[GROUP_INDEX] = -1;
                sequencer[REGISTERED] = {};
                sequencer.logic = Collection();
                sequencer[SUCCESS] = Collection();
                sequencer[FAILURES] = Collection();
                sequencer[EVERY] = Collection();
                sequencer.group();
                sequencer.listenTo(sequencer.origin, {
                    change: sequencer.apply,
                    destroy: sequencer.stopListening
                });
                return this;
            },
            when: function (key) {
                this[CURRENT] = key;
                this.and(key);
                return this;
            },
            and: function (key) {
                var sequencer = this;
                sequencer[CURRENT] = key;
                sequencer.bind(key);
                return sequencer;
            },
            or: function (key) {
                this.group();
                this.and(key);
                return this;
            },
            group: function () {
                var sequencer = this;
                ++sequencer[GROUP_INDEX];
                sequencer.logic.push({
                    index: sequencer[GROUP_INDEX],
                    list: Collection()
                });
                return sequencer;
            },
            increment: function () {
                ++this[COUNTER];
            },
            bind: function (target) {
                var sequencer = this,
                    registered = sequencer[REGISTERED];
                if (!registered[target]) {
                    registered[target] = BOOLEAN_TRUE;
                    this.listenTo(this.origin, CHANGE_COLON + target, sequencer.increment);
                }
            },
            unbind: function (target) {
                var sequencer = this,
                    registered = sequencer[REGISTERED];
                if (registered[target]) {
                    registered[target] = BOOLEAN_FALSE;
                    this[STOP_LISTENING](this.origin, CHANGE_COLON + target, sequencer.increment);
                }
            },
            is: addValue(),
            isnt: isNot,
            isNot: isNot,
            isGreaterThan: addValue(BOOLEAN_FALSE, curriedGreaterThan),
            isLessThan: addValue(BOOLEAN_FALSE, curriedLessThan),
            isNotGreaterThan: addValue(BOOLEAN_TRUE, curriedGreaterThan),
            isNotLessThan: addValue(BOOLEAN_TRUE, curriedLessThan),
            value: function (value, defaultFn) {
                return isFunction(value) ? value : defaultFn(value);
            },
            add: function (value_, negate, defaultFn) {
                var object, sequencer = this;
                var current = sequencer[CURRENT];
                var value = sequencer.value(value_, defaultFn || curriedEquivalence);
                var made = makeLogic(sequencer, current, value, negate);
                sequencer.logic.index(sequencer[GROUP_INDEX]).list.push(made);
                return sequencer;
            },
            check: function () {
                var sequencer = this;
                return !!(sequencer[COUNTER] && sequencer.logic.find(function (group) {
                    return !group.list.find(function (item) {
                        return !item.fn(sequencer.origin.get(item.key));
                    });
                }));
            },
            restart: function () {
                this[COUNTER] = 0;
                return this;
            },
            handle: function (key, arg) {
                var sequencer = this;
                var ret = sequencer[key] && sequencer[key].call(arg);
                return sequencer;
            },
            run: function () {
                var sequencer = this;
                if (sequencer[STATE]) {
                    sequencer.handle(SUCCESS);
                } else {
                    sequencer.handle(FAILURES);
                }
                sequencer.handle(EVERY);
            },
            apply: function () {
                var sequencer = this,
                    checked = sequencer.check();
                sequencer.restart();
                if (sequencer[STATE] !== checked) {
                    sequencer[STATE] = checked;
                    sequencer.run();
                }
                return sequencer;
            }
        }, BOOLEAN_TRUE),
        LinguisticsManager = Collection.extend('LinguisticsManager', {
            when: function (key) {
                var listDirective = this.directive('children');
                var newish = new Linguistics[CONSTRUCTOR](this.target);
                listDirective.push(newish);
                return newish.when(key);
            },
            constructor: function (target) {
                // save it for later
                this.target = target;
                return this;
            }
        }, BOOLEAN_TRUE);
    app.defineDirective('Linguistics', function (target) {
        return new LinguisticsManager[CONSTRUCTOR](target);
    });
});