/*
  soul

  the soul of your applications in one place.
*/


import { isString } from 'lodash';
import uuid from 'uuid';

export class SoulError extends Error {
  constructor(options) {
    super(options);

    options = options || {};
    var self = this;
    this.name = this.constructor.name;
    this.isSoulError = true;

    if (isString(options)) {
      throw new Error('Please instantiate Errors with the option pattern. e.g. new SoulError({message: ...})');
    }

    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    /**
     * defaults
     */
     this.statusCode = 500;
     this.errorType = 'InternalServerError';
     this.level = 'normal';
     this.message = 'The server has encountered an error.';
     this.id = uuid.v1();

    /**
     * custom overrides
     */
     this.id = options.id || this.id;
     this.statusCode = options.statusCode || this.statusCode;
     this.level = options.level || this.level;
     this.context = options.context || this.context;
     this.help = options.help || this.help;
     this.errorType = this.name = options.errorType || this.errorType;
     this.errorDetails = options.errorDetails;
     this.code = options.code || null;
     this.property = options.property || null;
     this.redirect = options.redirect || null;

     this.message = options.message || this.message;
     this.hideStack = options.hideStack;

    // error to inherit from, override!
    // nested objects are getting copied over in one piece (can be changed, but not needed right now)
    if (options.err) {
        if (isString(options.err)) {
            options.err = new Error(options.err);
        }

        Object.getOwnPropertyNames(options.err).forEach(function (property) {
            if (['errorType', 'name', 'statusCode', 'message', 'level'].indexOf(property) !== -1) {
                return;
            }

            if (property === 'stack') {
                self[property] += '\n\n' + options.err[property];
                return;
            }

            self[property] = options.err[property] || self[property];
        });
    }
  }

  static isSoulError(err) {
    return err.isSoulError ? true : false;
  }
}

let _errorsTemplate = {

  /* 4xx Errors */
  IncorrectUsageError: {
    statusCode: 400,
    level: 'critical',
    message: 'We detected a misuse. Please read the stack trace.'
  },
  BadRequestError: {
    statusCode: 400,
    message: 'The request could not be understood.'
  },
  VersionMismatchError: {
    statuscode: 400,
    message: 'Requested version does not match server version.'
  },
  UnauthorizedError: {
    statusCode: 401,
    message: 'You are not authorised to make this request.'
  },
  NoPermissionError: {
    statusCode: 403,
    message: 'You do not have permission to perform this request.'
  },
  NotFoundError: {
    statusCode: 404,
    message: 'Resource could not be found.'
  },
  MethodNotAllowedError: {
    statusCode: 405,
    message: 'Method not allowed for resource.'
  },
  RequestEntityToLargeError: {
    statusCode: 413,
    message: 'Request was to big for the server to handle.'
  },
  UnsupportedMediaTypeError: {
    statusCode: 415,
    message: 'The media is the request is not supported by the server.'
  },
  TeapotError: {
    statusCode: 418,
    message: 'I\'m a little teapot short and stout.'
  },
  ValidationError: {
    statusCode: 422,
    message: 'The request failed validation.'
  },
  TooManyRequestsError: {
    statusCode: 429,
    message: 'Server has received too many similar request in a short space of time.'
  },

  /* 5xx Errors */
  InternalServerError: {
    statusCode: 500,
    level: 'critical',
    message: 'The server has encoutered an error.'
  },
  NotImplementedError: {
    statusCode: 501,
    message: 'Requested method is not implemented.'
  },
  MaintenanceError: {
    statusCode: 503,
    message: 'The server is temporarily dow n for maintenance.'
  },
}


/*
    Create Error Classes as extensions of 'SoulviceError'
*/
var errors = {};
// add the 'SoulError' for exportation reasons
errors['SoulError'] = SoulError;

Object.getOwnPropertyNames(_errorsTemplate).forEach((errorProp) => {
  errors[errorProp] = (class extends SoulError {
    constructor(options) {
      super(options);

      var self = this;
      self.errorType = errorProp;
      self.superClass = 'SoulError';

      Object.getOwnPropertyNames(_errorsTemplate[errorProp]).forEach((item) => {
        self[item] = _errorsTemplate[errorProp][item];
      });
    }
  });
});


export default errors;
