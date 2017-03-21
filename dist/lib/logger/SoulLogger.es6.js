'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       soul
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       the soul of your applications in one place.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _lodash = require('lodash');

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _PrettyStream = require('./PrettyStream');

var _PrettyStream2 = _interopRequireDefault(_PrettyStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SoulLogger = function () {
  function SoulLogger() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SoulLogger);

    var self = this;

    self.env = opts.env || 'development';
    self.domain = opts.domain || 'localhost';
    self.transports = opts.transports || ['stdout'];
    self.level = process.env.LEVEL || opts.level || 'info';
    self.mode = process.env.MODE || opts.mode || 'short';
    self.path = opts.path || process.cwd();
    self.loggly = opts.loggly || {};

    if (process.env.LOIN) {
      self.level = 'info';
      self.mode = 'long';
    }

    if (!self.path.match(/\/$|\\$/)) {
      self.path = this.path + '/';
    }

    self.rotation = opts.rotation || {
      enabled: false,
      period: '1w',
      count: 100
    };

    self.streams = {};

    self.setSerializers();

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = self.transports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var transport = _step.value;

        self['set' + transport.slice(0, 1).toUpperCase() + transport.slice(1) + 'Stream']();
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
  }

  _createClass(SoulLogger, [{
    key: 'setStdoutStream',
    value: function setStdoutStream() {
      var prettyStdOut = new _PrettyStream2.default({
        mode: this.mode
      });

      prettyStdOut.pipe(process.stdout);

      this.streams.stdout = {
        name: 'stdout',
        log: _bunyan2.default.createLogger({
          name: 'Log',
          streams: [{
            type: 'raw',
            stream: prettyStdOut,
            level: this.level
          }],
          serializers: this.serializers
        })
      };
    }
  }, {
    key: 'setLogglyStream',
    value: function setLogglyStream() {
      var Bunyan2Loggly = require('bunyan-loggly');

      var logglyStream = new Bunyan2Loggly({
        token: this.loggly.token,
        subdomain: this.loggly.subdomain,
        tags: this.loggly.tags
      });

      this.streams.loggly = {
        name: 'loggly',
        match: this.loggly.match,
        log: _bunyan2.default.createLogger({
          name: 'Log',
          streams: [{
            type: 'raw',
            stream: logglyStream,
            level: 'error'
          }],
          serializers: this.serializers
        })
      };
    }

    /*
      by default we log into two files
      1. file-errors: all errors only
      2. file-all: everything
    */

  }, {
    key: 'setFileStream',
    value: function setFileStream() {
      var sanitizedDomain = this.domain.replace(/[^\w]/gi, '_');

      this.streams['file-errors'] = {
        name: 'file',
        log: _bunyan2.default.createLogger({
          name: 'log',
          streams: [{
            path: this.path + sanitizedDomain + '_' + this.env + '.error.log',
            level: 'error'
          }],
          serializers: this.serializers
        })
      };

      this.streams['file-all'] = {
        name: 'file',
        log: _bunyan2.default.createLogger({
          name: 'log',
          streams: [{
            path: this.path + sanitizedDomain + '_' + this.env + '.log',
            level: 'error'
          }],
          serializers: this.serializers
        })
      };

      if (this.rotation.enabled) {
        this.streams['rotation-errors'] = {
          name: 'rotation-errors',
          log: _bunyan2.default.createLogger({
            name: 'Log',
            streams: [{
              type: 'rotation-file',
              path: this.path + sanitizedDomain + '_' + this.env + '.error.log',
              period: this.rotation.period,
              count: this.rotation.count,
              level: 'error'
            }],
            serializers: this.serializers
          })
        };

        this.streams['rotation-all'] = {
          name: 'rotation-all',
          log: _bunyan2.default.createLogger({
            name: 'Log',
            streams: [{
              type: 'rotation-file',
              path: this.path + sanitizedDomain + '_' + this.env + '.log',
              period: this.rotation.period,
              count: this.rotation.count,
              level: 'error'
            }],
            serializers: this.serializers
          })
        };
      }
    }
  }, {
    key: 'setSerializers',
    value: function setSerializers() {
      var self = this;

      self.serializers = {
        req: function req(_req) {
          return {
            meta: {
              requestId: _req.requestId,
              userId: _req.userId
            },
            url: _req.url,
            method: _req.method,
            originalUrl: _req.originalUrl,
            params: _req.params,
            headers: self.removeSensitiveData(_req.headers),
            body: self.removeSensitiveData(_req.body),
            query: self.removeSensitiveData(_req.query)
          };
        },
        res: function res(_res) {
          return {
            _headers: self.removeSensitiveData(_res._headers),
            statusCode: _res.statusCode,
            responseTime: _res.responseTime
          };
        },
        err: function err(_err) {
          return {
            id: _err.id,
            domain: self.domain,
            code: _err.code,
            name: _err.errorType,
            statusCode: _err.statusCode,
            level: _err.level,
            message: _err.message,
            context: _err.context,
            help: _err.help,
            stack: _err.stack,
            hideStack: _err.hideStack
          };
        }
      };
    }
  }, {
    key: 'removeSensitiveData',
    value: function removeSensitiveData(obj) {
      var newObj = {};

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.entries(obj)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              key = _step2$value[0],
              value = _step2$value[1];

          try {
            if ((0, _lodash.isObject)(value)) {
              value = self.removeSensitiveData(value);
            }

            if (!key.match(/pin|password|authorization|cookie/gi)) {
              newObj[key] = value;
            }
          } catch (e) {
            newObj[key] = value;
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

      return newObj;
    }
  }, {
    key: 'log',
    value: function log(type) {
      var self = this;
      var modifiedArgs = void 0;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = args[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var arg = _step3.value;

          if (arg instanceof Error) {
            modifiedArgs = modifiedArgs || {};
            modifiedArgs.err = arg;
          } else if ((0, _lodash.isObject)(arg)) {
            modifiedArgs = modifiedArgs || {};
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = Object.keys(arg)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var key = _step5.value;

                modifiedArgs[key] = arg[key];
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }
          } else {
            modifiedArgs = modifiedArgs || '';
            modifiedArgs += arg + ' ';
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = Object.entries(self.streams)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _step4$value = _slicedToArray(_step4.value, 2),
              name = _step4$value[0],
              logger = _step4$value[1];

          if (logger.match) {
            if (new RegExp(logger.match).test((0, _jsonStringifySafe2.default)(modifiedArgs).replace(/"/g, ''))) {
              logger.log[type](modifiedArgs);
            }
          } else {
            logger.log[type](modifiedArgs);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }, {
    key: 'info',
    value: function info() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.log.apply(this, 'info', args);
    }
  }, {
    key: 'warn',
    value: function warn() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this.log.apply(this, 'warn', args);
    }
  }, {
    key: 'error',
    value: function error() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      this.log.apply(this, 'error', args);
    }
  }]);

  return SoulLogger;
}();

exports.default = SoulLogger;