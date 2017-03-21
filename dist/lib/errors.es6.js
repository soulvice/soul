'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SoulError = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 soul
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 the soul of your applications in one place.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SoulError = exports.SoulError = function (_Error) {
  _inherits(SoulError, _Error);

  function SoulError(options) {
    _classCallCheck(this, SoulError);

    var _this = _possibleConstructorReturn(this, (SoulError.__proto__ || Object.getPrototypeOf(SoulError)).call(this, options));

    options = options || {};
    var self = _this;
    _this.name = _this.constructor.name;
    _this.isSoulError = true;

    if ((0, _lodash.isString)(options)) {
      throw new Error('Please instantiate Errors with the option pattern. e.g. new SoulError({message: ...})');
    }

    Error.call(_this);
    Error.captureStackTrace(_this, _this.constructor);

    /**
     * defaults
     */
    _this.statusCode = 500;
    _this.errorType = 'InternalServerError';
    _this.level = 'normal';
    _this.message = 'The server has encountered an error.';
    _this.id = _nodeUuid2.default.v1();

    /**
     * custom overrides
     */
    _this.id = options.id || _this.id;
    _this.statusCode = options.statusCode || _this.statusCode;
    _this.level = options.level || _this.level;
    _this.context = options.context || _this.context;
    _this.help = options.help || _this.help;
    _this.errorType = _this.name = options.errorType || _this.errorType;
    _this.errorDetails = options.errorDetails;
    _this.code = options.code || null;
    _this.property = options.property || null;
    _this.redirect = options.redirect || null;

    _this.message = options.message || _this.message;
    _this.hideStack = options.hideStack;

    // error to inherit from, override!
    // nested objects are getting copied over in one piece (can be changed, but not needed right now)
    if (options.err) {
      if ((0, _lodash.isString)(options.err)) {
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
    return _this;
  }

  _createClass(SoulError, null, [{
    key: 'isSoulError',
    value: function isSoulError(err) {
      return err.isSoulError ? true : false;
    }
  }]);

  return SoulError;
}(Error);

var _errorsTemplate = {

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
  WebhookRevocationError: {
    statusCode: 503,
    message: 'Webhook is no longer available.'
  }
};

/*
    Create Error Classes as extensions of 'SoulviceError'
*/
var errors = {};
Object.getOwnPropertyNames(_errorsTemplate).forEach(function (errorProp) {
  errors[errorProp] = function (_SoulError) {
    _inherits(_class, _SoulError);

    function _class(options) {
      _classCallCheck(this, _class);

      var _this2 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, options));

      var self = _this2;
      self.errorType = errorProp;
      self.superClass = 'SoulError';

      Object.getOwnPropertyNames(_errorsTemplate[errorProp]).forEach(function (item) {
        self[item] = _errorsTemplate[errorProp][item];
      });
      return _this2;
    }

    return _class;
  }(SoulError);
});

errors['SoulError'] = SoulError;

exports.default = errors;