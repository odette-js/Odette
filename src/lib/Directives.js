application.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        hash = '_directivesHash';
    factories.Model.extend('Directive', {
        directive: function (key) {
            var that = this,
                directives = that[hash] = that[hash] || {};
            return (directives[key] = directives[key] || bind(that['directive:' + key] || setupDirective, that)(key) || {});
        },
        directiveCheck: function (key) {
            return !!(this[hash] && this[hash][key] !== UNDEFINED);
        }
    }, BOOLEAN_TRUE);
    var directives = {};
    app.registerDirective = function (name, handler) {
        // can't overwrite
        directives[name] = directives[name] || handler;
    };
    var setupDirective = app.setupDirective = function (name) {
        return (directives[name] || noop)();
    };
});