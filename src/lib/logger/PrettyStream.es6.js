/*
  soul

  the soul of your applications in one place.
*/

import moment from 'moment'
import { Transform } from 'stream'
import prettyjson from 'prettyjson'
import { each, omit, isEmpty, isObject, isString } from 'lodash'

// Private
const _private = {
  levelFromName: {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal',
  },
  colorForLevel: {
    10: 'grey',
    20: 'grey',
    30: 'cyan',
    40: 'magenta',
    50: 'red',
    60: 'inverse',
  },
  colors: {
    'bold':       [1, 22],
    'italic':     [3, 23],
    'underline':  [4, 24],
    'inverse':    [7, 27],
    'white':      [37, 39],
    'grey':       [90, 39],
    'black':      [30, 39],
    'blue':       [34, 39],
    'cyan':       [36, 39],
    'green':      [32, 39],
    'magenta':    [35, 39],
    'red':        [31, 39],
    'yellow':     [33, 39],
  },
}

function colorize(color, value) {
  return `\x1B[${_private[color][0]}m${value}\x1B[${_private[color][1]}m`;
}

/*
  PrettyStream
*/
export default class PrettyStream extends Transform {
  constructor(opts={}) {
    super(opts);

    this.mode = opts.mode || 'short';
  }

  write(data, enc, cb) {
    if (isObject(data) && !(data instanceof Buffer)) {
      data = JSON.stringify(data);
    }

    super.write(data, enc, cb);
  }

  _transform(data, enc, cb) {
    if (!isString(data)) {
      data = data.toString();
    }
    // replace newline(\n)
    data = data.replace(/\\n$/, '');

    try {
      data = JSON.parse(data);
    }catch(e) {
      cb(e);

      return;
    }

    let output = '';
    const time = moment(data.time).format('YYYY-MM-DD HH:mm:ss');
    const codes = _private.colors[_private.colorForLevel[data.level]];
    const logLevel = `\x1B[${codes[0]}m${_private.levelFromName[data.level].toUpperCase()}\x1B[${codes[1]}m`;
    let bodyPretty = '';

    if (data.msg && !data.err) {
      bodyPretty += data.msg;

      output += `[${time}] ${logLevel} ${bodyPretty}\n`;
    } else {
      try {
        output += `${logLevel} [${time}] "${data.req.method.toUpperCase()} ${data.req.originalUrl}" ${data.res.statusCode} ${data.res.responseTime}\n`;
      }catch(e) {
        output += `[${time}] ${logLevel}`
      }

      for (let [key, value] of Object.entries(omit(data, ['time', 'level', 'name', 'hostname', 'pid', 'v', 'msg']))) {
        if (isObject(value) && value.message && value.stack) {
          let error = '\n';

          if (value.name) {
            error += colorize(_private.colorForLevel[data.level], `NAME: ${value.name}`)+'\n';
          }

          if (value.code) {
            error += colorize(_private.colorForLevel[data.level], `CODE: ${value.code}`)+'\n';
          }

          error += colorize(_private.colorForLevel[data.level], `MESSAGE: ${value.message}`)+'\n\n';

          if (value.level) {
            error += colorize('white', 'level:') + colorize('white', value.level)+'\n\n';
          }

          if (value.context) {
            error += colorize('white', value.context)+'\n';
          }

          if (value.help) {
            error += colorize('yellow', value.help)+'\n';
          }

          if (value.errorDetails) {
            error += prettyjson.render(value.errorDetails, {})+'\n';
          }

          if (value.stack && !value.hideStack) {
            error += colorize('white', value.stack)+'\n';
          }

          output += `${colorize(_private.colorForLevel[data.level], error)}\n`;
        } else if (isObject(value)) {
          bodyPretty += '\n' + colorize('yellow', key.toUpperCase()) + '\n';

          let sanitized = {};

          for (let [innerKey, innerValue] of Object.entries(value)) {
            if (!isEmpty(innerValue)) {
              sanitized[innerKey] = innerValue;
            }
          }

          bodyPretty += prettyjson.render(sanitized, {})+'\n';
        } else {
          bodyPretty += prettyjson.render(value, {})+'\n';
        }
      }
      if (this.mode !== 'short') {
        output += `${colorize('grey', bodyPretty)}\n`;
      }
    }
    cb(null, output);
  }
}
