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
                    newBox = factories.Box();
                expect(_.isInstance(obj, Object)).toEqual(true);
                expect(_.isInstance(newBox, factories.Box)).toEqual(true);
                expect(_.isInstance(newBox, factories.Box)).toEqual(true);
                expect(_.isInstance(newBox, factories.Collection)).toEqual(false);
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
                var box = factories.Box();
                box.idAttribute = 'something';
                expect(_.protoProp(box, 'idAttribute')).toEqual(factories.Box.constructor.prototype.idAttribute);
            });
            it('_.roundFloat', function () {
                expect(_.roundFloat(1.5489909, 3)).toEqual(1.548);
            });
        });
    });
});
application.scope().run(function (app, _) {
    describe('Strings', function () {
        it('_.camelCase', function () {
            var thatIsCamelCased = 'thisIsCamelCased';
            // default delimiter is -
            expect(_.camelCase('this-is-camel-cased')).toEqual(thatIsCamelCased);
            expect(_.camelCase('thisIsCamelCased')).toEqual(thatIsCamelCased);
            // overridable by second param
            expect(_.camelCase('this_is_camel_cased', '_')).toEqual(thatIsCamelCased);
            expect(_.camelCase('this is camel cased', ' ')).toEqual(thatIsCamelCased);
            // does not modify the first character if it is passed in as a capital letter
            expect(_.camelCase('This Is Camel Cased', ' ')).not.toEqual(thatIsCamelCased);
        });
        it('_.upCase', function () {
            expect(_.upCase('some')).toEqual('Some');
            expect(_.upCase('Some')).toEqual('Some');
            expect(_.upCase('sOmE')).toEqual('SOmE');
        });
        it('_.unCamelCase', function () {
            var thatIsCamelCased = 'thisIsUnCamelCased';
            expect(_.unCamelCase(thatIsCamelCased)).toEqual('this-is-un-camel-cased');
            expect(_.unCamelCase(thatIsCamelCased, ' ')).toEqual('this is un camel cased');
            expect(_.unCamelCase(thatIsCamelCased, '_')).toEqual('this_is_un_camel_cased');
            expect(_.unCamelCase(thatIsCamelCased, '1')).toEqual('this1is1un1camel1cased');
        });
    });
});
application.scope().run(function (app, _, factories, $) {
    describe('Collection', function () {
        var collection, numberCollection, complexCollection, evenNumberList;
        beforeEach(function () {
            collection = factories.Collection();
            numberCollection = factories.Collection([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            complexCollection = factories.Collection([factories.Box(), factories.Box({
                one: 1,
                two: 2,
                three: 3
            })]);
            evenNumberList = [0, 2, 4, 6, 8];
        });
        it('extends from factories.Model', function () {
            expect(_.isInstance(collection, factories.Model)).toEqual(true);
        });
        it('extends from factories.Collection', function () {
            expect(_.isInstance(collection, factories.Collection)).toEqual(true);
        });
        it('has an array at _items', function () {
            expect(_.isArray(collection._items)).toEqual(true);
        });
        it('is not an array like object', function () {
            expect(_.isArrayLike(collection)).toEqual(false);
        });
        it('knows it\'s length', function () {
            expect(numberCollection.length()).toEqual(10);
        });
        it('can give you all of it\'s values at once', function () {
            expect(collection.unwrap()).toEqual(collection._items);
        });
        it('or one at a time', function () {
            numberCollection.duff(function (item, idx) {
                expect(numberCollection.index(idx)).toEqual(numberCollection._items[idx]);
            });
        });
        it('as well as in reverse order', function () {
            var list = [];
            numberCollection.duffRev(function (item, idx) {
                expect(numberCollection.index(idx)).toEqual(numberCollection._items[idx]);
                list.push(item);
            });
            expect(list).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        });
        it('can trigger toJSON on children', function () {
            expect(JSON.stringify(numberCollection)).toEqual('[0,1,2,3,4,5,6,7,8,9]');
            expect(JSON.stringify(complexCollection)).toEqual('[{},{"one":1,"two":2,"three":3}]');
        });
        it('can also concatonate itself with collections and arrays just like a regular array', function () {
            var collection = factories.Collection([0, 1, 2, 3, 4]),
                list = factories.Collection([5, 6, 7, 8, 9]);
            expect(collection.concat(list, evenNumberList).unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2, 4, 6, 8]);
        });
        it('can also reverse itself momentarily', function () {
            var test = [];
            numberCollection.mambo(function (list) {
                list.duff(function (val) {
                    test.push(val);
                });
            });
            expect(test).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        });
        describe('but other methods need arrays... Collections also have a bunch of methods that they stole from the _ object such as:', function () {
            it('addAll', function () {
                expect(numberCollection.addAll([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]);
            });
            it('removeAll', function () {
                expect(numberCollection.removeAll([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).unwrap()).toEqual([1, 3, 5, 7, 9]);
            });
            it('sort', function () {
                expect(numberCollection.sort().unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
                expect(numberCollection.sort(function (a, b) {
                    return (a % 3) - (b % 3);
                }).unwrap()).toEqual([0, 3, 6, 9, 1, 4, 7, 2, 5, 8]);
            });
            it('unshift', function () {
                expect(numberCollection.unshift(-1).unwrap()).toEqual([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            it('push', function () {
                expect(numberCollection.push(10).unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
                expect(numberCollection.push(11, 12, 13).unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
            });
            it('cycle', function () {
                expect(numberCollection.cycle(3).unwrap()).toEqual([3, 4, 5, 6, 7, 8, 9, 0, 1, 2]);
            });
            it('uncycle', function () {
                expect(numberCollection.uncycle(3).unwrap()).toEqual([7, 8, 9, 0, 1, 2, 3, 4, 5, 6]);
            });
            it('count', function () {
                expect(numberCollection.count(10, 20, function (item, idx, list) {
                    if (item === null) {
                        list.push(idx);
                    }
                }).length()).toEqual(20);
            });
            it('countTo', function () {
                expect(numberCollection.countTo(20, function (item, idx, list) {
                    if (item === null) {
                        list.push(idx);
                    }
                }).length()).toEqual(20);
            });
            it('countFrom', function () {
                var count = 0;
                numberCollection.countFrom(6, function (item, idx, list) {
                    count++;
                });
                expect(count).toEqual(4);
            });
            it('has', function () {
                expect(numberCollection.has('25')).toEqual(false);
                expect(numberCollection.has('3')).toEqual(true);
                expect(numberCollection.has({})).toEqual(false);
                expect(numberCollection.has([])).toEqual(false);
            });
            it('add', function () {
                expect(numberCollection.add(61)).toEqual(true);
                expect(numberCollection.add(5)).toEqual(false);
                expect(numberCollection.unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 61]);
                expect(numberCollection.add(61)).toEqual(false);
            });
            it('addAt', function () {
                expect(numberCollection.addAt(5, 1)).toEqual(true);
                expect(numberCollection.unwrap()).toEqual([0, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            it('remove', function () {
                expect(numberCollection.remove(5)).toEqual(true);
                expect(numberCollection.unwrap()).toEqual([0, 1, 2, 3, 4, 6, 7, 8, 9]);
                expect(numberCollection.remove(5)).toEqual(false);
            });
            it('removeAt', function () {
                expect(numberCollection.removeAt(3)).toEqual(3);
                expect(numberCollection.removeAt(3)).toEqual(4);
                expect(numberCollection.length()).toEqual(8);
            });
            it('pop', function () {
                expect(numberCollection.pop()).toEqual(9);
                expect(numberCollection.pop()).toEqual(8);
                expect(numberCollection.length()).toEqual(8);
            });
            it('shift', function () {
                expect(numberCollection.shift()).toEqual(0);
                expect(numberCollection.shift()).toEqual(1);
                expect(numberCollection.length()).toEqual(8);
            });
            it('indexOf', function () {
                expect(numberCollection.indexOf(3)).toEqual(3);
                expect(numberCollection.indexOf(7)).toEqual(7);
            });
            it('find', function () {
                expect(numberCollection.find(function (ix, item) {
                    return item === 10;
                })).toEqual(void 0);
                expect(numberCollection.find(function (ix, item) {
                    return item === 7;
                })).toEqual(7);
            });
            it('findLast', function () {
                expect(factories.Collection([12, 1, 2, 1, 104, 2, 1, 5, 55, 6, 2, 7]).findLast(function (item) {
                    return item % 17 === 0;
                })).toEqual(void 0);
                expect(factories.Collection([88, 2, 1, 5, 70, 23, 43, 9]).findLast(function (item) {
                    return item % 2 === 0;
                })).toEqual(70);
            });
            var firstFindObj = {
                    one: 1,
                    two: 2,
                    three: 3
                },
                secondFindObj = {
                    one: 3,
                    two: 2,
                    four: 4
                };
            it('findWhere', function () {
                expect(factories.Collection([firstFindObj, secondFindObj]).findWhere({
                    one: 2
                })).toEqual(void 0);
                expect(factories.Collection([firstFindObj, secondFindObj]).findWhere({
                    two: 2
                })).toEqual(firstFindObj);
            });
            it('findLastWhere', function () {
                expect(factories.Collection([firstFindObj, secondFindObj]).findLastWhere({
                    one: 2
                })).toEqual(void 0);
                expect(factories.Collection([firstFindObj, secondFindObj]).findLastWhere({
                    two: 2
                })).toEqual(secondFindObj);
            });
            it('posit', function () {
                expect(numberCollection.posit(5)).toEqual(6);
                expect(numberCollection.posit(11)).toEqual(0);
            });
            it('foldr', function () {
                expect(numberCollection.foldr(function (memo, idx, item) {
                    memo.push(item);
                    return memo;
                }, [])).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
            });
            it('foldl', function () {
                expect(numberCollection.foldl(function (memo, idx, item) {
                    memo.push(item);
                    return memo;
                }, [])).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            it('merge', function () {
                expect(numberCollection.merge([0, 1, 2, 6, 7, 8]).unwrap()).toEqual([0, 1, 2, 6, 7, 8, 6, 7, 8, 9]);
            });
            it('range', function () {
                expect(factories.Collection().range(4, 9).unwrap()).toEqual([4, 5, 6, 7, 8]);
            });
            it('eq', function () {
                expect(numberCollection.eq(4).unwrap()).toEqual([4]);
                expect(numberCollection.eq([3, 9]).unwrap()).toEqual([3, 9]);
            });
            it('map', function () {
                expect(numberCollection.map(function (idx, item) {
                    return item * 2;
                }).unwrap()).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
            });
            it('filter', function () {
                expect(numberCollection.filter(function (idx, item) {
                    return item % 2;
                }).unwrap()).toEqual([1, 3, 5, 7, 9]);
            });
            it('pluck', function () {
                expect(factories.Collection([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]).pluck('one').unwrap()).toEqual([1, 2, 3, 4]);
            });
            it('where', function () {
                expect(factories.Collection([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 1
                }, {
                    one: 4
                }]).where({
                    one: 1
                }).unwrap()).toEqual([{
                    one: 1
                }, {
                    one: 1
                }]);
            });
            it('flatten', function () {
                expect(factories.Collection([
                    [0, 1, 2, 3],
                    [4, 5, 6, 7, 8],
                    [9, 10, 11, 12]
                ]).flatten().unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            });
        });
    });
});
application.scope().run(function (app, _, factories, $) {
    describe('Events', function () {
        var blank, box,
            Box = factories.Box,
            handler = function () {
                return !0;
            },
            handler2 = function () {
                return !1;
            },
            data = {
                some: 'thing',
                children: [{
                    here: 'we',
                    go: 'pause'
                }, {
                    one: 'more',
                    time: 'pause'
                }]
            };
        beforeEach(function () {
            box = Box({
                zero: 0,
                one: 1,
                two: 2,
                three: 3,
                four: 4,
                five: 5,
                six: 6,
                seven: 7,
                eight: 8,
                nine: 9
            });
        });
        describe('Boxes can have events', function () {
            var box2;
            describe('and can create events for itself', function () {
                it('either one at a time', function () {
                    box.on('evnt', handler);
                    expect(box._events.evnt[0].handler()).toEqual(true);
                });
                it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    expect(box._events.evnt[0].handler() && box._events.eventer[0].handler() && box._events.mikesevent[0].handler()).toEqual(true);
                });
                // it('or many against a list of functions', function () {
                //     box.on('evnt eventer mikesevent', [handler, handler2]);
                //     expect(box._events.evnt[0].handler === handler && box._events.evnt[1].handler === handler2).toEqual(true);
                // });
            });
            describe('and can remove events from itself', function () {
                it('either one at a time', function () {
                    box.on('evnt', handler);
                    expect(box._events.evnt[0].handler()).toEqual(true);
                    box.off('evnt', handler);
                    expect(box._events.evnt[0]).toEqual(void 0);
                });
                it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    expect(box._events.evnt[0].handler === handler && box._events.eventer[0].handler === handler && box._events.mikesevent[0].handler === handler).toEqual(true);
                    box.off('evnt eventer mikesevent', handler);
                    expect(box._events.evnt[0] === void 0 && box._events.eventer[0] === void 0 && box._events.mikesevent[0] === void 0).toEqual(true);
                });
                // it('or many against a list of functions', function () {
                //     box.on('evnt eventer mikesevent', [handler, handler2]);
                //     expect(box._events.evnt[0].handler === handler && box._events.eventer[0].handler === handler && box._events.mikesevent[0].handler === handler && box._events.evnt[1].handler === handler2 && box._events.eventer[1].handler === handler2 && box._events.mikesevent[1].handler === handler2).toEqual(true);
                //     box.off('evnt eventer mikesevent', [handler, handler2]);
                //     expect(box._events.evnt[0] === void 0 && box._events.eventer[0] === void 0 && box._events.mikesevent[0] === void 0).toEqual(true);
                // });
            });
        });
        describe('Boxes can also listen to other, similar objects', function () {
            var box2;
            beforeEach(function () {
                box2 = Box();
            });
            describe('by using the listenTo method', function () {
                it('either one at a time', function () {
                    box.listenTo(box2, 'evnt', handler);
                    expect(box2._events.evnt[0].handler === handler).toEqual(true);
                });
                it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    expect(box2._events.evnt[0].handler === handler && box2._events.eventer[0].handler === handler && box2._events.mikesevent[0].handler === handler).toEqual(true);
                });
                // it('or many against a list of functions', function () {
                //     var listenObj;
                //     box.listenTo(box2, 'evnt eventer mikesevent', [handler, handler2]);
                //     expect(handler === box2._events.evnt[0].handler && handler === box2._events.eventer[0].handler && handler === box2._events.mikesevent[0].handler && handler2 === box2._events.evnt[1].handler && handler2 === box2._events.eventer[1].handler && handler2 === box2._events.mikesevent[1].handler).toEqual(true);
                //     _.each(box._listeningTo, function (idx, listen) {
                //         listenObj = listen;
                //     });
                //     expect(handler === listenObj.obj._events.evnt[0].handler && handler === listenObj.obj._events.eventer[0].handler && handler === listenObj.obj._events.mikesevent[0].handler && handler2 === listenObj.obj._events.evnt[1].handler && handler2 === listenObj.obj._events.eventer[1].handler && handler2 === listenObj.obj._events.mikesevent[1].handler).toEqual(true);
                // });
            });
            describe('you can even take a shortcut and dispatch an event one at a time', function () {
                it('using dispatch event', function () {
                    var handle = 0,
                        handler = function () {
                            handle++;
                        };
                    box.on('handle', handler);
                    box.dispatchEvent('handle');
                    expect(handle).toEqual(1);
                });
            });
            describe('and can stop listening by using the stopListening method', function () {
                it('can remove events one at a time', function () {
                    var listenObj;
                    box.listenTo(box2, 'evnt', handler);
                    expect(box2._events.evnt[0].handler === handler).toEqual(true);
                    box.stopListening(box2, 'evnt', handler);
                    _.each(box._listeningTo, function (idx, listen) {
                        listenObj = listen;
                    });
                    expect(box2._events.evnt[0] === void 0 && listenObj === void 0).toEqual(true);
                });
                it('or many at a time', function () {
                    var listenObj;
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    expect(box2._events.evnt[0].handler === handler && box2._events.eventer[0].handler === handler && box2._events.mikesevent[0].handler === handler).toEqual(true);
                    box.stopListening(box2, 'evnt eventer mikesevent', handler);
                    _.each(box._listeningTo, function (idx, listen) {
                        listenObj = listen;
                    });
                    expect(box2._events.evnt[0] === void 0 && box2._events.eventer[0] === void 0 && box2._events.mikesevent[0] === void 0).toEqual(true);
                });
                // it('or many against a list of functions', function () {
                //     var listenObj;
                //     box.listenTo(box2, 'evnt eventer mikesevent', [handler, handler2]);
                //     _.each(box._listeningTo, function (idx, listen) {
                //         listenObj = listen;
                //     });
                //     expect(box2._events.evnt[0].handler === handler && box2._events.eventer[0].handler === handler && box2._events.mikesevent[0].handler === handler && box2._events.evnt[1].handler === handler2 && box2._events.eventer[1].handler === handler2 && box2._events.mikesevent[1].handler === handler2 && listenObj.obj._events.evnt[0].handler === handler && listenObj.obj._events.eventer[0].handler === handler && listenObj.obj._events.mikesevent[0].handler === handler && listenObj.obj._events.evnt[1].handler === handler2 && listenObj.obj._events.eventer[1].handler === handler2 && listenObj.obj._events.mikesevent[1].handler === handler2).toEqual(true);
                //     box.stopListening(box2, 'evnt eventer mikesevent', [handler, handler2]);
                //     expect(box2._events.evnt[0] === void 0 && box2._events.eventer[0] === void 0 && box2._events.mikesevent[0] === void 0 && box2._events.evnt[1] === void 0 && box2._events.eventer[1] === void 0 && box2._events.mikesevent[1] === void 0 && listenObj.obj._events.evnt[0] === void 0 && listenObj.obj._events.eventer[0] === void 0 && listenObj.obj._events.mikesevent[0] === void 0 && listenObj.obj._events.evnt[1] === void 0 && listenObj.obj._events.eventer[1] === void 0 && listenObj.obj._events.mikesevent[1] === void 0).toEqual(true);
                // });
            });
        });
    });
});
application.scope().run(function (app, _, factories, $) {
    // var factories = _.factories;
    describe('Box', function () {
        var blank, box,
            Box = factories.Box,
            handler = function () {
                return !0;
            },
            handler2 = function () {
                return !1;
            },
            data = {
                some: 'thing',
                children: [{
                    here: 'we',
                    go: 'pause'
                }, {
                    one: 'more',
                    time: 'pause'
                }]
            };
        beforeEach(function () {
            box = Box({
                zero: 0,
                one: 1,
                two: 2,
                three: 3,
                four: 4,
                five: 5,
                six: 6,
                seven: 7,
                eight: 8,
                nine: 9
            });
        });
        it('extends from factories.Model', function () {
            expect(_.isInstance(box, factories.Model)).toEqual(true);
        });
        describe('Boxes are always created with...', function () {
            var box2 = Box();
            it('a unique id', function () {
                expect(_.has(box2, 'id')).toEqual(true);
            });
            it('a _previousAttributes hash', function () {
                expect(_.has(box2, '_previousAttributes')).toEqual(true);
                expect(_.isObject(box2._previousAttributes)).toEqual(true);
                expect(_.isEmpty(box2._previousAttributes)).toEqual(true);
            });
            // it('a _byId hash', function () {
            // 	expect(_.has(box2, '_byId')).toEqual(true);
            // 	expect(_.isObject(box2._byId)).toEqual(true);
            // });
            it('a collection of children', function () {
                expect(_.has(box2, 'children')).toEqual(true);
                expect(_.isInstance(box2.children, factories.Collection)).toEqual(true);
                expect(box2.children.length()).toEqual(0);
            });
            it('and an attributes object', function () {
                expect(_.has(box2, 'attributes')).toEqual(true);
                expect(_.isObject(box2.attributes)).toEqual(true);
            });
        });
        describe('you can set properties on the box you\'re handling with the set method', function () {
            var box = Box(),
                attrs = box.attributes;
            beforeEach(function () {
                box = Box({
                    zero: 0,
                    one: 1,
                    two: 2,
                    three: 3,
                    four: 4,
                    five: 5,
                    six: 6,
                    seven: 7,
                    eight: 8,
                    nine: 9
                });
            });
            it('you can add new properties', function () {
                expect(attrs.ten).toEqual(void 0);
                box.set({
                    ten: 10,
                    eleven: 11,
                    twelve: 12
                });
                // expect(_.has(box._previousAttributes, 'ten')).toEqual(true);
                // expect(box._previousAttributes.one).toEqual(void 0);
                expect(box.attributes.ten).toEqual(10);
            });
            it('you can modify existing properties', function () {
                expect(box.attributes.one).toEqual(1);
                box.set({
                    one: 2,
                    two: 3,
                    three: 4
                });
                // expect(_.has(box._previousAttributes, 'one')).toEqual(true);
                // expect(box._previousAttributes.one).toEqual(1);
                expect(box.attributes.one).toEqual(2);
            });
            // it('modifying the attributes object can be done by passing in a variety of arguments, which are sequenced and extended onto the object', function () {
            //     box.set('one', 5, {
            //         three: 1,
            //         four: 2,
            //         five: 3
            //     }, 'four', 4);
            //     expect(box.attributes.one).toEqual(5);
            //     expect(box.attributes.three).toEqual(1);
            //     expect(box.attributes.four).toEqual(4);
            //     expect(box.attributes.five).toEqual(3);
            // });
            it('and you can remove properties by using the unset method', function () {
                var box = Box();
                expect(box.attributes.one).toEqual(void 0);
                box.set({
                    one: 1
                });
                expect(box.attributes.one).toEqual(1);
                box.unset('one');
                expect(box.attributes.one).toEqual(void 0);
            });
            it('or remove a bunch of properties by passing in a space separated list to the unset method', function () {
                expect(box.attributes.one).toEqual(1);
                expect(box.attributes.three).toEqual(3);
                expect(box.attributes.five).toEqual(5);
                box.unset('one three five');
                expect(box.attributes.one).toEqual(void 0);
                expect(box.attributes.three).toEqual(void 0);
                expect(box.attributes.five).toEqual(void 0);
            });
        });
        // pass to the on, once, off, listenTo, listenToOnce, and stopListening functions
        describe('there are super special characters that you can use for terseness', function () {
            var count = 0,
                handler = function () {
                    count++;
                };
            beforeEach(function () {
                box2 = Box();
                count = 0;
            });
        });
        describe('Boxes also trigger a variety of events any time the set method changes the attributes object', function () {
            var fired;
            beforeEach(function () {
                fired = 0;
            });
            it('such as the digest event', function () {
                box.on('digest', function () {
                    fired = 1;
                });
                box.set({
                    here: 'there'
                });
                expect(fired).toEqual(1);
            });
            it('and the alter event', function () {
                box.on('change', function () {
                    fired = 1;
                });
                box.set({
                    one: 1,
                    two: 2
                });
                expect(fired).toEqual(0);
                box.set({
                    two: 1
                });
                expect(fired).toEqual(1);
            });
            it('as well as alter events specific to each property', function () {
                var obj = {
                    one: 9,
                    two: 8,
                    three: 7
                };
                box.on('change:one change:two change:three', function () {
                    fired++;
                });
                box.set(obj);
                expect(_.keys(obj).length).toEqual(fired);
            });
        });
        describe('but beyond events and simple hashes, Boxes are able to manage themselves fairly well', function () {
            var data = {
                some: 'thing',
                children: [{
                    here: 'we',
                    go: 'pause'
                }, {
                    one: 'more',
                    time: 'pause'
                }]
            };
            it('they can get properties from the attributes object with the get method', function () {
                expect(box.get('one')).toEqual(1);
            });
            it('they can tell you if it has a property with the has method', function () {
                expect(box.has('one')).toEqual(true);
            });
            it('they can clone it\'s attributes by using the toJSON method', function () {
                var clone = box.toJSON();
                expect(clone).toEqual(box.attributes);
                expect(clone === box.attributes).toEqual(false);
            });
            it('they can clone children into an array', function () {
                var clone;
                box.add([factories.Box(), factories.Box()]);
                clone = box.children.toJSON();
                expect(clone).toEqual([{}, {}]);
            });
            it('they can even clone their deep, underlying structure', function () {
                box = factories.Box(data);
                expect(box.treeToJSON()).toEqual(data);
            });
            it('they can stringify themselves', function () {
                box = factories.Box({
                    some: 'thing'
                });
                expect(box.toString()).toEqual(JSON.stringify({
                    some: 'thing'
                }));
            });
            it('they can stringify their children', function () {
                box = factories.Box();
                box.add(data.children);
                expect(box.children.toString()).toEqual(JSON.stringify(data.children));
            });
            // it('they can stringify themselves as a tree structure', function () {
            //     box = factories.Box(data);
            //     expect(box.stringifyTree()).toEqual(JSON.stringify(data));
            // });
            // it('they can stringify themselves as a tree structure', function () {
            //     box = factories.Box(data);
            //     expect(box.stringifyTree()).toEqual(JSON.stringify(data));
            // });
        });
        describe('Boxes can register other objects against a key hash as well', function () {
            it('it can register', function () {
                box.children.register('registering', {
                    myObj: 1
                });
                expect(box.children._byId.id.registering.myObj).toEqual(1);
            });
            it('and retreive information', function () {
                var data = {
                    myObj: 1
                };
                box.children.register('registering', data);
                expect(box.children.get('registering')).toEqual(data);
                expect(box.children.get('registering') === data).toEqual(true);
            });
        });
        describe('As you may have noticed, boxes', function () {
            describe('can have children', function () {
                it('you can add one at a time', function () {
                    box.add({
                        isChild: !0
                    });
                    expect(box.children.length()).toEqual(1);
                });
                it('or many at once', function () {
                    box.add([{
                        isChild: !0
                    }, {
                        isChild: 'maybe'
                    }]);
                    expect(box.children.length()).toEqual(2);
                });
                it('you can also remove them', function () {
                    box = factories.Box();
                    box.add(data.children);
                    expect(box.children.length()).toEqual(2);
                });
                it('or many at the same time', function () {
                    box = factories.Box();
                    box.add([{
                        one: 1
                    }, {
                        one: 2
                    }, {
                        one: 3
                    }, {
                        one: 4
                    }]);
                    var children = box.children;
                    expect(children.length()).toEqual(4);
                    box.remove([children.index(1), children.index(3)]);
                    expect(children.length()).toEqual(2);
                });
            });
            describe('they can', function () {
                it('destroy themselves', function () {
                    box = factories.Box();
                    box.add([{
                        one: 1
                    }, {
                        one: 2
                    }, {
                        one: 3
                    }, {
                        one: 4
                    }]);
                    var destroyer = box.children.index(2);
                    expect(box.children.get('cid', destroyer.cid) === destroyer).toEqual(true);
                    expect(box.children.get('id', destroyer.id) === destroyer).toEqual(true);
                    destroyer.destroy();
                    expect(box.children.get('cid', destroyer.cid)).toEqual(void 0);
                    expect(box.children.get('id', destroyer.id)).toEqual(void 0);
                });
                it('sort their children', function () {
                    box.add([{
                        one: 1,
                        two: 2,
                        three: 3
                    }, {
                        one: 2,
                        two: 1,
                        three: 3
                    }, {
                        one: 3,
                        two: 8,
                        three: 9
                    }]);
                    box.comparator = 'two';
                    box.sort();
                    expect(box.children.map(function (model) {
                        return model.get('two');
                    }).unwrap()).toEqual([1, 2, 8]);
                    box.comparator = '!two';
                    box.sort();
                    expect(box.children.map(function (model) {
                        return model.get('two');
                    }).unwrap()).toEqual([8, 2, 1]);
                });
                it('set up events on their children', function () {
                    var counter = 0;
                    box.childEvents = {
                        beep: function () {
                            counter++;
                            counter += (this === box);
                        },
                        boop: function () {
                            counter--;
                        }
                    };
                    box.add([{}, {}, {}, {}]);
                    box.children.duff(function (model) {
                        model.dispatchEvent('beep');
                    });
                    expect(counter).toEqual(8);
                    box.children.duff(function (model) {
                        model.dispatchEvent('boop');
                    });
                    expect(counter).toEqual(4);
                });
                it('set up events on their parents', function () {
                    var count = 0;
                    Box.constructor.prototype.parentEvents = {
                        beep: function () {
                            count++;
                        }
                    };
                    box.add([{}, {}, {}, {}]);
                    box.dispatchEvent('beep');
                    expect(count).toEqual(4);
                    Box.constructor.prototype.parentEvents = blank;
                });
            });
        });
        describe('boxes can remove themselves', function () {
            it('if they are alone, only their events will be removed', function () {
                box.on({
                    event1: function () {},
                    event2: function () {}
                });
                expect(box._events.event1.length).toEqual(1);
                box.destroy();
                expect(box._events.event1.length).toEqual(0);
            });
            it('if they are listening to something then those listeners will also be removed', function () {
                var box2 = factories.Box(),
                    events = {};
                box.listenTo(box2, {
                    event1: function () {},
                    event2: function () {}
                });
                expect(box2._events.event1.length).toEqual(1);
                expect(_.keys(box._listeningTo).length).toEqual(1);
                box2.destroy();
                expect(box2._events.event1.length).toEqual(0);
                _.each(box._listeningTo, function (val, key) {
                    if (!_.isBlank(val)) {
                        events[key] = val;
                    }
                });
                expect(_.keys(events).length).toEqual(0);
            });
            it('conversely, if the box has listening objects, it will remove it\'s handlers from other objects', function () {
                var box2 = factories.Box(),
                    events = {};
                box.listenTo(box2, {
                    event1: function () {},
                    event2: function () {}
                });
                expect(box2._events.event1.length).toEqual(1);
                expect(_.keys(box._listeningTo).length).toEqual(1);
                box.destroy();
                // check to make sure all of the _events are being removed and
                // all of the ties to everything else is being cleaned up
                expect(box2._events.event1.length).toEqual(0);
                _.each(box._listeningTo, function (val, key) {
                    if (!_.isBlank(val)) {
                        events[key] = val;
                    }
                });
                expect(_.keys(events).length).toEqual(0);
            });
        });
    });
});
application.scope().run(function (app, _, factories, $) {
    describe('Promise', function () {
        var madeit, promise;
        beforeEach(function () {
            madeit = 0;
            promise = factories.Promise();
        });
        it('allows for async resolution of state', function () {
            expect(_.isObject(promise)).toEqual(true);
            promise.always(function (e) {
                madeit++;
            });
            // test for premature trigger
            expect(madeit).toEqual(0);
            // make sure promise is an object
            expect(_.isObject(promise)).toEqual(true);
            // make sure it has the right "state"
            expect(promise.state()).toEqual('pending');
            // resolve the promise
            promise.resolve();
            // make sure that it hit the function once and only once
            expect(madeit).toEqual(1);
            // make sure it has the correct state after resolution
            expect(promise.state()).toEqual('success');
        });
        it('can tell you if it has resolved or not', function () {
            expect(promise.resolved()).toEqual(false);
            promise.resolve();
            expect(promise.resolved()).toEqual(true);
        });
        describe('can tell you what state it is in such as', function () {
            it('pending', function () {
                expect(promise.state()).toEqual('pending');
            });
            it('success', function () {
                promise.resolve();
                expect(promise.state()).toEqual('success');
            });
            it('failure', function () {
                promise.reject();
                expect(promise.state()).toEqual('failure');
            });
        });
        describe('or it can give you a boolean value for resolutions like', function () {
            it('pending', function () {
                expect(promise.isPending()).toEqual(true);
            });
            it('success', function () {
                promise.resolve();
                expect(promise.isFulfilled()).toEqual(true);
            });
            it('failure', function () {
                promise.reject();
                expect(promise.isRejected()).toEqual(true);
            });
        });
        describe('can resolve to different states such as', function () {
            it('success', function (done) {
                // attach handler
                promise.success(function () {
                    madeit++;
                });
                setTimeout(function () {
                    // resolve promise for success
                    promise.resolve();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                }, 100);
            });
            it('failure', function (done) {
                // attach failure handler
                promise.failure(function () {
                    madeit++;
                });
                setTimeout(function () {
                    // resolve promise for failure
                    promise.reject();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                }, 100);
            });
        });
        describe('but it also can trigger functions on any resolution with the always method such as', function () {
            it('resolve', function (done) {
                // attach always handler
                promise.always(function () {
                    madeit++;
                });
                setTimeout(function () {
                    // resolve promise for failure
                    promise.resolve();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                }, 100);
            });
            it('reject', function (done) {
                // attach always handler
                promise.always(function () {
                    madeit++;
                });
                setTimeout(function () {
                    // reject promise
                    promise.reject();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                }, 100);
            });
        });
    });
});
application.scope().run(function (app, _, factories, $) {
    var BOOLEAN_TRUE = true,
        isObject = _.isObject;
    describe('Ajax', function () {
        var ajax;
        beforeEach(function () {
            ajax = factories.Ajax();
        });
        it('is an object', function () {
            expect(isObject(ajax)).toEqual(BOOLEAN_TRUE);
        });
        it('can accept an object as a first argument', function (done) {
            factories.Ajax({
                url: '/json/reporting.json'
            }).success(function (json) {
                expect(isObject(json)).toEqual(BOOLEAN_TRUE);
                done();
            });
        });
        it('can accept a string as a first argument', function (done) {
            var original, handlerCounter = 0;
            factories.Ajax('/json/reporting.json').handle('status:200', function (json) {
                handlerCounter++;
                original = json;
            }).success(function (json) {
                handlerCounter++;
                expect(original === json).toEqual(BOOLEAN_TRUE);
            }).always(function () {
                handlerCounter++;
                expect(handlerCounter).toEqual(3);
                done();
            });
        });
        describe('can handle', function () {
            it('failures', function (done) {
                var handlerCounter = 0;
                var prom = factories.Ajax().failure(function () {
                    handlerCounter++;
                }).always(function () {
                    handlerCounter++;
                    expect(handlerCounter).toEqual(2);
                    done();
                });
                prom.reject();
            });
            it('errors', function (done) {
                var handlerCounter = 0;
                factories.Ajax('/json/reporting.json').success(function (json) {
                    handlerCounter++;
                    expect(handlerCounter).toEqual(1);
                    throw new Error('some message here');
                }).error(function () {
                    handlerCounter++;
                }).always(function () {
                    handlerCounter++;
                    expect(handlerCounter).toEqual(3);
                    done();
                });
            });
            describe('status codes (more than the ones listed here)', function () {
                it('404', function (done) {
                    var handlerCounter = 0;
                    factories.Ajax('/gibberish/404').handle('status:404', function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter++;
                    }).always(function () {
                        handlerCounter++;
                        expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
                it('500', function (done) {
                    var handlerCounter = 0;
                    factories.Ajax('/gibberish/500').handle('status:500', function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter++;
                    }).always(function () {
                        handlerCounter++;
                        expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
            });
        });
    });
});
application.scope().run(function (app, _, $) {
    var factories = _.factories;
    var registry = _.associator;
    describe('Registry', function () {
        beforeEach(function () {});
        it('is made by the specless object', function () {
            expect(_.isInstance(registry, factories.Associator)).toEqual(true);
        });
        it('is not a collection', function () {
            expect(_.isInstance(registry, factories.Collection)).toEqual(false);
        });
        it('can get any object\'s data', function () {
            expect(registry.get(window)).toEqual({
                dataset: {}
            });
        });
        it('can save data against pointers', function () {
            registry.set(window, {
                some: 'data'
            });
            expect(registry.get(window)).toEqual({
                dataset: {},
                some: 'data'
            });
        });
        it('can also get any group of data that the same type', function () {
            var one = {},
                two = {};
            registry.set(one, {
                one: 1
            });
            registry.set(two, {
                two: 2
            });
            expect(registry.sameType(two)).toEqual({
                data: [{
                    dataset: {},
                    one: 1
                }, {
                    dataset: {},
                    two: 2
                }],
                items: [one, two],
                readData: 1
            });
        });
    });
});
application.scope().run(function (app, _, factories, $) {
    var elementData = _.associator;
    describe('DOMM', function () {
        var divs, $empty = $(),
            $win = $(window),
            $doc = $(document),
            $body = $(document.body),
            handler = function () {
                return true;
            },
            handler2 = function () {
                return false;
            },
            create = function () {
                $con.remove(divs);
                divs = $().count(0, 5, function (item, index, list) {
                    var div = document.createElement('div');
                    div.className = 'one';
                    if (index % 2) {
                        div.className += ' two';
                    } else {
                        div.className += ' not';
                    }
                    list.push(div);
                });
                $con.append(divs);
                return divs;
            },
            $con = _.createElements('div').style({
                height: '100%',
                width: '100%'
            });
        $(document.body).append($con);
        beforeEach(create);
        it('is essentially a collection', function () {
            expect(_.isInstance($empty, factories.DOMM)).toEqual(true);
            expect(_.isInstance($empty, factories.Collection)).toEqual(true);
        });
        it('it knows it\'s own client rect', function () {
            var div = divs.eq(0);
            expect(div.clientRect()).toEqual(_.extend({}, div.index().getBoundingClientRect()));
        });
        it('can show and hide elements', function () {
            expect(divs.hide().map(function (el) {
                if (el.style.display === 'none') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
            expect(divs.show().map(function (el) {
                if (el.style.display === 'block') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
        });
        it('can attach dom elements', function () {
            var div = divs.eq();
            div.append(divs.index(1));
            expect(div.children().index()).toEqual(divs.index(1));
        });
        it('can remove dom elements', function () {
            var div = divs.eq();
            div.append(divs.index(1));
            expect(div.children().index()).toEqual(divs.index(1));
            div.children().remove();
            expect(div.children().length()).toEqual(0);
        });
        describe('except it has some methods that are highly pertinant to DOM manipulation... ergo: DOMM', function () {
            it('can check if its items are windows', function () {
                expect($win.isWindow()).toEqual(true);
                expect($doc.isWindow()).toEqual(false);
                expect($body.isWindow()).toEqual(false);
            });
            it('can check if its items are documents', function () {
                expect($win.isDocument()).toEqual(false);
                expect($doc.isDocument()).toEqual(true);
                expect($body.isDocument()).toEqual(false);
            });
            it('can check if its items are actually elements', function () {
                expect($win.allElements()).toEqual(false);
                expect($doc.allElements()).toEqual(false);
                expect($body.allElements()).toEqual(true);
                expect($('a').allElements()).toEqual(true);
            });
            it('can check if its items are document fragments', function () {
                var frag = document.createDocumentFragment();
                frag.appendChild(document.createElement('div'));
                expect($win.isFragment()).toEqual(false);
                expect($doc.isFragment()).toEqual(false);
                expect($body.isFragment()).toEqual(false);
                expect($('a').isFragment()).toEqual(false);
                expect($(frag).isFragment()).toEqual(true);
            });
        });
        describe('it can filter itself', function () {
            it('by query string matching', function () {
                var newDivs = divs.filter('.two');
                expect(newDivs.length()).toEqual(2);
            });
            it('by filtering against a function', function () {
                var newDivs = divs.filter(function (item, idx) {
                    return ((idx % 3) - 1) === 0;
                });
                expect(newDivs.length()).toEqual(2);
                expect(newDivs.get()).toEqual(divs.get(1));
                expect(newDivs.get(1)).toEqual(divs.get(4));
            });
            it('by passing in an object', function () {
                var newDivs = divs.filter({
                    className: 'one not'
                });
                expect(newDivs.length()).toEqual(3);
            });
            it('can also get the first', function () {
                expect(divs.first().get()).toEqual(divs.get());
            });
            it('and the last element in the list', function () {
                expect(divs.last().get()).toEqual(divs.get(divs.length() - 1));
            });
        });
        describe('it can find it\'s children', function () {
            it('by calling the children method', function () {
                divs.duff(function (div, idx) {
                    var span1 = document.createElement('span');
                    var span2 = document.createElement('span');
                    span1.className = 'span-' + idx;
                    span2.className = 'span-' + (idx * 2);
                    div.appendChild(span1);
                    div.appendChild(span2);
                });
                var kids = divs.children();
                expect(kids.length()).toEqual(10);
                kids.duff(function (kid, idx) {
                    expect(kid.localName).toEqual('span');
                });
                kids = divs.children(1);
                expect(kids.length()).toEqual(5);
                kids = divs.children('.span-2');
                expect(kids.unwrap()).toEqual(divs.children().filter('.span-2').unwrap());
                expect(kids.length()).toEqual(2);
                expect(kids.index() === kids.index(1)).toEqual(false);
            });
            it('by querying the dom elements', function () {
                divs.duff(function (div, idx) {
                    div.innerHTML = '<span></span><img/>';
                });
                var kids = divs.find('img');
                expect(kids.length()).toEqual(5);
                kids.duff(function (kid, idx) {
                    expect(kid.tagName).toEqual('IMG');
                });
            });
        });
        describe('it can also find it\'s parents', function () {
            it('either by counting up', function () {
                var $start = $('.results .failures'),
                    $end = $('.jasmine_html-reporter'),
                    end = $start.parent(2);
                expect(end.index()).toEqual($end.index());
            });
            it('or by finding via selector', function () {
                var $start = $('.results .failures'),
                    $end = $('.jasmine_html-reporter'),
                    end = $start.parent('.jasmine_html-reporter');
                expect(end.index()).toEqual($end.index());
            });
            it('or by passing a function', function () {
                var $start = $('.results .failures'),
                    end = $start.parent(function (el) {
                        return el.tagName === 'BODY';
                    });
                expect(end.index()).toEqual(document.body);
            });
            describe('or by passing a keyword', function () {
                it('like document', function () {
                    var $start = $('.results .failures'),
                        end = $start.parent('document');
                    expect(end.index()).toEqual(document);
                });
                it('or window', function () {
                    var $start = $('.results .failures'),
                        end = $start.parent('window');
                    expect(end.index()).toEqual(window);
                });
            });
        });
        describe('all of this traversing can be undone', function () {
            it('with the end method', function () {
                var $start = $('.results .failures');
                var $next = $start.parent();
                $next = $next.children();
                $next = $next.end();
                expect($next === $start).toEqual(true);
            });
        });
        describe('the domm is also special because it abstracts event listeners for you', function () {
            describe('can add handlers', function () {
                it('one at a time', function () {
                    divs.on('click', handler).duff(function (div, idx) {
                        var data = elementData.get(div);
                        expect(data.events['false'].click[0].fn === handler).toEqual(true);
                    });
                });
                it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler).duff(function (div, idx) {
                        var data = elementData.get(div);
                        _.each(data.handlers, function (_handler, key) {
                            var split = key.split(':');
                            _.duff(data.events[split[0]][split[1]], function (fn, idx) {
                                expect(fn.fn === handler).toEqual(true);
                            });
                        });
                    });
                });
            });
        });
        describe('the domm is also special because it abstracts event listeners for you', function () {
            describe('can add handlers', function () {
                it('one at a time', function () {
                    divs.on('click', handler).duff(function (div, idx) {
                        var data = elementData.get(div);
                        expect(data.events['false'].click[0].fn === handler).toEqual(true);
                    });
                });
                it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler).duff(function (div, idx) {
                        var data = elementData.get(div);
                        _.each(data.handlers, function (_handler, key) {
                            var split = key.split(':');
                            expect(split[0]).toEqual('false');
                            _.duff(data.events[split[0]][split[1]], function (fn, idx) {
                                expect(fn.fn === handler).toEqual(true);
                            });
                        });
                    });
                });
            });
            describe('also capture handlers', function () {
                it('one at a time', function () {
                    divs.on('_click', handler).duff(function (div, idx) {
                        var data = elementData.get(div);
                        expect(data.events['true'].click[0].fn === handler).toEqual(true);
                    });
                });
                it('many at a time', function () {
                    divs.on('_click _mouseover _mouseout', handler).duff(function (div, idx) {
                        var data = elementData.get(div);
                        _.each(data.handlers, function (_handler, key) {
                            var split = key.split(':');
                            expect(split[0]).toEqual('true');
                            _.duff(data.events[split[0]][split[1]], function (fn, idx) {
                                expect(fn.fn === handler).toEqual(true);
                            });
                        });
                    });
                });
            });
            it('will only add a method to the queue once. if a duplicate is passed in, it will be ignored (just like the browser implementation)', function () {
                divs.on('click', handler).on('click', handler).duff(function (div, idx) {
                    var data = elementData.get(div);
                    expect(data.events['false'].click[1]).toEqual(void 0);
                });
            });
            it('once wrappers can also be used with the once method and they can be added the same way as once', function () {
                var isDone = 0,
                    handler = function () {
                        isDone--;
                    };
                divs.once('click', handler);
                $(document.body).append(divs);
                divs.duff(function (div, idx) {
                    isDone++;
                    var data = elementData.get(div);
                    expect(_.isFunction(data.events['false'].click[0].fn)).toEqual(true);
                    $(div).click();
                    data = elementData.get(div);
                    expect(data.events['false'].click[0]).toEqual(void 0);
                });
                divs.remove();
            });
            it('be careful with the once function because they can be added multiple times to the queue, since they use a proxy function, like the one available at _.once', function () {
                divs.once('click', handler).once('click', handler).duff(function (div, idx) {
                    var data = elementData.get(div);
                    expect(_.isFunction(data.events['false'].click[1].fn)).toEqual(true);
                });
            });
        });
        describe('the each function is special because', function () {
            it('it wraps each element in a DOMM object before passing it through your iterator', function () {
                divs.each(function (el, idx) {
                    expect(_.isInstance(el, factories.DOMM)).toEqual(true);
                    expect(el.length()).toEqual(1);
                    expect(divs.index(idx) === el.index());
                });
            });
            it('where the duff and forEach function just gives you the element at each index, just like a collection', function () {
                divs.duff(function (el, idx) {
                    expect(_.isInstance(el, _.DOMM)).toEqual(false);
                });
                divs.forEach(function (el, idx) {
                    expect(_.isInstance(el, _.DOMM)).toEqual(false);
                });
            });
        });
        describe('adding and removing classes is done by string checking instead of the classList to invoke only one reflow', function () {
            it('you can use addClass', function () {
                divs.each(function (div, idx) {
                    expect(div.hasClass('three')).toEqual(false);
                });
                divs.addClass('three');
                divs.each(function (div, idx) {
                    expect(div.hasClass('three')).toEqual(true);
                });
            });
            it('you can use removeClass', function () {
                divs.each(function (div, idx) {
                    expect(div.hasClass('three')).toEqual(false);
                });
                expect(divs.hasClass('three')).toEqual(false);
                divs.addClass('three');
                expect(divs.hasClass('three')).toEqual(true);
            });
            it('you can use hasClass to check if all of the elements has a particular class', function () {
                expect(divs.hasClass('two')).toEqual(false);
                expect(divs.hasClass('one')).toEqual(true);
            });
            it('you can use toggleClass swap classes depending on whether or not they exist on each element', function () {
                divs.each(function (div, idx) {
                    expect(div.hasClass('one')).toEqual(true);
                });
                divs.toggleClass('one');
                divs.each(function (div, idx) {
                    expect(div.hasClass('one')).toEqual(false);
                });
            });
            it('it will also do this for individual elements', function () {
                var list = [],
                    unique = [];
                divs.each(function (div, idx) {
                    var res = div.hasClass('two');
                    list.push(res);
                    _.add(unique, res);
                });
                divs.toggleClass('two');
                divs.each(function (div, idx) {
                    expect(div.hasClass('two')).toEqual(!list[idx]);
                });
                expect(unique.length > 1).toEqual(true);
            });
            it('you can also use changeClass as a shorthand of removeClass and addClass', function () {
                divs.changeClass('one not two', 'three');
                divs.each(function (div, idx) {
                    expect(div.hasClass('one')).toEqual(false);
                    expect(div.hasClass('two')).toEqual(false);
                    expect(div.hasClass('not')).toEqual(false);
                    expect(div.hasClass('three')).toEqual(true);
                });
            });
        });
        describe('there is also a data attributes interface', function () {
            it('where you can add', function () {
                divs.duff(function (div, idx) {
                    expect(div.getAttribute('data-one')).toEqual(null);
                    expect(div.getAttribute('data-two')).toEqual(null);
                });
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    expect(div.getAttribute('data-one')).toEqual('one');
                    expect(div.getAttribute('data-two')).toEqual('two');
                });
            });
            it('remove', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    expect(div.getAttribute('data-one')).toEqual('one');
                    expect(div.getAttribute('data-two')).toEqual('two');
                });
                divs.data({
                    one: false,
                    two: false
                });
                divs.duff(function (div, idx) {
                    expect(div.getAttribute('data-one')).toEqual(null);
                    expect(div.getAttribute('data-two')).toEqual(null);
                });
            });
            it('and update data attributes', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    expect(div.getAttribute('data-one')).toEqual('one');
                    expect(div.getAttribute('data-two')).toEqual('two');
                });
                divs.data({
                    one: {
                        some: 'one'
                    },
                    two: {
                        to: 'love'
                    }
                });
                divs.each(function (div, idx) {
                    expect(div.data('one')).toEqual({
                        some: 'one'
                    });
                    expect(div.data('two')).toEqual({
                        to: 'love'
                    });
                });
            });
        });
        describe('it can also manipulate elements in other ways', function () {
            it('like by manipulating their attributes', function () {
                divs.duff(function (div, idx) {
                    expect(div.getAttribute('tabindex')).toEqual(null);
                });
                divs.attr({
                    tabindex: -1
                });
                divs.each(function (div, idx) {
                    expect(div.attr('tabindex')).toEqual(-1);
                });
            });
            it('or by manipulating their properties', function () {
                divs.duff(function (div, idx) {
                    expect(div.align).toEqual('');
                });
                divs.prop({
                    align: 'left'
                });
                divs.each(function (div, idx) {
                    expect(div.prop('align')).toEqual('left');
                });
            });
        });
    });
});
// Specless.run(function (specless, _, extendFrom, factories, $) {
//     describe('View', function () {
//         var blank, view, $con,
//             ExtendedView = extendFrom.View({
//                 hovered: function () {},
//                 events: {
//                     'event1': function () {}
//                 },
//                 elementEvents: {
//                     click: function () {
//                         clicked = 1;
//                     },
//                     mouseover: 'hovered'
//                 }
//             }),
//             create = function () {
//                 clicked = blank;
//                 $con = _.makeEl('div').attr({
//                     id: 'view-test'
//                 });
//                 view = new ExtendedView($con);
//                 $(document.body).append($con);
//             },
//             duff = _.duff;
//         beforeEach(create);
//         afterEach(function () {
//             $con.remove();
//         });
//         it('has a domm element associated with it', function () {
//             expect(_.is(view.el, _.DOMM)).toEqual(true);
//         });
//         it('even if there\'s no element', function () {
//             var view = _.View();
//             expect(_.is(view.el, _.DOMM)).toEqual(true);
//             expect(view.el.length()).toEqual(0);
//         });
//         describe('to define an element to be associated with it, pass it one', function () {
//             it('either through the domm wrapper', function () {
//                 var view = _.View($('body'));
//                 expect(view.el.length()).toEqual(1);
//             });
//             it('or as a regular dom node', function () {
//                 var view = _.View(document.body);
//                 expect(view.el.length()).toEqual(1);
//             });
//         });
//         it('views are most helpful as a building block', function () {
//             var extended = extendFrom.View({});
//             expect(extended === factories.View).toEqual(false);
//             expect(new extended() instanceof factories.View).toEqual(true);
//         });
//         describe('views add events to elements from an object called elementEvents', function () {
//             it('by default, none are added', function () {
//                 var view = _.View(_.makeEl('div'));
//                 var data = _.associator.get(view.el.get());
//                 expect(data.events).toEqual(void 0);
//             });
//             it('but a quick change to a new constructor\'s prototype will result in an opulence of event handlers', function () {
//                 var data = _.associator.get(view.el.get());
//                 expect(data.events).not.toEqual(blank);
//                 expect(clicked).toEqual(blank);
//                 view.el.click();
//                 expect(clicked).toEqual(1);
//             });
//             it('preparses the event list, and generates a namespace, so it can take the handlers off later', function () {
//                 var data = _.associator.get(view.el.get());
//                 duff(data.events['false'].click, function (handler) {
//                     expect(handler.namespace.indexOf('delegateEvents')).not.toEqual(-1);
//                 });
//             });
//             it('can also take handlers off', function () {
//                 var handler = function () {},
//                     data = _.associator.get(view.el.get()),
//                     clicks = data.events['false'].click;
//                 view.undelegateEvents();
//                 expect(clicks.length).toEqual(0);
//                 view.delegate('click', handler);
//                 expect(clicks.length).toEqual(1);
//                 view.undelegateEvents();
//                 expect(clicks.length).toEqual(0);
//             });
//             it('will not take off handlers that it did not delegate with it\'s own namespace', function () {
//                 var handler = function () {},
//                     data = _.associator.get(view.el.get()),
//                     clicks = data.events['false'].click;
//                 view.undelegateEvents();
//                 expect(clicks.length).toEqual(0);
//                 view.el.on('click', handler);
//                 expect(clicks.length).toEqual(1);
//                 view.undelegateEvents();
//                 // will not take handlers off it it did not put it on
//                 expect(clicks.length).toEqual(1);
//                 expect(clicks[0].fn === handler).toEqual(true);
//             });
//         });
//         describe('it can also add delegated events for ui elements', function () {
//             it('every view has a ui hash', function () {
//                 expect(_.has(view, 'ui')).toEqual(true);
//             });
//             it('by default, it\'s empty', function () {
//                 expect(view.ui).toEqual({});
//             });
//             it('but it can be filled with ui DOMM references', function () {
//                 var Extendor = extendFrom.View({
//                     ui: {
//                         list: 'ul',
//                         items: 'li'
//                     }
//                 });
//                 var extendor = new Extendor(_.makeEl('div').append(_.makeEl('ul').append(_.makeEl('li'))));
//                 _.each(extendor.ui, function (domm, key) {
//                     expect(_.is(domm, _.DOMM)).toEqual(true);
//                 });
//             });
//         });
//         it('the View object also has a relative $ implementation to allow you to find with the $ as the top most element, and only look down', function () {
//             var li = _.makeEl('li');
//             var div = _.makeEl('div').append(_.makeEl('ul').append(li));
//             $(document.body).append(div);
//             var view = _.View(div);
//             expect(view.$('li').get() === li.get()).toEqual(true);
//             view.destroy();
//         });
//         it('can also destroy itself', function () {
//             var count = 0;
//             $(document.body).append(view.el);
//             view.on('cleeek', function () {});
//             _.each(view._events, function (arr) {
//                 count += arr.length;
//             });
//             expect(count).not.toEqual(0);
//             view.destroy();
//             count = 0;
//             expect(view.el.parent().length()).toEqual(0);
//             _.each(view._events, function (arr, id) {
//                 count += arr.length;
//             });
//             expect(count).toEqual(0);
//         });
//     });
// });
application.scope().run(function (app, _, factories, $) {
    describe('Buster', function () {
        //
    });
});
//# sourceMappingURL=spec.js.map
