var constructorExtend = require('./lib/utils/function/extend');
module.exports = constructorExtend.wrapper(Extendable, Object);

function Extendable() {
    return this;
}