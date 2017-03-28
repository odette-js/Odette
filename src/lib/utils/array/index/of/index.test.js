var indexOf = require('.');
var b = require('batterie');
var numbers = [1, 2, 3, 4, 5];
var strings = ['', 'a', 'b', 'long'];
var obj1 = {};
var obj2 = {};
var obj3 = {};
var objList = [obj1, obj2, obj3];
b.describe('indexOf', function () {
    b.it('finds items in arrays', [
        ['such as numbers', indexOf(numbers, 3), 2],
        ['and strings', indexOf(strings, 'a'), 1],
        ['even NaN', indexOf(numbers.concat([NaN], strings), NaN), 5],
        ['even finds objects', indexOf(objList, obj2), 1]
    ]);
});