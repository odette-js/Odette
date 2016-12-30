var DEPENDENCY_MANAGER = 'DependencyManager';
var PromiseProxy = function (key) {
    return function (fn) {
        var deps = this,
            target = deps.target;
        return this.directive(REGISTRY).get(INSTANCES, 'finishedPromise', function () {
            return Promise(function (s, f) {
                if (deps.done) {
                    if (deps.erred) {
                        f();
                    } else {
                        s();
                    }
                } else {
                    target.once({
                        'dependencies:failed': f,
                        'dependencies:finished': s
                    });
                }
            });
        })[key](fn);
    };
};
var DependencyManager = Collection.extend(DEPENDENCY_MANAGER, {
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
            deps.finished();
        } else if (rejection) {
            deps.failed();
        }
    },
    then: PromiseProxy('then'),
    catch: PromiseProxy('catch'),
    failed: function () {
        if (this.done) {
            return;
        }
        this.done = BOOLEAN_TRUE;
        this.erred = BOOLEAN_TRUE;
        this.reset();
        this.target.dispatchEvent('dependencies:failed');
    },
    finished: function () {
        if (this.done) {
            return;
        }
        this.done = BOOLEAN_TRUE;
        this.reset();
        this.target.dispatchEvent('dependencies:finished');
    },
    depend: function (promises) {
        var deps = this,
            registry = deps.directive(REGISTRY);
        Collection(promises).forEach(function (promise) {
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
app.defineDirective(DEPENDENCY_MANAGER, DependencyManager);