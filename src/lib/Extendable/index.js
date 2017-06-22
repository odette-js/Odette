var _ = require('debit');
var extendConstructor = _.extendConstructor;
module.exports = extendConstructor.wrapper(Extendable, Object);

function Extendable() {
    return this;
}