var Symbol = global.Symbol;
var symbolProto = Symbol ? Symbol.prototype : undefined;
module.exports = symbolProto ? symbolProto.toString : undefined;