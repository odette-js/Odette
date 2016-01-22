application.scope(function (app) {
    var blank, _ = app._,
        // extendFrom = app.extendFrom,
        // factories = app.factories,
        gapSplit = _.gapSplit,
        simpleObject = _.simpleObject,
        isObject = _.isObject,
        isString = _.isString,
        isNum = _.isNum,
        isFunction = _.isFunction,
        each = _.each,
        duff = _.duff,
        isBlank = _.isBlank,
        duffRev = _.duffRev,
        push = _.push,
        has = _.has,
        map = _.map,
        isInstance = _.isInstance,
        camelCase = _.camelCase,
        intendedObject = _.intendedObject,
        toArray = _.toArray,
        clone = _.clone,
        once = _.once,
        extend = _.extend,
        remove = _.remove,
        property = _.property,
        stringify = _.stringify,
        isArrayLike = _.isArrayLike,
        isArray = _.isArray,
        upCase = _.upCase,
        objCondense = _.objCondense,
        LENGTH = 'length',
        PARENT = 'parent',
        internalEventsString = '_events',
        EVENT_REMOVE = '_removeEventList',
        CURRENT_EVENTS = '_currentEventList',
        internalListeningToString = '_listeningTo',
        modifiedTriggerString = 'alter:',
        iPISString = 'immediatePropagationIsStopped',
        SERIALIZED_DATA = 'serializedData',
        BOOLEAN_FALSE = !1,
        BOOLEAN_TRUE = !0,
        iterateOverObject = function (box, ctx, key, value, iterator, firstarg, allowNonFn) {
            intendedObject(key, value, function (evnts, funs_) {
                // only accepts a string or a function
                var fn = isString(funs_) ? box[funs_] : funs_;
                if (allowNonFn || isFunction(fn)) {
                    return duff(gapSplit(evnts), function (eventName) {
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
                }
            });
        },
        // user friendly version
        flattenMatrix = function (iterator, nameOrObjectIndex) {
            return function () {
                var names, box = this,
                    args = toArray(arguments),
                    handlersIndex = nameOrObjectIndex,
                    list = args.splice(nameOrObjectIndex),
                    nameOrObject = list[0];
                if (!nameOrObjectIndex || args[0]) {
                    iterateOverObject(box, args[handlersIndex + 1], nameOrObject, list[1], iterator, args[0]);
                }
                return box;
            };
        },
        removeEventObject = function (box, arr, handler, ctx) {
            var current = getCurrentEventList(box);
            duffRev(arr, function (obj, idx, array) {
                if ((!handler || obj.handler === handler) && (!ctx || obj.ctx === ctx)) {
                    // because event triggers are always syncronous,
                    // we can just wait until the dispatchEvent function is done
                    if (current[LENGTH]) {
                        getRemoveList(box).push(obj);
                    } else {
                        removeEvent(obj);
                    }
                }
            });
        },
        removeEvent = function (evnt) {
            var listeningTo, listening = evnt.listening;
            remove(evnt.list, evnt);
            // disconnect it from the list above it
            evnt.list = blank;
            // check to see if it was a listening type
            if (listening) {
                // if it was then decrement it
                listening.count--;
                if (!listening.count) {
                    listeningTo = listening.listeningTo;
                    listeningTo[listening.obj._listenId] = blank;
                }
            }
        },
        retreiveEventList = function (model, name) {
            if (!model[internalEventsString]) {
                model[internalEventsString] = {};
            }
            return model[internalEventsString][name];
        },
        getRemoveList = function (model) {
            var list = model[EVENT_REMOVE];
            if (!list) {
                list = model[EVENT_REMOVE] = [];
            }
            return list;
        },
        getCurrentEventList = function (box) {
            var list = box[CURRENT_EVENTS];
            if (!list) {
                list = box[CURRENT_EVENTS] = [];
            }
            return list;
        },
        attachEventObject = function (obj, name, eventObject) {
            var events, list;
            if (isObject(obj)) {
                eventObject.ctx = eventObject.ctx || eventObject.origin;
                eventObject.fn = eventObject.fn || eventObject.handler;
                eventObject.fn = _.bind(eventObject.fn, eventObject.ctx);
                events = obj[internalEventsString] = obj[internalEventsString] || {};
                list = events[name] = events[name] || [];
                // attached so event can remove itself
                eventObject.list = list;
                list.push(eventObject);
            }
        },
        extrapolateContext = function (fn) {
            return function () {
                var args = toArray(arguments);
                if (!args[2]) {
                    args.push(this);
                }
                return fn.apply(this, args);
            };
        },
        listenToWrap = function (fn) {
            return function () {
                var args = toArray(arguments);
                if (!args[3]) {
                    args.push(this);
                }
                args = _.cycle(args, 1);
                return fn.apply(this, args);
            };
        },
        unrollName = function (fn, expectsNameAt) {
            return function () {
                var args = toArray(arguments);
                if (isString(args[expectsNameAt])) {
                    args[expectsNameAt] = this[args[expectsNameAt]];
                }
                fn.apply(this, args);
            };
        },
        retreiveListeningObject = function (thing, obj) {
            var listeningTo, listening, thisId, id = obj._listenId;
            if (!id) {
                id = obj._listenId = _.uniqueId('l');
            }
            listeningTo = thing[internalListeningToString] || (thing[internalListeningToString] = {});
            listening = listeningTo[id];
            // This object is not listening to any other events on `obj` yet.
            // Setup the necessary references to track the listening callbacks.
            if (!listening) {
                thisId = thing._listenId;
                if (!thisId) {
                    thisId = thing._listenId = _.uniqueId('l');
                }
                listening = listeningTo[id] = {
                    obj: obj,
                    objId: id,
                    id: thisId,
                    listeningTo: listeningTo,
                    ctx: thing,
                    count: 0
                };
            }
            return listening;
        },
        ObjectEvent = _.extendFrom.Model('ObjectEvent', {
            constructor: function (name, target, data) {
                var evnt = this;
                if (isInstance(data, Event)) {
                    return data;
                }
                evnt.bubbles = BOOLEAN_FALSE;
                evnt.dispatchChildren = BOOLEAN_FALSE;
                evnt.dispatchTree = BOOLEAN_FALSE;
                evnt.onMethodName = upCase(camelCase('on:' + name, ':'));
                evnt.propagationIsStopped = evnt[iPISString] = BOOLEAN_FALSE;
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
                    ret = this[SERIALIZED_DATA] = _.parse(_.stringify((arg === blank || arg === NULL) ? {} : arg));
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
                this[iPISString] = BOOLEAN_TRUE;
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
        bindOnce = function (box, name, obj) {
            var fn = obj.handler;
            obj.fn = _.once(function () {
                box.off();
                fn.apply(this, arguments);
            });
        },
        listenToHandler = function (box, name, obj, target) {
            var listeningObject = retreiveListeningObject(box, target);
            preBindListeners(obj, listeningObject);
            attachEventObject(target, name, obj);
        },
        onceHandler = function (box, name, obj) {
            bindOnce(box, name, obj);
            attachEventObject(box, name, obj);
        },
        preBindListeners = function (obj, listening) {
            listening.count++;
            obj.listening = listening;
        },
        listenToOnceHandler = function (box, name, obj, extra) {
            bindOnce(box, name, obj);
            listenToHandler(box, name, obj, extra);
        },
        // makeValidEvent = ,
        getEventList = function (box, name) {
            var events = box[internalEventsString] = box[internalEventsString] || {};
            return events[name] || [];
        },
        overrideEventCreation = function (obj) {
            return obj && (obj.bubbles || obj.dispatchChildren || opts.dispatchTree);
        },
        Events = _.extendFrom.Model('Events', {
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
                model._makeValid();
                model.on(model.events);
                model.initialize(opts);
                return model;
            },
            _makeValid: function () {
                var model = this;
                model[CURRENT_EVENTS] = model[CURRENT_EVENTS] || [];
                model[internalEventsString] = model[internalEventsString] || {};
                model[EVENT_REMOVE] = model[EVENT_REMOVE] || [];
                return model;
            },
            on: flattenMatrix(attachEventObject, 0),
            once: flattenMatrix(onceHandler, 0),
            listenTo: flattenMatrix(listenToHandler, 1),
            /**
             * @description attaches an event handler to the events object, and takes it off as soon as it runs once
             * @func
             * @name Box#once
             * @param {String} string - event name that will be triggered
             * @param {Function} fn - event handler that will run only once
             * @param {Object} ctx - context that will be applied to the handler
             * @returns {Box} instance
             */
            listenToOnce: flattenMatrix(listenToOnceHandler, 1),
            /**
             * @description remove event objects from the _events object
             * @param {String|Function} type - event type or handler. If a match is found, then the event object is removed
             * @param {Function} handler - event handler to be matched and removed
             * @func
             * @name Box#off
             * @returns {Box} instance
             */
            offAll: function () {
                var box = this;
                each(box[internalEventsString], function (array, key, obj) {
                    duffRev(array, removeEvent);
                });
                return box;
            },
            off: function (name_, fn_, ctx_) {
                var currentEventList, currentObj, box = this,
                    // ctx = fn_,
                    name = name_;
                box._makeValid();
                if (arguments[LENGTH]) {
                    if (!name) {
                        each(box[internalEventsString], function (list, name) {
                            removeEventObject(box, list, fn_, ctx_);
                        });
                    } else {
                        iterateOverObject(box, isObject(name_) ? fn_ : ctx_, name, fn_, function (box, name, obj) {
                            removeEventObject(box, !name || box[internalEventsString][name], obj.handler, obj.ctx);
                        }, BOOLEAN_TRUE);
                    }
                } else {
                    currentEventList = getCurrentEventList(box);
                    currentObj = currentEventList[currentEventList[LENGTH] - 1];
                    if (currentObj) {
                        removeEventObject(box, [currentObj]);
                    }
                }
            },
            stopListening: function (obj, name, callback) {
                var ids, listening, stillListening = 0,
                    origin = this,
                    listeningTo = origin[internalListeningToString];
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
                        origin[internalListeningToString] = blank;
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
                    valid = box._makeValid(),
                    name = evnt.name,
                    currentEventArray = getCurrentEventList(box),
                    list = getEventList(box, name),
                    ret = isFunction(box[evnt.methodName]) && box[evnt.methodName](evnt);
                anotherRet = evnt[iPISString] || !!_.find(list, function (obj) {
                    var gah;
                    currentEventArray.push(obj);
                    obj.fn(evnt);
                    gah = currentEventArray.pop(name);
                    return evnt[iPISString];
                });
                if (!currentEventArray[LENGTH] && box[EVENT_REMOVE][LENGTH] && box[EVENT_REMOVE][LENGTH]) {
                    duffRev(box[EVENT_REMOVE], removeEvent);
                    box[EVENT_REMOVE] = [];
                }
                return box;
            },
            _createEvent: function (name, data) {
                return new ObjectEvent(name, this, data);
            },
            dispatchEvent: function (name, data, evnt_) {
                var methodName = upCase(camelCase('on:' + name, ':')),
                    onMethod = isFunction(box[methodName]),
                    evnt = evnt_ || box._createEvent(name, data);
                box._eventDispatcher(evnt);
                evnt.finished();
                return evnt;
            }
        }, !0);
});