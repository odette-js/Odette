application.scope(function (app) {
    var Collection = factories.Collection,
        Events = factories.Events,
        ID = 'id',
        SORT = 'sort',
        ADDED = 'added',
        UNWRAP = 'unwrap',
        REMOVED = 'removed',
        CURRENT = 'current',
        // _COUNTER = '_counter',
        DESTROY = 'destroy',
        BEFORE_DESTROY = BEFORE_COLON + DESTROY,
        INTERNAL_EVENTS = '_events',
        STOP_LISTENING = 'stopListening',
        EVENT_REMOVE = '_removeEventList',
        _DELEGATED_CHILD_EVENTS = '_delegatedParentEvents',
        _PARENT_DELEGATED_CHILD_EVENTS = '_parentDelgatedChildEvents',
        CHANGE_COUNTER = 'counter',
        PREVIOUS = 'previous',
        /**
         * @class Box
         * @description event and attribute extensor object that creates the Box Constructor and convenience method at _.Box
         * @augments Model
         */
        Container = factories.Events.extend('Container', {
            // this id prefix is nonsense
            // define the actual key
            idAttribute: ID,
            comparator: ID,
            constructor: function (attributes, secondary) {
                var model = this;
                model.reset(attributes);
                Events[CONSTRUCTOR].call(this, secondary);
                return model;
            },
            reset: function (data_) {
                var childModel, children, model = this,
                    dataDirective = model.directive(DATA),
                    current = dataDirective[CURRENT],
                    // automatically checks to see if the data is a string
                    passed = parse(data_) || {},
                    // build new data
                    newAttributes = extend(result(model, 'defaults', passed), passed),
                    // try to get the id from the attributes
                    idAttributeResult = result(model, 'idAttribute', newAttributes),
                    discoveredId = model.id || newAttributes[idAttributeResult] || uniqueId(BOOLEAN_FALSE, BOOLEAN_TRUE);
                // set the id of the object
                model._setId(discoveredId);
                // set id and let parent know what your new id is
                model[DISPATCH_EVENT](BEFORE_COLON + RESET);
                // setup previous data
                dataDirective.reset(newAttributes);
                // dataDirective[PREVIOUS] = {};
                // let everything know that it is changing
                model[DISPATCH_EVENT](RESET);
            },
            /**
             * @description remove attributes from the Box object. Does not completely remove from object with delete, but instead simply sets it to UNDEFINED / undefined
             * @param {String} attr - property string that is on the attributes object
             * @returns {Box} instance the method was called on
             * @func
             * @name Box#unset
             */
            unset: _.directives.parodyCheck(DATA, 'unset'),
            /**
             * @description returns attribute passed into
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {*} value that is present on the attributes object
             * @func
             * @name Box#get
             */
            get: _.directives.parodyCheck(DATA, 'get'),
            /**
             * @func
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {Boolean} evaluation of whether or not the Box instance has a value at that attribute key
             * @description checks to see if the current attribute is on the attributes object as anything other an undefined
             * @name Box#has
             */
            has: _.directives.parodyCheck(DATA, 'has'),
            /**
             * @description collects a splat of arguments and condenses them into a single object. Object is then extended onto the attributes object and any items that are different will be fired as events
             * @param {...*} series - takes a series of key value pairs. can be mixed with objects. All key value pairs will be placed on a new object, which is to be passed into the function below
             * @func
             * @name Box#set
             * @returns {Box} instance
             */
            destroy: function () {
                var removeRet, box = this;
                // notify things like parent that it's about to destroy itself
                box[DISPATCH_EVENT](BEFORE_DESTROY);
                // actually detach
                removeRet = box[PARENT] && box[PARENT].remove(box);
                // stop listening to other views
                box[DISPATCH_EVENT](DESTROY);
                // stops listening to everything
                box[STOP_LISTENING]();
                return box;
            },
            set: function (key, value) {
                var changedList = [],
                    model = this,
                    dataDirective = model.directive(DATA),
                    current = dataDirective[CURRENT] = dataDirective[CURRENT] || {},
                    previous = dataDirective[PREVIOUS] = dataDirective[PREVIOUS] || {},
                    compiled = {};
                intendedObject(key, value, function (key, value) {
                    if (dataDirective.set(key, value) && !dataDirective.changing[name]) {
                        changedList.push(key);
                        compiled[key] = value;
                    }
                });
                // do not digest... this time
                if (!changedList[LENGTH]) {
                    return model;
                }
                // list
                dataDirective.digest(model, function () {
                    duff(changedList, function (name) {
                        dataDirective.changing[name] = BOOLEAN_TRUE;
                        model[DISPATCH_EVENT](CHANGE_COLON + name);
                        dataDirective.changing[name] = BOOLEAN_FALSE;
                    });
                });
                return model;
            },
            setDeep: function (where, value) {
                var former, lastkey, model = this,
                    dataDirective = model.directive(DATA),
                    triggers = [],
                    path = toArray(where, PERIOD);
                if (!dataDirective.setDeep(path, value)) {
                    return model;
                }
                dataDirective.digest(model, function () {
                    duffRev(path, function (item) {
                        var name = path.join(PERIOD);
                        dataDirective.changing[name] = BOOLEAN_TRUE;
                        model[DISPATCH_EVENT](CHANGE_COLON + name);
                        dataDirective.changing[name] = BOOLEAN_FALSE;
                        path.pop();
                    });
                });
                return model;
            },
            /**
             * @description basic json clone of the attributes object
             * @func
             * @name Box#toJSON
             * @returns {Object} json clone of the attributes object
             */
            toJSON: function () {
                // does not prevent circular dependencies.
                // swap this out for something else if you want
                // to prevent circular dependencies
                return clone(this.directive(DATA)[CURRENT]);
            },
            current: function () {
                return clone(this.directive(DATA)[CURRENT]);
            },
            valueOf: function () {
                return this.id;
            },
            /**
             * @description stringified version of attributes object
             * @func
             * @name Box#stringify
             * @returns {String} stringified json version of
             */
            toString: function () {
                return stringify(this);
            },
            _setId: function (id_) {
                var model = this,
                    id = id_ === UNDEFINED ? uniqueId(BOOLEAN_FALSE) : id_;
                model.id = id;
            }
        }, BOOLEAN_TRUE),
        modelMaker = function (attributes, options) {
            return Box(attributes, options);
        },
        Box = factories.Container.extend('Box', {
            Child: modelMaker,
            /**
             * @description resets the box's attributes to the object that is passed in
             * @name Box#reset
             * @func
             * @param {Object} attributes - non circular hash that is extended onto what the defaults object produces
             * @returns {Box} instance the method was called on
             */
            resetChildren: function (newChildren) {
                var length, child, box = this,
                    children = box.directive(CHILDREN),
                    arr = children[UNWRAP]();
                // this can be made far more efficient
                while (arr[LENGTH]) {
                    child = arr[0];
                    length = arr[LENGTH];
                    if (child) {
                        result(child, DESTROY);
                    }
                    // if it didn't remove itself,
                    // then you should remove it here
                    // this gets run if the child is a basic data type
                    if (arr[0] === child && arr[LENGTH] === length) {
                        remove(arr, child);
                    }
                }
                box.add(newChildren);
                return box;
            },
            // registers and actually adds child to hash
            _addToHash: function (newModel, where) {
                var parent = this,
                    children = this.directive(CHILDREN);
                // add to collection
                children.add(newModel);
                // register with parent
                children.register(ID, newModel.id, newModel);
                children.register(newModel.uniqueKey + ID, newModel[newModel.uniqueKey + ID], newModel);
            },
            // ties child events to new child
            _delegateChildEvents: function (model) {
                var childsEventDirective, parent = this,
                    childEvents = _.result(parent, CHILD + 'Events');
                if (model && childEvents) {
                    childsEventDirective = model.directive(EVENTS);
                    // stash them
                    childsEventDirective[_PARENT_DELEGATED_CHILD_EVENTS] = childEvents;
                    parent.listenTo(model, childEvents);
                }
            },
            // ties child events to new child
            _unDelegateChildEvents: function (model) {
                var childsEventDirective, parent = this;
                if (model && parent[STOP_LISTENING] && (childsEventDirective = model.checkDirective(EVENTS)) && childsEventDirective[_PARENT_DELEGATED_CHILD_EVENTS]) {
                    parent[STOP_LISTENING](model, model[_PARENT_DELEGATED_CHILD_EVENTS]);
                    childsEventDirective[_PARENT_DELEGATED_CHILD_EVENTS] = UNDEFINED;
                }
            },
            _delegateParentEvents: function (model) {
                var childsEventDirective, parent = model[PARENT],
                    parentEvents = _.result(model, PARENT + 'Events');
                if (parent && parentEvents) {
                    childsEventDirective = model.directive(EVENTS);
                    childsEventDirective[_DELEGATED_CHILD_EVENTS] = parentEvents;
                    model.listenTo(parent, parentEvents);
                }
            },
            // ties child events to new child
            _unDelegateParentEvents: function (model) {
                var childsEventDirective, parent = this;
                if (model[STOP_LISTENING] && (childsEventDirective = model.checkDirective(EVENTS)) && childsEventDirective[_DELEGATED_CHILD_EVENTS]) {
                    model[STOP_LISTENING](parent, model[_DELEGATED_CHILD_EVENTS]);
                    childsEventDirective[_DELEGATED_CHILD_EVENTS] = UNDEFINED;
                }
            },
            _isChildType: function (child) {
                return isInstance(child, this.Child);
            },
            // this one forcefully adds
            _add: function (model) {
                var parent = this,
                    children = parent.directive(CHILDREN),
                    evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](BEFORE_COLON + ADDED);
                // let the child know it's about to be added
                // (tied to it's parent via events)
                // unties boxes
                parent._remove(model);
                // explicitly tie to parent
                model[PARENT] = parent;
                // attach events from parent
                parent._addToHash(model);
                // ties boxes together
                parent._delegateParentEvents(model);
                parent._delegateChildEvents(model);
                evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](ADDED);
                // notify that you were added
                return model;
            },
            // public facing version filters
            add: function (objs_, secondary_) {
                var childAdded, parent = this,
                    children = parent.directive(CHILDREN),
                    secondary = extend(result(parent, CHILD + 'Options'), secondary_ || {}),
                    list = Collection(objs_);
                // unwrap it if you were passed a collection
                if (!parent.Child || !list[LENGTH]()) {
                    return list[UNWRAP]();
                }
                list = list.foldl(function (memo, obj) {
                    var isChildType = parent._isChildType(obj),
                        // create a new model
                        // call it with new in case they use a constructor
                        newModel = isChildType ? obj : new parent.Child(obj, secondary),
                        // find by the newly created's id
                        foundModel = children.get(newModel.id);
                    if (foundModel) {
                        // update the old
                        foundModel.set(obj);
                        newModel = foundModel;
                    } else {
                        // add the new
                        childAdded = BOOLEAN_TRUE;
                        parent._add(newModel);
                    }
                    memo.push(newModel);
                    return memo;
                }, []);
                if (childAdded) {
                    parent[DISPATCH_EVENT](CHILD + COLON + ADDED);
                }
                return list;
            },
            _removeFromHash: function (child) {
                var parent = this,
                    children = parent.directive(CHILDREN);
                if (!children || !child) {
                    return;
                }
                // remove the child from the children hash
                children.remove(child);
                parent.directive(CHILDREN).unRegister(ID, child.id);
                // unregister from the child hash keys
                parent.directive(CHILDREN).unRegister(child.uniqueKey + ID, child[child.uniqueKey + ID]);
            },
            _remove: function (model) {
                // cache the parent
                var parent = this;
                // let everyone know that this object is about to be removed
                model[DISPATCH_EVENT](BEFORE_COLON + REMOVED);
                // notify the child that the remove pipeline is starting
                // remove the parent events
                parent._unDelegateParentEvents(model);
                // have parent remove it's child events
                parent._unDelegateChildEvents(model);
                // attach events from parent
                parent._removeFromHash(model);
                // void out the parent member tied directly to the model
                model[PARENT] = UNDEFINED;
                // let everyone know that you've offically separated
                model[DISPATCH_EVENT](REMOVED);
                // notify the child that the remove pipeline is done
                return model;
            },
            remove: function (idModel_) {
                var parent = this,
                    children = parent.directive(CHILDREN),
                    retList = Collection(),
                    args = toArray(arguments).splice(1),
                    idModel = idModel_;
                if (!isObject(idModel)) {
                    // it's a string
                    idModel = parent.directive(CHILDREN).get(ID, idModel + EMPTY_STRING);
                }
                if (!idModel || !isObject(idModel)) {
                    return retList;
                }
                Collection(idModel && idModel.unwrap ? idModel.unwrap() : idModel).duff(function (model) {
                    var parent = model[PARENT];
                    parent._remove(model);
                    retList.add(model);
                });
                if (retList[LENGTH]()) {
                    parent[DISPATCH_EVENT](CHILD + COLON + REMOVED);
                }
                return retList;
            },
            /**
             * @description removes pointers from parent
             * @func
             * @name Box#destroy
             * @returns {Box} instance
             */
            _destroy: function () {
                var box = this,
                    // removes all parent / parent's child listeners
                    removeRet = box[PARENT] && box[PARENT].remove(box);
                // destroys it's children
                box.resetChildren();
            },
            /**
             * @description basic sort function
             * @param {Function|String} comparator - argument to sort children against
             * @returns {Box} instance
             * @func
             * @name Box#sort
             */
            sort: function (comparator_) {
                var comparatorString, isReversed, model = this,
                    children = model.directive(CHILDREN),
                    comparator = comparator_ || result(model, 'comparator');
                if (isString(comparator)) {
                    isReversed = comparator[0] === '!';
                    comparatorString = comparator;
                    if (isReversed) {
                        comparatorString = comparator.slice(1);
                    }
                    comparator = function (a, b) {
                        var val_, val_A = a.get(comparatorString),
                            val_B = b.get(comparatorString);
                        if (isReversed) {
                            val_ = val_B - val_A;
                        } else {
                            val_ = val_A - val_B;
                        }
                        return val_;
                    };
                }
                model[DISPATCH_EVENT](BEFORE_COLON + SORT, model);
                children[SORT](comparator);
                model[DISPATCH_EVENT](SORT, model);
                return model;
            }
        }, BOOLEAN_TRUE),
        set = function (key, newValue) {
            var dataDirective = this,
                current = dataDirective[CURRENT],
                oldValue = current[key];
            if (!isEqual(oldValue, newValue)) {
                current[key] = newValue;
                return BOOLEAN_TRUE;
            }
            return BOOLEAN_FALSE;
        },
        get = function (key) {
            return this[CURRENT][key];
        },
        unset = function (key) {
            this[CURRENT][key] = UNDEFINED;
        },
        reset = function (hash) {
            this[CURRENT] = hash;
            // this.counter = 0;
        },
        setDeep = function (path, value) {
            var previous, dataDirective = this,
                current = dataDirective[CURRENT];
            duff(path, function (key, index) {
                var no_more = index === path[LENGTH] - 1;
                previous = current;
                current = no_more ? current[key] : isObject(current[key]) ? current[key] : (previous[key] = {});
            });
            if (previous && !isEqual(current, value)) {
                previous[key] = value;
                return BOOLEAN_TRUE;
            }
        },
        digest = function (model, fn) {
            var dataDirective = this;
            dataDirective[CHANGE_COUNTER]++;
            fn();
            dataDirective[CHANGE_COUNTER]--;
            // this event should only ever exist here
            if (!dataDirective[CHANGE_COUNTER]) {
                model[DISPATCH_EVENT](CHANGE, dataDirective[PREVIOUS]);
                dataDirective[PREVIOUS] = {};
                dataDirective.changing = {};
            }
        },
        has = function (key) {
            return this.current[key] != NULL;
        };
    app.defineDirective('data', function () {
        return {
            current: {},
            changing: {},
            counter: 0,
            set: set,
            get: get,
            has: has,
            unset: unset,
            reset: reset,
            digest: digest
        };
    });
    app.defineDirective('children', function () {
        return Collection();
    });
    modelMaker[CONSTRUCTOR] = Box[CONSTRUCTOR];
});