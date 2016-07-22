application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('var _ = app._;', function () {
        var baseString = 'my string is a great string',
            specialString = 'here&are*a ()lot o~/f special_+characters',
            makeArray = function () {
                return baseString.split(' ');
            };
        _.test.describe('base array methods', function () {
            _.test.it('_.indexOf', function () {
                _.test.expect(_.indexOf(makeArray(), 'is')).toEqual(makeArray().indexOf('is'));
            });
            _.test.it('_.sort', function () {
                _.test.expect(_.sort(makeArray())).toEqual(makeArray().sort());
            });
        });
        _.test.describe('base object methods', function () {
            _.test.it('_.has', function () {
                var baseObj = {
                    one: null
                };
                _.test.expect(_.has(baseObj, 'one')).toEqual(baseObj.hasOwnProperty('one'));
            });
            _.test.it('_.isFunction', function () {
                _.test.expect(_.isFunction(true)).toEqual(false);
                _.test.expect(_.isFunction(false)).toEqual(false);
                _.test.expect(_.isFunction(1)).toEqual(false);
                _.test.expect(_.isFunction(0)).toEqual(false);
                _.test.expect(_.isFunction(Infinity)).toEqual(false);
                _.test.expect(_.isFunction(NaN)).toEqual(false);
                _.test.expect(_.isFunction(null)).toEqual(false);
                _.test.expect(_.isFunction(undefined)).toEqual(false);
                _.test.expect(_.isFunction('')).toEqual(false);
                _.test.expect(_.isFunction(baseString)).toEqual(false);
                _.test.expect(_.isFunction([])).toEqual(false);
                _.test.expect(_.isFunction({})).toEqual(false);
                _.test.expect(_.isFunction(window)).toEqual(false);
                _.test.expect(_.isFunction(function () {})).toEqual(true);
            });
            _.test.it('_.isBoolean', function () {
                _.test.expect(_.isBoolean(true)).toEqual(true);
                _.test.expect(_.isBoolean(false)).toEqual(true);
                _.test.expect(_.isBoolean(1)).toEqual(false);
                _.test.expect(_.isBoolean(0)).toEqual(false);
                _.test.expect(_.isBoolean(Infinity)).toEqual(false);
                _.test.expect(_.isBoolean(NaN)).toEqual(false);
                _.test.expect(_.isBoolean(null)).toEqual(false);
                _.test.expect(_.isBoolean(undefined)).toEqual(false);
                _.test.expect(_.isBoolean('')).toEqual(false);
                _.test.expect(_.isBoolean(baseString)).toEqual(false);
                _.test.expect(_.isBoolean([])).toEqual(false);
                _.test.expect(_.isBoolean({})).toEqual(false);
                _.test.expect(_.isBoolean(window)).toEqual(false);
                _.test.expect(_.isBoolean(function () {})).toEqual(false);
            });
            _.test.it('_.isString', function () {
                _.test.expect(_.isString(true)).toEqual(false);
                _.test.expect(_.isString(false)).toEqual(false);
                _.test.expect(_.isString(1)).toEqual(false);
                _.test.expect(_.isString(0)).toEqual(false);
                _.test.expect(_.isString(Infinity)).toEqual(false);
                _.test.expect(_.isString(NaN)).toEqual(false);
                _.test.expect(_.isString(null)).toEqual(false);
                _.test.expect(_.isString(undefined)).toEqual(false);
                _.test.expect(_.isString('')).toEqual(true);
                _.test.expect(_.isString(baseString)).toEqual(true);
                _.test.expect(_.isString([])).toEqual(false);
                _.test.expect(_.isString({})).toEqual(false);
                _.test.expect(_.isString(window)).toEqual(false);
                _.test.expect(_.isString(function () {})).toEqual(false);
            });
            _.test.it('_.isNumber', function () {
                _.test.expect(_.isNumber(true)).toEqual(false);
                _.test.expect(_.isNumber(false)).toEqual(false);
                _.test.expect(_.isNumber(1)).toEqual(true);
                _.test.expect(_.isNumber(0)).toEqual(true);
                _.test.expect(_.isNumber(Infinity)).toEqual(true);
                _.test.expect(_.isNumber(NaN)).toEqual(false);
                _.test.expect(_.isNumber(null)).toEqual(false);
                _.test.expect(_.isNumber(undefined)).toEqual(false);
                _.test.expect(_.isNumber('')).toEqual(false);
                _.test.expect(_.isNumber(baseString)).toEqual(false);
                _.test.expect(_.isNumber([])).toEqual(false);
                _.test.expect(_.isNumber({})).toEqual(false);
                _.test.expect(_.isNumber(window)).toEqual(false);
                _.test.expect(_.isNumber(function () {})).toEqual(false);
            });
            _.test.it('_.isObject', function () {
                _.test.expect(_.isObject(true)).toEqual(false);
                _.test.expect(_.isObject(false)).toEqual(false);
                _.test.expect(_.isObject(1)).toEqual(false);
                _.test.expect(_.isObject(0)).toEqual(false);
                _.test.expect(_.isObject(Infinity)).toEqual(false);
                _.test.expect(_.isObject(NaN)).toEqual(false);
                _.test.expect(_.isObject(null)).toEqual(false);
                _.test.expect(_.isObject(undefined)).toEqual(false);
                _.test.expect(_.isObject('')).toEqual(false);
                _.test.expect(_.isObject(baseString)).toEqual(false);
                _.test.expect(_.isObject([])).toEqual(true);
                _.test.expect(_.isObject({})).toEqual(true);
                _.test.expect(_.isObject(window)).toEqual(true);
                _.test.expect(_.isObject(function () {})).toEqual(false);
            });
            _.test.it('_.isArray', function () {
                _.test.expect(_.isArray(true)).toEqual(false);
                _.test.expect(_.isArray(false)).toEqual(false);
                _.test.expect(_.isArray(1)).toEqual(false);
                _.test.expect(_.isArray(0)).toEqual(false);
                _.test.expect(_.isArray(Infinity)).toEqual(false);
                _.test.expect(_.isArray(NaN)).toEqual(false);
                _.test.expect(_.isArray(null)).toEqual(false);
                _.test.expect(_.isArray(undefined)).toEqual(false);
                _.test.expect(_.isArray('')).toEqual(false);
                _.test.expect(_.isArray(baseString)).toEqual(false);
                _.test.expect(_.isArray([])).toEqual(true);
                _.test.expect(_.isArray({})).toEqual(false);
                _.test.expect(_.isArray(window)).toEqual(false);
                _.test.expect(_.isArray(function () {})).toEqual(false);
            });
            _.test.it('_.isEmpty', function () {
                _.test.expect(_.isEmpty(true)).toEqual(true);
                _.test.expect(_.isEmpty(false)).toEqual(true);
                _.test.expect(_.isEmpty(1)).toEqual(true);
                _.test.expect(_.isEmpty(0)).toEqual(true);
                _.test.expect(_.isEmpty(Infinity)).toEqual(true);
                _.test.expect(_.isEmpty(NaN)).toEqual(true);
                _.test.expect(_.isEmpty(null)).toEqual(true);
                _.test.expect(_.isEmpty(undefined)).toEqual(true);
                _.test.expect(_.isEmpty('')).toEqual(true);
                _.test.expect(_.isEmpty(baseString)).toEqual(true);
                _.test.expect(_.isEmpty([])).toEqual(true);
                _.test.expect(_.isEmpty({})).toEqual(true);
                _.test.expect(_.isEmpty(window)).toEqual(false);
                _.test.expect(_.isEmpty(function () {})).toEqual(true);
                _.test.expect(_.isEmpty([1])).toEqual(false);
                _.test.expect(_.isEmpty({
                    one: 1
                })).toEqual(false);
            });
            _.test.it('_.isInstance', function () {
                var obj = {},
                    newModel = factories.Model();
                _.test.expect(_.isInstance(obj, Object)).toEqual(true);
                _.test.expect(_.isInstance(newModel, factories.Model)).toEqual(true);
                _.test.expect(_.isInstance(newModel, factories.Model)).toEqual(true);
                _.test.expect(_.isInstance(newModel, factories.Collection)).toEqual(false);
            });
            _.test.it('_.negate', function () {
                var falsey = _.negate(function () {
                        return false;
                    }),
                    truthy = _.negate(function () {
                        return true;
                    });
                _.test.expect(truthy()).toEqual(false);
                _.test.expect(falsey()).toEqual(true);
            });
            _.test.it('_.invert', function () {
                _.test.expect(_.invert({
                    one: 1,
                    two: 2
                })).toEqual({
                    '1': 'one',
                    '2': 'two'
                });
            });
            _.test.it('_.stringify', function () {
                _.test.expect(_.stringify({})).toEqual(JSON.stringify({}));
                _.test.expect(_.stringify({})).not.toEqual({}.toString());
                _.test.expect(_.stringify(function () {})).toEqual(function () {}.toString());
            });
            _.test.it('_.extend', function () {
                _.test.expect(_.extend({
                    four: 1,
                    three: 3
                }, {
                    two: 3,
                    three: 2
                }, {
                    one: 4
                })).toEqual({
                    four: 1,
                    two: 3,
                    three: 2,
                    one: 4
                });
                _.test.expect(_.extend(!0, {
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
                })).toEqual({
                    some: {
                        where: 'across the sea',
                        one: 'is waiting for me'
                    }
                });
                _.test.expect(_.extend({
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
                })).toEqual({
                    some: {
                        one: 'is waiting for me'
                    }
                });
            });
            _.test.it('_.merge', function () {
                // modifies the original object
                _.test.expect(_.merge({
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
            });
            _.test.it('_.isArrayLike', function () {
                _.test.expect(_.isArrayLike('')).toEqual(false);
                _.test.expect(_.isArrayLike([])).toEqual(true);
                _.test.expect(_.isArrayLike({
                    '0': 0,
                    '1': 1,
                    length: 2,
                    splice: function () {}
                })).toEqual(true);
            });
            _.test.it('_.each', function () {
                var args = [],
                    obj = {
                        one: 1,
                        two: 2,
                        three: 3
                    };
                _.each(obj, function (item, idx, iteratingObj) {
                    args.push([item, idx, iteratingObj]);
                });
                _.test.expect(args).toEqual([
                    [1, 'one', obj],
                    [2, 'two', obj],
                    [3, 'three', obj]
                ]);
                args = [];
                obj = ['one', 'two', 'three'];
                _.each(obj, function (val, idx, o) {
                    args.push([val, idx, o]);
                });
                _.test.expect(args).toEqual([
                    ['one', 0, obj],
                    ['two', 1, obj],
                    ['three', 2, obj]
                ]);
            });
            _.test.it('_.duff', function () {
                var test1 = [1, 2, 3, 4];
                var count = 0;
                _.test.expect(count).toEqual(0);
                _.duff(test1, function (item) {
                    count += item;
                });
                _.test.expect(count).toEqual(10);
                _.duff({
                    one: 1,
                    two: 2,
                    three: 3,
                    four: 4
                }, function (item) {
                    count += item;
                });
                _.test.expect(count).toEqual(10);
            });
            _.test.it('_.toBoolean', function () {
                _.test.expect(_.toBoolean('truth')).toEqual('truth');
                _.test.expect(_.toBoolean('true')).toEqual(true);
                _.test.expect(_.toBoolean('falsey')).toEqual('falsey');
                _.test.expect(_.toBoolean('false')).toEqual(false);
                _.test.expect(_.toBoolean({})).toEqual({});
            });
            _.test.it('_.once', function () {
                var count = 0,
                    counted = 0,
                    counter = _.once(function () {
                        counted++;
                    });
                while (count < 10) {
                    counter();
                    count++;
                }
                _.test.expect(counted).toEqual(1);
            });
            _.test.it('_.isEqual', function () {
                _.test.expect(_.isEqual({
                    one: {
                        one: [1, 2, 4, 5]
                    }
                }, {
                    one: {
                        one: [1, 2, 4, 5]
                    }
                })).toEqual(true);
            });
            _.test.it('_.clone', function () {
                var original = {
                        some: 'thing',
                        out: 'there',
                        fun: function () {}
                    },
                    cloned = _.clone(original);
                _.test.expect(cloned).toEqual(original);
            });
            // write more differentiating code for this test
            _.test.it('_.cloneJSON', function () {
                var original = {
                        some: 'thing',
                        out: 'there',
                        fun: function () {}
                    },
                    cloned = _.cloneJSON(original);
                _.test.expect(cloned).not.toEqual(original);
            });
            _.test.it('_.wrap', function () {
                _.test.expect(_.wrap(['some', 'where'], function (val) {
                    return !val.indexOf('s');
                })).toEqual({
                    some: true,
                    where: false
                });
                _.test.expect(_.wrap({
                    click: '0event',
                    hover: '1event'
                }, function (val, eventName) {
                    return !val.indexOf('0');
                })).toEqual({
                    click: true,
                    hover: false
                });
            });
            // _.test.it('_.unshift', function () {
            //     var make = function () {
            //         return [1, 2, 3, 4, 5, 6];
            //     };
            //     _.test.expect(_.unshift(make(), [0])).toEqual(make().unshift(0));
            // });
            // write async test
            _.test.it('_.fetch', function () {
                var img = _.fetch("data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA");
                _.test.expect(img instanceof Image).toEqual(true);
            });
            _.test.it('_.parse', function () {
                _.test.expect(_.parse('{"some":1,"one":true}')).toEqual({
                    some: 1,
                    one: true
                });
                _.test.expect(_.parse({
                    some: 1,
                    one: true
                })).toEqual({
                    some: 1,
                    one: true
                });
            });
            _.test.it('_.units', function () {
                _.test.expect(_.units('')).toEqual(false);
                _.test.expect(_.units(500)).toEqual(false);
                _.test.expect(_.units('500')).toEqual(false);
                _.test.expect(_.units('500px')).toEqual('px');
                _.test.expect(_.units('500rem')).toEqual('rem');
                _.test.expect(_.units('500em')).toEqual('em');
                _.test.expect(_.units('500%')).toEqual('%');
                _.test.expect(_.units('500ex')).toEqual('ex');
                _.test.expect(_.units('500in')).toEqual('in');
                _.test.expect(_.units('500cm')).toEqual('cm');
                _.test.expect(_.units('500vh')).toEqual('vh');
                _.test.expect(_.units('500vw')).toEqual('vw');
                _.test.expect(_.units('500pc')).toEqual('pc');
                _.test.expect(_.units('500pt')).toEqual('pt');
                _.test.expect(_.units('500mm')).toEqual('mm');
            });
            _.test.it('_.stringifyQuery', function () {
                _.test.expect(_.stringifyQuery({
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
            });
            _.test.it('_.protoProp', function () {
                var box = factories.Model();
                box.idAttribute = _.returns('something');
                _.test.expect(_.protoProp(box, 'idAttribute')).toEqual(factories.Model.constructor.prototype.idAttribute);
            });
            _.test.it('_.roundFloat', function () {
                _.test.expect(_.roundFloat(1.5489909, 3)).toEqual(1.548);
            });
        });
    });
});