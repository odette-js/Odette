var fs = require('fs');
module.exports = function (root) {
    'use strict';
    return function (req, res, next) {
        var query, queryIndex = req.url.indexOf('?');
        if (queryIndex !== -1) {
            query = req.url.slice(queryIndex);
            req.url = req.url.slice(0, queryIndex);
        }
        if (req.url[req.url.length - 1] === '/') {
            req.url += 'index';
        }
        if (req.url.indexOf('.') === -1) {
            fs.exists(root + req.url + '.html', function (exists) {
                if (exists) {
                    req.url += '.html';
                }
                if (query) {
                    req.url += query;
                }
                next();
            });
        } else {
            if (query) {
                req.url += query;
            }
            next();
        }
    };
};