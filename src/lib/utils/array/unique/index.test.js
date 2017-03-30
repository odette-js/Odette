var b = require('batterie');
var unique = require('.');
var numbers = [5, 5, 5, 4, 3, 3, 2, 2, 2, 2, 1];
b.describe('unique', function () {
    b.it('filters', [
        ['matching objects', unique(numbers), [5, 4, 3, 2, 1]],
        ['returns an empty array by default', unique(), []],
        ['works for objects', unique({
            one: 1,
            two: 2,
            three: 1,
            four: 2
        }), [1, 2]]
    ]);
});