#!/usr/bin/env node

module.exports = function (settings) {
    // dependencies
    var express = require('express');
    var path = require('path');
    var fs = require('fs');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var bodyParser = require('body-parser');
    var expressive = require('../expressive');
    var app = express();
    var expressWs = require('express-ws')(app);
    var publicroot = path.join(__dirname, '../dist');
    var engine6 = require('engine6');
    var tension = require('express-tension');
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.engine('html', engine6.renders());
    app.set('views', 'views');
    app.set('view engine', 'html');
    app.use(bodyParser.json());
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use(tension(publicroot));
    app.use(engine6.static(publicroot));
    // app.use(function (req, res, next) {
    //     console.log(req.url);
    //     next();
    // });
    app.post('/postecho', function (req, res, next) {
        if (req.body && req.body.success) {
            res.send({
                successful: true
            });
        } else {
            res.send({
                successful: false
            });
        }
    });
    app.ws('/echo', function (ws, req) {
        console.log('connected to someone');
        ws.on('message', function (msg_) {
            var msg = JSON.parse(msg_);
            console.log('message received: ', msg);
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
            // just makes sure it's async
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
    return new Promise(function (success, failure) {
        app.listen(settings.http.port, function () {
            success();
            console.log('Listening on :' + (settings.http.port));
        });
        process.on('exit', function () {
            app.close();
        });
    });
    // Was going to have node automatically open default browser to proper location,
    // but it requires an external package, so not worth it.
};