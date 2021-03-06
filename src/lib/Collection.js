var isNullMessage = 'object must not be null or ' + UNDEFINED,
    validIdMessage = 'objects in sorted collections must have either a number or string for their valueOf result',
    COLLECTION = 'Collection',
    REVERSED = 'reversed',
    DELIMITED = 'delimited',
    STRING_MANAGER = 'StringManager',
    SORTED_COLLECTION = 'Sorted' + COLLECTION,
    addAll = doToAll(add),
    removeAll = doToAll(remove),
    // now we start with some privacy
    Collection = app.block(function (app) {
        var recreatingSelfCollection = toArray('eq,where,whereNot,results,cycle,uncycle,flatten,gather,unique').concat(associatedBuilderKeys('map'), associatedBuilderKeys('filter'), associatedBuilderKeys('filterNegative')),
            eachIteratorsFunctionRequired = wrap(toArray('forEach,forOwn,forIn,forEachRight,forOwnRight,forInRight'), BOOLEAN_TRUE),
            eachHandlerKeys = buildCallerKeys('forEach').concat(buildCallerKeys('forOwn'), buildCallerKeys('each', eachRight)),
            abstractedCanModify = toArray('add'),
            abstractedCannotModify = toArray('insertAt,remove,removeAt,removeWhere,findRemoveWhere'),
            nativeCannotModify = toArray('pop,shift,splice'),
            reverseCollection = toArray('reverse'),
            splatHandlers = toArray('push,unshift'),
            joinHandlers = toArray('join'),
            countingCollection = toArray('count,countTo,countFrom'),
            foldIteration = toArray('reduce,reduceRight'),
            findIteration = toArray('find,findRight,findWhere,findWhereRight').concat(keys(buildCallers('find'))),
            indexers = toArray('indexOf,includes'),
            foldFindIteration = foldIteration.concat(findIteration),
            ret = _.publicize({
                filter: filter,
                matches: matches,
                results: results,
                add: add,
                removeAll: removeAll,
                addAll: addAll,
                insertAt: insertAt,
                removeAt: removeAt,
                removeWhere: removeWhere,
                findRemoveWhere: findRemoveWhere,
                remove: remove,
                cycle: cycle,
                uncycle: uncycle,
                concat: concat,
                where: where,
                findWhere: findWhere,
                findWhereRight: findWhereRight,
                range: range,
                count: count,
                countTo: countTo,
                countFrom: countFrom,
                whereNot: whereNot,
                eachRight: eachRight,
                forEachRight: forEachRight,
                flatten: flatten,
                eq: equalize
            }),
            wrappedCollectionMethods = extend([{
                seeker: function (handler) {
                    var context = this,
                        bound = bindTo(handler, context);
                    return forEachRight(context.toArray(), function (one, two, three) {
                        if (!bound(one, two, three)) {
                            return;
                        }
                        context.removeAt(two);
                    });
                },
                slice: function (one, two) {
                    return this.wrap(this.toArray().slice(one, two));
                },
                merge: function (newish, merger, stack) {
                    var context = this;
                    merge(context.toArray(), newish, merger, stack);
                    return context;
                }
            }, wrap(joinHandlers, function (name) {
                return function (arg) {
                    return this.toArray()[name](arg);
                };
            }), wrap(indexers.concat(abstractedCanModify), function (name) {
                var fn = _[name];
                return function (one, two, three, four, five) {
                    return fn(this.toArray(), one, two, three, four, five);
                };
            }), wrap(splatHandlers, function (name) {
                return function (args_) {
                    var items = this.toArray();
                    return items[name].apply(items, isArray(args_) ? args_ : arguments);
                };
            }), wrap(nativeCannotModify, function (name) {
                return function (one, two, three, four, five, six) {
                    return this.toArray()[name](one, two, three, four, five, six);
                };
            }), wrap(abstractedCannotModify, function (name) {
                var fn = _[name];
                return function (one, two, three, four, five) {
                    return fn(this.toArray(), one, two, three, four, five);
                };
            }), wrap(reverseCollection, function (name) {
                return function () {
                    var context = this;
                    context.remark(REVERSED, !context.is(REVERSED));
                    context.toArray()[name]();
                    return context;
                };
            }), wrap(eachHandlerKeys, function (key) {
                var fn = _[key];
                return function (method, argument, third) {
                    // pass through
                    fn(this.toArray(), method, argument, third);
                    return this;
                };
            }), wrap(eachIteratorsFunctionRequired, function (bool, key) {
                var fn = _[key];
                return function (iterator, argument) {
                    // must be a function
                    fn(this.toArray(), bindTo(iterator, this));
                    return this;
                };
            }), wrap(countingCollection, function (name) {
                return function (runner, fromHere, toThere) {
                    var context = this;
                    _[name](context.toArray(), bindTo(runner, context), fromHere, toThere);
                    return context;
                };
            }), wrap(recreatingSelfCollection, function (name) {
                return function (one, two, three) {
                    var context = this;
                    return new Collection[CONSTRUCTOR](_[name](context.toArray(), one, two, three));
                };
            }), wrap(foldFindIteration, function (name) {
                var fn = _[name];
                return function (one, two, three) {
                    return fn(this.toArray(), one, two, three);
                };
            })]),
            unwrapper = function () {
                return this.items;
            },
            Collection = factories[COLLECTION] = factories.Directive.extend(COLLECTION, extend([{
                get: parody(REGISTRY, 'get'),
                getBy: parody(REGISTRY, 'get'),
                getById: function (id) {
                    return this.get(ID, id);
                },
                keep: function (category, id, object, index) {
                    var item, collection = this,
                        registry = collection.directive(REGISTRY);
                    registry.keep(category, id, object);
                    if (index === UNDEFINED || index >= collection.length()) {
                        collection.push(object);
                    } else {
                        collection.insertAt(index, object);
                    }
                    return collection;
                },
                swap: function (category, id, object, index) {
                    var item, collection = this,
                        registry = collection.directive(REGISTRY);
                    if ((item = registry.drop(category, id)) !== UNDEFINED) {
                        if (index !== UNDEFINED) {
                            collection.removeAt(index);
                        } else {
                            collection.remove(item);
                        }
                    }
                    collection.keep(category, id, object, index);
                    return item;
                },
                drop: function (category, id, index) {
                    var item, collection = this,
                        registry = collection.directive(REGISTRY);
                    if ((item = registry.drop(category, id)) !== UNDEFINED) {
                        if (index !== UNDEFINED) {
                            collection.removeAt(index);
                        } else {
                            collection.remove(item);
                        }
                    }
                    return item;
                },
                // comparator: function () {},
                constructor: function (items) {
                    this.reset(items);
                    return this;
                },
                obliteration: function (handler) {
                    forEachRight(this.toArray(), bindTo(handler, this));
                    return this;
                },
                empty: function () {
                    this.reset();
                    this.directive(REGISTRY).reset();
                    return this;
                },
                reset: function (items) {
                    // can be array like
                    var context = this,
                        old = context.toArray() || [];
                    context.items = items == NULL ? [] : (Collection.isInstance(items) ? items.toArray().slice(0) : toArray(items));
                    context.unmark(REVERSED);
                    return context;
                },
                toArray: unwrapper,
                unwrap: unwrapper,
                wrap: function (context) {
                    return Collection(context);
                },
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
                includes: function (object) {
                    return this.indexOf(object) !== -1;
                },
                sort: function (fn_) {
                    // normalization sort function for cross browsers
                    var context = this;
                    sort(context.toArray(), bindTo(fn_ || this.comparator || _.defaultSort, context), context.is(REVERSED));
                    return context;
                },
                sortBy: function (key, fn_) {
                    // normalization sort function for cross browsers
                    var context = this;
                    sortBy(context.toArray(), key, fn_, context.is(REVERSED), context);
                    return context;
                },
                toString: function () {
                    return stringify(this.toArray());
                },
                toJSON: function () {
                    return map(this.toArray(), function (item) {
                        return item && item.toJSON ? item.toJSON() : item;
                    });
                },
                copy: function () {
                    return this.items.slice(0);
                },
                range: recreateSelf(range),
                concat: recreateSelf(function () {
                    // this allows us to mix collections with regular arguments
                    var base = this.toArray();
                    return base.concat.apply(base, map(arguments, function (arg) {
                        // auto checks for collection / array combo
                        return Collection(arg).toArray();
                    }));
                })
            }, wrappedCollectionMethods])),
            directiveResult = app.defineDirective(COLLECTION, function () {
                return new Collection[CONSTRUCTOR]();
            }),
            appDirectiveResult = app.defineDirective(COLLECTION, function () {
                return Collection();
            }),
            SortedCollection = factories.SortedCollection = Collection.extend(SORTED_COLLECTION, {
                constructor: function (context_, skip) {
                    var sorted = this;
                    sorted[CONSTRUCTOR + COLON + COLLECTION]();
                    if (context_ && !skip) {
                        sorted.load(isArrayLike(context_) ? context_ : [context_]);
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
                    var index, context = this.toArray();
                    return (index = closestIndex(context, value)) === -1 ? UNDEFINED : context[index];
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
                        forEach(values, bindTo(sm.add, sm));
                    } else {
                        sm.add(values);
                    }
                    return sm;
                },
                add: sortedAdd,
                // push: sortedAdd,
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
                        // canibalize the context as you join
                        parent.drop(ID, value);
                        parent.removeAt(parent.indexer);
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
                            sm.keep(ID, string, found, sm.length());
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
                    var value, manager = this;
                    if (arguments[LENGTH] === 1) {
                        return (value = manager.get(DELIMITED, delimiter)) === UNDEFINED ? manager.join(delimiter) : value;
                    } else {
                        manager.keep(DELIMITED, delimiter, current);
                        return manager;
                    }
                },
                ensure: function (value_, splitter) {
                    var manager = this,
                        value = value_,
                        delimiter = splitter === UNDEFINED ? SPACE : splitter,
                        isArrayResult = isArray(value),
                        madeString = (isArrayResult ? value.join(delimiter) : value);
                    if (manager.current(delimiter) === madeString) {
                        return manager;
                    }
                    manager.load(isArrayResult ? value : (isString(value) ? value.split(delimiter) : BOOLEAN_FALSE));
                    manager.current(delimiter, madeString);
                    return manager;
                },
                refill: function (array_) {
                    var manager = this,
                        array = array_;
                    manager.empty();
                    if (array) {
                        manager.load(array);
                    }
                    manager.increment();
                    return manager;
                }
            });
        return Collection;
    });

function sortedAdd(object) {
    var registryDirective, ret, sorted = this,
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
}

function doToAll(handler) {
    return function (list, items, lookAfter, lookBefore, fromRight) {
        var count = 0;
        forEach(items, function (item) {
            count += remove(list, item, lookAfter, lookBefore, fromRight);
        });
        return count === list[LENGTH];
    };
}

function remove(list, item, lookAfter, lookBefore, fromRight) {
    var index = indexOf(list, item, lookAfter, lookBefore, fromRight);
    if (index + 1) {
        removeAt(list, index);
    }
    index = index + 1;
    return !!index;
}

function removeAt(list, index) {
    return list.splice(index, 1)[0];
}

function removeWhere(list, matchr) {
    var matcher = matches(matchr);
    forEachRight(list, function (item, index) {
        if (matcher(item)) {
            removeAt(list, index);
        }
    });
}

function findRemoveWhere(list, matcher) {
    var found;
    if ((found = findWhere(list, matcher))) {
        remove(list, found);
    }
}

function add(list, item, lookAfter, lookBefore, fromRight) {
    var value = 0,
        index = indexOf(list, item, lookAfter, lookBefore, fromRight);
    if (index === -1) {
        value = list.push(item);
    }
    return !!value;
}

function insertAt(list, item, index) {
    var len = list[LENGTH],
        lastIdx = len || 0;
    list.splice(index || 0, 0, item);
    return len !== list[LENGTH];
}

function equalize(list, num, caller_) {
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
            forEach(numb, function (num) {
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
}

function range(start, stop, step, inclusive) {
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
}

function count(list, runner, start, end) {
    var obj, idx;
    if (start >= end || !isNumber(start) || !isNumber(end) || !isFinite(start) || !isFinite(end)) {
        return list;
    }
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
}

function countTo(list, runner, num) {
    return count(list, runner, 0, clamp(num, 0));
}

function countFrom(list, runner, num) {
    return count(list, runner, clamp(num, 0) || 0, list[LENGTH]);
}

function closestIndex(array, searchElement, minIndex_, maxIndex_) {
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
}

function recreateSelf(fn, context) {
    return function () {
        return this.wrap(fn.apply(context || this, arguments));
    };
}

function associatedBuilderKeys(key) {
    return keys(buildCallers(key, false, true));
}