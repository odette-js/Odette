var Directive = require('../directives'),
    Promise = require('../promise'),
    _ = require('debit'),
    intendedApi = _.intendedApi,
    isPromise = _.isPromise,
    bind = _.bind,
    isFunction = _.isFunction,
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