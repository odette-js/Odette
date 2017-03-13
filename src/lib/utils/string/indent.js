module.exports = function (string, indentation) {
    return string.split('\n').join('\n' + (indentation || '    '));
};