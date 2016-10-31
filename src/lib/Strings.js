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
    string = _.extend(wrap(toArray('toLowerCase,toUpperCase,trim'), function (method) {
        return cacheable(function (item) {
            return item[method]();
        });
    }), wrap(toArray('match,search'), function (method) {
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
                myStr = kebabCase(myStr, splitter);
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
                cache[string] = found = new Function[CONSTRUCTOR]('return ' + string);
            }
            return found();
        };
    }());
var reEmptyStringLeading = /\b__p \+= EMPTY_STRING;/g,
    reEmptyStringMiddle = /\b(__p \+=) EMPTY_STRING \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
// Used to match HTML entities and HTML characters.
var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
    reUnescapedHtml = /[&<>"'`]/g,
    reHasEscapedHtml = RegExp(reEscapedHtml.source),
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
// Used to match template delimiters. */
var reEscape = /<%-([\s\S]+?)%>/g,
    reEvaluate = /<%([\s\S]+?)%>/g,
    reInterpolate = /<%=([\s\S]+?)%>/g;
// Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
//* Used to match `RegExp`* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).*/
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);
// Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g,
    reTrimStart = /^\s+/,
    reTrimEnd = /\s+$/;
// Used to match wrap detail comments. */
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
    reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;
// Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
// Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;
//* Used to match* [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).*/
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
// Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;
// Used to detect hexadecimal string values. */
var reHasHexPrefix = /^0x/i;
// Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
// Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;
// Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;
// Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;
// Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;
// Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
// Used to ensure capturing order of template delimiters. */
var reNoMatch = /($^)/;
// Used to match unescaped characters in compiled string literals. */
var reUnescapedString = /['\n\r\u2028\u2029\\]/g,
    // Used to compose unicode character classes. */
    rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
// Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsAstral = '[' + rsAstralRange + ']',
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';
// Used to compose unicode regexes. */
var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
    rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptLowerContr = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptUpperContr = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')',
    reUnicodeWord = RegExp([
        rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
        rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
        rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr,
        rsUpper + '+' + rsOptUpperContr,
        rsDigits,
        rsEmoji
    ].join('|'), 'g');

function asciiWords(string) {
    return string.match(reAsciiWord) || [];
}

function basePropertyOf(object) {
    return function (key) {
        return object == NULL ? UNDEFINED : object[key];
    };
}
var reComboMark = RegExp(rsCombo, 'g');
// Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',
    '\xc1': 'A',
    '\xc2': 'A',
    '\xc3': 'A',
    '\xc4': 'A',
    '\xc5': 'A',
    '\xe0': 'a',
    '\xe1': 'a',
    '\xe2': 'a',
    '\xe3': 'a',
    '\xe4': 'a',
    '\xe5': 'a',
    '\xc7': 'C',
    '\xe7': 'c',
    '\xd0': 'D',
    '\xf0': 'd',
    '\xc8': 'E',
    '\xc9': 'E',
    '\xca': 'E',
    '\xcb': 'E',
    '\xe8': 'e',
    '\xe9': 'e',
    '\xea': 'e',
    '\xeb': 'e',
    '\xcc': 'I',
    '\xcd': 'I',
    '\xce': 'I',
    '\xcf': 'I',
    '\xec': 'i',
    '\xed': 'i',
    '\xee': 'i',
    '\xef': 'i',
    '\xd1': 'N',
    '\xf1': 'n',
    '\xd2': 'O',
    '\xd3': 'O',
    '\xd4': 'O',
    '\xd5': 'O',
    '\xd6': 'O',
    '\xd8': 'O',
    '\xf2': 'o',
    '\xf3': 'o',
    '\xf4': 'o',
    '\xf5': 'o',
    '\xf6': 'o',
    '\xf8': 'o',
    '\xd9': 'U',
    '\xda': 'U',
    '\xdb': 'U',
    '\xdc': 'U',
    '\xf9': 'u',
    '\xfa': 'u',
    '\xfb': 'u',
    '\xfc': 'u',
    '\xdd': 'Y',
    '\xfd': 'y',
    '\xff': 'y',
    '\xc6': 'Ae',
    '\xe6': 'ae',
    '\xde': 'Th',
    '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',
    '\u0102': 'A',
    '\u0104': 'A',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u0105': 'a',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010a': 'C',
    '\u010c': 'C',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010b': 'c',
    '\u010d': 'c',
    '\u010e': 'D',
    '\u0110': 'D',
    '\u010f': 'd',
    '\u0111': 'd',
    '\u0112': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u0118': 'E',
    '\u011a': 'E',
    '\u0113': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u0119': 'e',
    '\u011b': 'e',
    '\u011c': 'G',
    '\u011e': 'G',
    '\u0120': 'G',
    '\u0122': 'G',
    '\u011d': 'g',
    '\u011f': 'g',
    '\u0121': 'g',
    '\u0123': 'g',
    '\u0124': 'H',
    '\u0126': 'H',
    '\u0125': 'h',
    '\u0127': 'h',
    '\u0128': 'I',
    '\u012a': 'I',
    '\u012c': 'I',
    '\u012e': 'I',
    '\u0130': 'I',
    '\u0129': 'i',
    '\u012b': 'i',
    '\u012d': 'i',
    '\u012f': 'i',
    '\u0131': 'i',
    '\u0134': 'J',
    '\u0135': 'j',
    '\u0136': 'K',
    '\u0137': 'k',
    '\u0138': 'k',
    '\u0139': 'L',
    '\u013b': 'L',
    '\u013d': 'L',
    '\u013f': 'L',
    '\u0141': 'L',
    '\u013a': 'l',
    '\u013c': 'l',
    '\u013e': 'l',
    '\u0140': 'l',
    '\u0142': 'l',
    '\u0143': 'N',
    '\u0145': 'N',
    '\u0147': 'N',
    '\u014a': 'N',
    '\u0144': 'n',
    '\u0146': 'n',
    '\u0148': 'n',
    '\u014b': 'n',
    '\u014c': 'O',
    '\u014e': 'O',
    '\u0150': 'O',
    '\u014d': 'o',
    '\u014f': 'o',
    '\u0151': 'o',
    '\u0154': 'R',
    '\u0156': 'R',
    '\u0158': 'R',
    '\u0155': 'r',
    '\u0157': 'r',
    '\u0159': 'r',
    '\u015a': 'S',
    '\u015c': 'S',
    '\u015e': 'S',
    '\u0160': 'S',
    '\u015b': 's',
    '\u015d': 's',
    '\u015f': 's',
    '\u0161': 's',
    '\u0162': 'T',
    '\u0164': 'T',
    '\u0166': 'T',
    '\u0163': 't',
    '\u0165': 't',
    '\u0167': 't',
    '\u0168': 'U',
    '\u016a': 'U',
    '\u016c': 'U',
    '\u016e': 'U',
    '\u0170': 'U',
    '\u0172': 'U',
    '\u0169': 'u',
    '\u016b': 'u',
    '\u016d': 'u',
    '\u016f': 'u',
    '\u0171': 'u',
    '\u0173': 'u',
    '\u0174': 'W',
    '\u0175': 'w',
    '\u0176': 'Y',
    '\u0177': 'y',
    '\u0178': 'Y',
    '\u0179': 'Z',
    '\u017b': 'Z',
    '\u017d': 'Z',
    '\u017a': 'z',
    '\u017c': 'z',
    '\u017e': 'z',
    '\u0132': 'IJ',
    '\u0133': 'ij',
    '\u0152': 'Oe',
    '\u0153': 'oe',
    '\u0149': "'n",
    '\u017f': 'ss'
};
var deburrLetter = basePropertyOf(deburredLetters);
var Symbol = window.Symbol;
var symbolProto = Symbol ? Symbol.prototype : UNDEFINED,
    symbolValueOf = symbolProto ? symbolProto.valueOf : UNDEFINED,
    symbolToString = symbolProto ? symbolProto.toString : UNDEFINED;
var objectToString = OBJECT_PROTOTYPE.toString,
    symbolTag = '[object Symbol]',
    isSymbolWrap = isWrap('symbol');
var reApos = RegExp(rsApos, 'g');
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
var unicodeWords = function (string) {
        return string.match(reUnicodeWord) || [];
    },
    hasUnicodeWord = function (string) {
        return reHasUnicodeWord.test(string);
    },
    isSymbol = function (value) {
        return isSymbolWrap(value) || (isObject(value) && objectToString.call(value) == symbolTag);
    },
    baseToString = function (value) {
        // Exit early for strings to avoid a performance hit in some environments.
        if (isString(value)) {
            return value;
        }
        if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : EMPTY_STRING;
        }
        var result = (value + EMPTY_STRING);
        return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    },
    toString = function (value) {
        return value == NULL ? EMPTY_STRING : baseToString(value);
    },
    words = function (string_, pattern_, guard) {
        var string = toString(string_),
            pattern = guard ? UNDEFINED : pattern_;
        if (pattern === UNDEFINED) {
            return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
        }
        return string.match(pattern) || [];
    },
    arrayReduce = function (array, iteratee, accumulator, initAccum) {
        var index = -1,
            length = array ? array.length : 0;
        if (initAccum && length) {
            accumulator = array[++index];
        }
        while (++index < length) {
            accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
    },
    createCompounder = function (callback) {
        return cacheable(function (string) {
            return arrayReduce(words(deburr(string).replace(reApos, EMPTY_STRING)), callback, EMPTY_STRING);
        });
    },
    deburr = function (string) {
        string = toString(string);
        return string && string.replace(reLatin, deburrLetter).replace(reComboMark, EMPTY_STRING);
    },
    capitalize = cacheable(function (s) {
        return s[0].toUpperCase() + s.slice(1);
    }),
    kebabCase = createCompounder(function (result, word, index) {
        return result + (index ? HYPHEN : EMPTY_STRING) + word.toLowerCase();
    }),
    camelCase = createCompounder(function (result, word, index) {
        word = word.toLowerCase();
        return result + (index ? capitalize(word) : word);
    }),
    lowerCase = createCompounder(function (result, word, index) {
        return result + (index ? SPACE : EMPTY_STRING) + word.toLowerCase();
    }),
    snakeCase = createCompounder(function (result, word, index) {
        return result + (index ? '_' : EMPTY_STRING) + word.toLowerCase();
    }),
    startCase = createCompounder(function (result, word, index) {
        return result + (index ? SPACE : EMPTY_STRING) + upperFirst(word);
    }),
    upperCase = createCompounder(function (result, word, index) {
        return result + (index ? SPACE : EMPTY_STRING) + word.toUpperCase();
    });
var customUnits = categoricallyCacheable(function (unitList_) {
        var lengthHash = {},
            hash = {},
            lengths = [],
            unitList = toArray(unitList_),
            sortedUnitList = unitList.sort(function (a, b) {
                var aLength = a[LENGTH],
                    bLength = b[LENGTH],
                    value = _.math.max([-1, _.math.min([1, aLength - bLength])]);
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
            return -1 * _.math.max([-1, _.math.min([1, a - b])]);
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
    baseUnitList = toArray('px,em,rem,ex,in,cm,%,vh,vw,pc,pt,mm,vmax,vmin'),
    units = function (str) {
        return customUnits(str, baseUnitList);
    },
    isHttp = cacheable(function (str) {
        var ret = !1,
            splitLength = str.split(DOUBLE_SLASH)[LENGTH];
        if ((str.indexOf(HTTP) === 0 && splitLength >= 2) || (str.indexOf(DOUBLE_SLASH) === 0 && splitLength === 2)) {
            ret = !0;
        }
        return ret;
    }),
    protocol = cacheable(function (url) {
        var ret = !1,
            split = str.split(DOUBLE_SLASH),
            splitLength = split[LENGTH],
            first = split.shift();
        return ret;
    }),
    parseHash_ = cacheable(function (url) {
        var hash = EMPTY_STRING,
            hashIdx = indexOf(url, '#') + 1;
        if (hashIdx) {
            hash = url.slice(hashIdx);
        }
        return hash;
    }),
    parseHash = function (url, parser) {
        var parsed = parseHash_(url);
        return parser ? parsed : parse(parsed);
    },
    itemIs = function (list, item, index) {
        return list[index || 0] === item;
    },
    startsWith = itemIs,
    parseSearch = function (search) {
        var parms, temp, items, val, converted, i = 0,
            dcUriComp = win.decodeURIComponent;
        if (!search) {
            search = win[LOCATION].search;
        }
        items = search.slice(1).split("&");
        parms = {};
        for (; i < items[LENGTH]; i++) {
            temp = items[i].split("=");
            if (temp[0]) {
                if (temp[LENGTH] < 2) {
                    temp[PUSH](EMPTY_STRING);
                }
                val = temp[1];
                val = dcUriComp(val);
                if (val[0] === "'" || val[0] === '"') {
                    val = val.slice(1, val[LENGTH] - 1);
                }
                if (val === BOOLEAN_TRUE + EMPTY_STRING) {
                    val = BOOLEAN_TRUE;
                }
                if (val === BOOLEAN_FALSE + EMPTY_STRING) {
                    val = BOOLEAN_FALSE;
                }
                if (isString(val)) {
                    converted = +val;
                    if (converted == val && converted + EMPTY_STRING === val) {
                        val = converted;
                    }
                }
                parms[dcUriComp(temp[0])] = val;
            }
        }
        return parms;
    },
    urlToString = function (object) {
        object.toString = function () {
            return object.href;
        };
        object.replace = function (newlocation) {
            var newparsed = parseUrl(newlocation);
            newparsed.previous = object;
            return newparsed;
        };
        return object;
    },
    reference = cacheable(function (str) {
        var match;
        if (!str) {
            return EMPTY_STRING;
        }
        if (!isString(str)) {
            str = str.referrer;
        }
        if (isString(str)) {
            // gives it a chance to match
            str += SLASH;
            match = str.match(/^https?:\/\/.*?\//im);
            if (match) {
                match = match[0].slice(0, match[0][LENGTH] - 1);
            }
        }
        return match || EMPTY_STRING;
    }),
    protocols = [HTTP, HTTPS].concat(toArray('file,about,javascript,ws,tel')),
    extraslashes = {
        'http:': BOOLEAN_TRUE,
        'https:': BOOLEAN_TRUE
    },
    parseUrl = function (url__, startPath_, windo_) {
        var garbage, href, origin, hostnameSplit, questionable, firstSlash, object, startPath, hostSplit, originNoProtocol, windo = windo_ || window,
            url = url__ || EMPTY_STRING,
            search = EMPTY_STRING,
            hash = EMPTY_STRING,
            host = EMPTY_STRING,
            pathname = EMPTY_STRING,
            port = EMPTY_STRING,
            hostname = EMPTY_STRING,
            searchIdx = indexOf(url, '?') + 1,
            searchObject = {},
            protocolLength = protocols[LENGTH],
            doubleSlash = SLASH + SLASH,
            protocolSplit = url.split(COLON),
            globalProtocol = windo.location.protocol,
            protocol_ = (protocolSplit[LENGTH] - 1) && (questionable = protocolSplit.shift()),
            protocol = ((protocol_ && find(protocols, function (question) {
                return question === questionable;
            }) || globalProtocol.slice(0, globalProtocol[LENGTH] - 1))) + COLON;
        if (searchIdx) {
            search = url.slice(searchIdx - 1);
            hash = parseHash_(search);
        } else {
            hash = parseHash_(url);
        }
        if (searchIdx) {
            search = search.split(hash).join(EMPTY_STRING);
            searchObject = parseSearch(search);
            url = url.slice(0, searchIdx - 1);
        }
        if (url[0] === SLASH && url[1] === SLASH) {
            protocol = windo.location.protocol;
        } else {
            while (protocolLength-- && !protocol) {
                if (url.slice(0, protocols[protocolLength][LENGTH]) === protocols[protocolLength]) {
                    protocol = protocols[protocolLength];
                }
            }
            if (!protocol) {
                protocol = HTTP;
            }
        }
        // passed a protocol
        protocolSplit = url.split(COLON);
        if (protocolSplit[LENGTH] - 1) {
            // protocolSplit
            questionable = protocolSplit.shift();
            hostSplit = protocolSplit.join(COLON).split(SLASH);
            while (!host) {
                host = hostSplit.shift();
            }
            hostnameSplit = host.split(COLON);
            hostname = hostnameSplit.shift();
            port = hostnameSplit[LENGTH] ? hostnameSplit[0] : EMPTY_STRING;
            garbage = protocolSplit.shift();
            url = protocolSplit.join(COLON).slice(host[LENGTH]);
        } else {
            host = windo.location.host;
            port = windo.location.port;
            hostname = windo.location.hostname;
        }
        startPath = windo.location.pathname.slice(1);
        if (url[0] === SLASH && url[1] !== SLASH) {
            url = url.slice(1);
            startPath = EMPTY_STRING;
        }
        if (url[0] === PERIOD) {
            url = url.slice(2);
        }
        pathname = SLASH + startPath + url;
        origin = protocol + (extraslashes[protocol] ? SLASH + SLASH : EMPTY_STRING) + hostname + (port ? COLON + port : EMPTY_STRING);
        href = origin + pathname + (search || EMPTY_STRING) + (hash || EMPTY_STRING);
        return urlToString({
            passed: url__,
            port: port,
            hostname: hostname,
            pathname: pathname,
            search: search.slice(1),
            host: host,
            hash: hash.slice(1),
            href: href,
            protocol: protocol.slice(0, protocol[LENGTH]),
            origin: origin,
            searchObject: searchObject
        });
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
    THIRTY_ONE_BILLION_FIVE_HUNDRED_THIRTY_SIX_MILLION = EIGHTY_SIX_MILLION_FOUR_HUNDRED_THOUSAND * THREE_HUNDRED_SIXTY_FIVE,
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
    weekdays = toArray('sunday,monday,tuesday,wednesday,thursday,friday,saturday'),
    months = toArray('january,feburary,march,april,may,june,july,august,september,october,november,december'),
    monthsHash = wrap(months, BOOLEAN_TRUE),
    monthsIndex = wrap(months, function (key, index) {
        return index;
    }),
    time = cacheable(function (number_) {
        var time = 0;
        duff(toArray(number_ + EMPTY_STRING), function (num_) {
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
    }),
    escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    },
    escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g,
    escapeChar = function (match) {
        return '\\' + escapes[match];
    },
    escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    },
    unescapeMap = invert(escapeMap),
    createEscaper = function (map) {
        var escaper = function (match) {
            return map[match];
        };
        var source = '(?:' + keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function (string) {
            string = string == NULL ? EMPTY_STRING : EMPTY_STRING + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    },
    indent = function (string, indentation) {
        return string.split('\n').join('\n' + (indentation || '\t'));
    },
    escape = createEscaper(escapeMap),
    unescape = createEscaper(unescapeMap),
    stringSize = function (string) {
        return string[LENGTH];
    },
    nativeFloor = function (number) {
        return Math.floor(number);
    },
    nativeCeil = function (number) {
        return Math.ceil(number);
    },
    baseRepeat = function (string, n) {
        var result = '';
        if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
            return result;
        }
        // Leverage the exponentiation by squaring algorithm for a faster repeat.
        // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
        do {
            if (n % 2) {
                result += string;
            }
            n = nativeFloor(n / 2);
            if (n) {
                string += string;
            }
        } while (n);
        return result;
    },
    createPadding = function (length, chars_) {
        var chars = chars_ === UNDEFINED ? SPACE : baseToString(chars_);
        var charsLength = chars.length;
        if (charsLength < 2) {
            return charsLength ? baseRepeat(chars, length) : chars;
        }
        var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
        return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join(EMPTY_STRING) : result.slice(0, length);
    },
    pad = function (string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        if (!length || strLength >= length) {
            return string;
        }
        var mid = (length - strLength) / 2;
        return EMPTY_STRING.concat(createPadding(nativeFloor(mid), chars), string, createPadding(nativeCeil(mid), chars));
    },
    padEnd = function (string_, length_, chars) {
        var string = toString(string_);
        var length = toInteger(length_);
        var strLength = length ? stringSize(string) : 0;
        return (length && strLength < length) ? EMPTY_STRING.concat(string.createPadding(length - strLength, chars)) : string;
    },
    padStart = function (string_, length_, chars) {
        var string = toString(string_);
        var length = toInteger(length_);
        var strLength = length ? stringSize(string) : 0;
        return (length && strLength < length) ? EMPTY_STRING.concat(createPadding(length - strLength, chars).string) : string;
    };
_.publicize({
    escape: escape,
    unescape: unescape,
    monthIndex: monthsIndex,
    monthHash: monthsHash,
    months: months,
    weekdays: weekdays,
    indent: indent,
    // constants
    customUnits: customUnits,
    cacheable: cacheable,
    categoricallyCacheable: categoricallyCacheable,
    // cacheable
    deprefix: deprefix,
    deprefixAll: deprefixAll,
    prefix: prefix,
    prefixAll: prefixAll,
    capitalize: capitalize,
    spinalCase: kebabCase,
    kebabCase: kebabCase,
    camelCase: camelCase,
    snakeCase: snakeCase,
    lowerCase: lowerCase,
    startCase: startCase,
    upperCase: upperCase,
    reference: reference,
    string: string,
    units: units,
    baseUnitList: baseUnitList,
    isHttp: isHttp,
    parseHash: parseHash,
    parseUrl: parseUrl,
    parseSearch: parseSearch,
    parseObject: parseObject,
    time: time,
    startsWith: startsWith,
    itemIs: itemIs,
    pad: pad,
    padEnd: padEnd,
    padStart: padStart
});