application.scope(function (app) {
    var _ = app._,
        resultOf = _.resultOf,
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
                this._getHash = function (key, args) {
                    return resultOf(hash[key], args);
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
            request: function (key, args) {
                return this._getHash(key, args);
            },
            reply: function (key, handler) {
                if (!_.isFunction(handler)) {
                    handler = basicData(handler);
                }
                this._setHash(key, handler);
                return this.parent;
            },
            replies: function (obj) {
                var messenger = this;
                _.each(obj, function (val, key) {
                    messenger._setHash(key, val);
                });
                return messenger.parent;
            }
        }, true),
        messenger = _.messenger = function (obj) {
            return new Messenger(obj);
        };
    messenger(app);
});