var indexOf = require('.');
var b = require('batterie');
var numbers = [1, 2, 3, 4, 3, 5];
var strings = ['', 'a', 'b', 'a', 'long'];
var obj1 = {};
var obj2 = {};
var objList = [obj1, obj2, obj2, obj1];
b.describe('indexOf', function () {
    b.it('finds items in arrays', [
        ['finds numbers from the left', indexOf(numbers, 3), 2],
        ['does not do deep equality', indexOf(objList, obj2), 1]
    ]);
});