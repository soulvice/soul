/*
  soul

  the soul of your applications in one place.
*/

import config from './lib/config'
import errors from './lib/errors'
import logger from './lib/logger'

const exportVals = {
  config,
  errors,
  logger,
}

export default exportVals
export {
  config,
  errors,
  logger,
}
