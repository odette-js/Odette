var matchesBinary = require('././utils/object/matches/binary');
module.exports = function commonFilter(memo, passed) {
    return function filter(thing, bound, negated, reduction) {
        var negative = !negated;
        return reduction(thing, function (memo, item, index, list) {
            if (matchesBinary(bound(item, index, list), negative)) {
                passed(memo, item, index);
            }
        }, memo());
    };
};