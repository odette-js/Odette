var PROPAGATION = 'propagation',
    UPCASED_STOPPED = 'Stopped',
    PASSED_DATA = 'passedData',
    PARENT = 'parent',
    DEFAULT_PREVENTED = 'defaultPrevented',
    PROPAGATION_HALTED = PROPAGATION + 'Halted',
    PROPAGATION_STOPPED = PROPAGATION + UPCASED_STOPPED,
    event_incrementer = 1,
    listeningCounter = 0,
    noop = require('./lib/utils/function/noop'),
    returnsTrue = require('./lib/utils/returns/true'),
    Directive = require('./lib/directive'),
    Collection = require('./lib/Collection'),
    toFunction = require('./lib/utils/to/function'),
    bind = require('./lib/utils/function/bind'),
    SyntheticEvent = require('./lib/SyntheticEvent'),
    result = require('./lib/utils/function/result'),
    exception = require('./lib/utils/console').exception,
    bindTo = require('./lib/utils/function/bind-to'),
    forOwn = require('./lib/utils/object/for-own');
module.exports = Directive.extend('Events', {
    cancelled: noop,
    validate: returnsTrue,
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
        return directive;
    },
    attach: function (name, eventObject, modifier) {
        var list, eventsDirective = this,
            handlers = eventsDirective[HANDLERS];
        eventObject.id = ++event_incrementer;
        eventObject.valueOf = returnsId;
        eventObject.context = eventObject.context || eventObject.origin;
        toFunction(modifier)(eventsDirective, eventObject);
        eventObject.fn = bind(eventObject.fn || eventObject.handler, eventObject.context);
        // attach the id to the bound function because that instance is private
        list = handlers[name] = handlers[name] || Collection();
        // attaching name so list can remove itself from hash
        list[NAME] = name;
        // attached so event can remove itself
        eventObject.list = list;
        eventsDirective.add(list, eventObject);
    },
    create: function (target, data, name, options) {
        return SyntheticEvent(data, target, name, options);
    },
    make: function (name, handler, origin) {
        return {
            disabled: false,
            namespace: name && name.split && name.split(COLON)[0],
            name: name,
            handler: handler,
            origin: origin
        };
    },
    seekAndDestroy: function (list, handler, context) {
        var obj, events = this,
            array = list.toArray(),
            i = array.length - 1;
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
        list.removeAt(evnt, index);
    },
    detachCurrent: function () {
        return this.detach(this[STACK].last());
    },
    detach: function (evnt, index) {
        var listeningTo, events = this,
            listening = evnt.listening,
            list = evnt.list,
            disabled = evnt.disabled = true;
        if (evnt.removed) {
            return true;
        }
        evnt.removed = true;
        events.remove(list, evnt, index);
        // disconnect it from the list above it
        // we don't care about deleting here
        // because no one should have access to it.
        delete evnt.list;
        events.wipe(list);
        // check to see if it was a listening type
        if (listening) {
            // if it was then decrement it
            listening.count--;
            // if that is the extent of the listening events, then detach it completely
            if (!listening.count) {
                listeningTo = listening.listeningTo;
                delete listeningTo[listening[TALKER_ID]];
                // listeningTo[listening[TALKER_ID]] = undefined;
            }
        }
        return true;
    },
    wipe: function (list) {
        if (list.length()) {
            return false;
        }
        this.scrub(list);
        return true;
    },
    scrub: function (list) {
        list.scrubbed = true;
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
        return !!((this.handlers[key] && this.handlers[key].length()) || this.proxyStack.length());
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
        if (stopped || !list || !list.length()) {
            return;
        }
        running[name] = true;
        subset = events.subset(list.toArray(), evnt);
        stack_length = stack.length;
        var handler, i = 0,
            subLength = subset.length;
        for (; i < subLength && !stopped; i++) {
            handler = subset[i];
            if (!handler.disabled && events.queue(stack, handler, evnt)) {
                handler.fn(evnt);
                events.unQueue(stack, handler, evnt);
            }
            stopped = !!evnt.is(PROPAGATION_HALTED);
        }
        if (stack_length < stack.length) {
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

function returnsId() {
    return this.id;
}