var createCompounder = require('./utils/string/create-compounder');
module.exports = createCompounder(function (result, word, index) {
    return result + (index ? '-' : '') + word.toLowerCase();
});