var b = require('batterie');
var _ = require('./utils');
var findOwnKey = require('./own');
b.describe('findOwnKey', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    Class.prototype = {
        one: 1,
        two: 2
    };
    b.it('is a function', function (t) {
        t.expect(findOwnKey).toBeFunction();
    });
    b.it('cannot iterate over the prototype', function (t) {
        var value = findOwnKey(new Class(), function (value, key) {
            return key === 'one';
        });
        t.expect(value).toBeUndefined();
    });
    b.it('can find instance properties', function (t) {
        var value = findOwnKey(new Class(), function (value, key) {
            return key === 'three';
        });
        t.expect(value).toBe(3);
    });
    b.it('works with arrays', function (t) {
        var list = [];
        var value = findOwnKey(numbers, function (value, key) {
            list.push(value);
            return key === 5;
        });
        t.expect(value).toBe(6);
        t.expect(list).toEqual([1, 2, 3, 4, 5, 6]);
    }, 2);

    function Class() {
        this.three = 3;
        this.four = 4;
    }
});