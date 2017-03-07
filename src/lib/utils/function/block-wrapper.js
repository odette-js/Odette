module.exports = function blockWrapper(block, context) {
    return 'with(' + (context || 'this') + '){\n' + block + '\n}';
};