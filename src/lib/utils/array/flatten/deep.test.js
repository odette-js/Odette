var b = require('batterie');
var _ = require('./utils');
var flattenDeep = require('./deep');
b.it('flattenDeep', [
    ['will flatten an array, deeply', flattenDeep([
        [
            [{}]
        ],
        [
            [{}]
        ],
        [
            [{}]
        ]
    ]), [{}, {}, {}]],
    ['will go until there is nowhere left to go', flattenDeep([4, [5, {
            one: 1,
            two: 2
        }, 9],
        [10]
    ]), [4, 5, {
        one: 1,
        two: 2
    }, 9, 10]]
]);