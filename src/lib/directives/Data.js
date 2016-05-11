app.scope(function (app) {
    var _ = app._,
        periodSplit = splitGen(PERIOD),
        factories = _.factories,
        CHANGE_COUNTER = 'counter',
        CHANGING = 'changing',
        DataDirective = factories.DataDirective = factories.Directive.extend('DataDirective', {
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
            },
            digest: function (model, handler) {
                var dataDirective = this;
                ++dataDirective[CHANGE_COUNTER];
                handler();
                --dataDirective[CHANGE_COUNTER];
                // this event should only ever exist here
                if (!dataDirective[CHANGE_COUNTER]) {
                    model[DISPATCH_EVENT](CHANGE, dataDirective[CHANGING]);
                    dataDirective[CHANGING] = {};
                    dataDirective.previous = {};
                }
            },
            getDeep: function (key) {
                var lastkey, previous, dataDirective = this,
                    current = dataDirective[CURRENT];
                return duff(periodSplit(key), function (key, index, path) {
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
    app.defineDirective(DATA, DataDirective[CONSTRUCTOR]);
});