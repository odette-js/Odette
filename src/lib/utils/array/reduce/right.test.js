var b = require('batterie');
var reduceRight = require('./right');
var numbers = [1, 2, 3, 4];
b.describe('reduceRight', function () {
    b.it('is a function', b.curry(reduceRight, 'toBeFunction'));
    b.it('iterates over arrays', b.curry(reduceRight(numbers, function (memo, number) {
        return number + memo
    }, 0), 'toBe', 10));
    b.it('does not change the memo if nothing is returned', b.curry(reduceRight(numbers, function () {}, 5), 'toBe', 5));
    b.it('iterates from the left', function (t) {
        var list = [];
        var result = reduceRight(numbers, function (memo, number) {
            list.push(number);
            return number + memo
        }, 0);
        t.expect(list).toEqual(numbers.slice(0).reverse());
    });
});