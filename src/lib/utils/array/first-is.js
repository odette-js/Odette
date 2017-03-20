var nthIs = require('./nth-is');
module.exports = function firstIs(array, final) {
    return nthIs(array, final, 0);
};