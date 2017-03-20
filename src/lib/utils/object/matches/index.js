var isMatch = require('./utils/is/match');
module.exports = function (obj1) {
    return function (obj2) {
        return isMatch(obj2, obj1);
    };
};