var WeakMap = factories.WeakMap = app.block(function (app) {
    var ITEMS = 'items',
        DATA = 'data',
        DATASET = DATA + 'set',
        weakMapsHash = {},
        has = _.has,
        setInstance = function (instance) {
            var id = instance.id = uuid();
            weakMapsHash[id] = {
                target: instance,
                types: {},
                getType: function (obj) {
                    var types = this.types,
                        key = isWindow(obj) ? '[object global]' : objectToString.call(obj).toLowerCase(),
                        typesHash = types[key];
                    if (typesHash) {
                        return typesHash;
                    }
                    typesHash = types[key] = {
                        key: key,
                        list: [],
                        data: [],
                        hash: {}
                    };
                    return typesHash;
                },
                get: function (obj, id) {
                    var item, typeGroup = this.getType(obj),
                        hash = typeGroup.hash,
                        list = typeGroup.list;
                    return id ? (_.has(hash, id) && hash[id]) : typeGroup.data[indexOf(typeGroup.list, obj)];
                },
                has: function (obj, id, typeGroup_) {
                    var item, typeGroup = typeGroup_ || this.getType(obj),
                        hash = typeGroup.hash,
                        list = typeGroup.list;
                    return !!(id ? _.has(hash, id) : (1 + indexOf(typeGroup.list, obj)));
                },
                set: function (obj, datum, id) {
                    var item, idx, typeGroup = this.getType(obj),
                        hash = typeGroup.hash,
                        list = typeGroup.list;
                    if (id) {
                        hash[id] = datum;
                    } else {
                        idx = (idx = indexOf(typeGroup.list, obj) + 1) ? idx - 1 : (list.push(obj) && list.length - 1);
                        typeGroup.data[idx] = datum;
                    }
                    return this;
                },
                delete: function (obj, id) {
                    var idx, typeGroup = this.getType(obj);
                    if (id) {
                        return _.has(typeGroup.hash, id);
                    } else {
                        idx = indexOf(typeGroup.list, obj);
                        if (idx === -1) {
                            return BOOLEAN_FALSE;
                        }
                        removeAt(typeGroup.list, idx);
                        removeAt(typeGroup.data, idx);
                        return BOOLEAN_TRUE;
                    }
                }
            };
        },
        retreiveHash = function (instance) {
            return weakMapsHash[instance.id];
        },
        retreiveData = function (instance, obj, key) {
            return retreiveHash(instance).get(obj, key);
        },
        exposedMethods = ['has', 'get', 'set', 'delete'];
    return factories.Directive.extend('WeakMap', _.reduce(exposedMethods, function (memo, key) {
        memo[key] = function (one, two, three) {
            return retreiveHash(this)[key](one, two, three);
        };
    }, {
        constructor: function (items) {
            var map = this;
            setInstance(map);
            forEach(items, function (item) {
                map.set(item[0], item[1]);
            });
            return map;
        }
    }));
});