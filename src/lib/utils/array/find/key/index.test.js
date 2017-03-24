var _ = require('./utils');
var findKey = require('.');
test.describe('findKey', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    Class.prototype = {
        one: 1,
        two: 2
    };
    test.it('is a function', function () {
        test.expect(findKey).toBeFunction();
    });
    test.it('cannot iterate over objects', function () {
        var keys = [];
        var value = findKey(new Class(), function (value, key) {
            keys.push(key);
            return key === 'one';
        });
        test.expect(value).toBeUndefined();
        test.expect(keys).toEqual([]);
    }, 2);
    test.it('works with arrays', function () {
        var value = findKey(numbers, function (value, key) {
            return key === 5;
        });
        test.expect(value).toBe(5);
    });

    function Class() {
        this.three = 3;
        this.four = 4;
    }
});
require('./in.test');
require('./in-right.test');