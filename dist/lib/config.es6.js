'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       soul
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       the soul of your applications in one place.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Special Characters:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         - Paths
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           @ - root path(where package.json is located)(must be trailed by a slash)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           @<string> - specified path(must be trailed by a slash)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           #NOTE
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           - Path that is being referenced/used must be defined before call
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
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
var debug = _utils2.default.Debug('configuration');
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
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var _this = this;

        for (var _len = arguments.length, files = Array(_len), _key = 0; _key < _len; _key++) {
          files[_key] = arguments[_key];
        }

        var filteredFiles, results, parsedFileNames, fileParser, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, result, fileData;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                debug(':: being loading configuration file(s)');

                if (!(files.length < 1)) {
                  _context3.next = 4;
                  break;
                }

                debug(':: failed to specify file(s)');
                return _context3.abrupt('return', new _errors.SoulError({ message: 'specify at least one file to load' }));

              case 4:
                filteredFiles = [].concat(files, _toConsumableArray(ConfigurationManager.defaultLocations())).filter(function (file) {
                  return (0, _fs.existsSync)(file);
                }).filter(function (item) {
                  return (/\.[^/.]+$/.exec(item)[0] === '.json'
                  );
                });

                debug(':: filtered out invalid files');

                if (!(filteredFiles.length < 1)) {
                  _context3.next = 9;
                  break;
                }

                debug(':: failed to specify existing file(s)');
                return _context3.abrupt('return', new _errors.SoulError({ message: 'make sure specified file path(s) exists' }));

              case 9:

                // load files
                results = [];
                parsedFileNames = {
                  '@': _utils2.default.getParentPath()
                };

                fileParser = function () {
                  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(data) {
                    var regMatcher;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            // it key equals null then top level
                            // path replacer '@'
                            regMatcher = /([\@]{1})([a-zA-Z0-9\.\-\_]+)?(?:[\/]{1})/;
                            _context2.next = 3;
                            return Object.keys(data).forEach(function () {
                              var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(item) {
                                var foundMatch;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                  while (1) {
                                    switch (_context.prev = _context.next) {
                                      case 0:
                                        if (!_lodash2.default.isString(data[item])) {
                                          _context.next = 4;
                                          break;
                                        }

                                        if (regMatcher.test(data[item])) {
                                          foundMatch = regMatcher.exec(data[item]);

                                          // loop up replacement

                                          if (foundMatch[1] === '@') {
                                            // check existance of match
                                            if (foundMatch[2] !== undefined) {}
                                            // #TODO


                                            // replace match
                                            // if index '2' === undefined means its just '@' so place it with root path
                                            // else replace it with defined value
                                            if (parsedFileNames[foundMatch[2] ? foundMatch[2] : foundMatch[1]]) {
                                              data[item] = data[item].replace(regMatcher, parsedFileNames[foundMatch[2] ? foundMatch[2] : foundMatch[1]] + '/');
                                              if (!parsedFileNames[item]) {
                                                parsedFileNames[item] = data[item];
                                              }
                                            }
                                          }
                                        }
                                        _context.next = 8;
                                        break;

                                      case 4:
                                        if (!_lodash2.default.isObject(data[item])) {
                                          _context.next = 8;
                                          break;
                                        }

                                        _context.next = 7;
                                        return fileParser(data[item], item);

                                      case 7:
                                        data[item] = _context.sent;

                                      case 8:
                                      case 'end':
                                        return _context.stop();
                                    }
                                  }
                                }, _callee, _this);
                              }));

                              return function (_x2) {
                                return _ref3.apply(this, arguments);
                              };
                            }());

                          case 3:
                            return _context2.abrupt('return', data);

                          case 4:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this);
                  }));

                  return function fileParser(_x) {
                    return _ref2.apply(this, arguments);
                  };
                }();

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 15;
                _iterator = filteredFiles[Symbol.iterator]();

              case 17:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 43;
                  break;
                }

                file = _step.value;

                debug(':: begin load file ' + file);
                result = null;
                fileData = null;
                _context3.prev = 22;
                _context3.next = 25;
                return (0, _fs.readFileSync)(file, 'utf8');

              case 25:
                fileData = _context3.sent;
                _context3.next = 28;
                return JSON.parse(fileData);

              case 28:
                fileData = _context3.sent;
                _context3.next = 31;
                return fileParser(fileData);

              case 31:
                fileData = _context3.sent;
                _context3.next = 38;
                break;

              case 34:
                _context3.prev = 34;
                _context3.t0 = _context3['catch'](22);

                debug(':: error loading file ' + file + ' - ' + _context3.t0.message);
                result = new _errors.SoulError({ err: _context3.t0 });

              case 38:

                if (fileData && !result) {
                  this._store = _lodash2.default.extend(this._store, fileData);
                  debug(':: loaded file ' + file);
                }

                results.push({ file: file, result: result });

              case 40:
                _iteratorNormalCompletion = true;
                _context3.next = 17;
                break;

              case 43:
                _context3.next = 49;
                break;

              case 45:
                _context3.prev = 45;
                _context3.t1 = _context3['catch'](15);
                _didIteratorError = true;
                _iteratorError = _context3.t1;

              case 49:
                _context3.prev = 49;
                _context3.prev = 50;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 52:
                _context3.prev = 52;

                if (!_didIteratorError) {
                  _context3.next = 55;
                  break;
                }

                throw _iteratorError;

              case 55:
                return _context3.finish(52);

              case 56:
                return _context3.finish(49);

              case 57:
                return _context3.abrupt('return', results);

              case 58:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[15, 45, 49, 57], [22, 34], [50,, 52, 56]]);
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
  }, {
    key: 'makePathsAbsolute',
    value: function makePathsAbsolute(key) {}

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