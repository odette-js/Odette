var createCompounder = require('./utils/string/create-compounder');
var capitalize = require('./utils/string/capitalize');
module.exports = createCompounder(function (result, word, index) {
    word = word.toLowerCase();
    return result + (index ? capitalize(word) : word);
});