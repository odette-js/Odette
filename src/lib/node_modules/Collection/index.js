var UNDEFINED, COLLECTION = 'Collection',
    CONSTRUCTOR = 'constructor',
    REVERSED = 'reversed',
    DELIMITED = 'delimited',
    STRING_MANAGER = 'StringManager',
    SORTED_COLLECTION = 'Sorted' + COLLECTION,
    REGISTRY = 'Registry',
    _ = require('debit'),
    Directive = require('../directive'),
    recreatingSelfCollection = _.toArray('results,flatten,gather,unique').concat(associatedBuilderKeys('map')),
    recreateSelfConstructor = _.toArray('eq,where,whereNot').concat(associatedBuilderKeys('filter'), associatedBuilderKeys('filterNegative')),
    eachHandlerKeys = associatedBuilderKeys('forEach'),
    abstractedCanModify = _.toArray('add'),
    abstractedCannotModify = _.toArray('insertAt,remove,removeAt,removeWhere,findRemoveWhere'),
    nativeCannotModify = _.toArray('pop,shift,splice'),
    reverseCollection = _.toArray('reverse'),
    splatHandlers = _.toArray('push,unshift'),
    joinHandlers = _.toArray('join'),
    countingCollection = _.toArray('count,countTo,countFrom'),
    foldIteration = _.toArray('reduce,reduceRight'),
    findIteration = _.toArray('find,findRight,findWhere,findWhereRight').concat(associatedBuilderKeys('find')),
    indexers = _.toArray('indexOf,includes'),
    foldFindIteration = foldIteration.concat(findIteration),
    // ret = _.publicize({
    // filter: filter,
    // matches: matches,
    // results: results,
    // cycle: cycle,
    // uncycle: uncycle,
    // concat: concat,
    // where: where,
    // findWhere: findWhere,
    // findWhereRight: findWhereRight,
    // range: range,
    // count: count,
    // countTo: countTo,
    // countFrom: countFrom,
    // whereNot: whereNot,
    // eachRight: eachRight,
    // forEachRight: forEachRight,
    // flatten: flatten,
    // eq: equalize
    // }),
    wrappedCollectionMethods = _.extend([{
        seeker: function (handler) {
            var context = this,
                bound = _.bindTo(handler, context);
            return _.forEachRight(context.toArray(), function (one, two, three) {
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
    }, _.reduce(joinHandlers, function (memo, name) {
        memo[name] = function (arg) {
            return this.toArray()[name](arg);
        };
    }, {}), _.reduce(indexers.concat(abstractedCanModify), function (memo, name) {
        var fn = _[name];
        memo[name] = function (one, two, three, four, five) {
            return fn(this.toArray(), one, two, three, four, five);
        };
    }, {}), _.reduce(splatHandlers, function (memo, name) {
        memo[name] = function (args_) {
            var items = this.toArray();
            return items[name].apply(items, _.isArray(args_) ? args_ : arguments);
        };
    }), _.reduce(nativeCannotModify, function (memo, name) {
        memo[name] = function (one, two, three, four, five, six) {
            return this.toArray()[name](one, two, three, four, five, six);
        };
    }), _.reduce(abstractedCannotModify, function (memo, name) {
        var fn = _[name];
        memo[name] = function (one, two, three, four, five) {
            return fn(this.toArray(), one, two, three, four, five);
        };
    }), _.reduce(reverseCollection, function (memo, name) {
        memo[name] = function () {
            var context = this;
            context.remark(REVERSED, !context.is(REVERSED));
            context.toArray()[name]();
            return context;
        };
    }), _.reduce(countingCollection, function (memo, name) {
        memo[name] = function (runner, fromHere, toThere) {
            var context = this;
            _[name](context.toArray(), _.bindTo(runner, context), fromHere, toThere);
            return context;
        };
    }), _.reduce(recreatingSelfCollection, function (memo, name) {
        memo[name] = function (one, two, three) {
            var context = this;
            return new Collection[CONSTRUCTOR](_[name](context.toArray(), one, two, three));
        };
    }), _.reduce(recreateSelfConstructor, function (memo, name) {
        memo[name] = function (one, two, three) {
            var context = this;
            return new this.__constructor__(_[name](context.toArray(), one, two, three));
        };
    }), _.reduce(foldFindIteration, function (memo, name) {
        var fn = _[name];
        memo[name] = function (one, two, three) {
            return fn(this.toArray(), one, two, three);
        };
    })]);
module.exports = Directive.extend(COLLECTION, _.extend([{
    get: Directive.parody(REGISTRY, 'get'),
    getBy: Directive.parody(REGISTRY, 'get'),
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
        context.items = _.isNil(items) ? [] : (Collection.isInstance(items) ? items.toArray().slice(0) : toArray(items));
        context.unmark(REVERSED);
        return context;
    },
    toArray: unwrapper,
    unwrap: unwrapper,
    wrap: function (context) {
        return Collection(context);
    },
    length: function () {
        return this.toArray().length;
    },
    first: function () {
        return this.toArray()[0];
    },
    last: function () {
        var items = this.toArray();
        return items[items.length - 1];
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
            // auto checks for collection / array combo
            return Collection(arg).toArray();
        }));
    })
}, wrappedCollectionMethods]));
// function remove(list, item, lookAfter, lookBefore, fromRight) {
//     var index = indexOf(list, item, lookAfter, lookBefore, fromRight);
//     if (index + 1) {
//         removeAt(list, index);
//     }
//     index = index + 1;
//     return !!index;
// }
// function removeAt(list, index) {
//     return list.splice(index, 1)[0];
// }
// function removeWhere(list, matchr) {
//     var matcher = matches(matchr);
//     forEachRight(list, function (item, index) {
//         if (matcher(item)) {
//             removeAt(list, index);
//         }
//     });
// }
// function findRemoveWhere(list, matcher) {
//     var found;
//     if ((found = findWhere(list, matcher))) {
//         remove(list, found);
//     }
// }
// function add(list, item, lookAfter, lookBefore, fromRight) {
//     var value = 0,
//         index = indexOf(list, item, lookAfter, lookBefore, fromRight);
//     if (index === -1) {
//         value = list.push(item);
//     }
//     return !!value;
// }
// function insertAt(list, item, index) {
//     var len = list.length,
//         lastIdx = len || 0;
//     list.splice(index || 0, 0, item);
//     return len !== list.length;
// }
function equalize(list, num, caller_) {
    var n, thisNum, caller = caller_ || noop,
        items = [],
        numb = num || 0,
        isNumberResult = isNumber(numb),
        isArrayLikeResult = isArrayLike(numb);
    if (numb < 0) {
        isNumberResult = !1;
    }
    if (!list.length) {
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
    if (_.isNil(stop)) {
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
}

function count(list, runner, start, end) {
    var obj, idx;
    if (start >= end || !_.isNumber(start) || !_.isNumber(end) || !isFinite(start) || !isFinite(end)) {
        return list;
    }
    end = Math.abs(end);
    idx = start;
    while (idx < end) {
        obj = null;
        if (list.length > idx) {
            obj = list[idx];
        }
        runner(obj, idx, list);
        idx++;
    }
    return list;
}

function countTo(list, runner, num) {
    return _.count(list, runner, 0, _.clamp(num, 0));
}

function countFrom(list, runner, num) {
    return _.count(list, runner, _.clamp(num, 0) || 0, list.length);
}

function closestIndex(array, searchElement, minIndex_, maxIndex_) {
    var currentIndex, currentElement, found,
        minIndex = minIndex_ || 0,
        maxIndex = maxIndex_ || array.length - 1;
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

function unwrapper() {
    return this.items;
}

function recreateSelf(fn, context) {
    return function () {
        return this.wrap(fn.apply(context || this, arguments));
    };
}

function associatedBuilderKeys(key) {
    return _.keys(_.buildMethods(key, false, true));
}