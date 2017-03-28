'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizePort = exports.version = exports.Debug = exports.getParentPath = exports.safeString = exports.uid = undefined;

var _lodash = require('lodash');

var _unidecode = require('unidecode');

var _unidecode2 = _interopRequireDefault(_unidecode);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _findRoot = require('find-root');

var _findRoot2 = _interopRequireDefault(_findRoot);

var _caller = require('caller');

var _caller2 = _interopRequireDefault(_caller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} /*
    soul
  
    the soul of your applications in one place.
  */

;

function uid(len) {
  var buf = [],
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      charlen = chars.length,
      i;

  for (i = 0; i < len; i = i + 1) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }
  return buf.join('');
}

function safeString(string, options) {
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

function getParentPath() {
  var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  try {
    return (0, _findRoot2.default)((0, _caller2.default)(depth));
  } catch (err) {
    return;
  }
}

function Debug(name) {
  var parentPath = getParentPath();
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

function version() {
  var parentPath = getParentPath();
  var pkg = require(parentPath + '/package.json');

  return {
    full: pkg.version,
    safe: pkg.version.match(/^(\d+\.)?(\d+)/)[0]
  };
}

function normalizePort(val) {
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
  export
*/
exports.default = {
  uid: uid,
  safeString: safeString,
  getParentPath: getParentPath,
  Debug: Debug,
  version: version,
  normalizePort: normalizePort
};
exports.uid = uid;
exports.safeString = safeString;
exports.getParentPath = getParentPath;
exports.Debug = Debug;
exports.version = version;
exports.normalizePort = normalizePort;