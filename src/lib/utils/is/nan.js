var isNotNan = require('./utils/is/not/nan');
module.exports = function (item) {
    return !isNotNan(item);
};