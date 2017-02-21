// var CHILDREN = capitalize(CHILD + 'ren'),
//     CHILD_OPTIONS = CHILD + 'Options',
//     CHILD_EVENTS = CHILD + EVENT_STRING,
//     DATA_MANAGER = 'DataManager',
//     MODEL = 'Model',
//     PARENT_STRING = 'Parent',
//     Model = app.block(function (app) {
//         var SORT = 'sort',
//             ADDED = 'added',
//             UNWRAP = 'unwrap',
//             REMOVED = 'removed',
//             STOP_LISTENING = 'stopListening',
//             DELEGATED_CHILD_EVENTS = '_delegatedParentEvents',
//             PARENT_DELEGATED_CHILD_EVENTS = '_parentDelgatedChildEvents',
//             modelMaker = function (attributes, options) {
//                 return Model(attributes, options);
//             },
//             // ties child events to new child
//             delegateChildEvents = function (parent, model) {
//                 var childsEventDirective, childEvents = result(parent, CHILD_EVENTS);
//                 if (model && childEvents) {
//                     childsEventDirective = model.directive(EVENT_MANAGER);
//                     // stash them
//                     childsEventDirective[PARENT_DELEGATED_CHILD_EVENTS] = childEvents;
//                     parent.listenTo(model, childEvents);
//                 }
//             },
//             // ties child events to new child
//             unDelegateChildEvents = function (parent, model) {
//                 var childsEventDirective, delegatedChildEvents;
//                 if (model && parent[STOP_LISTENING] && (childsEventDirective = model[EVENT_MANAGER]) && (delegatedChildEvents = childsEventDirective[PARENT_DELEGATED_CHILD_EVENTS])) {
//                     parent[STOP_LISTENING](model, delegatedChildEvents);
//                     delete childsEventDirective[DELEGATED_CHILD_EVENTS];
//                 }
//             },
//             delegateParentEvents = function (parent_, model) {
//                 var childsEventDirective, parent = model[PARENT],
//                     parentEvents = result(model, PARENT + 'Events');
//                 if (parent && parentEvents) {
//                     childsEventDirective = model.directive(EVENT_MANAGER);
//                     childsEventDirective[DELEGATED_CHILD_EVENTS] = parentEvents;
//                     model.listenTo(parent, parentEvents);
//                 }
//             },
//             // ties child events to new child
//             unDelegateParentEvents = function (parent, model) {
//                 var childsEventDirective, delegatedChildEvents;
//                 if (model[STOP_LISTENING] && (childsEventDirective = model[EVENT_MANAGER]) && (delegatedChildEvents = childsEventDirective[DELEGATED_CHILD_EVENTS])) {
//                     model[STOP_LISTENING](parent, delegatedChildEvents);
//                     delete childsEventDirective[DELEGATED_CHILD_EVENTS];
//                 }
//             },
//             SYNCER = 'Syncer',
//             wrapSyncer = function (type, successful) {
//                 return function (url) {
//                     var syncer = this,
//                         type = type + 'Type';
//                     if (!url) {
//                         exception('syncer methods must have a url');
//                     }
//                     return successful(syncer, url, type);
//                 };
//             },
//             sendWithData = function (syncer, url, type) {
//                 var json = syncer.toJSON();
//                 // return owner$.HTTP({
//                 //     url: url,
//                 //     type: type,
//                 //     data: syncer.stringifyPosts ? syncer.stringify(json) : json
//                 // });
//             },
//             Syncer = factories.Directive.extend(SYNCER, extend([{
//                 createType: 'POST',
//                 updateType: 'PUT',
//                 fetchType: 'GET',
//                 deleteType: 'DELETE',
//                 parse: parse,
//                 stringify: stringify,
//                 // base method for xhr things
//                 constructor: function (target) {
//                     this[TARGET] = target;
//                     return this;
//                 }
//             }, wrap(['destroy', 'fetch', 'update', 'create'], sendWithData, BOOLEAN_TRUE)])),
//             SyncerDirective = app.defineDirective(SYNCER, Syncer[CONSTRUCTOR]),
//             Children = factories[CHILDREN] = Collection.extend(CHILDREN, {
//                 constructor: function (instance) {
//                     this[TARGET] = instance;
//                     this[CONSTRUCTOR + COLON + COLLECTION]();
//                     return this;
//                 },
//                 // this one forcefully adds
//                 attach: function (model) {
//                     var directive = this,
//                         parent = directive[TARGET],
//                         // children = parent.directive(CHILDREN),
//                         evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](BEFORE_COLON + ADDED);
//                     // let the child know it's about to be added
//                     // (tied to it's parent via events)
//                     // unties models
//                     directive.detach(model);
//                     // explicitly tie to parent
//                     // attach events from parent
//                     directive.addToHash(model);
//                     directive.keep(ID, model.id, model, insertPosition(directive, model));
//                     // ties models together
//                     delegateParentEvents(parent, model);
//                     delegateChildEvents(parent, model);
//                     evt = model[DISPATCH_EVENT] && model[DISPATCH_EVENT](ADDED);
//                     // notify that you were added
//                     return model;
//                 },
//                 // lots of private events
//                 detach: function (model) {
//                     // cache the parent
//                     var parent, directive = this;
//                     // go through the model to get the correct parent
//                     if (!(parent = model[PARENT])) {
//                         return BOOLEAN_FALSE;
//                     }
//                     // let everyone know that this object is about to be removed
//                     model[DISPATCH_EVENT](BEFORE_COLON + REMOVED);
//                     // notify the child that the remove pipeline is starting
//                     // remove the parent events
//                     unDelegateParentEvents(parent, model);
//                     // have parent remove it's child events
//                     unDelegateChildEvents(parent, model);
//                     // attach events from parent
//                     directive.removeFromHash(model);
//                     // void out the parent member tied directly to the model
//                     delete model[PARENT];
//                     // let everyone know that you've offically separated
//                     model[DISPATCH_EVENT](REMOVED);
//                     // notify the child that the remove pipeline is done
//                     return BOOLEAN_TRUE;
//                 },
//                 addToHash: function (newModel) {
//                     var children = this,
//                         parent = children[TARGET];
//                     newModel[PARENT] = parent;
//                     // add to collection
//                     // children.add(newModel);
//                     // register with parent
//                     children[REGISTRY].keep('cid', newModel.cid, newModel);
//                 },
//                 removeFromHash: function (child) {
//                     var children = this;
//                     if (!child) {
//                         return;
//                     }
//                     // remove the child from the children hash
//                     // children.remove(child);
//                     children.drop(ID, child.id);
//                     // unregister from the child hash keys
//                     children[REGISTRY].drop('cid', child.cid);
//                 },
//                 // comparator: function (a) {
//                 //     return a.model.valueOf();
//                 // },
//                 //
//                 /**
//                  * @description resets the model's attributes to the object that is passed in
//                  * @name Model#reset
//                  * @func
//                  * @param {Object} attributes - non circular hash that is extended onto what the defaults object produces
//                  * @returns {Model} instance the method was called on
//                  */
//                 // set attrs, sync with update or create
//                 save: function () {},
//                 fetch: function () {}
//             }),
//             setMemo = function () {
//                 return {
//                     add: [],
//                     remove: [],
//                     update: []
//                 };
//             },
//             /**
//              * Class for holding other objects as children. Only one Children directive is available, but children can be nested infinitely.
//              * @class Parent
//              * @augments {Events}
//              */
//             Parent = factories.Parent = factories.Events.extend(PARENT_STRING,
//                 /**
//                  * @lends Parent.prototype
//                  */
//                 {
//                     /**
//                      * Default constructor for children of this object. By default, the Child property on the prototype is set to the Boolean true. This means that the parent object will create children that are instances of the constructor that they originated from. If this is set to a truthy value, then the Child property will be reponsible for holding the constructor that should be used for that child.
//                      * @method
//                      */
//                     Child: BOOLEAN_TRUE,
//                     childOptions: noop,
//                     parentEvents: noop,
//                     childEvents: noop,
//                     childConstructor: function () {
//                         return this.Child === BOOLEAN_TRUE ? this.__constructor__ : (this.Child || Parent);
//                     },
//                     isChildType: function (child) {
//                         return isInstance(child, this.childConstructor());
//                     },
//                     diff: function (opts_, secondary_) {
//                         var models, remove, parent = this,
//                             opts = opts_,
//                             secondary = secondary_ || {},
//                             children = parent.directive(CHILDREN),
//                             memo = setMemo(),
//                             diff = Collection(opts.add).reduce(function (memo, obj) {
//                                 var isChildType = parent.isChildType(obj),
//                                     // create a new model
//                                     // call it with new in case they use a constructor
//                                     Constructor = parent.childConstructor(obj),
//                                     newModel = isChildType ? obj : new Constructor(obj, secondary.shared),
//                                     // unfortunately we can only find by the newly created's id
//                                     // which we only know for sure
//                                     // after the child has been created ^
//                                     foundModel = children.get(ID, newModel.id);
//                                 if (foundModel) {
//                                     // update the old
//                                     foundModel.set(isChildType ? obj[TO_JSON]() : obj);
//                                     memo.update.push(foundModel);
//                                 } else {
//                                     // add the new
//                                     children.attach(newModel);
//                                     memo.add.push(newModel);
//                                 }
//                             }, opts.remove ? Collection(opts.remove).reduce(function (memo, model) {
//                                 var children, parent = model && model[PARENT];
//                                 if (!parent) {
//                                     return;
//                                 }
//                                 children = parent[CHILDREN];
//                                 if (children && children.detach(model)) {
//                                     memo.remove.push(model);
//                                 }
//                             }, memo) : memo);
//                         if (secondary.silent) {
//                             return diff;
//                         }
//                         if (diff.remove.length) {
//                             parent[DISPATCH_EVENT](CHILD + COLON + REMOVED, diff);
//                         }
//                         if (diff.add.length) {
//                             parent[DISPATCH_EVENT](CHILD + COLON + ADDED, diff);
//                         }
//                         if (diff.add.length || diff.remove.length) {
//                             parent[DISPATCH_EVENT](CHANGE_COLON + CHILD + COLON + 'count', diff);
//                         }
//                         return diff;
//                     },
//                     // public facing version filters
//                     add: function (objs_, secondary_) {
//                         var childAdded, diff, parent = this,
//                             children = parent.directive(CHILDREN),
//                             secondary = merge(result(parent, CHILD_OPTIONS), secondary_ || {}),
//                             list = Collection(objs_);
//                         // unwrap it if you were passed a collection
//                         if (!list[LENGTH]()) {
//                             return list[UNWRAP]();
//                         }
//                         return Collection(parent.diff({
//                             add: list
//                         }, {
//                             shared: secondary
//                         }).add);
//                     },
//                     remove: function (idModel_) {
//                         var children, models, parent = this,
//                             idModel = idModel_;
//                         if (idModel == NULL) {
//                             parent = parent[PARENT];
//                             return parent.remove(this);
//                         }
//                         if (!isObject(idModel) && (children = parent.directive(CHILDREN))) {
//                             // it's an id
//                             idModel = children.get(ID, idModel);
//                         }
//                         if (!idModel || !isObject(idModel)) {
//                             return setMemo();
//                         }
//                         return Collection(parent.diff({
//                             // make sure you get a copy
//                             remove: (idModel && Collection.isInstance(idModel) ? idModel.toArray() : toArray(idModel)).slice(0)
//                         }).remove);
//                     },
//                     /**
//                      * @description basic sort function
//                      * @param {Function|String} comparator - argument to sort children against
//                      * @returns {Model} instance
//                      */
//                     sort: function (comparator_) {
//                         var children, comparator, comparingAttribute, isReversed, model = this;
//                         if (!(children = model[CHILDREN])) {
//                             return model;
//                         }
//                         comparator = comparator_ || model.comparator;
//                         if (isString(comparator)) {
//                             isReversed = comparator[0] === '!';
//                             comparingAttribute = comparator;
//                             if (isReversed) {
//                                 comparingAttribute = comparator.slice(1);
//                             }
//                             comparator = function (a, b) {
//                                 var val_, val_A = a.get(comparingAttribute),
//                                     val_B = b.get(comparingAttribute);
//                                 if (isReversed) {
//                                     val_ = val_B - val_A;
//                                 } else {
//                                     val_ = val_A - val_B;
//                                 }
//                                 return val_;
//                             };
//                         }
//                         children[SORT](comparator);
//                         model[DISPATCH_EVENT](SORT);
//                         return model;
//                     },
//                     destroy: function () {
//                         var removeRet, model = this;
//                         if (!model.is(DESTROYING)) {
//                             // notify things like parent that it's about to destroy itself
//                             model[DISPATCH_EVENT](BEFORE_DESTROY);
//                         }
//                         // actually detach
//                         removeRet = model[PARENT] && model[PARENT].remove(model);
//                         // stop listening to other views
//                         model[DISPATCH_EVENT](DESTROY);
//                         // stops listening to everything
//                         model.stopListening();
//                         return model;
//                     }
//                 }),
//             /**
//              * @class Model
//              * @augments Parent
//              */
//             setId = function (model, id) {
//                 var identifier = model.id = (id === UNDEFINED ? app.counter() : id);
//                 return identifier;
//             },
//             writeProxy = function (method) {
//                 return function (key, value_, returnmodified_) {
//                     var everset = BOOLEAN_FALSE,
//                         triggerList = [],
//                         changedList = [],
//                         model = this,
//                         value = value_,
//                         data = model.directive(DATA_MANAGER),
//                         events = model[EVENT_MANAGER] || {
//                             has: noop
//                         },
//                         previous = {},
//                         returnmodified = returnmodified_;
//                     if (!data.is('frozen')) {
//                         intendedObject(key, value, function (key, value, third) {
//                             var changing, sets;
//                             if (!returnmodified && third) {
//                                 returnmodified = value_;
//                             }
//                             // definitely set the value, and let us know what happened
//                             // and if you're not changing already
//                             changing = data.changing(key);
//                             sets = data[method](key, value);
//                             everset = sets || everset;
//                             if (sets && !changing) {
//                                 changedList.push(key);
//                                 if (events.has(CHANGE_COLON + key)) {
//                                     triggerList.push(key);
//                                 }
//                             }
//                         });
//                     } else if (isObject(key) && value === BOOLEAN_TRUE) {
//                         returnmodified = BOOLEAN_TRUE;
//                     }
//                     if (returnmodified) {
//                         return changedList;
//                     }
//                     return model.modified(triggerList, everset);
//                 };
//             },
//             Model = factories[MODEL] = factories.Parent.extend(MODEL,
//                 /**
//                  * @lends Model.prototype
//                  */
//                 {
//                     'directive:creation:LinguisticsManager': factories.LinguisticsManager.extend({
//                         namespaceEvent: function (evnt) {
//                             return CHANGE_COLON + evnt;
//                         }
//                     }),
//                     // this id prefix is nonsense
//                     // define the actual key
//                     // idAttribute: ID,
//                     /**
//                      * @description remove attributes from the Model object. Does not completely remove from object with delete, but instead simply sets it to UNDEFINED / undefined
//                      * @param {String} attr - property string that is on the attributes object
//                      * @returns {Model} instance the method was called on
//                      * @func
//                      * @name Model#unset
//                      */
//                     unset: function (key) {
//                         var dataDirective = this[DATA_MANAGER];
//                         if (!dataDirective) {
//                             return BOOLEAN_FALSE;
//                         }
//                         var result = dataDirective.unset(key);
//                         if (result) {
//                             this.modified([key]);
//                         }
//                         return result;
//                     },
//                     /**
//                      * @description returns attribute passed into
//                      * @param {String} attr - property string that is being gotten from the attributes object
//                      * @returns {*} value that is present on the attributes object
//                      * @func
//                      * @name Model#get
//                      */
//                     get: checkParody(DATA_MANAGER, 'get'),
//                     /**
//                      * Create an escaped version of the key. Useful for putting into html
//                      * @param  {String} key Property that you would like to escape
//                      * @return {String}
//                      */
//                     escape: function (key) {
//                         return escape(this.get(key));
//                     },
//                     /**
//                      * @func
//                      * @param {String} attr - property string that is being gotten from the attributes object
//                      * @returns {Boolean} evaluation of whether or not the Model instance has a value at that attribute key
//                      * @description checks to see if the current attribute is on the attributes object as anything other an undefined
//                      * @name Model#has
//                      */
//                     keys: checkParody(DATA_MANAGER, 'keys', returnsArray),
//                     values: checkParody(DATA_MANAGER, 'values', returnsArray),
//                     has: checkParody(DATA_MANAGER, 'has', BOOLEAN_FALSE),
//                     idAttribute: returns('id'),
//                     defaults: returns.object,
//                     constructor: function (attributes, secondary) {
//                         var model = this;
//                         model.reset(attributes);
//                         this[CONSTRUCTOR + COLON + PARENT_STRING](secondary);
//                         return model;
//                     },
//                     idValue: function (key, attributes) {
//                         return attributes[key];
//                     },
//                     reset: function (data_) {
//                         var dataDirective, childModel, hasResetBefore, children, model = this,
//                             // automatically checks to see if the data is a string
//                             passed = parse(data_) || {},
//                             // build new data
//                             defaultsResult = model.defaults(passed),
//                             newAttributes = merge(defaultsResult, passed),
//                             // try to get the id from the attributes
//                             idValue = model.idValue(model.idAttribute(newAttributes), newAttributes),
//                             idResult = setId(model, idValue),
//                             keysResult = keys(newAttributes);
//                         // set id and let parent know what your new id is
//                         // setup previous data
//                         if ((hasResetBefore = model.is(RESET))) {
//                             model[DISPATCH_EVENT](BEFORE_COLON + RESET);
//                         }
//                         if (hasResetBefore || keysResult[LENGTH]) {
//                             dataDirective = model.directive(DATA_MANAGER);
//                             dataDirective[RESET](newAttributes);
//                         }
//                         // let everything know that it is changing
//                         model.mark(RESET);
//                         if (hasResetBefore) {
//                             model[DISPATCH_EVENT](RESET, newAttributes);
//                         }
//                         return model;
//                     },
//                     /**
//                      * @description collects a splat of arguments and condenses them into a single object. Object is then extended onto the attributes object and any items that are different will be fired as events
//                      * @param {...*} series - takes a series of key value pairs. can be mixed with objects. All key value pairs will be placed on a new object, which is to be passed into the function below
//                      * @func
//                      * @name Model#set
//                      * @returns {Model} instance
//                      */
//                     destroy: function () {
//                         // just a wrapper around the parent
//                         this[CONSTRUCTOR + COLON + PARENT_STRING].fn.destroy.call(this);
//                         delete this.id;
//                         return this;
//                     },
//                     set: writeProxy('set'),
//                     overwrite: writeProxy('overwrite'),
//                     modified: function (list, forcedigest) {
//                         var changes, model = this;
//                         if ((!list || !list[LENGTH]) && !forcedigest) {
//                             // do not digest... this time
//                             return model;
//                         }
//                         changes = model.directive(DATA_MANAGER).changes();
//                         return model.digest(list, function (name) {
//                             model[DISPATCH_EVENT](CHANGE_COLON + name, {
//                                 key: name,
//                                 value: changes[name]
//                             });
//                         });
//                     },
//                     digest: function (handler, fn) {
//                         var model = this,
//                             // cache the data directive in case it gets swapped out
//                             dataDirective = model.directive(DATA_MANAGER);
//                         dataDirective.increment();
//                         if (isFunction(handler)) {
//                             if (handler.length) {
//                                 dataDirective.increment();
//                                 handler(function () {
//                                     dataDirective.decrement();
//                                     model.digest(noop);
//                                 });
//                             } else {
//                                 handler();
//                             }
//                         } else {
//                             forEach(handler, fn);
//                         }
//                         dataDirective.decrement();
//                         // this event should only ever exist here
//                         if (!dataDirective.static()) {
//                             return model;
//                         }
//                         dataDirective.increment();
//                         model[DISPATCH_EVENT](CHANGE, dataDirective.changes());
//                         dataDirective.decrement();
//                         dataDirective.finish();
//                         return model;
//                     },
//                     /**
//                      * @description basic json clone of the attributes object
//                      * @func
//                      * @name Model#toJSON
//                      * @returns {Object} json clone of the attributes object
//                      */
//                     toJSON: function () {
//                         // does not prevent circular dependencies.
//                         // swap this out for something else if you want
//                         // to prevent circular dependencies
//                         return this.clone();
//                     },
//                     clone: checkParody(DATA_MANAGER, 'clone', function () {
//                         return {};
//                     }),
//                     valueOf: function () {
//                         return this.id;
//                     },
//                     change: Events.createEventCheck(CHANGE),
//                     /**
//                      * Convenience function for triggering a handler based on a filter.
//                      * @method
//                      * @param {String|Array} list event names, either as a space delineated list, or as an actual Array.
//                      * @param {*} filter Pass any parameter to filter the corresponding value by equality using the [isEqual]{@link _#isEqual} method.
//                      * @param {Function} fn handler when the filter is met, and evaluates truthy.
//                      * @returns {Events}
//                      * @example <caption>below the watch method waits until the property key is set to the string value.</caption>
//                      * events.watch("key", "value", function (e) {
//                      *     events.get("key") === "value"; // true
//                      * });
//                      */
//                     watch: setupWatcher(0),
//                     /**
//                      * Convenience function for triggering a handler based on a filter. Handler will be taken off after first trigger.
//                      * @method
//                      * @param {String|Array} list event names, either as a space delineated list, or as an actual Array.
//                      * @param {*} filter Pass any parameter to filter the corresponding value by equality using the [isEqual]{@link _#isEqual} method.
//                      * @param {Function} fn handler when the filter is met, and evaluates truthy.
//                      * @returns {Events}
//                      * @example <caption>The watchOnce method waits until the property key is set to the string value. Handler is taken off after it is triggered for the first time.</caption>
//                      * events.watchOnce("key", "value", function (e) {
//                      *     events.get("key") === "value"; // true
//                      * });
//                      */
//                     watchOnce: setupWatcher(0, 1),
//                     /**
//                      * Parody for the [listenTo]{@link Events#listenTo} method mixed with [watch]{@link Events#watch}. Basically it allows you to listen to another object and set up the same logic available in [watch]{@link Events#watch}.
//                      * @method
//                      * @param {String|Array} list event names, either as a space delineated list, or as an actual Array.
//                      * @param {*} filter Pass any parameter to filter the corresponding value by equality using the [isEqual]{@link _#isEqual} method.
//                      * @param {Function} fn handler when the filter is met, and evaluates truthy.
//                      * @returns {Events}
//                      * @example <caption>The watchOther method waits until the property key is set on another model to the string value.</caption>
//                      * events.watchOther(otherEvents, "key", "value", function (e) {
//                      *     otherEvents.get("key") === "value"; // true
//                      * });
//                      */
//                     watchOther: setupWatcher(1),
//                     /**
//                      * Convenience function for triggering a handler based on a filter. Handler will be taken off after first trigger.
//                      * @method
//                      * @param {String|Array} list event names, either as a space delineated list, or as an actual Array.
//                      * @param {Events} eventer an object that can have events attached and detached from it via the {@link EventsManager} directive.
//                      * @param {*} filter Pass any parameter to filter the corresponding value by equality using the [isEqual]{@link _#isEqual} method.
//                      * @param {Function} fn handler when the filter is met, and evaluates truthy.
//                      * @returns {Events}
//                      * @example <caption>The watchOther method waits until the property key is set on another model to the string value. Handler is taken off after it is triggered for the first time.</caption>
//                      * events.watchOtherOnce(otherEvents, "key", "value", function (e) {
//                      *     otherEvents.get("key") === "value"; // true
//                      * });
//                      */
//                     watchOtherOnce: setupWatcher(1, 1),
//                     /**
//                      * @description stringified version of attributes object
//                      * @func
//                      * @name Model#toString
//                      * @returns {String} stringified json version of
//                      */
//                     toString: function () {
//                         return stringify(this.clone());
//                     }
//                 });
//         function insertPosition(children, newModel) {
//             // children.
//         }
//         function changeCheckHandle(key, fn, context) {
//             var bound = bindTo(fn, context);
//             return function (e) {
//                 return has(e.data(), key) ? bound(e) : UNDEFINED;
//             };
//         }
//         // children should actually extend from collection.
//         // it should require certain things of the children it is tracking
//         // and should be able to listen to them
//         // app.defineDirective(CHILDREN, function () {
//         //     return new Collection[CONSTRUCTOR](NULL, BOOLEAN_TRUE);
//         // });
//         app.defineDirective(CHILDREN, Children[CONSTRUCTOR]);
//         // trick the modelMaker into thinking it is a Model Constructor
//         modelMaker[CONSTRUCTOR] = Model[CONSTRUCTOR];
//         return Model;
//     });