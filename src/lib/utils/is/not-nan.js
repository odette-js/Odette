var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function notNaN(value) {
    return isStrictlyEqual(value, value);
};