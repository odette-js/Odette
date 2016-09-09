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
    var https = require("https");
    // var httpsPort = 8443;
    // Setup HTTPS
    // var options = {
    //     key: fs.readFileSync(path.join(__dirname, "../private.key")),
    //     cert: fs.readFileSync(path.join(__dirname, "../certificate.pem"))
    //     // ,
    //     // requestCert: false
    // };
    // app.set("port_https", settings.http.port); // make sure to use the same port as above, or better yet, use the same variable
    // Secure traffic only
    // app.all("*", function (req, res, next) {
    //     if (req.secure) {
    //         return next();
    //     }
    //     res.redirect("https://" + req.hostname + ":" + app.get("port_https") + req.url);
    // });
    // var secureServer = https.createServer(options, app).listen(settings.http.port);
    //Here we are configuring express to use body-parser as middle-ware.
    // view engine setup
    // uncomment after placing your favicon in /public
    // app.use(logger(settings.env.logger));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
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
    app.listen(settings.http.port);
    console.log('Listening on :'.concat(settings.http.port));
    // Was going to have node automatically open default browser to proper location,
    // but it requires an external package, so not worth it.
};