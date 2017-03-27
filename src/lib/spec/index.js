var b = require('batterie');
module.exports = global.b = b;
require('../utils/_index.test');
b.finish().then(b.logger('basic'));