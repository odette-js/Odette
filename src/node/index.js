var fs = require('fs');
var path = require('path');
var Odette = require(path.join(__dirname, '../../src/lib/node_modules/odette.js'));
var app = Odette(global, 'application', '0.0.0');
var application = app.global;
global.Odette = Odette;
require(path.join(__dirname, '../../dist/js/library.js'));
application.definition(app.VERSION, global);
module.exports = app;