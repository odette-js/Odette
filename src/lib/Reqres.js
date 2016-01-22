application.scope(function (app) {
    var _ = app._,
        result = _.result,
        isFunction = _.isFunction,
        intendedObject = _.intendedObject,
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
            obj.name = key;
            messengerHash[key] = obj;
        },
        removeFromHash = function (obj) {
            messengerHash[obj.name] = void 0;
        },
        Events = _.factories.Events,
        Messenger = _.extendFrom.Events('Messenger', {
            constructor: function (parent) {
                var hash = {};
                this._getHash = function (key, arg) {
                    return result(hash, key, arg);
                };
                this._setHash = function (key, val) {
                    hash[key] = val;
                };
                if (_.isObject(parent)) {
                    this.attachParent(parent);
                } else {
                    // is string
                    attachToHash(key, this);
                }
                return Events.call(this);
            },
            onDestroy: function () {
                var obj = this;
                if (obj.name) {
                    removeFromHash(obj);
                }
            },
            attachParent: function (parent) {
                this.parent = parent;
                parent.message = this;
                return this;
            },
            request: function (key, arg) {
                return this._getHash(key, arg);
            },
            reply: function (key, handler) {
                var messenger = this;
                _.intendedObject(key, handler, function (key, handler_) {
                    var handler = handler_;
                    if (!isFunction(handler_)) {
                        handler = basicData(handler_);
                    }
                    messenger._setHash(key, handler);
                });
                return messenger.parent;
            }
        }, true),
        messenger = _.messenger = function (obj) {
            return new Messenger(obj);
        };
    messenger(app);
});