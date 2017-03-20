Odette.definition(global, function (app, context, options) {
    var CONSTRUCTOR = 'constructor';
    var _ = require('./utils');
    var directiveScopeGenerator = require('./directives');
    var scope = require('./directives/generated');
    var Directive = require('./Directive');
    var Status = require('./Status');
    var Data = require('./Data');
    var EventManager = require('./EventManager');
    var SyntheticEvent = require('./SyntheticEvent');
    var Registry = require('./Registry');
    var Messenger = require('./Messenger');
    var Tests = require('./Tests');
    var factories = {
        Data: Data,
        Status: Status,
        Directive: Directive,
        EventManager: EventManager,
        SyntheticEvent: SyntheticEvent,
        Registry: Registry,
        Tests: Tests
    };
    scope.define('Status', Status[CONSTRUCTOR]);
    scope.define('Directive', Directive[CONSTRUCTOR]);
    scope.define('Data', Data[CONSTRUCTOR]);
    scope.define('EventManager', EventManager[CONSTRUCTOR]);
    scope.define('Registry', Registry[CONSTRUCTOR]);
    scope.define('Messenger', Messenger[CONSTRUCTOR]);
    scope.define('Tests', Tests);
    _.extend([app, {
        _: _,
        directiveScope: scope,
        directiveScopeGenerator: directiveScopeGenerator,
        factories: factories
    }, Directive.fn]);
});