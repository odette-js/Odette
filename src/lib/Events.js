// var EVENT_STRING = 'Events',
//     DISPATCH_EVENT = 'dispatchEvent',
//     EVENT_MANAGER = 'EventManager',
//     STOP_LISTENING = 'stopListening',
//     TALKER_ID = 'talkerId',
//     LISTENING_TO = 'listeningTo',
//     REGISTERED = 'registered',
//     LISTENING_PREFIX = 'l',
//     TALKER_PREFIX = 't',
//     STATE = 'state',
//     HANDLERS = 'handlers',
//     methodExchange = function (eventer, handler) {
//         var fn = isString(handler) ? eventer[handler] : handler,
//             valid = !isFunction(fn) && exception('handler must be a function or a string with a method on the originating object');
//         return fn;
//     },
//     curriedEquality = function (key, original) {
//         return function (e) {
//             return isEqual(original, e[ORIGIN].get(key));
//         };
//     },
//     makeHandler = function (directive, object) {
//         object.fn = function (e) {
//             if (e && object.comparator(e)) {
//                 if (object.triggersOnce) {
//                     directive.detach(object);
//                 }
//                 object.runner(e);
//             }
//         };
//     },
//     retreiveListeningObject = function (listener, talker) {
//         var listening, listenerDirective = listener.directive(EVENT_MANAGER),
//             talkerDirective = talker.directive(EVENT_MANAGER),
//             talkerId = talkerDirective[TALKER_ID],
//             listeningTo = listenerDirective[LISTENING_TO];
//         if (talkerId && (listening = listeningTo[talkerId])) {
//             return listening;
//         }
//         // This talkerId is not listening to any other events on `talker` yet.
//         // Setup the necessary references to track the listening callbacks.
//         talkerId = talkerDirective[TALKER_ID] = talkerDirective[TALKER_ID] || app.counter(TALKER_PREFIX);
//         listening = listeningTo[talkerId] = {
//             talker: talker,
//             // look into not having this key
//             talkerId: talkerId,
//             listeningTo: listeningTo,
//             count: 0
//         };
//         return listening;
//     },
//     listenToHandler = function (eventer, directive, evnt, list, modifier) {
//         var target = list[0];
//         var targetDirective = listenToModifier(eventer, directive, evnt, target);
//         evnt.handler = methodExchange(eventer, evnt.handler);
//         attachEventObject(target, targetDirective, evnt, list.slice(1), modifier);
//     },
//     listenToOnceHandler = function (eventer, directive, obj, list) {
//         listenToHandler(eventer, directive, obj, list, onceModification);
//     },
//     setupWatcher = function (nameOrObjectIndex, triggersOnce) {
//         return function () {
//             var context, list, firstArg, handlersIndex, nameOrObject, eventerDirective, original_handler, targetDirective, eventer = this,
//                 ret = {},
//                 args = toArray(arguments);
//             if (!arguments[0]) {
//                 return ret;
//             }
//             handlersIndex = nameOrObjectIndex;
//             list = args.slice(nameOrObjectIndex);
//             nameOrObject = list[0];
//             context = list[(isObject(nameOrObject) ? 2 : 3)] || eventer;
//             if (nameOrObjectIndex && !args[0]) {
//                 return ret;
//             }
//             eventerDirective = eventer.directive(EVENT_MANAGER);
//             if (nameOrObjectIndex) {
//                 targetDirective = args[0].directive(EVENT_MANAGER);
//             } else {
//                 targetDirective = eventerDirective;
//             }
//             intendedObject(nameOrObject, list[1], function (key_, value_, isObject_) {
//                 // only allow one to be watched
//                 var key = key_.split(SPACE)[0],
//                     fun_things = original_handler || bind(list[isObject_ ? 1 : 2], context || eventer),
//                     value = isFunction(value_) ? value_ : curriedEquality(key, value_),
//                     name = CHANGE + COLON + key,
//                     origin = eventer,
//                     made = targetDirective.make(name, fun_things, eventer);
//                 if (nameOrObjectIndex + 2 < args[LENGTH]) {
//                     args.push(context);
//                 }
//                 if (nameOrObjectIndex) {
//                     listenToModifier(eventer, eventerDirective, made, args[0]);
//                 }
//                 made.comparator = value;
//                 made.triggersOnce = !!triggersOnce;
//                 made.runner = fun_things;
//                 attachEventObject(origin, targetDirective, made, [list[0], list[2], list[3]], makeHandler);
//                 ret[key] = fun_things;
//             });
//             return ret;
//         };
//     },
//     listenToModifier = function (eventer, targetDirective, obj, target) {
//         var valid, listeningObject = retreiveListeningObject(eventer, target),
//             eventsDirective = target.directive(EVENT_MANAGER),
//             handlers = eventsDirective[HANDLERS] = eventsDirective[HANDLERS] || {};
//         listeningObject.count++;
//         obj.listening = listeningObject;
//         return eventsDirective;
//     },
//     onceModification = function (directive, obj) {
//         var fn = obj.fn || obj.handler;
//         obj.fn = once(function (e) {
//             // much faster than using off
//             directive.detach(obj);
//             // ok with using apply here since it is a one time deal per event
//             return fn.apply(this, arguments);
//         });
//     },
//     attachEventObject = function (eventer, directive, evnt, args, modifier) {
//         evnt.context = evnt.context || args[2];
//         evnt.handler = methodExchange(eventer, evnt.handler);
//         directive.attach(evnt.name, evnt, modifier);
//     },
//     onceHandler = function (eventer, directive, obj, args) {
//         attachEventObject(eventer, directive, obj, args, onceModification);
//     },
//     onFillerMaker = function (count) {
//         return function (eventer, args) {
//             if (args[LENGTH] === count) {
//                 args.push(eventer);
//             }
//         };
//     },
//     Events = app.block(function (app) {
//         var iterateOverList = function (eventer, directive, names, handler, args, iterator) {
//                 // only accepts a string or a function
//                 return forEach(toArray(names, SPACE), function (eventName) {
//                     iterator(eventer, directive, directive.make(eventName, handler, eventer), args);
//                 });
//             },
//             flattenMatrix = function (iterator, _nameOrObjectIndex, expects, fills) {
//                 return function (first, second) {
//                     var args, eventsDirective, firstTimeRound = BOOLEAN_TRUE,
//                         eventer = this;
//                     if (!first) {
//                         return eventer;
//                     }
//                     if (_nameOrObjectIndex && !second) {
//                         return eventer;
//                     }
//                     args = toArray(arguments);
//                     intendedObject(args[_nameOrObjectIndex], args[_nameOrObjectIndex + 1], function (key, value, isObj) {
//                         eventsDirective = eventsDirective || eventer.directive(EVENT_MANAGER);
//                         if (firstTimeRound && isObj) {
//                             // make room for one more
//                             args.splice(_nameOrObjectIndex, _nameOrObjectIndex + 1, NULL);
//                         }
//                         args[_nameOrObjectIndex] = key;
//                         args[_nameOrObjectIndex + 1] = value;
//                         firstTimeRound = BOOLEAN_FALSE;
//                         if (args[LENGTH] < expects) {
//                             fills(eventer, args);
//                         }
//                         iterateOverList(eventer, eventsDirective, key, value, args, iterator);
//                     });
//                     return eventer;
//                 };
//             },
//             onFiller = onFillerMaker(2),
//             listenToFiller = onFillerMaker(3),
//             uniqueKey = 'c',
//             /**
//              * Event driven base api for many other objects to base their class off of. Based off of the class originally introduced by backbone, with a modification to the way arguments are applied (only 1) and a proliforation of the variety of handler wrappers that are wrapped and applied in different ways to convenience the user.
//              * @class Events
//              * @extends {Directive}
//              * @example
//              * var eventer = factories.Events();
//              */
//             Events = factories[EVENT_STRING] = factories.Directive.extend(EVENT_STRING,
//                 /**
//                  * @lends Events.prototype
//                  */
//                 {
//                     /**
//                      * Noop for overwriting on class extension. Allows you to call a function in the middle of construction. Useful for base setup of objects, after imperative objects have been created.
//                      * @method
//                      * @example <caption>the initialize function does not have to return anything, and is called internal to the constructor</caption>
//                      * var NuClass = factories.Events.extend('NuClass', {
//                      *     initialize: function () {
//                      *         this.inited = true;
//                      *     }
//                      * });
//                      */
//                     initialize: noop,
//                     /**
//                      * Chain a series of Events based objects and trigger a bubble on them sequentially. Useful for nested objects where the pointer of a parent is available to the child or in any direction where a pointer is available.
//                      * @description bubbling is discerned by the origin model. This means that the object that gets bubble called on it will determine the objects which it would like to dispatch the event on. Objects do not decide singularly, and for themselves.
//                      * @method
//                      * @param {String} name name of the event to dispatch
//                      * @param {Event} event object to dispatch
//                      */
//                     bubble: parody(EVENT_MANAGER, 'bubble'),
//                     /**
//                      * attach event handlers to the Model event loop
//                      * @param {String} str - event name to listen to
//                      * @param {Function|String} fn - event handler or string corresponding to handler on prototype to use for handler
//                      * @param {Object} context - context that the handler will run in
//                      * @returns {Events}
//                      * @method
//                      * @example
//                      * events.on("eventname", function (e) {
//                      *     // handle the eventname being triggered
//                      * });
//                      */
//                     on: flattenMatrix(attachEventObject, 0, 3, onFiller),
//                     /**
//                      * @description attaches an event handler to the events object, and takes it off as soon as it runs once
//                      * @param {String} string - event name that will be triggered
//                      * @param {Function} fn - event handler that will run only once
//                      * @param {Object} context - context that will be applied to the handler
//                      * @returns {Model} instance
//                      * @method
//                      * @example <caption>Attaches an event handler to the events object. Handler will be removed automatically, the next time the event "eventname" is dispatched.</caption>
//                      * events.once("eventname", function (e) {
//                      *     // handle the next time the event eventname is triggered
//                      * });
//                      * @example <caption>attach multiple event handlers that will automatically be removed as soon as the handler is triggered.</caption>
//                      * events.once({
//                      *     "eventname": function (e) {
//                      *         // handle the eventname event
//                      *     },
//                      *     "event1 event2": function (e) {
//                      *         //
//                      *     }
//                      * });
//                      */
//                     once: flattenMatrix(onceHandler, 0, 3, onFiller),
//                     *
//                      * Listen to another object's events using this method. If it is really a first object listening to events being triggered on a second object, then this method is much more useful. This method provides the correct cleanup code so that pointers are not left behind by mixing contexts or scopes together.
//                      * @method
//                      * @param {Events} eventer Events object to listen to. When this object, or ther originating object is destroyed, the event handlers on both sides of the equation will be taken care of.
//                      * @param {String|Object} name name of the event to listen to. An object can also be used where the keys are event names and the values are handlers.
//                      * @param {Function|Object} fn handler to be triggered when the event is triggered. Handlers can be paired with keys in the second argument.
//                      * @param {Object} [context] context that the handler should be run in. This is a parameter to be more careful with since it can also produce zombies. The default context for the listenTo method is the Events object that is doing the listening.
//                      * @example <caption>eventer1 can react to eventer2's evntname event being triggered on eventer2.</caption>
//                      * eventer1.listenTo(eventer2, 'evntname', function (e) {
//                      *     // react to evntname
//                      * });
//                     listenTo: flattenMatrix(listenToHandler, 1, 4, listenToFiller),
//                     /**
//                      * Just like the listenTo method, the listenToOnce method attaches event handlers, save for that it only triggers the handler once per event. So if you pass a space delineated list with n event names in it and a single handler, then that handler can be triggered n number of times.
//                      * @method
//                      * @param {Events} eventer Events object to listen to. When this object, or ther originating object is destroyed, the event handlers on both sides of the equation will be taken care of.
//                      * @param {String|Object} name name of the event to listen to. An object can also be used where the keys are event names and the values are handlers.
//                      * @param {Function|Object} fn handler to be triggered when the event is triggered. Handlers can be paired with keys in the second argument.
//                      * @param {Object} [context] context that the handler should be run in. This is a parameter to be more careful with since it can also produce zombies. The default context for the listenTo method is the Events object that is doing the listening.
//                      * @example <caption>the event below will react once to each event name passed in, and if the event names and handlers are collapsed into a single object, the same rules will apply, but for the key, value pairs.</caption>
//                      * eventer1.listenToOnce(eventer2, 'eventname secondeventname', function (e) {
//                      *     // react once to each event
//                      * });
//                      */
//                     listenToOnce: flattenMatrix(listenToOnceHandler, 1, 4, listenToFiller),
//                     /**
//                      * Directive parody for the Linguistics class to instantiated behind a LinguisticsManager (an extended Collection) and do manage events
//                      * @method
//                      * @param {String} event to base the event trigger off of.
//                      */
//                     when: parody('LinguisticsManager', 'when'),
//                     constructor: function (opts) {
//                         var eventer = this;
//                         merge(eventer, opts);
//                         eventer[uniqueKey + ID] = eventer[uniqueKey + ID] || app.counter(uniqueKey);
//                         // reacting to self
//                         eventer.on(result(eventer, 'events'));
//                         eventer.initialize(opts);
//                         return eventer;
//                     },
//                     /**
//                      * @description remove event objects from the _events object
//                      * @param {String|Function} type - event type or handler. If a match is found, then the event object is removed
//                      * @param {Function} handler - event handler to be matched and removed
//                      * @returns {Model} instance
//                      */
//                     off: function (name_, fn_, context_) {
//                         var context, currentObj, eventer = this,
//                             name = name_,
//                             events = eventer[EVENT_MANAGER],
//                             removeAllMatching = function () {
//                                 forOwn(events[HANDLERS], function (list, name) {
//                                     events.seekAndDestroy(list, fn_, context);
//                                 });
//                             };
//                         if (!events) {
//                             return eventer;
//                         }
//                         context = isObject(name) ? fn_ : context_;
//                         if (name === BOOLEAN_TRUE) {
//                             removeAllMatching();
//                         }
//                         if (arguments[LENGTH]) {
//                             if (!name) {
//                                 removeAllMatching();
//                             } else {
//                                 intendedObject(name, fn_, function (name, fn_) {
//                                     iterateOverList(eventer, events, name, fn_, [], function (eventer, directive, obj) {
//                                         var handlers = events[HANDLERS][obj.name];
//                                         return handlers && events.seekAndDestroy(handlers, obj.handler, context);
//                                     });
//                                 });
//                             }
//                         } else {
//                             currentObj = events[STACK].last();
//                             if (currentObj) {
//                                 events.detach(currentObj);
//                             }
//                         }
//                         return eventer;
//                     },
//                     /**
//                      * Stop listening to external objects that this object has handlers attached to. Useful to remove all handlers off of a single objects, filtered by name and handler instance.
//                      * @param  {Events} target Object that is being listened to.
//                      * @param  {String} [name] name of the event. Event names and handlers can be paired by setting them as key value pairs on an object. (event names, or object keys will be itereated through by space delineation)
//                      * @param  {Function} callback handler instance to match. If this is a non null value then the stopListening will only remove the handler if it is strictly equal to (is the same pointer) that was passed in.
//                      * @return {Events}
//                      * @example <caption>It is not always necessary to save the function in a variable. If the handler is on a prototype for instance, then you don't need to set an extra variable. All you need is access to the pointer.</caption>
//                      * var pointerFromBefore = function () {
//                      *     // event handler
//                      * };
//                      * eventer1.listenTo(eventer2, {
//                      *     "eventname eventname2": pointerFromBefore
//                      * });
//                      * @example <caption>the following code will remove all event handlers on eventer2</caption>
//                      * eventer1.stopListening(eventer2);
//                      * @example <caption>the following will only remove the event handler under the eventname2 event.</caption>
//                      * eventer1.stopListening(eventer2, "eventname2");
//                      * @example <caption>using the pointer from before, we are able to remove only that event handler from the event "eventname"</caption>
//                      * eventer1.stopListening(eventer2, "eventname", pointerFromBefore);
//                      */
//                     stopListening: function (target, name, callback) {
//                         var listeningTo, notTalking, ids, targetEventsManager, stillListening = 0,
//                             origin = this,
//                             originEventsManager = origin[EVENT_MANAGER];
//                         if (!originEventsManager) {
//                             return origin;
//                         }
//                         listeningTo = originEventsManager[LISTENING_TO];
//                         notTalking = (target && !(targetEventsManager = target[EVENT_MANAGER]));
//                         if (notTalking) {
//                             return origin;
//                         }
//                         ids = target ? [targetEventsManager[TALKER_ID]] : keys(listeningTo);
//                         forEach(ids, function (id) {
//                             var listening = listeningTo[id];
//                             if (listening) {
//                                 listening.talker.off(name, callback);
//                             }
//                             stillListening = (stillListening || (listening && listening[id])) ? 1 : 0;
//                         });
//                         if (!stillListening && !find(target ? keys(listeningTo) : ids, function (id, key) {
//                                 return listeningTo[id];
//                             })) {
//                             originEventsManager[LISTENING_TO] = {};
//                         }
//                         return origin;
//                     },
//                     /**
//                      * Dispatches a list of events with no data
//                      * @param {String} name list to be triggered
//                      * @returns {Model} object instance the method is being called on
//                      * @example <caption>dispatch events using the dispatch event method. In this instance the dispatchEvents method will trigger the events "after:named", then "before:name"</caption>
//                      * eventer.dispatchEvents("after:named before:name");
//                      */
//                     dispatchEvents: function (names) {
//                         var eventer = this;
//                         return forEach(toArray(names, SPACE), bindTo(eventer.dispatchStack, eventer)) && eventer;
//                     },
//                     /**
//                      * Proxy for dispatch event, as a filter during an iteration of a bunch of event names.
//                      * @param  {String} name Event name to be dispatched.
//                      * @return {Events} Event object dispatching the event.
//                      * @example
//                      * eventer.dispatchStack("string");
//                      */
//                     dispatchStack: function (name) {
//                         return this[DISPATCH_EVENT](name);
//                     },
//                     /**
//                      * @description triggers a event loop
//                      * @param {String} name of the event loop to be triggered
//                      * @returns {Model} object instance the method is being called on
//                      * @example <caption>dispatch events using the dispatch event method.</caption>
//                      * eventer.dispatchEvent("before:name", {
//                      *     datum: true
//                      * });
//                      */
//                     dispatchEvent: function (name, data, options) {
//                         var bus, evnt, eventValidation, returnValue, eventer = this,
//                             eventsDirective = eventer[EVENT_MANAGER];
//                         if (!eventsDirective || !eventsDirective.has(name) || eventsDirective.running[name] || eventsDirective.queued[name] || !(eventValidation = eventsDirective.validate(name, data, options))) {
//                             return;
//                         }
//                         if (isArray(eventValidation)) {
//                             name = eventValidation[0];
//                             data = eventValidation[1];
//                             options = eventValidation[2];
//                         }
//                         evnt = eventsDirective.create(eventer, data, name, options);
//                         returnValue = eventsDirective.dispatch(name, evnt);
//                         return returnValue;
//                     }
//                 });
//         Events.createEventCheck = function (eventname) {
//             return function (key, fn) {
//                 var handler = changeCheckHandle(key, fn, this);
//                 this.on(eventname, handler);
//                 return handler;
//             };
//         };
//         return Events;
//     });