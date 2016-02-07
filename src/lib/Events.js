var DISPATCH_EVENT = 'dispatchEvent';
var _EVENTS = '_events';
application.scope(function (app) {
    var remove = _.remove,
        SortedCollection = factories.SortedCollection,
        REMOVE_EVENTS = '_removeEvents',
        CURRENT_EVENTS = '_currentEvents',
        _LISTENING_TO = '_listeningTo',
        IMMEDIATE_PROP_IS_STOPPED = 'immediatePropagationIsStopped',
        SERIALIZED_DATA = 'serializedData',
        iterateOverObject = function (box, ctx, evnts, funs_, iterator, firstarg) {
            // intendedObject(key, value, function (evnts, funs_) {
            // only accepts a string or a function
            var fn = isString(funs_) ? box[funs_] : funs_,
                splitevents = gapSplit(evnts);
            if (!isFunction(fn)) {
                exception('handler must be a function');
            }
            return duff(splitevents, function (eventName) {
                var namespace = eventName.split(':')[0];
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
                return isEqual(original, e.target.get(key));
            };
        },
        turnOff = function (e) {
            return e && e.target && e.target.off && e.target.off();
        },
        setupWatcher = function (iterator, nameOrObjectIndex, triggersOnce) {
            var after = triggersOnce ? turnOff : _.noop;
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
        tryToRemoveObject = function (cantRemove, obj, removeList, box) {
            // because event triggers are always syncronous,
            // we can just wait until the dispatchEvent function is done
            if (cantRemove) {
                removeList.add(obj);
            } else {
                box._removeEvent(obj);
            }
        },
        removeEventObjectById = function (box, list, id) {
            var events = box._getEvents(),
                current = events[CURRENT_EVENTS],
                obj = list.get(id),
                ret = obj && box._removeEvent(obj);
            attemptListWipe(box, list);
            return ret;
        },
        attemptListWipe = function (box, list) {
            if (!list[LENGTH]()) {
                box[list.name] = UNDEFINED;
            }
        },
        removeEventObject = function (box, list, handler, ctx) {
            var obj, events = box._getEvents(),
                current = events[CURRENT_EVENTS],
                removeList = events[REMOVE_EVENTS],
                currentLength = current[LENGTH]();
            list.duffRev(function (obj, idx) {
                if ((handler && obj.handler !== handler) || (ctx && obj.ctx !== ctx)) {
                    return;
                }
                tryToRemoveObject(currentLength, obj, removeList, box);
            });
            attemptListWipe(box, list);
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
            var id = obj._listenId = obj._listenId || uniqueId('l'),
                listeningTo = thing[_LISTENING_TO] || (thing[_LISTENING_TO] = {}),
                listening = listeningTo[id];
            // This object is not listening to any other events on `obj` yet.
            // Setup the necessary references to track the listening callbacks.
            if (listening) {
                return listening;
            }
            thing._listenId = thing._listenId || uniqueId('l');
            listening = listeningTo[id] = {
                obj: obj,
                objId: id,
                id: thing._listenId,
                listeningTo: listeningTo,
                ctx: thing,
                count: 0
            };
            return listening;
        },
        ObjectEvent = factories.Model.extend('ObjectEvent', {
            constructor: function (name, target, data) {
                var evnt = this;
                if (isInstance(data, Event)) {
                    return data;
                }
                evnt.bubbles = BOOLEAN_FALSE;
                evnt.dispatchChildren = BOOLEAN_FALSE;
                evnt.dispatchTree = BOOLEAN_FALSE;
                evnt.onMethodName = camelCase('on:' + name, ':');
                evnt.propagationIsStopped = evnt[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_FALSE;
                evnt.target = target;
                evnt.name = name;
                evnt.type = name.split(':')[0];
                evnt.timestamp = _.now();
                evnt.data(data);
                evnt.originalStack = BOOLEAN_TRUE;
                return evnt;
            },
            isStopped: function () {
                return this.propagationIsStopped || this.immediatePropagationIsStopped;
            },
            data: function (arg) {
                var ret = this[SERIALIZED_DATA];
                if (arguments[LENGTH]) {
                    ret = this[SERIALIZED_DATA] = _.parse(_.stringify(isBlank(arg) ? {} : arg));
                }
                this[SERIALIZED_DATA] = ret;
                ret = this[SERIALIZED_DATA];
                return ret;
            },
            get: function (key) {
                return this[SERIALIZED_DATA][key];
            },
            set: function (key, value) {
                var evnt = this;
                intendedObject(key, value, function (key, value) {
                    evnt[SERIALIZED_DATA][key] = value;
                });
                return this;
            },
            stopImmediatePropagation: function () {
                this.stopPropagation();
                this[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_TRUE;
            },
            stopPropagation: function () {
                this.propagationIsStopped = BOOLEAN_TRUE;
            },
            toJSON: function () {
                return this.data(this.data());
            },
            toString: function () {
                return stringify(this.toJSON());
            },
            preventDefault: function () {
                this.defaultPrevented = BOOLEAN_TRUE;
            },
            action: function (fn) {
                var evnt = this;
                evnt._actions = evnt._actions || [];
                evnt._actions.push(fn);
                return evnt;
            },
            finished: function () {
                var evnt = this;
                duff(evnt._actions, function (fn) {
                    fn(evnt);
                });
                evnt.originalStack = BOOLEAN_FALSE;
            }
        }),
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
            var listeningObject = retreiveListeningObject(box, target);
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
            removeEventObject(box, !name || box._getEvents(name), obj.handler, obj.ctx);
        },
        Events = factories.Model.extend('Events', {
            /**
             * @description attach event handlers to the Box event loop
             * @func
             * @name Box#on
             * @param {String} str - event name to listen to
             * @param {Function|String} fn - event handler or string corresponding to handler on prototype to use for handler
             * @param {Object} ctx - context that the handler will run in
             * @returns {Box} instance
             */
            initialize: _.noop,
            constructor: function (opts) {
                var model = this;
                model._getEvents();
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
            _makeEvents: function () {
                var list = this[_EVENTS] = this[_EVENTS] = {
                    _byName: {},
                    _currentEvents: SortedCollection(),
                    _removeEvents: SortedCollection()
                };
                return list;
            },
            _getEvents: function (key) {
                var list = this[_EVENTS];
                if (!list) {
                    list = this._makeEvents();
                }
                if (key) {
                    list = list._byName[key] = list._byName[key] || SortedCollection(BOOLEAN_TRUE, BOOLEAN_TRUE);
                }
                return list;
            },
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
            wipeEvents: function () {
                var box = this,
                    events = box._getEvents(),
                    currentEventList = events[CURRENT_EVENTS],
                    removeEventList = events[REMOVE_EVENTS],
                    currentLength = currentEventList[LENGTH]();
                each(events._byName, function (list, key, obj) {
                    list.duffRev(function (obj) {
                        tryToRemoveObject(currentLength, obj, removeEventList, box);
                    });
                    attemptListWipe(box, list);
                });
                return box;
            },
            off: function (name_, fn_, ctx_) {
                var fn_id, currentEventList, currentObj, box = this,
                    name = name_,
                    ctx = isObject(name) ? fn_ : ctx_,
                    events = box._getEvents();
                if (arguments[LENGTH]) {
                    if (!name) {
                        each(events._byName, function (list, name) {
                            removeEventObject(box, list, fn_, ctx_);
                        });
                    } else {
                        intendedObject(name, fn_, function (name, fn_) {
                            iterateOverObject(box, ctx, name, fn_, secretOffIterator);
                        });
                    }
                } else {
                    currentEventList = events[CURRENT_EVENTS];
                    currentObj = currentEventList.last();
                    if (currentObj) {
                        removeEventObjectById(box, events._byName[currentObj.name], currentObj.id);
                        // if (!) {
                        //     removeEventObject(box, events._byName[currentObj.name], currentObj.handler, currentObj.ctx);
                        // }
                    }
                }
                return box;
            },
            stopListening: function (obj, name, callback) {
                var ids, listening, stillListening = 0,
                    origin = this,
                    listeningTo = origin[_LISTENING_TO];
                if (listeningTo && (!obj || obj._listenId)) {
                    duff(obj ? [obj._listenId] : _.keys(listeningTo), function (id) {
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
                    box.dispatchEvent(str, data, eventOptions);
                });
                return box;
            },
            _eventDispatcher: function (evnt) {
                var box = this,
                    name = evnt.name,
                    events = box._getEvents(),
                    currentEventArray = events[CURRENT_EVENTS],
                    list = events._byName[name],
                    ret = result(box, evnt.onMethodName, evnt),
                    removeList = events[REMOVE_EVENTS],
                    anotherRet = !evnt[IMMEDIATE_PROP_IS_STOPPED] && (!list || !!list.find(function (obj) {
                        var gah;
                        currentEventArray.push(obj);
                        obj.fn(evnt);
                        gah = currentEventArray.pop();
                        return evnt[IMMEDIATE_PROP_IS_STOPPED];
                    }));
                if (!currentEventArray[LENGTH]() && removeList[LENGTH]()) {
                    removeList.duffRev(box._removeEvent, box);
                    removeList.empty();
                }
            },
            _createEvent: function (name, data) {
                return new ObjectEvent(name, this, data);
            },
            dispatchEvent: function (name, data, evnt_) {
                var box = this,
                    methodName = upCase(camelCase('on:' + name, ':')),
                    evnt = evnt_ || box._createEvent(name, data);
                box._eventDispatcher(evnt);
                evnt.finished();
                return evnt;
            },
            _attachEvent: function (name, eventObject) {
                var list, obj = this;
                eventObject.id = ++event_incrementer;
                eventObject.valueOf = returnsId;
                eventObject.ctx = eventObject.ctx || eventObject.origin;
                eventObject.fn = bind(eventObject.fn || eventObject.handler, eventObject.ctx);
                // attach the id to the bound function because that instance is private
                eventObject.fn[__FN_ID__] = eventObject.id;
                // events = obj[_EVENTS] = obj[_EVENTS] || {};
                list = obj._getEvents(name);
                // list = events[name] = events[name] || SortedCollection(BOOLEAN_TRUE, BOOLEAN_TRUE);
                // attaching name so list can remove itself from hash
                list.name = name;
                // attached so event can remove itself
                eventObject.list = list;
                eventObject.maxIndex = list[LENGTH]();
                list.add(eventObject);
            },
            _wipeList: function (list) {
                var box = this;
                if (!list[LENGTH]()) {
                    box._getEvents()._byName[list.name] = UNDEFINED;
                    return BOOLEAN_TRUE;
                }
            },
            _removeEvent: function (evnt) {
                var listeningTo, box = this,
                    listening = evnt.listening,
                    list = evnt.list,
                    events = box._getEvents();
                if (events[CURRENT_EVENTS][LENGTH]()) {
                    events[REMOVE_EVENTS].add(evnt);
                    return BOOLEAN_FALSE;
                } else {
                    list.remove(evnt);
                    // disconnect it from the list above it
                    evnt.list = UNDEFINED;
                    // check to see if it was a listening type
                    if (!listening) {
                        return;
                    }
                    // if it was then decrement it
                    listening.count--;
                    if (listening.count) {
                        return;
                    }
                    listeningTo = listening.listeningTo;
                    listeningTo[listening.obj._listenId] = UNDEFINED;
                    box._wipeList(list);
                    return BOOLEAN_TRUE;
                }
            }
        }, BOOLEAN_TRUE);
});