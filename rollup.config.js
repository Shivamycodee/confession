import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

export default [
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
