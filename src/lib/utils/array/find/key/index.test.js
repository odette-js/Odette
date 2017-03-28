var b = require('batterie');
var _ = require('./utils');
var findKey = require('.');
b.describe('findKey', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    Class.prototype = {
        one: 1,
        two: 2
    };
    b.it('is a function', function (t) {
        t.expect(findKey).toBeFunction();
    });
    b.it('cannot iterate over objects', function (t) {
        var keys = [];
        var value = findKey(new Class(), function (value, key) {
            keys.push(key);
            return key === 'one';
        });
        t.expect(value).toBeUndefined();
        t.expect(keys).toEqual([]);
    }, 2);
    b.it('works with arrays', function (t) {
        var value = findKey(numbers, function (value, key) {
            return key === 5;
        });
        t.expect(value).toBe(5);
    });

    function Class() {
        this.three = 3;
        this.four = 4;
    }
});