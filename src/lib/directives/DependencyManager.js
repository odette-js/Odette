var DependencyManager = Collection.extend('DependencyManager', {
    constructor: function (target) {
        this.target = target;
        this[CONSTRUCTOR + COLON + COLLECTION]();
        return this;
    },
    check: function () {
        var rejection, deps = this;
        if (!deps.length()) {
            return this;
        }
        if (!deps.find(function (promise) {
                if (promise.is('rejected')) {
                    rejection = BOOLEAN_TRUE;
                }
                if (!promise.is('fulfilled')) {
                    return promise;
                }
            })) {
            if (rejection) {
                deps.failed();
            }
            deps.reset();
            deps.finished();
        } else if (rejection) {
            deps.failed();
        }
    },
    failed: function () {
        this.target.dispatchEvent('dependencies:failed');
    },
    finished: function () {
        this.target.dispatchEvent('dependencies:finished');
    },
    depend: function (promises) {
        var deps = this,
            registry = deps.directive(REGISTRY);
        Collection(promises).each(function (promise) {
            if (deps.add(Promise(promise))) {
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