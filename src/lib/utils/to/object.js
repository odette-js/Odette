var isObject = require('./utils/is/object');
module.exports = function (argument) {
    return isObject(argument) ? argument : {};
};