var b = require('batterie');
var _ = require('./utils');
var flattenSelectively = require('./selectively');
b.it('flattenSelectively', [
    ['to selectively flatten simply pass a function', flattenSelectively([
        [1, 2],
        [3, 4],
        [5, 6]
    ], function (item) {
        return item[0] > 4;
    }), [
        [1, 2],
        [3, 4], 5, 6
    ]]
]);