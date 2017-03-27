var _ = require('./utils');
var findRight = require('./right');
b.describe('findRight', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    b.it('is a function', function (t) {
        t.expect(findRight).toBeFunction();
    });
    b.it('finds items in lists', function (t) {
        var list = [];
        t.expect(findRight(numbers, function (item) {
            list.push(item);
            return item === 4;
        })).toBe(4);
        t.expect(list).toEqual([9, 8, 7, 6, 5, 4]);
    }, 2);
    b.it('does not work with objects', function (t) {
        var keys = [];
        t.expect(findRight({
            one: 1,
            two: 2
        }, function (value, key) {
            keys.push(key);
            return value;
        })).toBeUndefined();
        t.expect(keys).toEqual([]);
    }, 2);
});