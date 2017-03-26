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
    let ret = 0;
    for (let i=0; i<= x; i++) {
      ret = ret * v
    }
    return ret;
  },
  factorial: (v) => v * (v-1),
  log: (v, b) => {

  },
  E: () => Math.E,
  pi: () => Math.PI,
  min: (...nums) => Math.min.apply(null, nums),
  max: (...nums) => Math.max.apply(null, nums),
  sqrt: (v) => Math.sqrt(v),
  log: (v) => Math.log(v),
  log2: (v) => Math.log2(v),
  log10: (v) => Math.log10(v),
  logB: (v, b) => Math.log10(b)/Math.log10(v),
  pythag: (x, y) => {
    let ret = 0;
    nums.forEach(n => ret += (n*n));
    return Math.sqrt(ret);
  },
  cbrt: (x) => {
    var y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
  },
  xrt: (x, r) => {
    var y = Math.pow(Math.abs(x), 1/r);
    return x < 0 ? -y : y;
  }
}


export default funcs
