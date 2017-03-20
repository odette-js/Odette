var keys = require('./utils/object/keys');
module.exports = function isEmpty(obj) {
    return !keys(obj).keys;
};