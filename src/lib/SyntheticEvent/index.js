var COLON = ':',
    listeningCounter = 0,
    event_incrementer = 1,
    ACTIONS = 'actions',
    now = require('./lib/utils/performance/now'),
    merge = require('./lib/utils/object/merge'),
    isObject = require('./lib/utils/is/object'),
    capitalize = require('./lib/utils/string/capitalize'),
    PROPAGATION = 'propagation',
    UPCASED_STOPPED = 'Stopped',
    PASSED_DATA = 'passedData',
    DEFAULT_PREVENTED = 'defaultPrevented',
    PROPAGATION_HALTED = PROPAGATION + 'Halted',
    PROPAGATION_STOPPED = PROPAGATION + UPCASED_STOPPED,
    IMMEDIATE_PROP_STOPPED = 'immediate' + capitalize(PROPAGATION) + UPCASED_STOPPED,
    Directive = require('./lib/directive');
module.exports = Directive.extend('SyntheticEvent', {
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
        return arguments.length ? this.set(datum) : this[PASSED_DATA];
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
        this[DEFAULT_PREVENTED] = true;
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
        if (evnt.defaultIsPrevented()) {
            return;
        }
        if ((actions = evnt[ACTIONS])) {
            actions.call(evnt);
        }
    }
});