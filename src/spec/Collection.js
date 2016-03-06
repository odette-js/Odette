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
        it('extends from factories.Collection', function () {
            expect(_.isInstance(collection, factories.Collection)).toEqual(true);
        });
        // it('has an array at _items', function () {
        //     expect(_.isArray(collection.directive('list').items)).toEqual(true);
        // });
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