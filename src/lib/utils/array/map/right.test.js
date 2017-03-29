var b = require('batterie');
var mapRight = require('./right');
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
b.describe('mapRight', function () {
    b.it('iterates', [
        ['over arrays', mapRight(numbers, multiplyBy2), [6, 4, 2]],
        ['over arraylike objects', mapRight(numbersLike, multiplyBy2), [6, 4, 2]],
        ['but not objects', mapRight(object, multiplyBy2), []]
    ]);
});

function multiplyBy2(number) {
    return number * 2;
}