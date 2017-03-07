var matchesBinary = require('./utils/matches-binary');
module.exports = function (memo, passed) {
    return function (thing, bound, negated, reduction) {
        var negative = !negated;
        return reduction(thing, function (memo, item, index, list) {
            if (matchesBinary(bound(item, index, list), negative)) {
                passed(memo, item, index);
            }
        }, memo());
    };
};