var COLLECTION = 'Collection',
    REVERSED = 'reversed',
    REGISTRY = 'Registry',
    DELIMITED = 'delimited',
    STRING_MANAGER = 'StringManager',
    SORTED_COLLECTION = 'Sorted' + COLLECTION,
    // now we start with some privacy
    Collection = app.block(function (app) {
        var isNullMessage = 'object must not be null or ' + UNDEFINED,
            validIdMessage = 'objects in sorted collections must have either a number or string for their valueOf result',
            cannotModifyMessage = 'list cannot be modified while it is being iterated over',
            doToAll = function (handler) {
                return function (list, items, lookAfter, lookBefore, fromRight) {
                    var count = 0;
                    duff(items, function (item) {
                        count += remove(list, item, lookAfter, lookBefore, fromRight);
                    });
                    return count === list[LENGTH];
                };
            },
            remove = function (list, item, lookAfter, lookBefore, fromRight) {
                var index = indexOf(list, item, lookAfter, lookBefore, fromRight);
                if (index + 1) {
                    removeAt(list, index);
                }
                index = index + 1;
                return !!index;
            },
            removeAll = doToAll(remove),
            removeAt = function (list, index) {
                return list.splice(index, 1)[0];
            },
            add = function (list, item, lookAfter, lookBefore, fromRight) {
                var value = 0,
                    index = indexOf(list, item, lookAfter, lookBefore, fromRight);
                if (index === -1) {
                    value = list.push(item);
                }
                return !!value;
            },
            addAll = doToAll(add),
            insertAt = function (list, item, index) {
                var len = list[LENGTH],
                    lastIdx = len || 0;
                list.splice(index || 0, 0, item);
                return len !== list[LENGTH];
            },
            eq = function (list, num, caller_) {
                var n, thisNum, caller = caller_ || noop,
                    items = [],
                    numb = num || 0,
                    isNumberResult = isNumber(numb),
                    isArrayLikeResult = isArrayLike(numb);
                if (numb < 0) {
                    isNumberResult = !1;
                }
                if (!list[LENGTH]) {
                    return items;
                }
                if (isNumberResult) {
                    items = [list[numb]];
                    caller(items[0]);
                } else {
                    if (isArrayLikeResult) {
                        duff(numb, function (num) {
                            var item = list[num];
                            items.push(item);
                            caller(item);
                        });
                    } else {
                        items = [list[0]];
                        caller(items[0]);
                    }
                }
                return items;
            },
            range = function (start, stop, step, inclusive) {
                var length, range, idx;
                if (stop == NULL) {
                    stop = start || 0;
                    start = 0;
                }
                if (!isFinite(start) || !isNumber(start)) {
                    start = 0;
                }
                step = +step || 1;
                length = Math.max(Math.ceil((stop - start) / step), 0) + (+inclusive || 0);
                range = [];
                idx = 0;
                while (idx < length) {
                    range[idx] = start;
                    idx++;
                    start += step;
                }
                return range;
            },
            count = function (list, runner_, ctx_, start, end) {
                var runner, obj, idx, ctx;
                if (start >= end || !isNumber(start) || !isNumber(end) || !isFinite(start) || !isFinite(end)) {
                    return list;
                }
                ctx = ctx_ || this;
                runner = bindTo(runner_, ctx);
                end = Math.abs(end);
                idx = start;
                while (idx < end) {
                    obj = NULL;
                    if (list[LENGTH] > idx) {
                        obj = list[idx];
                    }
                    runner(obj, idx, list);
                    idx++;
                }
                return list;
            },
            countTo = function (list, runner, ctx, num) {
                return count(list, runner, ctx, 0, num);
            },
            countFrom = function (list, runner, ctx, num) {
                return count(list, runner, ctx, num, list[LENGTH]);
            },
            closestIndex = function (array, searchElement, minIndex_, maxIndex_) {
                var currentIndex, currentElement, found,
                    minIndex = minIndex_ || 0,
                    maxIndex = maxIndex_ || array[LENGTH] - 1;
                while (minIndex <= maxIndex) {
                    currentIndex = (minIndex + maxIndex) / 2 | 0;
                    currentElement = array[currentIndex];
                    // calls valueOf
                    if (currentElement < searchElement) {
                        minIndex = currentIndex + 1;
                    } else if (currentElement > searchElement) {
                        maxIndex = currentIndex - 1;
                    } else {
                        return currentIndex;
                    }
                }
                found = ~~maxIndex;
                return found;
            },
            recreateSelf = function (fn, ctx) {
                return function () {
                    return new this[CONSTRUCTOR_KEY](fn.apply(ctx || this, arguments));
                };
            },
            Registry = factories[REGISTRY] = factories.Directive.extend(REGISTRY, {
                constructor: function () {
                    this.reset();
                    return this;
                },
                get: function (category, id, method) {
                    var cat = this.register[category];
                    var item = cat && cat[id];
                    if (item === UNDEFINED && method) {
                        item = method();
                        this.keep(category, id, item);
                    }
                    return item;
                },
                keep: function (category, id, value) {
                    var register = this.register,
                        cat = register[category] = register[category] || {};
                    if (value === UNDEFINED) {
                        delete cat[id];
                    } else {
                        cat[id] = value;
                    }
                    return this;
                },
                ungroup: function (category) {
                    return this.group(category, {});
                },
                group: function (category, setter) {
                    var register = this.register;
                    register[category] = setter || register[category] || {};
                    return register[category];
                },
                swap: function (category, id, value) {
                    var cached = this.get(category, id);
                    this.keep(category, id, value);
                    return cached;
                },
                drop: function (category, id) {
                    return this.swap(category, id);
                },
                reset: function (registry, count) {
                    var cached = this.register;
                    this.register = registry || {};
                    return cached;
                }
            }),
            recreatingSelfCollection = toArray('eq,where,whereNot,map,results,filter,cycle,uncycle,flatten,gather,unique'),
            eachHandlers = {
                each: duff,
                duff: duff,
                forEach: duff,
                eachCall: eachCall,
                eachCallTry: eachCallTry,
                eachRight: duffRight,
                duffRight: duffRight,
                forEachRight: duffRight,
                eachCallRight: eachCallRight
            },
            eachHandlerKeys = keys(eachHandlers),
            abstractedCanModify = toArray('add'),
            abstractedCannotModify = toArray('insertAt,remove,removeAt'),
            nativeCannotModify = toArray('pop,shift,splice'),
            reverseCollection = toArray('reverse'),
            splatHandlers = toArray('push,unshift'),
            joinHandlers = toArray('join'),
            countingCollection = toArray('count,countTo,countFrom,merge'),
            foldIteration = toArray('foldr,foldl,reduce'),
            findIteration = toArray('find,findLast,findWhere,findLastWhere'),
            indexers = toArray('indexOf'),
            foldFindIteration = foldIteration.concat(findIteration),
            marksIterating = function (fn) {
                return function (one, two, three, four, five, six) {
                    var result, list = this;
                    ++list.iterating;
                    result = fn(list, one, two, three, four, five, six);
                    --list.iterating;
                    return result;
                };
            },
            wrappedCollectionMethods = extend({
                seeker: function (handler, context) {
                    var list = this,
                        bound = bindTo(handler, context);
                    return duffRight(list.toArray(), function (one, two, three) {
                        if (bound(one, two, three)) {
                            list.removeAt(two);
                        }
                    });
                },
                slice: function (one, two) {
                    return new Collection(this.toArray().slice(one, two));
                }
            }, wrap(joinHandlers, function (name) {
                return function (arg) {
                    return this.toArray()[name](arg);
                };
            }), wrap(indexers.concat(abstractedCanModify), function (name) {
                return function (one, two, three, four, five) {
                    var list = this;
                    return _[name](list.toArray(), one, two, three, four, five);
                };
            }), wrap(splatHandlers, function (name) {
                return function (args_) {
                    var args = isArray(args_) ? args_ : arguments,
                        items = this.toArray();
                    return items[name].apply(items, args);
                };
            }), wrap(nativeCannotModify, function (name) {
                return function (one, two, three, four, five, six) {
                    var list = this;
                    if (list.iterating) {
                        return exception(cannotModifyMessage);
                    }
                    return list.toArray()[name](one, two, three, four, five, six);
                };
            }), wrap(abstractedCannotModify, function (name) {
                return function (one, two, three, four, five) {
                    var list = this;
                    if (list.iterating) {
                        return exception(cannotModifyMessage);
                    }
                    return _[name](list.toArray(), one, two, three, four, five);
                };
            }), wrap(reverseCollection, function (name) {
                return function () {
                    var list = this;
                    list.remark(REVERSED, !list.is(REVERSED));
                    list.toArray()[name]();
                    return list;
                };
            }), wrap(eachHandlers, function (fn) {
                return function (handler, context) {
                    var list = this,
                        args0 = list.toArray(),
                        args1 = handler,
                        args2 = arguments[LENGTH] > 1 ? context : list;
                    fn(args0, args1, args2);
                    return list;
                };
            }), wrap(countingCollection, function (name) {
                return function (runner, fromHere, toThere) {
                    var list = this;
                    _[name](list.toArray(), runner, list, fromHere, toThere);
                    return list;
                };
            }), wrap(recreatingSelfCollection, function (name) {
                return function (one, two, three) {
                    var list = this;
                    return new Collection[CONSTRUCTOR](_[name](list.toArray(), one, two, three));
                };
            }), wrap(foldFindIteration, function (name) {
                return function (one, two, three) {
                    var list = this;
                    return _[name](list.toArray(), one, two, three);
                };
            })),
            ret = _.publicize({
                eachCall: eachCall,
                eachCallRight: eachCallRight,
                filter: filter,
                matches: matches,
                results: results,
                add: add,
                removeAll: removeAll,
                addAll: addAll,
                insertAt: insertAt,
                removeAt: removeAt,
                remove: remove,
                cycle: cycle,
                uncycle: uncycle,
                concat: concat,
                // pluck: pluck,
                where: where,
                findWhere: findWhere,
                findLastWhere: findLastWhere,
                range: range,
                count: count,
                countTo: countTo,
                countFrom: countFrom,
                whereNot: whereNot,
                eachRight: eachRight,
                duffRight: duffRight,
                flatten: flatten,
                eq: eq
            }),
            unwrapper = function () {
                return this.items;
            },
            Collection = factories[COLLECTION] = factories.Directive.extend(COLLECTION, extend({
                get: parody(REGISTRY, 'get'),
                keep: parody(REGISTRY, 'keep'),
                drop: parody(REGISTRY, 'drop'),
                swap: parody(REGISTRY, 'swap'),
                comparator: function () {},
                constructor: function (items) {
                    this.reset(items);
                    return this;
                },
                call: function (arg) {
                    this.each(function (fn) {
                        fn(arg);
                    });
                    return this;
                },
                obliteration: function (handler, context) {
                    duffRight(this.toArray(), handler, context === UNDEFINED ? this : context);
                    return this;
                },
                empty: function () {
                    this.reset();
                    this.directive(REGISTRY).reset();
                    return this;
                },
                reset: function (items) {
                    // can be array like
                    var list = this,
                        old = list.toArray() || [];
                    list.iterating = list.iterating ? exception(cannotModifyMessage) : 0;
                    list.items = items == NULL ? [] : (Collection.isInstance(items) ? items.toArray().slice(0) : toArray(items));
                    list.unmark(REVERSED);
                    return list;
                },
                toArray: unwrapper,
                unwrap: unwrapper,
                length: function () {
                    return this.toArray()[LENGTH];
                },
                first: function () {
                    return this.toArray()[0];
                },
                last: function () {
                    var items = this.toArray();
                    return items[items[LENGTH] - 1];
                },
                item: function (number) {
                    return this.toArray()[number || 0];
                },
                has: function (object) {
                    return this.indexOf(object) !== -1;
                },
                sort: function (fn_) {
                    // normalization sort function for cross browsers
                    var list = this;
                    sort(list.toArray(), fn_ || this.comparator, list.is(REVERSED), list);
                    return list;
                },
                sortBy: function (key, fn_) {
                    // normalization sort function for cross browsers
                    var list = this;
                    sortBy(list.toArray(), key, fn_, list.is(REVERSED), list);
                    return list;
                },
                toString: function () {
                    return stringify(this.toArray());
                },
                toJSON: function () {
                    return results(this.toArray(), TO_JSON);
                },
                copy: function () {
                    return this.items.slice(0);
                },
                range: recreateSelf(range),
                concat: recreateSelf(function () {
                    // this allows us to mix collections with regular arguments
                    var base = this.toArray();
                    return base.concat.apply(base, map(arguments, function (arg) {
                        return Collection(arg).toArray();
                    }));
                })
            }, wrappedCollectionMethods)),
            directiveResult = app.defineDirective(COLLECTION, function () {
                return new Collection[CONSTRUCTOR]();
            }),
            appDirectiveResult = app.defineDirective(COLLECTION, function () {
                return Collection();
            }),
            SortedCollection = factories.SortedCollection = Collection.extend(SORTED_COLLECTION, {
                constructor: function (list_, skip) {
                    var sorted = this;
                    sorted[CONSTRUCTOR + COLON + COLLECTION]();
                    if (list_ && !skip) {
                        sorted.load(isArrayLike(list_) ? list_ : [list_]);
                    }
                    return sorted;
                },
                reverse: function () {
                    var sorted = this;
                    sorted.remark(REVERSED, !sorted.is(REVERSED));
                    sorted.sort();
                    return sorted;
                },
                closestIndex: function (value) {
                    return closestIndex(this.toArray(), value);
                },
                closest: function (value) {
                    var index, list = this.toArray();
                    return (index = closestIndex(list, value)) === -1 ? UNDEFINED : list[index];
                },
                validIDType: function (id) {
                    return isNumber(id) || isString(id);
                },
                indexOf: function (object, min, max) {
                    return smartIndexOf(this.toArray(), object, BOOLEAN_TRUE);
                },
                load: function (values) {
                    var sm = this;
                    if (isArray(values)) {
                        duff(values, sm.add, sm);
                    } else {
                        sm.add(values);
                    }
                    return sm;
                },
                add: function (object) {
                    var registryDirective, sorted = this,
                        isNotNull = object == NULL && exception(isNullMessage),
                        valueOfResult = object && object.valueOf(),
                        retrieved = (registryDirective = sorted[REGISTRY]) && sorted.get(ID, valueOfResult);
                    if (retrieved) {
                        return BOOLEAN_FALSE;
                    }
                    ret = !sorted.validIDType(valueOfResult) && exception(validIdMessage);
                    sorted.insertAt(object, sorted.closestIndex(valueOfResult) + 1);
                    (registryDirective || sorted.directive(REGISTRY)).keep(ID, valueOfResult, object);
                    return BOOLEAN_TRUE;
                },
                remove: function (object, index) {
                    var where, sorted = this,
                        isNotNull = object == NULL && exception(isNullMessage),
                        valueOfResult = object && object.valueOf();
                    if (object == NULL || sorted.get(ID, valueOfResult) == NULL) {
                        return BOOLEAN_FALSE;
                    }
                    sorted.removeAt(index === UNDEFINED ? sorted.indexOf(object) : index);
                    sorted.drop(ID, valueOfResult);
                    return BOOLEAN_TRUE;
                },
                pop: function () {
                    var collection = this,
                        length = collection[LENGTH]();
                    if (length) {
                        return collection.remove(collection.last(), length - 1);
                    }
                },
                shift: function () {
                    return this.remove(this.first(), 0);
                }
            }),
            StringObject = factories.StringObject = factories.Extendable.extend('StringObject', {
                constructor: function (value, parent) {
                    var string = this;
                    string.value = value;
                    string.parent = parent;
                    string.isValid(BOOLEAN_TRUE);
                    return string;
                },
                toggle: function (direction) {
                    this.isValid(toggle(this.isValid(), direction));
                },
                isValid: function (value) {
                    var string = this;
                    if (arguments[LENGTH]) {
                        if (string.valid !== value) {
                            string.parent.increment();
                            string.valid = value;
                        }
                        return string;
                    } else {
                        return string.valid;
                    }
                },
                valueOf: function () {
                    return this.value;
                },
                toString: function () {
                    var string = this,
                        value = string.value,
                        parent = string.parent;
                    if (parent.indexer === UNDEFINED) {
                        return value;
                    }
                    if (!string.isValid()) {
                        // canibalize the list as you join
                        string.parent.drop(ID, value);
                        string.parent.removeAt(parent.indexer);
                        return EMPTY_STRING;
                    }
                    // is it the first
                    value = parent.indexer ? parent.delimiter + value : value;
                    ++parent.indexer;
                    return value;
                }
            }),
            StringManager = factories[STRING_MANAGER] = SortedCollection.extend(STRING_MANAGER, {
                Child: StringObject,
                add: function (string) {
                    var sm = this,
                        found = sm.get(ID, string);
                    if (string) {
                        if (found) {
                            found.isValid(BOOLEAN_TRUE);
                        } else {
                            found = new sm.Child(string, sm);
                            sm.toArray().push(found);
                            sm.keep(ID, string, found);
                        }
                    }
                    return found;
                },
                emptyCollection: Collection[CONSTRUCTOR][PROTOTYPE].empty,
                empty: function () {
                    var sm = this;
                    // wipes array and id hash
                    sm.emptyCollection();
                    // resets change counter
                    sm.current(EMPTY_STRING);
                    return sm;
                },
                increment: function () {
                    var collection = this;
                    collection.changeCounter = collection.changeCounter || 0;
                    collection.changeCounter++;
                    return collection;
                },
                decrement: function () {
                    var collection = this;
                    collection.changeCounter = collection.changeCounter || 0;
                    collection.changeCounter--;
                    return collection;
                },
                remove: function (string) {
                    var sm = this,
                        found = sm.get(ID, string);
                    if (string && found) {
                        found.isValid(BOOLEAN_FALSE);
                    }
                    return sm;
                },
                toggle: function (string, direction) {
                    var wasFound = BOOLEAN_TRUE,
                        sm = this,
                        found = sm.get(ID, string);
                    if (!found) {
                        wasFound = BOOLEAN_FALSE;
                        found = sm.add(string);
                    }
                    if (direction === UNDEFINED) {
                        if (wasFound) {
                            found.toggle();
                        }
                    } else {
                        found.toggle(direction);
                    }
                },
                join: function (delimiter_) {
                    var sliced, result, cachedValue, parent = this,
                        delimiter = (delimiter_ || EMPTY_STRING) + EMPTY_STRING,
                        parentRegistry = parent.directive(REGISTRY);
                    // slice as a base array
                    // set the delimiter used to join
                    parent.changeCounter = parent.changeCounter || 0;
                    if (parent.changeCounter) {
                        parent.changeCounter = 0;
                        parentRegistry.group(DELIMITED, {});
                    }
                    if ((cachedValue = parentRegistry.get(DELIMITED, delimiter)) !== UNDEFINED) {
                        return cachedValue;
                    }
                    sliced = parent.toArray().slice(0);
                    parent.indexer = 0;
                    parent.delimiter = delimiter;
                    // sliced is thrown away,
                    // leaving the invalidated ones to be collected
                    result = sliced.join(EMPTY_STRING);
                    parent.current(delimiter, result);
                    delete parent.indexer;
                    delete parent.delimiter;
                    return result;
                },
                generate: function (delimiter_) {
                    var validResult, currentDelimited, string = EMPTY_STRING,
                        parent = this,
                        delimiter = delimiter_;
                    parent.changeCounter = parent.changeCounter || 0;
                    if (!parent.changeCounter && (currentDelimited = parent.current(delimiter))) {
                        return currentDelimited;
                    }
                    parent.current(delimiter, (string = parent.join(delimiter)));
                    return string;
                },
                current: function (delimiter, current) {
                    var value, sm = this;
                    if (arguments[LENGTH] === 1) {
                        return (value = sm.get(DELIMITED, delimiter)) === UNDEFINED ? sm.join(delimiter) : value;
                    } else {
                        sm.keep(DELIMITED, delimiter, current);
                        return sm;
                    }
                },
                ensure: function (value_, splitter) {
                    var sm = this,
                        value = value_,
                        delimiter = splitter === UNDEFINED ? SPACE : splitter,
                        isArrayResult = isArray(value),
                        madeString = (isArrayResult ? value.join(delimiter) : value);
                    if (sm.current(delimiter) === madeString) {
                        return sm;
                    }
                    sm.load(isArrayResult ? value : (isString(value) ? value.split(delimiter) : BOOLEAN_FALSE));
                    sm.current(delimiter, madeString);
                    return sm;
                },
                refill: function (array_) {
                    var sm = this,
                        array = array_;
                    sm.empty();
                    if (array) {
                        sm.load(array);
                    }
                    sm.increment();
                    return sm;
                }
            });
        app.defineDirective(REGISTRY, Registry[CONSTRUCTOR]);
        return Collection;
    });