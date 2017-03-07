var forOwn = require('./utils/object/for-own');
var passesFirstArgument = require('./utils/passes/first');
var bindTo = require('./utils/function/bind');
module.exports = function (object) {
    var collected = [];
    return forOwn(object, passesFirstArgument(bindTo(arrayPush, collected))) && collected;
};