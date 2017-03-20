var test = application.scope().directive('Tests');
module.exports = global.test = test;
require('../utils/index.test');
require('./teardown.js');