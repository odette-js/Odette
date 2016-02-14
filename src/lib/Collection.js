application.scope(function (app) {
    var ITEMS = '_items',
        BY_ID = '_byId',
        ID = 'id',
        eachCall = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            });
        },
        eachCallRight = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            }, NULL, -1);
        },
        eachCallWith = function (array, method, args_) {
            var args = args_ || [];
            return duff(array, function (item) {
                item[method].apply(item, args);
            });
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
        addAt = function (list, item, index) {
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
        // array, startIndex, endIndex
        between = function (fn) {
            return function (list, startIdx_, endIdx_) {
                var ret = [],
                    startIdx = startIdx_ || 0,
                    endIdx = endIdx_ || list[LENGTH],
                    findResult = find(list, function (item, idx, list) {
                        fn(ret, item, idx, list);
                    }, NULL, endIdx);
                return ret;
            };
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
        // closest = function (list, target) {
        //     var match, path, diff, possible, i = 0,
        //         previousAbs = Infinity,
        //         // trying to avoid running through 20 matchs
        //         // when i'm already at the exact one
        //         valuesLen = list[LENGTH];
        //     if (valuesLen === 1) {
        //         match = list[0];
        //     }
        //     if (indexOf(list, target) !== -1) {
        //         match = target;
        //     }
        //     if (!match) {
        //         // try doing this later with no sorting
        //         for (i = valuesLen - 1;
        //             (i >= 0 && !match); i--) {
        //             path = list[i];
        //             diff = Math.abs(target - path);
        //             if (diff < previousAbs) {
        //                 possible = path;
        //                 previousAbs = diff;
        //             }
        //         }
        //         match = possible;
        //     }
        //     if (!match) {
        //         match = target;
        //     }
        //     return match;
        // },
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
            var num, piece, len = arr[LENGTH];
            if (isNumber(len)) {
                num = num_ % len;
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
        wrappedCollectionMethods = extend(wrap({
            each: duff,
            duff: duff,
            forEach: duff,
            eachCall: eachCall,
            eachRight: duffRight,
            duffRight: duffRight,
            forEachRight: duffRight,
            eachCallRight: eachCallRight
        }, function (fn) {
            return function (handler, context) {
                // unshiftContext
                var args0 = this.unwrap(),
                    args1 = handler,
                    args2 = arguments[LENGTH] > 1 ? context : this;
                fn(args0, args1, args2);
                return this;
            };
        }), wrap(gapSplit('min max hypot pop shift'), function (name) {
            return function () {
                return _[name](this.unwrap());
            };
        }), wrap(gapSplit('push unshift'), function (name) {
            return function () {
                _[name](this.unwrap(), arguments);
                return this;
            };
        }), wrap(gapSplit('join'), function (name) {
            return function (arg) {
                return this.unwrap()[name](arg);
            };
        }), wrap(gapSplit('reverse', function (name) {
            return function () {
                this.unwrap()[name]();
                return this;
            };
        })), wrap(gapSplit('count countTo countFrom merge eachCallWith'), function (name) {
            return function (one, two, three) {
                var ctx = this;
                _[name](ctx.unwrap(), one, ctx, two, three);
                return ctx;
            };
        }), wrap(gapSplit('foldr foldl reduce find findLast findWhere findLastWhere'), function (name) {
            return function (fn, ctx, memo) {
                return _[name](this.unwrap(), fn, ctx, memo);
            };
        }), wrap(gapSplit('add addAt remove removeAt indexOf posit foldr foldl reduce splice'), function (name) {
            return function (one, two, three) {
                return _[name](this.unwrap(), one, two, three);
            };
        }), wrap(gapSplit('eq map filter pluck where whereNot cycle uncycle flatten'), function (name) {
            return recreateSelf(function (fn) {
                return _[name](this.unwrap(), fn);
            });
        })),
        ret = _.exports({
            eachCall: eachCall,
            eachCallRight: eachCallRight,
            eachCallWith: eachCallWith,
            filter: filter,
            matches: matches,
            add: add,
            addAt: addAt,
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
            between: between,
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
        interactWithById = function (fun, expecting) {
            return function (one, two, three) {
                var directive = this,
                    bycategories = directive.register,
                    passedCategory = arguments[LENGTH] === expecting,
                    category = passedCategory ? one : ID,
                    categoryHash = bycategories[category] = bycategories[category] || {},
                    key = passedCategory ? two : one,
                    thing = passedCategory ? three : two;
                return fun(directive, categoryHash, category, key, thing, passedCategory);
            };
        },
        Collection = factories.Directive.extend('Collection', extend({
            range: recreateSelf(range),
            concat: recreateSelf(function () {
                // this allows us to mix collections with regular arguments
                var base = this.unwrap();
                return base.concat.apply(base, map(arguments, function (arg) {
                    return Collection(arg).unwrap();
                }));
            }),
            has: function (object) {
                return this.indexOf(object) !== -1;
            },
            call: function (arg) {
                this.each(function (fn) {
                    fn(arg);
                });
                return this;
            },
            results: function (key, arg, handle) {
                this.each(function (obj) {
                    result(obj, key, arg);
                });
                return this;
            },
            unwrap: function () {
                return this.directive('list').items;
            },
            empty: _.flow(_.directives.parody('list', 'empty'), _.directives.parody('registry', 'reset')),
            swap: function (arr) {
                this.directive('list').items = arr || [];
            },
            length: function () {
                return this.unwrap()[LENGTH];
            },
            first: function () {
                return this.unwrap()[0];
            },
            last: function () {
                return this.unwrap()[this[LENGTH]() - 1];
            },
            index: function (number) {
                return this.unwrap()[number || 0];
            },
            sort: function (fn_) {
                sort(this.unwrap(), fn_);
                return this;
            },
            toString: function () {
                return stringify(this.unwrap());
            },
            toJSON: function () {
                return map(this.unwrap(), function (item) {
                    return result(item, TO_JSON);
                });
            },
            /**
             * @description adds models to the children array
             * @param {Object|Object[]} objs - object or array of objects to be passed through the model factory and pushed onto the children array
             * @param {Object} [secondary] - secondary hash that is common among all of the objects being created. The parent property is automatically overwritten as the object that the add method was called on
             * @returns {Object|Box} the object that was just created, or the object that the method was called on
             * @name Box#add
             * @func
             */
            constructor: function (arr) {
                var collection = this;
                if (isArrayLike(arr)) {
                    if (!isArray(arr)) {
                        arr = toArray(arr);
                    }
                } else {
                    if (arr != NULL) {
                        arr = [arr];
                    }
                }
                collection.swap(arr);
                return collection;
            },
            get: _.directives.parody('registry', 'get'),
            register: _.directives.parody('registry', 'keep'),
            unRegister: _.directives.parody('registry', 'drop'),
            swapRegister: _.directives.parody('registry', 'swap')
        }, wrappedCollectionMethods), BOOLEAN_TRUE),
        isNullMessage = {
            message: 'object must not be null or undefined'
        },
        validIdMessage = {
            message: 'objects in sorted collections must have either a number or string for their valueOf result'
        },
        SortedCollection = Collection.extend('SortedCollection', {
            constructor: function (list_, skip) {
                var sorted = this;
                if (list_ && !skip) {
                    sorted.load(isArrayLike(list_) ? list_ : [list_]);
                }
                return sorted;
            },
            sort: function () {
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
                duff(values, sm.add, sm);
                return sm;
            },
            add: function (object) {
                var registryDirective, sorted = this,
                    isNotNull = object == NULL && exception(isNullMessage),
                    valueOfResult = object && object.valueOf(),
                    retrieved = (registryDirective = sorted.checkDirective('registry')) && sorted.get('id', valueOfResult);
                if (!retrieved) {
                    ret = !sorted.validIDType(valueOfResult) && exception(validIdMessage);
                    sorted.addAt(object, sorted.closest(valueOfResult) + 1);
                    (registryDirective || sorted.directive('registry')).keep('id', valueOfResult, object);
                    return BOOLEAN_TRUE;
                }
            },
            remove: function (object) {
                var where, sorted = this,
                    isNotNull = object == NULL && exception(isNullMessage),
                    valueOfResult = object && object.valueOf();
                if (object != NULL && sorted.get('id', valueOfResult) != NULL) {
                    sorted.removeAt(sorted.indexOf(object));
                    sorted.unRegister('id', valueOfResult);
                }
            },
            pop: function () {
                return this.remove(this.last());
            },
            shift: function () {
                return this.remove(this.first());
            }
        }, BOOLEAN_TRUE),
        StringObject = factories.Model.extend('StringObject', {
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
                    found = sm.get('id', string);
                if (string) {
                    if (found) {
                        found.isValid(BOOLEAN_TRUE);
                    } else {
                        found = sm.Child(string, sm);
                        sm.unwrap().push(found);
                        sm.register('id', string, found);
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
            },
            increment: function () {
                this._changeCounter++;
            },
            decrement: function () {
                this._changeCounter--;
            },
            remove: function (string) {
                var sm = this,
                    found = sm.get('id', string);
                if (string) {
                    if (found) {
                        found.isValid(BOOLEAN_FALSE);
                    }
                }
                return sm;
            },
            toggle: function (string) {
                var sm = this,
                    found = sm.get('id', string);
                if (!found) {
                    sm.add(string);
                } else {
                    found.toggle();
                }
            },
            rebuild: function () {
                // rebuilds the registry
                var parent = this,
                    validResult = foldl(parent.unwrap(), function (memo, stringInstance) {
                        if (stringInstance.isValid()) {
                            memo.list.push(stringInstance);
                            memo.registry.id[stringInstance.value] = stringInstance;
                        }
                        return memo;
                    }, {
                        list: [],
                        registry: {
                            id: {}
                        }
                    });
                parent.swap(validResult.list);
                parent.directive('registry').reset(validResult.registry);
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
                string = parent.unwrap().join(delimiter);
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
                    delimiter = splitter === UNDEFINED ? ' ' : splitter,
                    isArrayResult = isArray(value),
                    madeString = (isArrayResult ? value.join(delimiter) : value);
                if (sm.current() === madeString) {
                    return sm;
                }
                sm.load(isArrayResult ? value : _.split(value, delimiter));
                sm.current(madeString);
                return sm;
            },
            refill: function (array) {
                var sm = this;
                sm.empty();
                sm.load(array);
                return sm;
            }
        }, BOOLEAN_TRUE),
        unwrap = function () {
            return this.items;
        },
        list_swap = function (list) {
            this.items = list;
        },
        empty = function () {
            this.items = [];
            this.iterating = 0;
        };
    app.defineDirective('list', function () {
        return {
            items: [],
            reversed: BOOLEAN_FALSE,
            iterating: 0,
            empty: empty
        };
    });
    var get = function (category, id) {
        var cat = this.register[category];
        return cat && cat[id];
    },
    keep = function (category, id, value) {
        var register = this.register,
            cat = register[category] = register[category] || {};
        cat[id] = value;
    },
    drop = function (category, id) {
        return this.swap(category, id);
    },
    swap = function (category, id, value) {
        var cached = this.get(category, id);
        this.keep(category, id, value);
        return cached;
    },
    reset = function (registry) {
        this.register = registry || {};
        this.count = 0;
    };
    app.defineDirective('registry', function () {
        return {
            register: {},
            count: 0,
            get: get,
            keep: keep,
            drop: drop,
            swap: swap,
            reset: reset
        };
    });
});