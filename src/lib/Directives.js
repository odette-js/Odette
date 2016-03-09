app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        // hash = '_directivesHash',
        returnsNull = returns(NULL);
    factories.Extendable.extend('Directive', {
        directive: function (name) {
            var that = this;
            return (that[name] = that[name] || directiveMod('creation', that, name));
        },
        directiveDestruction: function (name) {
            var result = directiveMod('destruction', this, name);
            delete this[name];
            return result;
        }
    }, BOOLEAN_TRUE);
    var directives = {
        creation: {},
        destruction: {}
    };
    app.defineDirective = function (name, creation, destruction_) {
        var err = (!isString(name) && exception({
            message: 'directives must be registered with a string for a name'
        })) || (!isFunction(creation)) && exception({
            message: 'directives must be registered with both create and destroy functions'
        });
        var destruction = isFunction(destruction_) ? destruction_ : returnsNull;
        var alreadyCreated = directives.creation[name];
        directives.creation[name] = alreadyCreated || creation;
        directives.destruction[name] = directives.destruction[name] || destruction;
        return !alreadyCreated;
    };
    app.extendDirective = function (oldName, newName, handler_, destruction_) {
        var destruction = destruction_ || returnsThird;
        var handler = handler_ || returnsThird;
        var oldDirective = directives.creation[oldName] || exception({
            message: 'directives must exist before they can be extended'
        });
        return app.defineDirective(newName, function (instance, name, third) {
            var directive = directives.creation[oldName](instance, name, third);
            return handler(instance, name, directive);
        }, function (instance, name, third) {
            var directive = directives.destruction[oldName](instance, name, third);
            return destruction(instance, name, directive);
        });
    };
    var returnsThird = function (one, two, three) {
        return three;
    };
    var directiveMod = function (key, instance, name) {
        var Handler = (instance['directive:' + key + COLON + name] || directives[key][name] || noop);
        return new Handler(instance, name);
    };
    var parody = function (directive, method) {
        return function (one, two, three) {
            return this.directive(directive)[method](one, two, three);
        };
    };
    var iterate = function (directive, method) {
        return function (list) {
            var instance = this,
                dir = instance.directive(directive);
            duff(list, dir[method], dir);
            return instance;
        };
    };
    var parodyCheck = function (directive, method) {
        return function (one, two, three) {
            var directiveInstance;
            return (directiveInstance = this[directive]) && directiveInstance[method](one, two, three);
        };
    };
    _.exports({
        directives: {
            parody: parody,
            parodyCheck: parodyCheck,
            iterate: iterate
        }
    });
});