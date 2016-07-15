var CHILDREN = capitalize(CHILD + 'ren'),
    CHILD_OPTIONS = CHILD + 'Options',
    CHILD_EVENTS = CHILD + EVENTS_STRING;
app.scope(function (app) {
    var Events = factories.Events,
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
            var childsEventDirective, childEvents = result(parent, CHILD_EVENTS);
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
                parentEvents = result(model, PARENT + 'Events');
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
        wrapSyncer = function (type, successful) {
            return function (url) {
                var syncer = this,
                    type = type + 'Type';
                if (!url) {
                    exception('syncer methods must have a url');
                }
                return successful(syncer, url, type);
            };
        },
        sendWithData = function (syncer, url, type) {
            var json = syncer.toJSON();
            return factories.HTTP({
                url: url,
                type: type,
                data: syncer.stringifyPosts ? syncer.stringify(json) : json
            });
        },
        Syncer = factories.Directive.extend(SYNCER, _.extend({
            createType: 'POST',
            updateType: 'PUT',
            fetchType: 'GET',
            deleteType: 'DELETE',
            parse: parse,
            stringify: stringify,
            // base method for xhr things
            constructor: function (target) {
                this[TARGET] = target;
                return this;
            }
        }, wrap(['destroy', 'fetch', 'update', 'create'], sendWithData, BOOLEAN_TRUE))),
        SyncerDirective = app.defineDirective(SYNCER, Syncer[CONSTRUCTOR]),
        Children = factories[CHILDREN] = Collection.extend(CHILDREN, {
            constructor: function (instance) {
                this[TARGET] = instance;
                this[CONSTRUCTOR + COLON + COLLECTION]();
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
                    return BOOLEAN_FALSE;
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
                return BOOLEAN_TRUE;
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
            // set attrs, sync with update or create
            save: function () {},
            fetch: function () {}
        }),
        setMemo = function () {
            return {
                add: [],
                remove: [],
                update: []
            };
        },
        Parent = factories.Parent = factories.Events.extend('Parent', {
            Child: BOOLEAN_TRUE,
            childOptions: noop,
            parentEvents: noop,
            childEvents: noop,
            childConstructor: function () {
                return this.Child === BOOLEAN_TRUE ? this.__constructor__ : (this.Child || Parent);
            },
            isChildType: function (child) {
                return isInstance(child, this.childConstructor());
            },
            diff: function (opts_, secondary_) {
                var models, remove, parent = this,
                    opts = opts_,
                    secondary = secondary_ || {},
                    children = parent.directive(CHILDREN),
                    memo = setMemo(),
                    diff = Collection(opts.add).foldl(function (memo, obj) {
                        var isChildType = parent.isChildType(obj),
                            // create a new model
                            // call it with new in case they use a constructor
                            Constructor = parent.childConstructor(),
                            newModel = isChildType ? obj : new Constructor(obj, secondary.shared),
                            // unfortunately we can only find by the newly created's id
                            // which we only know for sure after the child has been created ^
                            foundModel = children.get(ID, newModel.id);
                        if (foundModel) {
                            // update the old
                            foundModel.set(isChildType ? obj[TO_JSON]() : obj);
                            memo.update.push(foundModel);
                        } else {
                            // add the new
                            children.attach(newModel);
                            memo.add.push(newModel);
                        }
                    }, opts.remove ? Collection(opts.remove).foldl(function (memo, model) {
                        var children, parent = model && model[PARENT];
                        if (!parent) {
                            return;
                        }
                        children = parent[CHILDREN];
                        if (children && children.detach(model)) {
                            memo.remove.push(model);
                        }
                    }, memo) : memo);
                if (secondary.silent) {
                    return diff;
                }
                if (diff.remove.length) {
                    parent[DISPATCH_EVENT](CHILD + COLON + REMOVED, diff);
                }
                if (diff.add.length) {
                    parent[DISPATCH_EVENT](CHILD + COLON + ADDED, diff);
                }
                if (diff.add.length || diff.remove.length) {
                    parent[DISPATCH_EVENT](CHANGE_COLON + CHILD + COLON + 'count', diff);
                }
                return diff;
            },
            // public facing version filters
            add: function (objs_, secondary_) {
                var childAdded, diff, parent = this,
                    children = parent.directive(CHILDREN),
                    secondary = extend(result(parent, CHILD_OPTIONS), secondary_ || {}),
                    list = Collection(objs_);
                // unwrap it if you were passed a collection
                if (!list[LENGTH]()) {
                    return list[UNWRAP]();
                }
                return Collection(parent.diff({
                    add: list
                }, {
                    shared: secondary
                }).add);
            },
            remove: function (idModel_) {
                var children, models, parent = this,
                    idModel = idModel_;
                if (idModel == NULL) {
                    parent = parent[PARENT];
                    return parent.remove(this);
                }
                if (!isObject(idModel) && (children = parent.directive(CHILDREN))) {
                    // it's an id
                    idModel = children.get(ID, idModel);
                }
                if (!idModel || !isObject(idModel)) {
                    return setMemo();
                }
                return Collection(parent.diff({
                    // make sure you get a copy
                    remove: (idModel && Collection.isInstance(idModel) ? idModel.toArray() : toArray(idModel)).slice(0)
                }).remove);
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
                comparator = comparator_ || model.comparator;
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
            // idAttribute: ID,
            /**
             * @description remove attributes from the Model object. Does not completely remove from object with delete, but instead simply sets it to UNDEFINED / undefined
             * @param {String} attr - property string that is on the attributes object
             * @returns {Model} instance the method was called on
             * @func
             * @name Model#unset
             */
            unset: function (key) {
                var dataDirective = this[DATA];
                if (!dataDirective) {
                    return BOOLEAN_FALSE;
                }
                var result = dataDirective.unset(key);
                this.modified([key]);
                return result;
            },
            // checkParody(DATA, 'unset', BOOLEAN_FALSE),
            /**
             * @description returns attribute passed into
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {*} value that is present on the attributes object
             * @func
             * @name Model#get
             */
            get: checkParody(DATA, 'get'),
            escape: function (key) {
                return escape(this.get(key));
            },
            /**
             * @func
             * @param {String} attr - property string that is being gotten from the attributes object
             * @returns {Boolean} evaluation of whether or not the Model instance has a value at that attribute key
             * @description checks to see if the current attribute is on the attributes object as anything other an undefined
             * @name Model#has
             */
            keys: checkParody(DATA, 'keys', returnsArray),
            values: checkParody(DATA, 'values', returnsArray),
            has: checkParody(DATA, 'has', BOOLEAN_FALSE),
            idAttribute: returns('id'),
            constructor: function (attributes, secondary) {
                var model = this;
                model.reset(attributes);
                this[CONSTRUCTOR + COLON + EVENTS_STRING](secondary);
                return model;
            },
            defaults: function () {
                return {};
            },
            reset: function (data_) {
                var dataDirective, childModel, hasResetBefore, children, model = this,
                    // automatically checks to see if the data is a string
                    passed = parse(data_) || {},
                    // build new data
                    defaultsResult = model.defaults(passed),
                    newAttributes = extend(defaultsResult, passed),
                    // try to get the id from the attributes
                    idAttributeResult = model.idAttribute(newAttributes),
                    idResult = setId(model, newAttributes[idAttributeResult]),
                    keysResult = keys(newAttributes);
                // set id and let parent know what your new id is
                // setup previous data
                if ((hasResetBefore = model.is(RESET))) {
                    model[DISPATCH_EVENT](BEFORE_COLON + RESET);
                }
                if (hasResetBefore || keysResult[LENGTH]) {
                    dataDirective = model.directive(DATA);
                    dataDirective[RESET](newAttributes);
                }
                // let everything know that it is changing
                model.mark(RESET);
                if (hasResetBefore) {
                    model[DISPATCH_EVENT](RESET, newAttributes);
                }
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
                Parent.fn.destroy.call(this);
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
                    // defconinitely set the value, and let us know what happened
                    // and if you're not changing already, (already)
                    if (dataDirective.set(key, value) && !dataDirective.changing[name]) {
                        eventsDirective = eventsDirective || model.directive(EVENTS);
                        // eventsDirective.queueStack(CHANGE_COLON + key);
                        changedList.push(key);
                    }
                });
                model.modified(changedList);
                return model;
            },
            modified: function (list) {
                var dataDirective, model = this;
                // do not digest... this time
                if (!list[LENGTH]) {
                    return model;
                }
                dataDirective = model.directive(DATA);
                model.digest(function () {
                    duff(list, function (name) {
                        var eventName = CHANGE_COLON + name,
                            previous = dataDirective.changing[name];
                        dataDirective.changing[name] = BOOLEAN_TRUE;
                        model[DISPATCH_EVENT](eventName);
                        dataDirective.changing[name] = BOOLEAN_FALSE;
                    });
                });
                return model;
            },
            digest: function (handler) {
                var model = this,
                    dataDirective = model.directive(DATA);
                dataDirective.increment();
                handler();
                dataDirective.decrement();
                // this event should only ever exist here
                if (dataDirective.static()) {
                    model[DISPATCH_EVENT](CHANGE, dataDirective[CHANGING]);
                    dataDirective.finish();
                }
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
            clone: checkParody(DATA, 'clone', function () {
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
var Model = factories.Model;