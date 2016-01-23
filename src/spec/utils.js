application.scope().run(function (app, _, $) {
    var factories = _.factories;
    describe('var _ = app._;', function () {
        var baseString = 'my string is a great string',
            specialString = 'here&are*a ()lot o~/f special_+characters',
            makeArray = function () {
                return baseString.split(' ');
            };
        // describe('base string methods', function () {
        //     it('_.split', function () {
        //         var myString = 'my string is a great string';
        //         expect(_.split(myString, ' ')).toEqual(myString.split(' '));
        //     });
        //     // test slice
        //     it('_.slice', function () {
        //         var actual = [1, 2, 3, 4, 5].join('');
        //         expect(_.slice(actual, 0)).toEqual(actual.slice(0));
        //     });
        // });
        describe('base array methods', function () {
            it('_.listSlice', function () {
                var actual = [1, 2, 3, 4, 5];
                expect(_.listSlice(actual, 0)).toEqual(actual.slice(0));
            });
            it('_.join', function () {
                var myList = baseString.split(' ');
                expect(_.join(myList, ' ')).toEqual(myList.join(' '));
            });
            it('_.pop', function () {
                expect(_.pop(baseString.split(' '))).toEqual(baseString.split(' ').pop());
            });
            it('_.push', function () {
                expect(_.push(baseString.split(' '), 'string')).toEqual(baseString.split(' ').push('string'));
            });
            // it('_.listHas', function () {
            //     var list = ['list', 2, 1, null];
            //     expect(_.listHas(list, 1)).toEqual(true);
            //     expect(_.listHas(list, 'list')).toEqual(true);
            //     expect(_.listHas(list, {})).toEqual(false);
            //     expect(_.listHas(list, void 0)).toEqual(false);
            // });
            it('_.shift', function () {
                expect(_.shift(baseString.split(' '))).toEqual(baseString.split(' ').shift());
            });
            it('_.indexOf', function () {
                expect(_.indexOf(makeArray(), 'is')).toEqual(makeArray().indexOf('is'));
            });
            it('_.splice', function () {
                var actual = [1, 2, 3, 4, 5];
                expect(_.listSlice(actual, 2)).toEqual(actual.slice(2));
            });
            it('_.sort', function () {
                expect(_.sort(makeArray())).toEqual(makeArray().sort());
            });
            it('_.reverse', function () {
                expect(_.reverse(makeArray())).toEqual(makeArray().reverse());
            });
        });
        describe('base object methods', function () {
            it('_.has', function () {
                var baseObj = {
                    one: null
                };
                expect(_.has(baseObj, 'one')).toEqual(baseObj.hasOwnProperty('one'));
            });
            it('_.splitGen', function () {
                var ampSplit = _.splitGen('&'),
                    qSplit = _.splitGen('?');
                expect(ampSplit(baseString)).toEqual(baseString.split('&'));
                expect(ampSplit(specialString)).toEqual(specialString.split('&'));
                expect(qSplit(baseString)).toEqual(baseString.split('?'));
                expect(qSplit(specialString)).toEqual(specialString.split('?'));
            });
            it('_.joinGen', function () {
                var ampJoin = _.joinGen('&'),
                    qJoin = _.joinGen('?'),
                    baseArray = baseString.split(' '),
                    specialArray = baseString.split(' ');
                expect(ampJoin(baseArray)).toEqual(baseArray.join('&'));
                expect(ampJoin(specialArray)).toEqual(specialArray.join('&'));
                expect(qJoin(baseArray)).toEqual(baseArray.join('?'));
                expect(qJoin(specialArray)).toEqual(specialArray.join('?'));
            });
            it('_.gapJoin', function () {
                var baseArray = baseString.split(' '),
                    specialArray = baseString.split(' ');
                expect(_.gapJoin(baseArray)).toEqual(baseArray.join(' '));
                expect(_.gapJoin(specialArray)).toEqual(specialArray.join(' '));
            });
            it('_.gapSplit', function () {
                expect(_.gapSplit(baseString)).toEqual(baseString.split(' '));
                expect(_.gapSplit(specialString)).toEqual(specialString.split(' '));
            });
            it('_.isFunction', function () {
                expect(_.isFunction(true)).toEqual(false);
                expect(_.isFunction(false)).toEqual(false);
                expect(_.isFunction(1)).toEqual(false);
                expect(_.isFunction(0)).toEqual(false);
                expect(_.isFunction(Infinity)).toEqual(false);
                expect(_.isFunction(NaN)).toEqual(false);
                expect(_.isFunction(null)).toEqual(false);
                expect(_.isFunction(undefined)).toEqual(false);
                expect(_.isFunction('')).toEqual(false);
                expect(_.isFunction(baseString)).toEqual(false);
                expect(_.isFunction([])).toEqual(false);
                expect(_.isFunction({})).toEqual(false);
                expect(_.isFunction(window)).toEqual(false);
                expect(_.isFunction(function () {})).toEqual(true);
            });
            it('_.isBoolean', function () {
                expect(_.isBoolean(true)).toEqual(true);
                expect(_.isBoolean(false)).toEqual(true);
                expect(_.isBoolean(1)).toEqual(false);
                expect(_.isBoolean(0)).toEqual(false);
                expect(_.isBoolean(Infinity)).toEqual(false);
                expect(_.isBoolean(NaN)).toEqual(false);
                expect(_.isBoolean(null)).toEqual(false);
                expect(_.isBoolean(undefined)).toEqual(false);
                expect(_.isBoolean('')).toEqual(false);
                expect(_.isBoolean(baseString)).toEqual(false);
                expect(_.isBoolean([])).toEqual(false);
                expect(_.isBoolean({})).toEqual(false);
                expect(_.isBoolean(window)).toEqual(false);
                expect(_.isBoolean(function () {})).toEqual(false);
            });
            it('_.isString', function () {
                expect(_.isString(true)).toEqual(false);
                expect(_.isString(false)).toEqual(false);
                expect(_.isString(1)).toEqual(false);
                expect(_.isString(0)).toEqual(false);
                expect(_.isString(Infinity)).toEqual(false);
                expect(_.isString(NaN)).toEqual(false);
                expect(_.isString(null)).toEqual(false);
                expect(_.isString(undefined)).toEqual(false);
                expect(_.isString('')).toEqual(true);
                expect(_.isString(baseString)).toEqual(true);
                expect(_.isString([])).toEqual(false);
                expect(_.isString({})).toEqual(false);
                expect(_.isString(window)).toEqual(false);
                expect(_.isString(function () {})).toEqual(false);
            });
            it('_.isNumber', function () {
                expect(_.isNumber(true)).toEqual(false);
                expect(_.isNumber(false)).toEqual(false);
                expect(_.isNumber(1)).toEqual(true);
                expect(_.isNumber(0)).toEqual(true);
                expect(_.isNumber(Infinity)).toEqual(true);
                expect(_.isNumber(NaN)).toEqual(false);
                expect(_.isNumber(null)).toEqual(false);
                expect(_.isNumber(undefined)).toEqual(false);
                expect(_.isNumber('')).toEqual(false);
                expect(_.isNumber(baseString)).toEqual(false);
                expect(_.isNumber([])).toEqual(false);
                expect(_.isNumber({})).toEqual(false);
                expect(_.isNumber(window)).toEqual(false);
                expect(_.isNumber(function () {})).toEqual(false);
            });
            it('_.isObject', function () {
                expect(_.isObject(true)).toEqual(false);
                expect(_.isObject(false)).toEqual(false);
                expect(_.isObject(1)).toEqual(false);
                expect(_.isObject(0)).toEqual(false);
                expect(_.isObject(Infinity)).toEqual(false);
                expect(_.isObject(NaN)).toEqual(false);
                expect(_.isObject(null)).toEqual(false);
                expect(_.isObject(undefined)).toEqual(false);
                expect(_.isObject('')).toEqual(false);
                expect(_.isObject(baseString)).toEqual(false);
                expect(_.isObject([])).toEqual(true);
                expect(_.isObject({})).toEqual(true);
                expect(_.isObject(window)).toEqual(true);
                expect(_.isObject(function () {})).toEqual(false);
            });
            it('_.isArray', function () {
                expect(_.isArray(true)).toEqual(false);
                expect(_.isArray(false)).toEqual(false);
                expect(_.isArray(1)).toEqual(false);
                expect(_.isArray(0)).toEqual(false);
                expect(_.isArray(Infinity)).toEqual(false);
                expect(_.isArray(NaN)).toEqual(false);
                expect(_.isArray(null)).toEqual(false);
                expect(_.isArray(undefined)).toEqual(false);
                expect(_.isArray('')).toEqual(false);
                expect(_.isArray(baseString)).toEqual(false);
                expect(_.isArray([])).toEqual(true);
                expect(_.isArray({})).toEqual(false);
                expect(_.isArray(window)).toEqual(false);
                expect(_.isArray(function () {})).toEqual(false);
            });
            it('_.isEmpty', function () {
                expect(_.isEmpty(true)).toEqual(true);
                expect(_.isEmpty(false)).toEqual(true);
                expect(_.isEmpty(1)).toEqual(true);
                expect(_.isEmpty(0)).toEqual(true);
                expect(_.isEmpty(Infinity)).toEqual(true);
                expect(_.isEmpty(NaN)).toEqual(true);
                expect(_.isEmpty(null)).toEqual(true);
                expect(_.isEmpty(undefined)).toEqual(true);
                expect(_.isEmpty('')).toEqual(true);
                expect(_.isEmpty(baseString)).toEqual(true);
                expect(_.isEmpty([])).toEqual(true);
                expect(_.isEmpty({})).toEqual(true);
                expect(_.isEmpty(window)).toEqual(false);
                expect(_.isEmpty(function () {})).toEqual(true);
                expect(_.isEmpty([1])).toEqual(false);
                expect(_.isEmpty({
                    one: 1
                })).toEqual(false);
            });
            it('_.isInstance', function () {
                var obj = {},
                    newBox = _.Box();
                expect(_.isInstance(obj, Object)).toEqual(true);
                expect(_.isInstance(newBox, factories.Box)).toEqual(true);
                expect(_.isInstance(newBox, _.Box)).toEqual(true);
                expect(_.isInstance(newBox, _.Collection)).toEqual(false);
            });
            it('_.negate', function () {
                var falsey = _.negate(function () {
                        return false;
                    }),
                    truthy = _.negate(function () {
                        return true;
                    });
                expect(truthy()).toEqual(false);
                expect(falsey()).toEqual(true);
            });
            it('_.invert', function () {
                expect(_.invert({
                    one: 1,
                    two: 2
                })).toEqual({
                    '1': 'one',
                    '2': 'two'
                });
            });
            it('_.stringify', function () {
                expect(_.stringify({})).toEqual(JSON.stringify({}));
                expect(_.stringify({})).not.toEqual({}.toString());
                expect(_.stringify(function () {})).toEqual(function () {}.toString());
            });
            it('_.extend', function () {
                expect(_.extend({
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
                expect(_.extend(!0, {
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
                expect(_.extend({
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
            it('_.merge', function () {
                // modifies the original object
                expect(_.merge({
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
            it('_.isArrayLike', function () {
                expect(_.isArrayLike('')).toEqual(false);
                expect(_.isArrayLike([])).toEqual(true);
                expect(_.isArrayLike({
                    '0': 0,
                    '1': 1,
                    length: 2,
                    splice: function () {}
                })).toEqual(true);
            });
            it('_.each', function () {
                var args = [],
                    obj = {
                        one: 1,
                        two: 2,
                        three: 3
                    };
                _.each(obj, function (item, idx, iteratingObj) {
                    args.push([item, idx, iteratingObj]);
                });
                expect(args).toEqual([
                    [1, 'one', obj],
                    [2, 'two', obj],
                    [3, 'three', obj]
                ]);
                args = [];
                obj = ['one', 'two', 'three'];
                _.each(obj, function (val, idx, o) {
                    args.push([val, idx, o]);
                });
                expect(args).toEqual([
                    ['one', 0, obj],
                    ['two', 1, obj],
                    ['three', 2, obj]
                ]);
            });
            it('_.parseBool', function () {
                expect(_.parseBool('truth')).toEqual('truth');
                expect(_.parseBool('true')).toEqual(true);
                expect(_.parseBool('falsey')).toEqual('falsey');
                expect(_.parseBool('false')).toEqual(false);
                expect(_.parseBool({})).toEqual({});
            });
            it('_.once', function () {
                var count = 0,
                    counted = 0,
                    counter = _.once(function () {
                        counted++;
                    });
                while (count < 10) {
                    counter();
                    count++;
                }
                expect(counted).toEqual(1);
            });
            it('_.isEqual', function () {
                expect(_.isEqual({
                    one: {
                        one: [1, 2, 4, 5]
                    }
                }, {
                    one: {
                        one: [1, 2, 4, 5]
                    }
                })).toEqual(true);
            });
            it('_.clone', function () {
                var original = {
                        some: 'thing',
                        out: 'there'
                    },
                    cloned = _.clone(original);
                expect(cloned).toEqual(original);
            });
            // write more differentiating code for this test
            it('_.fullClone', function () {
                var original = {
                        some: 'thing',
                        out: 'there'
                    },
                    cloned = _.fullClone(original);
                expect(cloned).toEqual(original);
            });
            it('_.wrap', function () {
                expect(_.wrap(['some', 'where'], function (val) {
                    return !val.indexOf('s');
                })).toEqual({
                    some: true,
                    where: false
                });
                expect(_.wrap({
                    click: '0event',
                    hover: '1event'
                }, function (val, eventName) {
                    return !val.indexOf('0');
                })).toEqual({
                    click: true,
                    hover: false
                });
            });
            it('_.unshift', function () {
                var make = function () {
                    return [1, 2, 3, 4, 5, 6];
                };
                expect(_.unshift(make(), 0)).toEqual(make().unshift(0));
            });
            // write async test
            it('_.fetch', function () {
                var img = _.fetch('https://app.gospecless.com/favicon.ico');
                expect(img instanceof Image).toEqual(true);
            });
            // it('_.returnBuild', function () {
            //     expect(_.returnBuild({
            //         some: {
            //             where: {
            //                 only: {
            //                     we: {
            //                         know: {
            //                             by: 'keane'
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }, 'some where only we know', [{}, {}, {}, {}, {}])).toEqual({
            //         by: 'keane'
            //     });
            //     expect(_.returnBuild({
            //         some: {
            //             where: {
            //                 only: {
            //                     we: {
            //                         know: {
            //                             by: 'keane'
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }, 'some where here', [{}, {}, {}])).toEqual({});
            // });
            it('_.parse', function () {
                expect(_.parse('{"some":1,"one":true}')).toEqual({
                    some: 1,
                    one: true
                });
                expect(_.parse({
                    some: 1,
                    one: true
                })).toEqual({
                    some: 1,
                    one: true
                });
            });
            it('_.units', function () {
                expect(_.units('')).toEqual(false);
                expect(_.units(500)).toEqual(false);
                expect(_.units('500')).toEqual(false);
                expect(_.units('500px')).toEqual('px');
                expect(_.units('500rem')).toEqual('rem');
                expect(_.units('500em')).toEqual('em');
                expect(_.units('500%')).toEqual('%');
                expect(_.units('500ex')).toEqual('ex');
                expect(_.units('500in')).toEqual('in');
                expect(_.units('500cm')).toEqual('cm');
                expect(_.units('500vh')).toEqual('vh');
                expect(_.units('500vw')).toEqual('vw');
                expect(_.units('500pc')).toEqual('pc');
                expect(_.units('500pt')).toEqual('pt');
                expect(_.units('500mm')).toEqual('mm');
            });
            it('_.stringifyQuery', function () {
                expect(_.stringifyQuery({
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
            it('_.protoProp', function () {
                var box = _.Box();
                box.idAttribute = 'something';
                expect(_.protoProp(box, 'idAttribute')).toEqual(factories.Box.constructor.prototype.idAttribute);
            });
            it('_.roundFloat', function () {
                expect(_.roundFloat(1.5489909, 3)).toEqual(1.548);
            });
        });
    });
});