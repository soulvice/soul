'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.errors = exports.config = undefined;

var _config = require('./lib/config');

var _config2 = _interopRequireDefault(_config);

var _errors = require('./lib/errors');

var _errors2 = _interopRequireDefault(_errors);

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportVals = {
  config: _config2.default,
  errors: _errors2.default,
  logger: _logger2.default
}; /*
     soul
   
     the soul of your applications in one place.
   */

exports.default = exportVals;
exports.config = _config2.default;
exports.errors = _errors2.default;
exports.logger = _logger2.default;