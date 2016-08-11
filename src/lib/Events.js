var EVENTS_STRING = 'Events',
    DISPATCH_EVENT = 'dispatchEvent',
    EVENTS = 'EventManager',
    STOP_LISTENING = 'stopListening',
    TALKER_ID = 'talkerId',
    LISTENING_TO = 'listeningTo',
    REGISTERED = 'registered',
    LISTENING_PREFIX = 'l',
    STATE = 'state',
    HANDLERS = 'handlers';
app.scope(function (app) {
    var methodExchange = function (eventer, handler) {
            var fn = isString(handler) ? eventer[handler] : handler,
                valid = !isFunction(fn) && exception('handler must be a function or a string with a method on the originating object');
            return fn;
        },
        iterateOverList = function (eventer, directive, names, handler, args, iterator) {
            // only accepts a string or a function
            return duff(toArray(names, SPACE), function (eventName) {
                iterator(eventer, directive, directive.make(eventName, handler, eventer), args);
            });
        },
        flattenMatrix = function (iterator, _nameOrObjectIndex, expects, fills) {
            return function (first, second) {
                var args, eventsDirective, firstTimeRound = BOOLEAN_TRUE,
                    eventer = this;
                if (!first) {
                    return eventer;
                }
                if (_nameOrObjectIndex && !second) {
                    return eventer;
                }
                args = toArray(arguments);
                intendedObject(args[_nameOrObjectIndex], args[_nameOrObjectIndex + 1], function (key, value, isObj) {
                    eventsDirective = eventsDirective || eventer.directive(EVENTS);
                    if (firstTimeRound && isObj) {
                        // make room for one more
                        args.splice(_nameOrObjectIndex, _nameOrObjectIndex + 1, NULL);
                    }
                    args[_nameOrObjectIndex] = key;
                    args[_nameOrObjectIndex + 1] = value;
                    firstTimeRound = BOOLEAN_FALSE;
                    if (args[LENGTH] < expects) {
                        fills(eventer, args);
                    }
                    iterateOverList(eventer, eventsDirective, key, value, args, iterator);
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
                var context, list, args, firstArg, handlersIndex, nameOrObject, eventerDirective, original_handler, targetDirective, eventer = this,
                    ret = {};
                if (!arguments[0]) {
                    return ret;
                }
                args = toArray(arguments);
                handlersIndex = nameOrObjectIndex;
                list = args.slice(nameOrObjectIndex);
                nameOrObject = list[0];
                context = list[(isObject(nameOrObject) ? 2 : 3)] || eventer;
                if (nameOrObjectIndex && !args[0]) {
                    return ret;
                }
                eventerDirective = eventer.directive(EVENTS);
                if (nameOrObjectIndex) {
                    targetDirective = args[0].directive(EVENTS);
                } else {
                    targetDirective = eventerDirective;
                }
                intendedObject(nameOrObject, list[1], function (key_, value_, isObject_) {
                    // only allow one to be watched
                    var key = key_.split(SPACE)[0],
                        fun_things = original_handler || bind(list[isObject_ ? 1 : 2], context || eventer),
                        value = isFunction(value_) ? value_ : curriedEquality(key, value_),
                        name = CHANGE + COLON + key,
                        origin = eventer,
                        made = targetDirective.make(name, fun_things, eventer);
                    if (nameOrObjectIndex + 2 < args[LENGTH]) {
                        args.push(context);
                    }
                    if (nameOrObjectIndex) {
                        listenToModifier(eventer, eventerDirective, made, args[0]);
                    }
                    made.comparator = value;
                    made.triggersOnce = !!triggersOnce;
                    made.runner = fun_things;
                    attachEventObject(origin, targetDirective, made, [list[0], list[2], list[3]], makeHandler);
                    ret[key] = fun_things;
                });
                return ret;
            };
        },
        listenToModifier = function (eventer, targetDirective, obj, target) {
            var valid, listeningObject = retreiveListeningObject(eventer, target),
                eventsDirective = target.directive(EVENTS),
                handlers = eventsDirective[HANDLERS] = eventsDirective[HANDLERS] || {};
            listeningObject.count++;
            obj.listening = listeningObject;
            return eventsDirective;
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
        attachEventObject = function (eventer, directive, evnt, args, modifier) {
            evnt.context = evnt.context || args[2];
            evnt.handler = methodExchange(eventer, evnt.handler);
            directive.attach(evnt.name, evnt, modifier);
        },
        onceHandler = function (eventer, directive, obj, args) {
            attachEventObject(eventer, directive, obj, args, onceModification);
        },
        onFillerMaker = function (count) {
            return function (eventer, args) {
                if (args[LENGTH] === count) {
                    args.push(eventer);
                }
            };
        },
        onFiller = onFillerMaker(2),
        listenToFiller = onFillerMaker(3),
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
            listenerDirective[TALKER_ID] = listenerDirective[TALKER_ID] || app.counter(LISTENING_PREFIX);
            listening = listeningTo[talkerId] = {
                talker: talker,
                talkerId: talkerId,
                id: listenerDirective[TALKER_ID],
                listeningTo: listeningTo,
                count: 0
            };
            return listening;
        },
        listenToHandler = function (eventer, directive, evnt, list, modifier) {
            var target = list[0];
            var targetDirective = listenToModifier(eventer, target.directive(EVENTS), evnt, target);
            evnt.handler = methodExchange(eventer, evnt.handler);
            attachEventObject(target, targetDirective, evnt, list.slice(1), modifier);
        },
        listenToOnceHandler = function (eventer, directive, obj, list) {
            listenToHandler(eventer, directive, obj, list, onceModification);
        },
        uniqueKey = 'c',
        Events = factories[EVENTS_STRING] = factories.Directive.extend(EVENTS_STRING, {
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
            bubble: parody(EVENTS, 'bubble'),
            // onUntil: flattenMatrix(untilHandler),
            on: flattenMatrix(attachEventObject, 0, 3, onFiller),
            once: flattenMatrix(onceHandler, 0, 3, onFiller),
            listenTo: flattenMatrix(listenToHandler, 1, 4, listenToFiller),
            listenToOnce: flattenMatrix(listenToOnceHandler, 1, 4, listenToFiller),
            watch: setupWatcher(0),
            watchOnce: setupWatcher(0, 1),
            watchOther: setupWatcher(1),
            watchOtherOnce: setupWatcher(1, 1),
            request: parody('Messenger', 'request'),
            reply: parody('Messenger', 'reply'),
            when: parody('Linguistics', 'when'),
            constructor: function (opts) {
                var eventer = this;
                extend(eventer, opts);
                eventer[uniqueKey + ID] = eventer[uniqueKey + ID] || app.counter(uniqueKey);
                // reacting to self
                eventer.on(result(eventer, 'events'));
                eventer.initialize(opts);
                return eventer;
            },
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
                            events.seekAndDestroy(list, fn_, context);
                        });
                    } else {
                        intendedObject(name, fn_, function (name, fn_) {
                            iterateOverList(eventer, events, name, fn_, [], function (eventer, directive, obj) {
                                var handlers = events[HANDLERS][obj.name];
                                return handlers && events.seekAndDestroy(handlers, obj.handler, context);
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
                return duff(toArray(names, SPACE), eventer.dispatchStack, eventer) && eventer;
            },
            dispatchStack: function (name) {
                return this[DISPATCH_EVENT](name);
            },
            dispatchEvent: function (name, data, options) {
                var bus, evnt, eventValidation, returnValue, eventer = this,
                    eventsDirective = eventer[EVENTS];
                if (!eventsDirective || !eventsDirective.has(name) || eventsDirective.running[name] || eventsDirective.queued[name] || !(eventValidation = eventsDirective.validate(name, data, options))) {
                    return;
                }
                if (isArray(eventValidation)) {
                    name = eventValidation[0];
                    data = eventValidation[1];
                    options = eventValidation[2];
                }
                evnt = eventsDirective.create(eventer, data, name, options);
                returnValue = eventsDirective.dispatch(name, evnt);
                return returnValue;
            }
        });
});