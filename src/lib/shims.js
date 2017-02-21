// var win = this,
//     LENGTH = 'length',
//     PERFORMANCE = 'performance',
//     Obj_const = Object;
// win[PERFORMANCE] = win[PERFORMANCE] || {};
// win[PERFORMANCE].now = (function () {
//     var performance = win[PERFORMANCE];
//     return performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
//         return new Date().getTime();
//     };
// })();
// (function () {
//     if (typeof Obj_const.create !== 'function') {
//         Obj_const.create = (function (undefined) {
//             var TMP = function () {};
//             return function (prototype, propertiesObject) {
//                 if (prototype !== Object(prototype) && prototype !== NULL) {
//                     throw TypeError('Argument must be an object, or ' + NULL);
//                 }
//                 TMP[PROTOTYPE] = prototype || {};
//                 var result = new TMP();
//                 TMP[PROTOTYPE] = NULL;
//                 if (propertiesObject !== UNDEFINED) {
//                     Obj_const.defineProperties(result, propertiesObject);
//                 }
//                 // to imitate the case of Obj_const.create(NULL)
//                 if (prototype === NULL) {
//                     result.__proto__ = NULL;
//                 }
//                 return result;
//             };
//         })();
//     }
// }());
// (function () {
//     function f(n) {
//         return n < 10 ? "0" + n : n;
//     }
//     function quote(string) {
//         escapable.lastIndex = 0;
//         return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
//             var c = meta[a];
//             return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
//         }) + '"' : '"' + string + '"';
//     }
//     function str(key, holder) {
//         var i, k, v, length, mind = gap,
//             partial, value = holder[key];
//         if (value && typeof value === "object" && typeof value.toJSON === "function") {
//             value = value.toJSON(key);
//         }
//         if (typeof rep === "function") {
//             value = rep.call(holder, key, value);
//         }
//         switch (typeof value) {
//         case "string":
//             return quote(value);
//         case "number":
//             return isFinite(value) ? String(value) : "null";
//         case "boolean":
//         case "null":
//             return String(value);
//         case "object":
//             if (!value) {
//                 return "null";
//             }
//             gap += indent;
//             partial = [];
//             if (Object[PROTOTYPE].toString.apply(value) === "[object Array]") {
//                 length = value[LENGTH];
//                 for (i = 0; i < length; i += 1) {
//                     partial[i] = str(i, value) || "null";
//                 }
//                 v = partial[LENGTH] === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
//                 gap = mind;
//                 return v;
//             }
//             if (rep && typeof rep === "object") {
//                 length = rep[LENGTH];
//                 for (i = 0; i < length; i += 1) {
//                     if (typeof rep[i] === "string") {
//                         k = rep[i];
//                         v = str(k, value);
//                         if (v) {
//                             partial.push(quote(k) + (gap ? ": " : ":") + v);
//                         }
//                     }
//                 }
//             } else {
//                 for (k in value) {
//                     if (Object[PROTOTYPE].hasOwnProperty.call(value, k)) {
//                         v = str(k, value);
//                         if (v) {
//                             partial.push(quote(k) + (gap ? ": " : ":") + v);
//                         }
//                     }
//                 }
//             }
//             v = partial[LENGTH] === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
//             gap = mind;
//             return v;
//         }
//     }
//     if (!JSON) {
//         if (typeof Date[PROTOTYPE].toJSON !== "function") {
//             Date[PROTOTYPE].toJSON = function (key) {
//                 return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
//             };
//             String[PROTOTYPE].toJSON = Number[PROTOTYPE].toJSON = Boolean[PROTOTYPE].toJSON = function (key) {
//                 return this.valueOf();
//             };
//         }
//         var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
//             escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
//             gap, indent, meta = {
//                 "\b": "\\b",
//                 "\t": "\\t",
//                 "\n": "\\n",
//                 "\f": "\\f",
//                 "\r": "\\r",
//                 '"': '\\"',
//                 "\\": "\\\\"
//             },
//             rep;
//         if (typeof JSON.stringify !== "function") {
//             JSON.stringify = function (value, replacer, space) {
//                 var i;
//                 gap = "";
//                 indent = "";
//                 if (typeof space === "number") {
//                     for (i = 0; i < space; i += 1) {
//                         indent += " ";
//                     }
//                 } else {
//                     if (typeof space === "string") {
//                         indent = space;
//                     }
//                 }
//                 rep = replacer;
//                 if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer[LENGTH] !== "number")) {
//                     throw new Error("JSON.stringify");
//                 }
//                 return str("", {
//                     "": value
//                 });
//             };
//         }
//         if (typeof JSON.parse !== "function") {
//             JSON.parse = function (text, reviver) {
//                 var j;
//                 function walk(holder, key) {
//                     var k, v, value = holder[key];
//                     if (value && typeof value === "object") {
//                         for (k in value) {
//                             if (Object[PROTOTYPE].hasOwnProperty.call(value, k)) {
//                                 v = walk(value, k);
//                                 if (v !== undefined) {
//                                     value[k] = v;
//                                 } else {
//                                     delete value[k];
//                                 }
//                             }
//                         }
//                     }
//                     return reviver.call(holder, key, value);
//                 }
//                 text = String(text);
//                 cx.lastIndex = 0;
//                 if (cx.test(text)) {
//                     text = text.replace(cx, function (a) {
//                         return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
//                     });
//                 }
//                 if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
//                     j = Function[PROTOTYPE].constructor("(" + text + ")");
//                     return typeof reviver === "function" ? walk({
//                         "": j
//                     }, "") : j;
//                 }
//                 throw new SyntaxError("JSON.parse");
//             };
//         }
//     }
// }());
// (function () {
//     if (!Function[PROTOTYPE].bind) {
//         Function[PROTOTYPE].bind = function (oThis) {
//             if (typeof this !== 'function') {
//                 // closest thing possible to the ECMAScript 5
//                 // internal IsCallable function
//                 throw new TypeError('Function[PROTOTYPE].bind - what is trying to be bound is not callable');
//             }
//             var aArgs = Array[PROTOTYPE].slice.call(arguments, 1),
//                 fToBind = this,
//                 FNOP = function () {},
//                 fBound = function () {
//                     return fToBind.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array[PROTOTYPE].slice.call(arguments)));
//                 };
//             if (this[PROTOTYPE]) {
//                 // native functions don't have a prototype
//                 FNOP[PROTOTYPE] = this[PROTOTYPE];
//             }
//             fBound[PROTOTYPE] = new FNOP();
//             return fBound;
//         };
//     }
// }());
// (function () {
//     if (!win.matchMedia) {
//         win.matchMedia = function () {
//             // "use strict";
//             // For browsers that support matchMedium api such as IE 9 and webkit
//             var styleMedia = (win.styleMedia || win.media);
//             // For those that don't support matchMedium
//             if (!styleMedia) {
//                 var style = document.createElement('style'),
//                     script = document.getElementsByTagName('script')[0],
//                     info = null;
//                 style.type = 'text/css';
//                 style.id = 'matchmediajs-test';
//                 script.parentNode.insertBefore(style, script);
//                 // 'style.currentStyle' is used by IE <= 8 and 'win.getComputedStyle' for all other browsers
//                 info = ('getComputedStyle' in win) && win.getComputedStyle(style, null) || style.currentStyle;
//                 styleMedia = {
//                     matchMedium: function (media) {
//                         var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';
//                         // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
//                         if (style.styleSheet) {
//                             style.styleSheet.cssText = text;
//                         } else {
//                             style.textContent = text;
//                         }
//                         // Test if media query is true or false
//                         return info.width === '1px';
//                     }
//                 };
//             }
//             return function (media) {
//                 media = media || 'all';
//                 return {
//                     matches: styleMedia.matchMedium(media),
//                     media: media
//                 };
//             };
//         }();
//     }
// }());
// (function () {
//     if (typeof Obj_const.assign != 'function') {
//         var has = Obj_const[PROTOTYPE].hasOwnProperty;
//         Obj_const.assign = function (target, varArgs) { // .length of function is 2
//             'use strict';
//             if (target == null) { // TypeError if undefined or null
//                 throw new TypeError('Cannot convert undefined or null to object');
//             }
//             var to = Object(target);
//             for (var index = 1; index < arguments.length; index++) {
//                 var nextSource = arguments[index];
//                 if (nextSource != null) { // Skip over if undefined or null
//                     bound = has.bind(nextSource);
//                     for (var nextKey in nextSource) {
//                         // Avoid bugs when hasOwnProperty is shadowed
//                         if (bound(nextKey)) {
//                             to[nextKey] = nextSource[nextKey];
//                         }
//                     }
//                 }
//             }
//             return to;
//         };
//     }
// }());
// // Closure
// (function () {
//     /**
//      * Decimal adjustment of a number.
//      *
//      * @param {String}  type  The type of adjustment.
//      * @param {Number}  value The number.
//      * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
//      * @returns {Number} The adjusted value.
//      */
//     function decimalAdjust(type, value, exp) {
//         // If the exp is undefined or zero...
//         if (typeof exp === 'undefined' || +exp === 0) {
//             return Math[type](value);
//         }
//         value = +value;
//         exp = +exp;
//         // If the value is not a number or the exp is not an integer...
//         if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
//             return NaN;
//         }
//         // Shift
//         value = value.toString().split('e');
//         value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
//         // Shift back
//         value = value.toString().split('e');
//         return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
//     }
//     // Decimal round
//     if (!Math.round10) {
//         Math.round10 = function (value, exp) {
//             return decimalAdjust('round', value, exp);
//         };
//     }
//     // Decimal floor
//     if (!Math.floor10) {
//         Math.floor10 = function (value, exp) {
//             return decimalAdjust('floor', value, exp);
//         };
//     }
//     // Decimal ceil
//     if (!Math.ceil10) {
//         Math.ceil10 = function (value, exp) {
//             return decimalAdjust('ceil', value, exp);
//         };
//     }
// })();