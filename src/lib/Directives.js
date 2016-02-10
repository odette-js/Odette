application.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        hash = '_directivesHash',
        returnsNull = returns(NULL);
    factories.Model.extend('Directive', {
        directive: function (name) {
            var that = this,
                directives = that[hash] = that[hash] || {};
            return (directives[name] = directives[name] || directiveMod('creation', that, name));
        },
        destroy: function () {
            return this.directivesDestruction();
        },
        directivesDestruction: function () {
            var that = this;
            return (that[hash] || that) && each(that[hash], function (name) {
                directiveMod('destruction', that, name);
            }) && that;
        },
        checkDirective: function (key) {
            var hashed = this[hash];
            return (!!hashed && hashed[key] != NULL) && hashed[key];
        }
    }, BOOLEAN_TRUE);
    var directives = {
        creation: {},
        destruction: {}
    };
    app.defineDirective = function (name, creation, destruction_) {
        var err = !isFunction(creation) && exception({
            message: 'directives must be registered with both create and destroy functions'
        });
        var destruction = isFunction(destruction_) ? destruction_ : returnsNull;
        directives.creation[name] = directives.creation[name] || creation;
        directives.destruction[name] = directives.destruction[name] || destruction;
    };
    var directiveMod = function (key, instance, name) {
        return (instance['directive:' + key + ':' + name] || directives[key][name] || noop)(instance, name);
    };
    var parody = function (directive, method) {
        return function (one, two, three) {
            return this.directive(directive)[method](one, two, three);
        };
    };
    var iterate = function (directive, method) {
        return function (list) {
            var dir = this.directive(directive);
            duff(list, dir[method], dir);
            return this;
        };
    };
    _.exports({
        directives: {
            parody: parody,
            iterate: iterate
        }
    });
});