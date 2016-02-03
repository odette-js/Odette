application.scope(function (app) {
    var blank, _ = app._,
        toArray = _[TO_ARRAY],
        map = _.map,
        indexOf = _.indexOf,
        gapSplit = _.gapSplit,
        isString = _.isString,
        slice = _.slice,
        split = _.split,
        extend = _[EXTEND],
        wrap = _.wrap,
        has = _.has,
        join = _.join,
        cacheable = function (fn) {
            var cache = {};
            return function (input) {
                if (!has(cache, input)) {
                    cache[input] = fn(input);
                }
                return cache[input];
            };
        },
        categoricallyCacheable = function (fn, baseCategory) {
            var cache = {};
            return function (string, category) {
                var cacher;
                category = category || baseCategory;
                cacher = cache[category] = cache[category] || cacheable(fn(category));
                return cacher(string);
            };
        },
        string = extend(wrap(gapSplit('toLowerCase toUpperCase trim'), function (method) {
            return cacheable(function (item) {
                return item[method]();
            });
        }), wrap(gapSplit('match search'), function (method) {
            return categoricallyCacheable(function (input) {
                return function (item) {
                    return item[method](input);
                };
            });
        })),
        wrapAll = function (fn) {
            return function () {
                var args = toArray(arguments),
                    ctx = this;
                return map(args[0], function (thing) {
                    args[0] = thing;
                    return fn.apply(ctx, args);
                });
            };
        },
        deprefix = function (str, prefix, unUpcase) {
            var nuStr = str.slice(prefix[LENGTH]),
                first = nuStr[0];
            if (unUpcase) {
                first = nuStr[0].toLowerCase();
            }
            nuStr = first + nuStr.slice(1);
            return nuStr;
        },
        deprefixAll = wrapAll(deprefix),
        prefix = function (str, prefix, camelcase, splitter) {
            var myStr = prefix + str;
            if (camelcase !== blank) {
                myStr = prefix + (splitter || '-') + str;
                if (camelcase) {
                    myStr = camelCase(myStr, splitter);
                } else {
                    myStr = unCamelCase(myStr, splitter);
                }
            }
            return myStr;
        },
        prefixAll = wrapAll(prefix),
        parseObject = (function () {
            var cache = {};
            return function (string) {
                var found = cache[string];
                if (!found) {
                    cache[string] = found = new Function.constructor('return ' + string);
                }
                return found();
            };
        }()),
        /**
         * @func
         */
        camelCase = categoricallyCacheable(function (splitter) {
            return function (str) {
                var i, s, val;
                if (isString(str)) {
                    if (str[0] === splitter) {
                        str = slice(str, 1);
                    }
                    s = split(str, splitter);
                    for (i = s[LENGTH] - 1; i >= 1; i--) {
                        if (s[i]) {
                            s[i] = upCase(s[i]);
                        }
                    }
                    val = join(s, '');
                }
                return val;
            };
        }, '-'),
        /**
         * @func
         */
        upCase = cacheable(function (s) {
            return s[0].toUpperCase() + slice(s, 1);
        }),
        /**
         * @func
         */
        unCamelCase = categoricallyCacheable(function (splitter) {
            return function (str) {
                return str.replace(/([a-z])([A-Z])/g, '$1' + splitter + '$2').replace(/[A-Z]/g, function (s) {
                    return s.toLowerCase();
                });
            };
        }, '-'),
        /**
         * @func
         */
        customUnits = categoricallyCacheable(function (unitList_) {
            var lengthHash = {},
                hash = {},
                lengths = [],
                unitList = gapSplit(unitList_),
                sortedUnitList = unitList.sort(function (a, b) {
                    var aLength = a[LENGTH],
                        bLength = b[LENGTH],
                        value = _.max([-1, _.min([1, aLength - bLength])]);
                    hash[a] = hash[b] = BOOLEAN_TRUE;
                    if (!lengthHash[aLength]) {
                        lengthHash[aLength] = BOOLEAN_TRUE;
                        lengths.push(aLength);
                    }
                    if (!lengthHash[bLength]) {
                        lengthHash[bLength] = BOOLEAN_TRUE;
                        lengths.push(bLength);
                    }
                    return -1 * (value === 0 ? (a > b ? -1 : 1) : value);
                });
            lengths.sort(function (a, b) {
                return -1 * _.max([-1, _.min([1, a - b])]);
            });
            return function (str_) {
                var ch, unitStr, unit,
                    i = 0,
                    str = (str_ + '').trim(),
                    length = str[LENGTH];
                while (lengths[i]) {
                    unit = str.substr(length - lengths[i], length);
                    if (hash[unit]) {
                        return unit;
                    }
                    i++;
                }
                return BOOLEAN_FALSE;
            };
        }),
        // customUnits = categoricallyCacheable(function (unitList_) {
        //     var hash = {},
        //         maxLength = 0,
        //         unitList = gapSplit(unitList_).sort(function (a, b) {
        //             var aLength = a[LENGTH],
        //                 bLength = b[LENGTH],
        //                 value = _.max([-1, _.min([1, aLength - bLength])]);
        //             lengthHash[aLength] = lengthHash[bLength] = BOOLEAN_TRUE;
        //             return -1 * (value === 0 ? (a > b ? -1 : 1) : value);
        //         }),
        //         lengths = keys(lengthHash);
        //     return function (str_) {
        //         var ch, unitStr, unit,
        //             i = 0,
        //             str = (str_ + '').trim(),
        //             length = str[LENGTH];
        //         while (maxLength[i]) {
        //             unit = str.substr(i);
        //             // if (hash) {};
        //             // return unitList[i];
        //             i++;
        //         }
        //         // while (str[--i]) {
        //         //     unit.unshift(str[i]);
        //         //     unitStr = unit.join('');
        //         //     if (indexOf(unitList, unitStr) >= 0) {
        //         //         if (unitStr === 'em') {
        //         //             if (str[i - 1] === 'r') {
        //         //                 unitStr = 'rem';
        //         //             }
        //         //         }
        //         //         if (unitStr === 'in') {
        //         //             if (str[i - 2] === 'v' && str[i - 1] === 'm') {
        //         //                 unitStr = 'vmin';
        //         //             }
        //         //         }
        //         //         return unitStr;
        //         //     }
        //         // }
        //         return BOOLEAN_FALSE;
        //     };
        // }),
        baseUnitList = gapSplit('px em ex in cm % vh vw pc pt mm vmax vmin'),
        units = function (str) {
            return customUnits(str, baseUnitList);
        },
        isHttp = cacheable(function (str) {
            var ret = !1;
            if ((str.indexOf(HTTP) === 0 && str.split('//').length >= 2) || str.indexOf('//') === 0) {
                ret = !0;
            }
            return ret;
        }),
        parseHash = cacheable(function (url) {
            var hash = '',
                hashIdx = indexOf(url, '#') + 1;
            if (hashIdx) {
                hash = url.slice(hashIdx - 1);
            }
            return hash;
        }),
        parseURL = function (url) {
            var firstSlash, hostSplit, originNoProtocol, search = '',
                hash = '',
                host = '',
                pathname = '',
                protocol = '',
                port = '',
                hostname = '',
                origin = url,
                searchIdx = indexOf(url, '?') + 1,
                searchObject = {},
                protocols = [HTTP, HTTP + 's', 'file', 'about'],
                protocolLength = protocols.length,
                doubleSlash = '//';
            if (searchIdx) {
                search = url.slice(searchIdx - 1);
                origin = origin.split(search).join('');
                hash = parseHash(search);
                search = search.split(hash).join('');
                searchObject = app.parseSearch(search);
            } else {
                hash = parseHash(url);
                origin = origin.split(hash).join('');
            }
            if (url[0] === '/' && url[1] === '/') {
                protocol = window.location.protocol;
                url = protocol + url;
                origin = protocol + origin;
            } else {
                while (protocolLength-- && !protocol) {
                    if (url.slice(0, protocols[protocolLength].length) === protocols[protocolLength]) {
                        protocol = protocols[protocolLength];
                    }
                }
                if (!protocol) {
                    protocol = HTTP;
                }
                protocol += ':';
                if (origin.slice(0, protocol.length) + doubleSlash !== protocol + doubleSlash) {
                    url = protocol + doubleSlash + url;
                    origin = protocol + doubleSlash + origin;
                }
            }
            originNoProtocol = origin.split(protocol + doubleSlash).join('');
            firstSlash = indexOf(originNoProtocol, '/') + 1;
            pathname = originNoProtocol.slice(firstSlash - 1);
            host = originNoProtocol.slice(0, firstSlash - 1);
            origin = origin.split(pathname).join('');
            hostSplit = host.split(':');
            hostname = hostSplit.shift();
            port = hostSplit.join(':');
            return {
                port: port,
                hostname: hostname,
                pathname: pathname,
                search: search,
                host: host,
                hash: hash,
                href: url,
                protocol: protocol,
                origin: origin,
                searchObject: searchObject
            };
        };
    _.exports({
        // constants
        customUnits: customUnits,
        // cache makers
        cacheable: cacheable,
        categoricallyCacheable: categoricallyCacheable,
        // cacheable
        deprefix: deprefix,
        deprefixAll: deprefixAll,
        prefix: prefix,
        prefixAll: prefixAll,
        upCase: upCase,
        unCamelCase: unCamelCase,
        camelCase: camelCase,
        string: string,
        units: units,
        baseUnitList: baseUnitList,
        isHttp: isHttp,
        parseHash: parseHash,
        parseURL: parseURL,
        parseObject: parseObject
    });
});