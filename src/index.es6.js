/*
  soul

  the soul of your applications in one place.
*/

import config from './lib/config'
import errors from './lib/errors'
import logger from './lib/logger'
import utils from './lib/utils'
import math from './lib/math'

const exportVals = {
  config,
  errors,
  logger,
  utils,
  math,
}

export default exportVals
export {
  config,
  errors,
  logger,
  utils,
  math,
}
