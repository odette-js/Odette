application.scope(function (app) {
    var blank, _ = app._,
        factories = _.factories,
        Events = factories.Events,
        result = _.result,
        isFunction = _.isFunction,
        isObject = _.isObject,
        intendedObject = _.intendedObject,
        PARENT = 'parent',
        NAME = 'name',
        basicData = function (basic) {
            return function () {
                return basic;
            };
        },
        messengerHash = {},
        attachToHash = function (key, obj) {
            if (messengerHash[key]) {
                messengerHash[key].destroy();
            }
            obj[NAME] = key;
            messengerHash[key] = obj;
        },
        removeFromHash = function (obj) {
            messengerHash[obj[NAME]] = blank;
        },
        Messenger = factories.Events.extend('Messenger', {
            constructor: function (parent) {
                var ret, scopedHash = {};
                this._getHash = function (key, arg) {
                    return result(scopedHash, key, arg);
                };
                this._setHash = function (key, val) {
                    scopedHash[key] = val;
                };
                ret = isObject(parent) ? this.attachParent(parent) : attachToHash(key, this);
                this.on('before:destroy', function () {
                    var obj = this;
                    if (obj[NAME]) {
                        removeFromHash(obj);
                    }
                });
                return Events.constructor.call(this);
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
                    messenger._setHash(key, bind(handler, this[PARENT] || {}));
                });
                return messenger[PARENT];
            }
        }, true);
    factories.Messenger(app);
});