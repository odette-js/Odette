module.exports = function (category, item, method) {
    return function () {
        return this.directive('Registry').get(category, item, method);
    };
};