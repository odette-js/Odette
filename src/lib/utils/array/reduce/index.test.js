var b = require('batterie');
var reduce = require('.');
var numbers = [1, 2, 3, 4];
b.describe('reduce', function () {
    b.it('is a function', function (t) {
        t.expect(reduce).toBeFunction();
    });
    b.it('iterates over arrays', function (t) {
        var result = reduce(numbers, function (memo, number) {
            return number + memo
        }, 0);
        t.expect(result).toBe(10);
    });
    b.it('does not change the memo if nothing is returned', function (t) {
        var result = reduce(numbers, function () {}, 5);
        t.expect(result).toBe(5);
    });
    // b.it('iterates over objects')
});