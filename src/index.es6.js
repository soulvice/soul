/*
  soul

  the soul of your applications in one place.
*/

import ConfigurationManager from './lib/config'

import errors from './lib/errors'
import logger from './lib/logger'
import utils from './lib/utils'
import math from './lib/math'
import events from './lib/events'

let configSingleton;

const exportVals = {
  errors,
  logger,
  math,
  utils,
  events,
}

export {
  errors,
  logger,
  math,
  utils,
  events,
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
