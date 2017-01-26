Odette.definition(this, function (app, windo, options) {
            'use strict';
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
                }(windo, 'Odette', function (window, ODETTE) {