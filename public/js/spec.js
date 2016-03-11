application.scope().run(function (app, _) {
    var factories = _.factories;
    describe('var _ = app._;', function () {
        var baseString = 'my string is a great string',
            specialString = 'here&are*a ()lot o~/f special_+characters',
            makeArray = function () {
                return baseString.split(' ');
            };
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
                expect(_.push(baseString.split(' '), ['string'])).toEqual(baseString.split(' ').push('string'));
            });
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
                    newModel = factories.Model();
                expect(_.isInstance(obj, Object)).toEqual(true);
                expect(_.isInstance(newModel, factories.Model)).toEqual(true);
                expect(_.isInstance(newModel, factories.Model)).toEqual(true);
                expect(_.isInstance(newModel, factories.Collection)).toEqual(false);
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
            it('_.duff', function () {
                var test1 = [1, 2, 3, 4];
                var count = 0;
                expect(count).toEqual(0);
                _.duff(test1, function (item) {
                    count += item;
                });
                expect(count).toEqual(10);
                _.duff({
                    one: 1,
                    two: 2,
                    three: 3,
                    four: 4
                }, function (item) {
                    count += item;
                });
                expect(count).toEqual(10);
            });
            it('_.toBoolean', function () {
                expect(_.toBoolean('truth')).toEqual('truth');
                expect(_.toBoolean('true')).toEqual(true);
                expect(_.toBoolean('falsey')).toEqual('falsey');
                expect(_.toBoolean('false')).toEqual(false);
                expect(_.toBoolean({})).toEqual({});
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
                expect(_.unshift(make(), [0])).toEqual(make().unshift(0));
            });
            // write async test
            it('_.fetch', function () {
                var img = _.fetch("data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA");
                expect(img instanceof Image).toEqual(true);
            });
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
                var box = factories.Model();
                box.idAttribute = 'something';
                expect(_.protoProp(box, 'idAttribute')).toEqual(factories.Model.constructor.prototype.idAttribute);
            });
            it('_.roundFloat', function () {
                expect(_.roundFloat(1.5489909, 3)).toEqual(1.548);
            });
        });
    });
});
var _ = application.scope()._;
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
application.scope().run(function (app, _, factories) {
    describe('Collection', function () {
        var collection, numberCollection, complexCollection, evenNumberList;
        beforeEach(function () {
            collection = factories.Collection();
            numberCollection = factories.Collection([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            complexCollection = factories.Collection([factories.Model(), factories.Model({
                one: 1,
                two: 2,
                three: 3
            })]);
            evenNumberList = [0, 2, 4, 6, 8];
        });
        it('extends from factories.Extendable', function () {
            expect(_.isInstance(collection, factories.Extendable)).toEqual(true);
        });
        it('is not an array like object', function () {
            expect(_.isArrayLike(collection)).toEqual(false);
        });
        it('knows it\'s length', function () {
            expect(numberCollection.length()).toEqual(10);
        });
        it('can give you all of it\'s values at once', function () {
            expect(collection.unwrap()).toEqual(collection.directive('list').items);
        });
        it('or one at a time', function () {
            numberCollection.duff(function (item, idx) {
                expect(numberCollection.index(idx)).toEqual(numberCollection.directive('list').items[idx]);
            });
        });
        it('as well as in reverse order', function () {
            var list = [];
            numberCollection.duffRight(function (item, idx) {
                expect(numberCollection.index(idx)).toEqual(numberCollection.directive('list').items[idx]);
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
        // it('can also reverse itself momentarily', function () {
        //     var test = [];
        //     numberCollection.mambo(function (list) {
        //         list.duff(function (val) {
        //             test.push(val);
        //         });
        //     });
        //     expect(test).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        // });
        describe('but other methods need arrays... Collections also have a bunch of methods that they stole from the _ object such as:', function () {
            // it('addAll', function () {
            //     expect(numberCollection.addAll([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]);
            // });
            // it('removeAll', function () {
            //     expect(numberCollection.removeAll([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).unwrap()).toEqual([1, 3, 5, 7, 9]);
            // });
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
                expect(numberCollection.count(function (item, idx, list) {
                    if (item === null) {
                        list.push(idx);
                    }
                }, 10, 20).length()).toEqual(20);
            });
            it('countTo', function () {
                expect(numberCollection.countTo(function (item, idx, list) {
                    if (item === null) {
                        list.push(idx);
                    }
                }, 20).length()).toEqual(20);
            });
            it('countFrom', function () {
                var count = 0;
                numberCollection.countFrom(function (item, idx, list) {
                    count++;
                }, 6);
                expect(count).toEqual(4);
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
    describe('SortedCollection', function () {
        var numberCollection, SortedCollection = factories.SortedCollection;
        beforeEach(function () {
            collection = SortedCollection();
            numberCollection = SortedCollection([4, 5, 3, 7, 8, 6, 2, 0, 1, 9]);
            complexCollection = SortedCollection([factories.Model(), factories.Model({
                one: 1,
                two: 2,
                three: 3
            })]);
            evenNumberList = [0, 2, 4, 6, 8];
        });
        it('should be sorted at the beginning', function () {
            expect(numberCollection.toJSON()).toEqual(numberCollection.sort().toJSON());
        });
        it('can get values without having to iterate over everything', function () {
            numberCollection.indexOf = _.noop;
            expect(numberCollection.get('id', 8)).toEqual(8);
        });
        it('can add values in the correct place', function () {
            var sorted = SortedCollection(evenNumberList);
            sorted.add(1);
            sorted.add(5);
            sorted.add(3);
            expect(sorted.index(0)).toEqual(0);
            expect(sorted.index(1)).toEqual(1);
            expect(sorted.index(2)).toEqual(2);
            expect(sorted.index(3)).toEqual(3);
            expect(sorted.index(4)).toEqual(4);
            expect(sorted.index(5)).toEqual(5);
        });
        it('can remove values from the correct place', function () {
            var sorted = SortedCollection(evenNumberList);
            sorted.remove(4);
            sorted.remove(2);
            expect(sorted.index(0)).toEqual(0);
            expect(sorted.index(1)).toEqual(6);
            expect(sorted.index(2)).toEqual(8);
        });
    });
});
application.scope().run(function (app, _, factories) {
    describe('Events', function () {
        var blank, box,
            Model = factories.Model,
            handler = function () {
                count++;
            },
            handler2 = function () {
                count--;
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
            count = 0;
            box = Model({
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
        describe('Models can have events', function () {
            var box2;
            describe('and can create events for itself', function () {
                it('either one at a time', function () {
                    box.on('evnt', handler);
                    expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    expect(count).toEqual(2);
                });
                it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    expect(count).toEqual(6);
                });
            });
            describe('and can remove events from itself', function () {
                it('either one at a time', function () {
                    box.on('evnt', handler);
                    expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    expect(count).toEqual(2);
                    box.off('evnt', handler);
                    expect(count).toEqual(2);
                    box.dispatchEvent('evnt');
                    expect(count).toEqual(2);
                });
                it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    expect(count).toEqual(6);
                    box.off('evnt eventer mikesevent', handler);
                });
            });
        });
        describe('Models can also listen to other, similar objects', function () {
            var box2;
            beforeEach(function () {
                box2 = Model();
            });
            describe('by using the listenTo method', function () {
                it('either one at a time', function () {
                    box.listenTo(box2, 'evnt', handler);
                    expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    expect(count).toEqual(2);
                });
                it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                    box2.dispatchEvent('eventer');
                    expect(count).toEqual(2);
                    box2.dispatchEvent('mikesevent');
                    expect(count).toEqual(3);
                });
            });
            it('you can even take a shortcut and dispatch an event one at a time using dispatchEvent', function () {
                box.on('handle', handler);
                expect(count).toEqual(0);
                box.dispatchEvent('handle');
                expect(count).toEqual(1);
            });
            it('or many at a time using dispatchEvents', function () {
                box.on('handle handler beep boop blob', handler);
                expect(count).toEqual(0);
                box.dispatchEvents('handle handler beep boop blob');
                expect(count).toEqual(5);
            });
            describe('and can stop listening by using the stopListening method', function () {
                it('can remove events one at a time', function () {
                    var listenObj;
                    box.listenTo(box2, 'evnt', handler);
                    expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                    box.stopListening(box2, 'evnt', handler);
                    expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                });
                it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    box.listenTo(box2, 'evnt eventer mikesevent', function () {
                        count += this === box;
                    });
                    expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    expect(count).toEqual(6);
                    box.stopListening(box2, 'evnt eventer mikesevent', handler);
                    expect(count).toEqual(6);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    expect(count).toEqual(9);
                });
            });
            describe('listenTo', function () {
                it('should have an equivalent context', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += (this === box);
                    });
                    expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    expect(count).toEqual(2);
                });
                it('can be overridden with an extra argument', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += this === box2;
                    }, box2);
                    expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    expect(count).toEqual(2);
                });
            });
            describe('watch directive', function () {
                it('can listenTo the object that it belongs to', function () {
                    box.watch('here', 'there', function () {
                        count++;
                    });
                    expect(count).toEqual(0);
                    box.set('here', 1);
                    expect(count).toEqual(0);
                    box.set('here', 'there');
                    expect(count).toEqual(1);
                    box.set('here', 'where');
                    expect(count).toEqual(1);
                    box.set('here', 'there');
                    expect(count).toEqual(2);
                });
            });
            describe('when directive', function () {
                it('gives an api synonymous with english', function () {
                    box.when('here').is('there').and('when').is('now').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('here', 'nothere');
                    expect(count).toEqual(-1);
                    box.set('when', 'later');
                    expect(count).toEqual(-1);
                    box.set('when', 'now');
                    expect(count).toEqual(-1);
                    box.set('here', 'there');
                    expect(count).toEqual(0);
                });
                it('allows for negatives to be used like isNot and isnt', function () {
                    box.when('one').isNot(2).and('up').isnt('down').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('up', 'down');
                    expect(count).toEqual(-1);
                    box.set('one', 2);
                    expect(count).toEqual(-1);
                    box.set('one', 1);
                    expect(count).toEqual(-1);
                    box.set('up', 'side');
                    expect(count).toEqual(0);
                });
                it('can compare numbers using basic operators and negation', function () {
                    box.when('one').isGreaterThan(5).and('ten').isLessThan(4).and('phone').isNotLessThan(5).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('phone', 10);
                    expect(count).toEqual(-1);
                    box.set('one', 6);
                    expect(count).toEqual(-1);
                    box.set('ten', 5);
                    expect(count).toEqual(-1);
                    box.set('ten', 2);
                    expect(count).toEqual(0);
                });
                it('can compare string values using basic operators and negation', function () {
                    box.when('one').isGreaterThan('a').and('ten').isLessThan('b').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('one', '0');
                    expect(count).toEqual(-1);
                    box.set('ten', 'beach');
                    expect(count).toEqual(-1);
                    box.set('ten', 'aardvark');
                    expect(count).toEqual(-1);
                    box.set('one', 'ten');
                    expect(count).toEqual(0);
                });
                it('can also handle custom functions', function () {
                    box.when('one').is(function () {
                        return box.get('one') > 5;
                    }).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('one', 10);
                    expect(count).toEqual(1);
                    box.set('one', 3);
                    expect(count).toEqual(0);
                });
                it('can also make "groups" using the or method', function () {
                    var sequence = box.when('one').is(1).or('truth').is(true).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('one', 2);
                    expect(count).toEqual(-1);
                    box.set('one', 0);
                    expect(count).toEqual(-1);
                    box.set('truth', true);
                    expect(count).toEqual(0);
                    box.set('one', 1);
                    expect(count).toEqual(0);
                    box.set('truth', false);
                    expect(count).toEqual(0);
                });
                it('can also have multiple watchers on a particular instance that run independently', function () {
                    var last;
                    var sequence = box.when('five').isLessThan(10).then(function () {
                        count++;
                        last = 1;
                    });
                    var sequence2 = box.when('here').is('there').then(function () {
                        count++;
                        last = 2;
                    });
                    expect(count).toEqual(0);
                    expect(last).toEqual(void 0);
                    box.set('five', 3);
                    expect(count).toEqual(1);
                    expect(last).toEqual(1);
                    box.set('here', 'there');
                    expect(count).toEqual(2);
                    expect(last).toEqual(2);
                });
            });
        });
    });
    // var box = factories.Model();
    // var collection = [];
    // var collection2 = [];
    // _.count(collection, function (item, index, list) {
    //     list.push(0);
    // }, null, 0, 100000);
    // var timestamp = _.now();
    // _.duff(collection, function (item) {
    //     collection2.push(factories.Model());
    // });
    // var div = document.createElement('div');
    // div.innerHTML = _.now() - timestamp;
    // console.log(collection2);
    // document.body.insertBefore(div, document.body.children[0]);
});
application.scope().run(function (app, _, factories) {
    // var factories = _.factories;
    describe('Model', function () {
        var blank, count, box,
            Model = factories.Model,
            handler = function () {
                return !0;
            },
            handler2 = function () {
                return !1;
            },
            counter = function () {
                count++;
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
            count = 0;
            box = Model({
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
        it('extends from factories.Extendable', function () {
            expect(factories.Extendable.isInstance(box)).toEqual(true);
        });
        describe('Models are always created with...', function () {
            var box2 = Model();
            it('a unique id', function () {
                expect(_.has(box2, 'id')).toEqual(true);
            });
            it('even if there is not one given', function () {
                var box3 = Model({
                    id: 5
                });
                expect(box2.id !== void 0).toEqual(true);
                expect(box3.id === 5).toEqual(true);
            });
            // it('an empty _previousAttributes hash', function () {
            //     expect(_.has(box2, '_previousAttributes')).toEqual(true);
            //     expect(_.isObject(box2._previousAttributes)).toEqual(true);
            //     expect(_.isEmpty(box2._previousAttributes)).toEqual(true);
            // });
            // it('a collection for children', function () {
            //     expect(_.has(box2, 'children')).toEqual(true);
            //     expect(factories.Collection.isInstance(box2.directive('children'))).toEqual(true);
            //     expect(box2.directive('children').length()).toEqual(0);
            // });
            // it('and an attributes object', function () {
            //     expect(_.has(box2, 'attributes')).toEqual(true);
            //     expect(_.isObject(box2.directive('data').current)).toEqual(true);
            // });
        });
        describe('you can set properties on the box you\'re handling with the set method', function () {
            var box = Model(),
                attrs = box.directive('data');
            beforeEach(function () {
                box = Model({
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
                expect(box.get('ten')).toEqual(10);
            });
            it('you can modify existing properties', function () {
                expect(box.get('one')).toEqual(1);
                box.set({
                    one: 2,
                    two: 3,
                    three: 4
                });
                expect(box.get('one')).toEqual(2);
            });
            it('and you can remove properties by using the unset method', function () {
                var box = Model();
                expect(box.get('one')).toEqual(void 0);
                box.set({
                    one: 1
                });
                expect(box.get('one')).toEqual(1);
                box.unset('one');
                expect(box.get('one')).toEqual(void 0);
            });
            // it('or remove a bunch of properties by passing in a space separated list to the unset method', function () {
            //     expect(box.get('one')).toEqual(1);
            //     expect(box.get('three')).toEqual(3);
            //     expect(box.get('five')).toEqual(5);
            //     box.unset('one three five');
            //     expect(box.get('one')).toEqual(void 0);
            //     expect(box.get('three')).toEqual(void 0);
            //     expect(box.get('five')).toEqual(void 0);
            // });
        });
        // pass to the on, once, off, listenTo, listenToOnce, and stopListening functions
        describe('there are super special characters that you can use for terseness', function () {
            var count = 0,
                handler = function () {
                    count++;
                };
            beforeEach(function () {
                box2 = Model();
                count = 0;
            });
        });
        describe('Models also trigger a variety of events any time the set method changes the attributes object', function () {
            var fired;
            beforeEach(function () {
                fired = 0;
            });
            it('such as the change event', function () {
                expect(fired).toEqual(0);
                box.on('change', function () {
                    fired = 1;
                });
                expect(fired).toEqual(0);
                box.set({
                    here: 'there'
                });
                expect(fired).toEqual(1);
            });
            it('and the alter event', function () {
                expect(fired).toEqual(0);
                box.on('change', function () {
                    fired = 1;
                });
                expect(fired).toEqual(0);
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
                expect(fired).toEqual(0);
                box.on('change:one change:two change:three', function () {
                    fired++;
                });
                expect(fired).toEqual(0);
                box.set({
                    one: 9,
                    two: 8,
                    three: 7
                });
                expect(fired).toEqual(3);
            });
        });
        describe('but beyond events and simple hashes, Models are able to manage themselves fairly well', function () {
            it('they can get properties from the attributes object with the get method', function () {
                expect(box.get('one')).toEqual(1);
            });
            it('they can tell you if it has a property with the has method', function () {
                expect(box.has('one')).toEqual(true);
            });
            it('they can clone it\'s attributes by using the toJSON method', function () {
                var clone = box.toJSON();
                expect(clone).toEqual(box.directive('data').current);
                expect(clone === box.directive('data').current).toEqual(false);
            });
            it('they can clone children into an array', function () {
                var clone;
                box.add([factories.Model(), factories.Model()]);
                clone = box.directive('children').toJSON();
                expect(clone).toEqual([{}, {}]);
            });
            it('they can stringify themselves', function () {
                box = factories.Model({
                    some: 'thing'
                });
                expect(box.toString()).toEqual(JSON.stringify({
                    some: 'thing'
                }));
            });
            it('they can stringify their children', function () {
                box = factories.Model();
                box.add(data.children);
                expect(box.directive('children').toString()).toEqual(JSON.stringify(data.children));
            });
        });
        describe('Models can register other objects against a key hash as well', function () {
            it('it can register', function () {
                var data = {
                    myObj: 1
                };
                expect(box.directive('children').get('id', 'key')).toEqual(void 0);
                box.directive('children').register('id', 'key', data);
                expect(box.directive('children').get('id', 'key')).toEqual(data);
            });
            it('and retreive information', function () {
                var data = {
                    myObj: 1
                };
                expect(box.directive('children').get('id', 'key')).toEqual(void 0);
                box.directive('children').register('id', 'key', data);
                expect(box.directive('children').get('id', 'key') === data).toEqual(true);
            });
        });
        describe('boxes can have children', function () {
            it('you can add one at a time', function () {
                expect(box.directive('children').length()).toEqual(0);
                box.add({
                    isChild: !0
                });
                expect(box.directive('children').length()).toEqual(1);
            });
            it('or many at once', function () {
                expect(box.directive('children').length()).toEqual(0);
                box.add([{
                    isChild: !0
                }, {
                    isChild: 'maybe'
                }, {
                    isChild: 'may'
                }]);
                expect(box.directive('children').length()).toEqual(3);
            });
            it('you can also remove them one at a time', function () {
                box = factories.Model();
                box.add(data.children);
                expect(box.directive('children').length()).toEqual(2);
            });
            it('or many at the same time', function () {
                box = factories.Model();
                var children = box.directive('children');
                expect(children.length()).toEqual(0);
                box.add([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]);
                expect(children.length()).toEqual(4);
                box.remove([children.index(1), children.index(3)]);
                expect(children.length()).toEqual(2);
            });
        });
        describe('they can', function () {
            it('destroy themselves', function () {
                box = factories.Model();
                box.add([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]);
                var destroyer = box.directive('children').index(2);
                expect(box.directive('children').get('cid', destroyer.cid) === destroyer).toEqual(true);
                expect(box.directive('children').get('id', destroyer.id) === destroyer).toEqual(true);
                destroyer.destroy();
                expect(box.directive('children').get('cid', destroyer.cid)).toEqual(void 0);
                expect(box.directive('children').get('id', destroyer.id)).toEqual(void 0);
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
                expect(box.directive('children').map(function (model) {
                    return model.get('two');
                }).unwrap()).toEqual([1, 2, 8]);
                box.comparator = '!two';
                box.sort();
                expect(box.directive('children').map(function (model) {
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
                expect(counter).toEqual(0);
                box.directive('children').results('dispatchEvent', 'beep');
                expect(counter).toEqual(8);
                box.directive('children').results('dispatchEvent', 'boop');
                expect(counter).toEqual(4);
            });
            it('set up events on their parents', function () {
                var count = 0;
                Model.constructor.prototype.parentEvents = {
                    beep: function () {
                        count++;
                    }
                };
                box.add([{}, {}, {}, {}]);
                box.dispatchEvent('beep');
                expect(count).toEqual(4);
                delete Model.constructor.prototype.parentEvents;
            });
        });
        describe('boxes can "destroy" themselves', function () {
            it('their events will persist until they decide to reset their own events', function () {
                box.on({
                    event1: counter,
                    event2: counter
                });
                expect(count).toEqual(0);
                box.dispatchEvent('event1');
                expect(count).toEqual(1);
                box.dispatchEvent('event2');
                expect(count).toEqual(2);
                box.destroy();
                expect(count).toEqual(2);
                box.dispatchEvent('event1');
                expect(count).toEqual(3);
                box.directive('eventManager').reset();
                expect(count).toEqual(3);
                box.dispatchEvent('event2');
                expect(count).toEqual(3);
            });
            it('conversely, if the box has listening objects, it will remove it\'s handlers from other objects', function () {
                var box2 = factories.Model();
                box.listenTo(box2, {
                    event1: counter,
                    event2: counter
                });
                expect(count).toEqual(0);
                box2.dispatchEvent('event1');
                expect(count).toEqual(1);
                box2.dispatchEvent('event2');
                expect(count).toEqual(2);
                box.destroy();
                expect(count).toEqual(2);
                box2.dispatchEvent('event1');
                expect(count).toEqual(2);
                box2.dispatchEvent('event2');
                expect(count).toEqual(2);
            });
        });
        describe('there is also an alternative to the on api called the watch api', function () {
            it('it can attach event listeners', function () {
                var count = 0;
                box.watch('there', 'there', function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box.set('there', 'here');
                expect(count).toEqual(0);
                box.set('there', 'there');
                expect(count).toEqual(1);
                box.set('there', 'here');
                expect(count).toEqual(1);
                box.set('there', 'there');
                expect(count).toEqual(2);
            });
            it('and watch variables dynamically', function () {
                var half = -1,
                    count = 0;
                box.watch('there', function (e) {
                    half++;
                    if (half > count) {
                        half--;
                        return true;
                    }
                }, function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box.set('there', 'here');
                expect(count).toEqual(0);
                box.set('there', 'there');
                expect(count).toEqual(1);
                box.set('there', 'here');
                expect(count).toEqual(1);
                box.set('there', 'there');
                expect(count).toEqual(2);
            });
            it('it does not have a context in the first argument', function () {
                var count = 0;
                box.watch('there', function (e) {
                    return e.origin === box && this !== box;
                }, function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box.set('there', 'here');
                expect(count).toEqual(1);
                box.set('there', 'there');
                expect(count).toEqual(2);
            });
            it('it does can attach listeners using the once api', function () {
                var count = 0;
                box.watchOnce('there', 'there', function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box.set('there', 'here');
                expect(count).toEqual(0);
                box.set('there', 'there');
                expect(count).toEqual(1);
                box.set('there', 'here');
                expect(count).toEqual(1);
                box.set('there', 'there');
                expect(count).toEqual(1);
            });
            it('and listeners on other objects with the watchOther api', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOther(box2, 'there', function (e) {
                    count++;
                    return e.target === box && this !== box;
                }, function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box2.set('there', 'here');
                expect(count).toEqual(1);
                box2.set('there', 'there');
                expect(count).toEqual(2);
                box2.set('there', 'here');
                expect(count).toEqual(3);
                box2.set('there', 'there');
                expect(count).toEqual(4);
            });
            it('and listeners on other objects with the watchOther api', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOtherOnce(box2, 'there', 'there', function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box2.set('there', 'there');
                expect(count).toEqual(1);
                box2.set('there', 'here');
                expect(count).toEqual(1);
            });
            it('the once handler will only take itself off when it succeeds', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOtherOnce(box2, 'there', 'there', function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box2.set('there', 'here');
                expect(count).toEqual(0);
                box2.set('there', 'there');
                expect(count).toEqual(1);
                box2.set('there', 'here');
                expect(count).toEqual(1);
                box2.set('there', 'there');
                expect(count).toEqual(1);
            });
        });
    });
});
application.scope().run(function (app, _, factories) {
    describe('Promise', function () {
        var madeit, promise, handler = function () {
            madeit++;
        };
        beforeEach(function () {
            madeit = 0;
            promise = factories.Promise();
        });
        it('allows for async resolution of state', function () {
            expect(_.isObject(promise)).toEqual(true);
            promise.always(handler);
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
                promise.success(handler);
                setTimeout(function () {
                    // resolve promise for success
                    promise.resolve();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                });
            });
            it('failure', function (done) {
                // attach failure handler
                promise.failure(handler);
                setTimeout(function () {
                    // resolve promise for failure
                    promise.reject();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                });
            });
        });
        describe('but it also can trigger functions on any resolution with the always method such as', function () {
            it('resolve', function (done) {
                // attach always handler
                promise.success(handler);
                promise.always(handler);
                setTimeout(function () {
                    // resolve promise for failure
                    promise.resolve();
                    // expect madeit to increase
                    expect(madeit).toEqual(2);
                    // let jasmine know we're all good
                    done();
                });
                expect(madeit).toEqual(0);
            });
            it('reject', function (done) {
                // attach always handler
                promise.failure(handler);
                promise.always(handler);
                setTimeout(function () {
                    // reject promise
                    promise.reject();
                    // expect madeit to increase
                    expect(madeit).toEqual(2);
                    // let jasmine know we're all good
                    done();
                });
                expect(madeit).toEqual(0);
            });
        });
        describe('creates a tree of dependencies', function () {
            it('always is a nonstring (so it terminates)', function () {
                var allstates = promise.allStates();
                expect(!_.isString(allstates.always)).toEqual(true);
            });
            it('success is set to always', function () {
                var allstates = promise.allStates();
                expect(allstates.success).toEqual('always');
            });
            it('failure is set to always', function () {
                var allstates = promise.allStates();
                expect(allstates.failure).toEqual('always');
            });
            it('error is set to failure', function () {
                var allstates = promise.allStates();
                expect(allstates.error).toEqual('failure');
            });
        });
    });
});
application.scope().run(function (app, _, factories) {
    var registry = factories.Associator();
    describe('Registry', function () {
        beforeEach(function () {});
        it('is made by the specless object', function () {
            expect(_.isInstance(registry, factories.Associator)).toEqual(true);
        });
        it('is not a collection', function () {
            expect(_.isInstance(registry, factories.Collection)).toEqual(false);
        });
        it('can save data against pointers', function () {
            registry.set(window, {
                some: 'data'
            });
            expect(registry.get(window).some).toEqual('data');
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
            expect(_.keys(registry.sameType(two).__elid__).length).toEqual(2);
        });
    });
});
application.scope().run(function (app, _, factories) {
    var BOOLEAN_TRUE = true,
        isObject = _.isObject;
    describe('Ajax', function () {
        var ajax, allstates;
        beforeEach(function () {
            ajax = factories.Ajax();
            allstates = ajax.allStates();
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
                it('200', function (done) {
                    var handlerCounter = 0;
                    factories.Ajax('/gibberish/200').handle('status:200', function () {
                        handlerCounter++;
                    }).success(function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter--;
                    }).always(function () {
                        handlerCounter++;
                        expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
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
        describe('status codes are used as a layer over success and failure', function () {
            it('200 is success', function () {
                expect(allstates['status:200']).toEqual('success');
            });
            it('202 is success', function () {
                expect(allstates['status:202']).toEqual('success');
            });
            it('205 is success', function () {
                expect(allstates['status:205']).toEqual('success');
            });
            it('302 is success', function () {
                expect(allstates['status:302']).toEqual('success');
            });
            it('304 is success', function () {
                expect(allstates['status:304']).toEqual('success');
            });
            it('400 is failure', function () {
                expect(allstates['status:400']).toEqual('failure');
            });
            it('401 is failure', function () {
                expect(allstates['status:401']).toEqual('failure');
            });
            it('403 is failure', function () {
                expect(allstates['status:403']).toEqual('failure');
            });
            it('404 is failure', function () {
                expect(allstates['status:404']).toEqual('failure');
            });
            it('405 is failure', function () {
                expect(allstates['status:405']).toEqual('failure');
            });
            it('406 is failure', function () {
                expect(allstates['status:406']).toEqual('failure');
            });
            it('500 is failure', function () {
                expect(allstates['status:500']).toEqual('failure');
            });
            it('502 is failure', function () {
                expect(allstates['status:502']).toEqual('failure');
            });
            it('505 is failure', function () {
                expect(allstates['status:505']).toEqual('failure');
            });
            it('511 is failure', function () {
                expect(allstates['status:511']).toEqual('failure');
            });
        });
    });
});
application.scope().run(function (app, _, factories) {
    describe('Modules', function () {
        var level = app.module('level');
        var lower = app.module('level.lower');
        var lowered = app.module('level.lower.lowered');
        it('can have children', function () {
            expect(lower.parent === level).toEqual(true);
            expect(lower === lowered.parent).toEqual(true);
        });
        it('can access it\'s children through the exact same api', function () {
            expect(lower.module('lowered') === lowered).toEqual(true);
            expect(lower === level.module('lower')).toEqual(true);
        });
        it('can be initialized after it is created', function () {
            var count = 0;
            app.module('level.lower', function () {
                count++;
            });
            expect(count).toEqual(1);
        });
        it('passes itself into it\'s initializing functions', function () {
            var count = 0;
            app.module('lower', function (module, app_, _, factories) {
                count = 1;
                expect(module).toEqual(app.module('lower'));
                expect(app_).toEqual(app);
                expect(_).toEqual(app._);
                expect(factories).toEqual(_.factories);
            });
            expect(count).toEqual(1);
        });
        it('can have multiple generation handlers', function () {
            var count = 0;
            app.module('level', function () {
                count++;
            });
            expect(count).toEqual(1);
            app.module('level', function () {
                count += 2;
            });
            expect(count).toEqual(3);
        });
        it('can have exports (can hold data)', function () {
            level.exports({
                one: 1,
                two: 2
            });
            expect(level.get('exports').one).toEqual(1);
            expect(level.get('exports').two).toEqual(2);
        });
        it('which is like giving public data', function () {
            var mod = app.module('newmodule', function () {
                this.exports({
                    here: 'there'
                });
            });
            expect(app.require('newmodule').here).toEqual('there');
            expect(function () {
                app.require('somenonexistantmodule');
            }).toThrow();
        });
    });
});
application.scope().run(function (app, _, factories) {
    var elementData = _.associator;
    describe('DOMM', function () {
        var divs, count, $empty = $(),
            $win = $(window),
            $doc = $(document),
            $body = $(document.body),
            handler = function () {
                // return true;
                count++;
            },
            handler2 = function () {
                return false;
            },
            create = function () {
                count = 0;
                var _divs = divs && divs.remove();
                divs = $().count(function (item, index) {
                    var div = $.createElement('div');
                    var className = 'one';
                    if (index % 2) {
                        className += ' two';
                    } else {
                        className += ' not';
                    }
                    div.addClass(className);
                    this.push(div);
                }, 0, 5);
                $con.append(divs);
                return divs;
            },
            $con = $.createElement('div').style({
                height: '100%',
                width: '100%'
            });
        $(document.body).append($con);
        beforeEach(create);
        afterEach(function () {
            divs.destroy();
        });
        it('is essentially a collection', function () {
            expect(_.isInstance($empty, factories.DOMM)).toEqual(true);
            expect(_.isInstance($empty, factories.Collection)).toEqual(true);
        });
        it('it knows it\'s own client rect', function () {
            var div = divs.eq(0);
            var rect = div.element().getBoundingClientRect();
            expect(div.rect()).toEqual({
                height: rect.height,
                width: rect.width,
                bottom: rect.bottom,
                right: rect.right,
                left: rect.left,
                top: rect.top,
            });
        });
        it('can show and hide elements', function () {
            expect(divs.hide().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'none') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
            expect(divs.show().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'block') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
        });
        it('can attach dom elements', function () {
            var div = divs.eq();
            div.append(divs.element(1));
            expect(div.children().element()).toEqual(divs.element(1));
        });
        it('can remove dom elements', function () {
            var div = divs.eq();
            div.append(divs.element(1));
            expect(div.children().element()).toEqual(divs.element(1));
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
                expect(divs.first().element()).toEqual(divs.element(0));
            });
            it('and the last element in the list', function () {
                expect(divs.last().element()).toEqual(divs.element(divs.length() - 1));
            });
        });
        describe('it can find it\'s children', function () {
            it('by calling the children method', function () {
                divs.duff(function (manager, idx) {
                    var div = manager.element();
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
                    expect(kid.element().localName).toEqual('span');
                });
                kids = divs.children(1);
                expect(kids.length()).toEqual(5);
                kids = divs.children('.span-2');
                expect(kids.unwrap()).toEqual(divs.children().filter('.span-2').unwrap());
                expect(kids.length()).toEqual(2);
                expect(kids.element() === kids.element(1)).toEqual(false);
            });
            it('by querying the dom elements', function () {
                divs.duff(function (div, idx) {
                    div.element().innerHTML = '<span></span><img/>';
                });
                var kids = divs.$('img');
                expect(kids.length()).toEqual(5);
                kids.duff(function (kid, idx) {
                    expect(kid.element().tagName).toEqual('IMG');
                });
            });
        });
        describe('it can also find it\'s parents', function () {
            it('either by counting up', function () {
                var $start = $('.results .failures'),
                    $end = $('.jasmine_html-reporter'),
                    end = $start.parent(2);
                expect(end.element()).toEqual($end.element());
            });
            it('or by finding via selector', function () {
                var $start = $('.results .failures'),
                    $end = $('.jasmine_html-reporter'),
                    end = $start.parent('.jasmine_html-reporter');
                expect(end.element()).toEqual($end.element());
            });
            it('or by passing a function', function () {
                var $start = $('.results .failures'),
                    end = $start.parent(function (el) {
                        return el.tagName === 'BODY';
                    });
                expect(end.element()).toEqual(document.body);
            });
            describe('or by passing a keyword', function () {
                it('like document', function () {
                    var $start = $('.results .failures'),
                        end = $start.parent('document');
                    expect(end.element()).toEqual(document);
                });
                it('or window', function () {
                    var $start = $('.results .failures'),
                        end = $start.parent('window');
                    expect(end.element()).toEqual(window);
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
                    divs.on('click', handler);
                    expect(count).toEqual(0);
                    divs.click();
                    expect(count).toEqual(5);
                });
                it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    expect(count).toEqual(15);
                });
            });
        });
        describe('the domm is also special because it abstracts event listeners for you', function () {
            describe('can add handlers', function () {
                it('one at a time', function () {
                    divs.on('click', handler);
                    expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    expect(count).toEqual(5);
                });
                it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    expect(count).toEqual(15);
                });
            });
            describe('also capture handlers', function () {
                it('one at a time', function () {
                    divs.on('_click', handler);
                    expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    expect(count).toEqual(5);
                });
                it('many at a time', function () {
                    divs.on('_click _mouseover _mouseout', handler);
                    expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    divs.dispatchEvent('mouseover', {}, true);
                    divs.dispatchEvent('mouseout', {}, true);
                    expect(count).toEqual(15);
                });
            });
            it('will only add a method to the queue once. if a duplicate is passed in, it will be ignored (just like the browser implementation)', function () {
                divs.on('click', handler).on('click', handler);
                expect(count).toEqual(0);
                divs.dispatchEvent('click');
                expect(count).toEqual(5);
                divs.dispatchEvent('click');
                expect(count).toEqual(10);
            });
            it('once wrappers can also be used with the once method and they can be added the same way as once', function () {
                divs.once('click', handler);
                expect(count).toEqual(0);
                divs.dispatchEvent('click');
                expect(count).toEqual(5);
                divs.dispatchEvent('click');
                expect(count).toEqual(5);
            });
            it('be careful with the once function because they can be added multiple times to the queue, since they use a proxy function, like the one available at _.once', function () {
                divs.once('click', handler);
                expect(count).toEqual(0);
                divs.dispatchEvent('click');
                expect(count).toEqual(5);
                divs.dispatchEvent('click');
                expect(count).toEqual(5);
            });
        });
        describe('the each function is special because', function () {
            it('it wraps each element in a DOMM object before passing it through your iterator', function () {
                divs.each(function (el, idx) {
                    expect(_.isInstance(el, factories.DOMM)).toEqual(false);
                    expect(factories.DomManager.isInstance(el)).toEqual(true);
                    expect(divs.element(idx) === el.element());
                });
            });
            it('where the duff and forEach function just gives you the element at each index, just like a collection', function () {
                divs.duff(function (el, idx) {
                    expect(_.isInstance(el, $)).toEqual(false);
                });
                divs.forEach(function (el, idx) {
                    expect(_.isInstance(el, $)).toEqual(false);
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
                    expect(div.element().getAttribute('data-one')).toEqual(null);
                    expect(div.element().getAttribute('data-two')).toEqual(null);
                });
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    expect(div.element().getAttribute('data-one')).toEqual('one');
                    expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
            it('remove', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    expect(div.element().getAttribute('data-one')).toEqual('one');
                    expect(div.element().getAttribute('data-two')).toEqual('two');
                });
                divs.data({
                    one: false,
                    two: false
                });
                divs.duff(function (div, idx) {
                    expect(div.element().getAttribute('data-one')).toEqual(null);
                    expect(div.element().getAttribute('data-two')).toEqual(null);
                });
            });
            it('and update data attributes', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div) {
                    expect(div.element().getAttribute('data-one')).toEqual('one');
                    expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
        });
        describe('it can also manipulate elements in other ways', function () {
            it('like by manipulating their attributes', function () {
                divs.duff(function (div) {
                    expect(div.element().getAttribute('tabindex')).toEqual(null);
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
                    expect(div.element().align).toEqual('');
                });
                divs.prop({
                    align: 'left'
                });
                divs.each(function (div, idx) {
                    expect(div.prop('align')).toEqual('left');
                });
            });
        });
        describe('can have specialized elements', function () {
            describe('has lifecycle events', function () {
                it('like attach', function () {
                    divs.remove();
                    divs.on('attach', handler);
                    expect(count).toEqual(0);
                    $con.append(divs);
                    expect(count).toEqual(5);
                });
                it('and detach', function () {
                    divs.once('detach', handler);
                    expect(count).toEqual(0);
                    divs.remove();
                    expect(count).toEqual(5);
                });
                it('and attribute change', function () {
                    divs.once('attributeChange:data-here', handler);
                    expect(count).toEqual(0);
                    divs.data('here', 1);
                    expect(count).toEqual(5);
                });
            });
            describe('there are also special handlers', function () {
                it('like create', function () {
                    $.registerElement('test0', {
                        onCreate: handler
                    });
                    expect(count).toEqual(0);
                    $.createElement('test0');
                    expect(count).toEqual(1);
                });
                it('and destroy', function () {
                    $.registerElement('test1', {
                        onDestroy: handler
                    });
                    var div = $.createElement('test1');
                    expect(count).toEqual(0);
                    div.destroy();
                    expect(count).toEqual(1);
                });
            });
        });
        it('tags cannot be created without being registered first', function () {
            expect(function () {
                $.createElement('unregistered');
            }).toThrow();
        });
    });
});
application.scope().run(function (app, _, factories) {
    describe('Looper', function () {
        //
    });
});
application.scope().run(function (app, _, factories) {
    var buster, iframe, count, handler = function () {
            count++;
        },
        contextHandler = function (expects) {
            return function () {
                count += (expects === this);
            };
        },
        pagePromise = _.get('/test/framed.html');
    describe('Buster', function () {
        beforeEach(function () {
            count = 0;
        });
        describe('can understand unfriendly windows', function () {
            it('can receive messages on windows', function (done) {
                var iframe = $.createElement('iframe');
                app.getRegion('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8000/test/framed.html'
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    expect(count).toEqual(1);
                    setTimeout(function () {
                        iframe.destroy();
                    });
                    done();
                });
            });
            it('as well as deferred messages', function (done) {
                var iframe = $.createElement('iframe');
                app.getRegion('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8000/test/framed.html'
                });
                buster.connected(handler);
                buster.create('delayed').response(handler).deferred(function (e) {
                    expect(e.data().success).toEqual(true);
                    expect(count).toEqual(2);
                    setTimeout(function () {
                        iframe.destroy();
                    });
                    done();
                }).send();
            });
        });
        describe('and windows without a source', function () {
            it('can receive messages on windows', function (done) {
                pagePromise.success(function (response) {
                    var iframe = $.createElement('iframe');
                    app.getRegion('main').el.append(iframe);
                    var buster = factories.Buster(window, iframe, {
                        iframeContent: response
                    });
                    buster.connected(handler);
                    buster.sync(function (e) {
                        expect(count).toEqual(1);
                        setTimeout(function () {
                            iframe.destroy();
                        });
                        done();
                    });
                });
            });
            it('as well as deferred messages', function (done) {
                pagePromise.success(function (response) {
                    var iframe = $.createElement('iframe');
                    app.getRegion('main').el.append(iframe);
                    var buster = factories.Buster(window, iframe, {
                        iframeContent: response
                    });
                    buster.connected(handler);
                    buster.create('delayed').response(handler).deferred(function (e) {
                        expect(e.data().success).toEqual(true);
                        expect(count).toEqual(2);
                        setTimeout(function () {
                            iframe.destroy();
                        });
                        done();
                    }).send();
                });
            });
        });
        describe('can understand friendly windows', function () {
            it('can receive messages on windows', function (done) {
                var iframe = $.createElement('iframe');
                app.getRegion('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8080/test/framed.html'
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    expect(count).toEqual(1);
                    setTimeout(function () {
                        iframe.destroy();
                    });
                    done();
                });
            });
            it('as well as deferred messages', function (done) {
                var iframe = $.createElement('iframe');
                app.getRegion('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8080/test/framed.html'
                });
                buster.connected(handler);
                buster.create('delayed').response(handler).deferred(function (e) {
                    expect(e.data().success).toEqual(true);
                    expect(count).toEqual(2);
                    setTimeout(function () {
                        iframe.destroy();
                    });
                    done();
                }).send();
            });
        });
    });
});
application.scope().run(function (app, _, factories) {
    describe('View', function () {
        var view, complexView, count, ComplexView = factories.View.extend({
            ui: {
                there: '.here'
            },
            elementEvents: {
                'click @ui.there': 'doThis'
            },
            doThis: function () {
                count++;
            },
            template: function () {
                return '<span></span><div class="here"></div>';
            }
        });
        app.addRegion('main', '.test-div');
        beforeEach(function () {
            count = 0;
            view = factories.View();
            complexView = ComplexView();
        });
        afterEach(function () {
            view.destroy();
            complexView.destroy();
        });
        it('is an object', function () {
            expect(_.isObject(view)).toEqual(true);
            expect(_.isInstance(view, factories.View)).toEqual(true);
        });
        it('has an element that you can interact with', function () {
            expect(_.isInstance(view.el, factories.DomManager)).toEqual(true);
            window.readytostop = true;
        });
        // this test is invalid because there should be no ui available before render
        // it('can even have extra elements tied to it... but only when it is rendered', function () {
        //     expect(_.isString(complexView.ui.there)).toEqual(true);
        //     complexView.render();
        //     expect(_.isInstance(complexView.ui.there, factories.DOMM)).toEqual(true);
        // });
        it('can be rendered', function () {
            expect(complexView.el.html()).toEqual('');
            complexView.render();
            expect(complexView.el.html()).not.toEqual('');
        });
        it('can be attached to a region', function () {
            expect(complexView.el.element().parentNode).toEqual(null);
            app.getRegion('main').add(complexView);
            expect(complexView.el.element().parentNode).not.toEqual(null);
        });
        it('can be filtered', function () {
            expect(complexView.el.element().parentNode).toEqual(null);
            complexView.filter = false;
            app.getRegion('main').add(complexView);
            expect(complexView.el.element().parentNode).toEqual(null);
        });
        it('can have extra elements', function () {
            // expect(_.isObject(complexView.ui)).toEqual(true);
            // expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            expect(_.isInstance(complexView.ui.there, factories.DOMM)).toEqual(true);
            expect(complexView.ui.there.length()).toEqual(1);
        });
        it('can also attach events to it\'s element', function () {
            expect(count).toEqual(0);
            app.getRegion('main').add(complexView);
            expect(count).toEqual(0);
            complexView.el.click();
            expect(count).toEqual(1);
            complexView.render();
            expect(count).toEqual(1);
            complexView.el.click();
            expect(count).toEqual(2);
        });
        it('as well as it\'s ui elements', function () {
            expect(count).toEqual(0);
            app.getRegion('main').add(complexView);
            expect(count).toEqual(0);
            complexView.ui.there.click();
            expect(count).toEqual(1);
            complexView.render();
            expect(count).toEqual(1);
            complexView.ui.there.click();
            expect(count).toEqual(2);
        });
    });
});