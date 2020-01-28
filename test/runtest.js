require('@babel/polyfill');

require('@babel/register')({
  ignore: undefined,
  only: [/.+(?:(?:\.es6\.js)|(?:.jsx))$/],
  extensions: ['.js', '.es6.js', '.jsx'],
  sourceMap: true,
  presets: [
    "@babel/preset-react",
    "@babel/preset-env",
  ],
  plugins: [
     '@babel/plugin-proposal-async-generator-functions',
  ],
});
