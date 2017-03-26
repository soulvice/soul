"use strict";

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
    var ret = 0;
    for (var i = 0; i <= x; i++) {
      ret = ret * v;
    }
    return ret;
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
}, _defineProperty(_funcs, "log", function log(v) {
  return Math.log(v);
}), _defineProperty(_funcs, "log2", function log2(v) {
  return Math.log2(v);
}), _defineProperty(_funcs, "log10", function log10(v) {
  return Math.log10(v);
}), _defineProperty(_funcs, "logB", function logB(v, b) {
  return Math.log10(b) / Math.log10(v);
}), _defineProperty(_funcs, "pythag", function pythag(x, y) {
  var ret = 0;
  nums.forEach(function (n) {
    return ret += n * n;
  });
  return Math.sqrt(ret);
}), _defineProperty(_funcs, "cbrt", function cbrt(x) {
  var y = Math.pow(Math.abs(x), 1 / 3);
  return x < 0 ? -y : y;
}), _defineProperty(_funcs, "xrt", function xrt(x, r) {
  var y = Math.pow(Math.abs(x), 1 / r);
  return x < 0 ? -y : y;
}), _funcs);

exports.default = funcs;