var toFunction = require('./lib/utils/to/function');
var isString = require('./lib/utils/is/string');
var exception = require('./lib/utils/console').exception;
var isFunction = require('./lib/utils/is/function');
var isStrictlyEqual = require('./lib/utils/is/strictly-equal');
module.exports = function () {
    var globalDirectives = {
        creation: {},
        destruction: {}
    };
    return {
        define: defineDirective,
        extend: extendDirective,
        get: getDirective,
        replace: replaceDirective
    };

    function getDirective(name) {
        return globalDirectives.creation[name];
    }

    function defineDirective(name, creation, destruction_, directives_) {
        var alreadyCreated, directives = directives_ || globalDirectives,
            err = (!isString(name) && exception('directives must be registered with a string for a name')) || (!isFunction(creation)) && exception('directives must be registered with at least a create function'),
            newcreated = directives.creation[name] = (alreadyCreated = directives.creation[name]) || creation;
        directives.destruction[name] = directives.destruction[name] || destruction_;
        // returns whether or not that directive is new or not
        return isStrictlyEqual(newcreated, creation);
    }

    function replaceDirective(oldName, creation_, destruction_, directives_) {}

    function extendDirective(oldName, newName, handler_, destruction_, directives_) {
        var directives = directives_ || globalDirectives,
            Destruction = destruction_ || returnsThird,
            Handler = handler_ || returnsThird,
            oldDirective = getDirective(directives, oldName) || exception('directives must exist before they can be extended');
        return defineDirective(newName, function (instance, name, third) {
            return new Handler(instance, name, new directives.creation[oldName](instance, name, third));
        }, function (instance, name, third) {
            return Destruction(instance, name, directives.destruction[oldName](instance, name, third));
        });
    }
};