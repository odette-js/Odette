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
                        out: 'there',
                        fun: function () {}
                    },
                    cloned = _.clone(original);
                _.expect(cloned).toEqual(original);
            });
            // write more differentiating code for this test
            _.it('_.cloneJSON', function () {
                var original = {
                        some: 'thing',
                        out: 'there',
                        fun: function () {}
                    },
                    cloned = _.cloneJSON(original);
                _.expect(cloned).not.toEqual(original);
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
application.scope().run(function (app, _) {
    _.describe('Strings', function () {
        _.it('_.camelCase', function () {
            var thatIsCamelCased = 'thisIsCamelCased';
            // default delimiter is -
            _.expect(_.camelCase('this-is-camel-cased')).toEqual(thatIsCamelCased);
            _.expect(_.camelCase('thisIsCamelCased')).toEqual(thatIsCamelCased);
            // overridable by second param
            _.expect(_.camelCase('this_is_camel_cased', '_')).toEqual(thatIsCamelCased);
            _.expect(_.camelCase('this is camel cased', ' ')).toEqual(thatIsCamelCased);
            // does not modify the first character if it is passed in as a capital letter
            _.expect(_.camelCase('This Is Camel Cased', ' ')).not.toEqual(thatIsCamelCased);
        });
        _.it('_.capitalize', function () {
            _.expect(_.capitalize('some')).toEqual('Some');
            _.expect(_.capitalize('Some')).toEqual('Some');
            _.expect(_.capitalize('sOmE')).toEqual('SOmE');
        });
        _.it('_.unCamelCase', function () {
            var thatIsCamelCased = 'thisIsUnCamelCased';
            _.expect(_.unCamelCase(thatIsCamelCased)).toEqual('this-is-un-camel-cased');
            _.expect(_.unCamelCase(thatIsCamelCased, ' ')).toEqual('this is un camel cased');
            _.expect(_.unCamelCase(thatIsCamelCased, '_')).toEqual('this_is_un_camel_cased');
            _.expect(_.unCamelCase(thatIsCamelCased, '1')).toEqual('this1is1un1camel1cased');
        });
        _.describe('_.customUnits', function () {
            _.expect(_.customUnits('1000whats', ['evers', 'whats'])).toEqual('whats');
            _.it('does not use any root, or base units', function () {
                _.expect(_.customUnits('1000px', [])).toEqual(false);
            });
        });
        _.it('_.reference', function () {
            var expectation = _.expect(_.reference(document));
            if (app.global.touch(window, window.top)) {
                expectation.toEqual('');
            } else {
                expectation.not.toEqual('');
            }
        });
        _.it('_.string.match', function () {
            _.expect(_.string.match('strings are my stringy friends', 'string')).toEqual(['string']);
        });
        _.it('_.string.toLowerCase', function () {
            _.expect(_.string.toLowerCase('YaYlOwErcasD')).toEqual('yaylowercasd');
        });
        _.it('_.string.toUpperCase', function () {
            _.expect(_.string.toUpperCase('YaYlOwErcasD')).toEqual('YAYLOWERCASD');
        });
        _.it('_.baseUnitList', function () {
            _.expect(_.baseUnitList.slice(0).sort()).toEqual(['vmax', 'vmin', 'rem', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'vh', 'vw', '%'].slice(0).sort());
        });
        _.it('_.parseHash', function () {
            _.expect(_.parseHash('#{"things":true}')).toEqual({
                things: true
            });
            _.expect(_.parseHash('#route/here')).toEqual('route/here');
            _.expect(_.parseHash('#48330382')).toEqual(48330382);
            _.expect(_.parseHash('#48330382/2891-44303')).toEqual('48330382/2891-44303');
        });
        _.it('_.isHttp', function () {
            _.expect(_.isHttp('http://localhost:8080')).toEqual(true);
            _.expect(_.isHttp('https://localhost:8080')).toEqual(true);
            _.expect(_.isHttp('//localhost:8080')).toEqual(true);
            _.expect(_.isHttp('localhost:8080')).toEqual(false);
            _.expect(_.isHttp('//localhost:8080//')).toEqual(false);
            _.expect(_.isHttp(' //localhost:8080')).toEqual(false);
            _.expect(_.isHttp('//localhost/alsdf.js')).toEqual(true);
        });
    });
});
// window._ = application.scope()._;
// window.factories = application.scope()._.factories;
application.scope().run(function (app, _, factories) {
    _.describe('Collection', function () {
        var collection, numberCollection, complexCollection, evenNumberList;
        _.beforeEach(function () {
            collection = factories.Collection();
            numberCollection = factories.Collection([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            complexCollection = factories.Collection([factories.Model(), factories.Model({
                one: 1,
                two: 2,
                three: 3
            })]);
            evenNumberList = [0, 2, 4, 6, 8];
        });
        _.it('extends from factories.Extendable', function () {
            _.expect(_.isInstance(collection, factories.Extendable)).toEqual(true);
        });
        _.it('is not an array like object', function () {
            _.expect(_.isArrayLike(collection)).toEqual(false);
        });
        _.it('knows it\'s length', function () {
            _.expect(numberCollection.length()).toEqual(10);
        });
        _.it('can give you all of it\'s values at once', function () {
            _.expect(collection.unwrap()).toEqual(collection.items);
        });
        _.it('or one at a time', function () {
            numberCollection.duff(function (item, idx) {
                _.expect(numberCollection.item(idx)).toEqual(numberCollection.items[idx]);
            });
        });
        _.it('as well as in reverse order', function () {
            var list = [];
            numberCollection.duffRight(function (item, idx) {
                _.expect(numberCollection.item(idx)).toEqual(numberCollection.items[idx]);
                list.push(item);
            });
            _.expect(list).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        });
        _.it('can trigger toJSON on children', function () {
            _.expect(JSON.stringify(numberCollection)).toEqual('[0,1,2,3,4,5,6,7,8,9]');
            _.expect(JSON.stringify(complexCollection)).toEqual('[{},{"one":1,"two":2,"three":3}]');
        });
        _.it('can also concatonate itself with collections and arrays just like a regular array', function () {
            var collection = factories.Collection([0, 1, 2, 3, 4]),
                list = factories.Collection([5, 6, 7, 8, 9]);
            _.expect(collection.concat(list, evenNumberList).unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2, 4, 6, 8]);
        });
        // _.it('can also reverse itself momentarily', function () {
        //     var test = [];
        //     numberCollection.mambo(function (list) {
        //         list.duff(function (val) {
        //             test.push(val);
        //         });
        //     });
        //     _.expect(test).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        // });
        _.describe('but other methods need arrays... Collections also have a bunch of methods that they stole from the _ object such as:', function () {
            // _.it('addAll', function () {
            //     _.expect(numberCollection.addAll([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]);
            // });
            // _.it('removeAll', function () {
            //     _.expect(numberCollection.removeAll([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).unwrap()).toEqual([1, 3, 5, 7, 9]);
            // });
            _.it('sort', function () {
                _.expect(numberCollection.sort().unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
                _.expect(numberCollection.sort(function (a, b) {
                    return (a % 3) - (b % 3);
                }).unwrap()).toEqual([0, 3, 6, 9, 1, 4, 7, 2, 5, 8]);
            });
            _.it('unshift', function () {
                numberCollection.unshift(-1);
                _.expect(numberCollection.unwrap()).toEqual([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            _.it('push', function () {
                numberCollection.push(10);
                _.expect(numberCollection.unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
                numberCollection.push([11, 12, 13]);
                _.expect(numberCollection.unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
            });
            _.it('cycle', function () {
                numberCollection.cycle(3);
                _.expect(numberCollection.unwrap()).toEqual([3, 4, 5, 6, 7, 8, 9, 0, 1, 2]);
            });
            _.it('uncycle', function () {
                numberCollection.uncycle(3);
                _.expect(numberCollection.unwrap()).toEqual([7, 8, 9, 0, 1, 2, 3, 4, 5, 6]);
            });
            _.it('count', function () {
                _.expect(numberCollection.count(function (item, idx, list) {
                    if (item === null) {
                        list.push(idx);
                    }
                }, 10, 20).length()).toEqual(20);
            });
            _.it('countTo', function () {
                _.expect(numberCollection.countTo(function (item, idx, list) {
                    if (item === null) {
                        list.push(idx);
                    }
                }, 20).length()).toEqual(20);
            });
            _.it('countFrom', function () {
                var count = 0;
                numberCollection.countFrom(function (item, idx, list) {
                    count++;
                }, 6);
                _.expect(count).toEqual(4);
            });
            _.it('add', function () {
                _.expect(numberCollection.add(61)).toEqual(true);
                _.expect(numberCollection.add(5)).toEqual(false);
                _.expect(numberCollection.unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 61]);
                _.expect(numberCollection.add(61)).toEqual(false);
            });
            _.it('insertAt', function () {
                _.expect(numberCollection.insertAt(5, 1)).toEqual(true);
                _.expect(numberCollection.unwrap()).toEqual([0, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            _.it('remove', function () {
                _.expect(numberCollection.remove(5)).toEqual(true);
                _.expect(numberCollection.unwrap()).toEqual([0, 1, 2, 3, 4, 6, 7, 8, 9]);
                _.expect(numberCollection.remove(5)).toEqual(false);
            });
            _.it('removeAt', function () {
                _.expect(numberCollection.removeAt(3)).toEqual(3);
                _.expect(numberCollection.removeAt(3)).toEqual(4);
                _.expect(numberCollection.length()).toEqual(8);
            });
            _.it('pop', function () {
                _.expect(numberCollection.pop()).toEqual(9);
                _.expect(numberCollection.pop()).toEqual(8);
                _.expect(numberCollection.length()).toEqual(8);
            });
            _.it('shift', function () {
                _.expect(numberCollection.shift()).toEqual(0);
                _.expect(numberCollection.shift()).toEqual(1);
                _.expect(numberCollection.length()).toEqual(8);
            });
            _.it('indexOf', function () {
                _.expect(numberCollection.indexOf(3)).toEqual(3);
                _.expect(numberCollection.indexOf(7)).toEqual(7);
            });
            _.it('find', function () {
                _.expect(numberCollection.find(function (ix, item) {
                    return item === 10;
                })).toEqual(void 0);
                _.expect(numberCollection.find(function (ix, item) {
                    return item === 7;
                })).toEqual(7);
            });
            _.it('findLast', function () {
                _.expect(factories.Collection([12, 1, 2, 1, 104, 2, 1, 5, 55, 6, 2, 7]).findLast(function (item) {
                    return item % 17 === 0;
                })).toEqual(void 0);
                _.expect(factories.Collection([88, 2, 1, 5, 70, 23, 43, 9]).findLast(function (item) {
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
            _.it('findWhere', function () {
                _.expect(factories.Collection([firstFindObj, secondFindObj]).findWhere({
                    one: 2
                })).toEqual(void 0);
                _.expect(factories.Collection([firstFindObj, secondFindObj]).findWhere({
                    two: 2
                })).toEqual(firstFindObj);
            });
            _.it('findLastWhere', function () {
                _.expect(factories.Collection([firstFindObj, secondFindObj]).findLastWhere({
                    one: 2
                })).toEqual(void 0);
                _.expect(factories.Collection([firstFindObj, secondFindObj]).findLastWhere({
                    two: 2
                })).toEqual(secondFindObj);
            });
            _.it('foldr', function () {
                _.expect(numberCollection.foldr(function (memo, idx, item) {
                    memo.push(item);
                    return memo;
                }, [])).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
            });
            _.it('foldl', function () {
                _.expect(numberCollection.foldl(function (memo, idx, item) {
                    memo.push(item);
                    return memo;
                }, [])).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            _.it('merge', function () {
                _.expect(numberCollection.merge([0, 1, 2, 6, 7, 8]).unwrap()).toEqual([0, 1, 2, 6, 7, 8, 6, 7, 8, 9]);
            });
            _.it('range', function () {
                _.expect(factories.Collection().range(4, 9).unwrap()).toEqual([4, 5, 6, 7, 8]);
            });
            _.it('eq', function () {
                _.expect(numberCollection.eq(4).unwrap()).toEqual([4]);
                _.expect(numberCollection.eq([3, 9]).unwrap()).toEqual([3, 9]);
            });
            _.it('map', function () {
                _.expect(numberCollection.map(function (idx, item) {
                    return item * 2;
                }).unwrap()).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
            });
            _.it('filter', function () {
                _.expect(numberCollection.filter(function (idx, item) {
                    return item % 2;
                }).unwrap()).toEqual([1, 3, 5, 7, 9]);
            });
            _.it('pluck', function () {
                _.expect(factories.Collection([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]).results('one').unwrap()).toEqual([1, 2, 3, 4]);
            });
            _.it('where', function () {
                _.expect(factories.Collection([{
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
            _.it('flatten', function () {
                _.expect(factories.Collection([
                    [0, 1, 2, 3],
                    [4, 5, 6, 7, 8],
                    [9, 10, 11, 12]
                ]).flatten().unwrap()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            });
        });
    });
    _.describe('SortedCollection', function () {
        var collection, complexCollection, evenNumberList, numberCollection, SortedCollection = factories.SortedCollection;
        _.beforeEach(function () {
            collection = SortedCollection();
            numberCollection = SortedCollection([4, 5, 3, 7, 8, 6, 2, 0, 1, 9]);
            complexCollection = SortedCollection([factories.Model(), factories.Model({
                one: 1,
                two: 2,
                three: 3
            })]);
            evenNumberList = [0, 2, 4, 6, 8];
        });
        _.it('should be sorted at the beginning', function () {
            _.expect(numberCollection.toJSON()).toEqual(numberCollection.sort().toJSON());
        });
        _.it('can get values without having to iterate over everything', function () {
            numberCollection.indexOf = _.noop;
            _.expect(numberCollection.get('id', 8)).toEqual(8);
        });
        _.it('can add values in the correct place', function () {
            var sorted = SortedCollection(evenNumberList);
            sorted.add(1);
            sorted.add(5);
            sorted.add(3);
            _.expect(sorted.item(0)).toEqual(0);
            _.expect(sorted.item(1)).toEqual(1);
            _.expect(sorted.item(2)).toEqual(2);
            _.expect(sorted.item(3)).toEqual(3);
            _.expect(sorted.item(4)).toEqual(4);
            _.expect(sorted.item(5)).toEqual(5);
        });
        _.it('can remove values from the correct place', function () {
            var sorted = SortedCollection(evenNumberList);
            sorted.remove(4);
            sorted.remove(2);
            _.expect(sorted.item(0)).toEqual(0);
            _.expect(sorted.item(1)).toEqual(6);
            _.expect(sorted.item(2)).toEqual(8);
        });
    });
});
application.scope().run(function (app, _, factories) {
    _.describe('Events', function () {
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
        _.beforeEach(function () {
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
        _.describe('Models can have events', function () {
            var box2;
            _.describe('and can create events for itself', function () {
                _.it('either one at a time', function () {
                    box.on('evnt', handler);
                    _.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    _.expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    _.expect(count).toEqual(2);
                });
                _.it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    _.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.expect(count).toEqual(6);
                });
            });
            _.describe('and can remove events from itself', function () {
                _.it('either one at a time', function () {
                    box.on('evnt', handler);
                    _.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    _.expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    _.expect(count).toEqual(2);
                    box.off('evnt', handler);
                    _.expect(count).toEqual(2);
                    box.dispatchEvent('evnt');
                    _.expect(count).toEqual(2);
                });
                _.it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    _.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.expect(count).toEqual(6);
                    box.off('evnt eventer mikesevent', handler);
                });
            });
        });
        _.describe('Models can also listen to other, similar objects', function () {
            var box2;
            _.beforeEach(function () {
                box2 = Model();
            });
            _.describe('by using the listenTo method', function () {
                _.it('either one at a time', function () {
                    box.listenTo(box2, 'evnt', handler);
                    _.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    _.expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    _.expect(count).toEqual(2);
                });
                _.it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    _.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    _.expect(count).toEqual(1);
                    box2.dispatchEvent('eventer');
                    _.expect(count).toEqual(2);
                    box2.dispatchEvent('mikesevent');
                    _.expect(count).toEqual(3);
                });
            });
            _.it('you can even take a shortcut and dispatch an event one at a time using dispatchEvent', function () {
                box.on('handle', handler);
                _.expect(count).toEqual(0);
                box.dispatchEvent('handle');
                _.expect(count).toEqual(1);
            });
            _.it('or many at a time using dispatchEvents', function () {
                box.on('handle handler beep boop blob', handler);
                _.expect(count).toEqual(0);
                box.dispatchEvents('handle handler beep boop blob');
                _.expect(count).toEqual(5);
            });
            _.describe('and can stop listening by using the stopListening method', function () {
                _.it('can remove events one at a time', function () {
                    var listenObj;
                    box.listenTo(box2, 'evnt', handler);
                    _.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    _.expect(count).toEqual(1);
                    box.stopListening(box2, 'evnt', handler);
                    _.expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    _.expect(count).toEqual(1);
                });
                _.it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    box.listenTo(box2, 'evnt eventer mikesevent', function () {
                        count += this === box;
                    });
                    _.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    _.expect(count).toEqual(6);
                    box.stopListening(box2, 'evnt eventer mikesevent', handler);
                    _.expect(count).toEqual(6);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    _.expect(count).toEqual(9);
                });
            });
            _.describe('listenTo', function () {
                _.it('should have an equivalent context', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += (this === box);
                    });
                    _.expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    _.expect(count).toEqual(2);
                });
                _.it('can be overridden with an extra argument', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += this === box2;
                    }, box2);
                    _.expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    _.expect(count).toEqual(2);
                });
            });
            _.describe('watch directive', function () {
                _.it('can listenTo the object that it belongs to', function () {
                    box.watch('here', 'there', function () {
                        count++;
                    });
                    _.expect(count).toEqual(0);
                    box.set('here', 1);
                    _.expect(count).toEqual(0);
                    box.set('here', 'there');
                    _.expect(count).toEqual(1);
                    box.set('here', 'where');
                    _.expect(count).toEqual(1);
                    box.set('here', 'there');
                    _.expect(count).toEqual(2);
                });
            });
            _.describe('when directive', function () {
                _.it('gives an api synonymous with english', function () {
                    box.when('here').is('there').and('when').is('now').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.expect(count).toEqual(0);
                    box.set('here', 'nothere');
                    _.expect(count).toEqual(-1);
                    box.set('when', 'later');
                    _.expect(count).toEqual(-1);
                    box.set('when', 'now');
                    _.expect(count).toEqual(-1);
                    box.set('here', 'there');
                    _.expect(count).toEqual(0);
                });
                _.it('allows for negatives to be used like isNot and isnt', function () {
                    box.when('one').isNot(2).and('up').isnt('down').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.expect(count).toEqual(0);
                    box.set('up', 'down');
                    _.expect(count).toEqual(-1);
                    box.set('one', 2);
                    _.expect(count).toEqual(-1);
                    box.set('one', 1);
                    _.expect(count).toEqual(-1);
                    box.set('up', 'side');
                    _.expect(count).toEqual(0);
                });
                _.it('can compare numbers using basic operators and negation', function () {
                    box.when('one').isGreaterThan(5).and('ten').isLessThan(4).and('phone').isNotLessThan(5).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.expect(count).toEqual(0);
                    box.set('phone', 10);
                    _.expect(count).toEqual(-1);
                    box.set('one', 6);
                    _.expect(count).toEqual(-1);
                    box.set('ten', 5);
                    _.expect(count).toEqual(-1);
                    box.set('ten', 2);
                    _.expect(count).toEqual(0);
                });
                _.it('can compare string values using basic operators and negation', function () {
                    box.when('one').isGreaterThan('a').and('ten').isLessThan('b').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.expect(count).toEqual(0);
                    box.set('one', '0');
                    _.expect(count).toEqual(-1);
                    box.set('ten', 'beach');
                    _.expect(count).toEqual(-1);
                    box.set('ten', 'aardvark');
                    _.expect(count).toEqual(-1);
                    box.set('one', 'ten');
                    _.expect(count).toEqual(0);
                });
                _.it('can also handle custom functions', function () {
                    box.when('one').is(function () {
                        return box.get('one') > 5;
                    }).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.expect(count).toEqual(0);
                    box.set('one', 10);
                    _.expect(count).toEqual(1);
                    box.set('one', 3);
                    _.expect(count).toEqual(0);
                });
                _.it('can also make "groups" using the or method', function () {
                    var sequence = box.when('one').is(1).or('truth').is(true).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.expect(count).toEqual(0);
                    box.set('one', 2);
                    _.expect(count).toEqual(-1);
                    box.set('one', 0);
                    _.expect(count).toEqual(-1);
                    box.set('truth', true);
                    _.expect(count).toEqual(0);
                    box.set('one', 1);
                    _.expect(count).toEqual(0);
                    box.set('truth', false);
                    _.expect(count).toEqual(0);
                });
                _.it('can also have multiple watchers on a particular instance that run independently', function () {
                    var last;
                    var sequence = box.when('five').isLessThan(10).then(function () {
                        count++;
                        last = 1;
                    });
                    var sequence2 = box.when('here').is('there').then(function () {
                        count++;
                        last = 2;
                    });
                    _.expect(count).toEqual(0);
                    _.expect(last).toEqual(void 0);
                    box.set('five', 3);
                    _.expect(count).toEqual(1);
                    _.expect(last).toEqual(1);
                    box.set('here', 'there');
                    _.expect(count).toEqual(2);
                    _.expect(last).toEqual(2);
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
    _.describe('Model', function () {
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
        _.beforeEach(function () {
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
        _.it('extends from factories.Extendable', function () {
            _.expect(factories.Extendable.isInstance(box)).toEqual(true);
        });
        _.describe('Models are always created with...', function () {
            var box2 = Model();
            _.it('a unique id', function () {
                _.expect(_.has(box2, 'id')).toEqual(true);
            });
            _.it('even if there is not one given', function () {
                var box3 = Model({
                    id: 5
                });
                _.expect(box2.id !== void 0).toEqual(true);
                _.expect(box3.id === 5).toEqual(true);
            });
            // _.it('an empty _previousAttributes hash', function () {
            //     _.expect(_.has(box2, '_previousAttributes')).toEqual(true);
            //     _.expect(_.isObject(box2._previousAttributes)).toEqual(true);
            //     _.expect(_.isEmpty(box2._previousAttributes)).toEqual(true);
            // });
            // _.it('a collection for children', function () {
            //     _.expect(_.has(box2, 'Children')).toEqual(true);
            //     _.expect(factories.Collection.isInstance(box2.directive('Children'))).toEqual(true);
            //     _.expect(box2.directive('Children').length()).toEqual(0);
            // });
            // _.it('and an attributes object', function () {
            //     _.expect(_.has(box2, 'attributes')).toEqual(true);
            //     _.expect(_.isObject(box2.directive('data').current)).toEqual(true);
            // });
        });
        _.describe('you can set properties on the box you\'re handling with the set method', function () {
            var box = Model(),
                attrs = box.directive('data');
            _.beforeEach(function () {
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
            _.it('you can add new properties', function () {
                _.expect(attrs.ten).toEqual(void 0);
                box.set({
                    ten: 10,
                    eleven: 11,
                    twelve: 12
                });
                _.expect(box.get('ten')).toEqual(10);
            });
            _.it('you can modify existing properties', function () {
                _.expect(box.get('one')).toEqual(1);
                box.set({
                    one: 2,
                    two: 3,
                    three: 4
                });
                _.expect(box.get('one')).toEqual(2);
            });
            _.it('and you can remove properties by using the unset method', function () {
                var box = Model();
                _.expect(box.get('one')).toEqual(void 0);
                box.set({
                    one: 1
                });
                _.expect(box.get('one')).toEqual(1);
                box.unset('one');
                _.expect(box.get('one')).toEqual(void 0);
            });
            // _.it('or remove a bunch of properties by passing in a space separated list to the unset method', function () {
            //     _.expect(box.get('one')).toEqual(1);
            //     _.expect(box.get('three')).toEqual(3);
            //     _.expect(box.get('five')).toEqual(5);
            //     box.unset('one three five');
            //     _.expect(box.get('one')).toEqual(void 0);
            //     _.expect(box.get('three')).toEqual(void 0);
            //     _.expect(box.get('five')).toEqual(void 0);
            // });
        });
        // pass to the on, once, off, listenTo, listenToOnce, and stopListening functions
        _.describe('there are super special characters that you can use for terseness', function () {
            var count = 0,
                handler = function () {
                    count++;
                };
            _.beforeEach(function () {
                box2 = Model();
                count = 0;
            });
        });
        _.describe('Models also trigger a variety of events any time the set method changes the attributes object', function () {
            var fired;
            _.beforeEach(function () {
                fired = 0;
            });
            _.it('such as the change event', function () {
                _.expect(fired).toEqual(0);
                box.on('change', function () {
                    fired = 1;
                });
                _.expect(fired).toEqual(0);
                box.set({
                    here: 'there'
                });
                _.expect(fired).toEqual(1);
            });
            _.it('and the alter event', function () {
                _.expect(fired).toEqual(0);
                box.on('change', function () {
                    fired = 1;
                });
                _.expect(fired).toEqual(0);
                box.set({
                    one: 1,
                    two: 2
                });
                _.expect(fired).toEqual(0);
                box.set({
                    two: 1
                });
                _.expect(fired).toEqual(1);
            });
            _.it('as well as alter events specific to each property', function () {
                _.expect(fired).toEqual(0);
                box.on('change:one change:two change:three', function () {
                    fired++;
                });
                _.expect(fired).toEqual(0);
                box.set({
                    one: 9,
                    two: 8,
                    three: 7
                });
                _.expect(fired).toEqual(3);
            });
        });
        _.describe('but beyond events and simple hashes, Models are able to manage themselves fairly well', function () {
            _.it('they can get properties from the attributes object with the get method', function () {
                _.expect(box.get('one')).toEqual(1);
            });
            _.it('they can tell you if it has a property with the has method', function () {
                _.expect(box.has('one')).toEqual(true);
            });
            _.it('they can clone it\'s attributes by using the toJSON method', function () {
                var clone = box.toJSON();
                _.expect(clone).toEqual(box.directive('data').current);
                _.expect(clone === box.directive('data').current).toEqual(false);
            });
            _.it('they can clone children into an array', function () {
                var clone;
                box.add([factories.Model(), factories.Model()]);
                clone = box.directive('Children').toJSON();
                _.expect(clone).toEqual([{}, {}]);
            });
            _.it('they can stringify themselves', function () {
                box = factories.Model({
                    some: 'thing'
                });
                _.expect(box.toString()).toEqual(JSON.stringify({
                    some: 'thing'
                }));
            });
            _.it('they can stringify their children', function () {
                box = factories.Model();
                box.add(data.children);
                _.expect(box.directive('Children').toString()).toEqual(JSON.stringify(data.children));
            });
        });
        _.describe('Models can register other objects against a key hash as well', function () {
            _.it('it can register', function () {
                var data = {
                    myObj: 1
                };
                _.expect(box.directive('Children').get('id', 'key')).toEqual(void 0);
                box.directive('Children').keep('id', 'key', data);
                _.expect(box.directive('Children').get('id', 'key')).toEqual(data);
            });
            _.it('and retreive information', function () {
                var data = {
                    myObj: 1
                };
                _.expect(box.directive('Children').get('id', 'key')).toEqual(void 0);
                box.directive('Children').keep('id', 'key', data);
                _.expect(box.directive('Children').get('id', 'key') === data).toEqual(true);
            });
        });
        _.describe('boxes can have children', function () {
            _.it('you can add one at a time', function () {
                _.expect(box.directive('Children').length()).toEqual(0);
                box.add({
                    isChild: !0
                });
                _.expect(box.directive('Children').length()).toEqual(1);
            });
            _.it('or many at once', function () {
                _.expect(box.directive('Children').length()).toEqual(0);
                box.add([{
                    isChild: !0
                }, {
                    isChild: 'maybe'
                }, {
                    isChild: 'may'
                }]);
                _.expect(box.directive('Children').length()).toEqual(3);
            });
            _.it('you can also remove them one at a time', function () {
                box = factories.Model();
                box.add(data.children);
                _.expect(box.directive('Children').length()).toEqual(2);
            });
            _.it('or many at the same time', function () {
                box = factories.Model();
                var children = box.directive('Children');
                _.expect(children.length()).toEqual(0);
                box.add([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]);
                _.expect(children.length()).toEqual(4);
                box.remove([children.item(1), children.item(3)]);
                _.expect(children.length()).toEqual(2);
            });
        });
        _.describe('they can', function () {
            _.it('destroy themselves', function () {
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
                var destroyer = box.directive('Children').item(2);
                _.expect(box.directive('Children').get('cid', destroyer.cid) === destroyer).toEqual(true);
                _.expect(box.directive('Children').get('id', destroyer.id) === destroyer).toEqual(true);
                destroyer.destroy();
                _.expect(box.directive('Children').get('cid', destroyer.cid)).toEqual(void 0);
                _.expect(box.directive('Children').get('id', destroyer.id)).toEqual(void 0);
            });
            _.it('sort their children', function () {
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
                _.expect(box.directive('Children').map(function (model) {
                    return model.get('two');
                }).unwrap()).toEqual([1, 2, 8]);
                box.comparator = '!two';
                box.sort();
                _.expect(box.directive('Children').map(function (model) {
                    return model.get('two');
                }).unwrap()).toEqual([8, 2, 1]);
            });
            _.it('set up events on their children', function () {
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
                _.expect(counter).toEqual(0);
                box.directive('Children').results('dispatchEvent', 'beep');
                _.expect(counter).toEqual(8);
                box.directive('Children').results('dispatchEvent', 'boop');
                _.expect(counter).toEqual(4);
            });
            _.it('set up events on their parents', function () {
                var count = 0;
                Model.constructor.prototype.parentEvents = {
                    beep: function () {
                        count++;
                    }
                };
                box.add([{}, {}, {}, {}]);
                box.dispatchEvent('beep');
                _.expect(count).toEqual(4);
                delete Model.constructor.prototype.parentEvents;
            });
        });
        _.describe('boxes can "destroy" themselves', function () {
            _.it('their events will persist until they decide to reset their own events', function () {
                box.on({
                    event1: counter,
                    event2: counter
                });
                _.expect(count).toEqual(0);
                box.dispatchEvent('event1');
                _.expect(count).toEqual(1);
                box.dispatchEvent('event2');
                _.expect(count).toEqual(2);
                box.destroy();
                _.expect(count).toEqual(2);
                box.dispatchEvent('event1');
                _.expect(count).toEqual(3);
                box.directive('EventManager').reset();
                _.expect(count).toEqual(3);
                box.dispatchEvent('event2');
                _.expect(count).toEqual(3);
            });
            _.it('conversely, if the box has listening objects, it will remove it\'s handlers from other objects', function () {
                var box2 = factories.Model();
                box.listenTo(box2, {
                    event1: counter,
                    event2: counter
                });
                _.expect(count).toEqual(0);
                box2.dispatchEvent('event1');
                _.expect(count).toEqual(1);
                box2.dispatchEvent('event2');
                _.expect(count).toEqual(2);
                box.destroy();
                _.expect(count).toEqual(2);
                box2.dispatchEvent('event1');
                _.expect(count).toEqual(2);
                box2.dispatchEvent('event2');
                _.expect(count).toEqual(2);
            });
        });
        _.describe('there is also an alternative to the on api called the watch api', function () {
            _.it('it can attach event listeners', function () {
                var count = 0;
                box.watch('there', 'there', function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box.set('there', 'here');
                _.expect(count).toEqual(0);
                box.set('there', 'there');
                _.expect(count).toEqual(1);
                box.set('there', 'here');
                _.expect(count).toEqual(1);
                box.set('there', 'there');
                _.expect(count).toEqual(2);
            });
            _.it('and watch variables dynamically', function () {
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
                _.expect(count).toEqual(0);
                box.set('there', 'here');
                _.expect(count).toEqual(0);
                box.set('there', 'there');
                _.expect(count).toEqual(1);
                box.set('there', 'here');
                _.expect(count).toEqual(1);
                box.set('there', 'there');
                _.expect(count).toEqual(2);
            });
            _.it('it does not have a context in the first argument', function () {
                var count = 0;
                box.watch('there', function (e) {
                    return e.origin === box && this !== box;
                }, function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box.set('there', 'here');
                _.expect(count).toEqual(1);
                box.set('there', 'there');
                _.expect(count).toEqual(2);
            });
            _.it('it does can attach listeners using the once api', function () {
                var count = 0;
                box.watchOnce('there', 'there', function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box.set('there', 'here');
                _.expect(count).toEqual(0);
                box.set('there', 'there');
                _.expect(count).toEqual(1);
                box.set('there', 'here');
                _.expect(count).toEqual(1);
                box.set('there', 'there');
                _.expect(count).toEqual(1);
            });
            _.it('and listeners on other objects with the watchOther api', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOther(box2, 'there', function (e) {
                    count++;
                    return e.target === box && this !== box;
                }, function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box2.set('there', 'here');
                _.expect(count).toEqual(1);
                box2.set('there', 'there');
                _.expect(count).toEqual(2);
                box2.set('there', 'here');
                _.expect(count).toEqual(3);
                box2.set('there', 'there');
                _.expect(count).toEqual(4);
            });
            _.it('and listeners on other objects with the watchOther api', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOtherOnce(box2, 'there', 'there', function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box2.set('there', 'there');
                _.expect(count).toEqual(1);
                box2.set('there', 'here');
                _.expect(count).toEqual(1);
            });
            _.it('the once handler will only take itself off when it succeeds', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOtherOnce(box2, 'there', 'there', function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box2.set('there', 'here');
                _.expect(count).toEqual(0);
                box2.set('there', 'there');
                _.expect(count).toEqual(1);
                box2.set('there', 'here');
                _.expect(count).toEqual(1);
                box2.set('there', 'there');
                _.expect(count).toEqual(1);
            });
        });
    });
});
application.scope().run(function (app, _, factories) {
    _.describe('Promise', function () {
        var madeit, promise, handler = function () {
            madeit++;
        };
        _.beforeEach(function () {
            madeit = 0;
            promise = factories.Promise();
        });
        _.it('allows for async resolution of state', function () {
            _.expect(_.isObject(promise)).toEqual(true);
            promise.always(handler);
            // test for premature trigger
            _.expect(madeit).toEqual(0);
            // make sure promise is an object
            _.expect(_.isObject(promise)).toEqual(true);
            // make sure it has the right "state"
            _.expect(promise.state).toEqual('pending');
            // fulfill the promise
            promise.fulfill();
            // make sure that it hit the function once and only once
            _.expect(madeit).toEqual(1);
            // make sure it has the correct state after resolution
            _.expect(promise.state).toEqual('success');
        });
        _.it('can tell you if it has fulfilled or not', function () {
            _.expect(promise.is('fulfilled')).toEqual(false);
            promise.fulfill();
            _.expect(promise.is('fulfilled')).toEqual(true);
        });
        _.describe('can tell you what state it is in such as', function () {
            _.it('pending', function () {
                _.expect(promise.state).toEqual('pending');
            });
            _.it('success', function () {
                promise.fulfill();
                _.expect(promise.state).toEqual('success');
            });
            _.it('failure', function () {
                promise.reject();
                _.expect(promise.state).toEqual('failure');
            });
        });
        _.describe('or it can give you a boolean value for resolutions like', function () {
            _.it('success', function () {
                promise.fulfill();
                _.expect(promise.is('fulfilled')).toEqual(true);
            });
            _.it('failure', function () {
                promise.reject();
                _.expect(promise.is('rejected')).toEqual(true);
            });
        });
        _.describe('can fulfill to different states such as', function () {
            _.it('success', function (done) {
                // attach handler
                promise.success(handler);
                setTimeout(function () {
                    // fulfill promise for success
                    promise.fulfill();
                    // expect madeit to increase
                    _.expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                });
            });
            _.it('failure', function (done) {
                // attach failure handler
                promise.failure(handler);
                setTimeout(function () {
                    // fulfill promise for failure
                    promise.reject();
                    // expect madeit to increase
                    _.expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                });
            });
        });
        _.describe('but it also can trigger functions on any resolution with the always method such as', function () {
            _.it('fulfill', function (done) {
                // attach always handler
                promise.success(handler);
                promise.always(handler);
                setTimeout(function () {
                    // fulfill promise for failure
                    promise.fulfill();
                    // expect madeit to increase
                    _.expect(madeit).toEqual(2);
                    // let jasmine know we're all good
                    done();
                });
                _.expect(madeit).toEqual(0);
            });
            _.it('reject', function (done) {
                // attach always handler
                promise.failure(handler);
                promise.always(handler);
                setTimeout(function () {
                    // reject promise
                    promise.reject();
                    // expect madeit to increase
                    _.expect(madeit).toEqual(2);
                    // let jasmine know we're all good
                    done();
                });
                _.expect(madeit).toEqual(0);
            });
        });
        _.describe('creates a tree of dependencies', function () {
            _.it('always is a nonstring (so it terminates)', function () {
                var allstates = promise.allStates();
                _.expect(!_.isString(allstates.always)).toEqual(true);
            });
            _.it('success is set to always', function () {
                var allstates = promise.allStates();
                _.expect(allstates.success).toEqual('always');
            });
            _.it('failure is set to always', function () {
                var allstates = promise.allStates();
                _.expect(allstates.failure).toEqual('always');
            });
            // _.it('error is set to always', function () {
            //     var allstates = promise.allStates();
            //     _.expect(allstates.error).toEqual('always');
            // });
        });
    });
});
application.scope().run(function (app, _, factories) {
    var registry = factories.Associator();
    _.describe('Registry', function () {
        _.beforeEach(function () {});
        _.it('is made by the specless object', function () {
            _.expect(_.isInstance(registry, factories.Associator)).toEqual(true);
        });
        _.it('is not a collection', function () {
            _.expect(_.isInstance(registry, factories.Collection)).toEqual(false);
        });
        _.it('can save data against pointers', function () {
            registry.set(window, {
                some: 'data'
            });
            _.expect(registry.get(window).some).toEqual('data');
        });
        _.it('can also get any group of data that the same type', function () {
            var one = {},
                two = {};
            registry.set(one, {
                one: 1
            });
            registry.set(two, {
                two: 2
            });
            _.expect(_.keys(registry.sameType(two).__elid__).length).toEqual(2);
        });
    });
});
application.scope().run(function (app, _, factories) {
    var BOOLEAN_TRUE = true,
        isObject = _.isObject;
    _.describe('HTTP', function () {
        var ajax, allstates;
        _.beforeEach(function () {
            ajax = factories.HTTP();
            allstates = ajax.allStates();
        });
        _.it('is an object', function () {
            _.expect(isObject(ajax)).toEqual(BOOLEAN_TRUE);
        });
        _.it('can accept an object as a first argument', function (done) {
            factories.HTTP({
                url: '/json/reporting.json'
            }).success(function (json) {
                _.expect(isObject(json)).toEqual(BOOLEAN_TRUE);
                done();
            });
        });
        _.it('can accept a string as a first argument', function (done) {
            var original, handlerCounter = 0;
            factories.HTTP('/json/reporting.json').success(function (json) {
                _.expect(original !== json).toEqual(BOOLEAN_TRUE);
            }).handle('status:200', function (json) {
                handlerCounter++;
                original = json;
            }).success(function (json) {
                handlerCounter++;
                _.expect(original === json).toEqual(BOOLEAN_TRUE);
            }).always(function () {
                handlerCounter++;
                _.expect(handlerCounter).toEqual(3);
                done();
            });
        });
        _.describe('can handle', function () {
            _.it('failures', function (done) {
                var handlerCounter = 0;
                var prom = factories.HTTP().failure(function () {
                    handlerCounter++;
                }).always(function () {
                    handlerCounter++;
                    _.expect(handlerCounter).toEqual(2);
                    done();
                });
                prom.reject();
            });
            _.it('errors', function (done) {
                var handlerCounter = 0;
                factories.HTTP('/json/reporting.json').success(function (json) {
                    handlerCounter++;
                    _.expect(handlerCounter).toEqual(1);
                    throw new Error('some message here');
                }).catch(function () {
                    handlerCounter++;
                }).always(function () {
                    handlerCounter++;
                    _.expect(handlerCounter).toEqual(3);
                    done();
                });
            });
            _.describe('status codes (more than the ones listed here)', function () {
                _.it('200', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/200').handle('status:200', function () {
                        handlerCounter++;
                    }).success(function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter--;
                    }).always(function () {
                        handlerCounter++;
                        _.expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
                _.it('404', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/404').handle('status:404', function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter++;
                    }).always(function () {
                        handlerCounter++;
                        _.expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
                _.it('500', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/500').handle('status:500', function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter++;
                    }).always(function () {
                        handlerCounter++;
                        _.expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
            });
        });
        _.describe('status codes are used as a layer over success and failure', function () {
            _.it('200 is success', function () {
                _.expect(allstates['status:200']).toEqual('success');
            });
            _.it('202 is success', function () {
                _.expect(allstates['status:202']).toEqual('success');
            });
            _.it('204 is success', function () {
                _.expect(allstates['status:204']).toEqual('success');
            });
            _.it('205 is success', function () {
                _.expect(allstates['status:205']).toEqual('success');
            });
            _.it('302 is success', function () {
                _.expect(allstates['status:302']).toEqual('success');
            });
            _.it('304 is success', function () {
                _.expect(allstates['status:304']).toEqual('success');
            });
            _.it('400 is failure', function () {
                _.expect(allstates['status:400']).toEqual('failure');
            });
            _.it('401 is failure', function () {
                _.expect(allstates['status:401']).toEqual('failure');
            });
            _.it('403 is failure', function () {
                _.expect(allstates['status:403']).toEqual('failure');
            });
            _.it('404 is failure', function () {
                _.expect(allstates['status:404']).toEqual('failure');
            });
            _.it('405 is failure', function () {
                _.expect(allstates['status:405']).toEqual('failure');
            });
            _.it('406 is failure', function () {
                _.expect(allstates['status:406']).toEqual('failure');
            });
            _.it('500 is failure', function () {
                _.expect(allstates['status:500']).toEqual('failure');
            });
            _.it('502 is failure', function () {
                _.expect(allstates['status:502']).toEqual('failure');
            });
            _.it('505 is failure', function () {
                _.expect(allstates['status:505']).toEqual('failure');
            });
            _.it('511 is failure', function () {
                _.expect(allstates['status:511']).toEqual('failure');
            });
        });
    });
});
application.scope().run(function (app, _, factories) {
    _.describe('Modules', function () {
        var level = app.module('level');
        var lower = app.module('level.lower');
        var lowered = app.module('level.lower.lowered');
        _.it('can have children', function () {
            _.expect(lower.parent === level).toEqual(true);
            _.expect(lower === lowered.parent).toEqual(true);
        });
        _.it('can access it\'s children through the exact same api', function () {
            _.expect(lower.module('lowered') === lowered).toEqual(true);
            _.expect(lower === level.module('lower')).toEqual(true);
        });
        _.it('can be initialized after it is created', function () {
            var count = 0;
            app.module('level.lower', function () {
                count++;
            });
            _.expect(count).toEqual(1);
        });
        _.it('passes itself into it\'s initializing functions', function () {
            var count = 0;
            app.module('lower', function (module, app_, _, factories) {
                count = 1;
                _.expect(module).toEqual(app.module('lower'));
                _.expect(app_).toEqual(app);
                _.expect(_).toEqual(app._);
                _.expect(factories).toEqual(_.factories);
            });
            _.expect(count).toEqual(1);
        });
        _.it('can have multiple generation handlers', function () {
            var count = 0;
            app.module('level', function () {
                count++;
            });
            _.expect(count).toEqual(1);
            app.module('level', function () {
                count += 2;
            });
            _.expect(count).toEqual(3);
        });
        _.it('can have exports (can hold data)', function () {
            level.publicize({
                one: 1,
                two: 2
            });
            _.expect(level.exports.one).toEqual(1);
            _.expect(level.exports.two).toEqual(2);
        });
        _.it('which is like giving public data', function () {
            var mod = app.module('newmodule', function () {
                this.publicize({
                    here: 'there'
                });
            });
            _.expect(app.require('newmodule').here).toEqual('there');
            _.expect(function () {
                app.require('somenonexistantmodule');
            }).toThrow();
        });
    });
});
// $.registerElement('tester', {
//     creation: function () {
//         debugger;
//     }
// });
application.scope().run(function (app, _, factories) {
    var elementData = _.associator;
    _.describe('DOMA', function () {
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
            },
            $con = $.createElement('div').css({
                height: '100%',
                width: '100%'
            });
        $(document.body).append($con);
        _.beforeEach(create);
        _.afterEach(function () {
            divs.destroy();
        });
        _.it('is essentially a collection', function () {
            _.expect(_.isInstance($empty, factories.DOMA)).toEqual(true);
            _.expect(_.isInstance($empty, factories.Collection)).toEqual(true);
        });
        _.it('it knows it\'s own client rect', function () {
            var div = divs.first();
            var rect = div.element().getBoundingClientRect();
            _.expect(div.client()).toEqual({
                height: rect.height,
                width: rect.width,
                bottom: rect.bottom,
                right: rect.right,
                left: rect.left,
                top: rect.top,
            });
        });
        _.it('can show and hide elements', function () {
            _.expect(divs.hide().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'none') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
            _.expect(divs.show().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'block') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
        });
        _.it('can attach dom elements', function () {
            var div = divs.eq();
            div.append(divs.item(1));
            _.expect(divs.children().item(0)).toEqual(divs.item(1));
        });
        _.it('can remove dom elements', function () {
            var div = divs.eq();
            div.append(divs.item(1));
            _.expect(divs.children().item(0)).toEqual(divs.item(1));
            div.children().remove();
            _.expect(div.children().length()).toEqual(0);
        });
        _.describe('except it has some methods that are highly pertinant to DOM manipulation... ergo: DOMA', function () {
            // _.it('can check if its items are windows', function () {
            //     _.expect($win.isWindow()).toEqual(true);
            //     _.expect($doc.isWindow()).toEqual(false);
            //     _.expect($body.isWindow()).toEqual(false);
            // });
            // _.it('can check if its items are documents', function () {
            //     _.expect($win.isDocument()).toEqual(false);
            //     _.expect($doc.isDocument()).toEqual(true);
            //     _.expect($body.isDocument()).toEqual(false);
            // });
            _.it('can check if its items are actually elements', function () {
                _.expect($win.allElements()).toEqual(false);
                _.expect($doc.allElements()).toEqual(false);
                _.expect($body.allElements()).toEqual(true);
                _.expect($('div').allElements()).toEqual(true);
            });
            // _.it('can check if its items are document fragments', function () {
            //     var frag = document.createDocumentFragment();
            //     frag.appendChild(document.createElement('div'));
            //     _.expect($win.isFragment()).toEqual(false);
            //     _.expect($doc.isFragment()).toEqual(false);
            //     _.expect($body.isFragment()).toEqual(false);
            //     _.expect($('div').isFragment()).toEqual(false);
            //     _.expect($(frag).isFragment()).toEqual(true);
            // });
        });
        _.describe('it can filter itself', function () {
            _.it('by query string matching', function () {
                var newDivs = divs.filter('.two');
                _.expect(newDivs.length()).toEqual(2);
            });
            _.it('by filtering against a function', function () {
                var newDivs = divs.filter(function (item, idx) {
                    return ((idx % 3) - 1) === 0;
                });
                _.expect(newDivs.length()).toEqual(2);
                _.expect(newDivs.get()).toEqual(divs.get(1));
                _.expect(newDivs.get(1)).toEqual(divs.get(4));
            });
            _.it('by passing in an object', function () {
                var newDivs = divs.filter({
                    className: 'one not'
                });
                _.expect(newDivs.length()).toEqual(3);
            });
            _.it('can also get the first', function () {
                _.expect(divs.first()).toEqual(divs.item(0));
            });
            _.it('and the last element in the list', function () {
                _.expect(divs.last()).toEqual(divs.item(divs.length() - 1));
            });
        });
        _.describe('it can find it\'s children', function () {
            _.it('by calling the children method', function () {
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
                _.expect(kids.length()).toEqual(10);
                kids.duff(function (kid, idx) {
                    _.expect(kid.element().localName).toEqual('span');
                });
                kids = divs.children(1);
                _.expect(kids.length()).toEqual(5);
                kids = divs.children('.span-2');
                _.expect(kids.unwrap()).toEqual(divs.children().filter('.span-2').unwrap());
                _.expect(kids.length()).toEqual(2);
                _.expect(kids.element() === kids.item(1)).toEqual(false);
            });
            _.it('by querying the dom elements', function () {
                divs.duff(function (div, idx) {
                    div.element().innerHTML = '<span></span><img/>';
                });
                var kids = divs.$('img');
                _.expect(kids.length()).toEqual(5);
                kids.duff(function (kid, idx) {
                    _.expect(kid.element().tagName).toEqual('IMG');
                });
            });
        });
        _.describe('it can also find it\'s parents', function () {
            _.it('either by counting up', function () {
                var $start = $('.leaves'),
                    $end = $('.tree'),
                    end = $start.parent(2);
                _.expect(end.first().element()).toEqual($end.first().element());
            });
            _.it('or by finding via selector', function () {
                var $start = $('.leaves'),
                    $end = $('.tree'),
                    end = $start.parent('.tree');
                _.expect(end.first().element()).toEqual($end.first().element());
            });
            _.it('or by passing a function', function () {
                var $start = $('.leaves'),
                    end = $start.parent(function (el) {
                        var parent = el.parentNode;
                        return [parent, parent && parent.tagName === 'BODY'];
                    });
                _.expect(end.item(0).element()).toEqual(document.body);
            });
            _.describe('or by passing a keyword', function () {
                _.it('like document', function () {
                    var $start = $('.leaves'),
                        end = $start.parent('document');
                    _.expect(end.first().element()).toEqual(document);
                });
                _.it('or window', function () {
                    var $start = $('.leaves'),
                        end = $start.parent('window');
                    _.expect(end.first().element()).toEqual(window);
                });
            });
        });
        _.describe('all of this traversing can be undone', function () {
            _.it('with the end method', function () {
                var $start = $('.results .failures');
                var $next = $start.parent();
                $next = $next.children();
                $next = $next.end();
                _.expect($next === $start).toEqual(true);
            });
        });
        _.describe('the domm is also special because it abstracts event listeners for you', function () {
            _.describe('can add handlers', function () {
                _.it('one at a time', function () {
                    divs.on('click', handler);
                    _.expect(count).toEqual(0);
                    divs.click();
                    _.expect(count).toEqual(5);
                });
                _.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    _.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    _.expect(count).toEqual(15);
                });
            });
        });
        _.describe('the domm is also special because it abstracts event listeners for you', function () {
            _.describe('can add handlers', function () {
                _.it('one at a time', function () {
                    divs.on('click', handler);
                    _.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    _.expect(count).toEqual(5);
                });
                _.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    _.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    _.expect(count).toEqual(15);
                });
            });
            _.describe('also capture handlers', function () {
                _.it('one at a time', function () {
                    divs.on('click', handler, true);
                    _.expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    _.expect(count).toEqual(5);
                });
                _.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler, true);
                    _.expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    divs.dispatchEvent('mouseover', {}, true);
                    divs.dispatchEvent('mouseout', {}, true);
                    _.expect(count).toEqual(15);
                });
            });
            _.it('will only add a method to the queue once. if a duplicate is passed in, it will be ignored (just like the browser implementation)', function () {
                divs.on('click', handler).on('click', handler);
                _.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(10);
            });
            _.it('once wrappers can also be used with the once method and they can be added the same way as once', function () {
                divs.once('click', handler);
                _.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(5);
            });
            _.it('be careful with the once function because they can be added multiple times to the queue, since they use a proxy function, like the one available at _.once', function () {
                divs.once('click', handler);
                _.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(5);
            });
        });
        _.describe('the each function is special because', function () {
            _.it('it wraps each element in a DOMA object before passing it through your iterator', function () {
                divs.each(function (el, idx) {
                    _.expect(_.isInstance(el, factories.DOMA)).toEqual(false);
                    _.expect(factories.DomManager.isInstance(el)).toEqual(true);
                    _.expect(divs.item(idx) === el.element());
                });
            });
            _.it('where the duff and forEach function just gives you the element at each index, just like a collection', function () {
                divs.duff(function (el, idx) {
                    _.expect(_.isInstance(el, $)).toEqual(false);
                });
                divs.forEach(function (el, idx) {
                    _.expect(_.isInstance(el, $)).toEqual(false);
                });
            });
        });
        _.describe('adding and removing classes is done by string checking instead of the classList to invoke only one reflow', function () {
            _.it('you can use addClass', function () {
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('three')).toEqual(false);
                });
                divs.addClass('three');
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('three')).toEqual(true);
                });
            });
            _.it('you can use removeClass', function () {
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('three')).toEqual(false);
                });
                _.expect(divs.hasClass('three')).toEqual(false);
                divs.addClass('three');
                _.expect(divs.hasClass('three')).toEqual(true);
            });
            _.it('you can use hasClass to check if all of the elements has a particular class', function () {
                _.expect(divs.hasClass('two')).toEqual(false);
                _.expect(divs.hasClass('one')).toEqual(true);
            });
            _.it('you can use toggleClass swap classes depending on whether or not they exist on each element', function () {
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('one')).toEqual(true);
                });
                divs.toggleClass('one');
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('one')).toEqual(false);
                });
            });
            _.it('it will also do this for individual elements', function () {
                var list = [],
                    unique = [];
                divs.each(function (div, idx) {
                    var res = div.hasClass('two');
                    list.push(res);
                    _.add(unique, res);
                });
                divs.toggleClass('two');
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('two')).toEqual(!list[idx]);
                });
                _.expect(unique.length > 1).toEqual(true);
            });
            _.it('you can also use changeClass as a shorthand of removeClass and addClass', function () {
                divs.changeClass('one not two', 'three');
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('one')).toEqual(false);
                    _.expect(div.hasClass('two')).toEqual(false);
                    _.expect(div.hasClass('not')).toEqual(false);
                    _.expect(div.hasClass('three')).toEqual(true);
                });
            });
        });
        _.describe('there is also a data attributes interface', function () {
            _.it('where you can add', function () {
                divs.duff(function (div, idx) {
                    _.expect(div.element().getAttribute('data-one')).toEqual(null);
                    _.expect(div.element().getAttribute('data-two')).toEqual(null);
                });
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    _.expect(div.element().getAttribute('data-one')).toEqual('one');
                    _.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
            _.it('remove', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    _.expect(div.element().getAttribute('data-one')).toEqual('one');
                    _.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
                divs.data({
                    one: false,
                    two: false
                });
                divs.duff(function (div, idx) {
                    _.expect(div.element().getAttribute('data-one')).toEqual(null);
                    _.expect(div.element().getAttribute('data-two')).toEqual(null);
                });
            });
            _.it('and update data attributes', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div) {
                    _.expect(div.element().getAttribute('data-one')).toEqual('one');
                    _.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
        });
        _.describe('it can also manipulate elements in other ways', function () {
            _.it('like by manipulating their attributes', function () {
                divs.duff(function (div) {
                    _.expect(div.element().getAttribute('tabindex')).toEqual(null);
                });
                divs.attr({
                    tabindex: -1
                });
                divs.each(function (div, idx) {
                    _.expect(div.attr('tabindex')).toEqual(-1);
                });
            });
            _.it('or by manipulating their properties', function () {
                divs.duff(function (div, idx) {
                    _.expect(div.element().align).toEqual('');
                });
                divs.prop({
                    align: 'left'
                });
                divs.each(function (div, idx) {
                    _.expect(div.prop('align')).toEqual('left');
                });
            });
        });
        _.describe('can have specialized elements', function () {
            _.describe('has lifecycle events', function () {
                _.it('like attach', function () {
                    divs.remove();
                    divs.on('attach', handler);
                    _.expect(count).toEqual(0);
                    $con.append(divs);
                    _.expect(count).toEqual(5);
                });
                _.it('and detach', function () {
                    divs.once('detach', handler);
                    _.expect(count).toEqual(0);
                    divs.remove();
                    _.expect(count).toEqual(5);
                });
                _.it('and attribute change', function () {
                    divs.once('attributeChange:data-here', handler);
                    _.expect(count).toEqual(0);
                    divs.data('here', 1);
                    _.expect(count).toEqual(5);
                });
            });
            _.describe('there are also special handlers', function () {
                _.it('like create', function () {
                    $.registerElement('test0', {
                        creation: handler
                    });
                    _.expect(count).toEqual(0);
                    $.createElement('test0');
                    _.expect(count).toEqual(1);
                });
                _.it('and destroy', function () {
                    $.registerElement('test1', {
                        destruction: handler
                    });
                    var div = $.createElement('test1');
                    _.expect(count).toEqual(0);
                    div.destroy();
                    _.expect(count).toEqual(1);
                });
            });
        });
        _.it('tags cannot be created without being registered first', function () {
            _.expect(function () {
                $.createElement('unregistered');
            }).toThrow();
        });
        _.it('tags are automatically queried for and registered', function () {});
    });
});
application.scope().run(function (app, _, factories) {
    _.describe('Looper', function () {
        //
    });
});

application.scope().run(function (app, _, factories) {
    _.describe('View', function () {
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
        app.RegionManager.add('main', '.test-div');
        _.beforeEach(function () {
            count = 0;
            view = factories.View();
            complexView = ComplexView();
        });
        _.afterEach(function () {
            view.destroy();
            complexView.destroy();
        });
        _.it('is an object', function () {
            _.expect(_.isObject(view)).toEqual(true);
            _.expect(_.isInstance(view, factories.View)).toEqual(true);
        });
        _.it('has an element that you can interact with', function () {
            _.expect(_.isInstance(view.el, factories.DomManager)).toEqual(true);
            window.readytostop = true;
        });
        // this test is invalid because there should be no ui available before render
        _.it('can even have extra elements tied to it... but only when it is rendered', function () {
            _.expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            _.expect(_.isInstance(complexView.ui.there, factories.DOMA)).toEqual(true);
        });
        _.it('can be rendered', function () {
            _.expect(complexView.el.html()).toEqual('');
            complexView.render();
            _.expect(complexView.el.html()).not.toEqual('');
        });
        _.it('can be attached to a region', function () {
            _.expect(complexView.el.element().parentNode).toEqual(null);
            app.RegionManager.get('main').add(complexView);
            _.expect(complexView.el.element().parentNode).not.toEqual(null);
        });
        _.it('can be filtered', function () {
            _.expect(complexView.el.element().parentNode).toEqual(null);
            complexView.filter = function () {
                return false;
            };
            app.RegionManager.get('main').add(complexView);
            _.expect(complexView.el.element().parentNode).toEqual(null);
        });
        _.it('can have extra elements', function () {
            _.expect(_.isObject(complexView.ui)).toEqual(true);
            _.expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            _.expect(_.isInstance(complexView.ui.there, factories.DOMA)).toEqual(true);
            _.expect(complexView.ui.there.length()).toEqual(1);
        });
        _.it('can also attach events to it\'s element', function () {
            _.expect(count).toEqual(0);
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.el.click();
            _.expect(count).toEqual(1);
            complexView.render();
            _.expect(count).toEqual(1);
            complexView.el.click();
            _.expect(count).toEqual(2);
        });
        _.it('as well as it\'s ui elements', function () {
            _.expect(count).toEqual(0);
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.render();
            _.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.expect(count).toEqual(2);
        });
        _.it('views can be detached', function () {
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.remove();
            _.expect(count).toEqual(1);
        });
        _.it('and still keep their elements and events intact', function () {
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.remove();
            _.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.expect(count).toEqual(2);
        });
        _.it('they can even be reattached', function () {
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.remove();
            _.expect(count).toEqual(1);
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.expect(count).toEqual(2);
        });
        _.it('when they are destroyed however, their events are detached from the element and the view is automatically removed', function () {
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            var there = complexView.ui.there;
            there.click();
            _.expect(count).toEqual(1);
            complexView.destroy();
            _.expect(count).toEqual(1);
            there.click();
            _.expect(count).toEqual(1);
        });
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
        pagePromise = factories.HTTP.get('/test/framed.html');
    _.describe('Buster', function () {
        _.beforeEach(function () {
            count = 0;
        });
        _.describe('can receive messages on', function () {
            _.it('unfriendly windows', function (done) {
                var iframe = $.createElement('iframe');
                app.RegionManager.get('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8000/test/framed.html'
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    _.expect(count).toEqual(1);
                });
                buster.create('delayed').response(handler).deferred(function (e) {
                    _.expect(e.data().success).toEqual(true);
                    _.expect(count).toEqual(2);
                    iframe.destroy(done);
                }).send();
            });
            _.it('windows without a source', function (done) {
                pagePromise.success(function (response) {
                    var iframe = $.createElement('iframe');
                    app.RegionManager.get('main').el.append(iframe);
                    var buster = factories.Buster(window, iframe, {
                        iframeContent: response
                    });
                    buster.connected(handler);
                    buster.sync(function (e) {
                        _.expect(count).toEqual(1);
                    });
                    buster.create('delayed').response(handler).deferred(function (e) {
                        _.expect(e.data().success).toEqual(true);
                        _.expect(count).toEqual(2);
                        iframe.destroy(done);
                    }).send();
                });
            });
            _.it('friendly windows', function (done) {
                var iframe = $.createElement('iframe');
                app.RegionManager.get('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8080/test/framed.html'
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    _.expect(count).toEqual(1);
                });
                buster.create('delayed').response(handler).deferred(function (e) {
                    _.expect(e.data().success).toEqual(true);
                    _.expect(count).toEqual(2);
                    iframe.destroy(done);
                }).send();
            });
        });
    });
});
// application.scope().run(function (app, _) {
//     _.describe('evaluate needs it\'s own space to be tested', function () {
//         var windo = _.factories.Window(window);
//         _.it('_.evaluate', function (done) {
//             windo._ = _;
//             windo.done = done;
//             windo.console.log = function (comparison) {
//                 // replace windo with a custom log function
//                 _.expect(comparison).not.toBe(window);
//             };
//             _.expect(function () {
//                 _.evaluate(windo, function () {
//                     var count = 0;
//                     var called = 0;
//                     var check = function () {
//                         ++count;
//                         if (count < called) {
//                             return;
//                         }
//                         done();
//                     };
//                     var fn = function () {
//                         console.log(this);
//                         console.log(window);
//                     };
//                     console.log(this);
//                     console.log(window);
//                     fn();
//                     called++;
//                     setTimeout(function () {
//                         console.log(this);
//                         console.log(window);
//                         fn();
//                         check();
//                     });
//                     called++;
//                     requestAnimationFrame(function () {
//                         console.log(this);
//                         console.log(window);
//                         fn();
//                         check();
//                     });
//                 });
//             }).not.toThrow();
//             _.expect(function () {
//                 _.evaluate(windo, function () {
//                     glob = function () {
//                         console.log(this);
//                         console.log(window);
//                     };
//                 });
//             }).toThrow();
//             _.expect(function () {
//                 _.evaluate(windo, function () {
//                     // remove ability to use Function Constructors if we can't get rid of eval
//                     eval('var fn = new Function.constructor("console.log(this);");fn();');
//                 });
//             }).toThrow();
//             _.expect(_.evaluate(windo, function () {
//                 var cachedInnerHeight = innerHeight;
//                 delete window.innerHeight;
//                 _.expect(window.innerHeight).toEqual(void 0);
//                 _.expect(innerHeight).toEqual(cachedInnerHeight);
//                 return innerHeight;
//             })).toEqual(void 0);
//         });
//     });
// });