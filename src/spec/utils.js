application.scope().run(window, function (module, app, _, factories, $) {
    test.describe('var _ = app._;', function () {
        var baseString = 'my string is a great string',
            specialString = 'here&are*a ()lot o~/f special_+characters',
            makeArray = function () {
                return baseString.split(' ');
            };
        test.describe('base array methods', function () {
            test.it('_.indexOf', function () {
                test.expect(_.indexOf(makeArray(), 'is')).toEqual(makeArray().indexOf('is'));
            }, 1);
            test.it('_.sort', function () {
                test.expect(_.sort(makeArray())).toEqual(makeArray().sort());
            }, 1);
        });
        test.describe('base object methods', function () {
            test.it('_.has', function () {
                var baseObj = {
                    one: null
                };
                test.expect(_.has(baseObj, 'one')).toEqual(baseObj.hasOwnProperty('one'));
            }, 1);
            test.it('_.isFunction', function () {
                test.expect(_.isFunction(true)).toEqual(false);
                test.expect(_.isFunction(false)).toEqual(false);
                test.expect(_.isFunction(1)).toEqual(false);
                test.expect(_.isFunction(0)).toEqual(false);
                test.expect(_.isFunction(Infinity)).toEqual(false);
                test.expect(_.isFunction(NaN)).toEqual(false);
                test.expect(_.isFunction(null)).toEqual(false);
                test.expect(_.isFunction(undefined)).toEqual(false);
                test.expect(_.isFunction('')).toEqual(false);
                test.expect(_.isFunction(baseString)).toEqual(false);
                test.expect(_.isFunction([])).toEqual(false);
                test.expect(_.isFunction({})).toEqual(false);
                test.expect(_.isFunction(window)).toEqual(false);
                test.expect(_.isFunction(function () {})).toEqual(true);
            }, 14);
            test.it('_.isBoolean', function () {
                test.expect(_.isBoolean(true)).toEqual(true);
                test.expect(_.isBoolean(false)).toEqual(true);
                test.expect(_.isBoolean(1)).toEqual(false);
                test.expect(_.isBoolean(0)).toEqual(false);
                test.expect(_.isBoolean(Infinity)).toEqual(false);
                test.expect(_.isBoolean(NaN)).toEqual(false);
                test.expect(_.isBoolean(null)).toEqual(false);
                test.expect(_.isBoolean(undefined)).toEqual(false);
                test.expect(_.isBoolean('')).toEqual(false);
                test.expect(_.isBoolean(baseString)).toEqual(false);
                test.expect(_.isBoolean([])).toEqual(false);
                test.expect(_.isBoolean({})).toEqual(false);
                test.expect(_.isBoolean(window)).toEqual(false);
                test.expect(_.isBoolean(function () {})).toEqual(false);
            }, 14);
            test.it('_.isString', function () {
                test.expect(_.isString(true)).toEqual(false);
                test.expect(_.isString(false)).toEqual(false);
                test.expect(_.isString(1)).toEqual(false);
                test.expect(_.isString(0)).toEqual(false);
                test.expect(_.isString(Infinity)).toEqual(false);
                test.expect(_.isString(NaN)).toEqual(false);
                test.expect(_.isString(null)).toEqual(false);
                test.expect(_.isString(undefined)).toEqual(false);
                test.expect(_.isString('')).toEqual(true);
                test.expect(_.isString(baseString)).toEqual(true);
                test.expect(_.isString([])).toEqual(false);
                test.expect(_.isString({})).toEqual(false);
                test.expect(_.isString(window)).toEqual(false);
                test.expect(_.isString(function () {})).toEqual(false);
            }, 14);
            test.it('_.isNumber', function () {
                test.expect(_.isNumber(true)).toEqual(false);
                test.expect(_.isNumber(false)).toEqual(false);
                test.expect(_.isNumber(1)).toEqual(true);
                test.expect(_.isNumber(0)).toEqual(true);
                test.expect(_.isNumber(Infinity)).toEqual(true);
                test.expect(_.isNumber(NaN)).toEqual(false);
                test.expect(_.isNumber(null)).toEqual(false);
                test.expect(_.isNumber(undefined)).toEqual(false);
                test.expect(_.isNumber('')).toEqual(false);
                test.expect(_.isNumber(baseString)).toEqual(false);
                test.expect(_.isNumber([])).toEqual(false);
                test.expect(_.isNumber({})).toEqual(false);
                test.expect(_.isNumber(window)).toEqual(false);
                test.expect(_.isNumber(function () {})).toEqual(false);
            }, 14);
            test.it('_.isObject', function () {
                test.expect(_.isObject(true)).toEqual(false);
                test.expect(_.isObject(false)).toEqual(false);
                test.expect(_.isObject(1)).toEqual(false);
                test.expect(_.isObject(0)).toEqual(false);
                test.expect(_.isObject(Infinity)).toEqual(false);
                test.expect(_.isObject(NaN)).toEqual(false);
                test.expect(_.isObject(null)).toEqual(false);
                test.expect(_.isObject(undefined)).toEqual(false);
                test.expect(_.isObject('')).toEqual(false);
                test.expect(_.isObject(baseString)).toEqual(false);
                test.expect(_.isObject([])).toEqual(true);
                test.expect(_.isObject({})).toEqual(true);
                test.expect(_.isObject(window)).toEqual(true);
                test.expect(_.isObject(function () {})).toEqual(false);
            }, 14);
            test.it('_.isArray', function () {
                test.expect(_.isArray(true)).toEqual(false);
                test.expect(_.isArray(false)).toEqual(false);
                test.expect(_.isArray(1)).toEqual(false);
                test.expect(_.isArray(0)).toEqual(false);
                test.expect(_.isArray(Infinity)).toEqual(false);
                test.expect(_.isArray(NaN)).toEqual(false);
                test.expect(_.isArray(null)).toEqual(false);
                test.expect(_.isArray(undefined)).toEqual(false);
                test.expect(_.isArray('')).toEqual(false);
                test.expect(_.isArray(baseString)).toEqual(false);
                test.expect(_.isArray([])).toEqual(true);
                test.expect(_.isArray({})).toEqual(false);
                test.expect(_.isArray(window)).toEqual(false);
                test.expect(_.isArray(function () {})).toEqual(false);
            }, 14);
            test.it('_.isEmpty', function () {
                test.expect(_.isEmpty(true)).toEqual(true);
                test.expect(_.isEmpty(false)).toEqual(true);
                test.expect(_.isEmpty(1)).toEqual(true);
                test.expect(_.isEmpty(0)).toEqual(true);
                test.expect(_.isEmpty(Infinity)).toEqual(true);
                test.expect(_.isEmpty(NaN)).toEqual(true);
                test.expect(_.isEmpty(null)).toEqual(true);
                test.expect(_.isEmpty(undefined)).toEqual(true);
                test.expect(_.isEmpty('')).toEqual(true);
                test.expect(_.isEmpty(baseString)).toEqual(true);
                test.expect(_.isEmpty([])).toEqual(true);
                test.expect(_.isEmpty({})).toEqual(true);
                test.expect(_.isEmpty(window)).toEqual(false);
                test.expect(_.isEmpty(function () {})).toEqual(true);
                test.expect(_.isEmpty([1])).toEqual(false);
                test.expect(_.isEmpty({
                    one: 1
                })).toEqual(false);
            }, 16);
            test.it('_.isInstance', function () {
                var obj = {},
                    newModel = factories.Model();
                test.expect(_.isInstance(obj, Object)).toEqual(true);
                test.expect(_.isInstance(newModel, factories.Model)).toEqual(true);
                test.expect(_.isInstance(newModel, factories.Model)).toEqual(true);
                test.expect(_.isInstance(newModel, factories.Collection)).toEqual(false);
            }, 4);
            test.it('_.negate', function () {
                var falsey = _.negate(function () {
                        return false;
                    }),
                    truthy = _.negate(function () {
                        return true;
                    });
                test.expect(truthy()).toEqual(false);
                test.expect(falsey()).toEqual(true);
            }, 2);
            test.it('_.invert', function () {
                test.expect(_.invert({
                    one: 1,
                    two: 2
                })).toEqual({
                    '1': 'one',
                    '2': 'two'
                });
            }, 1);
            test.it('_.stringify', function () {
                test.expect(_.stringify({})).toEqual(JSON.stringify({}));
                test.expect(_.stringify({})).not.toEqual({}.toString());
                test.expect(_.stringify(function () {})).toEqual(function () {}.toString());
            }, 3);
            test.it('_.extend', function () {
                test.expect(_.extend([{
                    four: 1,
                    three: 3
                }, {
                    two: 3,
                    three: 2
                }, {
                    one: 4
                }])).toEqual({
                    four: 1,
                    two: 3,
                    three: 2,
                    one: 4
                });
                test.expect(_.extend([{
                    some: {}
                }, {
                    some: {
                        where: 'across the sea'
                    }
                }, {
                    some: {}
                }, {
                    some: {
                        one: 'is waiting for me'
                    }
                }], !0)).toEqual({
                    some: {
                        where: 'across the sea',
                        one: 'is waiting for me'
                    }
                });
                test.expect(_.extend([{
                    some: {}
                }, {
                    some: {
                        where: 'across the sea'
                    }
                }, {
                    some: {}
                }, {
                    some: {
                        one: 'is waiting for me'
                    }
                }])).toEqual({
                    some: {
                        one: 'is waiting for me'
                    }
                });
            }, 3);
            test.it('_.merge', function () {
                // modifies the original object
                test.expect(_.merge({
                    one: {
                        two: {
                            three: 4
                        }
                    }
                }, {
                    one: {},
                    two: 2
                })).toEqual({
                    one: {},
                    two: 2
                });
            }, 1);
            test.it('_.isArrayLike', function () {
                test.expect(_.isArrayLike('')).toEqual(false);
                test.expect(_.isArrayLike([])).toEqual(true);
                test.expect(_.isArrayLike({
                    '0': 0,
                    '1': 1,
                    length: 2,
                    splice: function () {}
                })).toEqual(true);
            }, 3);
            test.it('_.forOwn', function () {
                var args = [],
                    obj = {
                        one: 1,
                        two: 2,
                        three: 3
                    };
                _.forOwn(obj, function (item, idx, iteratingObj) {
                    args.push([item, idx, iteratingObj]);
                });
                test.expect(args).toEqual([
                    [1, 'one', obj],
                    [2, 'two', obj],
                    [3, 'three', obj]
                ]);
                args = [];
                obj = ['one', 'two', 'three'];
                _.forOwn(obj, function (val, idx, o) {
                    args.push([val, idx, o]);
                });
                test.expect(args).toEqual([
                    ['one', 0, obj],
                    ['two', 1, obj],
                    ['three', 2, obj]
                ]);
            }, 2);
            test.it('_.forEach', function () {
                var test1 = [1, 2, 3, 4];
                var count = 0;
                test.expect(count).toEqual(0);
                _.forEach(test1, function (item) {
                    count += item;
                });
                test.expect(count).toEqual(10);
                _.forEach({
                    one: 1,
                    two: 2,
                    three: 3,
                    four: 4
                }, function (item) {
                    count += item;
                });
                test.expect(count).toEqual(10);
            }, 3);
            test.it('_.toBoolean', function () {
                test.expect(_.toBoolean('truth')).toEqual('truth');
                test.expect(_.toBoolean('true')).toEqual(true);
                test.expect(_.toBoolean('falsey')).toEqual('falsey');
                test.expect(_.toBoolean('false')).toEqual(false);
                test.expect(_.toBoolean({})).toEqual({});
            }, 5);
            test.it('_.once', function () {
                var count = 0,
                    counted = 0,
                    counter = _.once(function () {
                        counted++;
                    });
                while (count < 10) {
                    counter();
                    count++;
                }
                test.expect(counted).toEqual(1);
            }, 1);
            test.it('_.isEqual', function () {
                test.expect(_.isEqual({
                    one: {
                        one: [1, 2, 4, 5]
                    }
                }, {
                    one: {
                        one: [1, 2, 4, 5]
                    }
                })).toEqual(true);
            }, 1);
            test.it('_.clone', function () {
                var original = {
                        some: 'thing',
                        out: 'there',
                        fun: function () {}
                    },
                    cloned = _.clone(original);
                test.expect(cloned).toEqual(original);
            }, 1);
            // write more differentiating code for this test
            test.it('_.cloneJSON', function () {
                var original = {
                        some: 'thing',
                        out: 'there',
                        fun: function () {}
                    },
                    cloned = _.cloneJSON(original);
                test.expect(cloned).not.toEqual(original);
            }, 1);
            test.it('_.wrap', function () {
                test.expect(_.wrap(['some', 'where'], function (val) {
                    return !val.indexOf('s');
                })).toEqual({
                    some: true,
                    where: false
                });
                test.expect(_.wrap({
                    click: '0event',
                    hover: '1event'
                }, function (val, eventName) {
                    return !val.indexOf('0');
                })).toEqual({
                    click: true,
                    hover: false
                });
            }, 2);
            // test.it('_.unshift', function () {
            //     var make = function () {
            //         return [1, 2, 3, 4, 5, 6];
            //     };
            //     test.expect(_.unshift(make(), [0])).toEqual(make().unshift(0));
            // });
            // write async test
            test.it('_.fetch', function (done) {
                _.fetch("data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA").then(function (e) {
                    test.expect(typeof e === 'object').toBe(true);
                    done();
                });
            }, 1);
            test.it('_.parse', function () {
                test.expect(_.parse('{"some":1,"one":true}')).toEqual({
                    some: 1,
                    one: true
                });
                test.expect(_.parse({
                    some: 1,
                    one: true
                })).toEqual({
                    some: 1,
                    one: true
                });
            }, 2);
            test.it('_.units', function () {
                test.expect(_.units('')).toEqual(false);
                test.expect(_.units(500)).toEqual(false);
                test.expect(_.units('500')).toEqual(false);
                test.expect(_.units('500px')).toEqual('px');
                test.expect(_.units('500rem')).toEqual('rem');
                test.expect(_.units('500em')).toEqual('em');
                test.expect(_.units('500%')).toEqual('%');
                test.expect(_.units('500ex')).toEqual('ex');
                test.expect(_.units('500in')).toEqual('in');
                test.expect(_.units('500cm')).toEqual('cm');
                test.expect(_.units('500vh')).toEqual('vh');
                test.expect(_.units('500vw')).toEqual('vw');
                test.expect(_.units('500pc')).toEqual('pc');
                test.expect(_.units('500pt')).toEqual('pt');
                test.expect(_.units('500mm')).toEqual('mm');
            }, 15);
            test.it('_.stringifyQuery', function () {
                test.expect(_.stringifyQuery({
                    url: '//google.com',
                    query: {
                        some: 'where',
                        und: 'efined',
                        // undefined as a string
                        blank: 'undefined',
                        // undefined as the value
                        thisIs: void 0,
                        under: 'statement',
                        one: 1,
                        has: false,
                        nully: null,
                        even: {
                            moar: 'things'
                        }
                    }
                })).toEqual('//google.com?some=where&und=efined&blank=undefined&under=statement&one=1&has=false&nully=null&even=%7B%22moar%22%3A%22things%22%7D');
            }, 1);
            test.it('_.protoProp', function () {
                var box = factories.Model();
                box.idAttribute = _.returns('something');
                test.expect(_.protoProp(box, 'idAttribute')).toEqual(factories.Model.constructor.prototype.idAttribute);
            }, 1);
            test.it('_.roundFloat', function () {
                test.expect(_.roundFloat(1.5489909, 3)).toEqual(1.548);
            }, 1);
        });
    });
});