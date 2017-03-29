var sortedIndexOf = require('./sorted');
var b = require('batterie');
var numbers = [1, 2, 3, 4, 5, 40, 50, 80];
b.describe('sortedIndexOf', function () {
    b.it('finds items in arrays', [
        ['finds numbers', sortedIndexOf(numbers, 40), 5],
        ['finds numbers when sorted', sortedIndexOf(numbers, 40), 5]
    ]);
});