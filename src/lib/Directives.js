app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        returnsNull = returns(NULL),
        returnsObject = function () {
            return {};
        };
    factories.Extendable.extend('Directive', {
        directive: function (name) {
            var Handler, directive, that = this;
            if ((directive = that[name])) {
                return directive;
            }
            Handler = (that['directive:creation:' + name] || directives.creation[name] || returnsObject);
            that[name] = new Handler(that, name);
            return that[name];
        },
        directiveDestruction: function (name) {
            var result = (directives.destruction[name] || returnsNull)(this[name], this, name);
            delete this[name];
            return result;
        }
    }, BOOLEAN_TRUE);
    var directives = {
        creation: {},
        destruction: {}
    };
    app.defineDirective = function (name, creation, destruction_) {
        var alreadyCreated, err = (!isString(name) && exception({
            message: 'directives must be registered with a string for a name'
        })) || (!isFunction(creation)) && exception({
            message: 'directives must be registered with at least a create function'
        });
        directives.creation[name] = (alreadyCreated = directives.creation[name]) || creation;
        directives.destruction[name] = directives.destruction[name] || destruction_;
        // returns whether or not that directive is new or not
        return !alreadyCreated;
    };
    app.extendDirective = function (oldName, newName, handler_, destruction_) {
        var Destruction = destruction_ || returnsThird;
        var Handler = handler_ || returnsThird;
        var oldDirective = directives.creation[oldName] || exception({
            message: 'directives must exist before they can be extended'
        });
        return app.defineDirective(newName, function (instance, name, third) {
            var directive = directives.creation[oldName](instance, name, third);
            return new Handler(instance, name, directive);
        }, function (instance, name, third) {
            var directive = directives.destruction[oldName](instance, name, third);
            return new Destruction(instance, name, directive);
        });
    };
    var returnsThird = function (one, two, three) {
        return three;
    };
    // var directiveMod = function (key, instance, name) {
    //     var Handler = (instance['directive:' + key + COLON + name] || directives[key][name] || noop);
    //     return new Handler(instance, name);
    // };
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
    var checkParody = function (directive, method, defaultValue) {
        return function (one, two, three, four, five, six) {
            return this[directive] ? this[directive][method](one, two, three, four, five, six) : defaultValue;
        };
    };
    // var parodyRead = function (directive, attribute, defaultValue) {
    //     return function () {
    //         return this[directive] === UNDEFINED ? defaultValue : this[directive][attribute];
    //     };
    // };
    _.exports({
        directives: {
            parody: parody,
            checkParody: checkParody,
            // parodyRead: parodyRead,
            iterate: iterate
        }
    });
});