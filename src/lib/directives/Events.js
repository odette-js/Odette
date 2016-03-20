var ACTIONS = 'actions',
    IS_STOPPED = 'isStopped',
    UPCASED_IS_STOPPED = upCase(IS_STOPPED),
    PROPAGATION = 'propagation',
    DEFAULT_PREVENTED = 'defaultPrevented',
    PROPAGATION_IS_STOPPED = PROPAGATION + UPCASED_IS_STOPPED,
    IMMEDIATE_PROP_IS_STOPPED = 'immediate' + upCase(PROPAGATION) + UPCASED_IS_STOPPED;
app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        __FN_ID__ = '__fnid__',
        event_incrementer = 1,
        Collection = factories.Collection,
        List = factories.List,
        REMOVE_QUEUE = 'removeQueue',
        listeningCounter = 0,
        returnsId = function () {
            return this.id;
        },
        SERIALIZED_DATA = '_sharedData',
        ObjectEvent = factories.Directive.extend('ObjectEvent', {
            constructor: function (target, data, name, options, when) {
                var evnt = this;
                evnt[PROPAGATION_IS_STOPPED] = evnt[IMMEDIATE_PROP_IS_STOPPED] = BOOLEAN_FALSE;
                evnt[ORIGIN] = target;
                evnt[NAME] = name;
                evnt[TYPE] = name.split(COLON)[0];
                evnt.timeStamp = when || now();
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
                evnt[SERIALIZED_DATA] = isObject(data) ? data : {};
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
        EventsDirective = factories.Directive.extend('EventsDirective', {
            constructor: function (target) {
                var eventsDirective = this;
                eventsDirective.target = target;
                eventsDirective.listenId = 'l' + (++listeningCounter);
                eventsDirective.handlers = {};
                eventsDirective.listeningTo = {};
                eventsDirective.running = {};
                eventsDirective.stack = List();
                eventsDirective.removeQueue = List();
                eventsDirective.proxyStack = Collection();
                eventsDirective.proxyStack.unmark('dirty');
                return eventsDirective;
            },
            attach: function (name, eventObject, modifier) {
                var list, eventsDirective = this,
                    handlers = eventsDirective[HANDLERS];
                eventObject.id = ++event_incrementer;
                eventObject.valueOf = returnsId;
                eventObject.context = eventObject.context || eventObject.origin;
                if (modifier && isFunction(modifier)) {
                    modifier(eventsDirective, eventObject);
                }
                eventObject.fn = bind(eventObject.fn || eventObject.handler, eventObject.context);
                // attach the id to the bound function because that instance is private
                list = handlers[name] = handlers[name] || List();
                // attaching name so list can remove itself from hash
                list[NAME] = name;
                // attached so event can remove itself
                eventObject.list = list;
                eventsDirective.add(list, eventObject);
            },
            create: function (target, data, name, options) {
                return ObjectEvent(target, data, name, options);
            },
            make: function (name, handler, origin, context) {
                return {
                    disabled: BOOLEAN_FALSE,
                    namespace: name.split(COLON)[0],
                    name: name,
                    handler: handler,
                    context: context,
                    origin: origin
                };
            },
            seekAndDestroy: function (list, handler, context) {
                var events = this,
                    stackLength = events[STACK][LENGTH](),
                    todo = [];
                return list.duff(function (obj, idx) {
                    if (obj.disabled || (handler && obj.handler !== handler) || (context && obj.context !== context)) {
                        return;
                    }
                    if (stackLength) {
                        events.detach(obj, idx);
                    } else {
                        todo.push([obj, idx]);
                    }
                }) && todo[LENGTH] && duff(todo, function (tuple) {
                    events.detach(tuple[0], tuple[1]);
                });
            },
            nextBubble: function (start) {
                return start.parent;
            },
            bubble: function (evnt, data, options) {
                var previous, events = this,
                    start = events.target,
                    list = [start],
                    next = start;
                while (next) {
                    previous = next;
                    next = events.nextBubble(previous, list);
                    if (next) {
                        list.push(next);
                    }
                    if (previous === next) {
                        exception({
                            message: 'bubbling discerners must return a different object each time it is run'
                        });
                    }
                }
                duff(list, function (target) {
                    target[DISPATCH_EVENT](evnt, data, options);
                });
                return start;
            },
            add: function (list, evnt) {
                list.push([evnt]);
            },
            remove: function (list, evnt, index) {
                list.removeAt(evnt, index);
            },
            detachCurrent: function () {
                return this.detach(this[STACK].last());
            },
            detach: function (evnt, index) {
                var listeningTo, events = this,
                    listening = evnt.listening,
                    list = evnt.list,
                    disabled = evnt.disabled = BOOLEAN_TRUE;
                if (evnt.removed) {
                    return BOOLEAN_TRUE;
                }
                evnt.removed = BOOLEAN_TRUE;
                events.remove(list, evnt, index);
                // disconnect it from the list above it
                evnt.list = UNDEFINED;
                events.wipe(list);
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
                return BOOLEAN_TRUE;
            },
            wipe: function (list) {
                if (list[LENGTH]()) {
                    return BOOLEAN_FALSE;
                }
                this.scrub(list);
                return BOOLEAN_TRUE;
            },
            scrub: function (list) {
                list.scrubbed = BOOLEAN_TRUE;
                delete this[HANDLERS][list[NAME]];
            },
            reset: function () {
                return each(this.handlers, this.scrub, this);
            },
            queue: function (stack, handler, evnt) {
                return stack.push([handler]);
            },
            unQueue: function (stack, handler, evnt) {
                return stack.pop();
            },
            has: function (key) {
                return this.handlers[key] && this.handlers[key][LENGTH]();
            },
            dispatch: function (name, evnt) {
                var handler, items, listLength, returnValue, i = 0,
                    events = this,
                    stack = events[STACK],
                    handlers = events[HANDLERS],
                    list = handlers[name],
                    // removeList = events[REMOVE_QUEUE],
                    running = events.running,
                    cached = running[name],
                    stopped = evnt[PROPAGATION_IS_STOPPED],
                    bus = events.proxyStack;
                // make sure setup is proper
                if (cached || stopped || !list || !list[LENGTH]()) {
                    return;
                }
                running[name] = BOOLEAN_TRUE;
                List(events.subset(list.unwrap(), evnt)).each(function (handler) {
                    if (!handler.disabled && events.queue(stack, handler, evnt)) {
                        handler.fn(evnt);
                        stopped = !!evnt[IMMEDIATE_PROP_IS_STOPPED];
                        events.unQueue(stack, handler, evnt);
                    }
                });
                if (stopped) {
                    events.cancelled(stack, evnt, i);
                }
                evnt.finished();
                returnValue = evnt.returnValue;
                running[name] = !!cached;
                return returnValue;
            },
            subset: function (list) {
                return list.slice(0);
            },
            bus: function (id, handler, context) {
                var bus = this.proxyStack,
                    object = {
                        id: id,
                        fn: bind(handler, context),
                        context: context,
                        disabled: BOOLEAN_FALSE,
                        handler: handler
                    };
                bus.push(object);
                bus.register(ID, id, object);
                return this;
            },
            unBus: function (id, index) {
                var handler, directive = this,
                    bus = directive.proxyStack;
                if (!(handler = bus.get(ID, id))) {
                    return directive;
                }
                if (bus.list.iterating) {
                    bus.mark('dirty');
                    handler.disabled = BOOLEAN_TRUE;
                } else {
                    bus.remove(handler, index);
                    bus.unRegister(ID, id);
                }
                return directive;
            }
        }, BOOLEAN_TRUE);
    app.defineDirective(EVENTS, factories.EventsDirective[CONSTRUCTOR]);
});