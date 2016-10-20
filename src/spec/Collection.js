application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    test.describe('Collection', function () {
        var collection, numberCollection, complexCollection, evenNumberList, numberCollectionLength = 10;
        test.beforeEach(function () {
            collection = factories.Collection();
            numberCollection = factories.Collection([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            complexCollection = factories.Collection([factories.Model(), factories.Model({
                one: 1,
                two: 2,
                three: 3
            })]);
            evenNumberList = [0, 2, 4, 6, 8];
        });
        test.it('extends from factories.Extendable', function () {
            test.expect(_.isInstance(collection, factories.Extendable)).toEqual(true);
        }, 1);
        test.it('is not an array like object', function () {
            test.expect(_.isArrayLike(collection)).toEqual(false);
        }, 1);
        test.it('knows it\'s length', function () {
            test.expect(numberCollection.length()).toEqual(10);
        }, 1);
        test.it('can give you all of it\'s values at once', function () {
            test.expect(collection.toArray()).toEqual(collection.items);
        }, 1);
        test.it('or one at a time', function () {
            numberCollection.duff(function (item, idx) {
                test.expect(numberCollection.item(idx)).toEqual(numberCollection.items[idx]);
            });
        }, numberCollectionLength);
        test.it('as well as in reverse order', function () {
            var list = [];
            numberCollection.duffRight(function (item, idx) {
                test.expect(numberCollection.item(idx)).toEqual(numberCollection.items[idx]);
                list.push(item);
            });
            test.expect(list).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        }, numberCollectionLength + 1);
        test.it('can trigger toJSON on children', function () {
            test.expect(JSON.stringify(numberCollection)).toEqual('[0,1,2,3,4,5,6,7,8,9]');
            test.expect(JSON.stringify(complexCollection)).toEqual('[{},{"one":1,"two":2,"three":3}]');
        }, 2);
        test.it('can also concatonate itself with collections and arrays just like a regular array', function () {
            var collection = factories.Collection([0, 1, 2, 3, 4]),
                list = factories.Collection([5, 6, 7, 8, 9]);
            test.expect(collection.concat(list, evenNumberList).toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 2, 4, 6, 8]);
        }, 1);
        test.describe('but other methods need arrays... Collections also have a bunch of methods that they stole from the _ object such as:', function () {
            // test.it('addAll', function () {
            //     test.expect(numberCollection.addAll([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]);
            // });
            // test.it('removeAll', function () {
            //     test.expect(numberCollection.removeAll([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).toArray()).toEqual([1, 3, 5, 7, 9]);
            // });
            test.it('sort', function () {
                test.expect(numberCollection.sort().toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
                test.expect(numberCollection.sort(function (a, b) {
                    return (a % 3) - (b % 3);
                }).toArray()).toEqual([0, 3, 6, 9, 1, 4, 7, 2, 5, 8]);
            }, 2);
            test.it('unshift', function () {
                numberCollection.unshift(-1);
                test.expect(numberCollection.toArray()).toEqual([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }, 1);
            test.it('push', function () {
                numberCollection.push(10);
                test.expect(numberCollection.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
                numberCollection.push([11, 12, 13]);
                test.expect(numberCollection.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
            }, 2);
            test.it('cycle', function () {
                numberCollection.cycle(3);
                test.expect(numberCollection.toArray()).toEqual([3, 4, 5, 6, 7, 8, 9, 0, 1, 2]);
            }, 1);
            test.it('uncycle', function () {
                numberCollection.uncycle(3);
                test.expect(numberCollection.toArray()).toEqual([7, 8, 9, 0, 1, 2, 3, 4, 5, 6]);
            }, 1);
            test.it('count', function () {
                test.expect(numberCollection.count(function (item, idx, list) {
                    if (item === null) {
                        list.push(idx);
                    }
                }, 10, 20).length()).toEqual(20);
            }, 1);
            test.it('countTo', function () {
                test.expect(numberCollection.countTo(function (item, idx, list) {
                    if (item === null) {
                        list.push(idx);
                    }
                }, 20).length()).toEqual(20);
            }, 1);
            test.it('countFrom', function () {
                var count = 0;
                numberCollection.countFrom(function (item, idx, list) {
                    count++;
                }, 6);
                test.expect(count).toEqual(4);
            }, 1);
            test.it('add', function () {
                test.expect(numberCollection.add(61)).toEqual(true);
                test.expect(numberCollection.add(5)).toEqual(false);
                test.expect(numberCollection.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 61]);
                test.expect(numberCollection.add(61)).toEqual(false);
            }, 4);
            test.it('insertAt', function () {
                test.expect(numberCollection.insertAt(5, 1)).toEqual(true);
                test.expect(numberCollection.toArray()).toEqual([0, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }, 2);
            test.it('remove', function () {
                test.expect(numberCollection.remove(5)).toEqual(true);
                test.expect(numberCollection.toArray()).toEqual([0, 1, 2, 3, 4, 6, 7, 8, 9]);
                test.expect(numberCollection.remove(5)).toEqual(false);
            }, 3);
            test.it('removeAt', function () {
                test.expect(numberCollection.removeAt(3)).toEqual(3);
                test.expect(numberCollection.removeAt(3)).toEqual(4);
                test.expect(numberCollection.length()).toEqual(8);
            }, 3);
            test.it('pop', function () {
                test.expect(numberCollection.pop()).toEqual(9);
                test.expect(numberCollection.pop()).toEqual(8);
                test.expect(numberCollection.length()).toEqual(8);
            }, 3);
            test.it('shift', function () {
                test.expect(numberCollection.shift()).toEqual(0);
                test.expect(numberCollection.shift()).toEqual(1);
                test.expect(numberCollection.length()).toEqual(8);
            }, 3);
            test.it('indexOf', function () {
                test.expect(numberCollection.indexOf(3)).toEqual(3);
                test.expect(numberCollection.indexOf(7)).toEqual(7);
            }, 2);
            test.it('find', function () {
                test.expect(numberCollection.find(function (ix, item) {
                    return item === 10;
                })).toEqual(void 0);
                test.expect(numberCollection.find(function (ix, item) {
                    return item === 7;
                })).toEqual(7);
            }, 2);
            test.it('findLast', function () {
                test.expect(factories.Collection([12, 1, 2, 1, 104, 2, 1, 5, 55, 6, 2, 7]).findLast(function (item) {
                    return item % 17 === 0;
                })).toEqual(void 0);
                test.expect(factories.Collection([88, 2, 1, 5, 70, 23, 43, 9]).findLast(function (item) {
                    return item % 2 === 0;
                })).toEqual(70);
            }, 2);
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
            test.it('findWhere', function () {
                test.expect(factories.Collection([firstFindObj, secondFindObj]).findWhere({
                    one: 2
                })).toEqual(void 0);
                test.expect(factories.Collection([firstFindObj, secondFindObj]).findWhere({
                    two: 2
                })).toEqual(firstFindObj);
            }, 2);
            test.it('findLastWhere', function () {
                test.expect(factories.Collection([firstFindObj, secondFindObj]).findLastWhere({
                    one: 2
                })).toEqual(void 0);
                test.expect(factories.Collection([firstFindObj, secondFindObj]).findLastWhere({
                    two: 2
                })).toEqual(secondFindObj);
            }, 2);
            test.it('foldr', function () {
                test.expect(numberCollection.foldr(function (memo, idx, item) {
                    memo.push(item);
                    return memo;
                }, [])).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
            }, 1);
            test.it('foldl', function () {
                test.expect(numberCollection.foldl(function (memo, idx, item) {
                    memo.push(item);
                    return memo;
                }, [])).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }, 1);
            test.it('merge', function () {
                test.expect(numberCollection.merge([0, 1, 2, 6, 7, 8]).toArray()).toEqual([0, 1, 2, 6, 7, 8, 6, 7, 8, 9]);
            }, 1);
            test.it('range', function () {
                test.expect(factories.Collection().range(4, 9).toArray()).toEqual([4, 5, 6, 7, 8]);
            }, 1);
            test.it('eq', function () {
                test.expect(numberCollection.eq(4).toArray()).toEqual([4]);
                test.expect(numberCollection.eq([3, 9]).toArray()).toEqual([3, 9]);
            }, 2);
            test.it('map', function () {
                test.expect(numberCollection.map(function (idx, item) {
                    return item * 2;
                }).toArray()).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
            }, 1);
            test.it('filter', function () {
                test.expect(numberCollection.filter(function (idx, item) {
                    return item % 2;
                }).toArray()).toEqual([1, 3, 5, 7, 9]);
            }, 1);
            test.it('pluck', function () {
                test.expect(factories.Collection([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]).results('one').toArray()).toEqual([1, 2, 3, 4]);
            }, 1);
            test.it('where', function () {
                test.expect(factories.Collection([{
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
            }, 1);
            test.it('flatten', function () {
                test.expect(factories.Collection([
                    [0, 1, 2, 3],
                    [4, 5, 6, 7, 8],
                    [9, 10, 11, 12]
                ]).flatten().toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            }, 1);
        });
    });
    test.describe('SortedCollection', function () {
        var collection, complexCollection, evenNumberList, numberCollection, SortedCollection = factories.SortedCollection;
        test.beforeEach(function () {
            collection = SortedCollection();
            numberCollection = SortedCollection([4, 5, 3, 7, 8, 6, 2, 0, 1, 9]);
            complexCollection = SortedCollection([factories.Model(), factories.Model({
                one: 1,
                two: 2,
                three: 3
            })]);
            evenNumberList = [0, 2, 4, 6, 8];
        });
        test.it('should be sorted at the beginning', function () {
            test.expect(numberCollection.toJSON()).toEqual(numberCollection.sort().toJSON());
        }, 1);
        test.it('can get values without having to iterate over everything', function () {
            numberCollection.indexOf = _.noop;
            test.expect(numberCollection.get('id', 8)).toEqual(8);
        }, 1);
        test.it('can add values in the correct place', function () {
            var sorted = SortedCollection(evenNumberList);
            sorted.add(1);
            sorted.add(5);
            sorted.add(3);
            test.expect(sorted.item(0)).toEqual(0);
            test.expect(sorted.item(1)).toEqual(1);
            test.expect(sorted.item(2)).toEqual(2);
            test.expect(sorted.item(3)).toEqual(3);
            test.expect(sorted.item(4)).toEqual(4);
            test.expect(sorted.item(5)).toEqual(5);
        }, 6);
        test.it('can remove values from the correct place', function () {
            var sorted = SortedCollection(evenNumberList);
            sorted.remove(4);
            sorted.remove(2);
            test.expect(sorted.item(0)).toEqual(0);
            test.expect(sorted.item(1)).toEqual(6);
            test.expect(sorted.item(2)).toEqual(8);
        }, 3);
    });
});