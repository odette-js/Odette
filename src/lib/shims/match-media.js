if (!global.matchMedia) {
    global.matchMedia = function () {
        // "use strict";
        // For browsers that support matchMedium api such as IE 9 and webkit
        var styleMedia = (global.styleMedia || global.media);
        // For those that don't support matchMedium
        if (!styleMedia) {
            var style = document.createElement('style'),
                script = document.getElementsByTagName('script')[0],
                info = null;
            style.type = 'text/css';
            style.id = 'matchmediajs-test';
            script.parentNode.insertBefore(style, script);
            // 'style.currentStyle' is used by IE <= 8 and 'global.getComputedStyle' for all other browsers
            info = ('getComputedStyle' in global) && global.getComputedStyle(style, null) || style.currentStyle;
            styleMedia = {
                matchMedium: function (media) {
                    var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';
                    // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                    if (style.styleSheet) {
                        style.styleSheet.cssText = text;
                    } else {
                        style.textContent = text;
                    }
                    // Test if media query is true or false
                    return info.width === '1px';
                }
            };
        }
        return function (media) {
            media = media || 'all';
            return {
                matches: styleMedia.matchMedium(media),
                media: media
            };
        };
    }();
}