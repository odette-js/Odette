var constructorWrapper = require('./utils/function/constructor-wrapper');
factories.Extendable = constructorWrapper(Extendable, Object);

function Extendable() {
    return this;
}