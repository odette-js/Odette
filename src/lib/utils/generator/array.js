var greaterThanZero = require('./utils/number/greater-than/0');
var returnsSecondArgument = require('./utils/returns/second');
var returnsFirstArgument = require('./utils/returns/first');
module.exports = function (array, dir_, cap_, incrementor_, transformer_) {
    var previous, dir = dir_ || 1,
        length = array.length,
        counter = dir > 0 ? -1 : length,
        transformer = transformer_ || returnsFirstArgument,
        cap = cap_ || (counter < 0 ? function (counter) {
            return counter >= length;
        } : greaterThanZero),
        incrementor = incrementor_ || returnsSecondArgument;
    return function (fn) {
        counter += dir;
        if (cap(counter)) {
            return;
        }
        return transformer(previous = incrementor(previous, counter, array));
    };
};