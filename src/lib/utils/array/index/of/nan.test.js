var indexOfNaN = require('./nan');
var b = require('batterie');
var numbersWithNaN = [1, 2, NaN, 4, 5];
var numbers = [1, 2, 3, 4];
var manyNaN = [1, NaN, 5, 3, NaN, 5, 7];
// array, fromIndex, toIndex, fromRight
b.describe('indexOfNaN', function () {
    b.it('finds NaN in arrays', [
        ['if there is nan', indexOfNaN(numbersWithNaN), 2],
        ['and returns -1 if no NaN is found', indexOfNaN(numbers), -1],
        ['finds the first in the array', indexOfNaN(manyNaN), 1]
    ]);
});