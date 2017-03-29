var indexOfRight = require('./right');
var b = require('batterie');
var numbers = [1, 2, 3, 4, 3, 5];
var strings = ['', 'a', 'b', 'a', 'long'];
var obj1 = {};
var obj2 = {};
var objList = [obj1, obj2, obj2, obj1];
b.describe('indexOfRight', function () {
    b.it('finds items in arrays from the right', [
        ['finds numbers from the right', indexOfRight(numbers, 3), 4],
        ['does not do deep equality', indexOfRight(objList, obj2), 2]
    ]);
});