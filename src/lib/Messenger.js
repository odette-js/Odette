var Messenger = factories.Directive.extend('Messenger', {
    constructor: function () {
        var messenger = this,
            hash = {};
        factories.Directive[CONSTRUCTOR].apply(this, arguments);
        messenger.request = function (key, arg, prefix) {
            return hash && hash[key] && hash[key](arg);
        };
        messenger.reply = function (key, handler, prefix) {
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
app.defineDirective('Messenger', Messenger);