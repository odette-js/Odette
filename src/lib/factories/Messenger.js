var Directive = require('./lib/directives'),
    Promise = require('./lib/promise'),
    intendedApi = require('./lib/utils/intended-api'),
    isPromise = require('./lib/utils/is/promise'),
    bind = require('./lib/utils/function/bind'),
    isFunction = require('./lib/utils/is/function'),
    Messenger = module.exports = Directive.factory('Messenger', function () {
        var messenger = this,
            responders = {},
            callers = {};
        messenger.call = function (key, arg) {
            return callers && callers[key] && callers[key](arg);
        };
        messenger.answer = intendedApi(function (key, handler) {
            return callers && (callers[key] = bind(isFunction(handler) ? handler : returns(handler), null));
        });
        messenger.request = function (key, arg) {
            return (responders && responders[key]) ? responders[key](arg) : Promise.reject();
        };
        messenger.respond = intendedApi(function (key, handler) {
            return responders && (responders[key] = function (arg) {
                var result;
                return isPromise(result = handler()) ? result : Promise.resolve(result);
            });
        });
        messenger.destroy = function () {
            callers = responders = undefined;
            this.mark('destroyed');
        };
    });