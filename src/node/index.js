var fs = require('fs');
var path = require('path');
var Odette = require(path.join(__dirname, '../../dist/build/odette.js'));
var app = Odette(global, 'application', '0.0.0');
var application = app.global;
global.Odette = Odette;
require(path.join(__dirname, '../../dist/build/library.js'));
application.definition(app.VERSION, global);
module.exports = app;