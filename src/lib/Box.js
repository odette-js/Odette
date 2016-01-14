application.scope(function (app) {
    var blank, _ = app._,
        extendFrom = _.extendFrom,
        factories = _.factories,
        Collection = _.Collection,
        Events = factories.Events,
        gapSplit = _.gapSplit,
        isObject = _.isObject,
        isStr = _.isString,
        isNum = _.isNumber,
        isFn = _.isFunction,
        each = _.each,
        duff = _.duff,
        find = _.find,
        isBlank = _.isBlank,
        isFunction = _.isFunction,
        duffRev = _.duffRev,
        push = _.push,
        has = _.has,
        map = _.map,
        toArray = _.toArray,
        clone = _.clone,
        once = _.once,
        parse = _.parse,
        extend = _.extend,
        listDrop = _.remove,
        property = _.property,
        stringify = _.stringify,
        isInstance = _.isInstance,
        isArrayLike = _.isArrayLike,
        upCase = _.upCase,
        camelCase = _.camelCase,
        isArray = _.isArray,
        objCondense = _.objCondense,
        intendedObject = _.intendedObject,
        LENGTH = 'length',
        PARENT = 'parent',
        INTERNAL_EVENTS = '_events',
        ATTRIBUTES = 'attributes',
        DISPATCH_EVENT = 'dispatchEvent',
        EVENT_REMOVE = '_removeEventList',
        ATTRIBUTE_HISTORY = '_attributeHistory',
        BOOLEAN_FALSE = !1,
        BOOLEAN_TRUE = !0,
        CHILDREN = 'children',
        CHANGE_COUNTER = '_changeCounter',
        toStringString = 'toString',
        prototypeString = 'prototype',
        CHANGED_STRING = 'change',
        constructorString = 'constructor',
        PREVIOUS_ATTRIBUTES = '_previousAttributes',
        /**
         * @class Box
         * @description event and attribute extensor object that creates the Box Constructor and convenience method at _.Box
         * @augments Model
         */
        Container = _.extendFrom.Events('Container', {
            constructor: function (attributes, secondary) {
                var model = this;
                model.cid = model.cid = _.uniqueId(model.cidPrefix);
                model.reset(attributes);
                _.extend(model, secondary);
                Events.apply(this, arguments);
                return model;
            },
            _reset: function (attributes_) {
                var childModel, children, model = this,
                    _altered = model._altered = {},
                    idAttr = _.result(model, 'idAttribute', arguments),
                    // automatically checks to see if the attributes are a string
                    attributes = parse(attributes_) || {},
                    // default attributes
                    attrs = _.result(model, 'defaults', arguments),
                    // build new attributes
                    newAttributes = extend(attrs, attributes),
                    // stale attributes
                    ret = model[ATTRIBUTES] || {},
                    history = model[ATTRIBUTE_HISTORY] = {};
                // set id and let parent know what your new id is
                this[DISPATCH_EVENT]('before:reset');
                model._setId(attributes[idAttr]);
                model[PREVIOUS_ATTRIBUTES] = {};
                // swaps attributes hash
                model[ATTRIBUTES] = newAttributes;
                // let everything know that it is changing
                model[DISPATCH_EVENT]('reset');
                return ret;
            },
            /**
             * @description remove attributes from the Box object. Does not completely remove from object with delete, but instead simply sets it to void 0 / undefined
             * @param {String} attr - property string that is on the attributes object
             * @returns {Box} instance the method was called on
             * @func
             * @name Box#unset
             */
            unset: function (attrs) {
                var attrObj = this[ATTRIBUTES];
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
                return !find(gapSplit(attrs), function (attr) {
                    return attributes[attr] === blank;
                });
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
                    history = model[ATTRIBUTE_HISTORY],
                    oldValue = attrs[key],
                    previousAttrsObject = model[PREVIOUS_ATTRIBUTES] = model[PREVIOUS_ATTRIBUTES] || {};
                if (!_.isEqual(oldValue, newValue)) {
                    previousAttrsObject[key] = oldValue;
                    history[key] = oldValue;
                    attrs[key] = newValue;
                    didChange = BOOLEAN_TRUE;
                }
                return didChange;
            },
            digester: function (fn) {
                var model = this;
                model[CHANGE_COUNTER] = model[CHANGE_COUNTER] || 0;
                model[CHANGE_COUNTER]++;
                ret = fn();
                model[CHANGE_COUNTER]--;
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
                    return model;
                }
                model.digester(function () {
                    duff(changedList, function (name) {
                        model[DISPATCH_EVENT](CHANGED_STRING + ':' + name, {
                            key: name,
                            // uses get to prevent stale data
                            value: model.get(name)
                        });
                    });
                    model[DISPATCH_EVENT](CHANGED_STRING, compiled);
                    return model;
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
                    id = id_ === void 0 ? _.uniqueId(!1) : id_ + '';
                model.id = id;
            },
            reset: function (attrs) {
                this._reset(attrs);
                return this;
            }
        }, true),
        Box = _.extendFrom.Container('Box', {
            /**
             * @description constructor function for the Box Object
             * @name Box#constructor
             * @func
             */
            cidPrefix: 'c',
            idAttribute: 'id',
            constructor: function (attributes, secondary) {
                var model = this;
                model[CHILDREN] = Collection();
                Container.apply(model, arguments);
                return model;
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
            _registerChild: function (id, model) {
                var parent = this;
                if (id !== void 0) {
                    parent.children.register(id, model);
                }
            },
            _unRegisterChild: function (id) {
                var parent = this;
                if (id !== void 0) {
                    parent.children.unRegister(id);
                }
            },
            resetChildren: function (newChildren) {
                var child, box = this,
                    children = box[CHILDREN],
                    arr = children.un();
                while (arr.length) {
                    child = arr[0];
                    if (child && child.destroy) {
                        child.destroy();
                    }
                    // if it didn't remove itself,
                    // then you should remove it here
                    // this doesn't work if the child is a basic data type
                    if (arr[0] === child) {
                        _.remove(arr, child);
                    }
                }
                box.add(newChildren);
                return box;
            },
            /**
             * @description calls toJSON on all children and creates an array of clones
             * @func
             * @name Box#childrenToJSON
             * @returns {Object} array of toJSON'ed children
             */
            childrenToJSON: function () {
                return this[CHILDREN].toJSON();
            },
            /**
             * @description conbination of toJSON and kids to JSON, applied recurisvely. "kids" are applied as the children property
             * @func
             * @name Box#treeToJSON
             * @returns {Object} JSON clone of attributes and children
             */
            treeToJSON: function () {
                var model = this,
                    attrClone = model.toJSON(),
                    children = model[CHILDREN];
                if (children.length()) {
                    attrClone[CHILDREN] = children.toJSON();
                }
                return attrClone;
            },
            /**
             * @description stringified version of children array
             * @func
             * @name Box#stringifyChildren
             * @returns {String} string version of children
             */
            stringifyChildren: function () {
                return stringify(this.childrenToJSON());
            },
            /**
             * @description stringifies parent, child, attributes tree
             * @func
             * @name Box#stringifyTree
             * @returns {String} string version of tree
             */
            stringifyTree: function () {
                return stringify(this.treeToJSON());
            },
            // registers and actually adds child to hash
            _addToHash: function (newModel) {
                var parent = this,
                    children = this.children;
                // add to collection
                children.add(newModel);
                // register with parent
                parent._registerChild(newModel.id, newModel);
                parent._registerChild(newModel.cid, newModel);
            },
            // ties child events to new child
            _delegateChildEvents: function (model) {
                var parent = this,
                    childEvents = _.result(parent, 'childEvents');
                if (model && childEvents) {
                    model._parentDelgatedChildEvents = childEvents;
                    parent.listenTo(model, childEvents);
                }
            },
            // ties child events to new child
            _unDelegateChildEvents: function (model) {
                if (model && model._parentDelgatedChildEvents && this.stopListening) {
                    this.stopListening(model, model._parentDelgatedChildEvents);
                }
            },
            _delegateParentEvents: function (model) {
                var parent = model.parent,
                    parentEvents = _.result(model, 'parentEvents');
                if (parent && parentEvents) {
                    model._delegatedParentEvents = parentEvents;
                    model.listenTo(parent, parentEvents);
                }
            },
            // ties child events to new child
            _unDelegateParentEvents: function (model) {
                var parent = this;
                if (model.stopListening && model._delegatedParentEvents) {
                    model.stopListening(parent, model._delegatedParentEvents);
                }
            },
            _isChildType: function (child) {
                return isInstance(child, this.Model);
            },
            // this one forcefully adds
            _add: function (model) {
                var parent = this,
                    children = parent[CHILDREN],
                    evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT]('before:added');
                // let the child know it's about to be added
                // (tied to it's parent via events)
                // unties boxes
                parent._remove(model);
                // explicitly tie to parent
                model.parent = parent;
                // attach events from parent
                parent._addToHash(model);
                // ties boxes together
                parent._delegateParentEvents(model);
                parent._delegateChildEvents(model);
                evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT]('added');
                // notify that you were added
                return model;
            },
            // public facing version filters
            add: function (objs, secondary_) {
                var childWasAdded, newModel, returnNewModel, parent = this,
                    children = parent[CHILDREN],
                    list = [],
                    secondary = extend(_.result(parent, 'childOptions'), secondary_ || {});
                // unwrap it if you were passed a collection
                if (isInstance(objs, _.Collection)) {
                    objs = objs.un();
                }
                if (!isArrayLike(objs)) {
                    objs = [objs];
                }
                if (parent.Model && objs[0]) {
                    list = map(objs, function (obj) {
                        var foundModel, isChildType = parent._isChildType(obj);
                        // create a new model
                        newModel = isChildType ? obj : new parent.Model(obj, secondary);
                        // find by the newly created's id
                        foundModel = children.get(newModel.id);
                        // out with the old
                        if (foundModel) {
                            // update the old model with new info
                            foundModel.set(newModel.toJSON());
                            newModel = foundModel;
                        } else {
                            childWasAdded = true;
                            parent._add(newModel);
                            // list to return
                        }
                        return newModel;
                    });
                    if (childWasAdded) {
                        parent[DISPATCH_EVENT]('child:added');
                    }
                }
                return list;
            },
            _removeFromHash: function (child) {
                var parent = this,
                    children = parent.children;
                if (children && child) {
                    // remove the child from the children hash
                    children.remove(child);
                    parent._unRegisterChild(child.id);
                    // unregister from the child hash keys
                    parent._unRegisterChild(child.cid);
                }
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
                    childMethodName = upCase(camelCase('on:child:' + name, ':')),
                    // onMethod = isFunction(origin[methodName]),
                    evnt = evnt_ || origin._createEvent(name, data),
                    parents = origin._collectParents(),
                    i = parents[LENGTH] - 1;
                while (parents[LENGTH] && parents[i] && !evnt.isStopped()) {
                    parent = parents[i];
                    if (parent._isDestroyed) {
                        evnt.stopImmediatePropagation();
                        i = 0;
                    } else {
                        parent._eventDispatcher(evnt);
                    }
                    i--;
                }
                // if (!evnt.isStopped()) {
                //     origin._eventDispatcher(evnt);
                // }
                while (origin && origin._eventDispatcher && !evnt.isStopped()) {
                    origin._eventDispatcher(evnt);
                    origin = !evnt.isStopped() && evnt.bubbles && origin[PARENT];
                }
                evnt.finished();
                return evnt;
                // var evnt =
                // var evnt, box = makeValidEvent(this),
                //     originalBox = box,
                //     currentEventArray = getCurrentEventList(originalBox),
                //     methodName = upCase(camelCase('on:' + name, ':')),
                //     childMethodName = upCase(camelCase('on:child:' + name, ':')),
                //     onMethod = isFunction(box[methodName]);
                // if (onMethod || getEventList(box, name).length || overrideEventCreation(options)) {
                //     evnt = box._createEvent(name, data);
                //     evnt.originalStack = BOOLEAN_TRUE;
                //     evnt.onMethodName = methodName;
                //     while (box && box[internalEventsString] && box._eventDispatcher && !evnt.isStopped()) {
                //         box._eventDispatcher(evnt);
                //         box = !evnt.isStopped() && evnt.bubbles && box[PARENT];
                //     }
                //     evnt.originalStack = BOOLEAN_FALSE;
                // }
            },
            _remove: function (model) {
                var parent = this;
                model[DISPATCH_EVENT]('before:removed');
                // notify the child that the remove pipeline is starting
                // remove the parent listeners
                parent._unDelegateParentEvents(model);
                parent._unDelegateChildEvents(model);
                // attach events from parent
                parent._removeFromHash(model);
                // void out the parent member tied directly to the model
                model.parent = void 0;
                model[DISPATCH_EVENT]('removed');
                // notify the child that the remove pipeline is done
                return model;
            },
            remove: function (idModel_) {
                var removedSomething, parent = this,
                    children = parent[CHILDREN],
                    retList = _.Collection(),
                    args = _.toArray(arguments).splice(1),
                    idModel = idModel_;
                if (!isObject(idModel)) {
                    // it's a string
                    idModel = parent.children.get(idModel + '');
                }
                if (idModel && isObject(idModel)) {
                    if (isInstance(idModel, _.Collection)) {
                        idModel = idModel.un();
                    }
                    if (!_.isArray(idModel)) {
                        idModel = [idModel];
                    }
                    duff(idModel, function (model) {
                        removedSomething = true;
                        parent._remove(model);
                        retList.add(model);
                    });
                    if (removedSomething) {
                        parent[DISPATCH_EVENT]('child:removed');
                    }
                }
                return retList;
            },
            /**
             * @description removes pointers from parent
             * @func
             * @name Box#destroy
             * @returns {Box} instance
             */
            destroy: function () {
                var removeRet, box = this;
                // notify things like parent that it's about to destroy itself
                box[DISPATCH_EVENT]('before:destroy');
                // destroys it's children
                box.resetChildren();
                // removes all parent / parent's child listeners
                removeRet = box.parent && box.parent.remove(box);
                // stop listening to other views
                box[DISPATCH_EVENT]('destroy');
                // stops listening to everything
                box.stopListening();
                // takes off all other event handlers
                box.offAll();
                return box;
            },
            /**
             * @description basic sort function
             * @param {Function|String} comparator - argument to sort children against
             * @returns {Box} instance
             * @func
             * @name Box#sort
             */
            sort: function (comparator) {
                var compString, isReversed, model = this,
                    children = model[CHILDREN];
                if (!comparator) {
                    comparator = model.comparator;
                }
                if (_.isString(comparator)) {
                    isReversed = comparator[0] === '!';
                    compString = comparator;
                    if (isReversed) {
                        compString = comparator.slice(1, comparator[LENGTH]);
                    }
                    comparator = function (a, b) {
                        var val, valA = a.get(compString),
                            valB = b.get(compString);
                        if (isReversed) {
                            val = valB - valA;
                        } else {
                            val = valA - valB;
                        }
                        return val;
                    };
                }
                model[DISPATCH_EVENT]('before:sort', model);
                children.sort(comparator);
                model[DISPATCH_EVENT]('sort', model);
                return model;
            }
        }, !0);
});