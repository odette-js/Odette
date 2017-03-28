var b = require('batterie');
var _ = require('./utils');
var concat = require('.');
b.it('concat', [
    ['flattens a list', concat([1, 2, 3, 4]), [1, 2, 3, 4]],
    ['even with nested arrays', concat([1, 2, [3], 4, [5]]), [1, 2, 3, 4, 5]],
    ['will only go one layer deep', concat([1, 2, [3], 4, [
        [5]
    ]]), [1, 2, 3, 4, [5]]]
]);