var REGISTRY = 'Registry',
    Registry = factories[REGISTRY] = factories.Directive.extend(REGISTRY, {
        constructor: function (target) {
            this.target = target;
            this.reset();
            return this;
        },
        get: function (category, id, method) {
            var registry = this,
                cat = registry.register[category],
                item = cat && cat[id];
            if (item === UNDEFINED && method) {
                item = method(registry, category, id);
                registry.keep(category, id, item);
            }
            return item;
        },
        keep: function (category, id, value) {
            var register = this.register,
                cat = register[category] = register[category] || {};
            if (value === UNDEFINED) {
                delete cat[id];
            } else {
                cat[id] = value;
            }
            return this;
        },
        ungroup: function (category) {
            return this.group(category, {});
        },
        ungroups: function (categories) {
            return map(toArray(categories), this.ungroup, this);
        },
        group: function (category, setter) {
            var register = this.register;
            return (register[category] = setter || register[category] || {});
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
Registry.autoCreateOnAccess = Registry[CONSTRUCTOR].autoCreateOnAccess = function (category, item, method) {
    return function () {
        return this.directive(REGISTRY).get(category, item, method);
    };
};
app.defineDirective(REGISTRY, Registry[CONSTRUCTOR]);