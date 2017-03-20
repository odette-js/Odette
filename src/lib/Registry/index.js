var REGISTRY = 'Registry',
    Directive = require('./lib/directive'),
    isUndefined = require('./lib/utils/is/undefined'),
    map = require('./lib/utils/array/map'),
    toArray = require('./lib/utils/to/array'),
    bindTo = require('./lib/utils/function/bind-to'),
    Registry = module.exports = Directive.extend(REGISTRY, {
        constructor: function (target) {
            this.target = target;
            this.reset();
            return this;
        },
        get: function (category, id, method) {
            var registry = this,
                cat = registry.register[category],
                item = cat && cat[id];
            if (isUndefined(item) && method) {
                item = method(registry, category, id);
                registry.keep(category, id, item);
            }
            return item;
        },
        keep: function (category, id, value) {
            var register = this.register,
                cat = register[category] = register[category] || {};
            if (isUndefined(value)) {
                delete cat[id];
            } else {
                cat[id] = value;
            }
            return this;
        },
        dropGroup: function (category) {
            return this.group(category, {});
        },
        dropGroups: function (categories) {
            return mapValues(toArray(categories), bindTo(this.dropGroup, this));
        },
        group: function (category, setter) {
            var register = this.register,
                previous = register[category];
            register[category] = setter || previous || {};
            return previous;
        },
        swap: function (category, id, value) {
            var cached = this.get(category, id);
            this.keep(category, id, value);
            return cached;
        },
        drop: function (category, id) {
            return this.swap(category, id);
        },
        reset: function (registry) {
            var cached = this.register;
            this.register = registry || {};
            return cached;
        }
    });
Registry.autoCreate = require('./lib/Registry/auto-create');