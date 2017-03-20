var toString = require('./utils/object/to-string');
module.exports = function callToString(item) {
    return toString.call(item);
};