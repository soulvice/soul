'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utils = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       soul
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       the soul of your applications in one place.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _lodash = require('lodash');

var _unidecode = require('unidecode');

var _unidecode2 = _interopRequireDefault(_unidecode);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _findRoot = require('find-root');

var _findRoot2 = _interopRequireDefault(_findRoot);

var _caller = require('caller');

var _caller2 = _interopRequireDefault(_caller);

var _math = require('../math');

var _math2 = _interopRequireDefault(_math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, [{
    key: 'version',
    get: function get() {
      var parentPath = getParentPath(2);
      var pkg = require(parentPath + '/package.json');

      return {
        full: pkg.version,
        safe: pkg.version.match(/^(\d+\.)?(\d+)/)[0]
      };
    }
  }], [{
    key: 'uid',
    value: function uid(len) {
      var buf = [],
          chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
          charlen = chars.length,
          i;

      for (i = 0; i < len; i = i + 1) {
        buf.push(chars[_math2.default.randomRange(0, charlen - 1)]);
      }
      return buf.join('');
    }
  }, {
    key: 'safeString',
    value: function safeString(string, options) {
      options = options || {};

      // Handle the £ symbol separately, since it needs to be removed before the unicode conversion.
      string = string.replace(/£/g, '-');

      // Remove non ascii characters
      string = (0, _unidecode2.default)(string);

      // Replace URL reserved chars: `@:/?#[]!$&()*+,;=` as well as `\%<>|^~£"{}` and \`
      string = string.replace(/(\s|\.|@|:|\/|\?|#|\[|\]|!|\$|&|\(|\)|\*|\+|,|;|=|\\|%|<|>|\||\^|~|"|\{|\}|`|–|—)/g, '-')
      // Remove apostrophes
      .replace(/'/g, '')
      // Make the whole thing lowercase
      .toLowerCase();

      // We do not need to make the following changes when importing data
      if (!(0, _lodash.has)(options, 'importing') || !options.importing) {
        // Convert 2 or more dashes into a single dash
        string = string.replace(/-+/g, '-')
        // Remove trailing dash
        .replace(/-$/, '')
        // Remove any dashes at the beginning
        .replace(/^-/, '');
      }

      // Handle whitespace at the beginning or end.
      string = string.trim();

      return string;
    }
  }, {
    key: 'getParentPath',
    value: function getParentPath() {
      var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      try {
        return (0, _findRoot2.default)((0, _caller2.default)(depth));
      } catch (err) {
        return;
      }
    }
  }, {
    key: 'Debug',
    value: function Debug(name) {
      var parentPath = getParentPath(2);
      console.log('Debug for parentPath: ' + parentPath);

      var alias, pkg;

      try {
        pkg = require(parentPath + '/package.json');

        if (pkg.alias) {
          alias = pkg.alias;
        } else {
          alias = pkg.name;
        }
      } catch (err) {
        alias = 'undefined';
      }

      return (0, _debug2.default)(alias + ':' + name);
    }
  }, {
    key: 'normalizePort',
    value: function normalizePort(val) {
      var port = parseInt(val, 10);
      if (isNaN(port)) {
        // named pipe
        return val;
      }
      if (port >= 0) {
        // port number
        return port;
      }
      return false;
    }
  }]);

  return Utils;
}();

/*
  export
*/


exports.default = Utils;
exports.Utils = Utils;