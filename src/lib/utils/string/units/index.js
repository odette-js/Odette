var customUnits = require('./utils/string/units/custom');
var baseUnitList = require('./utils/string/units/list');
module.exports = function (str) {
    return customUnits(str, baseUnitList);
};