var isUndefined = require('./utils/is/undefined');
module.exports = function (item, def) {
    return isUndefined(item) ? def : item;
};