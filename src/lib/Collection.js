application.scope(function (app) {
    var ITEMS = '_items',
        BY_ID = '_byId',
        ID = 'id',
        PREVIOUS = '_previous',
        eachCall = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            });
        },
        eachRevCall = function (array, method, arg) {
            return duff(array, function (item) {
                result(item, method, arg);
            }, NULL, -1);
        },
        doToEverything = function (doLater, direction) {
            return function () {
                var args = toArray(arguments),
                    one = args.shift();
                duff(args, function (items) {
                    duff(items, function (item) {
                        doLater(one, item);
                    }, NULL, direction || 1);
                });
                return one;
            };
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
                val = push(list, item);
            }
            return !!val;
        },
        addAt = function (list, item, index) {
            var len = list[LENGTH],
                lastIdx = len || 0;
            splice(list, index || 0, 0, item);
            return len !== list[LENGTH];
        },
        eq = function (list, num) {
            var n, thisNum, items = [],
                numb = num || 0,
                isNumberResult = isNumber(numb),
                isArrayLikeResult = isArrayLike(numb);
            if (numb < 0) {
                isNumberResult = !1;
            }
            if (list[LENGTH]) {
                if (isNumberResult) {
                    items = [list[numb]];
                }
                if (isArrayLikeResult) {
                    duff(numb, function (num) {
                        items.push(list[num]);
                    });
                }
                if (!isArrayLikeResult && !isNumberResult && list[0]) {
                    items = [list[0]];
                }
            }
            return items;
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
            duff(concat.apply(NULL, arguments), function (item) {
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
                if (isObject(item) && item[key] !== UNDEFINED) {
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
                    memo = memo.concat(flatten.apply(NULL, item));
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
            eachRev: duffRev,
            duffRev: duffRev,
            forEachRev: duffRev,
            eachCall: eachCall,
            eachRevCall: eachRevCall
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
                var array = this.unwrap();
                array[name].apply(array, arguments);
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
        })), wrap(gapSplit('count countTo countFrom'), function (name) {
            return function (one, two, three) {
                var ctx = this;
                _[name](ctx.unwrap(), one, ctx, two, three);
                return ctx;
            };
        }), wrap(gapSplit('foldr foldl reduce find findLast findWhere findLastWhere'), function (name) {
            return function (fn, ctx, memo) {
                return _[name](this.unwrap(), fn, ctx, memo);
            };
        }), wrap(gapSplit('has add addAt remove removeAt indexOf posit foldr foldl reduce'), function (name) {
            return function (one, two, three) {
                return _[name](this.unwrap(), one, two, three);
            };
        }), wrap(gapSplit('flatten'), function (name) {
            return recreateSelf(function () {
                return _[name](this.unwrap());
            });
        }), wrap(gapSplit('eq map filter pluck where whereNot sort cycle uncycle'), function (name) {
            return recreateSelf(function (fn) {
                return _[name](this.unwrap(), fn);
            });
        }), wrap(gapSplit('merge'), function (name) {
            // always responds with an array
            return function (newish, truth) {
                _[name](this.unwrap(), newish, truth);
                return this;
            };
        })),
        ret = _.exports({
            eachCall: eachCall,
            eachRevCall: eachRevCall,
            closest: closest,
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
            eachRev: eachRev,
            duffRev: duffRev,
            flatten: flatten,
            eq: eq
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
        Collection = Model.extend('Collection', extend({
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
            results: function (key, arg, knows) {
                this.each(function (obj) {
                    result(obj, key, arg, knows);
                });
                return this;
            },
            unwrap: function () {
                return this[ITEMS];
            },
            empty: function () {
                var collection = this;
                collection[ITEMS] = [];
                collection[BY_ID] = {};
                return collection;
            },
            swap: function (arr, hash) {
                var collection = this;
                collection[ITEMS] = arr || [];
                collection[BY_ID] = hash || {};
                return collection;
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
            constructor: function (arr) {
                var collection = this;
                if (isArrayLike(arr)) {
                    if (!isArray(arr)) {
                        arr = toArray(arr);
                    }
                } else {
                    if (!isBlank(arr)) {
                        arr = [arr];
                    }
                }
                collection.swap(arr);
                return collection;
            },
            toString: function () {
                return stringify(this.unwrap());
            },
            toJSON: function () {
                // subtle distinction here
                return map(this.unwrap(), function (item) {
                    var ret;
                    if (isObject(item) && isFunction(item.toJSON)) {
                        ret = item.toJSON();
                    } else {
                        ret = item;
                    }
                    return ret;
                });
            },
            get: interactWithById(function (instance, categoryHash, category, key) {
                return categoryHash[key];
            }, 2),
            register: interactWithById(function (instance, categoryHash, category, key, newItem) {
                categoryHash[key] = newItem;
            }, 3),
            unRegister: interactWithById(function (instance, categoryHash, category, key) {
                var registeredItem = categoryHash[key];
                if (registeredItem !== UNDEFINED) {
                    categoryHash[key] = UNDEFINED;
                }
                return registeredItem;
            }, 2),
            swapRegister: interactWithById(function (instance, categoryHash, category, key, newItem) {
                var registeredItem = categoryHash[key];
                if (registeredItem !== UNDEFINED) {
                    categoryHash[key] = UNDEFINED;
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
                externalMambo(collection.unwrap(), function () {
                    fn(collection);
                });
                return collection;
            }
        }, wrappedCollectionMethods), BOOLEAN_TRUE),
        StringObject = Model.extend('StringObject', {
            constructor: function (value, parent) {
                var string = this;
                string.value = value;
                string.parent = parent;
                string.validate();
                return string;
            },
            validate: function () {
                this.valid = BOOLEAN_TRUE;
            },
            invalidate: function () {
                this.valid = BOOLEAN_FALSE;
            },
            toggleValid: function () {
                this.valid = !this.valid;
            },
            isValid: function () {
                return this.valid;
            },
            valueOf: function () {
                return this.value;
            },
            toString: function () {
                return this.valueOf();
            },
            generate: function (delimiter) {
                return this.isValid() ? delimiter + this.valueOf() : EMPTY_STRING;
            }
        }, BOOLEAN_TRUE),
        StringManager = Collection.extend('StringManager', {
            Child: StringObject,
            add: function (string) {
                var sm = this,
                    found = sm.get(string);
                if (string) {
                    if (found) {
                        found.validate();
                    } else {
                        found = sm.Child(string, sm);
                        sm.unwrap().push(found);
                        sm.register(string, found);
                    }
                }
                return found;
            },
            increment: function () {},
            decrement: function () {},
            remove: function (string) {
                var sm = this,
                    found = sm.get(string);
                if (string) {
                    if (found) {
                        found.invalidate();
                    }
                }
                return sm;
            },
            toggle: function (string) {
                var sm = this,
                    found = sm.get(string);
                if (!found) {
                    sm.add(string);
                } else {
                    found.toggleValid();
                }
            },
            generate: function (delimiter_) {
                var string = EMPTY_STRING,
                    parent = this;
                parent.delimiter = delimiter_;
                parent.eachRev(function (stringInstance, idx) {
                    var fromRight, stringInstanceIndex,
                        delimiter = idx ? parent.delimiter : EMPTY_STRING,
                        generated = stringInstance.generate(delimiter);
                    string += generated;
                    if (!generated) {
                        fromRight = idx > parent.length();
                        stringInstanceIndex = parent.indexOf(stringInstance, UNDEFINED, UNDEFINED, fromRight);
                        parent.removeAt(stringInstanceIndex);
                    }
                });
                parent.current(string);
                return string;
            },
            current: function (current_) {
                var sm = this;
                if (arguments[LENGTH]) {
                    sm._currentValue = current_;
                    return sm;
                } else {
                    return sm._currentValue;
                }
            },
            ensure: function (value_, splitter) {
                var sm = this,
                    value = value_;
                if (sm.current() !== value) {
                    if (isString(value)) {
                        value = value.split(splitter);
                    }
                    duff(value, function (item) {
                        sm.add(item);
                    });
                    sm.current(value.join(splitter));
                }
                return sm;
            }
        }, BOOLEAN_TRUE);
});