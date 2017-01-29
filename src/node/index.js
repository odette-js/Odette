var fs = require('fs');
var path = require('path');
var Odette = require(path.join(__dirname, '../../dist/build/odette.min.js'));
var app = Odette(global, 'application', '0.0.0');
var application = app.global;
var lib = fs.readFileSync(path.join(__dirname, '../../dist/build/library.min.js')) + '';
var fn = new Function.constructor('Odette', 'module', 'exports', 'return ' + lib);
var xprts = {};
var mod = {
    exports: xprts
};
fn(Odette, mod, xprts);
application.definition(app.VERSION, global);
module.exports = app;