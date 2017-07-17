var server = require('./index.js');
var settings = require('./settings');
var port = settings.http.port;
server(port);
server(port - 80);