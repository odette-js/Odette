application.scope(function (app) {
    var request = function (key, arg) {
            return result(this.hash, key, arg);
        },
        reply = function (key, fn) {
            var hash = this.hash;
            intendedObject(key, fn, function (key, handler) {
                hash[key] = bind(isFunction(handler) ? handler : returns(handler), {});
            });
        };
    app.defineDirective('messenger', function () {
        return {
            hash: {},
            reply: reply,
            request: request
        };
    });
});