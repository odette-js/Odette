var Immutable = factories.Immutable = app.block(function (app) {
    var Value = Directive.extend('Value', {
            constructor: function (value, root) {
                this.original = value;
                return this;
            },
            valueOf: function () {
                return this.original;
            },
            clone: function () {
                return this.valueOf();
            },
            toString: function () {
                return JSON.stringify(this.clone());
            },
            get: function () {
                return this.valueOf();
            }
        }),
        ObjectPointer = Value.extend('ObjectPointer', {
            constructor: function (original_, root) {
                var op = this;
                var original = op.original = original_;
                op.pointers = mapValues(original, figureValidType);
                return op;
            },
            clone: function () {
                return merge({}, this.pointers);
            },
            get: function (key) {
                var value = this.pointers[key];
                return isUndefined(value) ? value : cloneJSON(value);
            },
            set: function (key, value) {
                //
            }
        }),
        ArrayPointer = Value.extend('ArrayPointer', merge({
            constructor: function (original, root) {
                var ap = this;
                var slice = original.slice(0);
                var original = ap.original = map(slice, figureValidType);
                return this;
            },
            clone: function () {
                return this.original.slice(0);
            }
        }, reduce(toArray('forEach,forEachRight,find,findWhere,findIndexWhere,findIndex'), mapsFns, {}))),
        Immutable = Directive.extend('Immutable', {
            toJSON: function () {
                return JSONParse(this.toString());
            },
            toString: function () {
                return JSONStringify(this.base);
            }
        }),
        ImmutableMap = Immutable.extend('ImmutableMap', {
            valueKey: returns(ID),
            valueOf: function () {
                return this.get(this.valueKey());
            },
            constructor: function (base) {
                this.entries = isArray(base) ? base : [];
                this.pending = [];
                this.stacks = 0;
                return this;
            },
            digest: function (list, fn) {
                var pending, stacks, map = this;
                map.stacks++;
                if (isArray(list)) {
                    forEach(list, bindTo(fn, map));
                } else {
                    list();
                }
                stacks = --map.stacks;
                if (!stacks) {
                    return this.mergeEntries();
                } else {
                    return this;
                }
            },
            mergeEntries: function () {
                var entries, map = this,
                    pending = map.pending;
                if (pending.length) {
                    // make a copy of the array
                    entries = map.entries.slice(0);
                    // now account for the object
                    forEach(pending, function (entry) {
                        var key = entry.key;
                        var index = findIndexWhere(entries, {
                            key: key
                        });
                        entry.modifier({
                            key: key,
                            value: entry.value
                        }, index, entries);
                    });
                    this.create(entries);
                } else {
                    return map;
                }
            },
            createEntry: function (key, value) {
                return {
                    key: key,
                    value: value
                };
            },
            queue: function (key, modifier) {
                this.pending.push({
                    key: key,
                    modifier: modifier
                });
            },
            forEachEntry: function (fn) {
                return forEach(this.entries, bindTo(fn, this));
            },
            forEach: function (fn) {
                var bound = bindTo(fn, this);
                return this.forEachEntry(function (entry) {
                    bound(entry.value, entry.key);
                });
            },
            entryBy: function (fn) {
                return find(this.entries, bindTo(fn, this));
            },
            entryByKey: function (key) {
                return this.entryBy(function (entry) {
                    return entry.key === key;
                });
            },
            get: function (key) {
                var entry;
                if ((entry = this.entryByKey(key))) {
                    return entry.value;
                }
            },
            setMany: function (obj) {
                var map = this;
                return map.digest(function () {
                    forOwn(obj, reverseParams(bindTo(map.set, map)))
                });
            },
            set: function (key, value) {
                    var map = this;
                    return map.digest(function () {
                        var entry = map.get(key);
                        if (entry.value !== value) {
                            map.queue(key, function (entry) {
                                entry.value = value;
                            });
                        }
                    });
                    // var i, base, value, key, length, recreate, kys = keys(hash),
                    //     map = this,
                    //     differences = {};
                    // if (!(length = access(kys, LENGTH))) {
                    //     // no changes
                    //     return map;
                    // }
                    // base = map.base;
                    // for (i = 0; i < length && !recreate; i++) {
                    //     key = kys[i];
                    //     value = hash[key];
                    //     recreate = !isUndefined(value) && value !== base[key];
                    // }
                    // if (recreate) {
                    //     map = this.merge(hash);
                    // }
                    // return map;
                }
                // ,
                // merge: function (hash) {
                //     return this.create(this.assign(hash));
                // },
                // assign: function (hash) {
                //     return extend([{}, this.base, hash], handleImmutableRecreation);
                // },
                // create: function (obj) {
                //     return this.__constructor__(obj);
                // },
                // get: function (key) {
                //     return this.base[key];
                // },
                // clone: function () {
                //     return this.create(merge({}, this.base));
                // }
        }),
        ImmutableCollection = Immutable.extend('ImmutableCollection', {
            indexer: returns(ID),
            sorter: returns(NAME),
            reversed: returns(BOOLEAN_FALSE),
            constructor: function () {
                this.base = [];
                this.indexes = [];
                return this;
            },
            forEach: function (fn) {
                forEach(this.base, bindTo(fn, this));
                return this;
            },
            indexBy: function (group) {
                this.forEach(function (item) {
                    //
                });
                this.indexes.push(group);
                return this;
            },
            sort: function () {},
            digest: function () {},
            length: function () {
                return this.base.length;
            },
            add: addOne,
            addOne: addOne,
            addMany: addMany,
            insertAt: insertOne,
            insertOneAt: insertOne,
            insertManyAt: insertMany,
            remove: removeOne,
            removeMany: removeMany,
            removeOne: removeOne
        });

    function mapsFns(memo, key) {
        var fn = _[key];
        memo[key] = function () {
            return fn.apply(this, [this.original, _.toArray(arguments)])
        };
    }

    function figureValidType(value) {
        return isArray(value) ? ArrayPointer(value) : (isObject(value) ? ObjectPointer(value) : Value(value));
    }

    function generatePointers(op, hash) {
        return mapValues(hash, figureValidType);
    }

    function handleImmutableRecreation() {
        debugger;
    }

    function insertOne(item) {}

    function insertMany(list) {}

    function addOne(item) {
        return this.insertAt(item, this.length());
    }

    function addMany(list) {
        return this.insertManyAt(item, this.length());
    }

    function removeOne(item) {}

    function removeMany(list) {}
    return {
        Map: ImmutableMap,
        Collection: ImmutableCollection,
        Value: Value,
        Object: ObjectPointer,
        Array: ArrayPointer
    };
});