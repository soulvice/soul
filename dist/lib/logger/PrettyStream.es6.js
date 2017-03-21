'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _stream = require('stream');

var _prettyjson = require('prettyjson');

var _prettyjson2 = _interopRequireDefault(_prettyjson);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 soul
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 the soul of your applications in one place.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

// Private
var _private = {
  levelFromName: {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal'
  },
  colorForLevel: {
    10: 'grey',
    20: 'grey',
    30: 'cyan',
    40: 'magenta',
    50: 'red',
    60: 'inverse'
  },
  colors: {
    'bold': [1, 22],
    'italic': [3, 23],
    'underline': [4, 24],
    'inverse': [7, 27],
    'white': [37, 39],
    'grey': [90, 39],
    'black': [30, 39],
    'blue': [34, 39],
    'cyan': [36, 39],
    'green': [32, 39],
    'magenta': [35, 39],
    'red': [31, 39],
    'yellow': [33, 39]
  }
};

function colorize(color, value) {
  return '\x1B[' + _private[color][0] + 'm' + value + '\x1B[' + _private[color][1] + 'm';
}

/*
  PrettyStream
*/

var PrettyStream = function (_Transform) {
  _inherits(PrettyStream, _Transform);

  function PrettyStream() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PrettyStream);

    var _this = _possibleConstructorReturn(this, (PrettyStream.__proto__ || Object.getPrototypeOf(PrettyStream)).call(this, opts));

    _this.mode = opts.mode || 'short';
    return _this;
  }

  _createClass(PrettyStream, [{
    key: 'write',
    value: function write(data, enc, cb) {
      if ((0, _lodash.isObject)(data) && !(data instanceof Buffer)) {
        data = JSON.stringify(data);
      }

      _get(PrettyStream.prototype.__proto__ || Object.getPrototypeOf(PrettyStream.prototype), 'write', this).call(this, data, enc, cb);
    }
  }, {
    key: '_transform',
    value: function _transform(data, enc, cb) {
      if (!(0, _lodash.isString)(data)) {
        data = data.toString();
      }
      // replace newline(\n)
      data = data.replace(/\\n$/, '');

      try {
        data = JSON.parse(data);
      } catch (e) {
        cb(e);

        return;
      }

      var output = '';
      var time = (0, _moment2.default)(data.time).format('YYYY-MM-DD HH:mm:ss');
      var codes = _private.colors[_private.colorForLevel[data.level]];
      var logLevel = '\x1B[' + codes[0] + 'm' + _private.levelFromName[data.level].toUpperCase() + '\x1B[' + codes[1] + 'm';
      var bodyPretty = '';

      if (data.msg && !data.err) {
        bodyPretty += data.msg;

        output += '[' + time + '] ' + logLevel + ' ' + bodyPretty + '\n';
      } else {
        try {
          output += logLevel + ' [' + time + '] "' + data.req.method.toUpperCase() + ' ' + data.req.originalUrl + '" ' + data.res.statusCode + ' ' + data.res.responseTime + '\n';
        } catch (e) {
          output += '[' + time + '] ' + logLevel;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.entries((0, _lodash.omit)(data, ['time', 'level', 'name', 'hostname', 'pid', 'v', 'msg']))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            if ((0, _lodash.isObject)(value) && value.message && value.stack) {
              var error = '\n';

              if (value.name) {
                error += colorize(_private.colorForLevel[data.level], 'NAME: ' + value.name) + '\n';
              }

              if (value.code) {
                error += colorize(_private.colorForLevel[data.level], 'CODE: ' + value.code) + '\n';
              }

              error += colorize(_private.colorForLevel[data.level], 'MESSAGE: ' + value.message) + '\n\n';

              if (value.level) {
                error += colorize('white', 'level:') + colorize('white', value.level) + '\n\n';
              }

              if (value.context) {
                error += colorize('white', value.context) + '\n';
              }

              if (value.help) {
                error += colorize('yellow', value.help) + '\n';
              }

              if (value.errorDetails) {
                error += _prettyjson2.default.render(value.errorDetails, {}) + '\n';
              }

              if (value.stack && !value.hideStack) {
                error += colorize('white', value.stack) + '\n';
              }

              output += colorize(_private.colorForLevel[data.level], error) + '\n';
            } else if ((0, _lodash.isObject)(value)) {
              bodyPretty += '\n' + colorize('yellow', key.toUpperCase()) + '\n';

              var sanitized = {};

              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = Object.entries(value)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var _step2$value = _slicedToArray(_step2.value, 2),
                      innerKey = _step2$value[0],
                      innerValue = _step2$value[1];

                  if (!(0, _lodash.isEmpty)(innerValue)) {
                    sanitized[innerKey] = innerValue;
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }

              bodyPretty += _prettyjson2.default.render(sanitized, {}) + '\n';
            } else {
              bodyPretty += _prettyjson2.default.render(value, {}) + '\n';
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (this.mode !== 'short') {
          output += colorize('grey', bodyPretty) + '\n';
        }
      }
      cb(null, output);
    }
  }]);

  return PrettyStream;
}(_stream.Transform);

exports.default = PrettyStream;