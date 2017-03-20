var isString = require('./utils/is/string');
var merge = require('./utils/object/merge');
var has = require('./utils/object/has');
var isInstance = require('./utils/is/instance');
var factory = require('./utils/function/factory');
var bind = require('./utils/function/bind');
var PROTOTYPE = 'prototype';
var CONSTRUCTOR = 'constructor';
var FUNCTION_CONSTRUCTOR_CONSTRUCTOR = Function[CONSTRUCTOR];
var EXTEND = 'extend';
var DOUBLE_UNDERSCORE = '__';
var COLON = ':';
var CONSTRUCTOR_KEY = DOUBLE_UNDERSCORE + CONSTRUCTOR + DOUBLE_UNDERSCORE;
constructorExtend.wrapper = constructorWrapper;
module.exports = constructorExtend;

function constructorWrapper(Constructor, parent) {
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
}

function constructorExtend(name, protoProps) {
    var nameString, constructorKeyName, child, passedParent, hasConstructor, constructor, parent = this,
        nameIsStr = isString(name);
    if (!nameIsStr) {
        protoProps = name;
    }
    hasConstructor = has(protoProps, CONSTRUCTOR);
    if (protoProps && hasConstructor) {
        child = protoProps[CONSTRUCTOR];
    }
    if (nameIsStr) {
        passedParent = parent;
        if (child) {
            passedParent = child;
        }
        child = new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('parent', 'return function ' + name + '(){return parent.apply(this,arguments);}')(passedParent);
    } else {
        child = child || new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('parent', 'return ' + parent.toString())(parent);
    }
    child[EXTEND] = constructorExtend;
    var Surrogate = function () {
        this[CONSTRUCTOR] = child;
    };
    Surrogate[PROTOTYPE] = parent[PROTOTYPE];
    child[PROTOTYPE] = new Surrogate;
    // don't call the function if nothing exists
    if (protoProps) {
        merge(child[PROTOTYPE], protoProps);
    }
    constructorKeyName = CONSTRUCTOR + COLON + name;
    if (nameIsStr) {
        if (child[PROTOTYPE][constructorKeyName]) {
            exception(CONSTRUCTOR + 's with names cannot extend constructors with the same name');
        } else {
            child[PROTOTYPE][constructorKeyName] = child;
        }
    }
    constructor = child;
    child = constructorWrapper(constructor, parent);
    constructor[PROTOTYPE][CONSTRUCTOR_KEY] = child;
    return child;
}