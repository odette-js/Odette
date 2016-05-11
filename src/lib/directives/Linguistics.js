app.scope(function (app) {
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
        LINGUISTICS = 'Linguistics',
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
        abstractedStopListening = function () {
            this.stopListening();
        },
        Linguistics = factories.Linguistics = factories.Events.extend(LINGUISTICS, {
            then: push(SUCCESS),
            always: push(EVERY),
            otherwise: push(FAILURES),
            is: addValue(),
            isnt: isNot,
            isNot: isNot,
            isGreaterThan: addValue(BOOLEAN_FALSE, curriedGreaterThan),
            isLessThan: addValue(BOOLEAN_FALSE, curriedLessThan),
            isNotGreaterThan: addValue(BOOLEAN_TRUE, curriedGreaterThan),
            isNotLessThan: addValue(BOOLEAN_TRUE, curriedLessThan),
            constructor: function (origin) {
                var sequencer = this;
                sequencer.origin = origin;
                sequencer[COUNTER] = 0;
                sequencer[GROUP_INDEX] = -1;
                sequencer[REGISTERED] = {};
                sequencer.logic = new Collection[CONSTRUCTOR]();
                sequencer[SUCCESS] = new Collection[CONSTRUCTOR]();
                sequencer[FAILURES] = new Collection[CONSTRUCTOR]();
                sequencer[EVERY] = new Collection[CONSTRUCTOR]();
                sequencer.group();
                sequencer.listenTo(sequencer.origin, {
                    change: 'apply',
                    destroy: abstractedStopListening
                });
                return this;
            },
            when: function (key) {
                return this[PARENT] ? this[PARENT].when(key) : exception({
                    message: 'this sequencer has been destroyed'
                });
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
                    list: new Collection[CONSTRUCTOR]()
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
            value: function (value, defaultFn) {
                return isFunction(value) ? value : defaultFn(value);
            },
            add: function (value_, negate, defaultFn) {
                var object, sequencer = this;
                var current = sequencer[CURRENT];
                var value = sequencer.value(value_, defaultFn || curriedEquivalence);
                var made = makeLogic(sequencer, current, value, negate);
                sequencer.logic.item(sequencer[GROUP_INDEX]).list.push(made);
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
        }),
        LINGUISTICS_MANAGER = LINGUISTICS + 'Manager',
        LinguisticsManager = factories[LINGUISTICS_MANAGER] = factories.Model.extend(LINGUISTICS_MANAGER, {
            when: function (key) {
                var newish = new Linguistics[CONSTRUCTOR](this.target);
                this.add(newish);
                return newish.and(key);
            },
            constructor: function (target) {
                // save it for later
                this.target = target;
                return this;
            }
        });
    app.defineDirective(LINGUISTICS, LinguisticsManager[CONSTRUCTOR]);
});