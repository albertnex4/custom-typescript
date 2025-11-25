// rollup.client.config.cjs
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('@rollup/plugin-terser');
const json = require('@rollup/plugin-json');
const path = require('path');

module.exports = {
  input: path.resolve(__dirname, 'src/client/modules/index.ts'),

  output: {
    file: path.resolve(__dirname, 'dist/client_packages/index.js'),
    format: 'iife',
    name: 'RageClientBundle',
    inlineDynamicImports: true,
    sourcemap: false,
  },

  external: ['mp'],

  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),

    commonjs(),

    typescript({
      tsconfig: './tsconfig.client.json'
    }),

    json()

  ]
};
