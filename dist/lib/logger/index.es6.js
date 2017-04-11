'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var adapter = new _SoulLogger2.default({
    domain: opts.domain || null,
    env: opts.env || null,
    mode: opts.mode || null,
    level: opts.level || null,
    transports: opts.transports || null,
    rotation: opts.rotation || null,
    path: opts.path || null,
    loggly: opts.loggly || null
  });

  return adapter;
};

var _SoulLogger = require('./SoulLogger');

var _SoulLogger2 = _interopRequireDefault(_SoulLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }