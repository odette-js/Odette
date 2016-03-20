app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        STATUS = 'StatusMarker',
        STATUSES = 'statuses',
        directives = {
            creation: {},
            destruction: {}
        },
        returnsNull = returns(NULL),
        returnsObject = function () {
            return {};
        },
        returnsThird = function (one, two, three) {
            return three;
        },
        parody = function (directive, method) {
            return function (one, two, three) {
                return this.directive(directive)[method](one, two, three);
            };
        },
        iterate = function (directive, method) {
            return function (list) {
                var instance = this,
                    dir = instance.directive(directive);
                duff(list, dir[method], dir);
                return instance;
            };
        },
        checkParody = function (directive, method, defaultValue) {
            var defaultIsFunction = isFunction(defaultValue);
            return function (one, two, three, four, five, six) {
                var item = this;
                return item[directive] ? item[directive][method](one, two, three, four, five, six) : (defaultIsFunction ? defaultValue(item) : defaultValue);
            };
        },
        defineDirective = function (name, creation, destruction_) {
            var alreadyCreated, err = (!isString(name) && exception({
                message: 'directives must be registered with a string for a name'
            })) || (!isFunction(creation)) && exception({
                message: 'directives must be registered with at least a create function'
            });
            directives.creation[name] = (alreadyCreated = directives.creation[name]) || creation;
            directives.destruction[name] = directives.destruction[name] || destruction_;
            // returns whether or not that directive is new or not
            return !alreadyCreated;
        },
        extendDirective = function (oldName, newName, handler_, destruction_) {
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
        },
        Directive = factories.Extendable.extend('Directive', {
            mark: parody(STATUS, 'mark'),
            unmark: parody(STATUS, 'unmark'),
            remark: parody(STATUS, 'remark'),
            is: checkParody(STATUS, 'is', BOOLEAN_FALSE),
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
        }, BOOLEAN_TRUE),
        StatusMarker = factories.Extendable.extend(STATUS, {
            constructor: function () {
                this[STATUSES] = {};
                return this;
            },
            has: function (status) {
                return this[STATUSES][status] !== UNDEFINED;
            },
            mark: function (status) {
                this[STATUSES][status] = BOOLEAN_TRUE;
            },
            unmark: function (status) {
                this[STATUSES][status] = BOOLEAN_FALSE;
            },
            remark: function (status, direction) {
                this[STATUSES][status] = direction === UNDEFINED ? !this[STATUSES][status] : !!direction;
            },
            is: function (status) {
                return this[STATUSES][status];
            },
            isNot: function (status) {
                return !this.is(status);
            }
        });
    defineDirective(STATUS, StatusMarker[CONSTRUCTOR]);
    app.defineDirective = defineDirective;
    app.extendDirective = extendDirective;
    _.exports({
        directives: {
            parody: parody,
            checkParody: checkParody,
            iterate: iterate
        }
    });
});
var directives = _.directives;