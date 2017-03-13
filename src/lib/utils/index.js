var FIND = 'find';
var FIND_KEY = FIND + 'Key';
var isStrictlyEqual = require('./utils/is/strictly-equal');
var merge = require('./utils/object/merge');
var capitalize = require('./utils/string/capitalize');
var mapKeys = require('./utils/array/map/keys');
var returns = require('./utils/returns');
var kebab = require('./utils/string/case/kebab');
var extend = require('./utils/object/extend');
var forEach = require('./utils/array/for/each');
var forEachRight = require('./utils/array/for/each-right');
var forOwn = require('./utils/object/for-own');
var forOwnRight = require('./utils/object/for-own-right');
var forIn = require('./utils/object/for-in');
var forInRight = require('./utils/object/for-in-right');
var map = require('./utils/array/map');
var mapRight = require('./utils/array/map/right');
var mapValues = require('./utils/array/map/values');
var mapValuesRight = require('./utils/array/map/values-right');
var mapKeys = require('./utils/array/map/keys');
var mapKeysRight = require('./utils/array/map/keys-right');
var where = require('./utils/array/where');
var whereRight = require('./utils/array/where/right');
var whereNot = require('./utils/array/where/not');
var whereNotRight = require('./utils/array/where/not-right');
var find = require('./utils/array/find');
var findRight = require('./utils/array/find/right');
var findIn = require('./utils/array/find/in');
var findInRight = require('./utils/array/find/in-right');
var findOwn = require('./utils/array/find/own');
var findOwnRight = require('./utils/array/find/own-right');
var findKey = require('./utils/array/find/key');
var findKeyIn = require('./utils/array/find/key-in');
var findKeyInRight = require('./utils/array/find/key-in-right');
var findKeyOwn = require('./utils/array/find/key-own');
var findKeyOwnRight = require('./utils/array/find/key-own-right');
var findKeyRight = require('./utils/array/find/key');
var reduce = require('./utils/array/reduce');
var reduceRight = require('./utils/array/reduce/right');
var filter = require('./utils/array/filter');
var filterRight = require('./utils/array/filter/right');
var filterNegative = require('./utils/array/filter/negative');
var filterNegativeRight = require('./utils/array/filter/negative-right');
var dropWhile = require('./utils/array/drop/while');
var dropWhileRight = require('./utils/array/drop/while-right');
var findWhere = require('./utils/array/find/where');
var findWhereRight = require('./utils/array/find/where-right');
var findKeyWhere = require('./utils/array/find/key-where');
var findKeyWhereRight = require('./utils/array/find/key-where-right');
var doTry = require('./utils/function/do-try');
var cases = {
    spinal: kebab,
    kebab: kebab,
    camel: require('./utils/string/case/camel'),
    lower: require('./utils/string/case/lower'),
    snake: require('./utils/string/case/snake'),
    upper: require('./utils/string/case/upper')
};
var returnsHash = {
    array: require('./utils/returns/array'),
    baseType: require('./utils/returns/base-type'),
    emptyString: require('./utils/returns/empty-string'),
    false: require('./utils/returns/false'),
    first: require('./utils/returns/first'),
    object: require('./utils/returns/object'),
    null: require('./utils/returns/null'),
    self: require('./utils/returns/self'),
    second: require('./utils/returns/second'),
    true: require('./utils/returns/true'),
};
var to = {
    array: require('./utils/to/array'),
    boolean: require('./utils/cast-boolean'),
    finite: require('./utils/to/finite'),
    function: require('./utils/to/function'),
    integer: require('./utils/to/integer'),
    iterable: require('./utils/to/iterable'),
    length: require('./utils/to/length'),
    number: require('./utils/to/number'),
    object: require('./utils/to/object'),
    path: require('./utils/to/path'),
    stringResult: require('./utils/to/string-result'),
    string: require('./utils/to/string'),
};
var is = {
    arrayLike: require('./utils/is/array-like'),
    array: require('./utils/is/array'),
    boolean: require('./utils/is/boolean'),
    defined: require('./utils/is/defined'),
    emptyArray: require('./utils/is/empty-array'),
    empty: require('./utils/is/empty'),
    equal: require('./utils/is/equal'),
    false: require('./utils/is/false'),
    falsey: require('./utils/is/falsey'),
    function: require('./utils/is/function'),
    greaterThan: require('./utils/is/greater-than'),
    http: require('./utils/is/http'),
    infinite: require('./utils/is/infinite'),
    instance: require('./utils/is/instance'),
    integer: require('./utils/is/integer'),
    key: require('./utils/is/key'),
    match: require('./utils/is/match'),
    nan: require('./utils/is/nan'),
    nil: require('./utils/is/nil'),
    null: require('./utils/is/null'),
    number: require('./utils/is/number'),
    object: require('./utils/is/object'),
    of: require('./utils/is/of'),
    promise: require('./utils/is/promise'),
    regExp: require('./utils/is/reg-exp'),
    strictlyEqual: isStrictlyEqual,
    string: require('./utils/is/string'),
    symbol: require('./utils/is/symbol'),
    thennable: require('./utils/is/thennable'),
    true: require('./utils/is/true'),
    truthy: require('./utils/is/truthy'),
    undefined: require('./utils/is/undefined'),
    validInteger: require('./utils/is/valid-integer'),
    value: require('./utils/is/value'),
    window: require('./utils/is/window')
};
module.exports = extend([{
        to: to,
        merge: merge,
        case: cases,
        is0: require('./utils/is/0'),
        is: merge(isStrictlyEqual, is),
        cacheable: require('./utils/function/cacheable'),
        categoricallyCacheable: require('./utils/function/cacheable/categorically'),
        castBoolean: require('./utils/cast-boolean'),
        nonEnumerableProps: require('./utils/non-enumerable-props'),
        callObjectToString: require('./utils/call-object-to-string'),
        eq: require('./utils/eq'),
        concat: require('./utils/array/concat'),
        concatUnique: require('./utils/array/concat/unique'),
        flatten: require('./utils/array/flatten'),
        flattenDeep: require('./utils/array/flatten/deep'),
        flattenSelectively: require('./utils/array/flatten/selectively'),
        lastIndex: require('./utils/array/index/last'),
        possibleIndex: require('./utils/array/index/possible'),
        indexOf: require('./utils/array/index/of'),
        indexOfNaN: require('./utils/array/index/of/nan'),
        lastIndexOf: require('./utils/array/index/of/last'),
        lastIndexOfNaN: require('./utils/array/index/of/last-nan'),
        sortedIndexOf: require('./utils/array/index/of/sorted'),
        smartIndexOf: require('./utils/array/index/of/smart'),
        sort: require('./utils/array/sort'),
        sortBy: require('./utils/array/sort/by'),
        uniqueWith: require('./utils/array/unique/with'),
        uniqueBy: require('./utils/array/unique/by'),
        console: require('./utils/console'),
        chunk: require('./utils/array/chunk'),
        compact: require('./utils/array/compact'),
        contains: require('./utils/array/contains'),
        drop: require('./utils/array/drop'),
        dropRight: require('./utils/array/drop-right'),
        firstIs: require('./utils/array/first-is'),
        first: require('./utils/array/first'),
        gather: require('./utils/array/gather'),
        head: require('./utils/array/head'),
        itemIs: require('./utils/array/item-is'),
        join: require('./utils/array/join'),
        lastIs: require('./utils/array/last-is'),
        last: require('./utils/array/last'),
        nthIs: require('./utils/array/nth-is'),
        nth: require('./utils/array/nth'),
        push: require('./utils/array/push'),
        results: require('./utils/array/results'),
        slice: require('./utils/array/slice'),
        split: require('./utils/array/split'),
        zip: require('./utils/array/zip'),
        toggle: require('./utils/boolean/toggle'),
        dateOffset: require('./utils/date/offset'),
        date: require('./utils/date'),
        now: require('./utils/date/now'),
        defaultTo1: require('./utils/default-to/1'),
        debounce: require('./utils/function/async/debounce'),
        defer: require('./utils/function/async/defer'),
        throttle: require('./utils/function/async/throttle'),
        bindTo: require('./utils/function/bind-to'),
        bindWith: require('./utils/function/bind-with'),
        bind: require('./utils/function/bind'),
        evaluate: require('./utils/function/evaluate'),
        extendConstructor: require('./utils/function/extend'),
        factory: require('./utils/function/factory'),
        flows: require('./utils/function/flows'),
        once: require('./utils/function/once'),
        result: require('./utils/function/result'),
        reverseParams: require('./utils/function/reverse-params'),
        whilst: require('./utils/function/whilst'),
        wrapper: require('./utils/function/wrapper'),
        wraptry: require('./utils/function/wrap-try'),
        objectGenerator: require('./utils/generator/object'),
        arrayGenerator: require('./utils/generator/array'),
        isNotNan: require('./utils/is/not/nan'),
        isNotStrictlyEqual: require('./utils/is/not/strictly-equal'),
        iterateOverPath: require('./utils/iterate/over-path'),
        iterateIn: require('./utils/iterate/in'),
        iterateOwn: require('./utils/iterate/own'),
        couldBeJSON: require('./utils/JSON/could-be'),
        cloneJSON: require('./utils/JSON/clone'),
        parseJSON: require('./utils/JSON/parse'),
        stringifyJSON: require('./utils/JSON/stringify'),
        keys: require('./utils/keys'),
        allKeys: require('./utils/keys/all'),
        euclideanDistance: require('./utils/number/euclidean-distance'),
        euclideanDistanceOrigin: require('./utils/number/euclidean-distance/origin'),
        greaterThan0: require('./utils/number/greater-than/0'),
        clamp: require('./utils/number/clamp'),
        floatToInteger: require('./utils/number/float-to-integer'),
        maxInteger: require('./utils/number/max-integer'),
        maxSafeInteger: require('./utils/number/max-safe-integer'),
        roundFloat: require('./utils/number/round-float'),
        safeInteger: require('./utils/number/safe-integer'),
        under1: require('./utils/number/under1'),
        withinRange: require('./utils/number/within-range'),
        mergeWithDeepCustomizer: require('./utils/object/merge/with-deep-customizer'),
        mergeWithShallowCustomizer: require('./utils/object/merge/with-shallow-customizer'),
        mergeWith: require('./utils/object/merge/with'),
        at: require('./utils/object/at'),
        clone: require('./utils/object/clone'),
        create: require('./utils/object/create'),
        extend: require('./utils/object/extend'),
        fromPairs: require('./utils/object/from-pairs'),
        get: require('./utils/object/get'),
        has: require('./utils/object/has'),
        intendedApi: require('./utils/object/intended-api'),
        intendedIteration: require('./utils/object/intended-iteration'),
        intendedObject: require('./utils/object/intended'),
        invert: require('./utils/object/invert'),
        set: require('./utils/object/set'),
        stringify: require('./utils/object/stringify'),
        values: require('./utils/object/values'),
        passesFirst: require('./utils/passes/first'),
        passesSecond: require('./utils/passes/second'),
        performance: require('./utils/performance'),
        performanceNow: require('./utils/performance/now'),
        returns: merge(returns, returnsHash),
        capitalize: require('./utils/string/capitalize'),
        stringConcat: require('./utils/string/concat'),
        createEscaper: require('./utils/string/create-escaper'),
        objectParse: require('./utils/string/object-parse'),
        customUnits: require('./utils/string/units/custom'),
        deburr: require('./utils/string/deburr'),
        deprefix: require('./utils/string/deprefix'),
        hasUnicodeWord: require('./utils/string/has-unicode-word'),
        escapeMap: require('./utils/string/escape-map'),
        escape: require('./utils/string/escape'),
        pad: require('./utils/string/pad'),
        padEnd: require('./utils/string/pad-end'),
        padStart: require('./utils/string/pad-start'),
        unescape: require('./utils/string/unescape'),
        unescapeMap: require('./utils/string/unescape-map'),
        units: require('./utils/string/units'),
        words: require('./utils/string/words'),
        time: require('./utils/time'),
        indent: require('./utils/string/indent'),
        parseURL: require('./utils/URL/parse'),
        protocol: require('./utils/URL/protocol'),
        protocols: require('./utils/URL/protocols'),
        reference: require('./utils/URL/reference'),
        stringifyQuery: require('./utils/URL/stringify-query'),
        matchesBinary: require('./utils/matches-binary'),
        matchesProperty: require('./utils/matches-property'),
        matches: require('./utils/matches'),
        maxVersion: require('./utils/max-version'),
        baseDataTypes: require('./utils/base-data-types'),
        negate: require('./utils/negate'),
        property: require('./utils/property'),
        noop: require('./utils/function/noop'),
        parse: require('./utils/object/parse'),
        type: require('./utils/type')
    }, mapKeys(is, mapKeysPrefix('is')), mapKeys(returnsHash, mapKeysPrefix('returns')), mapKeys(to, mapKeysPrefix('to')), mapKeys(cases, function (value, key) {
        return key + 'Case';
    }),
    buildCallers('forEach', forEach, forEachRight),
    buildCallers('forOwn', forOwn, forOwnRight),
    buildCallers('forIn', forIn, forInRight),
    buildCallers('map', map, mapRight),
    buildCallers('mapValues', mapValues, mapValuesRight),
    buildCallers('mapKeys', mapKeys, mapKeysRight),
    buildCallers('where', where, whereRight),
    buildCallers('whereNot', whereNot, whereNotRight),
    buildCallers(FIND, find, findRight),
    buildCallers(FIND + 'In', findIn, findInRight),
    buildCallers(FIND + 'Own', findOwn, findOwnRight),
    buildCallers(FIND_KEY, findKey, findKeyRight),
    buildCallers(FIND_KEY + 'Own', findKeyOwn, findKeyOwnRight),
    buildCallers(FIND_KEY + 'In', findKeyIn, findKeyInRight),
    buildCallers(FIND + 'Where', findWhere, findWhereRight),
    buildCallers(FIND_KEY + 'Where', findKeyWhere, findKeyWhereRight),
    buildCallers('reduce', reduce, reduceRight),
    buildCallers('filter', filter, filterRight),
    buildCallers('filterNegative', filterNegative, filterNegativeRight),
    buildCallers('dropWhile', dropWhile, dropWhileRight)
]);

function mapKeysPrefix(prefix) {
    return function (value, key) {
        return prefix + capitalize(key);
    };
}

function buildCallers(prefix, handler, second, memo_) {
    var memo = memo_ || {},
        CALL = 'Call',
        BOUND = 'Bound',
        TRY = 'Try';
    memo[prefix] = handler;
    memo[prefix + CALL] = function (array, method, arg) {
        return handler(array, function (item) {
            return item[method](arg);
        });
    };
    memo[prefix + CALL + BOUND] = function (array, arg) {
        return handler(array, function (fn) {
            return fn(arg);
        });
    };
    memo[prefix + CALL + TRY] = function (array, method, arg, catcher, finallyer) {
        return handler(array, doTry(function (item) {
            return item[method](arg);
        }, catcher, finallyer));
    };
    memo[prefix + CALL + BOUND + TRY] = function (array, method, arg, catcher, finallyer) {
        return handler(array, doTry(function (item) {
            return item(arg);
        }, catcher, finallyer));
    };
    if (second) {
        buildCallers(prefix + 'Right', second, null, memo);
    }
    return memo;
}