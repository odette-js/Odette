var DISPATCH_EVENT = 'dispatchEvent';
var _EVENTS = '_events';
var EVENTS = 'events';
var HANDLERS = 'handlers';
application.scope(function (app) {
    var remove = _.remove,
        Collection = factories.Collection,
        SortedCollection = factories.SortedCollection,
        REMOVE_QUEUE = 'removeQueue',
        LISTENING_TO = 'listeningTo',
        TALKER_ID = 'talkerId',
        REGISTERED = 'registered',
        LISTENING_PREFIX = 'l',
        STATE = 'state',
        IS_STOPPED = 'isStopped',
        STOP_LISTENING = 'stopListening',
        IMMEDIATE_PROP_IS_STOPPED = 'immediatePropagationIsStopped',
        iterateOverObject = function (box, context, events, handler, iterator, firstArg) {
            // intendedObject(key, value, function (events, handler) {
            // only accepts a string or a function
            var fn = isString(handler) ? box[handler] : handler,
                valid = !isFunction(fn) && exception({
                    message: 'handler must be a function'
                });
            return duff(gapSplit(events), function (eventName) {
                iterator(box, eventName, {
                    disabled: BOOLEAN_FALSE,
                    namespace: eventName.split(COLON)[0],
                    name: eventName,
                    handler: fn,
                    context: context,
                    origin: box
                }, firstArg);
            });
        },
        // user friendly version
        flattenMatrix = function (iterator, _nameOrObjectIndex) {
            return function (first) {
                var context, args, nameOrObjectIndex, handlersIndex, list, nameOrObject, box = this;
                // if no name or no listen target then fail
                if (!first) {
                    return box;
                }
                args = toArray(arguments);
                nameOrObjectIndex = _nameOrObjectIndex;
                handlersIndex = _nameOrObjectIndex;
                list = args.splice(nameOrObjectIndex);
                nameOrObject = list[0];
                context = list[(isObject(nameOrObject) ? 1 : 2)] || box;
                intendedObject(nameOrObject, list[1], function (events, handlers) {
                    iterateOverObject(box, context, events, handlers, iterator, args[0]);
                });
                return box;
            };
        },
        curriedEquality = function (key, original) {
            return function (e) {
                return isEqual(original, e[TARGET].get(key));
            };
        },
        turnOff = function (e) {
            return e && e[TARGET] && e[TARGET].off && e[TARGET].off();
        },
        setupWatcher = function (iterator, nameOrObjectIndex, triggersOnce) {
            var after = triggersOnce ? turnOff : noop;
            return function () {
                var context, list, args, firstArg, handlersIndex, nameOrObject, original_handler, box = this,
                    ret = {};
                if (!arguments[0]) {
                    return ret;
                }
                args = toArray(arguments);
                handlersIndex = nameOrObjectIndex;
                list = args.splice(nameOrObjectIndex);
                nameOrObject = list[0];
                context = args[handlersIndex - 1];
                if (nameOrObjectIndex && !args[0]) {
                    return ret;
                }
                intendedObject(nameOrObject, list[1], function (key_, value_, isObject_) {
                    // only allow one to be watched
                    var key = key_.split(' ')[0],
                        fun_things = original_handler || bind(list[isObject_ ? 1 : 2], context || box),
                        value = isFunction(value_) ? value_ : curriedEquality(key, value_),
                        handler = function (e) {
                            if (e && value(e)) {
                                fun_things(e);
                                after(e);
                            }
                        };
                    original_handler = fun_things;
                    iterateOverObject(box, context, CHANGE + COLON + key, handler, iterator, args[0]);
                    ret[key] = handler;
                });
                return ret;
            };
        },
        seekAndDestroy = function (box, list, handler, context) {
            var events = box.directive(EVENTS);
            list.duffRight(function (obj) {
                if (obj.disabled || (handler && obj.handler !== handler) || (context && obj.context !== context)) {
                    return;
                }
                events.detach(obj);
            });
        },
        event_incrementer = 1,
        __FN_ID__ = '__fnid__',
        returnsId = function () {
            return this.id;
        },
        attachEventObject = function (box, name, eventObject) {
            box.directive(EVENTS).attach(name, eventObject);
        },
        retreiveListeningObject = function (listener, talker) {
            var listenerDirective = listener.directive(EVENTS),
                talkerDirective = talker.directive(EVENTS),
                talkerId = talkerDirective[TALKER_ID],
                listeningTo = listenerDirective[LISTENING_TO],
                listening = listeningTo[talkerId];
            if (listening) {
                return listening;
            }
            // This talkerect is not listening to any other events on `talker` yet.
            // Setup the necessary references to track the listening callbacks.
            listenerDirective[TALKER_ID] = listenerDirective[TALKER_ID] || uniqueId(LISTENING_PREFIX);
            listening = listeningTo[talkerId] = {
                talker: talker,
                talkerId: talkerId,
                id: listenerDirective[TALKER_ID],
                listeningTo: listeningTo,
                // context: listener,
                count: 0
            };
            return listening;
        },
        DEFAULT_PREVENTED = 'defaultPrevented',
        ObjectEvent = factories.Directive.extend('ObjectEvent', {
            constructor: function (name, target, data) {
                var evnt = this;
                evnt.bubbles = BOOLEAN_FALSE;
                evnt.dispatchChildren = BOOLEAN_FALSE;
                evnt.dispatchTree = BOOLEAN_FALSE;
                evnt.onMethodName = camelCase('on:' + name, COLON);
                evnt.propagationIsStopped = evnt[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_FALSE;
                evnt[TARGET] = target;
                evnt[NAME] = name;
                evnt[TYPE] = name.split(COLON)[0];
                evnt.timeStamp = now();
                evnt.data(data);
                evnt.isTrusted = BOOLEAN_TRUE;
                evnt.returnValue = NULL;
                evnt.namespace = evnt.getNamespace();
                return evnt;
            },
            getNamespace: function () {
                return this.name;
            },
            isStopped: function () {
                return this.propagationIsStopped || this.immediatePropagationIsStopped;
            },
            data: function () {
                return this[DATA];
            },
            get: function (key) {
                return this[DATA][key];
            },
            set: function (key, value) {
                intendedObject(key, value, matchesOneToOne, this[DATA]);
                return this;
            },
            stopImmediatePropagation: function () {
                this.stopPropagation();
                this[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_TRUE;
            },
            stopPropagation: function () {
                this.propagationIsStopped = BOOLEAN_TRUE;
            },
            preventDefault: function () {
                this[DEFAULT_PREVENTED] = BOOLEAN_TRUE;
            },
            defaultIsPrevented: function () {
                return this[DEFAULT_PREVENTED];
            },
            action: function (fn) {
                var evnt = this;
                evnt.directive('actions').push(fn);
                return evnt;
            },
            finished: function () {
                var actions, evnt = this;
                evnt.isTrusted = BOOLEAN_FALSE;
                if (evnt.defaultIsPrevented()) {
                    return;
                }
                if ((actions = evnt.checkDirective('actions'))) {
                    actions.call(evnt);
                }
            }
        }, BOOLEAN_TRUE),
        onceHandler = function (box, name, obj) {
            var fn = obj.fn || obj.handler;
            obj.fn = once(function (e) {
                box.off();
                return fn.apply(this, arguments);
            });
            attachEventObject(box, name, obj);
        },
        listenToHandler = function (box, name, obj, target) {
            var valid, targetDirective = target.directive(EVENTS),
                listeningObject = retreiveListeningObject(box, target),
                eventsDirective = target.directive(EVENTS),
                handlers = eventsDirective[HANDLERS] = eventsDirective[HANDLERS] || {};
            listeningObject.count++;
            obj.listening = listeningObject;
            attachEventObject(target, name, obj);
        },
        listenToOnceHandler = function (box, name, obj, extra) {
            bindOnce(box, name, obj);
            listenToHandler(box, name, obj, extra);
        },
        secretOffIterator = function (box, name, obj) {
            seekAndDestroy(box, !name || box.directive(EVENTS)[HANDLERS][name], obj.handler, obj.context);
        },
        Events = factories.Directive.extend('Events', {
            /**
             * @description attach event handlers to the Box event loop
             * @func
             * @name Box#on
             * @param {String} str - event name to listen to
             * @param {Function|String} fn - event handler or string corresponding to handler on prototype to use for handler
             * @param {Object} context - context that the handler will run in
             * @returns {Box} instance
             */
            uniqueKey: 'c',
            initialize: noop,
            constructor: function (opts) {
                var model = this;
                extend(model, opts);
                model[model.uniqueKey + ID] = model[model.uniqueKey + ID] || uniqueId(model.uniqueKey);
                // reacting to self
                model.on(model.events);
                model.initialize(opts);
                return model;
            },
            on: flattenMatrix(attachEventObject, 0),
            once: flattenMatrix(onceHandler, 0),
            listenTo: flattenMatrix(listenToHandler, 1),
            listenToOnce: flattenMatrix(listenToOnceHandler, 1),
            watch: setupWatcher(attachEventObject, 0),
            watchOnce: setupWatcher(attachEventObject, 0, 1),
            watchOther: setupWatcher(listenToHandler, 1),
            watchOtherOnce: setupWatcher(listenToHandler, 1, 1),
            /**
             * @description attaches an event handler to the events object, and takes it off as soon as it runs once
             * @func
             * @name Box#once
             * @param {String} string - event name that will be triggered
             * @param {Function} fn - event handler that will run only once
             * @param {Object} context - context that will be applied to the handler
             * @returns {Box} instance
             */
            /**
             * @description remove event objects from the _events object
             * @param {String|Function} type - event type or handler. If a match is found, then the event object is removed
             * @param {Function} handler - event handler to be matched and removed
             * @func
             * @name Box#off
             * @returns {Box} instance
             */
            resetEvents: _.directives.parody(EVENTS, 'reset'),
            off: function (name_, fn_, context_) {
                var context, currentObj, box = this,
                    name = name_,
                    events = box.checkDirective(EVENTS);
                if (!events) {
                    return;
                }
                context = isObject(name) ? fn_ : context_;
                if (arguments[LENGTH]) {
                    if (!name) {
                        each(events[HANDLERS], function (list, name) {
                            seekAndDestroy(box, list, fn_, context_);
                        });
                    } else {
                        intendedObject(name, fn_, function (name, fn_) {
                            iterateOverObject(box, context, name, fn_, secretOffIterator);
                        });
                    }
                } else {
                    currentObj = events[STACK].last();
                    if (currentObj) {
                        events.detach(currentObj);
                    }
                }
                return box;
            },
            request: _.directives.parody('messenger', 'request'),
            reply: _.directives.parody('messenger', 'reply'),
            when: _.directives.parody('Linguistics', 'when'),
            // hash this out later
            stopTalking: function () {},
            stopListening: function (target, name, callback) {
                var ids, targetEventsDirective, stillListening = 0,
                    origin = this,
                    originEventsDirective = origin.checkDirective(EVENTS),
                    listeningTo = originEventsDirective[LISTENING_TO],
                    notTalking = (target && !(targetEventsDirective = target.checkDirective(EVENTS)));
                if (!originEventsDirective || notTalking) {
                    return origin;
                }
                ids = target ? [targetEventsDirective[TALKER_ID]] : keys(listeningTo);
                duff(ids, function (id) {
                    var listening = listeningTo[id];
                    if (listening) {
                        listening.talker.off(name, callback);
                    }
                    stillListening = listening[id] ? 1 : 0;
                });
                if (!stillListening && !find(target ? keys(listeningTo) : ids, function (id, key) {
                    return listeningTo[id];
                })) {
                    originEventsDirective[LISTENING_TO] = {};
                }
                return origin;
            },
            /**
             * @description triggers a event loop
             * @func
             * @name Box#fire
             * @param {String} name of the event loop to be triggered
             * @returns {Box} object instance the method is being called on
             */
            createEvent: function (name, data, options) {
                return ObjectEvent(name, this, data, options);
            },
            dispatchEvents: function (names) {
                var box = this;
                return duff(gapSplit(names), box.dispatchStack, box) && box;
            },
            dispatchStack: function (name) {
                return this[DISPATCH_EVENT](name);
            },
            dispatchEvent: function (name, data, options) {
                var evnt, eventsDirective, box = this,
                    has = (eventsDirective = box.checkDirective(EVENTS)) && eventsDirective.has(name);
                if (has) {
                    evnt = box.createEvent(name, data, options);
                    eventsDirective.dispatch(name, evnt);
                    return evnt.returnValue;
                }
            }
        }, BOOLEAN_TRUE),
        listeningCounter = 0,
        attach = function (name, eventObject) {
            var list, eventsDirective = this,
                handlers = eventsDirective[HANDLERS],
                ret = !handlers && exception({
                    message: 'events directive needs a handler object'
                });
            eventObject.id = ++event_incrementer;
            eventObject.valueOf = returnsId;
            eventObject.context = eventObject.context || eventObject.origin;
            eventObject.fn = bind(eventObject.fn || eventObject.handler, eventObject.context);
            // attach the id to the bound function because that instance is private
            eventObject.fn[__FN_ID__] = eventObject.id;
            list = handlers[name] = handlers[name] || SortedCollection(BOOLEAN_TRUE, BOOLEAN_TRUE);
            // attaching name so list can remove itself from hash
            list[NAME] = name;
            // attached so event can remove itself
            eventObject.list = list;
            list.add(eventObject);
        },
        detach = function (evnt) {
            var listeningTo, events = this,
                listening = evnt.listening,
                list = evnt.list,
                disabled = evnt.disabled = BOOLEAN_TRUE;
            if (events[STACK][LENGTH]()) {
                events[REMOVE_QUEUE].add(evnt);
                return BOOLEAN_FALSE;
            } else {
                list.remove(evnt);
                // disconnect it from the list above it
                evnt.list = UNDEFINED;
                // check to see if it was a listening type
                if (!listening) {
                    return BOOLEAN_TRUE;
                }
                // if it was then decrement it
                listening.count--;
                if (listening.count) {
                    return BOOLEAN_TRUE;
                }
                listeningTo = listening.listeningTo;
                listeningTo[listening[TALKER_ID]] = UNDEFINED;
                this.wipe(list);
                return BOOLEAN_TRUE;
            }
        },
        wipe = function (list) {
            if (list[LENGTH]()) {
                return BOOLEAN_FALSE;
            }
            this.scrub(list);
            return BOOLEAN_TRUE;
        },
        scrub = function (list) {
            list.scrubbed = BOOLEAN_TRUE;
            this[HANDLERS][list[NAME]] = NULL;
        },
        reset = function () {
            return each(this.handlers, this.scrub, this);
        },
        queue = function (stack, handler, evnt) {
            return stack.add(handler);
        },
        unQueue = function (stack, handler, evnt) {
            return stack.pop();
        },
        has = function (key) {
            return this.handlers[key] && this.handlers[key][LENGTH]();
        },
        dispatch = function (name, evnt) {
            var events = this,
                stack = events[STACK],
                handlers = events[HANDLERS],
                list = handlers[name],
                removeList = events[REMOVE_QUEUE];
            if (evnt[IMMEDIATE_PROP_IS_STOPPED] || !list || !list[LENGTH]()) {
                return;
            }
            list.find(function (handler) {
                var cached;
                if (!handler.disabled && events.queue(stack, handler, evnt)) {
                    handler.fn(evnt);
                    cached = evnt[IMMEDIATE_PROP_IS_STOPPED];
                    events.unQueue(stack, handler, evnt);
                    return cached;
                }
            });
            if (!stack[LENGTH]() && removeList[LENGTH]()) {
                removeList.duffRight(events.detach, events);
                removeList.empty();
            }
            evnt.finished();
        };
    app.defineDirective(EVENTS, function () {
        return {
            listenId: 'l' + (++listeningCounter),
            handlers: {},
            listeningTo: {},
            stack: Collection(),
            removeQueue: Collection(),
            attach: attach,
            detach: detach,
            has: has,
            wipe: wipe,
            scrub: scrub,
            reset: reset,
            queue: queue,
            unQueue: unQueue,
            dispatch: dispatch
        };
    });
});