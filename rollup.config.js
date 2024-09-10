const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const babel = require('@rollup/plugin-babel');
const json = require('@rollup/plugin-json');

module.exports = [
  {
    input: 'es6m/index.mjs', // Your ES6 module entry point
    output: {
      file: 'dist/es6m.bundle.js',
      format: 'esm', // ES6 module format
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(), 
      json(),
      babel,
      // babel({ babelHelpers: 'bundled' }), 
      terser(), // Minifies the output
    ]
  },
  {
    input: 'commonjs/index.cjs', // Your CommonJS module entry point
    output: {
      file: 'dist/cjs.bundle.js',
      format: 'cjs', // CommonJS format
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(), 
      json(),
      babel,
      // babel({ babelHelpers: 'bundled' }), 
      terser(),
    ]
  }
];
