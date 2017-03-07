var keys = require('./utils/keys');
module.exports = function (obj) {
    return !keys(obj).keys;
};