app.scope(function (app) {
    var CHANGE_COUNTER = 'counter',
        DataManager = factories[DATA_MANAGER] = factories.Directive.extend(DATA_MANAGER, {
            constructor: function () {
                var dataDirective = this;
                dataDirective[CURRENT] = {};
                dataDirective.previous = {};
                dataDirective[CHANGING] = {};
                dataDirective[CHANGE_COUNTER] = 0;
                return dataDirective;
            },
            set: function (key, newValue) {
                var dataDirective = this,
                    current = dataDirective[CURRENT];
                if (!isEqual(current[key], newValue)) {
                    dataDirective.previous[key] = current[key];
                    dataDirective[CURRENT][key] = newValue;
                    return BOOLEAN_TRUE;
                }
                return BOOLEAN_FALSE;
            },
            get: function (key) {
                return this[CURRENT][key];
            },
            clone: function () {
                return clone(this[CURRENT]);
            },
            unset: function (key) {
                var current = this[CURRENT],
                    previous = current[key];
                return (delete current[key]) && previous !== UNDEFINED;
            },
            reset: function (hash) {
                this[CURRENT] = hash || {};
                return this;
            },
            increment: function () {
                this[CHANGE_COUNTER] += 1;
                return this;
            },
            decrement: function () {
                this[CHANGE_COUNTER] -= 1;
                return this;
            },
            static: function () {
                return !this[CHANGE_COUNTER];
            },
            finish: function () {
                this[PREVIOUS] = {};
                this[CHANGING] = {};
                return this;
            },
            reach: function (key) {
                var lastkey, previous, dataDirective = this,
                    current = dataDirective[CURRENT];
                return duff(toArray(key, PERIOD), function (key, index, path) {
                    var no_more = index === path[LENGTH];
                    lastkey = key;
                    if (!no_more) {
                        current = isObject(current[key]) ? current[key] : {};
                    }
                }) && (isString(lastkey) ? UNDEFINED : current[lastkey]);
            },
            has: function (key) {
                return this[CURRENT][key] !== UNDEFINED;
            },
            each: function (fn) {
                return each(this[CURRENT], fn, this);
            }
        });
    app.defineDirective(DATA_MANAGER, DataManager[CONSTRUCTOR]);
});