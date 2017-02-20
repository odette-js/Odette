application.scope().module('LocalStorage', function (module, app, _, factories) {
    var LocalStorage = factories.Directive.extend('LocalStorage', {
        prefix: '',
        constructor: function (win) {
            this.global = win;
            return this;
        },
        get: function (key) {
            return _.parse(this.global.localStorage.getItem(this.prefix + key));
        },
        set: function (key, value) {
            var storage = this;
            intendedObject(key, value, function (key, value) {
                storage.global.localStorage.setItem(storage.prefix + key, _.stringify(value));
            });
            return this;
        },
        clear: function () {
            return this.map(function (value_, key) {
                var value = _.parse(value_);
                this.unset(key);
                return value;
            });
        },
        parse: function () {
            return this.map(_.parse);
        },
        copy: function () {
            return _.parse(_.stringify(this.global.localStorage));
        },
        length: function () {
            return this.global.localStorage.length;
        },
        has: function (key) {
            return this.global.localStorage.key(this.prefix + key) != NULL;
        },
        unset: function (key) {
            this.global.localStorage.removeItem(this.prefix + key);
            return this;
        },
        map: function (parser) {
            return _.map(this.copy(), parser, this);
        },
        each: function (handler) {
            var copy = this.copy();
            _.forOwn(copy, handler, this);
            return copy;
        }
    });
    _.exports({
        storage: LocalStorage(window)
    });
});