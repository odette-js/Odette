var find = require('./utils/array/find');
module.exports = function (url__, windo_) {
    var filenamesplit, dirname, filename, garbage, href, origin, hostnameSplit, questionable, firstSlash, object, startPath, hostSplit, originNoProtocol, windo = windo_ || window,
        EMPTY_STRING = '',
        COLON = ':',
        url = url__ || EMPTY_STRING,
        search = EMPTY_STRING,
        hash = EMPTY_STRING,
        host = EMPTY_STRING,
        pathname = EMPTY_STRING,
        port = EMPTY_STRING,
        hostname = EMPTY_STRING,
        searchIdx = indexOf(url, '?') + 1,
        searchObject = {},
        protocolLength = protocols.length,
        doubleSlash = SLASH + SLASH,
        protocolSplit = url.split(COLON),
        globalProtocol = windo.location.protocol,
        protocol_ = (protocolSplit.length - 1) && (questionable = protocolSplit.shift()),
        protocol = ((protocol_ && find(protocols, function (question) {
            return question === questionable;
        }) || globalProtocol.slice(0, globalProtocol.length - 1))) + COLON;
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
            if (url.slice(0, protocols[protocolLength].length) === protocols[protocolLength]) {
                protocol = protocols[protocolLength];
            }
        }
        if (!protocol) {
            protocol = HTTP;
        }
    }
    // passed a protocol
    protocolSplit = url.split(COLON);
    if (protocolSplit.length - 1) {
        // protocolSplit
        questionable = protocolSplit.shift();
        hostSplit = protocolSplit.join(COLON).split(SLASH);
        while (!host) {
            host = hostSplit.shift();
        }
        hostnameSplit = host.split(COLON);
        hostname = hostnameSplit.shift();
        port = hostnameSplit.length ? hostnameSplit[0] : EMPTY_STRING;
        garbage = protocolSplit.shift();
        url = protocolSplit.join(COLON).slice(host.length);
    } else {
        host = windo.location.host;
        port = windo.location.port;
        hostname = windo.location.hostname;
    }
    filename = windo.location.pathname;
    filenamesplit = filename.split(SLASH);
    var filenamesplitlength = filenamesplit.length;
    // if it does not end in a slash, pop off the last bit of text
    if (filenamesplit[filenamesplitlength - 1]) {
        filenamesplit[filenamesplitlength - 1] = '';
    }
    dirname = filenamesplit.join(SLASH);
    // handle dot slash
    if (url[0] === PERIOD && url[1] === SLASH) {
        url = url.slice(2);
    }
    if (url[0] === SLASH && url[1] === SLASH) {
        // handle removing host
    }
    // it's already in the format it needs to be in
    if (url[0] === SLASH && url[1] !== SLASH) {
        dirname = EMPTY_STRING;
    }
    pathname = dirname + url;
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
        protocol: protocol.slice(0, protocol.length),
        origin: origin,
        searchObject: searchObject
    });
};