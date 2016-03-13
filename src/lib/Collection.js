app.scope(function (app) {
    var isNullMessage = {
            message: 'object must not be null or undefined'
        },
        validIdMessage = {
            message: 'objects in sorted collections must have either a number or string for their valueOf result'
        },
        cannotModifyMessage = {
            message: 'list cannot be modified while it is being iterated over'
        },
        // ID = ID,
        eachCall = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            });
        },
        mapCall = function (array, method, arg) {
            return map(array, function (item) {
                return result(item, method, arg);
            });
        },
        eachCallRight = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            }, NULL, -1);
        },
        /**
         * @func
         */
        remove = function (list, item, lookAfter, lookBefore, fromRight) {
            var index = posit(list, item, lookAfter, lookBefore, fromRight);
            if (index) {
                removeAt(list, index - 1);
            }
            return !!index;
        },
        removeAt = function (list, index) {
            return splice(list, index, 1)[0];
        },
        add = function (list, item, lookAfter, lookBefore, fromRight) {
            var val = 0,
                index = posit(list, item, lookAfter, lookBefore, fromRight);
            if (!index) {
                val = list.push(item);
            }
            return !!val;
        },
        insertAt = function (list, item, index) {
            var len = list[LENGTH],
                lastIdx = len || 0;
            splice(list, index || 0, 0, item);
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
            var runner, obj, idx, ctx = ctx_ || this;
            if (start < end && isNumber(start) && isNumber(end) && isFinite(start) && isFinite(end)) {
                end = Math.abs(end);
                idx = start;
                runner = bind(runner_, ctx);
                while (idx < end) {
                    obj = NULL;
                    if (has(list, idx)) {
                        obj = list[idx];
                    }
                    runner(obj, idx, list);
                    idx++;
                }
            }
            return list;
        },
        countTo = function (list, runner, ctx, num) {
            return count(list, runner, ctx, 0, num);
        },
        countFrom = function (list, runner, ctx, num) {
            return count(list, runner, ctx, num, list[LENGTH]);
        },
        /**
         * @func
         */
        closest = function (array, searchElement, minIndex_, maxIndex_) {
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
        /**
         * @func
         */
        posit = function (list, item, lookAfter, lookBefore, fromRight) {
            return indexOf(list, item, lookAfter, lookBefore, fromRight) + 1;
        },
        /**
         * @func
         */
        concat = function () {
            return foldl(arguments, function (memo, arg) {
                duff(arg, function (item) {
                    memo.push(item);
                });
                return memo;
            }, []);
        },
        /**
         * @func
         */
        concatUnique = function () {
            return foldl(arguments, function (memo, argument) {
                duff(argument, function (item) {
                    if (binaryIndexOf(memo, item) === -1) {
                        memo.push(item);
                    }
                });
                return memo;
            }, []);
        },
        cycle = function (arr, num_) {
            var num, piece, length = arr[LENGTH];
            if (isNumber(length)) {
                num = num_ % length;
                piece = arr.splice(num);
                arr.unshift.apply(arr, piece);
            }
            return arr;
        },
        internalMambo = function (fn) {
            return function (arr) {
                arr.reverse();
                fn.apply(this, arguments);
                arr.reverse();
                return arr;
            };
        },
        // Returns whether an object has a given set of `key:value` pairs.
        isMatch = function (object, attrs) {
            var key, i = 0,
                keysResult = keys(attrs),
                obj = Object(object);
            return !find(keysResult, function (val) {
                if (attrs[val] !== obj[val] || !(val in obj)) {
                    return BOOLEAN_TRUE;
                }
            });
        },
        // Returns a predicate for checking whether an object has a given set of
        // `key:value` pairs.
        matches = function (obj1) {
            return function (obj2) {
                return isMatch(obj2, obj1);
            };
        },
        uncycle = internalMambo(cycle),
        externalMambo = internalMambo(function (list, fn) {
            return fn.apply(this, arguments);
        }),
        pluck = function (arr, key) {
            return map(arr, function (item) {
                return result(item, key);
            });
        },
        // Convenience version of a common use case of `filter`: selecting only objects
        // containing specific `key:value` pairs.
        where = function (obj, attrs) {
            return filter(obj, matches(attrs));
        },
        // Convenience version of a common use case of `find`: getting the first object
        // containing specific `key:value` pairs.
        findWhere = function (obj, attrs) {
            return find(obj, matches(attrs));
        },
        // Convenience version of a common use case of `find`: getting the first object
        // containing specific `key:value` pairs.
        findLastWhere = function (obj, attrs) {
            return findLast(obj, matches(attrs));
        },
        whereNot = function (obj, attrs) {
            return filter(obj, negate(matches(attrs)));
        },
        splat = function (fn, spliceat) {
            spliceat = spliceat || 0;
            return function () {
                var ctx = this,
                    arr = toArray(arguments),
                    args = splice(arr, spliceat);
                duff(args, function (idx, item, list) {
                    fn.apply(ctx, arr.concat([idx, item, list]));
                });
            };
        },
        recreateSelf = function (fn, ctx) {
            return function () {
                return new this.__constructor__(fn.apply(ctx || this, arguments));
            };
        },
        /**
         * @func
         */
        filter = function (obj, iteratee, context) {
            var isArrayResult = isArrayLike(obj),
                bound = bind(iteratee, context),
                runCount = 0;
            return foldl(obj, function (memo, item, key, all) {
                runCount++;
                if (bound(item, key, all)) {
                    if (isArrayResult) {
                        memo.push(item);
                    } else {
                        memo[key] = item;
                    }
                }
                return memo;
            }, isArrayResult ? [] : {});
        },
        unwrapInstance = function (instance_) {
            return isInstance(instance, factories.Collection) ? instance_ : instance.unwrap();
        },
        directives = _.directives,
        REGISTRY = 'registry',
        Registry = factories.Directive.extend(upCase(REGISTRY), {
            constructor: function () {
                this.reset();
                return this;
            },
            get: function (category, id) {
                var cat = this.register[category];
                return cat && cat[id];
            },
            keep: function (category, id, value) {
                var register = this.register,
                    cat = register[category] = register[category] || {};
                if (value === UNDEFINED) {
                    this.count--;
                }
                if (cat[id] === UNDEFINED) {
                    this.count++;
                }
                cat[id] = value;
                return this;
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
                var cachedCount = this.count;
                this.register = registry || {};
                this.count = count || 0;
                return [cached, cachedCount];
            }
        }),
        recreatingSelfList = gapSplit('eq map mapCall filter pluck where whereNot cycle uncycle flatten'),
        eachHandlers = {
            each: duff,
            duff: duff,
            forEach: duff,
            eachCall: eachCall,
            eachRight: duffRight,
            duffRight: duffRight,
            forEachRight: duffRight,
            eachCallRight: eachCallRight
        },
        eachHandlerKeys = keys(eachHandlers),
        abstractedCanModify = gapSplit('add'),
        abstractedCannotModify = gapSplit('insertAt remove removeAt'),
        nativeCannotModify = gapSplit('pop shift splice'),
        reverseList = gapSplit('reverse'),
        splatHandlers = gapSplit('push unshift'),
        joinHandlers = gapSplit('join'),
        countingList = gapSplit('count countTo countFrom merge'),
        foldIteration = gapSplit('foldr foldl reduce'),
        findIteration = gapSplit('find findLast findWhere findLastWhere'),
        indexers = gapSplit('indexOf posit'),
        // indicesIteration = gapSplit('add insertAt remove removeAt'),
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
        wrappedListMethods = extend(wrap(joinHandlers, function (name) {
            return function (arg) {
                return this.items[name](arg);
            };
        }), wrap(indexers.concat(abstractedCanModify), function (name) {
            return function (one, two, three, four, five) {
                var list = this;
                return _[name](list.items, one, two, three, four, five);
            };
        }), wrap(splatHandlers, function (name) {
            return function (args) {
                return this.items[name].apply(this.items, args);
            };
        }), wrap(nativeCannotModify, function (name) {
            return function (one, two, three, four, five, six) {
                var list = this;
                if (list.iterating) {
                    return exception(cannotModifyMessage);
                }
                return list.items[name](one, two, three, four, five, six);
            };
        }), wrap(abstractedCannotModify, function (name) {
            return function (one, two, three, four, five) {
                var list = this;
                if (list.iterating) {
                    return exception(cannotModifyMessage);
                }
                return _[name](list.items, one, two, three, four, five);
            };
        }), wrap(reverseList, function (name) {
            return function () {
                var list = this;
                list.directive('status').toggle('reversed');
                list.items[name]();
                return list;
            };
        }), wrap(eachHandlers, function (fn) {
            return marksIterating(function (list, handler, context) {
                var args0 = list.items,
                    args1 = handler,
                    args2 = arguments[LENGTH] > 1 ? context : list;
                fn(args0, args1, args2);
                return list;
            });
        }), wrap(countingList, function (name) {
            return function (runner, context, fromHere, toThere) {
                _[name](this.items, runner, context, fromHere, toThere);
                return this;
            };
        }), wrap(foldFindIteration.concat(recreatingSelfList), function (name) {
            return marksIterating(function (list, one, two, three) {
                return _[name](list.items, one, two, three);
            });
        })),
        ret = _.exports({
            eachCall: eachCall,
            eachCallRight: eachCallRight,
            filter: filter,
            matches: matches,
            mapCall: mapCall,
            add: add,
            insertAt: insertAt,
            concatUnique: concatUnique,
            removeAt: removeAt,
            remove: remove,
            cycle: cycle,
            uncycle: uncycle,
            mamboWrap: internalMambo,
            mambo: externalMambo,
            concat: concat,
            pluck: pluck,
            where: where,
            findWhere: findWhere,
            findLastWhere: findLastWhere,
            posit: posit,
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
        LIST = 'list',
        List = factories.Directive.extend(upCase(LIST), extend({
            constructor: function () {
                this.reset();
                return this;
            },
            empty: function () {
                return this.reset();
            },
            reset: function (items) {
                // can be array like
                var list = this;
                var old = list.items || [];
                list.iterating = list.iterating ? exception(cannotModifyMessage) : 0;
                list.items = items == NULL ? [] : (isArrayLike(items) ? toArray(items) : [items]);
                list.reversed = BOOLEAN_FALSE;
                return list;
            },
            unwrap: function () {
                return this.items;
            },
            length: function () {
                return this.items.length;
            },
            first: function () {
                return this.items[0];
            },
            last: function () {
                return this.items[this.items.length - 1];
            },
            index: function (number) {
                return this.items[number || 0];
            },
            has: function (object) {
                return this.indexOf(object) !== -1;
            },
            sort: function (fn_) {
                // normalization sort function for cross browsers
                sort(this.items, fn_);
                return this;
            },
            toString: function () {
                return stringify(this.items);
            },
            toJSON: function () {
                return map(this.items, function (item) {
                    return result(item, TO_JSON);
                });
            }
        }, wrappedListMethods), BOOLEAN_TRUE),
        directiveResult = app.defineDirective(LIST, List[CONSTRUCTOR]),
        Collection = factories.Directive.extend('Collection', extend({
            empty: _.flow(directives.parody(LIST, 'reset'), directives.parody(REGISTRY, 'reset')),
            // has: directives.parody(LIST, 'has'),
            // unwrap: directives.parody(LIST, 'unwrap'),
            // reset: directives.parody(LIST, 'reset'),
            // length: directives.parody(LIST, LENGTH),
            // first: directives.parody(LIST, 'first'),
            // last: directives.parody(LIST, 'last'),
            // index: directives.parody(LIST, 'index'),
            // toString: directives.parody(LIST, 'toString'),
            // toJSON: directives.parody(LIST, TO_JSON),
            // sort: directives.parody(LIST, 'sort'),
            get: directives.parody(REGISTRY, 'get'),
            register: directives.parody(REGISTRY, 'keep'),
            unRegister: directives.parody(REGISTRY, 'drop'),
            swapRegister: directives.parody(REGISTRY, 'swap'),
            constructor: function (arr) {
                this.directive(LIST).reset(arr);
                return this;
            },
            range: recreateSelf(range),
            concat: recreateSelf(function () {
                // this allows us to mix collections with regular arguments
                var base = this.unwrap();
                return base.concat.apply(base, map(arguments, function (arg) {
                    return Collection(arg).unwrap();
                }));
            }),
            call: function (arg) {
                this.each(function (fn) {
                    fn(arg);
                });
                return this;
            },
            results: function (key, arg) {
                return this.map(function (obj) {
                    return result(obj, key, arg);
                });
            }
            /**
             * @description adds models to the children array
             * @param {Object|Object[]} objs - object or array of objects to be passed through the model factory and pushed onto the children array
             * @param {Object} [secondary] - secondary hash that is common among all of the objects being created. The parent property is automatically overwritten as the object that the add method was called on
             * @returns {Object|Model} the object that was just created, or the object that the method was called on
             * @name Model#add
             * @func
             */
        }, wrap(gapSplit('has unwrap reset length first last index toString toJSON sort').concat(abstractedCanModify, abstractedCannotModify, nativeCannotModify, indexers, joinHandlers, splatHandlers), function (key) {
            return directives.parody(LIST, key);
        }), wrap(recreatingSelfList, function (key) {
            return recreateSelf(function (one) {
                return this.list[key](one);
            });
        }), wrap(splatHandlers, function (key) {
            return function () {
                this.list[key](arguments);
                return this;
            };
        }), wrap(countingList, function (key) {
            return function (runner, countFrom, countTo) {
                var context = this;
                context.list[key](runner, context, countFrom, countTo);
                return context;
            };
        }), wrap(reverseList.concat(eachHandlerKeys), function (key) {
            return function (one, two, three, four) {
                var context = this;
                context.list[key](one, two || context);
                return context;
            };
        }), wrap(foldIteration, function (key) {
            return function (handler, memo, context) {
                return this.list[key](handler, memo, context || this);
            };
        }), wrap(findIteration, function (key) {
            return function (handler, context) {
                return this.list[key](handler, context || this);
            };
        })), BOOLEAN_TRUE),
        SortedCollection = Collection.extend('SortedCollection', {
            constructor: function (list_, skip) {
                var sorted = this;
                Collection[CONSTRUCTOR].call(sorted);
                if (list_ && !skip) {
                    sorted.load(isArrayLike(list_) ? list_ : [list_]);
                }
                return sorted;
            },
            sort: function () {
                // does not take a function because it relies on ids / valueOf results
                var sorted = this;
                sort(sorted.unwrap(), sorted.reversed ? function (a, b) {
                    return a < b;
                } : function (a, b) {
                    return a > b;
                });
                return sorted;
            },
            reverse: function () {
                var sorted = this;
                sorted.reversed = !sorted.reversed;
                sorted.sort();
                return sorted;
            },
            closest: function (value) {
                return closest(this.unwrap(), value);
            },
            validIDType: function (id) {
                return isNumber(id) || isString(id);
            },
            indexOf: function (object) {
                return smartIndexOf(this.unwrap(), object);
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
                if (!retrieved) {
                    ret = !sorted.validIDType(valueOfResult) && exception(validIdMessage);
                    sorted.insertAt(object, sorted.closest(valueOfResult) + 1);
                    (registryDirective || sorted.directive(REGISTRY)).keep(ID, valueOfResult, object);
                    return BOOLEAN_TRUE;
                }
            },
            remove: function (object, index) {
                var where, sorted = this,
                    isNotNull = object == NULL && exception(isNullMessage),
                    valueOfResult = object && object.valueOf();
                if (object != NULL && sorted.get(ID, valueOfResult) != NULL) {
                    sorted.removeAt(index === UNDEFINED ? sorted.indexOf(object) : index);
                    sorted.unRegister(ID, valueOfResult);
                }
            },
            pop: function () {
                return this.remove(this.last());
            },
            shift: function () {
                return this.remove(this.first());
            }
        }, BOOLEAN_TRUE),
        StringObject = factories.Extendable.extend('StringObject', {
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
                return this.value;
            },
            generate: function () {
                return this.isValid() ? this.valueOf() : EMPTY_STRING;
            }
        }, BOOLEAN_TRUE),
        StringManager = SortedCollection.extend('StringManager', {
            Child: StringObject,
            add: function (string) {
                var sm = this,
                    found = sm.get(ID, string);
                if (string) {
                    if (found) {
                        found.isValid(BOOLEAN_TRUE);
                    } else {
                        found = new sm.Child(string, sm);
                        sm.unwrap().push(found);
                        sm.register(ID, string, found);
                    }
                }
                return found;
            },
            empty: function () {
                var sm = this;
                // wipes array and id hash
                Collection[CONSTRUCTOR][PROTOTYPE].empty.call(sm);
                // resets change counter
                sm.current(EMPTY_STRING);
                return sm;
            },
            increment: function () {
                this._changeCounter++;
            },
            decrement: function () {
                this._changeCounter--;
            },
            remove: function (string) {
                var sm = this,
                    found = sm.get(ID, string);
                if (string) {
                    if (found) {
                        found.isValid(BOOLEAN_FALSE);
                    }
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
            rebuild: function () {
                // rebuilds the registry
                var parent = this,
                    validResult = parent.foldl(function (memo, stringInstance) {
                        if (stringInstance.isValid()) {
                            memo.items.push(stringInstance);
                            memo.registry.id[stringInstance.value] = stringInstance;
                        }
                        return memo;
                    }, {
                        items: [],
                        registry: {
                            id: {}
                        }
                    });
                parent.directive(LIST).reset(validResult.items);
                parent.directive(REGISTRY).reset(validResult.registry);
            },
            generate: function (delimiter_) {
                var validResult, string = EMPTY_STRING,
                    parent = this,
                    previousDelimiter = parent.delimiter,
                    delimiter = delimiter_;
                if (!parent._changeCounter && delimiter === previousDelimiter) {
                    return parent.current();
                }
                parent.delimiter = delimiter;
                parent.rebuild();
                string = parent.join(delimiter);
                parent.current(string);
                return string;
            },
            current: function (current_) {
                var sm = this;
                if (arguments[LENGTH]) {
                    sm._changeCounter = 0;
                    sm._currentValue = current_;
                    return sm;
                } else {
                    return sm._currentValue;
                }
            },
            ensure: function (value_, splitter) {
                var sm = this,
                    value = value_,
                    delimiter = splitter === UNDEFINED ? SPACE : splitter,
                    isArrayResult = isArray(value),
                    madeString = (isArrayResult ? value.join(delimiter) : value);
                if (sm.current() === madeString) {
                    return sm;
                }
                sm.load(isArrayResult ? value : _.split(value, delimiter));
                sm.current(madeString);
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
        }, BOOLEAN_TRUE);
    app.defineDirective(REGISTRY, Registry[CONSTRUCTOR]);
});