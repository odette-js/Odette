app.scope(function (app) {
    var CHANGE_COUNTER = 'counter',
        CHANGE_TO = 'changeTo',
        DataManager = factories[DATA_MANAGER] = factories.Directive.extend(DATA_MANAGER, {
            constructor: function () {
                var dataDirective = this;
                dataDirective[CURRENT] = {};
                dataDirective.finish();
                dataDirective[CHANGE_COUNTER] = 0;
                return dataDirective;
            },
            set: function (key, newValue) {
                var dataDirective = this,
                    current = dataDirective[CURRENT];
                if (!isEqual(current[key], newValue)) {
                    dataDirective.previous[key] = current[key];
                    dataDirective[CURRENT][key] = dataDirective.changes()[key] = newValue;
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
            finish: function () {
                var changeto = this.changes();
                this[PREVIOUS] = {};
                this[CHANGE_TO] = {};
                return changeto;
            },
            changes: function () {
                return this[CHANGE_TO];
            },
            changing: function (key) {
                return has(this.changes(), key);
            },
            unset: function (key) {
                var current = this[CURRENT],
                    previous = current[key];
                this.changes()[key] = UNDEFINED;
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
