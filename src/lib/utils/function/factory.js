module.exports = function factory(name, func_) {
    var func = func_ ? func_ : name;
    var extensor = {
        constructor: function () {
            return func.apply(this.super.apply(this, arguments), arguments);
        }
    };
    return this.extend.apply(this, func === func_ ? [name, extensor] : [extensor]);
};