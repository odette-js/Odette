app.scope(function (app) {
    var CATCH = 'catch',
        ERROR = 'error',
        STATUS = 'status',
        FAILURE = 'failure',
        SUCCESS = 'success',
        READY_STATE = 'readyState',
        XDomainRequest = win.XDomainRequest,
        stringifyQuery = _.stringifyQuery,
        GET = 'GET',
        PROGRESS = 'progress',
        validTypes = toArray(GET + ',POST,PUT,DELETE,HEAD,TRACE,OPTIONS,CONNECT'),
        baseEvents = toArray(PROGRESS + ',timeout,abort,' + ERROR),
        readAndApply = function () {},
        basehandlers = {
            progress: readAndApply,
            timeout: readAndApply,
            abort: readAndApply,
            error: readAndApply
        },
        attachBaseListeners = function (ajax) {
            var prog = 0,
                req = ajax.options.requestObject;
            duff(baseEvents, function (evnt) {
                if (evnt === PROGRESS) {
                    // we put it directly on the xhr object so we can
                    // account for certain ie bugs that show up
                    req['on' + evnt] = function (e) {
                        if (!e) {
                            return;
                        }
                        var percent = (e.loaded / e.total);
                        prog++;
                        ajax[DISPATCH_EVENT](PROGRESS, {
                            percent: percent || (prog / (prog + 1)),
                            counter: prog
                        }, {
                            originalEvent: e
                        });
                    };
                } else {
                    req['on' + evnt] = function (e) {
                        basehandlers[evnt](ajax, evnt, e);
                    };
                }
            });
        },
        sendthething = function (xhrReq, args, ajax) {
            return function () {
                return wraptry(function () {
                    return xhrReq.send.apply(xhrReq, args);
                }, function (e) {
                    ajax.resolveAs(CATCH, e, e.message);
                });
            };
        },
        /**
         * @class HTTP
         * @alias factories.HTTP
         * @augments Model
         * @classdesc XHR object wrapper Triggers events based on xhr state changes and abstracts many anomalies that have to do with IE
         */
        STATUS_200s = 'status:2xx',
        STATUS_300s = 'status:3xx',
        STATUS_400s = 'status:4xx',
        STATUS_500s = 'status:5xx',
        HTTP = factories.HTTP = Promise.extend('HTTP', {
            /**
             * @func
             * @name HTTP#constructor
             * @param {string} str - url to get from
             * @returns {HTTP} new ajax object
             */
            parse: parse,
            constructor: function (str) {
                var promise, url, thingToDo, typeThing, type, ajax = this,
                    method = 'onreadystatechange',
                    // Add a cache buster to the url
                    // ajax.async = BOOLEAN_TRUE;
                    xhrReq = new XMLHttpRequest();
                // covers ie9
                if (!isUndefined(XDomainRequest)) {
                    xhrReq = new XDomainRequest();
                    method = 'onload';
                }
                if (!isObject(str)) {
                    str = str || EMPTY_STRING;
                    type = GET;
                    typeThing = str.toUpperCase();
                    if (indexOf(validTypes, typeThing) !== -1) {
                        type = typeThing;
                    } else {
                        url = str;
                    }
                    str = {
                        url: url || EMPTY_STRING,
                        type: type
                    };
                }
                ajax.options = _.extend({
                    async: BOOLEAN_TRUE,
                    method: method,
                    type: type,
                    requestObject: xhrReq,
                    withCredentials: BOOLEAN_TRUE
                }, str);
                ajax[CONSTRUCTOR + COLON + 'Promise']();
                // function () {
                var sending,
                    // type = ajax.options.type,
                    // url = ajax.options.url,
                    args = [],
                    data = ajax.options.data;
                if (isObject(url) && !isArray(url)) {
                    url = stringifyQuery(url);
                }
                if (!url || !type) {
                    return exception('http object must have a url and a type');
                }
                ajax.attachResponseHandler();
                wraptry(function () {
                    // if (!win.XDomainRequest || !isInstance(xhrReq, win.XDomainRequest)) {
                    //     xhrReq.withCredentials = ajax.options.withCredentials;
                    // }
                    xhrReq.open(type, url, ajax.options.async);
                });
                if (data) {
                    args.push(stringify(data));
                }
                ajax.headers(ajax.options.headers);
                attachBaseListeners(ajax);
                // have to wrap in set timeout for ie
                sending = sendthething(xhrReq, args, ajax);
                if (_.isIE) {
                    setTimeout(sending);
                } else {
                    sending();
                }
                // );
                return ajax;
            },
            status: function (code, handler) {
                return this.handle(STATUS + COLON + code, handler);
            },
            headers: function (headers) {
                var ajax = this,
                    xhrReq = ajax.requestObject;
                each(headers, function (val, key) {
                    xhrReq.setRequestHeader(key, val);
                });
                return ajax;
            },
            /**
             * @description specialized function to stringify url if it is an object
             * @returns {string} returns the completed string that will be fetched / posted / put / or deleted against
             * @name HTTP#getUrl
             */
            /**
             * @description makes public the ability to attach a response handler if one has not already been attached. We recommend not passing a function in and instead just listening to the various events that the xhr object will trigger directly, or indirectly on the ajax object
             * @param {function} [fn=handler] - pass in a function to have a custom onload, onreadystatechange handler
             * @returns {ajax}
             * @name HTTP#attachResponseHandler
             */
            auxiliaryStates: function () {
                return {
                    // cross domain error
                    'status:0': FAILURE,
                    'status:2xx': SUCCESS,
                    'status:200': STATUS_200s,
                    'status:202': STATUS_200s,
                    'status:204': STATUS_200s,
                    'status:205': STATUS_200s,
                    'status:3xx': SUCCESS,
                    'status:302': STATUS_300s,
                    'status:304': STATUS_300s,
                    'status:4xx': FAILURE,
                    'status:400': STATUS_400s,
                    'status:401': STATUS_400s,
                    'status:403': STATUS_400s,
                    'status:404': STATUS_400s,
                    'status:405': STATUS_400s,
                    'status:406': STATUS_400s,
                    'timeout': STATUS_400s,
                    'status:408': 'timeout',
                    'status:5xx': FAILURE,
                    'status:500': STATUS_500s,
                    'status:502': STATUS_500s,
                    'status:505': STATUS_500s,
                    'status:511': STATUS_500s,
                    'abort': FAILURE
                };
            },
            attachResponseHandler: function () {
                var ajax = this,
                    xhrReqObj = ajax.options.requestObject,
                    hasFinished = BOOLEAN_FALSE,
                    method = ajax.options.method,
                    handler = function (evnt) {
                        var status, doIt, allStates, rawData, xhrReqObj = this;
                        if (!xhrReqObj || hasFinished) {
                            return;
                        }
                        status = xhrReqObj[STATUS];
                        rawData = xhrReqObj.responseText;
                        if (method === 'onload' || (method === 'onreadystatechange' && xhrReqObj[READY_STATE] === 4)) {
                            allStates = result(ajax, 'allStates');
                            rawData = ajax.options.preventParse ? rawData : ajax.parse(rawData);
                            hasFinished = BOOLEAN_TRUE;
                            ajax.resolveAs(STATUS + COLON + (xhrReqObj[STATUS] === UNDEFINED ? 200 : xhrReqObj[STATUS]), rawData);
                        }
                    };
                if (!xhrReqObj[method]) {
                    xhrReqObj[method] = handler;
                }
                return ajax;
            }
        });
    _.foldl(validTypes, function (memo, key_) {
        var key = key_;
        key = key.toLowerCase();
        memo[key] = function (url, options) {
            return HTTP(_.extend({
                type: key_,
                url: url
            }, options));
        };
    }, HTTP);
});