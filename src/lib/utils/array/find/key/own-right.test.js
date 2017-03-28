var b = require('batterie');
var _ = require('./utils');
var findOwnKeyRight = require('./own-right');
b.describe('findOwnKeyRight', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    Class.prototype = {
        one: 1,
        two: 2
    };
    b.it('is a function', function (t) {
        t.expect(findOwnKeyRight).toBeFunction();
    });
    b.it('cannot iterate over the prototype', function (t) {
        var value = findOwnKeyRight(new Class(), function (value, key) {
            return key === 'one';
        });
        t.expect(value).toBeUndefined();
    });
    b.it('can find instance properties', function (t) {
        var value = findOwnKeyRight(new Class(), function (value, key) {
            return key === 'three';
        });
        t.expect(value).toBe(3);
    });
    b.it('works with arrays', function (t) {
        var value = findOwnKeyRight(numbers, function (value, key) {
            return key === 5;
        });
        t.expect(value).toBe(6);
    });

    function Class() {
        this.three = 3;
        this.four = 4;
    }
});