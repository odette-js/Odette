module.exports = function (keys) {
    return function (obj, iterator) {
        handler.keys = keys(obj);
        return handler;

        function handler(key, idx, list) {
            // gives you the key, use that to get the value
            return iterator(obj[key], key, obj);
        }
    };
};