var matches = require('./utils/object/matches');
var property = require('./utils/object/property');
var isObject = require('./utils/is/object');
var isFunction = require('./utils/is/function');
var isArray = require('./utils/is/array');
var matchesProperty = require('./utils/object/matches/property');
module.exports = function (iteratee) {
    return isFunction(iteratee) ? iteratee : (isArray(iteratee) ? matchesProperty(iteratee) : (isObject(iteratee) ? matches(iteratee) : property(iteratee)));
};