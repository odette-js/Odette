var b = require('batterie');
var map = require('.');
var numbers = [1, 2, 3];
var numbersLike = {
    '0': 1,
    '1': 2,
    '2': 3,
    length: 3
};
var object = {
    '0': 1,
    '1': 2,
    '2': 3
};
b.describe('map', function () {
    b.it('iterates', [
        ['over arrays', map(numbers, multiplyBy2), [2, 4, 6]],
        ['over arraylike objects', map(numbersLike, multiplyBy2), [2, 4, 6]],
        ['but not objects', map(object, multiplyBy2), []]
    ]);
});

function multiplyBy2(number) {
    return number * 2;
}