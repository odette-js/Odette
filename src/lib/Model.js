var CHILDREN = upCase(CHILD + 'ren');
app.scope(function (app) {
    var Collection = factories.Collection,
        Events = factories.Events,
        List = factories.Collection,
        SORT = 'sort',
        ADDED = 'added',
        UNWRAP = 'unwrap',
        REMOVED = 'removed',
        STOP_LISTENING = 'stopListening',
        _DELEGATED_CHILD_EVENTS = '_delegatedParentEvents',
        _PARENT_DELEGATED_CHILD_EVENTS = '_parentDelgatedChildEvents',
        modelMaker = function (attributes, options) {
            return Model(attributes, options);
        },
        // ties child events to new child
        _delegateChildEvents = function (parent, model) {
            var childsEventDirective, childEvents = _.result(parent, CHILD + 'Events');
            if (model && childEvents) {
                childsEventDirective = model.directive(EVENTS);
                // stash them
                childsEventDirective[_PARENT_DELEGATED_CHILD_EVENTS] = childEvents;
                parent.listenTo(model, childEvents);
            }
        },
        // ties child events to new child
        _unDelegateChildEvents = function (parent, model) {
            var childsEventDirective;
            if (model && parent[STOP_LISTENING] && (childsEventDirective = model[EVENTS]) && childsEventDirective[_PARENT_DELEGATED_CHILD_EVENTS]) {
                parent[STOP_LISTENING](model, model[_PARENT_DELEGATED_CHILD_EVENTS]);
                childsEventDirective[_PARENT_DELEGATED_CHILD_EVENTS] = UNDEFINED;
            }
        },
        _delegateParentEvents = function (parent_, model) {
            var childsEventDirective, parent = model[PARENT],
                parentEvents = _.result(model, PARENT + 'Events');
            if (parent && parentEvents) {
                childsEventDirective = model.directive(EVENTS);
                childsEventDirective[_DELEGATED_CHILD_EVENTS] = parentEvents;
                model.listenTo(parent, parentEvents);
            }
        },
        // ties child events to new child
        _unDelegateParentEvents = function (parent, model) {
            var childsEventDirective;
            if (model[STOP_LISTENING] && (childsEventDirective = model[EVENTS]) && childsEventDirective[_DELEGATED_CHILD_EVENTS]) {
                model[STOP_LISTENING](parent, model[_DELEGATED_CHILD_EVENTS]);
                childsEventDirective[_DELEGATED_CHILD_EVENTS] = UNDEFINED;
            }
        },
        SYNCER = 'Syncer',
        Syncer = factories[SYNCER] = factories.Events.extend(SYNCER, {
            // base method for xhr things
            sync: function () {},
            // delete request. request that this model be deleted by the server
            destroy: function () {},
            // get request. this model needs an update
            fetch: function () {},
            // put - second+ time
            update: function () {},
            // post - first time
            create: function () {}
        }),
        SyncerDirective = app.defineDirective(SYNCER, Syncer[CONSTRUCTOR]),
        Children = factories[CHILDREN] = factories.Collection.extend(CHILDREN, {
            constructor: function (instance) {
                this[TARGET] = instance;
                factories.Collection[CONSTRUCTOR].call(this);
                return this;
            },
            // this one forcefully adds
            attach: function (model) {
                var directive = this,
                    parent = directive[TARGET],
                    // children = parent.directive(CHILDREN),
                    evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](BEFORE_COLON + ADDED);
                // let the child know it's about to be added
                // (tied to it's parent via events)
                // unties models
                directive.detach(model);
                // explicitly tie to parent
                // attach events from parent
                directive.addToHash(model);
                // ties models together
                _delegateParentEvents(parent, model);
                _delegateChildEvents(parent, model);
                evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](ADDED);
                // notify that you were added
                return model;
            },
            // lots of private events
            detach: function (model) {
                // cache the parent
                var parent, directive = this;
                // go through the model to get the correct parent
                if (!(parent = model[PARENT])) {
                    return model;
                }
                // let everyone know that this object is about to be removed
                model[DISPATCH_EVENT](BEFORE_COLON + REMOVED);
                // notify the child that the remove pipeline is starting
                // remove the parent events
                _unDelegateParentEvents(parent, model);
                // have parent remove it's child events
                _unDelegateChildEvents(parent, model);
                // attach events from parent
                directive.removeFromHash(model);
                // void out the parent member tied directly to the model
                delete model[PARENT];
                // let everyone know that you've offically separated
                model[DISPATCH_EVENT](REMOVED);
                // notify the child that the remove pipeline is done
                return model;
            },
            addToHash: function (newModel) {
                var children = this,
                    parent = children[TARGET];
                newModel[PARENT] = parent;
                // add to collection
                children.add(newModel);
                // register with parent
                children.keep(ID, newModel.id, newModel);
                children.keep('cid', newModel.cid, newModel);
            },
            removeFromHash: function (child) {
                var directive = this;
                if (!child) {
                    return;
                }
                // remove the child from the children hash
                directive.remove(child);
                directive.drop(ID, child.id);
                // unregister from the child hash keys
                directive.drop('cid', child.cid);
            },
            /**
             * @description resets the model's attributes to the object that is passed in
             * @name Model#reset
             * @func
             * @param {Object} attributes - non circular hash that is extended onto what the defaults object produces
             * @returns {Model} instance the method was called on
             */
            // reset: function (newChildren) {
            //     var length, child, directive = this,
            //         model = directive[TARGET],
            //         arr = directive[UNWRAP]();
            //     // this can be made far more efficient
            //     while (arr[LENGTH]) {
            //         child = arr[0];
            //         length = arr[LENGTH];
            //         // if (child) {
            //         result(child, DESTROY);
            //         // }
            //         // if it didn't remove itself,
            //         // then you should remove it here
            //         // this gets run if the child is a basic data type
            //         if (arr[0] === child && arr[LENGTH] === length) {
            //             remove(arr, child);
            //         }
            //     }
            //     model.add(newChildren);
            //     return model;
            // },
            // set attrs, sync with update or create
            save: function () {},
            fetch: function () {}
        }),
        Parent = factories.Parent = factories.Events.extend('Parent', {
            Child: BOOLEAN_TRUE,
            childConstructor: function () {
                return this.Child === BOOLEAN_TRUE ? this.__constructor__ : (this.Child || Parent);
            },
            isChildType: function (child) {
                return isInstance(child, this.childConstructor());
            },
            // public facing version filters
            add: function (objs_, secondary_) {
                var childAdded, parent = this,
                    children = parent.directive(CHILDREN),
                    secondary = extend(result(parent, CHILD + 'Options'), secondary_ || {}),
                    list = Collection(objs_);
                // unwrap it if you were passed a collection
                if (!list[LENGTH]()) {
                    return list[UNWRAP]();
                }
                list = list.foldl(function (memo, obj) {
                    var isChildType = parent.isChildType(obj),
                        // create a new model
                        // call it with new in case they use a constructor
                        Constructor = parent.childConstructor(),
                        newModel = isChildType ? obj : new Constructor(obj, secondary),
                        // unfortunately we can only find by the newly created's id
                        // which we only know for sure after the child has been created ^
                        foundModel = children.get(ID, newModel.id);
                    if (foundModel) {
                        // update the old
                        foundModel.set(isChildType ? obj[TO_JSON]() : obj);
                        newModel = foundModel;
                    } else {
                        // add the new
                        childAdded = BOOLEAN_TRUE;
                        children.attach(newModel);
                    }
                    memo.push(newModel);
                    return memo;
                }, []);
                if (childAdded) {
                    parent[DISPATCH_EVENT](CHILD + COLON + ADDED);
                }
                return list;
            },
            remove: function (idModel_) {
                var retList, children, models, parent = this,
                    idModel = idModel_;
                if (idModel == NULL) {
                    parent = parent[PARENT];
                    return parent.remove(this);
                }
                retList = Collection();
                if (!isObject(idModel) && (children = parent.directive(CHILDREN))) {
                    // it's an id
                    idModel = children.get(ID, idModel);
                }
                if (!idModel || !isObject(idModel)) {
                    return retList;
                }
                models = idModel && idModel.unwrap ? idModel.unwrap() : idModel;
                Collection(models).each(function (model) {
                    var result, children, parent = model[PARENT];
                    retList.push(model);
                    if (!parent) {
                        return;
                    }
                    children = parent[CHILDREN];
                    result = children && children.detach(model);
                });
                if (retList[LENGTH]()) {
                    parent[DISPATCH_EVENT](CHILD + COLON + REMOVED);
                }
                return retList;
            },
            /**
             * @description basic sort function
             * @param {Function|String} comparator - argument to sort children against
             * @returns {Model} instance
             * @func
             * @name Model#sort
             */
            sort: function (comparator_) {
                var children, comparator, comparingAttribute, isReversed, model = this;
                if (!(children = model[CHILDREN])) {
                    return model;
                }
                comparator = comparator_ || result(model, 'comparator');
                if (isString(comparator)) {
                    isReversed = comparator[0] === '!';
                    comparingAttribute = comparator;
                    if (isReversed) {
                        comparingAttribute = comparator.slice(1);
                    }
                    comparator = function (a, b) {
                        var val_, val_A = a.get(comparingAttribute),
                            val_B = b.get(comparingAttribute);
                        if (isReversed) {
                            val_ = val_B - val_A;
                        } else {
                            val_ = val_A - val_B;
                        }
                        return val_;
                    };
                }
                children[SORT](comparator);
                model[DISPATCH_EVENT](SORT);
                return model;
            },
            destroy: function () {
                var removeRet, model = this;
                if (!model.is(DESTROYING)) {
                    // notify things like parent that it's about to destroy itself
                    model[DISPATCH_EVENT](BEFORE_DESTROY);
                }
                // actually detach
                removeRet = model[PARENT] && model[PARENT].remove(model);
                // stop listening to other views
                model[DISPATCH_EVENT](DESTROY);
                // stops listening to everything
                model.stopListening();
                return model;
            }
        }),
        /**
         * @class Model
         * @augments Events
         */
        uniqueCounter = 0,
        setId = function (model, id) {
            model.id = (id === UNDEFINED ? ++uniqueCounter : id);
            return uniqueCounter;
        },
        Model = factories.Model = factories.Parent.extend('Model', {
            // this id prefix is nonsense
            // define the actual key
            idAttribute: ID,
            /**
             * @description remove attributes from the Model object. Does not completely remove from object with delete, but instead simply sets it to UNDEFINED / undefined
             * @param {String} attr - property string that is on the attributes object
             * @returns {Model} instance the method was called on
             * @func
             * @name Model#unset
             */
            unset: directives.checkParody(DATA, 'unset', BOOLEAN_FALSE),
            /**
             * @description returns attribute passed into
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {*} value that is present on the attributes object
             * @func
             * @name Model#get
             */
            get: directives.checkParody(DATA, 'get'),
            /**
             * @func
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {Boolean} evaluation of whether or not the Model instance has a value at that attribute key
             * @description checks to see if the current attribute is on the attributes object as anything other an undefined
             * @name Model#has
             */
            has: directives.checkParody(DATA, 'has', BOOLEAN_FALSE),
            constructor: function (attributes, secondary) {
                var model = this;
                model.reset(attributes);
                Events[CONSTRUCTOR].call(this, secondary);
                return model;
            },
            reset: function (data_) {
                var childModel, firstReset, children, model = this,
                    // automatically checks to see if the data is a string
                    passed = parse(data_) || {},
                    // build new data
                    defaultsResult = result(model, 'defaults', passed),
                    newAttributes = extend(defaultsResult, passed),
                    // try to get the id from the attributes
                    idAttributeResult = result(model, 'idAttribute', newAttributes),
                    idResult = setId(model, newAttributes[idAttributeResult]),
                    keysResult = keys(newAttributes),
                    dataDirective = model.directive(DATA);
                // set id and let parent know what your new id is
                // setup previous data
                if ((firstReset = model.is(RESET))) {
                    model[DISPATCH_EVENT](BEFORE_COLON + RESET);
                }
                dataDirective[RESET](newAttributes);
                // let everything know that it is changing
                if (firstReset) {
                    model[DISPATCH_EVENT](RESET, newAttributes);
                }
                model.mark(RESET);
                return model;
            },
            /**
             * @description collects a splat of arguments and condenses them into a single object. Object is then extended onto the attributes object and any items that are different will be fired as events
             * @param {...*} series - takes a series of key value pairs. can be mixed with objects. All key value pairs will be placed on a new object, which is to be passed into the function below
             * @func
             * @name Model#set
             * @returns {Model} instance
             */
            destroy: function () {
                Parent[CONSTRUCTOR][PROTOTYPE].destroy.call(this);
                delete this.id;
                return this;
            },
            set: function (key, value) {
                var changedList = [],
                    model = this,
                    dataDirective = model.directive(DATA),
                    previous = {},
                    eventsDirective;
                intendedObject(key, value, function (key, value) {
                    // definitely set the value, and let us know what happened
                    // and if you're not changing already, (already)
                    if (dataDirective.set(key, value) && !dataDirective.changing[name]) {
                        eventsDirective = eventsDirective || model.directive(EVENTS);
                        eventsDirective.queueStack(CHANGE_COLON + key);
                        changedList.push(key);
                    }
                });
                // do not digest... this time
                if (!changedList[LENGTH]) {
                    return model;
                }
                // list
                dataDirective.digest(model, function () {
                    duff(changedList, function (name) {
                        var eventName = CHANGE_COLON + name;
                        dataDirective.changing[name] = BOOLEAN_TRUE;
                        eventsDirective.unQueueStack(eventName);
                        model[DISPATCH_EVENT](eventName);
                        dataDirective.changing[name] = BOOLEAN_FALSE;
                    });
                });
                return model;
            },
            /**
             * @description basic json clone of the attributes object
             * @func
             * @name Model#toJSON
             * @returns {Object} json clone of the attributes object
             */
            toJSON: function () {
                // does not prevent circular dependencies.
                // swap this out for something else if you want
                // to prevent circular dependencies
                return this.clone();
            },
            clone: directives.checkParody(DATA, 'clone', function () {
                return {};
            }),
            valueOf: function () {
                return this.id;
            },
            /**
             * @description stringified version of attributes object
             * @func
             * @name Model#stringify
             * @returns {String} stringified json version of
             */
            toString: function () {
                return stringify(this);
            }
        });
    // children should actually extend from collection.
    // it should require certain things of the children it is tracking
    // and should be able to listen to them
    // app.defineDirective(CHILDREN, function () {
    //     return new Collection[CONSTRUCTOR](NULL, BOOLEAN_TRUE);
    // });
    app.defineDirective(CHILDREN, Children[CONSTRUCTOR]);
    // trick the modelMaker into thinking it is a Model Constructor
    modelMaker[CONSTRUCTOR] = Model[CONSTRUCTOR];
});