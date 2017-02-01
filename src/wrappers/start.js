(function (root, KEY, factory) {
        if (typeof define === 'function' && define.amd) {
            define([], function () {
                return factory(root, KEY);
            });
        } else if (typeof exports === 'object') {
            module.exports = factory(root, KEY);
        } else {
            factory(root, KEY);
        }
    }(this, 'Odette', function (window, ODETTE) {
            'use strict';
            Odette.definition(this, function (app, windo, options) {