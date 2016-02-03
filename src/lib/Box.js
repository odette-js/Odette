application.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Collection = factories.Collection,
        Events = factories.Events,
        gapSplit = _.gapSplit,
        isObject = _.isObject,
        isString = _.isString,
        isNumber = _.isNumber,
        isEqual = _.isEqual,
        isBlank = _.isBlank,
        isFunction = _.isFunction,
        each = _.each,
        duff = _.duff,
        find = _.find,
        duffRev = _.duffRev,
        push = _.push,
        has = _.has,
        map = _.map,
        result = _.result,
        toArray = _.toArray,
        remove = _.remove,
        clone = _.clone,
        once = _.once,
        parse = _.parse,
        extend = _.extend,
        listDrop = _.remove,
        stringify = _.stringify,
        isInstance = _.isInstance,
        isArrayLike = _.isArrayLike,
        upCase = _.upCase,
        camelCase = _.camelCase,
        isArray = _.isArray,
        intendedObject = _.intendedObject,
        uniqueId = _.uniqueId,
        ID = 'id',
        SORT = 'sort',
        ADDED = 'added',
        UNWRAP = 'unwrap',
        REMOVED = 'removed',
        INTERNAL_EVENTS = '_events',
        STOP_LISTENING = 'stopListening',
        DISPATCH_EVENT = 'dispatchEvent',
        EVENT_REMOVE = '_removeEventList',
        _DELEGATED_CHILD_EVENTS = '_delegatedParentEvents',
        _PARENT_DELEGATED_CHILD_EVENTS = '_parentDelgatedChildEvents',
        CHANGE_COUNTER = '_changeCounter',
        PREVIOUS_ATTRIBUTES = '_previousAttributes',
        /**
         * @class Box
         * @description event and attribute extensor object that creates the Box Constructor and convenience method at _.Box
         * @augments Model
         */
        Container = factories.Events.extend('Container', {
            // this id prefix is nonsense
            // define the actual key
            uniqueKey: 'c',
            idAttribute: ID,
            constructor: function (attributes, secondary) {
                var model = this;
                model[model.uniqueKey + ID] = model[model.uniqueKey + ID] = uniqueId(model.uniqueKey);
                extend(model, secondary);
                model.reset(attributes);
                Events[CONSTRUCTOR].apply(this, arguments);
                return model;
            },
            _reset: function (attributes_) {
                var childModel, children, model = this,
                    // automatically checks to see if the attributes are a string
                    attributes = parse(attributes_) || {},
                    // default attributes
                    attrs = result(model, 'defaults', attributes),
                    // build new attributes
                    newAttributes = extend(attrs, attributes),
                    // get the id
                    idAttr = result(model, 'idAttribute', newAttributes),
                    // stale attributes
                    ret = model[ATTRIBUTES] || {};
                // set id and let parent know what your new id is
                model[DISPATCH_EVENT](BEFORE_COLON + RESET);
                // set the id of the object
                model._setId(model.id || newAttributes[idAttr] || uniqueId(BOOLEAN_FALSE, BOOLEAN_TRUE));
                // setup previous attributes
                model[PREVIOUS_ATTRIBUTES] = {};
                // swaps attributes hash
                model[ATTRIBUTES] = newAttributes;
                // let everything know that it is changing
                model[DISPATCH_EVENT](RESET);
                // return the attributes
                return ret;
            },
            /**
             * @description remove attributes from the Box object. Does not completely remove from object with delete, but instead simply sets it to blank / undefined
             * @param {String} attr - property string that is on the attributes object
             * @returns {Box} instance the method was called on
             * @func
             * @name Box#unset
             */
            unset: function (attrs) {
                var attrObj = this[ATTRIBUTES];
                // blindly wipe the attributes
                duff(gapSplit(attrs), function (attr) {
                    attrObj[attr] = blank;
                });
                return this;
            },
            /**
             * @description returns attribute passed into
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {*} value that is present on the attributes object
             * @func
             * @name Box#get
             */
            get: function (attr) {
                return this[ATTRIBUTES][attr];
            },
            /**
             * @func
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {Boolean} evaluation of whether or not the Box instance has a value at that attribute key
             * @description checks to see if the current attribute is on the attributes object as anything other an undefined
             * @name Box#has
             */
            has: function (attrs) {
                var box = this,
                    attributes = box[ATTRIBUTES];
                return find(gapSplit(attrs), function (attr) {
                    return attributes[attr] === blank;
                }) === blank;
            },
            /**
             * @description collects a splat of arguments and condenses them into a single object. Object is then extended onto the attributes object and any items that are different will be fired as events
             * @param {...*} series - takes a series of key value pairs. can be mixed with objects. All key value pairs will be placed on a new object, which is to be passed into the function below
             * @func
             * @name Box#set
             * @returns {Box} instance
             */
            _set: function (key, newValue) {
                var model = this,
                    didChange = BOOLEAN_FALSE,
                    attrs = model[ATTRIBUTES],
                    oldValue = attrs[key],
                    previousAttrsObject = model[PREVIOUS_ATTRIBUTES] = model[PREVIOUS_ATTRIBUTES] || {};
                if (!isEqual(oldValue, newValue)) {
                    previousAttrsObject[key] = oldValue;
                    attrs[key] = newValue;
                    didChange = BOOLEAN_TRUE;
                }
                return didChange;
            },
            _destroy: function () {
                var container = this,
                    // removes all parent / parent's child listeners
                    removeRet = container[PARENT] && container[PARENT].remove(container);
            },
            destroy: function () {
                var removeRet, box = this;
                // notify things like parent that it's about to destroy itself
                box[DISPATCH_EVENT](BEFORE_COLON + 'destroy');
                // actually detach
                box._destroy();
                // stop listening to other views
                box[DISPATCH_EVENT](DESTROY);
                // stops listening to everything
                box[STOP_LISTENING]();
                // takes off all other event handlers
                box.wipeEvents();
                return box;
            },
            digester: function (fn) {
                var ret, model = this;
                model[CHANGE_COUNTER] = model[CHANGE_COUNTER] || 0;
                ++model[CHANGE_COUNTER];
                ret = fn();
                --model[CHANGE_COUNTER];
                // this event should only ever exist here
                if (!model[CHANGE_COUNTER]) {
                    model[DISPATCH_EVENT]('digest', model[PREVIOUS_ATTRIBUTES]);
                    model[PREVIOUS_ATTRIBUTES] = {};
                }
                return ret;
            },
            set: function (key, value) {
                var changedList = [],
                    model = this,
                    compiled = {};
                intendedObject(key, value, function (key, value) {
                    if (model._set(key, value)) {
                        changedList.push(key);
                        compiled[key] = value;
                    }
                });
                if (!changedList[LENGTH]) {
                    // do not digest... this time
                    return model;
                }
                model.digester(function () {
                    duff(changedList, function (name) {
                        model[DISPATCH_EVENT](CHANGE + ':' + name);
                    });
                    model[DISPATCH_EVENT](CHANGE, compiled);
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
                return clone(this[ATTRIBUTES]);
            },
            comparator: 'id',
            valueOf: function () {
                var datapoint = +result(this.attributes, this.comparator);
                // if it's NaN
                if (datapoint !== datapoint) {
                    datapoint = blank;
                }
                if (datapoint === blank) {
                    datapoint = +this.id;
                }
                return datapoint;
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
                    id = id_ === blank ? uniqueId(BOOLEAN_FALSE) : id_;
                model.id = id;
            },
            reset: function (attrs) {
                this._reset(attrs);
                return this;
            }
        }, BOOLEAN_TRUE),
        modelMaker = function (attributes, options) {
            return Box(attributes, options);
        },
        Box = factories.Container.extend('Box', {
            Model: modelMaker,
            /**
             * @description constructor function for the Box Object
             * @name Box#constructor
             * @func
             */
            constructor: function (attributes, secondary) {
                var model = this;
                model._ensureChildren();
                Container.constructor.apply(model, arguments);
                return model;
            },
            _ensureChildren: function () {
                this[CHILDREN] = Collection();
            },
            _gatherChildren: function () {
                return [];
            },
            /**
             * @description resets the box's attributes to the object that is passed in
             * @name Box#reset
             * @func
             * @param {Object} attributes - non circular hash that is extended onto what the defaults object produces
             * @returns {Box} instance the method was called on
             */
            resetChildren: function (newChildren) {
                var length, child, box = this,
                    children = box[CHILDREN],
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
                    children = this[where || CHILDREN];
                // add to collection
                children.add(newModel);
                // register with parent
                children.register(newModel.id, newModel);
                children.register(newModel.uniqueKey + ID, newModel[newModel.uniqueKey + ID], newModel);
            },
            // ties child events to new child
            _delegateChildEvents: function (model) {
                var parent = this,
                    childEvents = _.result(parent, CHILD + 'Events');
                if (model && childEvents) {
                    model[_PARENT_DELEGATED_CHILD_EVENTS] = childEvents;
                    parent.listenTo(model, childEvents);
                }
            },
            // ties child events to new child
            _unDelegateChildEvents: function (model) {
                if (model && model[_PARENT_DELEGATED_CHILD_EVENTS] && this[STOP_LISTENING]) {
                    this[STOP_LISTENING](model, model[_PARENT_DELEGATED_CHILD_EVENTS]);
                }
            },
            _delegateParentEvents: function (model) {
                var parent = model[PARENT],
                    parentEvents = _.result(model, 'parentEvents');
                if (parent && parentEvents) {
                    model[_DELEGATED_CHILD_EVENTS] = parentEvents;
                    model.listenTo(parent, parentEvents);
                }
            },
            // ties child events to new child
            _unDelegateParentEvents: function (model) {
                var parent = this;
                if (model[STOP_LISTENING] && model[_DELEGATED_CHILD_EVENTS]) {
                    model[STOP_LISTENING](parent, model[_DELEGATED_CHILD_EVENTS]);
                }
            },
            _isChildType: function (child) {
                return isInstance(child, this.Model);
            },
            // this one forcefully adds
            _add: function (model) {
                var parent = this,
                    children = parent[CHILDREN],
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
                    children = parent[CHILDREN],
                    secondary = extend(result(parent, CHILD + 'Options'), secondary_ || {}),
                    list = Collection(objs_);
                // unwrap it if you were passed a collection
                if (!parent.Model || !list[LENGTH]()) {
                    return list[UNWRAP]();
                }
                list = list.foldl(function (memo, obj) {
                    var isChildType = parent._isChildType(obj),
                        // create a new model
                        // call it with new in case they use a constructor
                        newModel = isChildType ? obj : new parent.Model(obj, secondary),
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
                    parent[DISPATCH_EVENT](CHILD + ':' + ADDED);
                }
                return list;
            },
            _removeFromHash: function (child) {
                var parent = this,
                    children = parent[CHILDREN];
                if (!children || !child) {
                    return;
                }
                // remove the child from the children hash
                children.remove(child);
                parent[CHILDREN].unRegister(ID, child.id);
                // unregister from the child hash keys
                parent[CHILDREN].unRegister(child.uniqueKey + ID, child[child.uniqueKey + ID]);
            },
            // only place that we mention parents
            _collectParents: function () {
                var eventr = this,
                    parents = [],
                    parent = eventr[PARENT];
                while (parent) {
                    if (isInstance(parent, Events)) {
                        parents.push(parent);
                    }
                    parent = parent[PARENT];
                }
                return parents;
            },
            // has to completely replace previous event dispatcher
            dispatchEvent: function (name_, data, evnt_) {
                var origin = this,
                    name = (evnt_ && evnt_.methodName) || name_,
                    methodName = (evnt_ && evnt_.methodName) || upCase(camelCase('on:' + name, ':')),
                    childMethodName = upCase(camelCase('on:bubble:' + name, ':')),
                    // onMethod = isFunction(origin[methodName]),
                    evnt = evnt_ || origin._createEvent(name, data),
                    parents = origin._collectParents(),
                    i = parents[LENGTH] - 1;
                // should all be BOOLEAN_TRUE the first time around
                while (origin && origin._eventDispatcher && !evnt.isStopped()) {
                    origin._eventDispatcher(evnt);
                    origin = !evnt.isStopped() && evnt.bubbles && origin[PARENT];
                }
                evnt.finished();
                return evnt;
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
                model[PARENT] = blank;
                // let everyone know that you've offically separated
                model[DISPATCH_EVENT](REMOVED);
                // notify the child that the remove pipeline is done
                return model;
            },
            remove: function (idModel_) {
                var parent = this,
                    children = parent[CHILDREN],
                    retList = Collection(),
                    args = toArray(arguments).splice(1),
                    idModel = idModel_;
                if (!isObject(idModel)) {
                    // it's a string
                    idModel = parent[CHILDREN].get(ID, idModel + '');
                }
                if (!idModel || !isObject(idModel)) {
                    return retList;
                }
                if (isInstance(idModel, Collection)) {
                    idModel = idModel[UNWRAP]();
                }
                if (!isArray(idModel)) {
                    idModel = [idModel];
                }
                duff(idModel, function (model) {
                    parent._remove(model);
                    retList.add(model);
                });
                if (retList[LENGTH]()) {
                    parent[DISPATCH_EVENT](CHILD + ':' + REMOVED);
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
                var compString, isReversed, model = this,
                    children = model[CHILDREN],
                    comparator = comparator_ || result(model, 'comparator');
                if (isString(comparator)) {
                    isReversed = comparator[0] === '!';
                    compString = comparator;
                    if (isReversed) {
                        compString = comparator.slice(1);
                    }
                    comparator = function (a, b) {
                        var val_, val_A = a.get(compString),
                            val_B = b.get(compString);
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
        }, BOOLEAN_TRUE);
    modelMaker.constructor = Box;
});