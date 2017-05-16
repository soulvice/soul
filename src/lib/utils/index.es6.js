/*
  soul

  the soul of your applications in one place.
*/

import { has as _has } from 'lodash'
import unidecode from 'unidecode'
import _Debug from 'debug'
import findRoot from 'find-root'
import caller from 'caller'
import crypto from 'crypto'
import { createWriteStream } from 'fs'

import math from '../math'

class Utils {

  /*
    constants
  */
  ONE_HOUR_S =          3600;
  ONE_DAY_S =          86400;
  ONE_MONTH_S =      2628000;
  SIX_MONTH_S =     15768000;
  ONE_YEAR_S =      31536000;
  FIVE_MINUTES_MS =   300000;
  ONE_HOUR_MS =      3600000;
  ONE_DAY_MS =      86400000;
  ONE_WEEK_MS =    604800000;
  ONE_MONTH_MS =  2628000000;
  SIX_MONTH_MS = 15768000000;
  ONE_YEAR_MS =  31536000000;

  /*
    generating values
  */
  uid(len) {
    var buf = [],
       chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
       charlen = chars.length,
       i;

    for (i = 0; i < len; i = i + 1) {
     buf.push(chars[math.randomRange(0, charlen - 1)]);
    }
    return buf.join('');
  }

  get generateAssetHash() {
    return (crypto.createHash('md5').update(this.version.full + Date.now()).digest('hex')).substring(0, 10);
  }

  safeString(string, options) {
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

  getParentPath(depth=1) {
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
      let calledBy = caller(depth);

      let root = findRoot(calledBy);
      // make this recursive
      if (root === findRoot()) {
        root = findRoot(path.resolve(root,'../'));
      }

      return root;
    } catch(err) {
      return;
    }
  }

  Debug(name) {
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

    return _Debug(alias + ':' + name);
  }

  get version() {
    const parentPath = this.getParentPath(2);
    const pkg = require(parentPath + '/package.json');

    return {
      full: pkg.version,
      safe: pkg.version.match(/^(\d+\.)?(\d+)/)[0]
    }
  }

  normalizePort(val) {
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
  zipFolder(folderToZip, destination, callback) {
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
    Base64
  */
  encodeBase64URLsafe(base64String) {
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Decode url safe base64 encoding and add padding ('=')
  decodeBase64URLsafe(base64String) {
    base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
    while (base64String.length % 4) {
      base64String += '=';
    }
    return base64String;
  }

  shuffleArray(array) {
    let self = this;
    let newArray = [];
    let blacklist = [];

    oldArray.forEach(item => {
      let pos = self.randomRange(0,array.length);
      // insert item at position 'pos' from 'array' to 'newArray'
      // add 'pos' to 'blacklist'
      // if exists in 'blacklist' repeat until not-exists
    });
  }
}

/*
  export
*/
var singleton = null;
singleton = singleton || new Utils();
export default singleton;
