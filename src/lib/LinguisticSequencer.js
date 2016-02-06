application.scope().module('LinguisticSequencer', function (module, app, _, factories, $) {
    var Container = factories.Container,
        Collection = factories.Collection,
        bind = _.bind,
        duff = _.duff,
        isFunction = _.isFunction,
        isEqual = _.isEqual,
        result = _.result,
        CURRENT = 'current',
        _COUNTER = '_counter',
        CHANGE = 'change',
        DESTROY = 'destroy',
        GROUP_INDEX = 'groupIndex',
        REGISTERED = 'registered',
        SUCCESS = 'success',
        FAILURES = 'failures',
        EVERY = 'every',
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
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
                var ls = this;
                ls[WHERE].push(bind(fn, ls));
                return ls;
            };
        },
        addValue = function (constant1, constant2) {
            return function () {
                var ls = this;
                duff(arguments, function (value) {
                    ls.add(value, constant1, constant2);
                });
                return ls;
            };
        },
        isNot = addValue(BOOLEAN_TRUE),
        Sequence = Container.extend('LinguisticSequencer', {
            then: push(SUCCESS),
            always: push(EVERY),
            otherwise: push(FAILURES),
            parentEvents: {
                destroy: DESTROY,
                changed: 'apply'
            },
            initialize: function () {
                var sequencer = this;
                sequencer[_COUNTER] = 0;
                sequencer.logic = Collection();
                sequencer[SUCCESS] = Collection();
                sequencer[FAILURES] = Collection();
                sequencer[EVERY] = Collection();
                sequencer.group();
            },
            defaults: function () {
                return {
                    groupIndex: -1,
                    registered: {}
                };
            },
            and: function (key) {
                var ls = this;
                ls.set(CURRENT, key);
                ls.bind(key, ls.increment);
                return ls;
            },
            or: function (key) {
                this.group();
                this.add(key);
                return this;
            },
            group: function () {
                var ls = this,
                    value = ls.get(GROUP_INDEX);
                ++value;
                ls.set(GROUP_INDEX, value);
                ls.logic.push({
                    index: value,
                    list: Collection()
                });
                return ls;
            },
            increment: function () {
                ++this[_COUNTER];
            },
            bind: function (target, handler) {
                var ls = this,
                    registered = ls.get(REGISTERED);
                if (!registered[target]) {
                    registered[target] = BOOLEAN_TRUE;
                    this.listenTo(this.grandParent(), CHANGE + ':' + target, handler);
                }
            },
            unbind: function (target, handler) {
                var ls = this,
                    registered = ls.get(REGISTERED);
                if (registered[target]) {
                    registered[target] = BOOLEAN_FALSE;
                    this.stopListening(this.grandParent(), CHANGE + ':' + target, handler);
                }
            },
            is: addValue(),
            isNot: isNot,
            isnt: isNot,
            isGreaterThan: addValue(BOOLEAN_FALSE, curriedGreaterThan),
            isLessThan: addValue(BOOLEAN_FALSE, curriedLessThan),
            isNotGreaterThan: addValue(BOOLEAN_TRUE, curriedGreaterThan),
            isNotLessThan: addValue(BOOLEAN_TRUE, curriedLessThan),
            value: function (value, defaultFn) {
                return isFunction(value) ? value : defaultFn(value);
            },
            add: function (value_, negate, defaultFn) {
                var object, ls = this;
                var current = ls.get(CURRENT);
                var value = ls.value(value_, defaultFn || curriedEquivalence);
                var made = ls.make(current, negate ? _.negate(value) : value);
                ls.logic.get(ls.get(GROUP_INDEX)).list.push(made);
                return ls;
            },
            grandParent: function () {
                return this.parent.parent;
            },
            check: function () {
                var sequencer = this,
                    grandparent = sequencer.grandParent();
                return !!sequencer[_COUNTER] && !sequencer.logic.find(function (group) {
                    return group.list.find(function (item) {
                        return !item.handler(grandparent.get(item.key));
                    });
                });
            },
            restart: function () {
                this[_COUNTER] = 0;
                return this;
            },
            make: function (key, handler) {
                var context = this;
                return {
                    key: key,
                    context: context,
                    handler: bind(handler, context)
                };
            },
            handle: function (key, arg) {
                var ls = this;
                var ret = ls[key] && ls[key].call(arg);
                return ls;
            },
            apply: function () {
                var ls = this,
                    checked = ls.check();
                sequencer.restart();
                if (ls._set('previous', checked)) {
                    if (checked) {
                        ls.handle(SUCCESS);
                    } else {
                        ls.handle(FAILURES);
                    }
                    ls.handle(EVERY);
                }
                return ls;
            }
        }, BOOLEAN_TRUE),
        Sequencer = factories.Box.extend('SequenceManager', {
            Model: Sequence,
            constructor: function (secondary) {
                return factories.Box.constructor.call(this, {}, secondary);
            },
            initialize: function () {
                var manager = this,
                    parent = manager.parent,
                    when = function (key) {
                        var sequencer = manager.add({});
                        sequencer.and(key);
                        return sequencer;
                    };
                manager.listenTo(manager.parent, CHANGE, function () {
                    manager.dispatchEvent(CHANGE + 'd');
                });
                if (parent) {
                    if (parent.when) {
                        result(parent.when.manager, DESTROY);
                    }
                    parent.when = when;
                    manager.listenTo(parent, DESTROY, manager.destroy);
                }
            }
        }, BOOLEAN_TRUE);
    app.message.reply('sequencer:linguistic', Sequencer);
});