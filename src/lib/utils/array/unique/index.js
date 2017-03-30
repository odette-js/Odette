var isEqual = require('./utils/is/equal'),
    uniqueWith = require('./utils/array/unique/with');
module.exports = unique;

function unique(list) {
    return uniqueWith(list, isEqual);
}