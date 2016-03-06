#!/usr/bin/env node

// console.log('once');
module.exports = function (settings) {
    // dependencies
    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var bodyParser = require("body-parser");
    var expressive = require('../expressive');
    var app = express();
    var expressWs = require('express-ws')(app);
    var publicroot = path.join(__dirname, '../public');
    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    // view engine setup
    // uncomment after placing your favicon in /public
    app.use(logger(settings.env.logger));
    app.ws('/echo', function (ws, req) {
        ws.on('message', function (msg_) {
            var msg = JSON.parse(msg_);
            if (msg.type === 'message') {
                ws.send(JSON.stringify({
                    type: 'success',
                    packet: msg.id
                }));
            } else {
                console.log('confirmed receieved: ' + msg);
            }
        });
    });
    app.get('/gibberish/:status', function (req, res, next) {
        res.status(req.params.status).send('');
    });
    app.use(expressive(publicroot));
    app.use(express.static(publicroot));
    app.use(function (req, res, next) {
        console.log(req.url);
        next();
    });
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.ws('/echo', function (ws, req) {
        ws.on('message', function () {
            setTimeout(function () {
                ws.emit('reply');
            });
        });
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
    console.log("\nListening on :".concat(settings.http.port)); // Was going to have node automatically open default browser to proper location, but it requires an external package, so not worth it.
};