/*
  Soul v2

  @author: Soulvice
  @date: 10-07-2017

*/

// config
import config from './lib/config'
// utils
import utils from './lib/utils'
// errors
import errors from './lib/errors'
// math
import math from './lib/math'
// server
import server from './lib/server'
// crypto
import crypto from './lib/crypto'

const debug = require('debug')('soul');

const internal = {};
const exporter = {
  //config: config,
  utils: utils,
  errors: errors,
  math: math,
  server: server,
  crypto: crypto,
};

debug(`:: add config to export list`)
Object.defineProperty(exporter, 'config', {
  get: function get() {
    internal.configSingleton = internal.configSingleton || new config();
    return internal.configSingleton;
  }
});

/*
  dirty non-es6 hack
*/
Object.getOwnPropertyNames(exporter).forEach(x => {
  debug(`:: exporting ${x}`)
  Object.defineProperty(exports, x, {
    value: exporter[x]
  });
});

debug(`:: exporting default`)
export default exporter
