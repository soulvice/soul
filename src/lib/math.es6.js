/*
  soul

  the soul of your applications in one place.
*/


const funcs = {
  sum: (...nums) => {
    let ret = 0;
    nums.forEach(n => ret += n);
    return ret;
  },
  isEven: (v) => (v % 2) === 0,
  isOdd: (v) => !this.isEven(v),
  power: (v, x) => {
    let y = Math.pow(Math.abs(x), x);
    return x < 0 ? -y : y;
  },
  factorial: (v) => v * (v-1),
  log: (v, b) => {

  },
  E: () => Math.E,
  pi: () => Math.PI,
  min: (...nums) => Math.min.apply(null, nums),
  max: (...nums) => Math.max.apply(null, nums),
  randomRange: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  sqrt: (v) => Math.sqrt(v),
  log: (v) => Math.log(v),
  log2: (v) => Math.log2(v),
  log10: (v) => Math.log10(v),
  logB: (v, b) => Math.log1p(b)/Math.log1p(v),
  pythag: (mathStr) => {
    //a=2; b=5
    let matchReg = /((a|b|c)|!=|([0-9\.]+)|![\;])/g;
    let ret = 0;
    let matches = mathStr.match(matchReg);
    let va = null, vb = null, vc = null;

    for (let i=0; i<matches.length; i++) {
      let v = matches[i];
      if (typeof v === 'string') {
        if (v === 'a') {
          va = parseInt(matches[++i]);
        }else if (v === 'b') {
          vb = parseInt(matches[++i]);
        }else if (v === 'c') {
          vc = parseInt(matches[++i]);
        }
      }
    }

    if (va !== null && vb !== null && vc !== null) {
      return undefined;
    }

    if (vc === null) {
      return Math.sqrt(Math.pow(Math.abs(va), 2) + Math.pow(Math.abs(vb), 2));
    }else if (va === null) {
      return Math.sqrt(Math.pow(Math.abs(vc), 2) - Math.pow(Math.abs(vb), 2));
    }else if (vb === null) {
      return Math.sqrt(Math.pow(Math.abs(vc), 2) - Math.pow(Math.abs(va), 2));
    }

    return undefined;
  },
  xrt: (x, r) => {
    var y = Math.pow(Math.abs(x), 1/r);
    return x < 0 ? -y : y;
  }
}


export default funcs
