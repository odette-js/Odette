var isString = require('./utils/is/string');
var merge = require('./utils/object/merge');
var PROTOTYPE = 'prototype';
var CONSTRUCTOR = 'constructor';
var DOUBLE_UNDERSCORE = '__';
var CONSTRUCTOR_KEY = DOUBLE_UNDERSCORE + CONSTRUCTOR + DOUBLE_UNDERSCORE;
module.exports = function (name, protoProps) {
    var nameString, constructorKeyName, child, passedParent, hasConstructor, constructor, parent = this,
        nameIsStr = isString(name);
    if (name === false) {
        merge(parent[PROTOTYPE], protoProps);
        return parent;
    }
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