var arrayConcat = [].concat;
module.exports = function concat(list) {
    return arrayConcat.apply([], list);
};