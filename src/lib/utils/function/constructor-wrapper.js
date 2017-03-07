var EXTEND = 'extend';
var PROTOTYPE = 'prototype';
var isInstance = require('./utils/is/instance');
module.exports = function constructorWrapper(Constructor, parent) {
    var __ = function (one, two, three, four, five, six) {
        return isValue(one) && isOf(one, Constructor) ? one : new Constructor(one, two, three, four, five, six);
    };
    __.isInstance = Constructor.isInstance = function (instance) {
        return isInstance(instance, Constructor);
    };
    __.factory = Constructor.factory = factory;
    __.fn = Constructor.fn = Constructor[PROTOTYPE].fn = Constructor[PROTOTYPE];
    __.constructor = Constructor;
    __[EXTEND] = Constructor[EXTEND] = bind(constructorExtend, Constructor);
    if (parent) {
        __.super = Constructor.super = Constructor[PROTOTYPE].super = parent;
    }
    return __;
};