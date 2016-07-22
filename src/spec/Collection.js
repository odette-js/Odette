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