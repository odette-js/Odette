var eq = require('./utils/array/eq');
module.exports = function isEqual(a, b) {
    return eq(a, b, [], []);
};