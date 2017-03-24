var isInfinite = require('./utils/is/infinite');
module.exports = notInfinite;

function notInfinite(item) {
    return !isInfinite(item);
}