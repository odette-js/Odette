var UNDEFINED, win = window,
    doc = win.document,
    EMPTY_STRING = '',
    SPACE = ' ',
    HYPHEN = '-',
    PERIOD = '.',
    COMMA = ',',
    SLASH = '/',
    UNDERSCORE = '_',
    COLON = ':',
    HASHTAG = '#',
    DOUBLE_UNDERSCORE = UNDERSCORE + UNDERSCORE,
    DOUBLE_SLASH = SLASH + SLASH,
    PIXELS = 'px',
    ZERO_PIXELS = 0 + PIXELS,
    ID = 'id',
    DISPLAY = 'display',
    DESTROY = 'destroy',
    BEFORE = 'before',
    CHANGE = 'change',
    CHANGING = 'changing',
    BEFORE_COLON = BEFORE + COLON,
    CHANGE_COLON = CHANGE + COLON,
    BEFORE_DESTROY = BEFORE_COLON + DESTROY,
    DESTROYING = DESTROY + 'ing',
    TO_STRING = 'toString',
    TO_JSON = 'toJSON',
    VALUE_OF = 'valueOf',
    PROTOTYPE = 'prototype',
    CONSTRUCTOR = 'constructor',
    CURRENT = 'current',
    PREVIOUS = 'previous',
    EXPORTS = 'exports',
    APPLICATION = 'application',
    NAME = 'name',
    TYPE = 'type',
    FINISHED = 'finished',
    SELECTOR = 'selector',
    ELEMENT = 'element',
    CHILD = 'child',
    NONE = 'none',
    HIDDEN = 'hidden',
    TARGET = 'target',
    ORIGIN = 'origin',
    RESET = 'reset',
    ATTRIBUTES = 'attributes',
    DATA = 'data',
    PARENT = 'parent',
    LENGTH = 'length',
    OBJECT = 'object',
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    FUNCTION = 'function',
    INDEX = 'index',
    INDEX_OF = INDEX + 'Of',
    WINDOW = 'window',
    DOCUMENT = 'document',
    WRITE = 'write',
    STACK = 'stack',
    START = 'start',
    STOP = 'stop',
    COMPONENTS = 'components',
    CLASS = 'class',
    CLASSNAME = CLASS + 'Name',
    TOP = 'top',
    LEFT = 'left',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    WIDTH = 'width',
    __ELID__ = DOUBLE_UNDERSCORE + 'elid' + DOUBLE_UNDERSCORE,
    HEIGHT = 'height',
    ITEM = 'item',
    INNER_HEIGHT = 'innerHeight',
    INNER_WIDTH = 'innerWidth',
    DISPATCH_EVENT = 'dispatchEvent',
    HTTP = 'http',
    HTTPS = HTTP + 's',
    TO_ARRAY = 'toArray',
    CONSTRUCTOR_KEY = DOUBLE_UNDERSCORE + CONSTRUCTOR + DOUBLE_UNDERSCORE,
    LOCATION = 'location',
    EXTEND = 'extend',
    STYLE = 'style',
    BODY = 'body',
    BOOLEAN_TRUE = !0,
    BOOLEAN_FALSE = !1,
    INFINITY = Infinity,
    NEGATIVE_INFINITY = -INFINITY,
    BIG_INTEGER = 32767,
    NEGATIVE_BIG_INTEGER = -BIG_INTEGER - 1,
    TWO_TO_THE_31 = 2147483647,
    MAX_ARRAY_LENGTH = 4294967295,
    NULL = null,
    FUNCTION_CONSTRUCTOR = Function,
    ARRAY_CONSTRUCTOR = Array,
    STRING_CONSTRUCTOR = String,
    NUMBER_CONSTRUCTOR = Number,
    OBJECT_CONSTRUCTOR = Object,
    FUNCTION_CONSTRUCTOR_CONSTRUCTOR = FUNCTION_CONSTRUCTOR[CONSTRUCTOR],
    BRACKET_OBJECT_SPACE = '[object ',
    STRING_PROTOTYPE = STRING_CONSTRUCTOR[PROTOTYPE],
    OBJECT_PROTOTYPE = OBJECT_CONSTRUCTOR[PROTOTYPE],
    ARRAY_PROTOTYPE = ARRAY_CONSTRUCTOR[PROTOTYPE],
    funcProto = FUNCTION_CONSTRUCTOR[PROTOTYPE],
    MAX_VALUE = NUMBER_CONSTRUCTOR.MAX_VALUE,
    MIN_VALUE = NUMBER_CONSTRUCTOR.MIN_VALUE,
    MAX_SAFE_INTEGER = NUMBER_CONSTRUCTOR.MAX_SAFE_INTEGER,
    MIN_SAFE_INTEGER = NUMBER_CONSTRUCTOR.MIN_SAFE_INTEGER;