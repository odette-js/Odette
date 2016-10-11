var STATUS = 'Status',
    STATUSES = 'statuses',
    DIRECTIVE = 'Directive',
    MESSENGER = 'Messenger',
    directives = {
        creation: {},
        destruction: {}
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
        return directives.creation[name];
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
    directive = function (that, name) {
        var Handler, directive;
        if ((directive = that[name])) {
            return directive;
        }
        Handler = (that['directive:creation:' + name] || directives.creation[name] || returnsObject);
        that[name] = new Handler(that, name);
        return that[name];
    },
    contextDirective = function (name) {
        return directive(this, name);
    },
    /**
     * Directives are a powerful way to organize your code, logic, and state of the objects you create during an app's lifespan. Directives allow for the ability to replace large chunks of internal code of classes and completely change an object's behavior. Directives are the most basic
     * @class Directive
     */
    Directive = factories.Directive = factories.Extendable.extend('Directive',
        /**
         * @lends Directive.prototype
         */
        {
            /**
             * Sets the key passed to true, on the {@link Status} Directive.
             * @method
             * @param {String} key value that you would like to associate with true.
             * @returns {Boolean} True is returned if the value registered is being changed. False is returned if it does not change.
             * @example <caption>In this example the truth variable will have the value true returned to it after the key name has been marked as true on the {@link Status} directive.</caption>
             * var truth = directive.mark("name");
             * @example <caption>When this code is run after the previous example the value set to untruth will be false because the directive has already set the name property on the {@link Status} object as true.</caption>
             * var untruth = directive.mark("name");
             */
            mark: parody(STATUS, 'mark'),
            /**
             * Sets the key passed to false, on the {@link Status} Directive.
             * @method
             * @param {String} key value that you would like to associate with false.
             * @returns {Boolean} True is returned if the value registered is being changed. False is returned if it does not change.
             * @example <caption>In this example the truth variable will have the value true returned to it after the key name has been marked as false on the {@link Status} directive.</caption>
             * var truth = directive.unmark("name");
             * @example <caption>When this code is run after the previous example the value set to untruth will be false because the directive has already set the name property on the {@link Status} object as false.</caption>
             * var untruth = directive.unmark("name");
             */
            unmark: parody(STATUS, 'unmark'),
            /**
             * Acts like a directed toggle for directives to save booleans against.
             * @method
             * @param {String} [key] value that you would like to associate with the directed toggle or the opposite of the current value. If no value is passed then the directive will toggle the value from its current value.
             * @returns {Boolean} True is returned if the value registered is being changed. False is returned if it does not change.
             * @example <caption>In this example the truth variable will have the value true returned to it after the key name has been marked as false on the {@link Status} directive.</caption>
             * var truth = directive.remark("name", true);
             * @example <caption>When this code is run after the previous example the value returned to truth will be true because the directive has now toggled the name property on the {@link Status} object to false.</caption>
             * var truth = directive.remark("name");
             */
            remark: parody(STATUS, 'remark'),
            /**
             * Check the value of the boolean states assocated with the {@link Status} directive on this directive instance and return it as a boolean.
             * @param {String} key property to check for a boolean value.
             * @returns {Boolean}
             * @method
             * @example <caption>This example will return false since the directive object has never had anything marked, remarked, or unmarked at the "created" key.</caption>
             * var status = directive.is("created");
             * @example <caption>After running remark, and directing it to a true value, the is method will return that true value.</caption>
             * directive.remark("created", true);
             * // later
             * var nuStatus = directive.is("created");
             */
            is: checkParody(STATUS, 'is', BOOLEAN_FALSE),
            /**
             * Method for creating and setting directives on the context of the
             * @method
             */
            request: parody('Messenger', 'request'),
            reply: parody('Messenger', 'reply'),
            directive: contextDirective,
            directiveDestruction: function (name) {
                var directive;
                if (!(directive = this[name])) {
                    return NULL;
                }
                if (directive.is('directiveDestroying')) {
                    return NULL;
                }
                directive.mark('directiveDestroying');
                var result = (directives.destruction[name] || returnsNull)(this[name], this, name);
                delete this[name];
                return result;
            }
        }),
    /**
     * Status directive for all of your boolean states.
     * @class Status
     * @extends {Directive}
     */
    Status = factories.Status = Directive.extend(STATUS,
        /**
         * @lends Status.prototype
         * @enum {Function}
         */
        {
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
            /**
             * Acts kind of like a directed toggle for the Directive
             * @method
             * @param {String} key value that you would like to associate with false.
             * @returns {Boolean} True is returned if the value registered is being changed. False is returned if it does not change.
             * @example <caption>In this example the truth variable will have the value true returned to it after the key name has been marked as false on the {@link Status} directive.</caption>
             * var truth = directive.unmark("name");
             * @example <caption>When this code is run after the previous example the value set to untruth will be false because the directive has already set the name property on the {@link Status} object as false.</caption>
             * var untruth = directive.unmark("name");
             */
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
            },
            toJSON: function () {
                return this[STATUSES];
            }
        }),
    Messenger = Directive.extend(MESSENGER, {
        constructor: function (a, b, c, d, e, f) {
            var messenger = this,
                hash = {};
            messenger[CONSTRUCTOR + COLON + DIRECTIVE](a, b, c, d, e, f);
            messenger.request = function (key, arg) {
                return hash && hash[key] && hash[key](arg);
            };
            messenger.reply = function (key, handler) {
                intendedObject(key, handler, function (key, handler) {
                    return hash && (hash[key] = bind(isFunction(handler) ? handler : returns(handler), NULL));
                });
                return messenger;
            };
            messenger.destroy = function () {
                hash = UNDEFINED;
            };
            return messenger;
        }
    });
defineDirective(MESSENGER, Messenger[CONSTRUCTOR]);
defineDirective(STATUS, Status[CONSTRUCTOR]);
app.defineDirective = defineDirective;
app.extendDirective = extendDirective;
_.publicize({
    directives: {
        parody: parody,
        checkParody: checkParody,
        iterate: iterate,
        create: directive,
        all: directives
    }
});