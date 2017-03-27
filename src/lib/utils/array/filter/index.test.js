var _ = require('./utils');
var filter = require('.');
b.describe('filter', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    b.it('creates a new list of elements', function (t) {
        var list = filter(numbers, function () {
            return true;
        });
        t.expect(list).toEqual(numbers);
        t.expect(list).notToBe(numbers);
    }, 2);
    b.it('removes any elements that did not return a truthy value', function (t) {
        var list = filter(numbers, function (value) {
            return value === 2 || value === 6;
        });
        t.expect(list).toEqual([2, 6]);
    });
    b.it('can also use objects to filter', function (t) {
        t.expect(filter([{
            one: 1
        }, {
            two: 2
        }, {
            one: 2
        }, {
            one: 2,
            two: 2
        }, {
            one: 1,
            two: 2
        }], {
            one: 1
        })).toEqual([{
            one: 1
        }, {
            one: 1,
            two: 2
        }]);
    });
    b.it('can use arrays to filter', function (t) {
        t.expect(filter([{
            one: 1
        }, {
            two: 2
        }, {
            one: 1,
            two: 2
        }], ['one', 1])).toEqual([{
            one: 1
        }, {
            one: 1,
            two: 2
        }]);
    });
});