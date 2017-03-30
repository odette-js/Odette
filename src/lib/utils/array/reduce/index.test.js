var b = require('batterie');
var reduce = require('.');
var numbers = [1, 2, 3, 4];
b.describe('reduce', function () {
    b.it('is a function', b.curry(reduce, 'toBeFunction'));
    b.it('iterates over arrays', b.curry(reduce(numbers, function (memo, number) {
        return number + memo
    }, 0), 'toBe', 10));
    b.it('does not change the memo if nothing is returned', b.curry(reduce(numbers, function () {}, 5), 'toBe', 5));
    b.it('iterates from the left', function (t) {
        var list = [];
        var result = reduce(numbers, function (memo, number) {
            list.push(number);
            return number + memo
        }, 0);
        t.expect(list).toEqual(numbers);
    });
});