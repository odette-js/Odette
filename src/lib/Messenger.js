app.scope(function (app) {
    var request = function (key, arg) {
            return this.hash[key] && this.hash[key](arg);
        },
        returns = function (affection) {
            return function () {
                return affection;
            };
        },
        reply = function (key, handler) {
            var hash = this.hash;
            intendedObject(key, handler, function (key, handler) {
                hash[key] = bind(isFunction(handler) ? handler : returns(handler), NULL);
            });
            return this;
        };
    app.defineDirective('Messenger', function () {
        return {
            hash: {},
            reply: reply,
            request: request
        };
    });
});