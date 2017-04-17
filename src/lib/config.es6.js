/*
  soul

  the soul of your applications in one place.
*/


import _ from 'lodash'
import path, { join as pathJoin } from 'path'
import { existsSync, readFileSync } from 'fs'

import { SoulError } from './errors'
import utils from './utils'

// internal
//const debug = utils.Debug('configuration',1);
const debug = () => {};
const _private = {};

/*
  function
*/
_private.pathSplit = function (key, separator) {
  separator = separator || ':';
  return key == null ? [] : key.split(separator);
}


/*
  configuration manager

  NOTE:
    config.load(<filepath>[, <filepath>,...])
    config.get(<[nested]key>)
    config.set(<[nested]key>, <value>)
*/
export default class ConfigurationManager {
  constructor() {
    debug(`:: creating configuration manager`);

    this._store = {};
    this._mtimes = {};
  }

  /*
    load file(s)

    NOTE: files paths require '.json' extension in path
  */
  async load(...files) {
    debug(`:: being loading configuration file(s)`);
    if (files.length < 1) {
      debug(`:: failed to specify file(s)`);
      return new SoulError({ message: 'specify at least one file to load' });
    }

    let filteredFiles = [ ...files, ...ConfigurationManager.defaultLocations() ]
      .filter(file => existsSync(file))
      .filter(item => /\.[^/.]+$/.exec(item)[0] === '.json');
    debug(`:: filtered out invalid files`);

    if (filteredFiles.length < 1) {
      debug(`:: failed to specify existing file(s)`);
      return new SoulError({ message: 'make sure specified file path(s) exists' });
    }

    // load files
    let results = [];

    for (let file of filteredFiles) {
      debug(`:: begin load file ${file}`);
      let result = null;
      let fileData = null;

      try {
        fileData = await readFileSync(file, 'utf8');
      }catch(e) {
        debug(`:: error loading file ${file} - ${e.message}`);
        result = new SoulError({ err: e });
      }

      if (fileData && !result) {
        this._store = _.extend(this._store, JSON.parse(fileData));
        debug(`:: loaded file ${file}`);
      }

      results.push({ file: file, result: result });
    }

    return results;
  }

  /*
    setter & getter

    NOTE: setter - if value doesnt exist, it is created
    NOTE: getter - uses lodash object 'get' pth format
   */
  set(key, value) {
    let target = this._store;
    let path = _private.pathSplit(key, ':');

    if (path.length === 0) {
      //
      // Root must be an object
      //
      if (!value || typeof value !== 'object') {
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
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }

      target = target[key];
    }

    // Set the specified value in the nested JSON structure
    key = path.shift();
    target[key] = value;
    return true;
  }

  get(key) {
    let target = this._store;
    let path = _private.pathSplit(key, ':');

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
  reset() {
    this._mtimes = {};
    this._store  = {};
    return true;
  }

  /*
    clear
  */
  clear(key) {
    let target = this._store;
    let value = target;
    let path = _private.pathSplit(key, this.logicalSeparator);

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
      if (typeof value !== 'function' && typeof value !== 'object') {
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
  static defaultLocations() {
    return [ pathJoin(utils.getParentPath(), '/config.json') ]
  }
}
