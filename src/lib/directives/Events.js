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
        SortedCollection = factories.SortedCollection,
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
            constructor: function () {
                var eventsDirective = this;
                eventsDirective.listenId = 'l' + (++listeningCounter);
                eventsDirective.handlers = {};
                eventsDirective.listeningTo = {};
                eventsDirective.running = {};
                eventsDirective.stack = Collection();
                eventsDirective.removeQueue = Collection();
                return eventsDirective;
            },
            attach: function (names, eventObject) {
                var list, eventsDirective = this,
                    handlers = eventsDirective[HANDLERS],
                    ret = !handlers && exception({
                        message: 'events directive needs a handler object'
                    });
                duff(eventsDirective.names(names), function (name) {
                    eventObject.id = ++event_incrementer;
                    eventObject.valueOf = returnsId;
                    eventObject.context = eventObject.context || eventObject.origin;
                    eventObject.fn = bind(eventObject.fn || eventObject.handler, eventObject.context);
                    // attach the id to the bound function because that instance is private
                    // eventObject.fn[__FN_ID__] = eventObject.id;
                    list = handlers[name] = handlers[name] || SortedCollection();
                    // attaching name so list can remove itself from hash
                    list[NAME] = name;
                    // attached so event can remove itself
                    eventObject.list = list;
                    eventsDirective.add(list, eventObject);
                });
            },
            names: function (name) {
                return [name];
            },
            create: function (target, data, name, options) {
                return ObjectEvent(target, data, name, options);
            },
            add: function (list, evnt) {
                list.push(evnt);
            },
            remove: function (list, evnt) {
                list.remove(evnt);
            },
            detach: function (evnt) {
                var listeningTo, events = this,
                    listening = evnt.listening,
                    list = evnt.list,
                    disabled = evnt.disabled = BOOLEAN_TRUE;
                if (events[STACK][LENGTH]()) {
                    events[REMOVE_QUEUE].push(evnt);
                    return BOOLEAN_FALSE;
                } else {
                    if (evnt.removed) {
                        return BOOLEAN_TRUE;
                    }
                    events.remove(list, evnt);
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
                return stack.add(handler);
            },
            unQueue: function (stack, handler, evnt) {
                return stack.pop();
            },
            has: function (key) {
                return this.handlers[key] && this.handlers[key][LENGTH]();
            },
            dispatch: function (name, evnt) {
                var handler, items, listLength, i = 0,
                    events = this,
                    stack = events[STACK],
                    handlers = events[HANDLERS],
                    list = handlers[name],
                    removeList = events[REMOVE_QUEUE],
                    running = events.running,
                    cached = running[name],
                    stopped = evnt[PROPAGATION_IS_STOPPED];
                // make sure setup is proper
                if (cached || stopped || !list || !list[LENGTH]()) {
                    return;
                }
                running[name] = BOOLEAN_TRUE;
                items = events.subset(list.unwrap(), evnt);
                listLength = items[LENGTH];
                for (; i < listLength && !stopped && !list.scrubbed; i++) {
                    handler = items[i];
                    if (!handler.disabled && events.queue(stack, handler, evnt)) {
                        handler.fn(evnt);
                        stopped = !!evnt[IMMEDIATE_PROP_IS_STOPPED];
                        events.unQueue(stack, handler, evnt);
                    }
                }
                running[name] = !!cached;
                if (!stack[LENGTH]() && removeList[LENGTH]()) {
                    removeList.each(events.detach, events);
                    removeList.reset();
                }
                if (stopped) {
                    events.cancelled(stack, evnt, i);
                }
                evnt.finished();
                return evnt.returnValue;
            },
            subset: function (list) {
                return list;
            }
        }, BOOLEAN_TRUE);
    app.defineDirective(EVENTS, factories.EventsDirective[CONSTRUCTOR]);
});