require('babel-polyfill');

require('babel-register')({
  ignore: false,
  only: /.+(?:(?:\.es6\.js)|(?:.jsx))$/,
  extensions: ['.js', '.es6.js', '.jsx'],
  sourceMap: true,
  presets: [
    'es2015',
    'stage-3',
  ],
  plugins: [
     'transform-object-rest-spread',
     'transform-async-to-generator',
     'transform-class-properties',
     'syntax-trailing-function-commas',
  ],
});
