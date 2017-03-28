var b = require('batterie');
var _ = require('./utils');
var findKeyRight = require('./right');
b.describe('findKeyRight', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    Class.prototype = {
        one: 1,
        two: 2
    };
    b.it('is a function', function (t) {
        t.expect(findKeyRight).toBeFunction();
    });
    b.it('cannot iterate over objects', function (t) {
        var keys = [];
        var value = findKeyRight(new Class(), function (value, key) {
            keys.push(key);
            return key === 'one';
        });
        t.expect(value).toBeUndefined();
        t.expect(keys).toEqual([]);
    }, 2);
    b.it('works with arrays', function (t) {
        var list = [];
        var value = findKeyRight(numbers, function (value, key) {
            list.push(value);
            return key === 5;
        });
        t.expect(value).toBe(5);
        t.expect(list).toEqual([9, 8, 7, 6]);
    }, 2);

    function Class() {
        this.three = 3;
        this.four = 4;
    }
});