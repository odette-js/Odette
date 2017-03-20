var DIRECTIVE = 'Directive',
    STATUS = 'status',
    Extendable = require('./lib/Extendable'),
    toFunction = require('./lib/utils/to/function'),
    merge = require('./lib/utils/object/merge'),
    exception = require('./lib/utils/console').exception,
    returnsObject = require('./lib/utils/returns/object'),
    scope = require('./lib/directives/generated');
/**
 * Directives are a powerful way to organize your code, logic, and state of the objects you create during an app's lifespan. Directives allow for the ability to replace large chunks of internal code of classes and completely change an object's behavior. Directives are the most basic
 * @class Directive
 */
module.exports = merge(Extendable.extend('Directive',
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
        is: checkParody(STATUS, 'is', false),
        /**
         * Method for creating and setting directives on the context of the
         * @method
         */
        call: parody('Messenger', 'call'),
        answer: parody('Messenger', 'answer'),
        request: parody('Messenger', 'request'),
        respond: parody('Messenger', 'respond'),
        getDirective: basicSingleArgumentPassthrough(getDirective),
        directive: basicSingleArgumentPassthrough(createDirective),
        destroyDirective: basicSingleArgumentPassthrough(destroyDirective),
        getDirectiveClass: basicSingleArgumentPassthrough(getDirectiveClass)
    }), {
    parody: parody,
    checkParody: checkParody,
    create: createDirective,
    destroy: destroyDirective,
    get: getDirective,
    getClass: getDirectiveClass
});

function basicSingleArgumentPassthrough(method) {
    return function (key) {
        return method(this, key);
    };
}

function parody(directive, method) {
    return function (one, two, three) {
        return this.directive(directive)[method](one, two, three);
    };
}

function setAssociatedHash(origin, hash) {
    origin.directiveInstances = hash;
}

function getAssociatedHash(origin) {
    return origin.directiveInstances;
}

function getDirective(origin, name) {
    return getAssociatedHash(origin)[name];
}

function checkParody(name, method, defaultValue) {
    var defaultFunction = toFunction(defaultValue);
    return function (one, two, three, four, five, six) {
        var direct, item = this;
        return (direct = check(item, name)) ? direct[method](one, two, three, four, five, six) : defaultFunction(item, method);
    };
}

function returnsThird(one, two, three) {
    return three;
}

function destroyDirective(origin, name) {
    var directive, result = null;
    if ((directive = check(origin, name)) && directive.mark('destroying')) {
        var result = (globalDirectives.destruction[name] || returnsNull)(check(origin, name), origin, name);
        delete origin[name];
    }
    return result;
}

function createDirective(origin, name) {
    var Class, handler, directive,
        directiveInstances = origin.directiveInstances;
    if (!directiveInstances) {
        directiveInstances = {};
        setAssociatedHash(origin, directiveInstances);
    }
    if ((directive = directiveInstances[name])) {
        return directive;
    }
    Class = origin.getDirectiveClass(name);
    handler = directiveInstances[name] = new Class(origin, name);
    return handler;
}

function directiveAccessError() {
    exception({
        message: 'Directive must be defined before it can be created.'
    });
}

function getDirectiveClass(origin, name) {
    return origin['directive.' + name] || scope.get(name) || directiveAccessError;
}