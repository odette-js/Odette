var indexOf = require('./utils/array/index/of');
module.exports = function lastIndexOf(a, b, c, d) {
    return indexOf(a, b, c, d, true);
};