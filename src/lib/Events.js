var DISPATCH_EVENT = 'dispatchEvent',
    EVENTS = 'eventManager',
    STOP_LISTENING = 'stopListening',
    TALKER_ID = 'talkerId',
    LISTENING_TO = 'listeningTo',
    REGISTERED = 'registered',
    LISTENING_PREFIX = 'l',
    STATE = 'state',
    ACTIONS = 'actions',
    IS_STOPPED = 'isStopped',
    PROPAGATION_IS_STOPPED = 'propagationIsStopped',
    IMMEDIATE_PROP_IS_STOPPED = 'immediatePropagationIsStopped',
    HANDLERS = 'handlers';
application.scope(function (app) {
    var remove = _.remove,
        iterateOverObject = function (box, context, events, handler, iterator, firstArg) {
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
                if (!args[_nameOrObjectIndex]) {
                    return box;
                }
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
                return isEqual(original, e[ORIGIN].get(key));
            };
        },
        turnOff = function (e) {
            return e && e[ORIGIN] && e[ORIGIN].off && e[ORIGIN].off();
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
                context = list[(isObject(nameOrObject) ? 2 : 3)] || box;
                if (nameOrObjectIndex && !args[0]) {
                    return ret;
                }
                intendedObject(nameOrObject, list[1], function (key_, value_, isObject_) {
                    // only allow one to be watched
                    var key = key_.split(SPACE)[0],
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
            var events = box[EVENTS];
            return events && list.duffRight(function (obj) {
                if (obj.disabled || (handler && obj.handler !== handler) || (context && obj.context !== context)) {
                    return;
                }
                events.detach(obj);
            });
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
        SERIALIZED_DATA = '_serializedData',
        ObjectEvent = factories.Directive.extend('ObjectEvent', {
            constructor: function (data, target, name, options) {
                var evnt = this;
                evnt[PROPAGATION_IS_STOPPED] = evnt[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_FALSE;
                evnt[ORIGIN] = target;
                evnt[NAME] = name;
                evnt[TYPE] = name.split(COLON)[0];
                evnt.timeStamp = now();
                evnt[SERIALIZED_DATA] = {};
                evnt.data(data);
                if (options) {
                    extend(evnt, options);
                }
                return evnt;
            },
            isStopped: function () {
                return this[PROPAGATION_IS_STOPPED] || this[IMMEDIATE_PROP_IS_STOPPED];
            },
            data: function (datum) {
                return arguments[LENGTH] ? this.set(datum) : this[SERIALIZED_DATA];
            },
            get: function (key) {
                return this[SERIALIZED_DATA][key];
            },
            set: function (data) {
                var evnt = this;
                evnt[SERIALIZED_DATA] = data;
                return evnt;
            },
            stopImmediatePropagation: function () {
                this.stopPropagation();
                this[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_TRUE;
            },
            stopPropagation: function () {
                this[PROPAGATION_IS_STOPPED] = BOOLEAN_TRUE;
            },
            preventDefault: function () {
                this[DEFAULT_PREVENTED] = BOOLEAN_TRUE;
            },
            defaultIsPrevented: function () {
                return this[DEFAULT_PREVENTED];
            },
            action: function (fn) {
                var evnt = this;
                evnt.directive(ACTIONS).push(fn);
                return evnt;
            },
            finished: function () {
                var actions, evnt = this;
                evnt.isTrusted = BOOLEAN_FALSE;
                if (evnt.defaultIsPrevented()) {
                    return;
                }
                if ((actions = evnt[ACTIONS])) {
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
            resetEvents: _.directives.parody(EVENTS, 'reset'),
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
            off: function (name_, fn_, context_) {
                var context, currentObj, box = this,
                    name = name_,
                    events = box[EVENTS];
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
            stopListening: function (target, name, callback) {
                var listeningTo, notTalking, ids, targetEventsDirective, stillListening = 0,
                    origin = this,
                    originEventsDirective = origin[EVENTS];
                if (!originEventsDirective) {
                    return origin;
                }
                listeningTo = originEventsDirective[LISTENING_TO];
                notTalking = (target && !(targetEventsDirective = target[EVENTS]));
                if (notTalking) {
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
            createEvent: function (data, name, options) {
                return ObjectEvent(data, this, name, options);
            },
            dispatchEvents: function (names) {
                var box = this;
                return duff(gapSplit(names), box.dispatchStack, box) && box;
            },
            dispatchStack: function (name) {
                return this[DISPATCH_EVENT](name);
            },
            hasEvents: function (name) {
                var eventsDirective, evnt = this;
                return (eventsDirective = evnt[EVENTS]) && eventsDirective.has(name) && eventsDirective;
            },
            dispatchEvent: function (name, data, options) {
                var evnt, box = this,
                    eventsDirective = box.hasEvents(name);
                if (eventsDirective && !box.eventManager.running[name]) {
                    evnt = box.createEvent(data, name, options);
                    eventsDirective.dispatch(name, evnt);
                    return evnt.returnValue;
                }
            }
        }, BOOLEAN_TRUE);
});