var DISPATCH_EVENT = 'dispatchEvent',
    EVENTS = 'EventManager',
    STOP_LISTENING = 'stopListening',
    TALKER_ID = 'talkerId',
    LISTENING_TO = 'listeningTo',
    REGISTERED = 'registered',
    LISTENING_PREFIX = 'l',
    STATE = 'state',
    HANDLERS = 'handlers';
app.scope(function (app) {
    var iterateOverObject = function (eventer, context, events, handler, iterator, firstArg) {
            // only accepts a string or a function
            var fn = isString(handler) ? eventer[handler] : handler,
                valid = !isFunction(fn) && exception({
                    message: 'handler must be a function or a string with a method on the originating object'
                }),
                directive = eventer.directive(EVENTS);
            return duff(gapSplit(events), function (eventName) {
                iterator(eventer, eventName, directive.make(eventName, fn, eventer, context), firstArg);
            });
        },
        // user friendly version
        flattenMatrix = function (iterator, _nameOrObjectIndex) {
            return function (first) {
                var context, args, nameOrObjectIndex, handlersIndex, list, nameOrObject, eventer = this;
                // if no name or no listen target then fail
                if (!first) {
                    return eventer;
                }
                args = toArray(arguments);
                if (!args[_nameOrObjectIndex]) {
                    return eventer;
                }
                nameOrObjectIndex = _nameOrObjectIndex;
                handlersIndex = _nameOrObjectIndex;
                list = args.splice(nameOrObjectIndex);
                nameOrObject = list[0];
                context = list[(isObject(nameOrObject) ? 1 : 2)] || eventer;
                intendedObject(nameOrObject, list[1], function (events, handlers) {
                    iterateOverObject(eventer, context, events, handlers, iterator, args[0]);
                });
                return eventer;
            };
        },
        curriedEquality = function (key, original) {
            return function (e) {
                return isEqual(original, e[ORIGIN].get(key));
            };
        },
        makeHandler = function (directive, object) {
            object.fn = function (e) {
                if (e && object.comparator(e)) {
                    if (object.triggersOnce) {
                        directive.detach(object);
                    }
                    object.runner(e);
                }
            };
        },
        setupWatcher = function (nameOrObjectIndex, triggersOnce) {
            return function () {
                var context, list, args, firstArg, handlersIndex, nameOrObject, original_handler, directive, eventer = this,
                    ret = {};
                if (!arguments[0]) {
                    return ret;
                }
                args = toArray(arguments);
                handlersIndex = nameOrObjectIndex;
                list = args.splice(nameOrObjectIndex);
                nameOrObject = list[0];
                context = list[(isObject(nameOrObject) ? 2 : 3)] || eventer;
                if (nameOrObjectIndex && !args[0]) {
                    return ret;
                }
                if (nameOrObjectIndex) {
                    directive = args[0].directive(EVENTS);
                } else {
                    directive = eventer.directive(EVENTS);
                }
                intendedObject(nameOrObject, list[1], function (key_, value_, isObject_) {
                    // only allow one to be watched
                    var key = key_.split(SPACE)[0],
                        fun_things = original_handler || bind(list[isObject_ ? 1 : 2], context || eventer),
                        value = isFunction(value_) ? value_ : curriedEquality(key, value_),
                        // handler = makeHandler(fun_things, value, triggersOnce, directive),
                        name = CHANGE + COLON + key,
                        origin = eventer,
                        made = directive.make(name, fun_things, eventer, context);
                    if (nameOrObjectIndex) {
                        listenToModifier(eventer, name, made, args[0]);
                        origin = args[0];
                    }
                    made.comparator = value;
                    made.triggersOnce = !!triggersOnce;
                    made.runner = fun_things;
                    attachEventObject(origin, name, made, makeHandler);
                    ret[key] = fun_things;
                });
                return ret;
            };
        },
        listenToModifier = function (eventer, name, obj, target) {
            var valid, targetDirective = target.directive(EVENTS),
                listeningObject = retreiveListeningObject(eventer, target),
                eventsDirective = target.directive(EVENTS),
                handlers = eventsDirective[HANDLERS] = eventsDirective[HANDLERS] || {};
            listeningObject.count++;
            obj.listening = listeningObject;
        },
        onceModification = function (directive, obj) {
            var fn = obj.fn || obj.handler;
            obj.fn = once(function (e) {
                // much faster than using off
                directive.detach(obj);
                // ok with using apply here since it is a one time deal per event
                return fn.apply(this, arguments);
            });
        },
        attachEventObject = function (eventer, name, eventObject, modifier) {
            eventer.directive(EVENTS).attach(name, eventObject, modifier);
        },
        onceHandler = function (eventer, name, obj) {
            attachEventObject(eventer, name, obj, onceModification);
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
                count: 0
            };
            return listening;
        },
        listenToHandler = function (eventer, name, obj, target) {
            listenToModifier(eventer, name, obj, target);
            attachEventObject(target, name, obj);
        },
        listenToOnceHandler = function (eventer, name, obj, extra) {
            listenToModifier(eventer, name, obj, target);
            attachEventObject(target, name, obj, onceModification);
        },
        uniqueKey = 'c',
        Events = factories.Directive.extend('Events', {
            /**
             * @description attach event handlers to the Model event loop
             * @func
             * @name Model#on
             * @param {String} str - event name to listen to
             * @param {Function|String} fn - event handler or string corresponding to handler on prototype to use for handler
             * @param {Object} context - context that the handler will run in
             * @returns {Model} instance
             */
            // uniqueKey: 'c',
            initialize: noop,
            bubble: directives.parody(EVENTS, 'bubble'),
            on: flattenMatrix(attachEventObject, 0),
            once: flattenMatrix(onceHandler, 0),
            listenTo: flattenMatrix(listenToHandler, 1),
            listenToOnce: flattenMatrix(listenToOnceHandler, 1),
            watch: setupWatcher(0),
            watchOnce: setupWatcher(0, 1),
            watchOther: setupWatcher(1),
            watchOtherOnce: setupWatcher(1, 1),
            request: directives.parody('messenger', 'request'),
            reply: directives.parody('messenger', 'reply'),
            when: directives.parody('Linguistics', 'when'),
            constructor: function (opts) {
                var model = this;
                extend(model, opts);
                model[uniqueKey + ID] = model[uniqueKey + ID] || uniqueId(uniqueKey);
                // reacting to self
                model.on(model.events);
                model.initialize(opts);
                return model;
            },
            // destroy: function () {
            //     this[STOP_LISTENING]();
            //     return this;
            // },
            /**
             * @description attaches an event handler to the events object, and takes it off as soon as it runs once
             * @func
             * @name Model#once
             * @param {String} string - event name that will be triggered
             * @param {Function} fn - event handler that will run only once
             * @param {Object} context - context that will be applied to the handler
             * @returns {Model} instance
             */
            /**
             * @description remove event objects from the _events object
             * @param {String|Function} type - event type or handler. If a match is found, then the event object is removed
             * @param {Function} handler - event handler to be matched and removed
             * @func
             * @name Model#off
             * @returns {Model} instance
             */
            off: function (name_, fn_, context_) {
                var context, currentObj, eventer = this,
                    name = name_,
                    events = eventer[EVENTS];
                if (!events) {
                    return;
                }
                context = isObject(name) ? fn_ : context_;
                if (arguments[LENGTH]) {
                    if (!name) {
                        each(events[HANDLERS], function (list, name) {
                            events.seekAndDestroy(list, fn_, context_);
                        });
                    } else {
                        intendedObject(name, fn_, function (name, fn_) {
                            iterateOverObject(eventer, context, name, fn_, function (eventer, name, obj) {
                                events.seekAndDestroy(!name || events[HANDLERS][name], obj.handler, obj.context);
                            });
                        });
                    }
                } else {
                    currentObj = events[STACK].last();
                    if (currentObj) {
                        events.detach(currentObj);
                    }
                }
                return eventer;
            },
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
             * @name Model#fire
             * @param {String} name of the event loop to be triggered
             * @returns {Model} object instance the method is being called on
             */
            dispatchEvents: function (names) {
                var eventer = this;
                return duff(gapSplit(names), eventer.dispatchStack, eventer) && eventer;
            },
            dispatchStack: function (name) {
                return this[DISPATCH_EVENT](name);
            },
            dispatchEvent: function (name, data, options) {
                var bus, evnt, returnValue, eventer = this,
                    eventsDirective = eventer[EVENTS];
                if (!eventsDirective || eventsDirective.running[name]) {
                    return;
                }
                evnt = eventsDirective.create(eventer, data, name, options);
                returnValue = eventsDirective.dispatch(name, evnt);
                bus = eventsDirective.proxyStack;
                if (!bus[LENGTH]()) {
                    return returnValue;
                }
                bus.each(function (row) {
                    if (row.disabled) {
                        return;
                    }
                    row.fn(name, evnt);
                }, NULL);
                if (!bus.is('dirty')) {
                    return returnValue;
                }
                bus.obliteration(function (handler, index) {
                    if (!handler.disabled) {
                        return;
                    }
                    bus.remove(handler.id, index - 1);
                }, NULL);
                return returnValue;
            }
        }, BOOLEAN_TRUE);
});