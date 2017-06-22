var Linguistics = app.block(function (app) {
    var STATE = 'state',
        EVERY = 'every',
        ORIGIN = 'origin',
        MANAGER = 'manager',
        SUCCESS = 'success',
        COUNTER = 'counter',
        REGISTRY = 'Registry',
        FAILURES = 'failures',
        INSTANCES = 'instances',
        REGISTERED = 'registered',
        GROUP_INDEX = 'groupIndex',
        LINGUISTICS = 'Linguistics',
        STOP_LISTENING = 'stopListening',
        LINGUISTICS_MANAGER = LINGUISTICS + 'Manager',
        makeCollection = function () {
            return Collection();
        },
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
                this.directive(REGISTRY).get('collections', where, makeCollection).push(bind(fn, this));
                return this;
            };
        },
        addValue = function (constant1, constant2) {
            return function () {
                var sequencer = this;
                forEach(toArray(arguments), function (value) {
                    sequencer.add(value, constant1, constant2);
                });
                return sequencer;
            };
        },
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
            this[STOP_LISTENING](this[ORIGIN]());
            this.directive(REGISTRY).drop(INSTANCES, ORIGIN);
        },
        curryBind = function (method, bool) {
            return function (target) {
                var sequencer = this,
                    registered = sequencer[REGISTERED],
                    t = this.namespaceEvent(target);
                if (registered[t] !== bool) {
                    registered[t] = bool;
                    this[method](this[ORIGIN](), t, sequencer.increment);
                }
            };
        },
        /**
         * @classdesc Linguistics class for abstracting logic away from event handlers and having to set any of them up. The Linguistics object works by distilling all of the values into a binary system of measurement i.e. did you pass the test or did you fail it. If block of logic fails, then the Linguistics manager can be put into a falsey state. However it is possible to have multiple blocks of logic, as you will see with the or operator that you can use with this class.
         * @class  Linguistics
         * @example <caption>The Linguistics class uses a series of logic blocks grouped one layer deep (referred to as logic groups) with or statements in order to achieve a linguistically natural way of abstracting logic behind function calls that appear very similar to sentences.</caption>
         * var linguistic = origin.when("timeHour").is(16)
         *     .and("activity").isNot("cooking")
         *     .or("spiceCount").isLessThan(10)
         *     .then(function () {
         *         // get spices
         *     }).otherwise(function () {
         *         // continue with previous task
         *     });
         */
        Linguistics = factories[LINGUISTICS] = factories.Events.extend(LINGUISTICS,
            /**
             * @lends Linguistics.prototype
             */
            {
                /**
                 * Kind of like a success handler but one that repeats when the state changes.
                 * @method
                 * @param {Function} handler callback that is called every time the expectations, or logic defined before it are met and they were not previously met.
                 * @returns {this}
                 * @example <caption>an origin initializes with when and sets up one block of logic, and sets up a handler afterward.</caption>
                 * origin
                 *     .when('bold').is(true)
                 *     .then(function() {
                 *         // bold was not true before and now it is
                 *     });
                 */
                then: push(SUCCESS),
                /**
                 * Kind of like the failure handler of a promise but one that repeats when the state changes.
                 * @method
                 * @param {Function} handler callback that is called every time the expectations, or logic defined before it are not met and they were previously.
                 * @returns {this}
                 * @example <caption>an origin initializes with when and sets up one block of logic, and sets up a handler afterward.</caption>
                 * origin
                 *     .when('bold').is(true)
                 *     .otherwise(function() {
                 *         // bold was true before and now it is not
                 *     });
                 */
                otherwise: push(FAILURES),
                /**
                 * Every time the state changes, the callbacks passed into the always method will trigger.
                 * @method
                 * @param {Function} handler callback that gets triggered every time the aggregate state of the linguistics object changes.
                 * @returns {this}
                 * @example <caption>an origin initializes with when and sets up one block of logic, and sets up a handler afterward.</caption>
                 * origin
                 *     .when('bold').is(true)
                 *     .always(function() {
                 *         // bold was true before and now it is not
                 *     });
                 */
                always: push(EVERY),
                /**
                 * Associates a value with the key that was previously passed in the or, and, or when call.
                 * @method
                 * @param {*} comparison if not a function then the object or value will be wrapped in a equality comparison function, namely {@link _.isEqual} and compared when needed to the current value. If it is a function, then it will be responsible for resoving and returning a true or false state.
                 * @returns {this} manager call originated from
                 * @example
                 * origin
                 *     .when('size').is(300)... // more logic after
                 *
                 */
                is: addValue(),
                /**
                 * isNot is a value associator. Just like [is]{@link Linguistics#is}, isNot associates a value with the string that was passed in from the when, and, or or call just before this method was called.
                 * @method
                 * @param {*} comparison if not a function then the object or value will be wrapped in a equality comparison function, namely {@link _.isEqual} and compared when needed to the current value. If it is a function, then it will be responsible for resoving and returning a true or false state.
                 * @returns {this} manager call originated from
                 * @example
                 * origin
                 *     .when('size').isNot(300)... // more logic after
                 *
                 */
                isNot: addValue(BOOLEAN_TRUE),
                /**
                 * isGreaterThan compares the value associated with the key from the parameter in the logic block and seeing if the value associated with that key is greater than the value passed in this method.
                 * @method
                 * @param {*} comparison if not a function then the object or value will be wrapped in a equality comparison function, namely {@link _.isEqual} and compared when needed to the current value. If it is a function, then it will be responsible for resoving and returning a true or false state.
                 * @returns {this} manager call originated from
                 * @example
                 * origin
                 *     .when('size').isGreaterThan(300)... // more logic after
                 *
                 */
                isGreaterThan: addValue(BOOLEAN_FALSE, curriedGreaterThan),
                /**
                 * isLessThan compares the value associated with the key from the parameter in the logic block and seeing if the value associated with that key is less than the value passed in this method.
                 * @method
                 * @param {*} comparison if not a function then the object or value will be wrapped in a simple comparison function. If it is a function, then it will be responsible for resoving and returning a true or false state.
                 * @returns {this} manager call originated from
                 * @example
                 * origin
                 *     .when('size').isLessThan(300)... // more logic after
                 *
                 */
                isLessThan: addValue(BOOLEAN_FALSE, curriedLessThan),
                /**
                 * isNotGreaterThan compares the value associated with the key from the parameter in the logic block and checks if the value associated with that key is not greater than the value passed in this method.
                 * @method
                 * @param {*} comparison if not a function then the object or value will be wrapped in a simple comparison function, that will compare the value passed with the current value of the model. If it is a function, then it will be responsible for resoving and returning a true or false state.
                 * @returns {this} manager call originated from
                 * @example
                 * origin
                 *     .when('size').isNotGreaterThan(300)... // more logic after
                 *
                 */
                isNotGreaterThan: addValue(BOOLEAN_TRUE, curriedGreaterThan),
                /**
                 * isNotLessThan compares the value associated with the key from the parameter in the logic block and checks if the value associated with that key is not less than the value passed in this method.
                 * @method
                 * @param {*} comparison if not a function then the object or value will be wrapped in a simple comparison function, that will compare the value passed with the current value of the model. If it is a function, then it will be responsible for resoving and returning a true or false state.
                 * @returns {this} manager call originated from
                 * @example
                 * origin
                 *     .when('size').isNotLessThan(300)... // more logic after
                 *
                 */
                isNotLessThan: addValue(BOOLEAN_TRUE, curriedLessThan),
                /*
                 * This function creates the Lingustics object that is automatically added to the LinguisticsManager object that the when method was invoked from.
                 * @param {object} origin object that the {@link Linguistics} class will listen to for events.
                 * @returns {this}
                 */
                constructor: function (origin, manager, namespacer) {
                    var sequencer = this;
                    var registry = sequencer.directive(REGISTRY);
                    if (namespacer) {
                        sequencer.namespaceEvent = namespacer;
                    }
                    registry.keep(INSTANCES, ORIGIN, origin);
                    registry.keep(INSTANCES, MANAGER, manager);
                    sequencer[COUNTER] = 0;
                    sequencer[GROUP_INDEX] = 0;
                    sequencer[REGISTERED] = {};
                    sequencer.logic = Collection();
                    return sequencer;
                },
                /**
                 * Retreives the origin that was stashed during the constructor call.
                 * @return {Event} origin
                 * @example <caption>The origin call on the second line of the example below will return the origin that was passed into it's constructor (usually the object that called the when method)</caption>
                 * var linguistics = origin.when()... // yada yada yada
                 * linguistics.origin();
                 */
                origin: function () {
                    return this.directive(REGISTRY).get(INSTANCES, ORIGIN);
                },
                /*
                 * Setup up apply and destroy listeners on the origin.
                 * @return {this}
                 */
                listenToOrigin: function () {
                    return this.listenTo(this[ORIGIN](), {
                        change: 'apply',
                        destroy: abstractedStopListening
                    });
                },
                /*
                 * Remove origin listeners.
                 * @return {this}
                 */
                stopListeningToOrigin: function () {
                    return this[STOP_LISTENING](this[ORIGIN](), {
                        change: 'apply',
                        destroy: abstractedStopListening
                    });
                },
                /**
                 * Method for creating a sub block in the logic queue.
                 * @param  {String} key name of the piece of data on the model to watch
                 * @return {this}
                 * @example <caption>The then handler will wait for the "here" and "ready" properties are true.</caption>
                 * origin
                 *     .when("here").is(true)
                 *     .and("ready").is(true)
                 *     .then(function () {
                 *         // do it
                 *     });
                 */
                and: function (key) {
                    var sequencer = this;
                    sequencer.directive(REGISTRY).keep(INSTANCES, CURRENT, key);
                    sequencer.bind(key);
                    return sequencer;
                },
                /**
                 * Method for checking the current key being added to.
                 * @return {String} Property of the logic block that is being added to
                 */
                current: function () {
                    return this.directive(REGISTRY).get(INSTANCES, CURRENT);
                },
                /**
                 * Starts a new block in the logic queue.
                 * @param  {String} key name of the piece of data on the model to watch
                 * @return {this}
                 * @example <caption>The then handler will wait for the "here" and "ready" properties are true.</caption>
                 * origin
                 *     .when("here").is(true)
                 *     .and("ready").is(true)
                 *     .or("departed").is(true)
                 *     .then(function () {
                 *         // do it when here and ready are true, or when departed is true
                 *     });
                 */
                or: function (key) {
                    this.group();
                    this.and(key);
                    return this;
                },
                /*
                 * Creates the next logic group if any blocks have been created by and, or when statements. Will not need to be used externally. mostly useful for internal ([or]{@link Linguistics#or}) methods.
                 * @return {this}
                 */
                group: function () {
                    var sequencer = this;
                    var logic = sequencer.logic;
                    var current = sequencer[GROUP_INDEX];
                    var block = logic.item(current);
                    if (block && block.list.length()) {
                        ++sequencer[GROUP_INDEX];
                    }
                    logic.push({
                        index: sequencer[GROUP_INDEX],
                        list: Collection()
                    });
                    return sequencer;
                },
                /**
                 * Increment counter for change event listener to check. If this function is called, then the next time the change event is dispatched on the origin object the Linguistics object will check through the logic it was given and check to see if the logic has changed.
                 * @return {this}
                 * @example
                 * var linguistics = origin.when("key").is(true) //
                 *     ...
                 * linguistics.apply();
                 * linguistics.increment();
                 * linguistics.apply();
                 */
                increment: function () {
                    ++this[COUNTER];
                    return this;
                },
                namespaceEvent: function (evnt) {
                    return evnt;
                },
                /**
                 * Proxy for returning values being held on the origin model.
                 * @param  {String} key property to be accessed by the origin model.
                 * @return {*} whatever is being held on the origin model.
                 * @example
                 * linguistics.get("property"); // equivalent to code below
                 * linguistics.origin().get("property");
                 */
                get: function (key) {
                    return this.origin().get(key);
                },
                /**
                 * Binds linguistics to origin object's data specific events. this is so an incrementation can occur and the data can be calculated at the end of the pipe, or at the change event. The event will only be bound once, so if bind is called multiple times, only one handler will ever be listening to the model.
                 * @method
                 * @param {String} key key where the data is held.
                 * @example <caption>in addition to autobinding the keys thing1 and thing2 to the "change:thing1" and the "change:thing2" the randomkey was also allowed to increment the count, which basically means that if the "change:randomkey" event is dispatched and neither thing1, nor thing2 have been hit, then the linguistic manager will check the logic groups and find anything out of place. This will auto trigger any [always]{@link Linguistics#always} method handlers</caption>
                 * var linguistics = origin.when("thing1").is("blue")
                 *     .and("thing2").is("red")
                 *     ...
                 * linguistics.bind("randomkey")
                 */
                bind: curryBind('listenTo', BOOLEAN_TRUE),
                /**
                 * Unbinds the linguistics object to the origin's data. Handlers are only put on once, and tracked via the Linguistics object, so if the unbind method is called even once, then the event handler will be taken off.
                 * @method
                 * @param {String} key name of the data property on the origin model to listen to
                 * @returns {this}
                 * @example <caption>the example below shows the key property no longer being listened to. Whenever the "otherkey" property changes, the linguistics object will check the logic, but it will not react if only the "key" property changes.</caption>
                 * var linguistics = origin.when("key").is(true)
                 *     .and("otherkey").is(false)
                 *     ...
                 * linguistics.unbind("key");
                 */
                unbind: curryBind(STOP_LISTENING, BOOLEAN_TRUE),
                /**
                 * Wraps a value against a default function. This function contains the logic for distilling values into functions to be run when the origin changes.
                 * @param  {*} value curried function or value to run save in a callback to be used to compare to the actual value
                 * @param  {Function} [defaultFn] curried function to fallback to in order to resolve the actual value to compare. If no function is passed, then an equivalence function will be used, which utilizes the [isEqual]{@link _#isEqual} method.
                 * @return {Function} curried result of the comparison.
                 * @example
                 * var fn = linguistics.value(true, function (value) {
                 *     return function (current) {
                 *         return current === value;
                 *     };
                 * });
                 */
                value: function (value, defaultFn) {
                    return isFunction(value) ? value : (defaultFn || curriedEquivalence)(value);
                },
                /**
                 * Adds a logic block to the queue in the current logic group, to be evaluated with all of the others.
                 * @param {*} value value to add to the queue (will use current key for the key / property)
                 * @param {Boolean} [negate] denotes the result as a negative value so that when the curried function is called, it will automatically be evaluated into the correct state (it's why we can have isNot, and isNotGreaterThan) methods.
                 * @param {Function} [defaultFn] a function that will be curried and eventually evaluate as a boolean.
                 * @returns {this}
                 * @example <caption>an example of how the add method might be called internally. In this case, the is not greater than function is being expressed.</caption>
                 * linguistics.add(5, true, function (static) {
                 *     return function (dynamic) {
                 *         return static > dynamic;
                 *     };
                 * });
                 * @example <caption>In order to allow for dynamic values to be passed, one can pass a function, at any point (is, isNot, isNotGreaterThan, isLessThan, etc) in order to have a dynamic logic block. The negate parameter is still valid in this instance, and the the function that is passed, will be negated when it is resolved.</caption>
                 * var external = 27;
                 * var externalCheck = function(current) {
                 *     return current === external;
                 * };
                 * linguistics.add(externalCheck, true);
                 * external = 31;
                 */
                add: function (value, negate, defaultFn) {
                    var object, sequencer = this;
                    var current = sequencer.current();
                    var val = sequencer.value(value, defaultFn);
                    var made = makeLogic(sequencer, current, val, negate);
                    sequencer.logic.item(sequencer[GROUP_INDEX]).list.push(made);
                    return sequencer;
                },
                /**
                 * Runs the logic and distills the state of the logic groups and blocks into a single boolean value.
                 * @return {boolean} value to determine whether the then or otherwise callbacks will be triggered.
                 * @example
                 * var linguistics = origin.when("key").is(true)
                 *     .and("otherkey").isNot(true)
                 *     ...
                 * // later
                 * linguistics.check(); // false
                 * // after logic has been met
                 * linguistics.check(); // true
                 */
                check: function () {
                    var sequencer = this;
                    return !!sequencer.logic.find(function (group) {
                        return !group.list.find(function (item) {
                            return !item.fn(sequencer.get(item.key));
                        });
                    });
                },
                /**
                 * Resets the increment counter. This allows you to say, hey, don't actually run your check this time. Wait until the next time the data changes.
                 * @return {this}
                 * @example
                 * var linguistics = origin.when("here").isNot("there")
                 *     .and("up").isNot("down")
                 *     ...
                 * // during a change event sequence, but before the change linguistics change handler gets triggered.
                 * linguistics.restart(); // cancels the linguistics handler before it can use check.
                 */
                restart: function () {
                    this[COUNTER] = 0;
                    return this;
                },
                /**
                 * A bus for triggering success (then), failure (otherwise), or every (always) handlers
                 * @param  {String} key sequence of handlers to trigger
                 * @param  {*} arg singularity to be passed to the callbacks.
                 * @return {this}
                 * @example
                 * var linguistics = origin.when("key");
                 */
                handle: function (key, arg) {
                    var sequencer = this;
                    this.directive(REGISTRY).get('collections', key, makeCollection).forEachCallBound(arg);
                    return sequencer;
                },
                /**
                 * Reapplies the handlers based on the key. Groups will be applied according to the order dictated by the handle method, but only groups will be applied at the same time, since that is what the handle method indicates.
                 * @param  {*} arg Argument to be passed to the handlers (usually an event object)
                 * @return {Linguistics}
                 * @example <caption>the object passed into run will be passed as the first and only argument to the run method. In this case, the handlers will have access to they you variable on the me property.</caption>
                 * linguistics.run({
                 *     me: you
                 * });
                 */
                run: function (arg) {
                    var key, sequencer = this;
                    if (sequencer[STATE]) {
                        key = SUCCESS;
                    } else {
                        key = FAILURES;
                    }
                    return sequencer.handle(key, arg).handle(EVERY, arg);
                },
                /**
                 * Applies the correct state to the sequencer and if that state has changed, then it will trigger all of the handlers associated with that sequencer that need to be applied. If an argument is passed, then the change counter will be checked before the [check]{@link Linguistics#check} method is called.
                 * @param  {*} e Argument to pass to all of the handlers. [Run]{@link Linguistics#run} is called internally to this method.
                 * @return {Linguistics}
                 * @example <caption>the following example will trigger the event handlers on the first, but not the second apply call, since nothing has changed / happen since then.</caption>
                 * linguistics.apply(e);
                 * linguistics.apply(e); // nothing happens
                 */
                apply: function (e) {
                    var sequencer = this,
                        checked = !!(e ? (sequencer[COUNTER] ? sequencer.check() : sequencer[STATE]) : sequencer.check());
                    sequencer.restart();
                    if (sequencer[STATE] !== checked) {
                        sequencer[STATE] = checked;
                        sequencer.run(e);
                    }
                    return sequencer;
                }
            }),
        LinguisticsManager = factories[LINGUISTICS_MANAGER] = factories.Collection.extend(LINGUISTICS_MANAGER, {
            Child: Linguistics[CONSTRUCTOR],
            constructor: function (target) {
                // save it for later
                this.target = target;
                // required if we're not going to call the Collection constructor
                this[CONSTRUCTOR + COLON + COLLECTION]();
                return this;
            },
            when: function (key) {
                return this.make().listenToOrigin().or(key);
            },
            knot: function () {
                return this.target;
            },
            create: function () {
                // it is important to use the new keyword and access the constructor
                // because the origin could be an Linguistics object
                return new this.Child(this.knot(), this, this.namespaceEvent);
            },
            make: function () {
                var manager = this;
                var ling = manager.create();
                manager.add(ling);
                return ling;
            },
            wipe: function (lm) {
                this.remove(lm);
                lm.stopListeningToOrigin();
                return this;
            }
        });
    app.defineDirective(LINGUISTICS_MANAGER, LinguisticsManager[CONSTRUCTOR]);
    return Linguistics;
});