var isOf = require('./utils/is/of');
module.exports = function (promise) {
    return isOf(promise, global.Promise);
};