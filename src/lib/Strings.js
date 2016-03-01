// application.scope(function (app) {
var cacheable = function (fn) {
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
    string = _.extend(wrap(gapSplit('toLowerCase toUpperCase trim'), function (method) {
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
        if (camelcase !== UNDEFINED) {
            myStr = prefix + (splitter || HYPHEN) + str;
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
    uniqueId = (function () {
        var cache = {};
        return function (prefix, isInt) {
            var val;
            if (!prefix) {
                prefix = EMPTY_STRING;
            }
            prefix += EMPTY_STRING;
            val = cache[prefix];
            if (!val) {
                val = cache[prefix] = 0;
            }
            cache[prefix]++;
            if (!isInt) {
                val = prefix + val;
            }
            return val;
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
                val = join(s, EMPTY_STRING);
            }
            return val;
        };
    }, HYPHEN),
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
    }, HYPHEN),
    snakeCase = function (string) {
        return unCamelCase(string, '_');
    },
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
                str = (str_ + EMPTY_STRING).trim(),
                length = str[LENGTH];
            while (lengths[i]) {
                if (lengths[i] < length) {
                    unit = str.substr(length - lengths[i], length);
                    if (hash[unit]) {
                        return unit;
                    }
                }
                i++;
            }
            return BOOLEAN_FALSE;
        };
    }),
    baseUnitList = gapSplit('px em rem ex in cm % vh vw pc pt mm vmax vmin'),
    units = function (str) {
        return customUnits(str, baseUnitList);
    },
    isHttp = cacheable(function (str) {
        var ret = !1;
        if ((str.indexOf(HTTP) === 0 && str.split('//')[LENGTH] >= 2) || str.indexOf('//') === 0) {
            ret = !0;
        }
        return ret;
    }),
    parseHash = cacheable(function (url) {
        var hash = EMPTY_STRING,
            hashIdx = smartIndexOf(url, '#') + 1;
        if (hashIdx) {
            hash = url.slice(hashIdx - 1);
        }
        return hash;
    }),
    itemIs = function (list, item, index) {
        return list[index || 0] === item;
    },
    startsWith = itemIs,
    parseURL = function (url) {
        var firstSlash, hostSplit, originNoProtocol, search = EMPTY_STRING,
            hash = EMPTY_STRING,
            host = EMPTY_STRING,
            pathname = EMPTY_STRING,
            protocol = EMPTY_STRING,
            port = EMPTY_STRING,
            hostname = EMPTY_STRING,
            origin = url,
            searchIdx = indexOf(url, '?') + 1,
            searchObject = {},
            protocols = [HTTP, HTTPS, 'file', 'about'],
            protocolLength = protocols[LENGTH],
            doubleSlash = SLASH + SLASH;
        if (searchIdx) {
            search = url.slice(searchIdx - 1);
            origin = origin.split(search).join(EMPTY_STRING);
            hash = parseHash(search);
            search = search.split(hash).join(EMPTY_STRING);
            searchObject = app.parseSearch(search);
        } else {
            hash = parseHash(url);
            origin = origin.split(hash).join(EMPTY_STRING);
        }
        if (url[0] === SLASH && url[1] === SLASH) {
            protocol = win.location.protocol;
            url = protocol + url;
            origin = protocol + origin;
        } else {
            while (protocolLength-- && !protocol) {
                if (url.slice(0, protocols[protocolLength][LENGTH]) === protocols[protocolLength]) {
                    protocol = protocols[protocolLength];
                }
            }
            if (!protocol) {
                protocol = HTTP;
            }
            protocol += COLON;
            if (origin.slice(0, protocol[LENGTH]) + doubleSlash !== protocol + doubleSlash) {
                url = protocol + doubleSlash + url;
                origin = protocol + doubleSlash + origin;
            }
        }
        originNoProtocol = origin.split(protocol + doubleSlash).join(EMPTY_STRING);
        firstSlash = indexOf(originNoProtocol, SLASH) + 1;
        pathname = originNoProtocol.slice(firstSlash - 1);
        host = originNoProtocol.slice(0, firstSlash - 1);
        origin = origin.split(pathname).join(EMPTY_STRING);
        hostSplit = host.split(COLON);
        hostname = hostSplit.shift();
        port = hostSplit.join(COLON);
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
    },
    SIXTY = 60,
    SEVEN = 7,
    THIRTY = 30,
    TWENTY_FOUR = 24,
    ONE_THOUSAND = 1000,
    THREE_HUNDRED_SIXTY_FIVE = 365,
    ONE_THOUSAND_SIXTY = ONE_THOUSAND * SIXTY,
    THREE_HUNDRED_SIXTY_THOUSAND = ONE_THOUSAND_SIXTY * SIXTY,
    EIGHTY_SIX_MILLION_FOUR_HUNDRED_THOUSAND = THREE_HUNDRED_SIXTY_THOUSAND * TWENTY_FOUR,
    SIX_HUNDRED_FOUR_MILLION_EIGHT_HUNDRED_THOUSAND = THREE_HUNDRED_SIXTY_THOUSAND * SEVEN,
    TWO_BILLION_FIVE_HUNDRED_NINETY_TWO_MILLION = THREE_HUNDRED_SIXTY_THOUSAND * THIRTY,
    THIRTY_ONE_BILLION_FIVE_HUNDRED_THIRTY_SIX_MILLION = THREE_HUNDRED_SIXTY_THOUSAND * THREE_HUNDRED_SIXTY_FIVE,
    NUMBERS_LENGTH = {
        ms: 1,
        secs: ONE_THOUSAND,
        s: ONE_THOUSAND,
        mins: ONE_THOUSAND_SIXTY,
        hrs: THREE_HUNDRED_SIXTY_THOUSAND,
        days: EIGHTY_SIX_MILLION_FOUR_HUNDRED_THOUSAND,
        wks: SIX_HUNDRED_FOUR_MILLION_EIGHT_HUNDRED_THOUSAND,
        mnths: TWO_BILLION_FIVE_HUNDRED_NINETY_TWO_MILLION,
        yrs: THIRTY_ONE_BILLION_FIVE_HUNDRED_THIRTY_SIX_MILLION
    },
    timeUnits = [],
    timeUnitToNumber = foldl(NUMBERS_LENGTH, function (memo, number, unit) {
        timeUnits.push(unit);
        memo[unit] = function (input) {
            return input * number;
        };
        return memo;
    }, {}),
    time = cacheable(function (number_) {
        var number = number_ + EMPTY_STRING,
            time = 0;
        if (isString(number)) {
            number = number.split(',');
        }
        duff(number, function (num_) {
            var num = num_,
                unit = customUnits(num, timeUnits),
                number = +(num.split(unit || EMPTY_STRING).join(EMPTY_STRING)),
                handler = timeUnitToNumber[unit];
            // there's a handler for this unit, adn it's not NaN
            if (number === number) {
                if (handler) {
                    number = handler(number);
                }
                time += number;
            }
        });
        return time;
    });
_.exports({
    // constants
    customUnits: customUnits,
    // cache makers
    uniqueId: uniqueId,
    cacheable: cacheable,
    categoricallyCacheable: categoricallyCacheable,
    // cacheable
    deprefix: deprefix,
    deprefixAll: deprefixAll,
    prefix: prefix,
    prefixAll: prefixAll,
    upCase: upCase,
    unCamelCase: unCamelCase,
    spinalCase: unCamelCase,
    camelCase: camelCase,
    snakeCase: snakeCase,
    string: string,
    units: units,
    baseUnitList: baseUnitList,
    isHttp: isHttp,
    parseHash: parseHash,
    parseURL: parseURL,
    parseObject: parseObject,
    time: time,
    startsWith: startsWith,
    itemIs: itemIs
});