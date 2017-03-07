module.exports = function (obj1, obj2, deep) {
    var customizer = isBoolean[deep] ? (deep ? deepMergeWithCustomizer : shallowMergeWithCustomizer) : deep ? deep : shallowMergeWithCustomizer;
    return mergeWith(obj1, obj2, customizer);
};