module.exports = function (instance, constructor) {
    return constructor ? instance instanceof constructor : false;
};