'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _funcs;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  soul

  the soul of your applications in one place.
*/

var funcs = (_funcs = {
  sum: function sum() {
    for (var _len = arguments.length, nums = Array(_len), _key = 0; _key < _len; _key++) {
      nums[_key] = arguments[_key];
    }

    var ret = 0;
    nums.forEach(function (n) {
      return ret += n;
    });
    return ret;
  },
  isEven: function isEven(v) {
    return v % 2 === 0;
  },
  isOdd: function isOdd(v) {
    return !undefined.isEven(v);
  },
  power: function power(v, x) {
    var y = Math.pow(Math.abs(x), x);
    return x < 0 ? -y : y;
  },
  factorial: function factorial(v) {
    return v * (v - 1);
  },
  log: function log(v, b) {},
  E: function E() {
    return Math.E;
  },
  pi: function pi() {
    return Math.PI;
  },
  min: function min() {
    for (var _len2 = arguments.length, nums = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      nums[_key2] = arguments[_key2];
    }

    return Math.min.apply(null, nums);
  },
  max: function max() {
    for (var _len3 = arguments.length, nums = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      nums[_key3] = arguments[_key3];
    }

    return Math.max.apply(null, nums);
  },
  sqrt: function sqrt(v) {
    return Math.sqrt(v);
  }
}, _defineProperty(_funcs, 'log', function log(v) {
  return Math.log(v);
}), _defineProperty(_funcs, 'log2', function log2(v) {
  return Math.log2(v);
}), _defineProperty(_funcs, 'log10', function log10(v) {
  return Math.log10(v);
}), _defineProperty(_funcs, 'logB', function logB(v, b) {
  return Math.log1p(b) / Math.log1p(v);
}), _defineProperty(_funcs, 'pythag', function pythag(mathStr) {
  //a=2; b=5
  var matchReg = /((a|b|c)|!=|([0-9\.]+)|![\;])/g;
  var ret = 0;
  var matches = mathStr.match(matchReg);
  var va = null,
      vb = null,
      vc = null;

  for (var i = 0; i < matches.length; i++) {
    var v = matches[i];
    if (typeof v === 'string') {
      if (v === 'a') {
        va = parseInt(matches[++i]);
      } else if (v === 'b') {
        vb = parseInt(matches[++i]);
      } else if (v === 'c') {
        vc = parseInt(matches[++i]);
      }
    }
  }

  if (va !== null && vb !== null && vc !== null) {
    return undefined;
  }

  if (vc === null) {
    return Math.sqrt(Math.pow(Math.abs(va), 2) + Math.pow(Math.abs(vb), 2));
  } else if (va === null) {
    return Math.sqrt(Math.pow(Math.abs(vc), 2) - Math.pow(Math.abs(vb), 2));
  } else if (vb === null) {
    return Math.sqrt(Math.pow(Math.abs(vc), 2) - Math.pow(Math.abs(va), 2));
  }

  return undefined;
}), _defineProperty(_funcs, 'xrt', function xrt(x, r) {
  var y = Math.pow(Math.abs(x), 1 / r);
  return x < 0 ? -y : y;
}), _funcs);

exports.default = funcs;