var indexOfNaN = require('./nan.js');
module.exports = function (a, b, c) {
    return indexOfNaN(a, b, c, true);
};