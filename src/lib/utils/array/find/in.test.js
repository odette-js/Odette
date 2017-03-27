var _ = require('./utils');
var findIn = require('./in');
b.describe('findIn', function () {
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
    b.it('is a function', function (t) {
        t.expect(findIn).toBeFunction();
    });
    b.it('iterates through lists in reverse', function (t) {
        var list = [];
        findIn(numbers, function (value) {
            list.push(value);
        });
        t.expect(list).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    b.it('can be stopped by returning a truthy value', function (t) {
        var list = [];
        var value = findIn(numbers, function (number) {
            list.push(number);
            return number === 5;
        });
        t.expect(value).toEqual(5);
        t.expect(list).toEqual([1, 2, 3, 4, 5]);
    }, 2);
    b.it('works with objects', function (t) {
        var keys = [];
        var value = findIn(new Class(), function (number, key) {
            keys.push(key);
        });
        t.expect(value).toBeUndefined();
        t.expect(_.contains(keys, 'one')).toBeTrue();
        t.expect(_.contains(keys, 'two')).toBeTrue();
        t.expect(_.contains(keys, 'three')).toBeTrue();
        t.expect(_.contains(keys, 'four')).toBeTrue();
        t.expect(_.contains(keys, 'five')).toBeTrue();
    }, 6);
    b.it('can also stop early when iterating over an object', function (t) {
        var keys = [];
        var value = findIn(new Class(), function (value, key) {
            keys.push(key);
            return value === 15;
        });
        t.expect(keys.length).notToBeGreaterThan(4);
        t.expect(value).toBe(15);
    }, 2);
});