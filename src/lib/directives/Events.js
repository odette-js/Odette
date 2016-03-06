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
        EventsDirective = factories.Directive.extend('EventsDirective', {
            constructor: function () {
                var eventsDirective = this;
                eventsDirective.listenId = 'l' + (++listeningCounter);
                eventsDirective.handlers = {};
                eventsDirective.listeningTo = {};
                eventsDirective.running = {};
                eventsDirective.stack = Collection(BOOLEAN_TRUE, BOOLEAN_TRUE);
                eventsDirective.removeQueue = Collection(BOOLEAN_TRUE, BOOLEAN_TRUE);
                return eventsDirective;
            },
            destroy: function () {},
            attach: function (name, eventObject) {
                var list, eventsDirective = this,
                    handlers = eventsDirective[HANDLERS],
                    ret = !handlers && exception({
                        message: 'events directive needs a handler object'
                    });
                eventObject.id = ++event_incrementer;
                eventObject.valueOf = returnsId;
                eventObject.context = eventObject.context || eventObject.origin;
                eventObject.fn = bind(eventObject.fn || eventObject.handler, eventObject.context);
                // attach the id to the bound function because that instance is private
                eventObject.fn[__FN_ID__] = eventObject.id;
                list = handlers[name] = handlers[name] || SortedCollection(BOOLEAN_TRUE, BOOLEAN_TRUE);
                // attaching name so list can remove itself from hash
                list[NAME] = name;
                // attached so event can remove itself
                eventObject.list = list;
                list.add(eventObject);
            },
            detach: function (evnt) {
                var listeningTo, events = this,
                    listening = evnt.listening,
                    list = evnt.list,
                    disabled = evnt.disabled = BOOLEAN_TRUE;
                if (events[STACK][LENGTH]()) {
                    events[REMOVE_QUEUE].add(evnt);
                    return BOOLEAN_FALSE;
                } else {
                    list.remove(evnt);
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
                var handler, listLength, i = 0,
                    events = this,
                    stack = events[STACK],
                    handlers = events[HANDLERS],
                    list = handlers[name],
                    removeList = events[REMOVE_QUEUE],
                    running = events.running,
                    cached = running[name];
                if (cached || evnt[IMMEDIATE_PROP_IS_STOPPED] || !list || !list[LENGTH]()) {
                    return;
                }
                running[name] = BOOLEAN_TRUE;
                list = list.unwrap();
                listLength = list[LENGTH];
                for (; i < listLength && !cached; i++) {
                    handler = list[i];
                    if (!handler.disabled && events.queue(stack, handler, evnt)) {
                        handler.fn(evnt);
                        cached = !!evnt[IMMEDIATE_PROP_IS_STOPPED];
                        events.unQueue(stack, handler, evnt);
                    }
                }
                if (!stack[LENGTH]() && removeList[LENGTH]()) {
                    removeList.duffRight(events.detach, events);
                    removeList.empty();
                }
                if (cached === UNDEFINED) {
                    delete running[name];
                } else {
                    running[name] = cached;
                }
                evnt.finished();
                return evnt.returnValue;
            }
        }, BOOLEAN_TRUE);
    app.defineDirective(EVENTS, factories.EventsDirective[CONSTRUCTOR]);
});