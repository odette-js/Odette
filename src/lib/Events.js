var DISPATCH_EVENT = 'dispatchEvent';
var _EVENTS = '_events';
var EVENTS = 'events';
var HANDLERS = 'handlers';
application.scope(function (app) {
    var remove = _.remove,
        Collection = factories.Collection,
        SortedCollection = factories.SortedCollection,
        REMOVE_QUEUE = 'removeQueue',
        _LISTENING_TO = '_listeningTo',
        LISTEN_ID = 'listenId',
        LISTENING_PREFIX = 'l',
        IS_STOPPED = 'isStopped',
        STOP_LISTENING = 'stopListening',
        IMMEDIATE_PROP_IS_STOPPED = 'immediatePropagationIsStopped',
        iterateOverObject = function (box, ctx, evnts, funs_, iterator, firstarg) {
            // intendedObject(key, value, function (evnts, funs_) {
            // only accepts a string or a function
            var fn = isString(funs_) ? box[funs_] : funs_,
                splitevents = gapSplit(evnts);
            if (!isFunction(fn)) {
                exception('handler must be a function');
            }
            return duff(splitevents, function (eventName) {
                var namespace = eventName.split(COLON)[0];
                iterator(box, eventName, {
                    disabled: BOOLEAN_FALSE,
                    namespace: namespace,
                    name: eventName,
                    handler: fn,
                    ctx: ctx,
                    origin: box
                }, firstarg);
            });
        },
        // user friendly version
        flattenMatrix = function (iterator, nameOrObjectIndex) {
            return function () {
                var args, handlersIndex, firstArg, list, nameOrObject, names, box = this;
                var eventsDirective = box.directive(EVENTS);
                if (!arguments[0]) {
                    return box;
                }
                args = toArray(arguments);
                handlersIndex = nameOrObjectIndex;
                list = args.splice(nameOrObjectIndex);
                nameOrObject = list[0];
                firstArg = args[0];
                if (nameOrObjectIndex && !firstArg) {
                    return box;
                }
                intendedObject(nameOrObject, list[1], function (events, handlers) {
                    iterateOverObject(box, args[0], events, handlers, iterator, firstArg);
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
                firstArg = args[0];
                if (nameOrObjectIndex && !firstArg) {
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
                    iterateOverObject(box, context, CHANGE + COLON + key, handler, iterator, firstArg);
                    ret[key] = handler;
                });
                return ret;
            };
        },
        seekAndDestroy = function (box, list, handler, ctx) {
            list.duffRight(function (obj) {
                if ((handler && obj.handler !== handler) || (ctx && obj.ctx !== ctx)) {
                    return;
                }
                box._removeEvent(obj);
            });
        },
        event_incrementer = 1,
        __FN_ID__ = '__fnid__',
        returnsId = function () {
            return this.id;
        },
        attachEventObject = function (box, name, eventObject) {
            box._attachEvent(name, eventObject);
        },
        retreiveListeningObject = function (thing, obj) {
            var id = obj[LISTEN_ID] = obj[LISTEN_ID] || uniqueId(LISTENING_PREFIX),
                listeningTo = thing[_LISTENING_TO] || (thing[_LISTENING_TO] = {}),
                listening = listeningTo[id];
            // This object is not listening to any other events on `obj` yet.
            // Setup the necessary references to track the listening callbacks.
            if (listening) {
                return listening;
            }
            thing[LISTEN_ID] = thing[LISTEN_ID] || uniqueId(LISTENING_PREFIX);
            listening = listeningTo[id] = {
                obj: obj,
                objId: id,
                id: thing[LISTEN_ID],
                listeningTo: listeningTo,
                ctx: thing,
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
                var evnt = this;
                evnt.isTrusted = BOOLEAN_FALSE;
                if (evnt.defaultIsPrevented()) {
                    return;
                }
                if (evnt.directiveCheck('actions')) {
                    evnt.directive('actions').call(evnt);
                }
            }
        }, BOOLEAN_TRUE),
        onceHandler = function (box, name, obj) {
            bindOnce(box, name, obj);
            box._attachEvent(name, obj);
        },
        bindOnce = function (box, name, obj) {
            var fn = obj.handler;
            obj.fn = once(function (e) {
                turnOff(e);
                fn.apply(this, arguments);
            });
        },
        listenToHandler = function (box, name, obj, target) {
            var listeningObject = retreiveListeningObject(box, target),
                eventsDirective = target.directive(EVENTS),
                handlers = eventsDirective[HANDLERS] = eventsDirective[HANDLERS] || {};
            preBindListeners(obj, listeningObject);
            target._attachEvent(name, obj);
        },
        preBindListeners = function (obj, listening) {
            listening.count++;
            obj.listening = listening;
        },
        listenToOnceHandler = function (box, name, obj, extra) {
            bindOnce(box, name, obj);
            listenToHandler(box, name, obj, extra);
        },
        overrideEventCreation = function (obj) {
            return obj && (obj.bubbles || obj.dispatchChildren || opts.dispatchTree);
        },
        secretOffIterator = function (box, name, obj) {
            seekAndDestroy(box, !name || box.directive(EVENTS)[HANDLERS][name], obj.handler, obj.ctx);
        },
        Events = factories.Directive.extend('Events', {
            /**
             * @description attach event handlers to the Box event loop
             * @func
             * @name Box#on
             * @param {String} str - event name to listen to
             * @param {Function|String} fn - event handler or string corresponding to handler on prototype to use for handler
             * @param {Object} ctx - context that the handler will run in
             * @returns {Box} instance
             */
            initialize: noop,
            constructor: function (opts) {
                var model = this;
                extend(model, opts);
                model.directive(EVENTS);
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
            // _makeEvents: function () {
            //     var list = this[_EVENTS] = this[_EVENTS] = {
            //         _byName: {},
            //         current: SortedCollection(),
            //         _removeEvents: SortedCollection()
            //     };
            //     return list;
            // },
            // _getEvents: function (key) {
            //     var list = this[_EVENTS];
            //     if (!list) {
            //         list = this._makeEvents();
            //     }
            //     if (key) {
            //         list = list[HANDLERS][key] = list[HANDLERS][key] || SortedCollection(BOOLEAN_TRUE, BOOLEAN_TRUE);
            //     }
            //     return list;
            // },
            /**
             * @description attaches an event handler to the events object, and takes it off as soon as it runs once
             * @func
             * @name Box#once
             * @param {String} string - event name that will be triggered
             * @param {Function} fn - event handler that will run only once
             * @param {Object} ctx - context that will be applied to the handler
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
            swapEvents: function (validEventHash) {
                var eventDirective = box.directive(EVENTS),
                    // old =
                    valid = box[_EVENTS] = validEventHash;
                return old;
            },
            _resetEvents: function (newHash) {
                var box = this,
                    oldHash = (newHash ? box.swapEvents(newHash) : box.directive(EVENTS))[HANDLERS];
                each(oldHash, box.emptyList, box);
                return box;
            },
            resetEvents: function () {
                return this._resetEvents();
            },
            emptyList: function (list) {
                var box = this;
                list.duffRight(box._removeEvent, box);
                return box;
            },
            off: function (name_, fn_, ctx_) {
                var fn_id, currentEventList, currentObj, box = this,
                    name = name_,
                    ctx = isObject(name) ? fn_ : ctx_,
                    events = box.directive(EVENTS);
                if (arguments[LENGTH]) {
                    if (!name) {
                        each(events[HANDLERS], function (list, name) {
                            seekAndDestroy(box, list, fn_, ctx_);
                        });
                    } else {
                        intendedObject(name, fn_, function (name, fn_) {
                            iterateOverObject(box, ctx, name, fn_, secretOffIterator);
                        });
                    }
                } else {
                    currentEventList = events[STACK];
                    currentObj = currentEventList.last();
                    if (currentObj) {
                        box._removeEvent(currentObj);
                    }
                }
                return box;
            },
            // hash this out later
            stopTalking: function () {},
            stopListening: function (obj, name, callback) {
                var ids, listening, stillListening = 0,
                    origin = this,
                    listeningTo = origin[_LISTENING_TO];
                if (listeningTo && (!obj || obj[LISTEN_ID])) {
                    duff(obj ? [obj[LISTEN_ID]] : keys(listeningTo), function (id) {
                        var listening = listeningTo[id];
                        if (listening) {
                            listening.obj.off(name, callback);
                        }
                        stillListening += listeningTo[id] ? 1 : 0;
                    });
                    if (!stillListening && !find(ids, function (id, key) {
                        return listeningTo[id];
                    })) {
                        origin[_LISTENING_TO] = UNDEFINED;
                    }
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
            dispatchEvents: function (names, data, eventOptions) {
                var box = this;
                duff(gapSplit(names), function (str) {
                    box[DISPATCH_EVENT](str, data, eventOptions);
                });
                return box;
            },
            // overwriteable helper functions
            queueHandler: function (evnt, handler, current) {
                (current || this.directive(EVENTS)[STACK]).add(handler);
                return BOOLEAN_TRUE;
            },
            unQueueHandler: function (evnt, handler, current_) {
                var gah = (current_ || this.directive(EVENTS)[STACK]).pop();
            },
            // setEvent: function (evnt) {
            //     this.directive(EVENTS)[CURRENT] = evnt;
            // },
            // unsetEvent: function () {
            //     this.directive(EVENTS)[CURRENT] = NULL;
            // },
            // getEventList: function (evnt) {
            //     var eventsDirective = this.directive(EVENTS);
            //     var handlers = eventsDirective[HANDLERS];
            //     return handlers && handlers[evnt.getNamespace()];
            // },
            _eventDispatcher: function (evnt) {
                var box = this,
                    events = box.directive(EVENTS),
                    eventStack = events[STACK],
                    handlers = events[HANDLERS],
                    list = handlers[evnt.getNamespace()],
                    ret = result(box, evnt.onMethodName, evnt),
                    removeList = events[REMOVE_QUEUE];
                if (evnt[IMMEDIATE_PROP_IS_STOPPED] || !list || !result(list, LENGTH)) {
                    return;
                }
                list.find(function (handler) {
                    var cached;
                    // box.setEvent(evnt);
                    if (!handler.disabled && box.queueHandler(evnt, handler, eventStack)) {
                        handler.fn(evnt);
                        cached = evnt[IMMEDIATE_PROP_IS_STOPPED];
                        box.unQueueHandler(evnt, handler, eventStack);
                        return cached;
                    }
                });
                // box.unsetEvent(evnt);
                if (!eventStack[LENGTH]() && removeList[LENGTH]()) {
                    removeList.duffRight(box._removeEvent, box);
                    removeList.empty();
                }
            },
            _createEvent: function (name, data) {
                return ObjectEvent(name, this, data);
            },
            dispatchEvent: function (name, data, evnt_) {
                var box = this,
                    evnt = box._createEvent(name, data, evnt_);
                box._eventDispatcher(evnt);
                evnt.finished();
                return evnt.returnValue;
            },
            _attachEvent: function (name, eventObject) {
                var list, box = this,
                    eventsDirective = box.directive(EVENTS),
                    handlers = eventsDirective[HANDLERS],
                    ret = !handlers && exception({
                        message: 'events directive needs a handler object'
                    });
                eventObject.id = ++event_incrementer;
                eventObject.valueOf = returnsId;
                eventObject.ctx = eventObject.ctx || eventObject.origin;
                eventObject.fn = bind(eventObject.fn || eventObject.handler, eventObject.ctx);
                // attach the id to the bound function because that instance is private
                eventObject.fn[__FN_ID__] = eventObject.id;
                list = handlers[name] = handlers[name] || SortedCollection(BOOLEAN_TRUE, BOOLEAN_TRUE);
                // attaching name so list can remove itself from hash
                list[NAME] = name;
                // attached so event can remove itself
                eventObject.list = list;
                eventObject.maxIndex = list[LENGTH]();
                box.attachEvent(list, eventObject);
            },
            attachEvent: function (list, obj) {
                return list.add(obj);
            },
            _resetList: function (list) {
                var box = this;
                if (list[LENGTH]()) {
                    return BOOLEAN_FALSE;
                }
                box.resetList(list);
                return BOOLEAN_TRUE;
            },
            resetList: function (list) {
                this.directive(EVENTS)[HANDLERS][list[NAME]] = NULL;
            },
            removeEvent: function (list, evnt) {
                list.remove(evnt);
            },
            _removeEvent: function (evnt) {
                var listeningTo, box = this,
                    listening = evnt.listening,
                    list = evnt.list,
                    events = box.directive(EVENTS),
                    disabled = evnt.disabled = BOOLEAN_TRUE;
                if (events[STACK][LENGTH]()) {
                    events[REMOVE_QUEUE].add(evnt);
                    return BOOLEAN_FALSE;
                } else {
                    box.removeEvent(list, evnt);
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
                    listeningTo[listening.obj[LISTEN_ID]] = UNDEFINED;
                    box._resetList(list);
                    return BOOLEAN_TRUE;
                }
            }
        }, BOOLEAN_TRUE),
        listeningCounter = 0;
    app.registerDirective(EVENTS, function () {
        return {
            listenId: 'l' + (++listeningCounter),
            handlers: {},
            stack: SortedCollection(),
            removeQueue: SortedCollection()
        };
    });
});