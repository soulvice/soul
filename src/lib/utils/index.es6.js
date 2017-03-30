/*
  soul

  the soul of your applications in one place.
*/

import { has as _has } from 'lodash'
import unidecode from 'unidecode'
import _Debug from 'debug'
import findRoot from 'find-root'
import caller from 'caller'
import math from '../math'

class Utils {
  static uid(len) {
    var buf = [],
       chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
       charlen = chars.length,
       i;

    for (i = 0; i < len; i = i + 1) {
     buf.push(chars[math.randomRange(0, charlen - 1)]);
    }
    return buf.join('');
  }

  static safeString(string, options) {
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

  static getParentPath(depth=1) {
    try {
      return findRoot(caller(depth));
    } catch(err) {
      return;
    }
  }

  static Debug(name) {
    var parentPath = getParentPath(2);
    console.log(`Debug for parentPath: ${parentPath}`);

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
    const parentPath = getParentPath(2);
    const pkg = require(parentPath + '/package.json');

    return {
      full: pkg.version,
      safe: pkg.version.match(/^(\d+\.)?(\d+)/)[0]
    }
  }

  static normalizePort(val) {
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
}

/*
  export
*/
export default Utils

export {
  Utils
}
