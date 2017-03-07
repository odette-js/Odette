var intendedObject = require('./utils/object/intended');
var bindTo = require('./utils/function/bind-to');
module.exports = function intendedApi(fn) {
    return function (one, two) {
        intendedObject(one, two, bindTo(fn, this));
        return this;
    };
};