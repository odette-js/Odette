var nth = require('./utils/array/nth');
module.exports = function first(array) {
    return nth(array, 0);
};