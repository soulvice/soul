'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       soul
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       the soul of your applications in one place.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _errors = require('./errors');

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// internal
var debug = _utils2.default.Debug('configuration', 1);
var _private = {};

/*
  function
*/
_private.pathSplit = function (key, separator) {
  separator = separator || ':';
  return key == null ? [] : key.split(separator);
};

/*
  configuration manager

  NOTE:
    config.load(<filepath>[, <filepath>,...])
    config.get(<[nested]key>)
    config.set(<[nested]key>, <value>)
*/

var ConfigurationManager = function () {
  function ConfigurationManager() {
    _classCallCheck(this, ConfigurationManager);

    debug(':: creating configuration manager');

    this._store = {};
    this._mtimes = {};
  }

  /*
    load file(s)
     NOTE: files paths require '.json' extension in path
  */


  _createClass(ConfigurationManager, [{
    key: 'load',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        for (var _len = arguments.length, files = Array(_len), _key = 0; _key < _len; _key++) {
          files[_key] = arguments[_key];
        }

        var filteredFiles, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, result, fileData;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                debug(':: being loading configuration file(s)');

                if (!(files.length < 1)) {
                  _context.next = 4;
                  break;
                }

                debug(':: failed to specify file(s)');
                return _context.abrupt('return', new _errors.SoulError({ message: 'specify at least one file to load' }));

              case 4:
                filteredFiles = [].concat(files, _toConsumableArray(ConfigurationManager.defaultLocations())).filter(function (file) {
                  return (0, _fs.existsSync)(file);
                }).filter(function (item) {
                  return (/\.[^/.]+$/.exec(item)[0] === '.json'
                  );
                });

                debug(':: filtered out invalid files');

                if (!(filteredFiles.length < 1)) {
                  _context.next = 9;
                  break;
                }

                debug(':: failed to specify existing file(s)');
                return _context.abrupt('return', new _errors.SoulError({ message: 'make sure specified file path(s) exists' }));

              case 9:

                // load files
                results = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 13;
                _iterator = filteredFiles[Symbol.iterator]();

              case 15:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 35;
                  break;
                }

                file = _step.value;

                debug(':: begin load file ' + file);
                result = null;
                fileData = null;
                _context.prev = 20;
                _context.next = 23;
                return (0, _fs.readFileSync)(file, 'utf8');

              case 23:
                fileData = _context.sent;
                _context.next = 30;
                break;

              case 26:
                _context.prev = 26;
                _context.t0 = _context['catch'](20);

                debug(':: error loading file ' + file + ' - ' + _context.t0.message);
                result = new _errors.SoulError({ err: _context.t0 });

              case 30:

                if (fileData && !result) {
                  this._store = _lodash2.default.extend(this._store, JSON.parse(fileData));
                  debug(':: loaded file ' + file);
                }

                results.push({ file: file, result: result });

              case 32:
                _iteratorNormalCompletion = true;
                _context.next = 15;
                break;

              case 35:
                _context.next = 41;
                break;

              case 37:
                _context.prev = 37;
                _context.t1 = _context['catch'](13);
                _didIteratorError = true;
                _iteratorError = _context.t1;

              case 41:
                _context.prev = 41;
                _context.prev = 42;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 44:
                _context.prev = 44;

                if (!_didIteratorError) {
                  _context.next = 47;
                  break;
                }

                throw _iteratorError;

              case 47:
                return _context.finish(44);

              case 48:
                return _context.finish(41);

              case 49:
                return _context.abrupt('return', results);

              case 50:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[13, 37, 41, 49], [20, 26], [42,, 44, 48]]);
      }));

      function load() {
        return _ref.apply(this, arguments);
      }

      return load;
    }()

    /*
      setter & getter
       NOTE: setter - if value doesnt exist, it is created
      NOTE: getter - uses lodash object 'get' pth format
     */

  }, {
    key: 'set',
    value: function set(key, value) {
      var target = this._store;
      var path = _private.pathSplit(key, ':');

      if (path.length === 0) {
        //
        // Root must be an object
        //
        if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
          return false;
        } else {
          this.reset();
          this._store = value;
          return true;
        }
      }

      //
      // Update the `mtime` (modified time) of the key
      //
      this._mtimes[key] = Date.now();

      //
      // Scope into the object to get the appropriate nested context
      //
      while (path.length > 1) {
        key = path.shift();
        if (!target[key] || _typeof(target[key]) !== 'object') {
          target[key] = {};
        }

        target = target[key];
      }

      // Set the specified value in the nested JSON structure
      key = path.shift();
      target[key] = value;
      return true;
    }
  }, {
    key: 'get',
    value: function get(key) {
      var target = this._store;
      var path = _private.pathSplit(key, ':');

      //
      // Scope into the object to get the appropriate nested context
      //
      while (path.length > 0) {
        key = path.shift();
        if (target && target.hasOwnProperty(key)) {
          target = target[key];
          continue;
        }
        return undefined;
      }

      return target;
    }

    /*
      reset
    */

  }, {
    key: 'reset',
    value: function reset() {
      this._mtimes = {};
      this._store = {};
      return true;
    }

    /*
      clear
    */

  }, {
    key: 'clear',
    value: function clear(key) {
      var target = this._store;
      var value = target;
      var path = _private.pathSplit(key, this.logicalSeparator);

      //
      // Remove the key from the set of `mtimes` (modified times)
      //
      delete this._mtimes[key];

      //
      // Scope into the object to get the appropriate nested context
      //
      for (var i = 0; i < path.length - 1; i++) {
        key = path[i];
        value = target[key];
        if (typeof value !== 'function' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
          return false;
        }
        target = value;
      }

      // Delete the key from the nested JSON structure
      key = path[i];
      delete target[key];
      return true;
    }

    /*
      static functions
    */

  }], [{
    key: 'defaultLocations',
    value: function defaultLocations() {
      return [(0, _path.join)(_utils2.default.getParentPath(), '/config.json')];
    }
  }]);

  return ConfigurationManager;
}();

exports.default = ConfigurationManager;