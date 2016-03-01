application.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        CHANGE_COUNTER = 'counter',
        DataDirective = factories.Directive.extend('DataDirective', {
            constructor: function () {
                var dataDirective = this;
                dataDirective.current = {};
                dataDirective.changing = {};
                dataDirective.counter = 0;
                return dataDirective;
            },
            set: function (key, newValue) {
                var dataDirective = this,
                    current = dataDirective[CURRENT],
                    oldValue = current[key];
                if (!isEqual(oldValue, newValue)) {
                    current[key] = newValue;
                    return BOOLEAN_TRUE;
                }
                return BOOLEAN_FALSE;
            },
            get: function (key) {
                return this[CURRENT][key];
            },
            unset: function (key) {
                return delete this[CURRENT][key];
            },
            reset: function (hash) {
                this[CURRENT] = hash;
                // this.counter = 0;
            },
            setDeep: function (path, value) {
                var previous, dataDirective = this,
                    current = dataDirective[CURRENT];
                duff(path, function (key, index) {
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
                    model[DISPATCH_EVENT](CHANGE, dataDirective[PREVIOUS]);
                    dataDirective[PREVIOUS] = {};
                    dataDirective.changing = {};
                }
            },
            getDeep: function () {},
            has: function (key) {
                return this.current[key] != NULL;
            },
            each: function (fn) {
                return _.each(this[CURRENT], fn, this);
            }
        }, BOOLEAN_TRUE);
    app.defineDirective(DATA_MANAGER, DataDirective[CONSTRUCTOR]);
});