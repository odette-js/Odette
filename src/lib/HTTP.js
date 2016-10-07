app.block(function (app) {
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
        sendthething = function (xhrReq, data, ajax) {
            return function () {
                return wraptry(function () {
                    return data ? xhrReq.send(data) : xhrReq.send();
                }, function (e) {
                    ajax.resolveAs(CATCH, e, e.message);
                });
            };
        },
        /**
         * @class HTTP
         * @alias _.HTTP
         * @augments Model
         * @classdesc XHR object wrapper Triggers events based on xhr state changes and abstracts many anomalies that have to do with IE
         */
        STATUS_200s = 'status:2xx',
        STATUS_300s = 'status:3xx',
        STATUS_400s = 'status:4xx',
        STATUS_500s = 'status:5xx',
        cache = {},
        states = function () {
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
        HTTP = _.HTTP = factories.Deferred.extend('HTTP', {
            /**
             * Set a parser for the retrieved value. By default the [parse]{@link _.parse} function is used from the {@link _} object, but this can be overwritten if needed. If it is overwritten, the user will have to account for any and all parts of the response.
             * @method
             * @example
             *
             */
            parse: parse,
            constructor: function (str) {
                var promise, url, thingToDo, typeThing, type, ajax = this,
                    method = 'onreadystatechange',
                    // Add a cache buster to the url
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
                var headers, cached, key, sending,
                    args = [],
                    data = ajax.options.data;
                type = ajax.options.type;
                url = ajax.options.url;
                if (isObject(url) && !isArray(url)) {
                    url = stringifyQuery(url);
                }
                if (!url || !type) {
                    return exception('http object must have a url and a type');
                }
                if (data) {
                    data = isObject(data) ? foldl(data, function (memo, value, key) {
                        memo.push(encodeURIComponent(key) + '=' + encodeURIComponent((isObject(value) ? JSON.stringify(value) : (isFunction(value) ? NULL : value))));
                    }, []).join('&') : encodeURIComponent(data);
                }
                if (isString(data)) {
                    data = data.replace(/%20/g, '+');
                }
                headers = merge({
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }, ajax.options.headers);
                if (ajax.options.cacheable) {
                    key = [ajax.options.type, ajax.options.url, stringify(headers), data].join(',');
                    cached = cache[key];
                    if (cached) {
                        return cached;
                    }
                    cache[key] = this;
                }
                // have to wrap in set timeout for ie
                ajax.promise = Promise(function (success, failure, custom) {
                    var sending = sendthething(xhrReq, data, ajax, success, failure);
                    // attachResponseHandler(ajax);
                    var xhrReqObj = ajax.options.requestObject,
                        hasFinished = BOOLEAN_FALSE,
                        method = ajax.options.method,
                        handler = function (evnt) {
                            var type, lasttype, path, status, doIt, allStates, rawData, xhrReqObj = this;
                            if (!xhrReqObj || hasFinished) {
                                return;
                            }
                            status = xhrReqObj[STATUS];
                            rawData = xhrReqObj.responseText;
                            if (method === 'onload' || (method === 'onreadystatechange' && xhrReqObj[READY_STATE] === 4)) {
                                allStates = result(ajax, 'allStates');
                                rawData = ajax.options.preventParse ? rawData : ajax.parse(rawData);
                                hasFinished = BOOLEAN_TRUE;
                                type = STATUS + COLON + (xhrReqObj[STATUS] === UNDEFINED ? 200 : xhrReqObj[STATUS]);
                                path = states();
                                while (isString(type)) {
                                    lasttype = type;
                                    type = path[type];
                                }
                                if (lasttype === SUCCESS) {
                                    success(rawData);
                                } else {
                                    failure(rawData);
                                }
                            }
                        };
                    if (!xhrReqObj[method]) {
                        xhrReqObj[method] = handler;
                    }
                    // return ajax;
                    wraptry(function () {
                        xhrReq.open(type.toUpperCase(), url, ajax.options.async);
                    });
                    ajax.headers(headers);
                    attachBaseListeners(ajax);
                    if (_.isIE) {
                        setTimeout(sending);
                    } else {
                        sending();
                    }
                }, BOOLEAN_TRUE);
                return ajax;
            },
            status: function (code, handler) {
                return this.handle(STATUS + COLON + code, handler);
            },
            headers: function (headers) {
                var ajax = this,
                    xhrReq = ajax.options.requestObject;
                each(headers, function (val, key) {
                    xhrReq.setRequestHeader(key, val);
                });
                return ajax;
            },
            then: function (one, two) {
                return this.promise.then(one, two);
            },
            catch: function (one) {
                return this.promise.catch(one);
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