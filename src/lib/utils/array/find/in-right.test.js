var _ = require('./utils');
var findInRight = require('./in-right');
test.describe('findInRight', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    Class.prototype = {
        one: 5,
        two: 10,
        three: 15,
        four: 20
    };

    function Class() {
        this.one = 1;
        this.two = 2;
        this.five = 'fiver';
    }
    test.it('is a function', function () {
        test.expect(findInRight).toBeFunction();
    });
    test.it('iterates through lists in reverse', function () {
        var list = [];
        findInRight(numbers, function (value) {
            list.push(value);
        });
        test.expect(list).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);
    });
    test.it('can be stopped when a truthy value is returned', function () {
        var list = [];
        var value = findInRight(numbers, function (value, index) {
            list.push(value);
            return index / 2 === 2;
        });
        test.expect(list).toEqual([9, 8, 7, 6, 5]);
        test.expect(value).toBe(5);
    }, 2);
    test.it('really shines when iterating over objects', function () {
        var keys = [];
        var instance = new Class();
        findInRight(instance, function (value, key) {
            keys.push(key);
        });
        test.expect(_.contains(keys, 'one')).toBeTrue();
        test.expect(_.contains(keys, 'two')).toBeTrue();
        test.expect(_.contains(keys, 'five')).toBeTrue();
    }, 3);
    test.it('iterates over prototype keys', function () {
        var keys = [];
        var instance = new Class();
        findInRight(instance, function (value, key) {
            keys.push(key);
        });
        test.expect(_.contains(keys, 'three')).toBeTrue();
        test.expect(_.contains(keys, 'four')).toBeTrue();
    }, 2);
});