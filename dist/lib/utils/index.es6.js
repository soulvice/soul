'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _math = require('../math');

var _math2 = _interopRequireDefault(_math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);

    this.ONE_HOUR_S = 3600;
    this.ONE_DAY_S = 86400;
    this.ONE_MONTH_S = 2628000;
    this.SIX_MONTH_S = 15768000;
    this.ONE_YEAR_S = 31536000;
    this.FIVE_MINUTES_MS = 300000;
    this.ONE_HOUR_MS = 3600000;
    this.ONE_DAY_MS = 86400000;
    this.ONE_WEEK_MS = 604800000;
    this.ONE_MONTH_MS = 2628000000;
    this.SIX_MONTH_MS = 15768000000;
    this.ONE_YEAR_MS = 31536000000;
  }

  /*
    constants
  */


  _createClass(Utils, [{
    key: 'uid',


    /*
      generating values
    */
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

      // need to check of module

      // the world isnt read for recusrive root finding.....one day
      /*let recursive = (path) => {
        let root = findRoot(calledBy);
        // make this recursive
        if (root === findRoot()) {
          root = recursive(path.resolve(root,'../'));
        }
         return root;
      }*/

      try {
        var calledBy = (0, _caller2.default)(depth);

        var root = (0, _findRoot2.default)(calledBy);
        // make this recursive
        if (root === (0, _findRoot2.default)()) {
          root = (0, _findRoot2.default)(_path2.default.resolve(root, '../'));
        }

        return root;
      } catch (err) {
        return;
      }
    }
  }, {
    key: 'Debug',
    value: function Debug(name) {
      var parentPath = this.getParentPath(2);

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

    /*
      compress folder
    */

  }, {
    key: 'zipFolder',
    value: function zipFolder(folderToZip, destination, callback) {
      var archiver = require('archiver'),
          output = fs.createWriteStream(destination),
          archive = archiver.create('zip', {});

      output.on('close', function () {
        callback(null, archive.pointer());
      });

      archive.on('error', function (err) {
        callback(err, null);
      });

      archive.directory(folderToZip, '/');
      archive.pipe(output);
      archive.finalize();
    }

    /*
      Base64
    */

  }, {
    key: 'encodeBase64URLsafe',
    value: function encodeBase64URLsafe(base64String) {
      return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    // Decode url safe base64 encoding and add padding ('=')

  }, {
    key: 'decodeBase64URLsafe',
    value: function decodeBase64URLsafe(base64String) {
      base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
      while (base64String.length % 4) {
        base64String += '=';
      }
      return base64String;
    }
  }, {
    key: 'shuffleArray',
    value: function shuffleArray(array) {
      var self = this;
      var newArray = [];
      var blacklist = [];

      oldArray.forEach(function (item) {
        var pos = self.randomRange(0, array.length);
        // insert item at position 'pos' from 'array' to 'newArray'
        // add 'pos' to 'blacklist'
        // if exists in 'blacklist' repeat until not-exists
      });
    }
  }, {
    key: 'generateAssetHash',
    get: function get() {
      return _crypto2.default.createHash('md5').update(this.version.full + Date.now()).digest('hex').substring(0, 10);
    }
  }, {
    key: 'version',
    get: function get() {
      var parentPath = this.getParentPath(2);
      var pkg = require(parentPath + '/package.json');

      return {
        full: pkg.version,
        safe: pkg.version.match(/^(\d+\.)?(\d+)/)[0]
      };
    }
  }]);

  return Utils;
}();

/*
  export
*/


var singleton = null;
singleton = singleton || new Utils();
exports.default = singleton;