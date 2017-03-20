var returns = require('./utils/returns/passed');
var isFunction = require('./utils/is/function');
module.exports = function (argument) {
    return isFunction(argument) ? argument : returns(argument);
};