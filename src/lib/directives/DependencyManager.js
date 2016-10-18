var DependencyManager = Collection.extend('DependencyManager', {
    constructor: function (target) {
        this.target = target;
        this[CONSTRUCTOR + COLON + COLLECTION]();
        return this;
    },
    check: function () {
        var deps = this;
        if (!deps.length()) {
            return this;
        }
        if (!deps.find(function (promise) {
                if (!promise.is('resolved')) {
                    return promise;
                }
            })) {
            deps.reset();
            deps.target.dispatchEvent('dependencies:finished');
        }
    },
    depend: function (promises) {
        var deps = this,
            registry = deps.directive(REGISTRY);
        Collection(promises).each(function (promise) {
            if (deps.add(promise)) {
                promise.then(registry.get('prebound', 'check', function () {
                    return bind(deps.check, deps);
                }));
            }
        });
        deps.check();
        return deps;
    },
    stopDepending: function (promises) {
        var deps = this;
        if (Collection(promises).find(function (promise) {
                if (deps.remove(promise)) {
                    return promise;
                }
            })) {
            deps.check();
        }
        return deps;
    }
});
app.defineDirective('DependencyManager', DependencyManager);