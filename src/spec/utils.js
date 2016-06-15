application.scope().run(function (app, _) {
    var factories = _.factories;
    _.describe('var _ = app._;', function () {
        var baseString = 'my string is a great string',
            specialString = 'here&are*a ()lot o~/f special_+characters',
            makeArray = function () {
                return baseString.split(' ');
            };
        _.describe('base array methods', function () {
            _.it('_.indexOf', function () {
                _.expect(_.indexOf(makeArray(), 'is')).toEqual(makeArray().indexOf('is'));
            });
            _.it('_.sort', function () {
                _.expect(_.sort(makeArray())).toEqual(makeArray().sort());
            });
        });
        _.describe('base object methods', function () {
            _.it('_.has', function () {
                var baseObj = {
                    one: null
                };
                _.expect(_.has(baseObj, 'one')).toEqual(baseObj.hasOwnProperty('one'));
            });
            _.it('_.isFunction', function () {
                _.expect(_.isFunction(true)).toEqual(false);
                _.expect(_.isFunction(false)).toEqual(false);
                _.expect(_.isFunction(1)).toEqual(false);
                _.expect(_.isFunction(0)).toEqual(false);
                _.expect(_.isFunction(Infinity)).toEqual(false);
                _.expect(_.isFunction(NaN)).toEqual(false);
                _.expect(_.isFunction(null)).toEqual(false);
                _.expect(_.isFunction(undefined)).toEqual(false);
                _.expect(_.isFunction('')).toEqual(false);
                _.expect(_.isFunction(baseString)).toEqual(false);
                _.expect(_.isFunction([])).toEqual(false);
                _.expect(_.isFunction({})).toEqual(false);
                _.expect(_.isFunction(window)).toEqual(false);
                _.expect(_.isFunction(function () {})).toEqual(true);
            });
            _.it('_.isBoolean', function () {
                _.expect(_.isBoolean(true)).toEqual(true);
                _.expect(_.isBoolean(false)).toEqual(true);
                _.expect(_.isBoolean(1)).toEqual(false);
                _.expect(_.isBoolean(0)).toEqual(false);
                _.expect(_.isBoolean(Infinity)).toEqual(false);
                _.expect(_.isBoolean(NaN)).toEqual(false);
                _.expect(_.isBoolean(null)).toEqual(false);
                _.expect(_.isBoolean(undefined)).toEqual(false);
                _.expect(_.isBoolean('')).toEqual(false);
                _.expect(_.isBoolean(baseString)).toEqual(false);
                _.expect(_.isBoolean([])).toEqual(false);
                _.expect(_.isBoolean({})).toEqual(false);
                _.expect(_.isBoolean(window)).toEqual(false);
                _.expect(_.isBoolean(function () {})).toEqual(false);
            });
            _.it('_.isString', function () {
                _.expect(_.isString(true)).toEqual(false);
                _.expect(_.isString(false)).toEqual(false);
                _.expect(_.isString(1)).toEqual(false);
                _.expect(_.isString(0)).toEqual(false);
                _.expect(_.isString(Infinity)).toEqual(false);
                _.expect(_.isString(NaN)).toEqual(false);
                _.expect(_.isString(null)).toEqual(false);
                _.expect(_.isString(undefined)).toEqual(false);
                _.expect(_.isString('')).toEqual(true);
                _.expect(_.isString(baseString)).toEqual(true);
                _.expect(_.isString([])).toEqual(false);
                _.expect(_.isString({})).toEqual(false);
                _.expect(_.isString(window)).toEqual(false);
                _.expect(_.isString(function () {})).toEqual(false);
            });
            _.it('_.isNumber', function () {
                _.expect(_.isNumber(true)).toEqual(false);
                _.expect(_.isNumber(false)).toEqual(false);
                _.expect(_.isNumber(1)).toEqual(true);
                _.expect(_.isNumber(0)).toEqual(true);
                _.expect(_.isNumber(Infinity)).toEqual(true);
                _.expect(_.isNumber(NaN)).toEqual(false);
                _.expect(_.isNumber(null)).toEqual(false);
                _.expect(_.isNumber(undefined)).toEqual(false);
                _.expect(_.isNumber('')).toEqual(false);
                _.expect(_.isNumber(baseString)).toEqual(false);
                _.expect(_.isNumber([])).toEqual(false);
                _.expect(_.isNumber({})).toEqual(false);
                _.expect(_.isNumber(window)).toEqual(false);
                _.expect(_.isNumber(function () {})).toEqual(false);
            });
            _.it('_.isObject', function () {
                _.expect(_.isObject(true)).toEqual(false);
                _.expect(_.isObject(false)).toEqual(false);
                _.expect(_.isObject(1)).toEqual(false);
                _.expect(_.isObject(0)).toEqual(false);
                _.expect(_.isObject(Infinity)).toEqual(false);
                _.expect(_.isObject(NaN)).toEqual(false);
                _.expect(_.isObject(null)).toEqual(false);
                _.expect(_.isObject(undefined)).toEqual(false);
                _.expect(_.isObject('')).toEqual(false);
                _.expect(_.isObject(baseString)).toEqual(false);
                _.expect(_.isObject([])).toEqual(true);
                _.expect(_.isObject({})).toEqual(true);
                _.expect(_.isObject(window)).toEqual(true);
                _.expect(_.isObject(function () {})).toEqual(false);
            });
            _.it('_.isArray', function () {
                _.expect(_.isArray(true)).toEqual(false);
                _.expect(_.isArray(false)).toEqual(false);
                _.expect(_.isArray(1)).toEqual(false);
                _.expect(_.isArray(0)).toEqual(false);
                _.expect(_.isArray(Infinity)).toEqual(false);
                _.expect(_.isArray(NaN)).toEqual(false);
                _.expect(_.isArray(null)).toEqual(false);
                _.expect(_.isArray(undefined)).toEqual(false);
                _.expect(_.isArray('')).toEqual(false);
                _.expect(_.isArray(baseString)).toEqual(false);
                _.expect(_.isArray([])).toEqual(true);
                _.expect(_.isArray({})).toEqual(false);
                _.expect(_.isArray(window)).toEqual(false);
                _.expect(_.isArray(function () {})).toEqual(false);
            });
            _.it('_.isEmpty', function () {
                _.expect(_.isEmpty(true)).toEqual(true);
                _.expect(_.isEmpty(false)).toEqual(true);
                _.expect(_.isEmpty(1)).toEqual(true);
                _.expect(_.isEmpty(0)).toEqual(true);
                _.expect(_.isEmpty(Infinity)).toEqual(true);
                _.expect(_.isEmpty(NaN)).toEqual(true);
                _.expect(_.isEmpty(null)).toEqual(true);
                _.expect(_.isEmpty(undefined)).toEqual(true);
                _.expect(_.isEmpty('')).toEqual(true);
                _.expect(_.isEmpty(baseString)).toEqual(true);
                _.expect(_.isEmpty([])).toEqual(true);
                _.expect(_.isEmpty({})).toEqual(true);
                _.expect(_.isEmpty(window)).toEqual(false);
                _.expect(_.isEmpty(function () {})).toEqual(true);
                _.expect(_.isEmpty([1])).toEqual(false);
                _.expect(_.isEmpty({
                    one: 1
                })).toEqual(false);
            });
            _.it('_.isInstance', function () {
                var obj = {},
                    newModel = factories.Model();
                _.expect(_.isInstance(obj, Object)).toEqual(true);
                _.expect(_.isInstance(newModel, factories.Model)).toEqual(true);
                _.expect(_.isInstance(newModel, factories.Model)).toEqual(true);
                _.expect(_.isInstance(newModel, factories.Collection)).toEqual(false);
            });
            _.it('_.negate', function () {
                var falsey = _.negate(function () {
                        return false;
                    }),
                    truthy = _.negate(function () {
                        return true;
                    });
                _.expect(truthy()).toEqual(false);
                _.expect(falsey()).toEqual(true);
            });
            _.it('_.invert', function () {
                _.expect(_.invert({
                    one: 1,
                    two: 2
                })).toEqual({
                    '1': 'one',
                    '2': 'two'
                });
            });
            _.it('_.stringify', function () {
                _.expect(_.stringify({})).toEqual(JSON.stringify({}));
                _.expect(_.stringify({})).not.toEqual({}.toString());
                _.expect(_.stringify(function () {})).toEqual(function () {}.toString());
            });
            _.it('_.extend', function () {
                _.expect(_.extend({
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
                _.expect(_.extend(!0, {
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
                _.expect(_.extend({
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
            _.it('_.merge', function () {
                // modifies the original object
                _.expect(_.merge({
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
            _.it('_.isArrayLike', function () {
                _.expect(_.isArrayLike('')).toEqual(false);
                _.expect(_.isArrayLike([])).toEqual(true);
                _.expect(_.isArrayLike({
                    '0': 0,
                    '1': 1,
                    length: 2,
                    splice: function () {}
                })).toEqual(true);
            });
            _.it('_.each', function () {
                var args = [],
                    obj = {
                        one: 1,
                        two: 2,
                        three: 3
                    };
                _.each(obj, function (item, idx, iteratingObj) {
                    args.push([item, idx, iteratingObj]);
                });
                _.expect(args).toEqual([
                    [1, 'one', obj],
                    [2, 'two', obj],
                    [3, 'three', obj]
                ]);
                args = [];
                obj = ['one', 'two', 'three'];
                _.each(obj, function (val, idx, o) {
                    args.push([val, idx, o]);
                });
                _.expect(args).toEqual([
                    ['one', 0, obj],
                    ['two', 1, obj],
                    ['three', 2, obj]
                ]);
            });
            _.it('_.duff', function () {
                var test1 = [1, 2, 3, 4];
                var count = 0;
                _.expect(count).toEqual(0);
                _.duff(test1, function (item) {
                    count += item;
                });
                _.expect(count).toEqual(10);
                _.duff({
                    one: 1,
                    two: 2,
                    three: 3,
                    four: 4
                }, function (item) {
                    count += item;
                });
                _.expect(count).toEqual(10);
            });
            _.it('_.toBoolean', function () {
                _.expect(_.toBoolean('truth')).toEqual('truth');
                _.expect(_.toBoolean('true')).toEqual(true);
                _.expect(_.toBoolean('falsey')).toEqual('falsey');
                _.expect(_.toBoolean('false')).toEqual(false);
                _.expect(_.toBoolean({})).toEqual({});
            });
            _.it('_.once', function () {
                var count = 0,
                    counted = 0,
                    counter = _.once(function () {
                        counted++;
                    });
                while (count < 10) {
                    counter();
                    count++;
                }
                _.expect(counted).toEqual(1);
            });
            _.it('_.isEqual', function () {
                _.expect(_.isEqual({
                    one: {
                        one: [1, 2, 4, 5]
                    }
                }, {
                    one: {
                        one: [1, 2, 4, 5]
                    }
                })).toEqual(true);
            });
            _.it('_.clone', function () {
                var original = {
                        some: 'thing',
                        out: 'there'
                    },
                    cloned = _.clone(original);
                _.expect(cloned).toEqual(original);
            });
            // write more differentiating code for this test
            _.it('_.fullClone', function () {
                var original = {
                        some: 'thing',
                        out: 'there'
                    },
                    cloned = _.fullClone(original);
                _.expect(cloned).toEqual(original);
            });
            _.it('_.wrap', function () {
                _.expect(_.wrap(['some', 'where'], function (val) {
                    return !val.indexOf('s');
                })).toEqual({
                    some: true,
                    where: false
                });
                _.expect(_.wrap({
                    click: '0event',
                    hover: '1event'
                }, function (val, eventName) {
                    return !val.indexOf('0');
                })).toEqual({
                    click: true,
                    hover: false
                });
            });
            // _.it('_.unshift', function () {
            //     var make = function () {
            //         return [1, 2, 3, 4, 5, 6];
            //     };
            //     _.expect(_.unshift(make(), [0])).toEqual(make().unshift(0));
            // });
            // write async test
            _.it('_.fetch', function () {
                var img = _.fetch("data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA");
                _.expect(img instanceof Image).toEqual(true);
            });
            _.it('_.parse', function () {
                _.expect(_.parse('{"some":1,"one":true}')).toEqual({
                    some: 1,
                    one: true
                });
                _.expect(_.parse({
                    some: 1,
                    one: true
                })).toEqual({
                    some: 1,
                    one: true
                });
            });
            _.it('_.units', function () {
                _.expect(_.units('')).toEqual(false);
                _.expect(_.units(500)).toEqual(false);
                _.expect(_.units('500')).toEqual(false);
                _.expect(_.units('500px')).toEqual('px');
                _.expect(_.units('500rem')).toEqual('rem');
                _.expect(_.units('500em')).toEqual('em');
                _.expect(_.units('500%')).toEqual('%');
                _.expect(_.units('500ex')).toEqual('ex');
                _.expect(_.units('500in')).toEqual('in');
                _.expect(_.units('500cm')).toEqual('cm');
                _.expect(_.units('500vh')).toEqual('vh');
                _.expect(_.units('500vw')).toEqual('vw');
                _.expect(_.units('500pc')).toEqual('pc');
                _.expect(_.units('500pt')).toEqual('pt');
                _.expect(_.units('500mm')).toEqual('mm');
            });
            _.it('_.stringifyQuery', function () {
                _.expect(_.stringifyQuery({
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
            _.it('_.protoProp', function () {
                var box = factories.Model();
                box.idAttribute = _.returns('something');
                _.expect(_.protoProp(box, 'idAttribute')).toEqual(factories.Model.constructor.prototype.idAttribute);
            });
            _.it('_.roundFloat', function () {
                _.expect(_.roundFloat(1.5489909, 3)).toEqual(1.548);
            });
        });
    });
});