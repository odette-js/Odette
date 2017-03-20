var UNDEFINED, validIdMessage = 'objects in sorted collections must have either a number or string for their valueOf result',
    isNullMessage = 'object must not be null or ' + UNDEFINED,
    ID = 'id',
    isArrayLike = require('./lib/utils/is/array-like'),
    Collection = require('./lib/Collection'),
    closestIndex = require('./lib/utils/array/index/closest'),
    isString = require('./lib/utils/is/string'),
    isNumber = require('./lib/utils/is/number'),
    smartIndexOf = require('./lib/utils/array/index/of/smart'),
    bindTo = require('./lib/utils/function/bind/to'),
    isArray = require('./lib/utils/is/array'),
    forEach = require('./lib/utils/array/for/each'),
    isNil = require('./lib/utils/is/nil'),
    exception = require('./lib/utils/console').exception;
module.exports = Collection.extend('SortedCollection', {
    constructor: function (context_, skip) {
        var sorted = this;
        sorted['constructor:Collection']();
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
        return smartIndexOf(this.toArray(), object, true);
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
            isNotNull = isNil(object) && exception(isNullMessage),
            valueOfResult = object && object.valueOf();
        if (isNil(object) || isNil(sorted.get(ID, valueOfResult))) {
            return false;
        }
        sorted.removeAt(index === UNDEFINED ? sorted.indexOf(object) : index);
        sorted.drop(ID, valueOfResult);
        return true;
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
});

function sortedAdd(object) {
    var registryDirective, ret, sorted = this,
        isNotNull = isNil(object) && exception(isNullMessage),
        valueOfResult = object && object.valueOf(),
        retrieved = (registryDirective = sorted[REGISTRY]) && sorted.get(ID, valueOfResult);
    if (retrieved) {
        return false;
    }
    ret = !sorted.validIDType(valueOfResult) && exception(validIdMessage);
    sorted.insertAt(object, sorted.closestIndex(valueOfResult) + 1);
    (registryDirective || sorted.directive(REGISTRY)).keep(ID, valueOfResult, object);
    return BOOLEAN_TRUE;
}