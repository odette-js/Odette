var toString = require('./object/to-string');
module.exports = function (item) {
    return toString.call(item);
};