application.scope(function (app) {
    var messengerHash = {},
        basicData = function (basic) {
            return function () {
                return basic;
            };
        },
        attachToHash = function (key, obj) {
            if (messengerHash[key]) {
                messengerHash[key].destroy();
            }
            obj[NAME] = key;
            messengerHash[key] = obj;
        },
        removeFromHash = function (obj) {
            messengerHash[obj[NAME]] = UNDEFINED;
        },
        Messenger = factories.Events.extend('Messenger', {
            constructor: function (options) {
                var ret, scopedHash = {},
                    messenger = factories.Events[CONSTRUCTOR].call(this, options),
                    parent = messenger[PARENT],
                    key = messenger.key;
                messenger._getHash = function (key, arg) {
                    return result(scopedHash, key, arg);
                };
                messenger._setHash = function (key, val) {
                    scopedHash[key] = val;
                };
                ret = isObject(parent) ? messenger.attachParent(parent) : attachToHash(key, messenger);
                messenger.listenTo(parent, 'destroy', messenger.resetEvents);
                messenger.on('destroy', function () {
                    var obj = messenger;
                    if (obj[NAME]) {
                        removeFromHash(obj);
                    }
                });
                return messenger;
            },
            attachParent: function (parent) {
                this[PARENT] = parent;
                parent.message = this;
                return this;
            },
            request: function (key, arg) {
                return this._getHash(key, arg);
            },
            reply: function (key, handler) {
                var messenger = this;
                intendedObject(key, handler, function (key, handler_) {
                    var handler = handler_;
                    if (!isFunction(handler_)) {
                        handler = basicData(handler_);
                    }
                    messenger._setHash(key, bind(handler, messenger[PARENT] || {}));
                });
                return messenger[PARENT];
            }
        }, BOOLEAN_TRUE);
});