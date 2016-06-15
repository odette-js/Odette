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