module.exports = function (argument) {
    return argument ? argument.toString() : ('' + argument);
};
// why did this exits
// function toString(obj) {
//     return obj == NULL ? EMPTY_STRING : obj + EMPTY_STRING;
// }