application.scope().module('Storage', function (module, app, _, factories) {
    var ELID_STRING = '__uniqueid__',
        __privateDataCache__ = {},
        uniqueId = _.uniqueId,
        datastorage = {
            make: function (el) {
                var elId = el[ELID_STRING] = uniqueId('id');
                var ret = __privateDataCache__[elId] = __privateDataCache__[elId] || {};
                return ret;
            },
            get: function (el) {
                var id = el[ELID_STRING];
                var ret = id ? (__privateDataCache__[id] = __privateDataCache__[id] || this.make(el)) : this.make(el);
                return ret;
            },
            remove: function (el) {
                var id = el[ELID_STRING];
                __privateDataCache__[id] = el[ELID_STRING] = void 0;
                return id;
            }
        },
        internalListAddRemove = function (keymaker, itemmaker) {
            return function (setto) {
                return function (base, item, subdata_, dirtifier) {
                    var ret, subdata;
                    if (!item) {
                        return;
                    }
                    subdata = subdata_ || this.get(base);
                    ret = !subdata.loaded && this.load(base, subdata);
                    // each item that i was passed
                    // duff(gapSplit(items), function (item) {
                    var listitem, key = keymaker(item),
                        index = subdata.hash[item];
                    // do i have you?
                    if (index === blank) {
                        // lets make you
                        listitem = itemmaker(subdata, key);
                        // do i want you after you have been made?
                        if (listitem) {
                            index = subdata.hash[item] = subdata.list.length;
                            subdata.list.push(listitem);
                        }
                    }
                    // are you made and did i want you?
                    if (index + 1) {
                        listitem = subdata.list[index];
                        setto(listitem, index, key, subdata);
                        subdata.dirty = !dirtifier;
                    }
                };
            };
        },
        createNewJoinable = function (subdata, item) {
            return item ? {
                valueOf: function () {
                    return item;
                },
                toString: function () {
                    var adding = this.flag,
                        listitem = adding ? item : '',
                        value = (!adding || !subdata.notTheFirst ? '' : ' ');
                    if (listitem) {
                        subdata.notTheFirst = BOOLEAN_TRUE;
                    }
                    return value + listitem;
                }
            } : BOOLEAN_FALSE;
        },
        listAddRemove = function (opts) {
            var datastorage = opts.storage || datastorage,
                propertyname = opts.name,
                getter = opts.get,
                setter = opts.set,
                keymaker = opts.key,
                itemmaker = opts.item,
                madewithkey = internalListAddRemove(keymaker, itemmaker);
            return {
                name: propertyname,
                add: madewithkey(function (listitem, index, key, subdata) {
                    listitem.flag = BOOLEAN_TRUE;
                }),
                remove: madewithkey(function (listitem, index, key, subdata) {
                    listitem.flag = BOOLEAN_FALSE;
                }),
                toggle: madewithkey(function (listitem, index, key, subdata) {
                    listitem.flag = !listitem.flag;
                }),
                load: function (base, subdata_) {
                    var listManager = this,
                        subdata = subdata_ || listManager.get(base);
                    // don't call listManager function again
                    subdata.loaded = true;
                    // load all of the base data
                    duff(getter(base, propertyname), function (item) {
                        listManager.add(base, item, subdata, true);
                    });
                },
                unload: function (base, subdata_) {
                    var subdata = subdata_ || this.get(base);
                    // check to make sure it has at least been loaded
                    if (subdata.loaded && subdata.dirty) {
                        setter(base, this.name, subdata.list);
                        this.reset();
                    }
                },
                isDirty: function (base) {
                    return this.get(base).dirty;
                },
                // requires base object that data is tied to
                get: function (base) {
                    var data = datastorage.get(base);
                    data[propertyname] = data[propertyname] || this.reset();
                    return data[propertyname];
                },
                // requires subdata
                reset: function () {
                    return {
                        loaded: false,
                        dirty: false,
                        list: [],
                        hash: {}
                    };
                }
            };
        },
        nestedList = function (opts) {
            var propertyname = opts.name,
                categoryKey = opts.categoryKey,
                storageGet = {
                    get: function (base) {
                        return api.where(base).underspace;
                    }
                },
                api = {
                    add: function (base, category_, dataset) {
                        var item, data = dataset || this.where(base);
                        var category = categoryKey(category_);
                        if (!data[category]) {
                            item = this.make(base, category, data);
                            data._byId[category] = item;
                            data._items.push(item);
                            item.load(base);
                        }
                        return item;
                    },
                    remove: function (base, category_, dataset) {
                        var data = dataset || this.where(base);
                        var category = categoryKey(category_);
                        data[category] = void 0;
                    },
                    load: function (base, dataset) {
                        var categoryManager = this,
                            data = dataset || categoryManager.where(base);
                        duff(base.attributes, function (value) {
                            categoryManager.add(base, value.localName, data);
                        });
                    },
                    upsert: function (base, category, additem, addremove) {
                        var data = this.where(base),
                            list = this.get(base, category) || this.add(base, category, data),
                            wasdirty = list.isDirty(base);
                        list[addremove ? 'add' : 'remove'](base, additem);
                        if (wasdirty !== list.isDirty(base)) {
                            data.dirtyList.push(list);
                            data.isDirty++;
                        }
                    },
                    get: function (base, category) {
                        return this.where(base)._byId[category];
                    },
                    unload: function (base) {
                        var data = this.where(base);
                        duff(data.dirtyList, function (item) {
                            if (!item.isDirty(base)) {
                                return;
                            }
                            item.unload(base);
                        });
                        data.dirtyList = [];
                        return this;
                    },
                    where: function (base) {
                        var data = datastorage.get(base);
                        data[propertyname] = data[propertyname] || this.reset();
                        return data[propertyname];
                    },
                    reset: function () {
                        return {
                            dirtyList: [],
                            loaded: false,
                            _byId: {},
                            _items: [],
                            underspace: {}
                        };
                    },
                    make: function (base, category, dataset) {
                        var collection = listAddRemove({
                            storage: storageGet,
                            get: attributeInterface,
                            name: category,
                            item: createNewJoinable,
                            set: function (el, key, value_) {
                                attributeInterface(el, key, value_.join('') || BOOLEAN_FALSE);
                            },
                            key: function (item) {
                                return (+item === +item) ? +item : item;
                            }
                        });
                        return collection;
                    }
                };
            return api;
        };
    module.message.reply({
        'make:nested': nestedList,
        'make:list': listAddRemove,
        storage: datastorage
    });
});