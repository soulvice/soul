/*
  soul

  the soul of your applications in one place.
*/

import bunyan from 'bunyan'
import { isObject } from 'lodash'
import jsonStringifySafe from 'json-stringify-safe'
import PrettyStream from './PrettyStream'

export default class SoulLogger {
  constructor(opts={}) {
    const self = this;

    self.env = opts.env || 'development';
    self.domain = opts.domain || 'localhost';
    self.transports = opts.transports || [ 'stdout' ];
    self.level = process.env.LEVEL || opts.level || 'info';
    self.mode = process.env.MODE || opts.mode || 'short';
    self.path = opts.path || process.cwd();
    self.loggly = opts.loggly || {};

    if (process.env.LOIN) {
      self.level = 'info';
      self.mode = 'long';
    }

    if (!self.path.match(/\/$|\\$/)) {
      self.path = this.path+'/';
    }

    self.rotation = opts.rotation || {
      enabled: false,
      period: '1w',
      count: 100,
    };

    self.streams = {};

    self.setSerializers();

    for (let transport of self.transports) {
      self[`set${transport.slice(0,1).toUpperCase()}${transport.slice(1)}Stream`]();
    }
  }

  setStdoutStream() {
    const prettyStdOut = new PrettyStream({
      mode: this.mode
    });

    prettyStdOut.pipe(process.stdout);

    this.streams.stdout = {
      name: 'stdout',
      log: bunyan.createLogger({
        name: 'Log',
        streams: [{
          type: 'raw',
          stream: prettyStdOut,
          level: this.level
        }],
        serializers: this.serializers
      })
    };
  }

  setLogglyStream() {
    const Bunyan2Loggly = require('bunyan-loggly');

    const logglyStream = new Bunyan2Loggly({
      token: this.loggly.token,
      subdomain: this.loggly.subdomain,
      tags: this.loggly.tags
    });

    this.streams.loggly = {
      name: 'loggly',
      match: this.loggly.match,
      log: bunyan.createLogger({
        name: 'Log',
        streams: [{
          type: 'raw',
          stream: logglyStream,
          level: 'error'
        }],
        serializers: this.serializers
      })
    };
  }

  /*
    by default we log into two files
    1. file-errors: all errors only
    2. file-all: everything
  */
  setFileStream() {
    let sanitizedDomain = this.domain.replace(/[^\w]/gi,'_');

    this.streams['file-errors'] = {
      name: 'file',
      log: bunyan.createLogger({
        name: 'log',
        streams: [{
          path: this.path + sanitizedDomain + '_' + this.env + '.error.log',
          level: 'error',
        }],
        serializers: this.serializers
      })
    };

    this.streams['file-all'] = {
      name: 'file',
      log: bunyan.createLogger({
        name: 'log',
        streams: [{
          path: this.path + sanitizedDomain + '_' + this.env + '.log',
          level: 'error',
        }],
        serializers: this.serializers
      })
    };

    if (this.rotation.enabled) {
      this.streams['rotation-errors'] = {
        name: 'rotation-errors',
        log: bunyan.createLogger({
          name: 'Log',
          streams: [{
            type: 'rotation-file',
            path: this.path + sanitizedDomain + '_' + this.env + '.error.log',
            period: this.rotation.period,
            count: this.rotation.count,
            level: 'error'
          }],
          serializers: this.serializers
        })
      };

      this.streams['rotation-all'] = {
        name: 'rotation-all',
        log: bunyan.createLogger({
          name: 'Log',
          streams: [{
            type: 'rotation-file',
            path: this.path + sanitizedDomain + '_' + this.env + '.log',
            period: this.rotation.period,
            count: this.rotation.count,
            level: 'error'
          }],
          serializers: this.serializers
        })
      };
    }
  }

  setSerializers() {
    const self = this;

    self.serializers = {
      req: (req) => {
        return {
          meta: {
            requestId: req.requestId,
            userId: req.userId
          },
          url: req.url,
          method: req.method,
          originalUrl: req.originalUrl,
          params: req.params,
          headers: self.removeSensitiveData(req.headers),
          body: self.removeSensitiveData(req.body),
          query: self.removeSensitiveData(req.query),
        };
      },
      res: (res) => {
        return {
          _headers: self.removeSensitiveData(res._headers),
          statusCode: res.statusCode,
          responseTime: res.responseTime,
        };
      },
      err: (err) => {
        return {
          id: err.id,
          domain: self.domain,
          code: err.code,
          name: err.errorType,
          statusCode: err.statusCode,
          level: err.level,
          message: err.message,
          context: err.context,
          help: err.help,
          stack: err.stack,
          hideStack: err.hideStack,
        };
      }
    };
  }

  removeSensitiveData(obj) {
    let newObj = {};

    for (let [key, value] of Object.entries(obj)) {
      try {
        if (isObject(value)) {
          value = self.removeSensitiveData(value);
        }

        if (!key.match(/pin|password|authorization|cookie/gi)) {
          newObj[key] = value;
        }
      }catch(e) {
        newObj[key] = value;
      }
    }

    return newObj;
  }

  log(type, ...args) {
    const self = this;
    let modifiedArgs;

    for (let arg of args) {
      if (arg instanceof Error) {
        modifiedArgs = modifiedArgs || {};
        modifiedArgs.err = arg;
      } else if(isObject(arg)) {
        modifiedArgs = modifiedArgs || {};
        for (let key of Object.keys(arg)) {
          modifiedArgs[key] = arg[key];
        }
      } else {
        modifiedArgs = modifiedArgs || '';
        modifiedArgs += `${arg} `;
      }
    }

    for (let [name, logger] of Object.entries(self.streams)) {
      if (logger.match) {
        if (new RegExp(logger.match).test(jsonStringifySafe(modifiedArgs).replace(/"/g,''))) {
          logger.log[type](modifiedArgs);
        }
      } else {
        logger.log[type](modifiedArgs);
      }
    }
  }

  info(...args) {
    this.log.apply(this, 'info', args);
  }

  warn(...args) {
    this.log.apply(this, 'warn', args);
  }

  error(...args) {
    this.log.apply(this, 'error', args);
  }
}
