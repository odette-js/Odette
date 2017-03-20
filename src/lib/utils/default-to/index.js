var isUndefined = require('./utils/is/undefined');
module.exports = function valueOrDefault(item, def) {
    return isUndefined(item) ? def : item;
};