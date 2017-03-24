var _ = require('./utils');
var find = require('.');
test.describe('find', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    test.it('is a function', function () {
        test.expect(find).toBeFunction();
    });
    test.it('finds items in lists', function () {
        var list = [];
        test.expect(find(numbers, function (item) {
            list.push(item);
            return item === 4;
        })).toBe(4);
        test.expect(list).toEqual([1, 2, 3, 4]);
    }, 2);
    test.it('does not work with objects', function () {
        var keys = [];
        test.expect(find({
            one: 1,
            two: 2
        }, function (value, key) {
            keys.push(key);
            return value;
        })).toBeUndefined();
        test.expect(keys).toEqual([]);
    }, 2);
});
require('./accessor.test');
require('./in-right.test');
require('./in.test');
require('./key/index.test');