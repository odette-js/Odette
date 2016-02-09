application.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        hash = '_directivesHash';
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
        directiveCheck: function (key) {
            return !!(this[hash] && this[hash][key] != NULL);
        }
    }, BOOLEAN_TRUE);
    var directives = {
        creation: {},
        destruction: {}
    };
    app.registerDirective = function (name, creation, destruction) {
        var err = (!isFunction(creation) || !isFunction(destruction)) && exception({
            message: 'directives must be registered with both create and destroy functions'
        });
        directives.creation[name] = directives.creation[name] || creation;
        directives.destruction[name] = directives.destruction[name] || destruction || NULL;
    };
    var directiveMod = function (key, instance, name) {
        return (instance['directive:' + key + ':' + name] || directive[key][name] || noop)(instance, name);
    };
});