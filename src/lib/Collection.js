application.scope(function (app) {
    var blank, _ = app._,
        factories = _.factories,
        isObject = _.isObject,
        isNumber = _.isNumber,
        isFunction = _.isFunction,
        isInstance = _.isInstance,
        LENGTH = 'length',
        ITEMS = '_items',
        BY_ID = '_byId',
        ID = 'id',
        PREVIOUS = '_previous',
        each = _.each,
        duff = _.duff,
        push = _.push,
        wrap = _.wrap,
        keys = _.keys,
        find = _.find,
        map = _.map,
        has = _.has,
        isBlank = _.isBlank,
        stringify = _.stringify,
        findLast = _.findLast,
        allKeys = _.allKeys,
        splice = _.splice,
        toArray = _.toArray,
        gapSplit = _.gapSplit,
        sort = _.sort,
        bind = _.bind,
        extend = _.extend,
        result = _.result,
        isArrayLike = _.isArrayLike,
        negate = _.negate,
        isArray = _.isArray,
        indexOf = _.indexOf,
        clone = _.clone,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        eachCall = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            });
        },
        eachRevCall = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            }, null, -1);
        },
        doToEverything = function (doLater, direction) {
            return function () {
                var args = toArray(arguments),
                    one = args.shift();
                duff(args, function (items) {
                    duff(items, function (item) {
                        doLater(one, item);
                    }, null, direction || 1);
                });
                return one;
            };
        },
        /**
         * @func
         */
        remove = function (list, item, lookAfter) {
            var index = posit(list, item, lookAfter);
            if (index) {
                removeAt(list, index - 1);
            }
            return !!index;
        },
        removeAll = doToEverything(remove, -1),
        removeAt = function (list, index) {
            return splice(list, index, 1)[0];
        },
        add = function (list, item) {
            var val = 0,
                index = posit(list, item);
            if (!index) {
                val = push(list, item);
            }
            return !!val;
        },
        addAll = doToEverything(add),
        addAt = function (list, item, index) {
            var len = list[LENGTH],
                lastIdx = len || 0;
            splice(list, index || 0, 0, item);
            return len !== list[LENGTH];
        },
        range = function (start, stop, step, inclusive) {
            var length, range, idx;
            if (isBlank(stop)) {
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
        count = function (list, start, end, runner_) {
            var runner, obj, idx, ctx = this;
            if (start < end && isNumber(start) && isNumber(end) && isFinite(start) && isFinite(end)) {
                end = Math.abs(end);
                idx = start;
                runner = bind(runner_, ctx);
                while (idx < end) {
                    obj = null;
                    if (has(list, idx)) {
                        obj = list[idx];
                    }
                    runner(obj, idx, list);
                    idx++;
                }
            }
            return list;
        },
        // array, startIndex, endIndex
        between = function (fn) {
            return function (list, startIdx_, endIdx_) {
                var ret = [],
                    startIdx = startIdx_ || 0,
                    endIdx = endIdx_ || list[LENGTH],
                    findResult = find(list, function (item, idx, list) {
                        fn(ret, item, idx, list);
                    }, null, endIdx);
                return ret;
            };
        },
        /**
         * @func
         */
        closest = function (list, target) {
            var match, path, diff, valuesLen, possible, i = 0,
                previousAbs = Infinity;
            // trying to avoid running through 20 matchs
            // when i'm already at the exact one
            if (!isArrayLike(list)) {
                return;
            }
            valuesLen = list[LENGTH];
            if (valuesLen === 1) {
                match = list[0];
            }
            if (indexOf(list, target) !== -1) {
                match = target;
            }
            if (!match) {
                // try doing this later with no sorting
                sort(list);
                for (i = valuesLen - 1;
                    (i >= 0 && !match); i--) {
                    path = list[i];
                    diff = Math.abs(target - path);
                    if (diff < previousAbs) {
                        possible = path;
                        previousAbs = diff;
                    }
                }
                match = possible;
            }
            if (!match) {
                match = target;
            }
            return match;
        },
        countTo = function (list, num, runner) {
            return count(list, 0, num, runner);
        },
        countFrom = function (list, num, runner) {
            return count(list, num, list[LENGTH], runner);
        },
        /**
         * @func
         */
        posit = function (list, item, lookAfter) {
            return indexOf(list, item, lookAfter) + 1;
        },
        /**
         * @func
         */
        concat = function () {
            var array = [];
            duff(arguments, function (arg) {
                duff(arg, function (item) {
                    array.push(item);
                });
            });
            return array;
        },
        /**
         * @func
         */
        concatUnique = function () {
            var array = [];
            duff(concat.apply(null, arguments), function (item) {
                if (!posit(array, item)) {
                    array.push(item);
                }
            });
            return array;
        },
        cycle = function (arr, num) {
            var piece, len = arr[LENGTH];
            if (isNumber(len)) {
                num = num % len;
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
            var items = [];
            duff(arr, function (item) {
                if (isObject(item) && item[key] !== void 0) {
                    items.push(item[key]);
                }
            });
            return items;
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
        flatten = function () {
            return foldl(arguments, function (memo, item) {
                if (isArrayLike(item)) {
                    memo = memo.concat(flatten.apply(null, item));
                } else {
                    memo.push(item);
                }
                return memo;
            }, []);
        },
        splat = function (fn, spliceat) {
            spliceat = spliceat || 0;
            return function () {
                var ctx = this,
                    arr = toArray(arguments),
                    args = splice(arr, spliceat);
                // return duff(args, fn, this, arr);
                duff(args, function (idx, item, list) {
                    fn.apply(ctx, arr.concat([idx, item, list]));
                });
            };
        },
        // merge = splat(function (item, idx, list) {
        //     var len, collection = this,
        //         last = collection[LENGTH];
        //     if (isArrayLike(item)) {
        //         len = item[LENGTH];
        //         duff(item, function (key, val) {
        //             if (val !== blank) {
        //                 // removes any undefined items
        //                 len = key + 1;
        //                 collection[key] = val;
        //             }
        //         });
        //         if (len > (last || 0)) {
        //             collection[LENGTH] = len;
        //         }
        //     }
        // }),
        eq = function (list, num) {
            var n, thisNum, items = [],
                numb = num || 0,
                evaluatedIsNumber = isNumber(numb),
                isArray = isArrayLike(numb);
            if (numb < 0) {
                evaluatedIsNumber = BOOLEAN_FALSE;
            }
            if (list[LENGTH]) {
                if (evaluatedIsNumber) {
                    items = [list[numb]];
                }
                if (isArray) {
                    items = clone(numb);
                }
                if (!isArray && !evaluatedIsNumber && list[0]) {
                    items = [list[0]];
                }
            }
            return items;
        },
        tackRev = function (fn, index, ctx) {
            return function () {
                var args = toArray(arguments);
                while (args[LENGTH] < index) {
                    // fill it out with null
                    args.push(null);
                }
                // put -1 on as the last arg
                args.push(-1);
                return fn.apply(ctx || _, args);
            };
        },
        duffRev = tackRev(duff, 3),
        eachRev = tackRev(each, 3),
        recreateSelf = function (fn, ctx) {
            return function () {
                return new this.__constructor__(fn.apply(ctx || this, arguments));
            };
        },
        /**
         * @func
         */
        // Create a reducing function iterating left or right.
        createReduce = function (dir) {
            // Optimized iterator function as using arguments[LENGTH]
            // in the main function will deoptimize the, see #1991.
            var iterator = function (obj, iteratee, memo, keys, index, length) {
                var currentKey;
                for (; index >= 0 && index < length; index += dir) {
                    currentKey = keys ? keys[index] : index;
                    memo = iteratee(memo, obj[currentKey], currentKey, obj);
                }
                return memo;
            };
            return function (obj, iteratee, memo, context) {
                // iteratee = optimizeCb(iteratee, context, 4);
                var actualKeys = !isArrayLike(obj) && keys(obj),
                    length = (actualKeys || obj)[LENGTH],
                    index = dir > 0 ? 0 : length - 1;
                // Determine the initial value if none is provided.
                if (arguments[LENGTH] < 3) {
                    memo = obj[actualKeys ? actualKeys[index] : index];
                    index += dir;
                }
                return iterator(obj, iteratee, memo, actualKeys, index, length);
            };
        },
        // **Reduce** builds up a single result from a list of values, aka `inject`,
        // or `foldl`.
        /**
         * @func
         */
        foldl = createReduce(1),
        // The right-associative version of reduce, also known as `foldr`.
        /**
         * @func
         */
        foldr = createReduce(-1),
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
        unwrapper = function (fn) {
            return function (args) {
                args[0] = args[0][ITEMS];
                return fn.call(this, args);
            };
        },
        unwrapInstance = function (instance_) {
            return isInstance(instance, factories.Collection) ? instance_ : instance.unwrap();
        },
        unwrapAll = function (fn) {
            return function (args) {
                duff(args, function (arg, idx, args) {
                    args[idx] = unwrapInstance(arg);
                });
                return fn.call(this, args);
            };
        },
        unwrap = function () {
            return this[ITEMS];
        },
        wrappedCollectionMethods = extend(wrap({
            each: duff,
            duff: duff,
            forEach: duff,
            eachRev: duffRev,
            duffRev: duffRev,
            forEachRev: duffRev
        }, function (fn, val) {
            return function (iterator) {
                fn(this[ITEMS], iterator, this);
                return this;
            };
        }), wrap(gapSplit('addAll removeAll'), function (name) {
            return function () {
                var args = toArray(arguments);
                args.unshift(this);
                // unwrapAll
                duff(args, function (arg, idx, args) {
                    if (isInstance(arg, Collection)) {
                        arg = arg.unwrap();
                    }
                    args[idx] = arg;
                });
                // custom
                _[name].apply(_, args);
                return this;
            };
        }), wrap(gapSplit('sort unshift push cycle uncycle reverse count countTo countFrom eachCall eachRevCall'), function (name) {
            return function () {
                var args = toArray(arguments);
                args.unshift(this[ITEMS]);
                // unwrapper
                // custom
                _[name].apply(_, args);
                return this;
            };
        }), wrap(gapSplit('has add addAt remove removeAt pop shift indexOf find findLast findWhere findLastWhere posit foldr foldl reduce'), function (name) {
            return function () {
                var args = toArray(arguments);
                args.unshift(this[ITEMS]);
                // custom
                return _[name].apply(_, args);
            };
        }), wrap(gapSplit('merge eq map filter pluck where whereNot'), function (name) {
            // always responds with an array
            return function () {
                var args = toArray(arguments);
                args.unshift(this[ITEMS]);
                // unwrapper
                // custom
                return new Collection(_[name].apply(_, args));
            };
        })),
        ret = _.exports({
            eachCall: eachCall,
            eachRevCall: eachRevCall,
            closest: closest,
            // map: map,
            filter: filter,
            reduce: foldl,
            foldl: foldl,
            foldr: foldr,
            matches: matches,
            add: add,
            addAt: addAt,
            addAll: addAll,
            concatUnique: concatUnique,
            removeAt: removeAt,
            remove: remove,
            removeAll: removeAll,
            cycle: cycle,
            uncycle: uncycle,
            mamboWrap: internalMambo,
            mambo: externalMambo,
            concat: concat,
            // listMerge: merge,
            pluck: pluck,
            where: where,
            findWhere: findWhere,
            findLastWhere: findLastWhere,
            between: between,
            eq: eq,
            posit: posit,
            range: range,
            count: count,
            countTo: countTo,
            countFrom: countFrom,
            whereNot: whereNot,
            eachRev: eachRev,
            duffRev: duffRev,
            flatten: flatten
        }),
        interactWithById = function (fun, expecting) {
            return function (one, two, three) {
                var instance = this,
                    bycategories = instance[BY_ID],
                    passedCategory = arguments[LENGTH] === expecting,
                    category = passedCategory ? one : ID,
                    categoryHash = bycategories[category] = bycategories[category] || {},
                    key = passedCategory ? two : one,
                    thing = passedCategory ? three : two;
                return fun(instance, categoryHash, category, key, thing, passedCategory);
            };
        },
        Collection = factories.Model.extend('Collection', extend({
            unwrap: unwrap,
            range: recreateSelf(range),
            flatten: recreateSelf(function () {
                // return
                return flatten.apply(null, this[ITEMS]);
            }),
            concat: recreateSelf(function () {
                var args = [],
                    base = this[ITEMS];
                // this allows us to mix collections with regular arguments
                return base.concat.apply(base, map(arguments, function (arg) {
                    return Collection(arg)[ITEMS];
                }));
            }),
            length: function () {
                return this[ITEMS][LENGTH];
            },
            first: function () {
                return [this[ITEMS][0]];
            },
            last: function () {
                return this[ITEMS][this[LENGTH]() - 1];
            },
            index: function (number) {
                return this[ITEMS][number || 0];
            },
            constructor: function (arr) {
                var collection = this;
                if (!isArray(arr) && isArrayLike(arr)) {
                    arr = toArray(arr);
                }
                if (!isBlank(arr) && !isArrayLike(arr)) {
                    arr = [arr];
                }
                collection[BY_ID] = {};
                collection[ITEMS] = arr || [];
                return collection;
            },
            toString: function () {
                return stringify(this);
            },
            toJSON: function () {
                // subtle distinction here
                return map(this[ITEMS], function (item) {
                    var ret;
                    if (isObject(item) && isFunction(item.toJSON)) {
                        ret = item.toJSON();
                    } else {
                        ret = item;
                    }
                    return ret;
                });
            },
            join: function (delimiter) {
                return this[ITEMS].join(delimiter);
            },
            get: interactWithById(function (instance, categoryHash, category, key) {
                return categoryHash[key];
            }, 2),
            register: interactWithById(function (instance, categoryHash, category, key, newItem) {
                categoryHash[key] = newItem;
            }, 3),
            unRegister: interactWithById(function (instance, categoryHash, category, key) {
                var registeredItem = categoryHash[key];
                if (registeredItem !== blank) {
                    categoryHash[key] = blank;
                }
                return registeredItem;
            }, 2),
            swapRegister: interactWithById(function (instance, categoryHash, category, key, newItem) {
                var registeredItem = categoryHash[key];
                if (registeredItem !== blank) {
                    categoryHash[key] = blank;
                }
                categoryHash[key] = newItem;
                return registeredItem;
            }, 3),
            /**
             * @description adds models to the children array
             * @param {Object|Object[]} objs - object or array of objects to be passed through the model factory and pushed onto the children array
             * @param {Object} [secondary] - secondary hash that is common among all of the objects being created. The parent property is automatically overwritten as the object that the add method was called on
             * @returns {Object|Box} the object that was just created, or the object that the method was called on
             * @name Box#add
             * @func
             */
            mambo: function (fn) {
                var collection = this;
                externalMambo(collection[ITEMS], function () {
                    fn(collection);
                });
                return collection;
            }
        }, wrappedCollectionMethods), !0);
});