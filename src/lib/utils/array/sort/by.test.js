var b = require('batterie');
var sortBy = require('./by');
var _a = {
    value: 1
};
var _b = {
    value: 2
};
var _c = {
    value: 3
};
var _d = {
    value: 4
};
var objects = [_a, _b, _c, _d];
b.describe('sort', function () {
    var crazylist = objects.slice(2).concat(objects.slice(0, 2));
    b.it('arranges', [
        ['by default arranges by ascending', sortBy(crazylist.slice(0), 'value'), [_a, _b, _c, _d]],
        ['a comparator can be passed to arrange in a different manner', sortBy(crazylist.slice(0), function (obj) {
            return -obj.value;
        }), [_d, _c, _b, _a]]
    ]);
});