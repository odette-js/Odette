var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
module.exports = function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
};