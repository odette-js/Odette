var _ = require('./utils');
var filter = require('.');
test.describe('filter', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    test.it('creates a new list of elements', function () {
        var list = filter(numbers, function () {
            return true;
        });
        test.expect(list).toEqual(numbers);
        test.expect(list).not.toBe(numbers);
    }, 2);
    test.it('removes any elements that did not return a truthy value', function () {
        var list = filter(numbers, function (value) {
            return value === 2 || value === 6;
        });
        test.expect(list).toEqual([2, 6]);
    });
    test.it('can also use objects to filter', function () {
        test.expect(filter([{
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
    test.it('can use arrays to filter', function () {
        test.expect(filter([{
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
require('./negative.test');
require('./negative-right.test');
require('./right.test');