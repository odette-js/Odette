application.scope(function (app) {
    var blank, _ = app._,
        toArray = _.toArray,
        map = _.map,
        indexOf = _.indexOf,
        gapSplit = _.gapSplit,
        isString = _.isString,
        slice = _.slice,
        split = _.split,
        getLength = _.len,
        lengthString = 'length',
        falseBool = false,
        has = _.has,
        join = _.join,
        cacheable = function (fn) {
            var cache = {};
            return function (input) {
                if (!has(cache, input)) {
                    cache[input] = fn.apply(this, arguments);
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
        string = _.extend(_.wrap(gapSplit('toLowerCase toUpperCase trim'), function (method) {
            return cacheable(function (item) {
                return item[method]();
            });
        }), _.wrap(gapSplit('indexOf match search'), function (method) {
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
            var nuStr = str.slice(getLength(prefix)),
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
                    for (i = getLength(s) - 1; i >= 1; i--) {
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
            var unitList = gapSplit(unitList_);
            return function (str) {
                var i, ch, unitStr, unit = [];
                // make sure it's a string
                str += '';
                // make sure there is no trailing whitespace
                str = str.trim();
                i = str[lengthString];
                // work from the back
                while (str[--i]) {
                    // for (i = str[lengthString] - 1; i >= 0; i--) {
                    unit.unshift(str[i]);
                    unitStr = unit.join('');
                    if (indexOf(unitList, unitStr) >= 0) {
                        if (unitStr === 'em') {
                            if (str[i - 1] === 'r') {
                                unitStr = 'rem';
                            }
                        }
                        if (unitStr === 'in') {
                            if (str[i - 2] === 'v' && str[i - 1] === 'm') {
                                unitStr = 'vmin';
                            }
                        }
                        return unitStr;
                    }
                }
                return falseBool;
            };
        }),
        baseUnitList = gapSplit('px em ex in cm % vh vw pc pt mm vmax vmin'),
        units = function (str) {
            return customUnits(str, baseUnitList);
        },
        isHttp = function (str) {
            var ret = !1;
            if ((str.indexOf('http') === 0 && str.split('//').length >= 2) || str.indexOf('//') === 0) {
                ret = !0;
            }
            return ret;
        },
        parseHash = function (url) {
            var hash = '',
                hashIdx = indexOf(url, '#') + 1;
            if (hashIdx) {
                hash = url.slice(hashIdx - 1);
            }
            return hash;
        },
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
                protocols = ['http', 'https', 'file', 'about'],
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
                    protocol = 'http';
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
        deprefix: deprefix,
        deprefixAll: deprefixAll,
        prefix: prefix,
        prefixAll: prefixAll,
        upCase: upCase,
        unCamelCase: unCamelCase,
        camelCase: camelCase,
        cacheable: cacheable,
        categoricallyCacheable: categoricallyCacheable,
        units: units,
        string: string,
        baseUnitList: baseUnitList,
        customUnits: customUnits,
        isHttp: isHttp,
        parseHash: parseHash,
        parseURL: parseURL,
        parseObject: parseObject
    });
});