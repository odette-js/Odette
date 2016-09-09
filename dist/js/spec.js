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
application.scope().run(function (app, _) {
    _.test.describe('Strings', function () {
        _.test.it('_.camelCase', function () {
            var thatIsCamelCased = 'thisIsCamelCased';
            // default delimiter is -
            _.test.expect(_.camelCase('this-is-camel-cased')).toEqual(thatIsCamelCased);
            _.test.expect(_.camelCase('thisIsCamelCased')).toEqual(thatIsCamelCased);
            // overridable by second param
            _.test.expect(_.camelCase('this_is_camel_cased')).toEqual(thatIsCamelCased);
            _.test.expect(_.camelCase('this is camel cased')).toEqual(thatIsCamelCased);
            // does not modify the first character if it is passed in as a capital letter
            // _.test.expect(_.camelCase('This Is Camel Cased', ' ')).not.toEqual(thatIsCamelCased);
        });
        _.test.it('_.capitalize', function () {
            _.test.expect(_.capitalize('some')).toEqual('Some');
            _.test.expect(_.capitalize('Some')).toEqual('Some');
            _.test.expect(_.capitalize('sOmE')).toEqual('SOmE');
        });
        // _.test.it('_.unCamelCase', function () {
        //     var thatIsCamelCased = 'thisIsUnCamelCased';
        //     _.test.expect(_.unCamelCase(thatIsCamelCased)).toEqual('this-is-un-camel-cased');
        //     _.test.expect(_.unCamelCase(thatIsCamelCased, ' ')).toEqual('this is un camel cased');
        //     _.test.expect(_.unCamelCase(thatIsCamelCased, '_')).toEqual('this_is_un_camel_cased');
        //     _.test.expect(_.unCamelCase(thatIsCamelCased, '1')).toEqual('this1is1un1camel1cased');
        // });
        _.test.describe('_.customUnits', function () {
            _.test.it('does not use any root, or base units', function () {
                _.test.expect(_.customUnits('1000whats', ['evers', 'whats'])).toEqual('whats');
                _.test.expect(_.customUnits('1000px', [])).toEqual(false);
            });
        });
        _.test.it('_.reference', function () {
            _.test.expect(_.isString(_.reference(document))).toEqual(true);
        });
        _.test.it('_.string.match', function () {
            _.test.expect(_.string.match('strings are my stringy friends', 'string')).toEqual(['string']);
        });
        _.test.it('_.string.toLowerCase', function () {
            _.test.expect(_.string.toLowerCase('YaYlOwErcasD')).toEqual('yaylowercasd');
        });
        _.test.it('_.string.toUpperCase', function () {
            _.test.expect(_.string.toUpperCase('YaYlOwErcasD')).toEqual('YAYLOWERCASD');
        });
        _.test.it('_.baseUnitList', function () {
            _.test.expect(_.baseUnitList.slice(0).sort()).toEqual(['vmax', 'vmin', 'rem', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'vh', 'vw', '%'].slice(0).sort());
        });
        _.test.it('_.parseHash', function () {
            _.test.expect(_.parseHash('#{"things":true}')).toEqual({
                things: true
            });
            _.test.expect(_.parseHash('#route/here')).toEqual('route/here');
            _.test.expect(_.parseHash('#48330382')).toEqual(48330382);
            _.test.expect(_.parseHash('#48330382/2891-44303')).toEqual('48330382/2891-44303');
        });
        _.test.it('_.isHttp', function () {
            _.test.expect(_.isHttp('http://localhost:8080')).toEqual(true);
            _.test.expect(_.isHttp('https://localhost:8080')).toEqual(true);
            _.test.expect(_.isHttp('//localhost:8080')).toEqual(true);
            _.test.expect(_.isHttp('localhost:8080')).toEqual(false);
            _.test.expect(_.isHttp('//localhost:8080//')).toEqual(false);
            _.test.expect(_.isHttp(' //localhost:8080')).toEqual(false);
            _.test.expect(_.isHttp('//localhost/alsdf.js')).toEqual(true);
        });
        _.test.it('can return a time, in ms from now when given a string', function () {
            _.test.expect(_.time('1secs')).toEqual(1000);
        });
        _.test.it('can even take compunded time in a comma delineated list', function () {
            _.test.expect(_.time('9hrs,3mins,5secs')).toBe((9 * 1000 * 60 * 60) + (3 * 1000 * 60) + (5 * 1000));
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Collection', function () {
        var collection, numberCollection, complexCollection, evenNumberList;
        _.test.beforeEach(function () {
            collection = factories.Collection();
            numberCollection = factories.Collection([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            complexCollection = factories.Collection([factories.Model(), factories.Model({
                one: 1,
                two: 2,
                three: 3
            })]);
            evenNumberList = [0, 2, 4, 6, 8];
        });
        _.test.it('extends from factories.Extendable', function () {
            _.test.expect(_.isInstance(collection, factories.Extendable)).toEqual(true);
        });
        _.test.it('is not an array like object', function () {
            _.test.expect(_.isArrayLike(collection)).toEqual(false);
        });
        _.test.it('knows it\'s length', function () {
            _.test.expect(numberCollection.length()).toEqual(10);
        });
        _.test.it('can give you all of it\'s values at once', function () {
            _.test.expect(collection.toArray()).toEqual(collection.items);
        });
        _.test.it('or one at a time', function () {
            numberCollection.duff(function (item, idx) {
                _.test.expect(numberCollection.item(idx)).toEqual(numberCollection.items[idx]);
            });
        });
        _.test.it('as well as in reverse order', function () {
            var list = [];
            numberCollection.duffRight(function (item, idx) {
                _.test.expect(numberCollection.item(idx)).toEqual(numberCollection.items[idx]);
                list.push(item);
            });
            _.test.expect(list).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        });
        _.test.it('can trigger toJSON on children', function () {
            _.test.expect(JSON.stringify(numberCollection)).toEqual('[0,1,2,3,4,5,6,7,8,9]');
            _.test.expect(JSON.stringify(complexCollection)).toEqual('[{},{"one":1,"two":2,"three":3}]');
        });
        _.test.it('can also concatonate itself with collections and arrays just like a regular array', function () {
            var collection = factories.Collection([0, 1, 2, 3, 4]),
                list = factories.Collection([5, 6, 7, 8, 9]);
            _.test.expect(collection.concat(list, evenNumberList).toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2, 4, 6, 8]);
        });
        // _.test.it('can also reverse itself momentarily', function () {
        //     var test = [];
        //     numberCollection.mambo(function (list) {
        //         list.duff(function (val) {
        //             test.push(val);
        //         });
        //     });
        //     _.test.expect(test).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        // });
        _.test.describe('but other methods need arrays... Collections also have a bunch of methods that they stole from the _ object such as:', function () {
            // _.test.it('addAll', function () {
            //     _.test.expect(numberCollection.addAll([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]);
            // });
            // _.test.it('removeAll', function () {
            //     _.test.expect(numberCollection.removeAll([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).toArray()).toEqual([1, 3, 5, 7, 9]);
            // });
            _.test.it('sort', function () {
                _.test.expect(numberCollection.sort().toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
                _.test.expect(numberCollection.sort(function (a, b) {
                    return (a % 3) - (b % 3);
                }).toArray()).toEqual([0, 3, 6, 9, 1, 4, 7, 2, 5, 8]);
            });
            _.test.it('unshift', function () {
                numberCollection.unshift(-1);
                _.test.expect(numberCollection.toArray()).toEqual([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            _.test.it('push', function () {
                numberCollection.push(10);
                _.test.expect(numberCollection.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
                numberCollection.push([11, 12, 13]);
                _.test.expect(numberCollection.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
            });
            _.test.it('cycle', function () {
                numberCollection.cycle(3);
                _.test.expect(numberCollection.toArray()).toEqual([3, 4, 5, 6, 7, 8, 9, 0, 1, 2]);
            });
            _.test.it('uncycle', function () {
                numberCollection.uncycle(3);
                _.test.expect(numberCollection.toArray()).toEqual([7, 8, 9, 0, 1, 2, 3, 4, 5, 6]);
            });
            _.test.it('count', function () {
                _.test.expect(numberCollection.count(function (item, idx, list) {
                    if (item === null) {
                        list.push(idx);
                    }
                }, 10, 20).length()).toEqual(20);
            });
            _.test.it('countTo', function () {
                _.test.expect(numberCollection.countTo(function (item, idx, list) {
                    if (item === null) {
                        list.push(idx);
                    }
                }, 20).length()).toEqual(20);
            });
            _.test.it('countFrom', function () {
                var count = 0;
                numberCollection.countFrom(function (item, idx, list) {
                    count++;
                }, 6);
                _.test.expect(count).toEqual(4);
            });
            _.test.it('add', function () {
                _.test.expect(numberCollection.add(61)).toEqual(true);
                _.test.expect(numberCollection.add(5)).toEqual(false);
                _.test.expect(numberCollection.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 61]);
                _.test.expect(numberCollection.add(61)).toEqual(false);
            });
            _.test.it('insertAt', function () {
                _.test.expect(numberCollection.insertAt(5, 1)).toEqual(true);
                _.test.expect(numberCollection.toArray()).toEqual([0, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            _.test.it('remove', function () {
                _.test.expect(numberCollection.remove(5)).toEqual(true);
                _.test.expect(numberCollection.toArray()).toEqual([0, 1, 2, 3, 4, 6, 7, 8, 9]);
                _.test.expect(numberCollection.remove(5)).toEqual(false);
            });
            _.test.it('removeAt', function () {
                _.test.expect(numberCollection.removeAt(3)).toEqual(3);
                _.test.expect(numberCollection.removeAt(3)).toEqual(4);
                _.test.expect(numberCollection.length()).toEqual(8);
            });
            _.test.it('pop', function () {
                _.test.expect(numberCollection.pop()).toEqual(9);
                _.test.expect(numberCollection.pop()).toEqual(8);
                _.test.expect(numberCollection.length()).toEqual(8);
            });
            _.test.it('shift', function () {
                _.test.expect(numberCollection.shift()).toEqual(0);
                _.test.expect(numberCollection.shift()).toEqual(1);
                _.test.expect(numberCollection.length()).toEqual(8);
            });
            _.test.it('indexOf', function () {
                _.test.expect(numberCollection.indexOf(3)).toEqual(3);
                _.test.expect(numberCollection.indexOf(7)).toEqual(7);
            });
            _.test.it('find', function () {
                _.test.expect(numberCollection.find(function (ix, item) {
                    return item === 10;
                })).toEqual(void 0);
                _.test.expect(numberCollection.find(function (ix, item) {
                    return item === 7;
                })).toEqual(7);
            });
            _.test.it('findLast', function () {
                _.test.expect(factories.Collection([12, 1, 2, 1, 104, 2, 1, 5, 55, 6, 2, 7]).findLast(function (item) {
                    return item % 17 === 0;
                })).toEqual(void 0);
                _.test.expect(factories.Collection([88, 2, 1, 5, 70, 23, 43, 9]).findLast(function (item) {
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
            _.test.it('findWhere', function () {
                _.test.expect(factories.Collection([firstFindObj, secondFindObj]).findWhere({
                    one: 2
                })).toEqual(void 0);
                _.test.expect(factories.Collection([firstFindObj, secondFindObj]).findWhere({
                    two: 2
                })).toEqual(firstFindObj);
            });
            _.test.it('findLastWhere', function () {
                _.test.expect(factories.Collection([firstFindObj, secondFindObj]).findLastWhere({
                    one: 2
                })).toEqual(void 0);
                _.test.expect(factories.Collection([firstFindObj, secondFindObj]).findLastWhere({
                    two: 2
                })).toEqual(secondFindObj);
            });
            _.test.it('foldr', function () {
                _.test.expect(numberCollection.foldr(function (memo, idx, item) {
                    memo.push(item);
                    return memo;
                }, [])).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
            });
            _.test.it('foldl', function () {
                _.test.expect(numberCollection.foldl(function (memo, idx, item) {
                    memo.push(item);
                    return memo;
                }, [])).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            _.test.it('merge', function () {
                _.test.expect(numberCollection.merge([0, 1, 2, 6, 7, 8]).toArray()).toEqual([0, 1, 2, 6, 7, 8, 6, 7, 8, 9]);
            });
            _.test.it('range', function () {
                _.test.expect(factories.Collection().range(4, 9).toArray()).toEqual([4, 5, 6, 7, 8]);
            });
            _.test.it('eq', function () {
                _.test.expect(numberCollection.eq(4).toArray()).toEqual([4]);
                _.test.expect(numberCollection.eq([3, 9]).toArray()).toEqual([3, 9]);
            });
            _.test.it('map', function () {
                _.test.expect(numberCollection.map(function (idx, item) {
                    return item * 2;
                }).toArray()).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
            });
            _.test.it('filter', function () {
                _.test.expect(numberCollection.filter(function (idx, item) {
                    return item % 2;
                }).toArray()).toEqual([1, 3, 5, 7, 9]);
            });
            _.test.it('pluck', function () {
                _.test.expect(factories.Collection([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]).results('one').toArray()).toEqual([1, 2, 3, 4]);
            });
            _.test.it('where', function () {
                _.test.expect(factories.Collection([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 1
                }, {
                    one: 4
                }]).where({
                    one: 1
                }).toArray()).toEqual([{
                    one: 1
                }, {
                    one: 1
                }]);
            });
            _.test.it('flatten', function () {
                _.test.expect(factories.Collection([
                    [0, 1, 2, 3],
                    [4, 5, 6, 7, 8],
                    [9, 10, 11, 12]
                ]).flatten().toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            });
        });
    });
    _.test.describe('SortedCollection', function () {
        var collection, complexCollection, evenNumberList, numberCollection, SortedCollection = factories.SortedCollection;
        _.test.beforeEach(function () {
            collection = SortedCollection();
            numberCollection = SortedCollection([4, 5, 3, 7, 8, 6, 2, 0, 1, 9]);
            complexCollection = SortedCollection([factories.Model(), factories.Model({
                one: 1,
                two: 2,
                three: 3
            })]);
            evenNumberList = [0, 2, 4, 6, 8];
        });
        _.test.it('should be sorted at the beginning', function () {
            _.test.expect(numberCollection.toJSON()).toEqual(numberCollection.sort().toJSON());
        });
        _.test.it('can get values without having to iterate over everything', function () {
            numberCollection.indexOf = _.noop;
            _.test.expect(numberCollection.get('id', 8)).toEqual(8);
        });
        _.test.it('can add values in the correct place', function () {
            var sorted = SortedCollection(evenNumberList);
            sorted.add(1);
            sorted.add(5);
            sorted.add(3);
            _.test.expect(sorted.item(0)).toEqual(0);
            _.test.expect(sorted.item(1)).toEqual(1);
            _.test.expect(sorted.item(2)).toEqual(2);
            _.test.expect(sorted.item(3)).toEqual(3);
            _.test.expect(sorted.item(4)).toEqual(4);
            _.test.expect(sorted.item(5)).toEqual(5);
        });
        _.test.it('can remove values from the correct place', function () {
            var sorted = SortedCollection(evenNumberList);
            sorted.remove(4);
            sorted.remove(2);
            _.test.expect(sorted.item(0)).toEqual(0);
            _.test.expect(sorted.item(1)).toEqual(6);
            _.test.expect(sorted.item(2)).toEqual(8);
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Events', function () {
        var count, blank, box,
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
        _.test.beforeEach(function () {
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
        _.test.describe('Models can have events', function () {
            var box2;
            _.test.describe('and can create events for itself', function () {
                _.test.it('either one at a time', function () {
                    box.on('evnt', handler);
                    _.test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(2);
                });
                _.test.it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    _.test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(6);
                });
            });
            _.test.describe('and can remove events from itself', function () {
                _.test.it('either one at a time', function () {
                    box.on('evnt', handler);
                    _.test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(2);
                    box.off('evnt', handler);
                    _.test.expect(count).toEqual(2);
                    box.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(2);
                });
                _.test.it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    _.test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(6);
                    box.off('evnt eventer mikesevent', handler);
                });
            });
        });
        _.test.describe('Models can also listen to other, similar objects', function () {
            var box2;
            _.test.beforeEach(function () {
                box2 = Model();
            });
            _.test.describe('by using the listenTo method', function () {
                _.test.it('either one at a time', function () {
                    box.listenTo(box2, 'evnt', handler);
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(2);
                });
                _.test.it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                    box2.dispatchEvent('eventer');
                    _.test.expect(count).toEqual(2);
                    box2.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(3);
                });
            });
            _.test.it('you can even take a shortcut and dispatch an event one at a time using dispatchEvent', function () {
                box.on('handle', handler);
                _.test.expect(count).toEqual(0);
                box.dispatchEvent('handle');
                _.test.expect(count).toEqual(1);
            });
            _.test.it('or many at a time using dispatchEvents', function () {
                box.on('handle handler beep boop blob', handler);
                _.test.expect(count).toEqual(0);
                box.dispatchEvents('handle handler beep boop blob');
                _.test.expect(count).toEqual(5);
            });
            _.test.describe('and can stop listening by using the stopListening method', function () {
                _.test.it('can remove events one at a time', function () {
                    var listenObj;
                    box.listenTo(box2, 'evnt', handler);
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                    box.stopListening(box2, 'evnt', handler);
                    _.test.expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                });
                _.test.it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    box.listenTo(box2, 'evnt eventer mikesevent', function () {
                        count += this === box;
                    });
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(6);
                    box.stopListening(box2, 'evnt eventer mikesevent', handler);
                    _.test.expect(count).toEqual(6);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(9);
                });
            });
            _.test.describe('listenTo', function () {
                _.test.it('should have an equivalent context', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += (this === box);
                    });
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    _.test.expect(count).toEqual(2);
                });
                _.test.it('can be overridden with an extra argument', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += this === box2;
                    }, box2);
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    _.test.expect(count).toEqual(2);
                });
            });
            _.test.describe('watch directive', function () {
                _.test.it('can listenTo the object that it belongs to', function () {
                    box.watch('here', 'there', function () {
                        count++;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('here', 1);
                    _.test.expect(count).toEqual(0);
                    box.set('here', 'there');
                    _.test.expect(count).toEqual(1);
                    box.set('here', 'where');
                    _.test.expect(count).toEqual(1);
                    box.set('here', 'there');
                    _.test.expect(count).toEqual(2);
                });
            });
            _.test.describe('when directive', function () {
                _.test.it('gives an api synonymous with english', function () {
                    box.when('here').is('there').and('when').is('now').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('here', 'nothere');
                    _.test.expect(count).toEqual(-1);
                    box.set('when', 'later');
                    _.test.expect(count).toEqual(-1);
                    box.set('when', 'now');
                    _.test.expect(count).toEqual(-1);
                    box.set('here', 'there');
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('allows for negatives to be used like isNot and isnt', function () {
                    box.when('one').isNot(2).and('up').isnt('down').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('up', 'down');
                    _.test.expect(count).toEqual(-1);
                    box.set('one', 2);
                    _.test.expect(count).toEqual(-1);
                    box.set('one', 1);
                    _.test.expect(count).toEqual(-1);
                    box.set('up', 'side');
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('can compare numbers using basic operators and negation', function () {
                    box.when('one').isGreaterThan(5).and('ten').isLessThan(4).and('phone').isNotLessThan(5).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('phone', 10);
                    _.test.expect(count).toEqual(-1);
                    box.set('one', 6);
                    _.test.expect(count).toEqual(-1);
                    box.set('ten', 5);
                    _.test.expect(count).toEqual(-1);
                    box.set('ten', 2);
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('can compare string values using basic operators and negation', function () {
                    box.when('one').isGreaterThan('a').and('ten').isLessThan('b').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('one', '0');
                    _.test.expect(count).toEqual(-1);
                    box.set('ten', 'beach');
                    _.test.expect(count).toEqual(-1);
                    box.set('ten', 'aardvark');
                    _.test.expect(count).toEqual(-1);
                    box.set('one', 'ten');
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('can also handle custom functions', function () {
                    box.when('one').is(function () {
                        return box.get('one') > 5;
                    }).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('one', 10);
                    _.test.expect(count).toEqual(1);
                    box.set('one', 3);
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('can also make "groups" using the or method', function () {
                    var sequence = box.when('one').is(1).or('truth').is(true).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('one', 2);
                    _.test.expect(count).toEqual(-1);
                    box.set('one', 0);
                    _.test.expect(count).toEqual(-1);
                    box.set('truth', true);
                    _.test.expect(count).toEqual(0);
                    box.set('one', 1);
                    _.test.expect(count).toEqual(0);
                    box.set('truth', false);
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('can also have multiple watchers on a particular instance that run independently', function () {
                    var last;
                    var sequence = box.when('five').isLessThan(10).then(function () {
                        count++;
                        last = 1;
                    });
                    var sequence2 = box.when('here').is('there').then(function () {
                        count++;
                        last = 2;
                    });
                    _.test.expect(count).toEqual(0);
                    _.test.expect(last).toEqual(void 0);
                    box.set('five', 3);
                    _.test.expect(count).toEqual(1);
                    _.test.expect(last).toEqual(1);
                    box.set('here', 'there');
                    _.test.expect(count).toEqual(2);
                    _.test.expect(last).toEqual(2);
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
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    // var factories = _.factories;
    _.test.describe('Model', function () {
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
        _.test.beforeEach(function () {
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
        _.test.it('extends from factories.Extendable', function () {
            _.test.expect(factories.Extendable.isInstance(box)).toEqual(true);
        });
        _.test.describe('Models are always created with...', function () {
            var box2 = Model();
            _.test.it('a unique id', function () {
                _.test.expect(_.has(box2, 'id')).toEqual(true);
            });
            _.test.it('even if there is not one given', function () {
                var box3 = Model({
                    id: 5
                });
                _.test.expect(box2.id !== void 0).toEqual(true);
                _.test.expect(box3.id === 5).toEqual(true);
            });
            // _.test.it('an empty _previousAttributes hash', function () {
            //     _.test.expect(_.has(box2, '_previousAttributes')).toEqual(true);
            //     _.test.expect(_.isObject(box2._previousAttributes)).toEqual(true);
            //     _.test.expect(_.isEmpty(box2._previousAttributes)).toEqual(true);
            // });
            // _.test.it('a collection for children', function () {
            //     _.test.expect(_.has(box2, 'Children')).toEqual(true);
            //     _.test.expect(factories.Collection.isInstance(box2.directive('Children'))).toEqual(true);
            //     _.test.expect(box2.directive('Children').length()).toEqual(0);
            // });
            // _.test.it('and an attributes object', function () {
            //     _.test.expect(_.has(box2, 'attributes')).toEqual(true);
            //     _.test.expect(_.isObject(box2.directive('data').current)).toEqual(true);
            // });
        });
        _.test.describe('you can set properties on the box you\'re handling with the set method', function () {
            var box = Model(),
                attrs = box.directive('data');
            _.test.beforeEach(function () {
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
            _.test.it('you can add new properties', function () {
                _.test.expect(attrs.ten).toEqual(void 0);
                box.set({
                    ten: 10,
                    eleven: 11,
                    twelve: 12
                });
                _.test.expect(box.get('ten')).toEqual(10);
            });
            _.test.it('you can modify existing properties', function () {
                _.test.expect(box.get('one')).toEqual(1);
                box.set({
                    one: 2,
                    two: 3,
                    three: 4
                });
                _.test.expect(box.get('one')).toEqual(2);
            });
            _.test.it('and you can remove properties by using the unset method', function () {
                var box = Model();
                _.test.expect(box.get('one')).toEqual(void 0);
                box.set({
                    one: 1
                });
                _.test.expect(box.get('one')).toEqual(1);
                box.unset('one');
                _.test.expect(box.get('one')).toEqual(void 0);
            });
            // _.test.it('or remove a bunch of properties by passing in a space separated list to the unset method', function () {
            //     _.test.expect(box.get('one')).toEqual(1);
            //     _.test.expect(box.get('three')).toEqual(3);
            //     _.test.expect(box.get('five')).toEqual(5);
            //     box.unset('one three five');
            //     _.test.expect(box.get('one')).toEqual(void 0);
            //     _.test.expect(box.get('three')).toEqual(void 0);
            //     _.test.expect(box.get('five')).toEqual(void 0);
            // });
        });
        // pass to the on, once, off, listenTo, listenToOnce, and stopListening functions
        _.test.describe('there are super special characters that you can use for terseness', function () {
            var count = 0,
                handler = function () {
                    count++;
                };
            _.test.beforeEach(function () {
                box2 = Model();
                count = 0;
            });
        });
        _.test.describe('Models also trigger a variety of events any time the set method changes the attributes object', function () {
            var fired;
            _.test.beforeEach(function () {
                fired = 0;
            });
            _.test.it('such as the change event', function () {
                _.test.expect(fired).toEqual(0);
                box.on('change', function () {
                    fired = 1;
                });
                _.test.expect(fired).toEqual(0);
                box.set({
                    here: 'there'
                });
                _.test.expect(fired).toEqual(1);
            });
            _.test.it('and the alter event', function () {
                _.test.expect(fired).toEqual(0);
                box.on('change', function () {
                    fired = 1;
                });
                _.test.expect(fired).toEqual(0);
                box.set({
                    one: 1,
                    two: 2
                });
                _.test.expect(fired).toEqual(0);
                box.set({
                    two: 1
                });
                _.test.expect(fired).toEqual(1);
            });
            _.test.it('as well as alter events specific to each property', function () {
                _.test.expect(fired).toEqual(0);
                box.on('change:one change:two change:three', function () {
                    fired++;
                });
                _.test.expect(fired).toEqual(0);
                box.set({
                    one: 9,
                    two: 8,
                    three: 7
                });
                _.test.expect(fired).toEqual(3);
            });
        });
        _.test.describe('but beyond events and simple hashes, Models are able to manage themselves fairly well', function () {
            _.test.it('they can get properties from the attributes object with the get method', function () {
                _.test.expect(box.get('one')).toEqual(1);
            });
            _.test.it('they can tell you if it has a property with the has method', function () {
                _.test.expect(box.has('one')).toEqual(true);
            });
            _.test.it('they can clone it\'s attributes by using the toJSON method', function () {
                var clone = box.toJSON();
                _.test.expect(clone).toEqual(box.directive('DataManager').current);
                _.test.expect(clone === box.directive('DataManager').current).toEqual(false);
            });
            _.test.it('they can clone children into an array', function () {
                var clone;
                box.add([factories.Model(), factories.Model()]);
                clone = box.directive('Children').toJSON();
                _.test.expect(clone).toEqual([{}, {}]);
            });
            _.test.it('they can stringify themselves', function () {
                box = factories.Model({
                    some: 'thing'
                });
                _.test.expect(box.toString()).toEqual(JSON.stringify({
                    some: 'thing'
                }));
            });
            _.test.it('they can stringify their children', function () {
                box = factories.Model();
                box.add(data.children);
                _.test.expect(box.directive('Children').toString()).toEqual(JSON.stringify(data.children));
            });
        });
        _.test.describe('Models can register other objects against a key hash as well', function () {
            _.test.it('it can register', function () {
                var data = {
                    myObj: 1
                };
                _.test.expect(box.directive('Children').get('id', 'key')).toEqual(void 0);
                box.directive('Children').keep('id', 'key', data);
                _.test.expect(box.directive('Children').get('id', 'key')).toEqual(data);
            });
            _.test.it('and retreive information', function () {
                var data = {
                    myObj: 1
                };
                _.test.expect(box.directive('Children').get('id', 'key')).toEqual(void 0);
                box.directive('Children').keep('id', 'key', data);
                _.test.expect(box.directive('Children').get('id', 'key') === data).toEqual(true);
            });
        });
        _.test.describe('boxes can have children', function () {
            _.test.it('you can add one at a time', function () {
                _.test.expect(box.directive('Children').length()).toEqual(0);
                box.add({
                    isChild: !0
                });
                _.test.expect(box.directive('Children').length()).toEqual(1);
            });
            _.test.it('or many at once', function () {
                _.test.expect(box.directive('Children').length()).toEqual(0);
                box.add([{
                    isChild: !0
                }, {
                    isChild: 'maybe'
                }, {
                    isChild: 'may'
                }]);
                _.test.expect(box.directive('Children').length()).toEqual(3);
            });
            _.test.it('you can also remove them one at a time', function () {
                box = factories.Model();
                box.add(data.children);
                _.test.expect(box.directive('Children').length()).toEqual(2);
            });
            _.test.it('or many at the same time', function () {
                box = factories.Model();
                var children = box.directive('Children');
                _.test.expect(children.length()).toEqual(0);
                box.add([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]);
                _.test.expect(children.length()).toEqual(4);
                box.remove([children.item(1), children.item(3)]);
                _.test.expect(children.length()).toEqual(2);
            });
        });
        _.test.describe('they can', function () {
            _.test.it('destroy themselves', function () {
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
                _.test.expect(box.directive('Children').get('cid', destroyer.cid) === destroyer).toEqual(true);
                _.test.expect(box.directive('Children').get('id', destroyer.id) === destroyer).toEqual(true);
                destroyer.destroy();
                _.test.expect(box.directive('Children').get('cid', destroyer.cid)).toEqual(void 0);
                _.test.expect(box.directive('Children').get('id', destroyer.id)).toEqual(void 0);
            });
            _.test.it('sort their children', function () {
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
                _.test.expect(box.directive('Children').map(function (model) {
                    return model.get('two');
                }).toArray()).toEqual([1, 2, 8]);
                box.comparator = '!two';
                box.sort();
                _.test.expect(box.directive('Children').map(function (model) {
                    return model.get('two');
                }).toArray()).toEqual([8, 2, 1]);
            });
            _.test.it('set up events on their children', function () {
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
                _.test.expect(counter).toEqual(0);
                box.directive('Children').results('dispatchEvent', 'beep');
                _.test.expect(counter).toEqual(8);
                box.directive('Children').results('dispatchEvent', 'boop');
                _.test.expect(counter).toEqual(4);
            });
            _.test.it('set up events on their parents', function () {
                var count = 0;
                Model.constructor.prototype.parentEvents = {
                    beep: function () {
                        count++;
                    }
                };
                box.add([{}, {}, {}, {}]);
                box.dispatchEvent('beep');
                _.test.expect(count).toEqual(4);
                delete Model.constructor.prototype.parentEvents;
            });
        });
        _.test.describe('boxes can "destroy" themselves', function () {
            _.test.it('their events will persist until they decide to reset their own events', function () {
                box.on({
                    event1: counter,
                    event2: counter
                });
                _.test.expect(count).toEqual(0);
                box.dispatchEvent('event1');
                _.test.expect(count).toEqual(1);
                box.dispatchEvent('event2');
                _.test.expect(count).toEqual(2);
                box.destroy();
                _.test.expect(count).toEqual(2);
                box.dispatchEvent('event1');
                _.test.expect(count).toEqual(3);
                box.directive('EventManager').reset();
                _.test.expect(count).toEqual(3);
                box.dispatchEvent('event2');
                _.test.expect(count).toEqual(3);
            });
            _.test.it('conversely, if the box has listening objects, it will remove it\'s handlers from other objects', function () {
                var box2 = factories.Model();
                box.listenTo(box2, {
                    event1: counter,
                    event2: counter
                });
                _.test.expect(count).toEqual(0);
                box2.dispatchEvent('event1');
                _.test.expect(count).toEqual(1);
                box2.dispatchEvent('event2');
                _.test.expect(count).toEqual(2);
                box.destroy();
                _.test.expect(count).toEqual(2);
                box2.dispatchEvent('event1');
                _.test.expect(count).toEqual(2);
                box2.dispatchEvent('event2');
                _.test.expect(count).toEqual(2);
            });
        });
        _.test.describe('there is also an alternative to the on api called the watch api', function () {
            _.test.it('it can attach event listeners', function () {
                var count = 0;
                box.watch('there', 'there', function (e) {
                    count++;
                });
                _.test.expect(count).toEqual(0);
                box.set('there', 'here');
                _.test.expect(count).toEqual(0);
                box.set('there', 'there');
                _.test.expect(count).toEqual(1);
                box.set('there', 'here');
                _.test.expect(count).toEqual(1);
                box.set('there', 'there');
                _.test.expect(count).toEqual(2);
            });
            _.test.it('and watch variables dynamically', function () {
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
                _.test.expect(count).toEqual(0);
                box.set('there', 'here');
                _.test.expect(count).toEqual(0);
                box.set('there', 'there');
                _.test.expect(count).toEqual(1);
                box.set('there', 'here');
                _.test.expect(count).toEqual(1);
                box.set('there', 'there');
                _.test.expect(count).toEqual(2);
            });
            _.test.it('it does not have a context in the first argument', function () {
                var count = 0;
                box.watch('there', function (e) {
                    return e.origin === box && this !== box;
                }, function (e) {
                    count++;
                });
                _.test.expect(count).toEqual(0);
                box.set('there', 'here');
                _.test.expect(count).toEqual(1);
                box.set('there', 'there');
                _.test.expect(count).toEqual(2);
            });
            _.test.it('it does can attach listeners using the once api', function () {
                var count = 0;
                box.watchOnce('there', 'there', function (e) {
                    count++;
                });
                _.test.expect(count).toEqual(0);
                box.set('there', 'here');
                _.test.expect(count).toEqual(0);
                box.set('there', 'there');
                _.test.expect(count).toEqual(1);
                box.set('there', 'here');
                _.test.expect(count).toEqual(1);
                box.set('there', 'there');
                _.test.expect(count).toEqual(1);
            });
            _.test.it('and listeners on other objects with the watchOther api', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOther(box2, 'there', function (e) {
                    count++;
                    return e.target === box && this !== box;
                }, function (e) {
                    count++;
                });
                _.test.expect(count).toEqual(0);
                box2.set('there', 'here');
                _.test.expect(count).toEqual(1);
                box2.set('there', 'there');
                _.test.expect(count).toEqual(2);
                box2.set('there', 'here');
                _.test.expect(count).toEqual(3);
                box2.set('there', 'there');
                _.test.expect(count).toEqual(4);
            });
            _.test.it('and listeners on other objects with the watchOther api', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOtherOnce(box2, 'there', 'there', function (e) {
                    count++;
                });
                _.test.expect(count).toEqual(0);
                box2.set('there', 'there');
                _.test.expect(count).toEqual(1);
                box2.set('there', 'here');
                _.test.expect(count).toEqual(1);
            });
            _.test.it('the once handler will only take itself off when it succeeds', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOtherOnce(box2, 'there', 'there', function (e) {
                    count++;
                });
                _.test.expect(count).toEqual(0);
                box2.set('there', 'here');
                _.test.expect(count).toEqual(0);
                box2.set('there', 'there');
                _.test.expect(count).toEqual(1);
                box2.set('there', 'here');
                _.test.expect(count).toEqual(1);
                box2.set('there', 'there');
                _.test.expect(count).toEqual(1);
            });
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Promise', function () {
        var madeit, promise, handler = function () {
            madeit++;
        };
        _.test.beforeEach(function () {
            madeit = 0;
            promise = factories.Promise();
        });
        _.test.it('allows for async resolution of state', function () {
            _.test.expect(_.isObject(promise)).toEqual(true);
            promise.always(handler);
            // test for premature trigger
            _.test.expect(madeit).toEqual(0);
            // make sure promise is an object
            _.test.expect(_.isObject(promise)).toEqual(true);
            // make sure it has the right "state"
            _.test.expect(promise.state).toEqual('pending');
            // fulfill the promise
            promise.fulfill();
            // make sure that it hit the function once and only once
            _.test.expect(madeit).toEqual(1);
            // make sure it has the correct state after resolution
            _.test.expect(promise.state).toEqual('success');
        });
        _.test.it('can tell you if it has fulfilled or not', function () {
            _.test.expect(promise.is('fulfilled')).toEqual(false);
            promise.fulfill();
            _.test.expect(promise.is('fulfilled')).toEqual(true);
        });
        _.test.describe('can tell you what state it is in such as', function () {
            _.test.it('pending', function () {
                _.test.expect(promise.state).toEqual('pending');
            });
            _.test.it('success', function () {
                promise.fulfill();
                _.test.expect(promise.state).toEqual('success');
            });
            _.test.it('failure', function () {
                promise.reject();
                _.test.expect(promise.state).toEqual('failure');
            });
        });
        _.test.describe('or it can give you a boolean value for resolutions like', function () {
            _.test.it('success', function () {
                promise.fulfill();
                _.test.expect(promise.is('fulfilled')).toEqual(true);
            });
            _.test.it('failure', function () {
                promise.reject();
                _.test.expect(promise.is('rejected')).toEqual(true);
            });
        });
        _.test.describe('can fulfill to different states such as', function () {
            _.test.it('success', function (done) {
                // attach handler
                promise.success(handler);
                setTimeout(function () {
                    // fulfill promise for success
                    promise.fulfill();
                    // expect madeit to increase
                    _.test.expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                });
            });
            _.test.it('failure', function (done) {
                // attach failure handler
                promise.failure(handler);
                setTimeout(function () {
                    // fulfill promise for failure
                    promise.reject();
                    // expect madeit to increase
                    _.test.expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                });
            });
        });
        _.test.describe('but it also can trigger functions on any resolution with the always method such as', function () {
            _.test.it('fulfill', function (done) {
                // attach always handler
                promise.success(handler);
                promise.always(handler);
                setTimeout(function () {
                    // fulfill promise for failure
                    promise.fulfill();
                    // expect madeit to increase
                    _.test.expect(madeit).toEqual(2);
                    // let jasmine know we're all good
                    done();
                });
                _.test.expect(madeit).toEqual(0);
            });
            _.test.it('reject', function (done) {
                // attach always handler
                promise.failure(handler);
                promise.always(handler);
                setTimeout(function () {
                    // reject promise
                    promise.reject();
                    // expect madeit to increase
                    _.test.expect(madeit).toEqual(2);
                    // let jasmine know we're all good
                    done();
                });
                _.test.expect(madeit).toEqual(0);
            });
        });
        _.test.describe('creates a tree of dependencies', function () {
            _.test.it('always is a nonstring (so it terminates)', function () {
                var allstates = promise.allStates();
                _.test.expect(!_.isString(allstates.always)).toEqual(true);
            });
            _.test.it('success is set to always', function () {
                var allstates = promise.allStates();
                _.test.expect(allstates.success).toEqual('always');
            });
            _.test.it('failure is set to always', function () {
                var allstates = promise.allStates();
                _.test.expect(allstates.failure).toEqual('always');
            });
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var registry = factories.Associator();
    _.test.describe('Registry', function () {
        _.test.beforeEach(function () {});
        _.test.it('is made by the specless object', function () {
            _.test.expect(_.isInstance(registry, factories.Associator)).toEqual(true);
        });
        _.test.it('is not a collection', function () {
            _.test.expect(_.isInstance(registry, factories.Collection)).toEqual(false);
        });
        _.test.it('can save data against pointers', function () {
            registry.set(window, {
                some: 'data'
            });
            _.test.expect(registry.get(window).some).toEqual('data');
        });
        _.test.it('can also get any group of data that the same type', function () {
            var one = {},
                two = {};
            registry.set(one, {
                one: 1
            });
            registry.set(two, {
                two: 2
            });
            _.test.expect(_.keys(registry.sameType(two).__elid__).length).toEqual(2);
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var BOOLEAN_TRUE = true,
        isObject = _.isObject;
    _.test.describe('HTTP', function () {
        var allstates;
        _.test.it('is an object', function () {
            var ajax = factories.HTTP('/json/reporting.json');
            allstates = ajax.allStates();
            _.test.expect(isObject(ajax)).toEqual(BOOLEAN_TRUE);
        });
        // _.test.it('can accept an object as a first argument', function (done) {
        //     factories.HTTP('/json/reporting.json').success(function (json) {
        //         _.test.expect(isObject(json)).toEqual(BOOLEAN_TRUE);
        //         done();
        //     });
        // });
        _.test.it('can accept a string as a first argument', function (done) {
            var original, handlerCounter = 0;
            factories.HTTP('/json/reporting.json').success(function (json) {
                _.test.expect(original !== json).toEqual(BOOLEAN_TRUE);
            }).handle('status:200', function (json) {
                handlerCounter++;
                original = json;
            }).success(function (json) {
                handlerCounter++;
                _.test.expect(original === json).toEqual(BOOLEAN_TRUE);
            }).always(function () {
                handlerCounter++;
                _.test.expect(handlerCounter).toEqual(3);
                done();
            });
        });
        _.test.it('can post', function (done) {
            factories.HTTP({
                type: 'POST',
                url: '/postecho',
                data: {
                    success: true
                }
            }).success(function (data) {
                _.test.expect(data && data.successful).toBe(true);
                done();
            });
        });
        _.test.describe('can handle', function () {
            _.test.it('failures', function (done) {
                var handlerCounter = 0;
                var prom = factories.HTTP('https://google.com').failure(function () {
                    handlerCounter++;
                }).always(function () {
                    handlerCounter++;
                    _.test.expect(handlerCounter).toEqual(2);
                    done();
                });
                prom.reject();
            });
            _.test.it('errors', function (done) {
                var handlerCounter = 0;
                factories.HTTP('/json/reporting.json').success(function (json) {
                    handlerCounter++;
                    _.test.expect(handlerCounter).toEqual(1);
                    throw new Error('some message here');
                }).catch(function () {
                    handlerCounter++;
                }).always(function () {
                    handlerCounter++;
                    _.test.expect(handlerCounter).toEqual(3);
                    done();
                });
            });
            _.test.describe('status codes (more than the ones listed here)', function () {
                _.test.it('200', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/200').handle('status:200', function () {
                        handlerCounter++;
                    }).success(function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter--;
                    }).always(function () {
                        handlerCounter++;
                        _.test.expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
                _.test.it('404', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/404').handle('status:404', function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter++;
                    }).always(function () {
                        handlerCounter++;
                        _.test.expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
                _.test.it('500', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/500').handle('status:500', function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter++;
                    }).always(function () {
                        handlerCounter++;
                        _.test.expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
            });
        });
        // rewrite this to recursively go through each key and make sure it resolves to always
        // _.test.describe('status codes are used as a layer over success and failure', function () {
        //     _.test.it('200 is success', function () {
        //         _.test.expect(allstates['status:200']).toEqual('success');
        //     });
        //     _.test.it('202 is success', function () {
        //         _.test.expect(allstates['status:202']).toEqual('success');
        //     });
        //     _.test.it('204 is success', function () {
        //         _.test.expect(allstates['status:204']).toEqual('success');
        //     });
        //     _.test.it('205 is success', function () {
        //         _.test.expect(allstates['status:205']).toEqual('success');
        //     });
        //     _.test.it('302 is success', function () {
        //         _.test.expect(allstates['status:302']).toEqual('success');
        //     });
        //     _.test.it('304 is success', function () {
        //         _.test.expect(allstates['status:304']).toEqual('success');
        //     });
        //     _.test.it('400 is failure', function () {
        //         _.test.expect(allstates['status:400']).toEqual('failure');
        //     });
        //     _.test.it('401 is failure', function () {
        //         _.test.expect(allstates['status:401']).toEqual('failure');
        //     });
        //     _.test.it('403 is failure', function () {
        //         _.test.expect(allstates['status:403']).toEqual('failure');
        //     });
        //     _.test.it('404 is failure', function () {
        //         _.test.expect(allstates['status:404']).toEqual('failure');
        //     });
        //     _.test.it('405 is failure', function () {
        //         _.test.expect(allstates['status:405']).toEqual('failure');
        //     });
        //     _.test.it('406 is failure', function () {
        //         _.test.expect(allstates['status:406']).toEqual('failure');
        //     });
        //     _.test.it('500 is failure', function () {
        //         _.test.expect(allstates['status:500']).toEqual('failure');
        //     });
        //     _.test.it('502 is failure', function () {
        //         _.test.expect(allstates['status:502']).toEqual('failure');
        //     });
        //     _.test.it('505 is failure', function () {
        //         _.test.expect(allstates['status:505']).toEqual('failure');
        //     });
        //     _.test.it('511 is failure', function () {
        //         _.test.expect(allstates['status:511']).toEqual('failure');
        //     });
        // });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Modules', function () {
        var level = app.module('level');
        var lower = app.module('level.lower');
        var lowered = app.module('level.lower.lowered');
        _.test.it('can have children', function () {
            _.test.expect(lower.parent === level).toEqual(true);
            _.test.expect(lower === lowered.parent).toEqual(true);
        });
        _.test.it('can access it\'s children through the exact same api', function () {
            _.test.expect(lower.module('lowered') === lowered).toEqual(true);
            _.test.expect(lower === level.module('lower')).toEqual(true);
        });
        _.test.it('can be initialized after it is created', function () {
            var count = 0;
            app.module('level.lower', function () {
                count++;
            });
            _.test.expect(count).toEqual(1);
        });
        _.test.it('passes itself into it\'s initializing functions', function () {
            var count = 0;
            app.module('lower', function (module, app_, _, factories) {
                count = 1;
                _.test.expect(module).toEqual(app.module('lower'));
                _.test.expect(app_).toEqual(app);
                _.test.expect(_).toEqual(app._);
                _.test.expect(factories).toEqual(_.factories);
            });
            _.test.expect(count).toEqual(1);
        });
        _.test.it('can have multiple generation handlers', function () {
            var count = 0;
            app.module('level', function () {
                count++;
            });
            _.test.expect(count).toEqual(1);
            app.module('level', function () {
                count += 2;
            });
            _.test.expect(count).toEqual(3);
        });
        _.test.it('can have exports (can hold data)', function () {
            level.publicize({
                one: 1,
                two: 2
            });
            _.test.expect(level.exports.one).toEqual(1);
            _.test.expect(level.exports.two).toEqual(2);
        });
        _.test.it('which is like giving public data', function () {
            var mod = app.module('newmodule', function () {
                this.publicize({
                    here: 'there'
                });
            });
            _.test.expect(app.require('newmodule').here).toEqual('there');
            _.test.expect(function () {
                app.require('somenonexistantmodule');
            }).toThrow();
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var elementData = _.associator,
        test = _.test;
    test.describe('DOMA', function () {
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
        test.beforeEach(create);
        test.afterEach(function () {
            divs.destroy();
        });
        test.it('is essentially a collection', function () {
            test.expect(_.isInstance($empty, factories.DOMA)).toEqual(true);
            test.expect(_.isInstance($empty, factories.Collection)).toEqual(true);
        });
        test.it('it knows it\'s own client rect', function () {
            var div = divs.first();
            var rect = div.element().getBoundingClientRect();
            test.expect(div.client()).toEqual({
                height: rect.height,
                width: rect.width,
                bottom: rect.bottom,
                right: rect.right,
                left: rect.left,
                top: rect.top
            });
        });
        test.it('can show and hide elements', function () {
            test.expect(divs.hide().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'none') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
            test.expect(divs.show().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'block') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
        });
        test.it('can attach dom elements', function () {
            var div = divs.eq();
            div.append(divs.item(1));
            test.expect(divs.children().item(0)).toEqual(divs.item(1));
        });
        test.it('can remove dom elements', function () {
            var div = divs.eq();
            div.append(divs.item(1));
            test.expect(divs.children().item(0)).toEqual(divs.item(1));
            div.children().remove();
            test.expect(div.children().length()).toEqual(0);
        });
        test.describe('except it has some methods that are highly pertinant to DOM manipulation... ergo: DOMA', function () {
            // test.it('can check if its items are windows', function () {
            //     test.expect($win.is('window')).toEqual(true);
            //     test.expect($doc.is('window')).toEqual(false);
            //     test.expect($body.is('window')).toEqual(false);
            // });
            // test.it('can check if its items are documents', function () {
            //     test.expect($win.is('document')).toEqual(false);
            //     test.expect($doc.is('document')).toEqual(true);
            //     test.expect($body.is('document')).toEqual(false);
            // });
            test.it('can check if its items are actually elements', function () {
                test.expect($win.allElements()).toEqual(false);
                test.expect($doc.allElements()).toEqual(false);
                test.expect($body.allElements()).toEqual(true);
                test.expect($('div').allElements()).toEqual(true);
            });
            // test.it('can check if its items are document fragments', function () {
            //     var frag = document.createDocumentFragment();
            //     frag.appendChild(document.createElement('div'));
            //     test.expect($win.is('fragment')).toEqual(false);
            //     test.expect($doc.is('fragment')).toEqual(false);
            //     test.expect($body.is('fragment')).toEqual(false);
            //     test.expect($('div').is('fragment')).toEqual(false);
            //     test.expect($(frag).is('fragment')).toEqual(true);
            // });
        });
        test.describe('it can filter itself', function () {
            test.it('by query string matching', function () {
                var newDivs = divs.filter('.two');
                test.expect(newDivs.length()).toEqual(2);
            });
            test.it('by filtering against a function', function () {
                var newDivs = divs.filter(function (item, idx) {
                    return ((idx % 3) - 1) === 0;
                });
                test.expect(newDivs.length()).toEqual(2);
                test.expect(newDivs.item()).toEqual(divs.item(1));
                test.expect(newDivs.item(1)).toEqual(divs.item(4));
            });
            // test.it('by passing in an object', function () {
            //     var newDivs = divs.filter({
            //         className: 'one not'
            //     });
            //     test.expect(newDivs.length()).toEqual(3);
            // });
            test.it('can also get the first item', function () {
                test.expect(divs.first()).toEqual(divs.item(0));
            });
            test.it('and the last element in the list', function () {
                test.expect(divs.last()).toEqual(divs.item(divs.length() - 1));
            });
        });
        test.describe('it can find it\'s children', function () {
            test.it('by calling the children method', function () {
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
                test.expect(kids.length()).toEqual(10);
                kids.duff(function (kid, idx) {
                    test.expect(kid.element().localName).toEqual('span');
                });
                kids = divs.children(1);
                test.expect(kids.length()).toEqual(5);
                kids = divs.children('.span-2');
                test.expect(kids.toArray()).toEqual(divs.children().filter('.span-2').toArray());
                test.expect(kids.length()).toEqual(2);
                test.expect(kids.element() === kids.item(1)).toEqual(false);
            });
            test.it('by querying the dom elements', function () {
                divs.duff(function (div, idx) {
                    div.element().innerHTML = '<span></span><img/>';
                });
                var kids = divs.$('img');
                test.expect(kids.length()).toEqual(5);
                kids.duff(function (kid, idx) {
                    test.expect(kid.element().tagName).toEqual('IMG');
                });
            });
        });
        test.describe('it can also find it\'s parents', function () {
            test.it('either by counting up', function () {
                var $start = $('.leaves'),
                    $end = $('.tree'),
                    end = $start.parent(2);
                test.expect(end.first().element()).toEqual($end.first().element());
            });
            test.it('or by finding via selector', function () {
                var $start = $('.leaves'),
                    $end = $('.tree'),
                    end = $start.parent('.tree');
                test.expect(end.first().element()).toEqual($end.first().element());
            });
            test.it('or by passing a function', function () {
                var $start = $('.leaves'),
                    end = $start.parent(function (el) {
                        var parent = el.parentNode;
                        return [parent, parent && parent.tagName === 'BODY'];
                    });
                test.expect(end.item(0).element()).toEqual(document.body);
            });
            test.describe('or by passing a keyword', function () {
                test.it('like document', function () {
                    var $start = $('.leaves'),
                        end = $start.parent('document');
                    test.expect(end.first().element()).toEqual(document);
                });
                test.it('or window', function () {
                    var $start = $('.leaves'),
                        end = $start.parent('window');
                    test.expect(end.first().element()).toEqual(window);
                });
            });
        });
        test.describe('all of this traversing can be undone', function () {
            test.it('with the end method', function () {
                var $start = $('.results .failures');
                var $next = $start.parent();
                $next = $next.children();
                $next = $next.end();
                test.expect($next === $start).toEqual(true);
            });
        });
        test.describe('the domm is also special because it abstracts event listeners for you', function () {
            test.describe('can add handlers', function () {
                test.it('one at a time', function () {
                    divs.on('click', handler);
                    test.expect(count).toEqual(0);
                    divs.click();
                    test.expect(count).toEqual(5);
                });
                test.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    test.expect(count).toEqual(15);
                });
            });
        });
        test.describe('the domm is also special because it abstracts event listeners for you', function () {
            test.describe('can add handlers', function () {
                test.it('one at a time', function () {
                    divs.on('click', handler);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    test.expect(count).toEqual(5);
                });
                test.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    test.expect(count).toEqual(15);
                });
            });
            test.describe('also capture handlers', function () {
                test.it('one at a time', function () {
                    divs.on('click', handler, true);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    test.expect(count).toEqual(5);
                });
                test.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler, true);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    divs.dispatchEvent('mouseover', {}, true);
                    divs.dispatchEvent('mouseout', {}, true);
                    test.expect(count).toEqual(15);
                });
            });
            test.it('will only add a method to the queue once. if a duplicate is passed in, it will be ignored (just like the browser implementation)', function () {
                divs.on('click', handler).on('click', handler);
                test.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(10);
            });
            test.it('once wrappers can also be used with the once method and they can be added the same way as once', function () {
                divs.once('click', handler);
                test.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
            });
            test.it('be careful with the once function because they can be added multiple times to the queue, since they use a proxy function, like the one available at _.once', function () {
                divs.once('click', handler);
                test.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
            });
        });
        test.describe('the each function is special because', function () {
            test.it('it wraps each element in a DOMA object before passing it through your iterator', function () {
                divs.each(function (el, idx) {
                    test.expect(_.isInstance(el, factories.DOMA)).toEqual(false);
                    test.expect(factories.DomManager.isInstance(el)).toEqual(true);
                    test.expect(el.element()).toBe(divs.item(idx).element());
                });
            });
            test.it('where the duff and forEach function just gives you the element at each index, just like a collection', function () {
                divs.duff(function (el, idx) {
                    test.expect(_.isInstance(el, $)).toEqual(false);
                });
                divs.forEach(function (el, idx) {
                    test.expect(_.isInstance(el, $)).toEqual(false);
                });
            });
        });
        test.describe('adding and removing classes is done by string checking instead of the classList to invoke only one reflow', function () {
            test.it('you can use addClass', function () {
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('three')).toEqual(false);
                });
                divs.addClass('three');
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('three')).toEqual(true);
                });
            });
            test.it('you can use removeClass', function () {
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('three')).toEqual(false);
                });
                test.expect(divs.hasClass('three')).toEqual(false);
                divs.addClass('three');
                test.expect(divs.hasClass('three')).toEqual(true);
            });
            test.it('you can use hasClass to check if all of the elements has a particular class', function () {
                test.expect(divs.hasClass('two')).toEqual(false);
                test.expect(divs.hasClass('one')).toEqual(true);
            });
            test.it('you can use toggleClass swap classes depending on whether or not they exist on each element', function () {
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('one')).toEqual(true);
                });
                divs.toggleClass('one');
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('one')).toEqual(false);
                });
            });
            test.it('it will also do this for individual elements', function () {
                var list = [],
                    unique = [];
                divs.each(function (div, idx) {
                    var res = div.hasClass('two');
                    list.push(res);
                    _.add(unique, res);
                });
                divs.toggleClass('two');
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('two')).toEqual(!list[idx]);
                });
                test.expect(unique.length > 1).toEqual(true);
            });
            test.it('you can also use changeClass as a shorthand of removeClass and addClass', function () {
                divs.changeClass('one not two', 'three');
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('one')).toEqual(false);
                    test.expect(div.hasClass('two')).toEqual(false);
                    test.expect(div.hasClass('not')).toEqual(false);
                    test.expect(div.hasClass('three')).toEqual(true);
                });
            });
        });
        test.describe('there is also a data attributes interface', function () {
            test.it('where you can add', function () {
                divs.duff(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual(null);
                    test.expect(div.element().getAttribute('data-two')).toEqual(null);
                });
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual('one');
                    test.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
            test.it('remove', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual('one');
                    test.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
                divs.data({
                    one: false,
                    two: false
                });
                divs.duff(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual(null);
                    test.expect(div.element().getAttribute('data-two')).toEqual(null);
                });
            });
            test.it('and update data attributes', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div) {
                    test.expect(div.element().getAttribute('data-one')).toEqual('one');
                    test.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
        });
        test.describe('it can also manipulate elements in other ways', function () {
            test.it('like by manipulating their attributes', function () {
                divs.duff(function (div) {
                    test.expect(div.element().getAttribute('tabindex')).toEqual(null);
                });
                divs.attr({
                    tabindex: -1
                });
                divs.each(function (div, idx) {
                    test.expect(div.attr('tabindex')).toEqual(-1);
                });
            });
            test.it('or by manipulating their properties', function () {
                divs.duff(function (div, idx) {
                    test.expect(div.element().align).toEqual('');
                });
                divs.prop({
                    align: 'left'
                });
                divs.each(function (div, idx) {
                    test.expect(div.prop('align')).toEqual('left');
                });
            });
        });
        test.describe('can have specialized elements', function () {
            test.describe('has lifecycle events', function () {
                test.it('like attach', function () {
                    divs.remove();
                    divs.on('attach', handler);
                    test.expect(count).toEqual(0);
                    $con.append(divs);
                    test.expect(count).toEqual(5);
                });
                test.it('and detach', function () {
                    divs.once('detach', handler);
                    test.expect(count).toEqual(0);
                    divs.remove();
                    test.expect(count).toEqual(5);
                });
                test.it('and attribute change', function () {
                    divs.once('attributeChange:data-here', handler);
                    test.expect(count).toEqual(0);
                    divs.data('here', 1);
                    test.expect(count).toEqual(5);
                });
            });
            test.describe('there are also special handlers', function () {
                test.it('like create', function () {
                    $.registerElement('test0', {
                        creation: handler
                    });
                    test.expect(count).toEqual(0);
                    $.createElement('test0');
                    test.expect(count).toEqual(1);
                });
                test.it('and destroy', function () {
                    $.registerElement('test1', {
                        destruction: handler
                    });
                    var div = $.createElement('test1');
                    test.expect(count).toEqual(0);
                    div.destroy();
                    test.expect(count).toEqual(1);
                });
            });
        });
        test.it('tags cannot be created without being registered first', function () {
            test.expect(function () {
                $.createElement('unregistered-test');
            }).toThrow();
            test.expect($.registeredElements['unregistered-test']).toEqual(undefined);
            $.registerElement('unregistered-test');
            test.expect(function () {
                $.createElement('unregistered-test');
            }).not.toThrow();
        });
        test.it('tags are automatically queried for and registered', function () {
            test.expect($.document.data.get(document.getElementById('nodatahere')).DomManager).toEqual(void 0);
            // this one has an is property so it will be queried for automatically
            test.expect($.document.data.get(document.getElementById('datahere')).DomManager).not.toEqual(void 0);
        });
        test.it('can use direct parent selectors', function () {
            test.expect($('.branch').eq(0).$('> .leaves').length()).toEqual(5);
        });
        test.it('can traverse horizontally for it\'s siblings', function () {
            var $branch = $('.branch');
            var $item2 = $branch.item(2);
            test.expect(factories.DomManager.isInstance($item2)).toBe(true);
            test.expect($item2.prev()).toEqual($branch.item(1));
        });
        test.it('establishes dom managers immediately after an element\'s html is changed', function () {
            var $tree = $.createElement('div');
            $tree.html('<div><span is></span></div>');
            test.expect($tree.element().querySelectorAll('span')[0].__elid__).not.toEqual(void 0);
        });
        var template1 = function (data) {
            var listItems = _.map(data && data.points, function (item, index) {
                return [item.tag, {
                        class: "classname" + (item.number || index)
                    },
                    item.text, {
                        key: 'listitem' + (item.number || index)
                    }
                ];
            });
            return ['div', {
                    class: 'tree'
                },
                [
                    ['span', {
                        class: 'spanned'
                    }, 'name', {
                        key: 'name'
                    }],
                    ['ul', {
                            class: 'container'
                        },
                        listItems, {
                            key: 'container'
                        }
                    ]
                ]
            ];
        };
        var makeBasicTemplate = function (points) {
            return template1({
                points: points || [{
                    tag: 'li',
                    text: 'sometext'
                }, {
                    tag: 'li',
                    text: 'someothertext'
                }]
            });
        };
        var basicTemplateKeyTagNames = {
            name: 'span',
            container: 'ul'
        };
        var applyMutations = function (mutations) {
            _.duff([mutations.remove, mutations.update, mutations.insert], function (fn) {
                fn();
            });
        };
        test.describe('can diff node trees and update them', function () {
            var $root, templatized;
            test.beforeEach(function () {
                $root = $.createElement('div');
                templatized = makeBasicTemplate();
            });
            test.it('and update them', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                test.expect($root.html()).toEqual('');
                _.each(diff.mutations, function (level, key) {
                    test.expect(_.isFunction(level)).toBe(true);
                });
                applyMutations(diff.mutations);
                test.expect($root.html()).not.toEqual('');
            });
            test.it('collects keys that the template marks using index 3 of each child', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                _.each(diff.keys, function (element, key) {
                    test.expect(element.tagName.toLowerCase()).toEqual(basicTemplateKeyTagNames[key] || 'li');
                });
            });
            test.it('updates attributes when needed', function () {
                var attributes = {};
                var diff = $.nodeComparison($root.element(), templatized);
                var attrs = $root.attributes();
                test.expect(attrs).not.toEqual(templatized[1]);
                applyMutations(diff.mutations);
                attrs = $root.attributes();
                delete attrs.is;
                test.expect(attrs).toEqual(templatized[1]);
            });
            test.it('removes nodes when needed', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutations);
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'sometext'
                }]);
                var $lis = $root.$('ul.container').children();
                var $first = $lis.first();
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutations);
                var $newChildren = $root.$('ul.container').children();
                test.expect($first.element()).toBe($newChildren.first().element());
                test.expect($newChildren.length()).toEqual(1);
            });
            test.it('removes nodes even when they\'re at the front', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutations);
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'someothertext2',
                    number: '1'
                }]);
                var $lis = $root.$('ul.container').children();
                var $first = $lis.first();
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutations);
                var $newChildren = $root.$('ul.container').children();
                test.expect($first.element()).not.toBe(void 0);
                test.expect($first.element()).not.toBe($newChildren.first().element());
                test.expect($newChildren.length()).toEqual(1);
            });
            test.it('and inserts them at the front when needed', function () {
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'someothertext2',
                    number: '1'
                }]);
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutations);
                var $lis = $root.$('ul.container').children();
                var $first = $lis.first();
                templatized = makeBasicTemplate();
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutations);
                var $newChildren = $root.$('ul.container').children();
                test.expect($first.element()).not.toBe($newChildren.first().element());
                test.expect($newChildren.length()).toEqual(2);
            });
            test.it('can rearrange elements as needed', function () {
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'another',
                    number: '2'
                }, {
                    tag: 'li',
                    text: 'someothertext2',
                    number: '1'
                }, {
                    tag: 'li',
                    text: 'anotherone',
                    number: '3'
                }, {
                    tag: 'li',
                    text: 'first',
                    number: '0'
                }]);
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutations);
                var $lis = $root.$('ul.container').children();
                var list = $lis.elements().toArray();
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'first',
                    number: '0'
                }, {
                    tag: 'li',
                    text: 'someothertextfirstindex',
                    number: '1'
                }, {
                    tag: 'li',
                    text: 'anothersecondindex',
                    number: '2'
                }, {
                    tag: 'li',
                    text: 'anotheronethird',
                    number: '3'
                }]);
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutations);
                var $newChildren = $root.$('ul.container').children();
                // should be strictly equal to since
                test.expect(list[3]).toBe($newChildren.element(0));
                test.expect(list[1]).toBe($newChildren.element(1));
                test.expect(list[0]).toBe($newChildren.element(2));
                test.expect(list[2]).toBe($newChildren.element(3));
                test.expect($newChildren.length()).toEqual(4);
            });
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Looper', function () {
        _.test.it('queue and deque handlers as they are asked, eliminating the need for individual request animation frame calls', function (done) {
            var count = 0;
            var id = _.AF.queue(function () {
                count++;
                if (count > 2) {
                    _.AF.dequeue(id);
                    done();
                }
            });
        });
        _.test.it('has a handler to synchronously iterate through it\'s handlers called run', function (done) {
            var count = 0,
                adder = 0,
                id = _.AF.queue(function () {
                    count++;
                    _.test.expect(count).toEqual(1 + adder);
                });
            _.AF.run();
            _.AF.queue(function () {
                count++;
                _.AF.dequeue(id);
                _.AF.dequeue();
                _.test.expect(count).toEqual(2 + adder);
                done();
            });
            adder = count;
            _.test.expect(count).toEqual(1);
        });
        _.test.it('uses a convenience binder to give handlers that do not have a context one', function () {
            var rebinder = function (expectant) {
                return function () {
                    _.test.expect(this).toBe(expectant);
                };
            };
            var boundToAF = _.AF.bind(rebinder(_.AF));
            var randomObject = {};
            var boundToRandomObject = _.AF.bind(_.bindTo(rebinder(randomObject), randomObject));
            boundToAF();
            boundToRandomObject();
        });
        _.test.it('has a convenience function called once', function (done) {
            var counter = 0;
            _.AF.once(function () {
                _.test.expect(counter).toEqual(0);
                counter++;
            });
            _.AF.queue(function () {
                counter++;
                if (counter > 2) {
                    // it is important that this is not 4
                    _.test.expect(counter).toEqual(3);
                    _.AF.dequeue();
                    done();
                }
            });
        });
        _.test.it('gives you a nice little tween function for calculating linear progressions against time', function () {
            var previous = 0;
            _.AF.tween(100, function (time, percent, finished) {
                _.test.expect(percent > previous).toBe(true);
                _.test.expect(_.isNumber(time)).toBe(true);
                _.test.expect(_.isNumber(percent)).toBe(true);
                _.test.expect(_.isBoolean(finished)).toBe(true);
                previous = percent;
                if (finished) {
                    _.AF.dequeue();
                    done();
                }
            });
        });
        _.test.it('gives you a timeout function in place of settimeout', function (done) {
            var counter = 0;
            var id = _.AF.queue(function () {
                counter++;
            });
            _.AF.timeout(50, function () {
                _.test.expect(counter > 1).toBe(true);
                _.test.expect(this).toBe(_.AF);
                _.AF.dequeue(id);
                done();
            });
        });
        _.test.it('gives you a timeout function in place of settimeout', function (done) {
            var counter = 0;
            _.AF.interval(50, function () {
                counter++;
                _.test.expect(this).toBe(_.AF);
                if (counter > 1) {
                    _.AF.dequeue();
                    done();
                }
            });
        });
        _.test.it('will also give you closures that you can call multiple times to defer an original function, much like the _.defer method', function (done) {
            var counter = 0,
                closure = _.AF.defer(100, function () {
                    _.test.expect(counter).toEqual(2);
                    done();
                });
            closure();
            setTimeout(function () {
                closure();
                counter++;
            });
            closure();
            counter++;
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('View', function () {
        var view, complexView, count, ComplexView = scopedFactories.View.extend({
            ui: {
                there: '.here'
            },
            events: {
                'sometrigger': 'dosomething'
            },
            elementEvents: {
                'click @ui.there': 'doThis'
            },
            elementTriggers: {
                'click': 'sometrigger'
            },
            dosomething: function () {},
            doThis: function () {
                count++;
            },
            template: function () {
                return [
                    ['span'],
                    ['div', {
                            class: 'here'
                        },
                        null
                    ]
                ];
            }
        });
        documentView.addRegion('main', '.test-div');
        _.test.beforeEach(function () {
            count = 0;
            view = scopedFactories.View();
            complexView = ComplexView();
        });
        _.test.afterEach(function () {
            view.destroy();
            complexView.destroy();
        });
        _.test.it('is an object', function () {
            _.test.expect(_.isObject(view)).toEqual(true);
            _.test.expect(_.isInstance(view, scopedFactories.View)).toEqual(true);
        });
        _.test.it('has an element that you can interact with', function () {
            _.test.expect(_.isInstance(view.el, factories.DomManager)).toEqual(true);
        });
        _.test.it('can even have extra elements tied to it... but only when it is rendered', function () {
            _.test.expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            _.test.expect(_.isInstance(complexView.ui.there, factories.DOMA)).toEqual(true);
        });
        _.test.it('can be rendered', function () {
            _.test.expect(complexView.el.html()).toEqual('');
            complexView.render();
            _.test.expect(complexView.el.html()).not.toEqual('');
        });
        _.test.it('can be attached to a region', function () {
            _.test.expect(complexView.el.element().parentNode).toEqual(null);
            documentView.directive('RegionManager').get('main').add(complexView);
            _.test.expect(complexView.el.element().parentNode).not.toEqual(null);
        });
        _.test.it('can have extra elements', function () {
            _.test.expect(_.isObject(complexView.ui)).toEqual(true);
            _.test.expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            _.test.expect(_.isInstance(complexView.ui.there, factories.DOMA)).toEqual(true);
            _.test.expect(complexView.ui.there.length()).toEqual(1);
        });
        _.test.it('can also attach events to it\'s element', function () {
            _.test.expect(count).toEqual(0);
            documentView.directive('RegionManager').get('main').add(complexView);
            _.test.expect(count).toEqual(0);
            complexView.el.click();
            _.test.expect(count).toEqual(1);
            complexView.render();
            _.test.expect(count).toEqual(1);
            complexView.el.click();
            _.test.expect(count).toEqual(2);
        });
        _.test.it('as well as it\'s ui elements', function () {
            _.test.expect(count).toEqual(0);
            documentView.directive('RegionManager').get('main').add(complexView);
            _.test.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.test.expect(count).toEqual(1);
            complexView.render();
            _.test.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.test.expect(count).toEqual(2);
        });
        _.test.it('views can be detached', function () {
            documentView.directive('RegionManager').get('main').add(complexView);
            _.test.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.test.expect(count).toEqual(1);
            complexView.remove();
            _.test.expect(count).toEqual(1);
        });
        _.test.it('and still keep their elements and events intact', function () {
            documentView.directive('RegionManager').get('main').add(complexView);
            _.test.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.test.expect(count).toEqual(1);
            complexView.remove();
            _.test.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.test.expect(count).toEqual(2);
        });
        _.test.it('they can even be reattached', function () {
            documentView.directive('RegionManager').get('main').add(complexView);
            _.test.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.test.expect(count).toEqual(1);
            complexView.remove();
            _.test.expect(count).toEqual(1);
            documentView.directive('RegionManager').get('main').add(complexView);
            _.test.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.test.expect(count).toEqual(2);
        });
        _.test.it('when they are destroyed however, their events are detached from the element and the view is automatically removed', function () {
            documentView.directive('RegionManager').get('main').add(complexView);
            _.test.expect(count).toEqual(0);
            // cache it so we can access it after the view has been destroyed
            var there = complexView.ui.there;
            there.click();
            _.test.expect(count).toEqual(1);
            complexView.destroy();
            _.test.expect(count).toEqual(1);
            there.click();
            _.test.expect(count).toEqual(1);
        });
        _.test.it('when rendering a view, if a false is passed, then it will leave the children alone', function () {
            var LeftAloneView = scopedFactories.View.extend({
                template: _.returns(false)
            });
            var leftAloneView = LeftAloneView();
            var newdiv = $.createElement('div');
            leftAloneView.render();
            leftAloneView.el.append(newdiv);
            leftAloneView.render();
            _.test.expect(leftAloneView.el.children().length()).toEqual(1);
        });
        _.test.it('when rendering a view if a string is passed, the children will be overwritten', function () {
            var EmptiedView = scopedFactories.View.extend({
                template: _.returns('')
            });
            var emptiedView = EmptiedView();
            var newdiv2 = $.createElement('div');
            emptiedView.render();
            emptiedView.el.append(newdiv2);
            emptiedView.render();
            _.test.expect(emptiedView.el.children().length()).toEqual(0);
        });
        _.test.it('also allows for triggers to be connected and piped through from element to view', function () {
            documentView.directive('RegionManager').get('main').add(complexView);
            complexView.on('sometrigger', function () {
                count++;
            });
            var el = complexView.el;
            el.click();
            _.test.expect(count).toEqual(2);
            complexView.dispatchEvent('sometrigger');
            _.test.expect(count).toEqual(3);
            complexView.destroy();
            _.test.expect(count).toEqual(3);
            el.click();
            _.test.expect(count).toEqual(3);
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var buster, iframe, count, handler = function () {
            count++;
        },
        contextHandler = function (expects) {
            return function () {
                count += (expects === this);
            };
        },
        protocol = window.location.protocol,
        framed_pathway = '/test/' + (app.BROWSERSTACKING ? 'browserstack/' : '') + 'framed.html',
        pagePromise = factories.HTTP.get('/test/framed.html');
    // testing from same server across different origins
    if (!window.location.port) {
        return;
    }
    _.test.describe('Buster', function () {
        _.test.beforeEach(function () {
            count = 0;
        });
        _.test.describe('can receive messages on', function () {
            _.test.it('unfriendly windows', function (done) {
                var iframe = $.createElement('iframe');
                documentView.directive('RegionManager').get('main').el.append(iframe);
                var split = window.location.origin.split(':');
                var buster = scopedFactories.Buster(window, iframe, {
                    iframeSrc: window.location.protocol + '//' + window.location.hostname + ':' + 9000 + framed_pathway
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    _.test.expect(count).toEqual(1);
                });
                buster.create('delayed').response(handler).deferred(function (e) {
                    _.test.expect(e.data().success).toEqual(true);
                    _.test.expect(count).toEqual(2);
                    iframe.destroy(done);
                }).send();
            });
            _.test.it('windows without a source', function (done) {
                pagePromise.success(function (response) {
                    var iframe = $.createElement('iframe');
                    documentView.directive('RegionManager').get('main').el.append(iframe);
                    var buster = scopedFactories.Buster(window, iframe, {
                        iframeContent: response
                    });
                    buster.connected(handler);
                    buster.sync(function (e) {
                        _.test.expect(count).toEqual(1);
                    });
                    buster.create('delayed').response(handler).deferred(function (e) {
                        _.test.expect(e.data().success).toEqual(true);
                        _.test.expect(count).toEqual(2);
                        iframe.destroy(done);
                    }).send();
                });
            });
            _.test.it('friendly windows', function (done) {
                var iframe = $.createElement('iframe');
                documentView.directive('RegionManager').get('main').el.append(iframe);
                var buster = scopedFactories.Buster(window, iframe, {
                    iframeSrc: window.location.origin + framed_pathway
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    _.test.expect(count).toEqual(1);
                });
                buster.create('delayed').response(handler).deferred(function (e) {
                    _.test.expect(e.data().success).toEqual(true);
                    _.test.expect(count).toEqual(2);
                    iframe.destroy(done);
                }).send();
            });
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Tests', function () {
        _.test.describe('useful for verifying information.', function () {
            _.test.describe('and you can easily make comparisons with the expect method and it\'s follow-up operations like:', function () {
                _.test.it('toBe', function () {
                    _.test.expect(1).toBe(1);
                    _.test.expect(true).toBe(true);
                    var obj = {};
                    // same pointers
                    _.test.expect(obj).toBe(obj);
                    _.test.expect(_.noop).toBe(_.noop);
                });
                _.test.it('not.toBe', function () {
                    _.test.expect(1).not.toBe(2);
                    _.test.expect(true).not.toBe(false);
                    // different pointers
                    _.test.expect({}).not.toBe({});
                    _.test.expect(function () {}).not.toEqual(function () {});
                });
                _.test.it('toEqual', function () {
                    _.test.expect(1).toEqual(1);
                    // different pointers, same values
                    _.test.expect([1]).toEqual([1]);
                    _.test.expect({
                        one: 1
                    }).toEqual({
                        one: 1
                    });
                    _.test.expect(_.noop).toEqual(_.noop);
                });
                _.test.it('not.toEqual', function () {
                    _.test.expect(1).not.toEqual(2);
                    // different pointers, different values
                    _.test.expect([1]).not.toEqual([2]);
                    _.test.expect({
                        one: 2
                    }).not.toEqual({
                        one: 1
                    });
                    // just different pointers
                    _.test.expect(function () {}).not.toEqual(function () {});
                });
                _.test.it('toEvaluateTo', function () {
                    _.test.expect(function () {
                        return 4;
                    }).toEvaluateTo(4);
                    // uses _.isEqual
                    _.test.expect(function () {
                        return {};
                    }).toEvaluateTo({});
                    _.test.expect(function () {
                        return _.noop;
                    }).toEvaluateTo(_.noop);
                });
                _.test.it('not.toEvaluateTo', function () {
                    _.test.expect(function () {
                        return '';
                    }).not.toEvaluateTo('beep');
                    _.test.expect(function () {
                        return {};
                    }).not.toEvaluateTo([]);
                    _.test.expect(function () {
                        return _.noop;
                    }).not.toEvaluateTo(function () {});
                    var test = function () {};
                    // it should be comparing the function to undefined
                    _.test.expect(test).not.toEvaluateTo(test);
                });
                _.test.it('toThrow', function () {
                    _.test.expect(function () {
                        throw new Error('testing throw');
                    }).toThrow();
                });
                _.test.it('not.toThrow', function () {
                    _.test.expect(function () {}).not.toThrow();
                });
            });
        });
        _.test.it('expect throws when it is nested... so don\'t do it', function () {
            _.test.expect(function () {
                _.test.expect();
            }).toThrow();
        });
        var describeReturnValue = _.test.describe('executed in their own stack', function () {
            var returnValue = _.test.it('for example this dummy test', function () {
                _.test.expect(1).toEqual(1);
            });
            _.test.it('will return a promise, and so will the describe method', function () {
                _.test.expect(_.Promise.isInstance(returnValue)).toEqual(true);
                _.test.expect(_.Promise.isInstance(describeReturnValue)).toEqual(true);
            });
        });
        _.test.describe('expect can also be extended to include custom tests using the maker method which is a member of the expect method', function () {
            _.test.it('including value / object comparison', function () {
                var expectation = _.test.expect('test');
                var value = expectation.toBeGreaterThan;
                expectation.toBe('test');
                _.test.expect(value).toBe(void 0);
                _.test.expect.maker('toBeGreaterThan', function (a, b) {
                    return a > b;
                }, function (a, b) {
                    return _.stringify(a) + ' was expected to be greater than ' + _.stringify(b);
                }, function () {
                    return _.stringify(a) + ' was expected not to be greater than ' + _.stringify(b);
                });
                expectation = _.test.expect(1);
                expectation.toBeGreaterThan(0);
                _.test.expect(_.isFunction(expectation.toBeGreaterThan)).toEqual(true);
                _.test.expect(_.isFunction(expectation.not.toBeGreaterThan)).toEqual(true);
            });
            _.test.it('as well as function comparison, where the function \'s result is compared', function () {
                var expectation = _.test.expect('test');
                expectation.toBe('test');
                _.test.expect(expectation.toEvaluateUnder).toBe(void 0);
                _.test.expect(expectation.not.toEvaluateUnder).toBe(void 0);
                // had to make something up to prove method was executing
                _.test.expect.maker('toEvaluateUnder', function (a, b) {
                    return a === b;
                }, function (a, b) {
                    return _.stringify(a) + ' was expected to be evaluated with the context of ' + _.stringify(b);
                }, function () {
                    return _.stringify(a) + ' was expected not to be evaluated with the context of ' + _.stringify(b);
                }, true);
                var obj = {};
                var bound = _.bind(function () {
                    return this;
                }, obj);
                expectation = _.test.expect(bound);
                expectation.toEvaluateUnder(obj);
                _.test.expect(bound).not.toEvaluateUnder({});
                _.test.expect(_.isFunction(expectation.toEvaluateUnder)).toEqual(true);
                _.test.expect(_.isFunction(expectation.not.toEvaluateUnder)).toEqual(true);
            });
        });
    });
});
application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var test = _.test;
    test.describe('Odette', function () {
        test.describe('creates version independent application objects', function () {
            test.it('wherever the "where" array says it has', function () {
                _.each(Odette.where, function (key) {
                    test.expect(window[key]).not.toEqual(void 0);
                });
            });
            test.it('will create new version independent application objects when it is', function () {
                var ran = false;
                Odette(window, 'testApp', '0.0.1', function (application, app) {
                    test.expect(application).not.toBe(window.application);
                    test.expect(window.testApp).toBe(application);
                    test.expect(application.VERSION).toEqual(Odette.VERSION);
                    ran = true;
                }, function () {
                    test.expect(ran).toBe(true);
                });
            });
            test.it('but will not run the first function if it has already been created', function () {
                var ran = false;
                // usually these two will be the same function, but for speed's sake, i'm just going to make it a simple switch
                Odette(window, 'testApp', '0.0.1', function () {
                    ran = true;
                }, function () {
                    test.expect(ran).toBe(false);
                });
            });
            test.it('and those objects have scoped constructors at the Application property', function () {
                test.expect(_.isFunction(testApp.Application)).toBe(true);
            });
            test.it('they also have a current version focus', function () {
                test.expect(testApp.currentVersion).toBe('0.0.1');
                Odette(window, 'testApp', '0.0.2', function () {});
                test.expect(testApp.currentVersion).toBe('0.0.2');
            });
            test.it('as well as a default version focus', function () {
                test.expect(testApp.defaultVersion).toBe('0.0.2');
                Odette(window, 'testApp', '0.0.1', function () {});
                test.expect(testApp.defaultVersion).toBe('0.0.2');
            });
            test.it('using scope you can target specific versions, or blindly return the default (highest) version', function () {
                test.expect(application.scope(app.VERSION)).toBe(app);
                Odette(window, 'application', '0.0.1', function () {});
                test.expect(application.scope()).toBe(application.scope(application.defaultVersion));
            });
            test.it('also has a counter that is shared globaly across all version independent application objects and used by all scoped apps', function () {
                // useful for
                test.expect(Odette.counter() + 1).toBe(app.counter());
            });
            test.it('can also do a simple return', function () {
                test.expect(application.get('fakeout')).toBe(void 0);
                test.expect(application.get(app.VERSION)).toBe(app);
            });
            test.it('version independent applications unhook their version apps using the unRegisterVersion method', function () {
                var counter, subapp = testApp.get('0.0.1');
                test.expect(subapp).not.toBe(void 0);
                subapp.destroy = function () {
                    counter = 1;
                };
                testApp.unRegisterVersion('0.0.1');
                test.expect(counter).toBe(1);
            });
        });
    });
});