var STATUS = 'Status',
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
        var alreadyCreated, err = (!isString(name) && exception('directives must be registered with a string for a name')) || (!isFunction(creation)) && exception('directives must be registered with at least a create function');
        directives.creation[name] = (alreadyCreated = directives.creation[name]) || creation;
        directives.destruction[name] = directives.destruction[name] || destruction_;
        // returns whether or not that directive is new or not
        return !alreadyCreated;
    },
    extendDirective = function (oldName, newName, handler_, destruction_) {
        var Destruction = destruction_ || returnsThird;
        var Handler = handler_ || returnsThird;
        var oldDirective = directives.creation[oldName] || exception('directives must exist before they can be extended');
        return app.defineDirective(newName, function (instance, name, third) {
            var directive = new directives.creation[oldName](instance, name, third);
            return new Handler(instance, name, directive);
        }, function (instance, name, third) {
            var directive = directives.destruction[oldName](instance, name, third);
            return Destruction(instance, name, directive);
        });
    },
    Directive = factories.Directive = factories.Extendable.extend('Directive', {
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
    }),
    Status = factories.Status = factories.Directive.extend(STATUS, {
        constructor: function () {
            this[STATUSES] = {};
            return this;
        },
        has: function (status) {
            return this[STATUSES][status] !== UNDEFINED;
        },
        mark: function (status) {
            var previous = this[STATUSES][status];
            this[STATUSES][status] = BOOLEAN_TRUE;
            return previous !== BOOLEAN_TRUE;
        },
        unmark: function (status) {
            var previous = this[STATUSES][status];
            this[STATUSES][status] = BOOLEAN_FALSE;
            return previous !== BOOLEAN_FALSE;
        },
        remark: function (status, direction) {
            var statusObject = this;
            var previous = statusObject[STATUSES][status];
            var result = statusObject[STATUSES][status] = direction === UNDEFINED ? !statusObject[STATUSES][status] : !!direction;
            return previous !== result;
        },
        is: function (status) {
            return !!this[STATUSES][status];
        },
        isNot: function (status) {
            return !this[STATUSES][status];
        }
    });
defineDirective(STATUS, Status[CONSTRUCTOR]);
app.defineDirective = defineDirective;
app.extendDirective = extendDirective;
_.publicize({
    directives: {
        parody: parody,
        checkParody: checkParody,
        iterate: iterate
    }
});