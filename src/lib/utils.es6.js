/*
  Soul v2

  @author: Soulvice
  @date: 10-07-2017

*/

import { has as _has } from 'lodash'
import unidecode from 'unidecode'
import _Debug from 'debug'
import findRoot from 'find-root'
import caller from 'caller'
import crypto from 'crypto'
import { createWriteStream } from 'fs'
import path from 'path'

import math from './math'


const external = {};

external.TIMES = {
  ONE_HOUR_S:          3600,
  ONE_DAY_S:          86400,
  ONE_MONTH_S:      2628000,
  SIX_MONTH_S:     15768000,
  ONE_YEAR_S:      31536000,
  FIVE_MINUTES_MS:   300000,
  ONE_HOUR_MS:      3600000,
  ONE_DAY_MS:      86400000,
  ONE_WEEK_MS:    604800000,
  ONE_MONTH_MS:  2628000000,
  SIX_MONTH_MS: 15768000000,
  ONE_YEAR_MS:  31536000000,
}


external.uid = (len) => {
  var buf = [],
     chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
     charlen = chars.length,
     i;

  for (i = 0; i < len; i = i + 1) {
   buf.push(chars[math.randomRange(0, charlen - 1)]);
  }
  return buf.join('');
}

//external.generateAssetHash = () {
//  return (crypto.createHash('md5').update(this.version.full + Date.now()).digest('hex')).substring(0, 10);
//}
Object.defineProperty(external, 'generateAssetHash', {
  get: function get() {
    return (crypto.createHash('md5').update(external.VERSION.full + Date.now()).digest('hex')).substring(0, 10);
  }
})

external.safeString = (string, options) => {
  options = options || {};

  // Handle the £ symbol separately, since it needs to be removed before the unicode conversion.
  string = string.replace(/£/g, '-');

  // Remove non ascii characters
  string = unidecode(string);

  // Replace URL reserved chars: `@:/?#[]!$&()*+,;=` as well as `\%<>|^~£"{}` and \`
  string = string.replace(/(\s|\.|@|:|\/|\?|#|\[|\]|!|\$|&|\(|\)|\*|\+|,|;|=|\\|%|<|>|\||\^|~|"|\{|\}|`|–|—)/g, '-')
    // Remove apostrophes
    .replace(/'/g, '')
    // Make the whole thing lowercase
    .toLowerCase();

  // We do not need to make the following changes when importing data
  if (!_has(options, 'importing') || !options.importing) {
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

external.getParentPath = (depth=1) => {
  try {
    let calledBy = caller(depth);
    let root = findRoot(calledBy);
    // Check if root contains node_modules

    // make this recursive
    if (root === findRoot() && (/\/node_modules/.test(root))) {
      root = findRoot(path.resolve(root,'../'));
    }

    return root;
  } catch(err) {
    return;
  }
}

external.Debug = (name) => {
  var parentPath = external.getParentPath(2);

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

  return _Debug(alias + ':' + name);
}

//export const VERSION = (() => {
//  const parentPath = this.getParentPath(2);
//  const pkg = require(parentPath + '/package.json');
//
//  return {
//    full: pkg.version,
//    safe: pkg.version.match(/^(\d+\.)?(\d+)/)[0]
//  }
//})();
Object.defineProperty(external, 'VERSION', {
  get: function get() {

    const parentPath = external.getParentPath(2);
    const pkg = require(parentPath + '/package.json');
    return {
      full: pkg.version,
      safe: pkg.version.match(/^(\d+\.)?(\d+)/)[0]
    }
  }
})

external.normalizePort = (val) => {
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

external.zipFolder = (folderToZip, destination, callback) => {
  let archiver = require('archiver'),
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
  BASE64 URL SAFE
*/
external.base64 = {};
external.base64.encodeURLSafe = external.encodeBase64URLsafe = (base64String) => {
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

external.base64.decodeURLSafe = external.decodeBase64URLsafe = (base64String) => {
  base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
  while (base64String.length % 4) {
    base64String += '=';
  }
  return base64String;
}

/*
  ARRAY
*/
external.array = {};
external.array.shuffle = external.shuffleArray = (array) => {
  let self = this;
  let newArray = [];
  let blacklist = [];

  oldArray.forEach(item => {
    let pos = math.randomRange(0,array.length);
    // insert item at position 'pos' from 'array' to 'newArray'
    // add 'pos' to 'blacklist'
    // if exists in 'blacklist' repeat until not-exists
  });
}

external.array.flatten = external.flattenArray = (arr) => {
  return arr.reduce(
    (a, b) => a.concat(Array.isArray(b) ? external.flattenArray(b) : b), []
  );
}

/*
  dirty non-ES6-hack for
  export <item>
*/
Object.keys(external).forEach(e => {
  Object.defineProperty(exports, e, {
    value: external[e]
  });
});

/*
  export everything
*/
export default external
