import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import { defineConfig } from 'rollup';

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

export default defineConfig([
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
])
