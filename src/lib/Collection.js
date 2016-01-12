application.scope(function (app) {
    var blank, _ = app._,
        extendFrom = _.extendFrom,
        factories = _.factories,
        isObject = _.isObject,
        isNumber = _.isNumber,
        isFunction = _.isFunction,
        lengthString = 'length',
        itemsString = '_items',
        previousString = '_previous',
        each = _.each,
        duff = _.duff,
        push = _.push,
        wrap = _.wrap,
        keys = _.keys,
        find = _.find,
        map = _.map,
        stringify = _.stringify,
        findLast = _.findLast,
        allKeys = _.allKeys,
        splice = _.splice,
        toArray = _.toArray,
        gapSplit = _.gapSplit,
        getLength = _.getLen,
        sort = _.sort,
        bindTo = _.bindTo,
        isArrayLike = _.isArrayLike,
        eachCall = function (array, method) {
            return duff(array, function (item) {
                _.result(item, method);
            });
        },
        eachRevCall = function (array, method) {
            return duff(array, function (item) {
                _.result(item, method);
            }, null, -1);
        },
        unshiftContext = function (fn, ctx) {
            return function () {
                var args = toArray(arguments);
                args.unshift(this);
                return fn.call(ctx || this, args, arguments);
            };
        },
        doToEverything = function (doLater, direction) {
            return function () {
                var args = _.toArray(arguments);
                var one = args.shift();
                duff(args, function (items) {
                    duff(items, function (item) {
                        doLater.call(_, one, item);
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
            var len = list[lengthString],
                lastIdx = len || 0;
            splice(list, index || 0, 0, item);
            return len !== list[lengthString];
        },
        range = function (start, stop, step, inclusive) {
            var length, range, idx;
            if (stop === null || stop === void 0) {
                stop = start || 0;
                start = 0;
            }
            if (!isFinite(start) || !_.isNumber(start)) {
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
        count = function (list, start, end, runner) {
            var obj, idx, ctx = this;
            if (start < end && _.isNumber(start) && _.isNumber(end) && isFinite(start) && isFinite(end)) {
                end = Math.abs(end);
                idx = start;
                while (idx < end) {
                    obj = null;
                    if (_.has(list, idx)) {
                        obj = list[idx];
                    }
                    runner.call(ctx, obj, idx, list);
                    idx++;
                }
            }
            return list;
        },
        // array, startIndex, endIndex
        subset = function (list, startIdx, endIdx) {
            var ret = [];
            find(list, function (idx, item) {
                if (startIdx === idx) {
                    open = true;
                    startIdx = idx;
                }
                if (idx >= startIdx + limit) {
                    return true;
                }
                if (open) {
                    ret.push(model);
                }
            });
            // return foldl(list, function(memo,item,idx){
            //     return memo;
            // },[]);
        },
        listFromMixed = function (obj) {
            if (!hasArrayNature(obj)) {
                return [obj];
            } else if (Array.isArray(obj)) {
                return obj.slice();
            } else {
                return toArray(obj);
            }
        },
        /**
         * @func
         */
        closest = function (list, target) {
            var match, path, diff, valuesLen, possible, i = 0,
                previousAbs = Infinity;
            // trying to avoid running through 20 matchs
            // when i'm already at the exact one
            if (isArrayLike(list)) {
                valuesLen = getLength(list);
                if (valuesLen === 1) {
                    match = list[0];
                }
                if (_.indexOf(list, target) !== -1) {
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
            }
            return match;
        },
        countTo = function (list, num, runner) {
            return count(list, 0, num, runner);
        },
        countFrom = function (list, num, runner) {
            return count(list, num, list.length, runner);
        },
        /**
         * @func
         */
        posit = function (list, item, lookAfter) {
            return _.indexOf(list, item, lookAfter) + 1;
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
            var array = [],
                all = concat.apply(null, arguments);
            duff(all, function (item) {
                if (!posit(array, item)) {
                    array.push(item);
                }
            });
            return array;
        },
        cycle = function (arr, num) {
            var piece, len = getLength(arr);
            if (_.isNumber(len)) {
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
                keys = _.keys(attrs),
                obj = Object(object);
            return !find(keys, function (val) {
                if (attrs[val] !== obj[val] || !(val in obj)) {
                    return true;
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
                if (isObject(item)) {
                    if (item[key] !== void 0) {
                        items.push(item[key]);
                    }
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
            return filter(obj, _.negate(matches(attrs)));
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
        merge = splat(function (item, idx, list) {
            var len, collection = this,
                last = getLength(collection);
            if (isArrayLike(item)) {
                len = getLength(item);
                duff(item, function (key, val) {
                    if (val !== void 0) {
                        // removes any undefined items
                        len = key + 1;
                        collection[key] = val;
                    }
                });
                if (len > (last || 0)) {
                    collection[lengthString] = len;
                }
            }
        }),
        eq = function (list, num) {
            var n, thisNum, items = [],
                numb = num || 0,
                evaluatedIsNumber = isNumber(numb),
                isArray = isArrayLike(numb);
            if (numb < 0) {
                evaluatedIsNumber = !1;
            }
            if (getLength(list)) {
                if (evaluatedIsNumber) {
                    items = [list[numb]];
                }
                if (isArray) {
                    items = _.clone(numb);
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
                while (args.length < index) {
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
            // Optimized iterator function as using arguments[lengthString]
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
                    length = getLength(actualKeys || obj),
                    index = dir > 0 ? 0 : length - 1;
                // Determine the initial value if none is provided.
                if (getLength(arguments) < 3) {
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
                bound = bindTo(iteratee, context),
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
                args[0] = args[0][itemsString];
                return fn.call(this, args);
            };
        },
        unwrapInstance = function (instance_) {
            var instance = instance_;
            if (_.isInstance(instance, _.Collection)) {
                instance = instance.un();
            }
            return instance;
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
            return this[itemsString];
        },
        applyToSelf = function (fn) {
            return function () {
                return fn.apply(this, this[itemsString]);
            };
        },
        lengthFn = function () {
            return this[itemsString][lengthString];
        },
        wrappedCollectionMethods = _.extend(wrap({
            each: duff,
            duff: duff,
            forEach: duff,
            eachRev: duffRev,
            duffRev: duffRev,
            forEachRev: duffRev
        }, function (fn, val) {
            return function (iterator) {
                fn(this[itemsString], iterator, this);
                return this;
            };
        }), wrap(gapSplit('addAll removeAll'), function (name) {
            return function () {
                // unshiftContext
                var args = toArray(arguments);
                args.unshift(this);
                // unwrapAll
                duff(args, function (arg, idx, args) {
                    if (arg instanceof Collection) {
                        arg = arg.un();
                    }
                    args[idx] = arg;
                });
                // custom
                _[name].apply(_, args);
                return this;
            };
        }), wrap(gapSplit('sort unshift push cycle uncycle reverse count countTo countFrom eachCall eachRevCall'), function (name) {
            return function () {
                // unshiftContext
                var args = toArray(arguments);
                args.unshift(this[itemsString]);
                // unwrapper
                // custom
                _[name].apply(_, args);
                return this;
            };
        }), wrap(gapSplit('has add addAt remove removeAt pop shift indexOf find findLast findWhere findLastWhere posit foldr foldl reduce'), function (name) {
            return function () {
                // unshiftContext
                var args = toArray(arguments);
                args.unshift(this[itemsString]);
                // custom
                return _[name].apply(_, args);
            };
        }), wrap(gapSplit('merge eq map filter pluck where whereNot'), function (name) {
            // always responds with an array
            return function () {
                // unshiftContext
                var args = toArray(arguments);
                args.unshift(this[itemsString]);
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
            listMerge: merge,
            pluck: pluck,
            where: where,
            findWhere: findWhere,
            findLastWhere: findLastWhere,
            // finder: finder,
            // find: find,
            // findLast: findLast,
            eq: eq,
            posit: posit,
            range: range,
            count: count,
            countTo: countTo,
            countFrom: countFrom,
            whereNot: whereNot,
            eachRev: eachRev,
            duffRev: duffRev,
            unshiftContext: unshiftContext,
            flatten: flatten
            // ,
            // between: between
        }),
        BY_ID = '_byId',
        Collection = extendFrom.Model('Collection', _.extend({
            un: unwrap,
            unwrap: unwrap,
            len: lengthFn,
            length: lengthFn,
            range: recreateSelf(range),
            flatten: recreateSelf(applyToSelf(flatten)),
            index: function (number) {
                return this[itemsString][number || 0];
            },
            first: recreateSelf(function () {
                return [this[itemsString][0]];
            }),
            last: recreateSelf(function () {
                var len = this.length();
                if (len) {
                    return [this[itemsString][len - 1]];
                }
            }),
            concat: recreateSelf(function () {
                var args = [],
                    base = this[itemsString];
                // this allows us to mix collections with regular arguments
                return base.concat.apply(base, map(arguments, function (arg) {
                    return _.Collection(arg)[itemsString];
                }));
            }),
            constructor: function (arr) {
                var collection = this;
                if (!_.isArray(arr) && isArrayLike(arr)) {
                    arr = toArray(arr);
                }
                if (arr !== blank && !isArrayLike(arr)) {
                    arr = [arr];
                }
                collection[itemsString] = arr || [];
                return collection;
            },
            toString: function () {
                return stringify(this);
            },
            toJSON: function () {
                // subtle distinction here
                return map(this[itemsString], function (item) {
                    var ret;
                    if (isObject(item) && _.isFunction(item.toJSON)) {
                        ret = item.toJSON();
                    } else {
                        ret = item;
                    }
                    return ret;
                });
            },
            join: function (delimiter) {
                return this[itemsString].join(delimiter);
            },
            get: function (id) {
                this[BY_ID] = this[BY_ID] || {};
                return this[BY_ID][id];
            },
            /**
             * @description gets the item on the _byId object or function. If the _byId is a function, than the methods are passed automatically to it to process away
             * @func
             * @name Box#find
             * @param {*} id - usually a string to lookup from the hash. could be an object that will be processed by a function
             * @returns {*} thing that was being held at that key value on the _byId hash, or whatever the _byId function returns
             */
            /**
             * @description registers a model by the id that is passed
             * @func
             * @name Box#register
             * @param {String} string - key that the object will be registered under
             * @param {*} thing - anything that you want to store
             * @returns {Box} instance
             */
            register: function (id, thing) {
                this[BY_ID] = this[BY_ID] || {};
                this[BY_ID][id] = thing;
                return this;
            },
            // match: objCondense(function () {}),
            /**
             * @description adds models to the children array
             * @param {Object|Object[]} objs - object or array of objects to be passed through the model factory and pushed onto the children array
             * @param {Object} [secondary] - secondary hash that is common among all of the objects being created. The parent property is automatically overwritten as the object that the add method was called on
             * @returns {Object|Box} the object that was just created, or the object that the method was called on
             * @name Box#add
             * @func
             */
            unRegister: function (id) {
                var box = this,
                    byid = this[BY_ID] = this[BY_ID] || {},
                    item = box[BY_ID][id];
                if (item !== void 0) {
                    box[BY_ID][id] = blank;
                }
                return item;
            },
            mambo: function (fn) {
                var collection = this;
                externalMambo(collection[itemsString], function () {
                    fn(collection);
                });
                return collection;
            }
        }, wrappedCollectionMethods), !0);
});