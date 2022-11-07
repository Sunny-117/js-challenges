const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const json = require('@rollup/plugin-json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const rollupPlugins = [
  postcss({
    inject: false
  }),
  terser(),
  nodeResolve({
    browser: true
  }),
  commonjs(),
  json(),
  builtins(),
  globals()
];

module.exports = [
  {
    input: "./lib/browser/jcode.mjs",
    output: {
      dir: "dist",
      sourcemap: true,
      format: "esm",
      entryFileNames: "[name].js",
    },
    plugins: rollupPlugins,
  },
    {
    input: "./lib/browser/judger.mjs",
    output: [
      {
        dir: "dist",
        sourcemap: true,
        format: "esm",
        entryFileNames: "[name].[format].js",
      },
      {
        dir: "dist",
        sourcemap: true,
        format: "umd",
        name: 'Judger',
        entryFileNames: "[name].[format].js",
      }
    ],
    plugins: rollupPlugins,
  }
];
