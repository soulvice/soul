'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.events = exports.utils = exports.math = exports.logger = exports.errors = undefined;

var _config = require('./lib/config');

var _config2 = _interopRequireDefault(_config);

var _errors = require('./lib/errors');

var _errors2 = _interopRequireDefault(_errors);

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _utils = require('./lib/utils');

var _utils2 = _interopRequireDefault(_utils);

var _math = require('./lib/math');

var _math2 = _interopRequireDefault(_math);

var _events = require('./lib/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  soul

  the soul of your applications in one place.
*/

var configSingleton = void 0;

var exportVals = {
    errors: _errors2.default,
    logger: _logger2.default,
    math: _math2.default,
    utils: _utils2.default,
    events: _events2.default
};

exports.errors = _errors2.default;
exports.logger = _logger2.default;
exports.math = _math2.default;
exports.utils = _utils2.default;
exports.events = _events2.default;


Object.defineProperty(exports, 'config', {
    enumerable: true,
    configurable: true,
    get: function get() {
        configSingleton = configSingleton || new _config2.default();
        return configSingleton;
    }
});

Object.defineProperty(exportVals, 'config', {
    enumerable: true,
    configurable: true,
    get: function get() {
        configSingleton = configSingleton || new _config2.default();
        return configSingleton;
    }
});

// export all features as 'default'
exports.default = exportVals;