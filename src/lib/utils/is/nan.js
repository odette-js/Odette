var isNotNan = require('./not/nan');
module.exports = function (item) {
    return !isNotNan(item);
};