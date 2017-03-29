var indexOfNan = require('./nan');
var b = require('batterie');
var numbersWithNaN = [1, 2, NaN, 4, 5];
var numbers = [1, 2, 3, 4];
var manyNaN = [1, NaN, 5, 3, NaN, 5, 7];
b.describe('indexOfNan', function () {
    b.it('finds NaN in arrays', [
        ['if there is nan', indexOfNan(numbersWithNaN), 2],
        ['and returns -1 if no NaN is found', indexOfNan(numbers), -1],
        ['finds the first in the array', indexOfNan(manyNaN), 1]
    ]);
});