/*
  soul

  the soul of your applications in one place.
*/

import ConfigurationManager from './lib/config'

import errors from './lib/errors'
import logger from './lib/logger'
import utils from './lib/utils'
import math from './lib/math'

let configSingleton;

const exportVals = {
  errors,
  logger,
  math,
  utils,
}

export {
  errors,
  logger,
  math,
  utils,
}

Object.defineProperty(exports, 'config', {
    enumerable: true,
    configurable: true,
    get: function get() {
        configSingleton = configSingleton || new ConfigurationManager();
        return configSingleton;
    }
});

Object.defineProperty(exportVals, 'config', {
    enumerable: true,
    configurable: true,
    get: function get() {
        configSingleton = configSingleton || new ConfigurationManager();
        return configSingleton;
    }
});


// export all features as 'default'
export default exportVals
