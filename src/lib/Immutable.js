var Immutable = factories.Immutable = app.block(function (app) {
    var ImmutableMap = Directive.extend('ImmutableMap', {
            valueKey: returns(ID),
            valueOf: function () {
                return this.get(this.valueKey());
            },
            constructor: function (base) {
                this.base = base || {};
                return this;
            },
            set: function (hash) {
                var i, base, value, key, length, recreate, kys = keys(hash),
                    map = this;
                if (!(length = access(kys, LENGTH))) {
                    // no changes
                    return map;
                }
                base = map.base;
                for (i = 0; i < length && !recreate; i++) {
                    key = kys[i];
                    value = hash[key];
                    recreate = !isUndefined(value) && value !== base[key];
                }
                if (recreate) {
                    map = this.merge(hash);
                }
                return map;
            },
            merge: function (hash) {
                return this.create(this.assign(hash));
            },
            assign: function (hash) {
                return extend([{}, this.base, hash]);
            },
            create: function (obj) {
                return this.__constructor__(obj);
            },
            get: function (key) {
                return this.base[key];
            },
            clone: function () {
                return this.create(merge({}, this.base));
            },
            toJSON: function () {
                return JSONParse(this.toString());
            },
            toString: function () {
                return JSONStringify(this.base);
            }
        }),
        ImmutableCollection = Directive.extend('ImmutableCollection', {
            indexer: returns(ID),
            sorter: returns(NAME),
            reversed: returns(BOOLEAN_FALSE),
            sort: function () {},
            add: function () {},
            insert: function () {},
            remove: function () {}
        });
    return {
        Map: ImmutableMap,
        Collection: ImmutableCollection
    };
});