// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var settings = require('./settings');
var expressive = require('./expressive');
var app = express();
var publicroot = path.join(__dirname, 'public');
// view engine setup
// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger(settings.env.logger));
app.use(expressive(publicroot));
// app.set('views', path.join(__dirname, './src/views/pages'));
// app.set('view engine', 'jade');
app.use(express.static(publicroot));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (settings.env.isDev) {
        res.send({
            message: err.message
        });
    } else {
        res.send('');
    }
});
app.listen(settings.http.port);
module.exports = app;