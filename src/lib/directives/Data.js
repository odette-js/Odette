app.scope(function (app) {
    var _ = app._,
        periodSplit = splitGen(PERIOD),
        factories = _.factories,
        CHANGE_COUNTER = 'counter',
        CHANGING = 'changing',
        DataDirective = factories.Directive.extend('DataDirective', {
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
            unset: function (key) {
                var current = this[CURRENT];
                var previous = current[key];
                return (delete current[key]) && previous !== UNDEFINED;
            },
            reset: function (hash) {
                this[CURRENT] = hash;
            },
            setDeep: function (path, value) {
                var previous, dataDirective = this,
                    current = dataDirective[CURRENT];
                duff(periodSplit(path), function (key, index, path) {
                    var no_more = index === path[LENGTH] - 1;
                    previous = current;
                    current = no_more ? current[key] : isObject(current[key]) ? current[key] : (previous[key] = {});
                });
                if (previous && !isEqual(current, value)) {
                    previous[key] = value;
                    return BOOLEAN_TRUE;
                }
            },
            digest: function (model, fn) {
                var dataDirective = this;
                dataDirective[CHANGE_COUNTER]++;
                fn();
                dataDirective[CHANGE_COUNTER]--;
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
                }) && isString(lastkey) && current[lastkey];
            },
            has: function (key) {
                return this[CURRENT][key] != NULL;
            },
            each: function (fn) {
                return each(this[CURRENT], fn, this);
            }
        }, BOOLEAN_TRUE);
    app.defineDirective(DATA, DataDirective[CONSTRUCTOR]);
});