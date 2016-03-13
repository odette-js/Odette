var DISPATCH_EVENT = 'dispatchEvent',
    EVENTS = 'eventManager',
    STOP_LISTENING = 'stopListening',
    TALKER_ID = 'talkerId',
    LISTENING_TO = 'listeningTo',
    REGISTERED = 'registered',
    LISTENING_PREFIX = 'l',
    STATE = 'state',
    STATUS = 'status',
    STATUSES = STATUS + 'es',
    HANDLERS = 'handlers';
app.scope(function (app) {
    var remove = _.remove,
        iterateOverObject = function (eventer, context, events, handler, iterator, firstArg) {
            // only accepts a string or a function
            var fn = isString(handler) ? eventer[handler] : handler,
                valid = !isFunction(fn) && exception({
                    message: 'handler must be a function or a string with a method on the prototype of the listener'
                });
            return duff(gapSplit(events), function (eventName) {
                iterator(eventer, eventName, {
                    disabled: BOOLEAN_FALSE,
                    namespace: eventName.split(COLON)[0],
                    name: eventName,
                    handler: fn,
                    context: context,
                    origin: eventer
                }, firstArg);
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
        turnOff = function (e) {
            return e && e[ORIGIN] && e[ORIGIN].off && e[ORIGIN].off();
        },
        setupWatcher = function (iterator, nameOrObjectIndex, triggersOnce) {
            var after = triggersOnce ? turnOff : noop;
            return function () {
                var context, list, args, firstArg, handlersIndex, nameOrObject, original_handler, eventer = this,
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
                intendedObject(nameOrObject, list[1], function (key_, value_, isObject_) {
                    // only allow one to be watched
                    var key = key_.split(SPACE)[0],
                        fun_things = original_handler || bind(list[isObject_ ? 1 : 2], context || eventer),
                        value = isFunction(value_) ? value_ : curriedEquality(key, value_),
                        handler = function (e) {
                            if (e && value(e)) {
                                fun_things(e);
                                after(e);
                            }
                        };
                    original_handler = fun_things;
                    iterateOverObject(eventer, context, CHANGE + COLON + key, handler, iterator, args[0]);
                    ret[key] = handler;
                });
                return ret;
            };
        },
        seekAndDestroy = function (eventer, list, handler, context) {
            var events = eventer[EVENTS];
            return events && list.duffRight(function (obj) {
                if (obj.disabled || (handler && obj.handler !== handler) || (context && obj.context !== context)) {
                    return;
                }
                events.detach(obj);
            });
        },
        attachEventObject = function (eventer, name, eventObject) {
            eventer.directive(EVENTS).attach(name, eventObject);
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
        onceHandler = function (eventer, name, obj) {
            var fn = obj.fn || obj.handler;
            obj.fn = once(function (e) {
                eventer.off();
                return fn.apply(this, arguments);
            });
            attachEventObject(eventer, name, obj);
        },
        listenToHandler = function (eventer, name, obj, target) {
            var valid, targetDirective = target.directive(EVENTS),
                listeningObject = retreiveListeningObject(eventer, target),
                eventsDirective = target.directive(EVENTS),
                handlers = eventsDirective[HANDLERS] = eventsDirective[HANDLERS] || {};
            listeningObject.count++;
            obj.listening = listeningObject;
            attachEventObject(target, name, obj);
        },
        listenToOnceHandler = function (eventer, name, obj, extra) {
            bindOnce(eventer, name, obj);
            listenToHandler(eventer, name, obj, extra);
        },
        secretOffIterator = function (eventer, name, obj) {
            seekAndDestroy(eventer, !name || eventer.directive(EVENTS)[HANDLERS][name], obj.handler, obj.context);
        },
        directives = _.directives,
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
            uniqueKey: 'c',
            initialize: noop,
            on: flattenMatrix(attachEventObject, 0),
            once: flattenMatrix(onceHandler, 0),
            listenTo: flattenMatrix(listenToHandler, 1),
            listenToOnce: flattenMatrix(listenToOnceHandler, 1),
            watch: setupWatcher(attachEventObject, 0),
            watchOnce: setupWatcher(attachEventObject, 0, 1),
            watchOther: setupWatcher(listenToHandler, 1),
            watchOtherOnce: setupWatcher(listenToHandler, 1, 1),
            request: directives.parody('messenger', 'request'),
            reply: directives.parody('messenger', 'reply'),
            when: directives.parody('Linguistics', 'when'),
            mark: directives.parody(STATUS, 'mark'),
            unmark: directives.parody(STATUS, 'unmark'),
            remark: directives.parody(STATUS, 'remark'),
            is: directives.checkParody(STATUS, 'is', BOOLEAN_FALSE),
            constructor: function (opts) {
                var model = this;
                extend(model, opts);
                model[model.uniqueKey + ID] = model[model.uniqueKey + ID] || uniqueId(model.uniqueKey);
                // reacting to self
                model.on(model.events);
                model.initialize(opts);
                return model;
            },
            destroy: function () {
                this[STOP_LISTENING]();
                // this.directive(EVENTS).reset();
                return this;
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
                            seekAndDestroy(eventer, list, fn_, context_);
                        });
                    } else {
                        intendedObject(name, fn_, function (name, fn_) {
                            iterateOverObject(eventer, context, name, fn_, secretOffIterator);
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
                var hasResult, evnt, eventer = this,
                    eventsDirective = eventer[EVENTS];
                if (eventsDirective && !eventsDirective.running[name]) {
                    evnt = eventsDirective.create(eventer, data, name, options);
                    eventsDirective.dispatch(name, evnt);
                    // eventsDirective.dispatch('proxy', evnt);
                    return evnt.returnValue;
                }
            }
        }, BOOLEAN_TRUE),
        StatusMarker = factories.Extendable.extend('StatusMarker', {
            constructor: function () {
                this[STATUSES] = {};
                return this;
            },
            has: function (status) {
                return this[STATUSES][status] !== UNDEFINED;
            },
            mark: function (status) {
                this[STATUSES][status] = BOOLEAN_TRUE;
            },
            unmark: function (status) {
                this[STATUSES][status] = BOOLEAN_FALSE;
            },
            remark: function (status, direction) {
                this[STATUSES][status] = direction === UNDEFINED ? !this[STATUSES][status] : !!direction;
            },
            is: function (status) {
                return this[STATUSES][status];
            },
            isNot: function (status) {
                return !this.is(status);
            }
        });
    app.defineDirective(STATUS, StatusMarker[CONSTRUCTOR]);
});