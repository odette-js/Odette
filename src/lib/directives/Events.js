var ACTIONS = 'actions',
    PROPAGATION = 'propagation',
    UPCASED_STOPPED = 'Stopped',
    PASSED_DATA = 'passedData',
    DEFAULT_PREVENTED = 'defaultPrevented',
    PROPAGATION_HALTED = PROPAGATION + 'Halted',
    PROPAGATION_STOPPED = PROPAGATION + UPCASED_STOPPED,
    IMMEDIATE_PROP_STOPPED = 'immediate' + capitalize(PROPAGATION) + UPCASED_STOPPED;
app.scope(function (app) {
    var event_incrementer = 1,
        listeningCounter = 0,
        returnsId = returns.id = function () {
            return this.id;
        },
        ObjectEvent = factories.ObjectEvent = factories.Directive.extend('ObjectEvent', {
            constructor: function (data, target, name, options, when) {
                var evnt = this;
                evnt.unmark(PROPAGATION_HALTED);
                evnt.unmark(PROPAGATION_STOPPED);
                evnt.unmark(IMMEDIATE_PROP_STOPPED);
                evnt[ORIGIN] = target;
                evnt[NAME] = name;
                evnt[TYPE] = name.split(COLON)[0];
                evnt.timestamp = now();
                evnt.timeStamp = when || evnt.timestamp;
                evnt[PASSED_DATA] = {};
                evnt.data(data);
                if (options) {
                    merge(evnt, options);
                }
                return evnt;
            },
            toJSON: function () {
                return this.data();
            },
            isStopped: function () {
                return this.is(PROPAGATION_STOPPED) || this.is(IMMEDIATE_PROP_STOPPED);
            },
            data: function (datum) {
                return arguments[LENGTH] ? this.set(datum) : this[PASSED_DATA];
            },
            get: function (key) {
                return this[PASSED_DATA][key];
            },
            set: function (data) {
                var evnt = this;
                evnt[PASSED_DATA] = isObject(data) ? data : {};
                return evnt;
            },
            stopImmediatePropagation: function () {
                this.stopPropagation();
                this.mark(IMMEDIATE_PROP_STOPPED);
                this.mark(PROPAGATION_HALTED);
            },
            stopPropagation: function () {
                this.mark(PROPAGATION_STOPPED);
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
                evnt.mark(FINISHED);
                // evnt.isFinished = BOOLEAN_FALSE;
                if (evnt.defaultIsPrevented()) {
                    return;
                }
                if ((actions = evnt[ACTIONS])) {
                    actions.call(evnt);
                }
            }
        }),
        EventsManager = factories.EventsManager = factories.Directive.extend('EventsManager', {
            cancelled: _.noop,
            validate: returns(BOOLEAN_TRUE),
            constructor: function (target) {
                var directive = this;
                directive.target = target;
                directive.listenId = 'l' + (++listeningCounter);
                directive.handlers = {};
                directive.listeningTo = {};
                directive.running = {};
                directive.queued = {};
                directive.stack = Collection();
                directive.removeQueue = Collection();
                directive.proxyStack = Collection();
                directive.proxyStack.unmark('dirty');
                return directive;
            },
            attach: function (name, eventObject, modifier) {
                var list, eventsDirective = this,
                    handlers = eventsDirective[HANDLERS];
                eventObject.id = ++event_incrementer;
                eventObject.valueOf = returnsId;
                eventObject.context = eventObject.context || eventObject.origin;
                toFunction(modifier)(eventsDirective, eventObject);
                // if (modifier && isFunction(modifier)) {
                //     modifier(eventsDirective, eventObject);
                // }
                // attach the id to the bound function because that instance is private
                list = handlers[name] = handlers[name] || Collection();
                // attaching name so list can remove itself from hash
                list[NAME] = name;
                if (list.find(function (evnt) {
                        return evnt.handler === eventObject.handler && evnt.origin === eventObject.origin;
                    })) {
                    return;
                }
                eventObject.fn = eventObject.fn ? eventObject.fn : bind(eventObject.handler, eventObject.context);
                // attached so event can remove itself
                eventObject.list = list;
                eventsDirective.add(list, eventObject);
            },
            create: function (target, data, name, options) {
                return ObjectEvent(data, target, name, options);
            },
            make: function (name, handler, origin) {
                return {
                    disabled: BOOLEAN_FALSE,
                    namespace: name && name.split && name.split(COLON)[0],
                    name: name,
                    handler: handler,
                    origin: origin
                };
            },
            seekAndDestroy: function (list, handler, context) {
                var obj, events = this,
                    array = list.toArray(),
                    i = array[LENGTH] - 1;
                for (; i >= 0; i--) {
                    obj = array[i];
                    if (!obj.disabled && (!handler || obj.handler === handler) && (!context || obj.context === context)) {
                        events.detach(obj, i);
                    }
                }
            },
            nextBubble: function (start) {
                return result(start, PARENT);
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
                        exception('bubbling discerners must return a different object each time it is run');
                    }
                }
                forEach(list, function (target) {
                    target[DISPATCH_EVENT](evnt, data, options);
                });
                return start;
            },
            add: function (list, evnt) {
                list.push([evnt]);
            },
            remove: function (list, evnt, index) {
                list.removeAt(evnt, index, index === UNDEFINED ? list.indexOf(evnt) : index);
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
                // we don't care about deleting here
                // because no one should have access to it.
                evnt.list = UNDEFINED;
                events.wipe(list);
                // check to see if it was a listening type
                if (listening) {
                    // if it was then decrement it
                    listening.count--;
                    // if that is the extent of the listening events, then detach it completely
                    if (!listening.count) {
                        listeningTo = listening.listeningTo;
                        delete listeningTo[listening[TALKER_ID]];
                        // listeningTo[listening[TALKER_ID]] = UNDEFINED;
                    }
                }
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
                return forOwn(this.handlers, bindTo(this.scrub, this));
            },
            queue: function (stack, handler, evnt) {
                return stack.toArray().push(handler);
            },
            unQueue: function (stack, handler, evnt) {
                return stack.pop();
            },
            has: function (key) {
                return !!((this.handlers[key] && this.handlers[key][LENGTH]()) || this.proxyStack[LENGTH]());
            },
            handlerQueue: function (name) {
                return this.handlers[key] || Collection();
            },
            dispatch: function (name, evnt) {
                var subset, stack_length, events = this,
                    stack = events[STACK],
                    handlers = events[HANDLERS],
                    list = handlers[name],
                    running = events.running,
                    // prevents infinite loops
                    cached = running[name],
                    stopped = evnt.is(PROPAGATION_STOPPED),
                    bus = events.proxyStack;
                // make sure setup is proper
                if (cached) {
                    console.error('cannot stack events coming from the same object');
                    return;
                }
                if (stopped || !list || !list[LENGTH]()) {
                    return;
                }
                running[name] = BOOLEAN_TRUE;
                subset = events.subset(list.toArray(), evnt);
                stack_length = stack[LENGTH];
                var handler, i = 0,
                    subLength = subset[LENGTH];
                for (; i < subLength && !stopped; i++) {
                    handler = subset[i];
                    if (!handler.disabled && events.queue(stack, handler, evnt)) {
                        wraptry(function () {
                            handler.fn(evnt);
                        }, console.error);
                        events.unQueue(stack, handler, evnt);
                    }
                    stopped = !!evnt.is(PROPAGATION_HALTED);
                }
                if (stack_length < stack[LENGTH]) {
                    events.unQueue(stack, handler, evnt);
                }
                if (stopped) {
                    events.cancelled(stack, evnt);
                } else {
                    bus.forEachCall('run', evnt);
                }
                evnt.finished();
                running[name] = !!cached;
                return evnt.returnValue;
            },
            subset: function (list) {
                return list.slice(0);
            },
            addBus: function (key, target, prefix, filter) {
                var bus, eventer = this,
                    proxyStack = eventer.proxyStack;
                proxyStack.get(ID, key, function () {
                    if (eventer.target === target) {
                        exception('bus target cannot be the same as delegated target');
                    }
                    proxyStack.push({
                        target: target,
                        prefix: prefix || EMPTY_STRING,
                        filter: filter || returnsTrue,
                        run: function (evnt) {
                            if (!this.filter(evnt)) {
                                return;
                            }
                            this.target[DISPATCH_EVENT](this.prefix ? (this.prefix + evnt.name) : evnt.name, evnt);
                        }
                    });
                });
                return this;
            },
            removeBus: function (key) {
                var eventer = this,
                    proxyStack = eventer.proxyStack;
                if ((bus = proxyStack.drop(ID, key))) {
                    proxyStack.remove(bus);
                    bus.filter = returnsFalse;
                }
                return !!bus;
            }
        });
    app.defineDirective(EVENT_MANAGER, factories.EventsManager[CONSTRUCTOR]);
});