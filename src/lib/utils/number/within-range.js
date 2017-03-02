var clamp = require('./clamp');
module.exports = function (number, min, max) {
    return number === clamp(number, min, max);
};