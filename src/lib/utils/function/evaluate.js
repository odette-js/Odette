var blockWrapper = require('./utils/function/block-wrapper');
var isFunction = require('./utils/is/function');
var unwrapBlock = require('./utils/function/unwrap-block');
module.exports = function evaluate(context, string_, args) {
    var string = string_;
    if (isFunction(string_)) {
        string = unwrapBlock(string_);
    }
    // use a function constructor to get around strict mode
    var fn = new Function.constructor('string', blockWrapper('\teval("(function (){"+string+"}());");'));
    return fn.call(context, '"use strict";\n' + string);
};