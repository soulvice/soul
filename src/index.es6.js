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

const internal = {};
const exporter = {
  //config: config,
  utils: utils,
  errors: errors,
  math: math,
  server: server,
  crypto: crypto,
};

Object.defineProperty(exporter, 'config', {
  get: function get() {
    internal.configSingleton = internal.configSingleton || new config();
    return internal.configSingleton;
  }
});

/*
  dirty non-es6 hack
*/
Object.keys(exporter).forEach(x => {
  Object.defineProperty(exports, x, {
    get: function () {
      return exporter[x];
    }
  });
});

export default exporter
