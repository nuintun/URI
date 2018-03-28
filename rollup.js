/**
 * @module rollup
 * @license MIT
 * @version 2018/03/28
 */

'use strict';

const fs = require('fs-extra');
const rollup = require('rollup');
const uglify = require('uglify-es');
const pkg = require('./package.json');
const typescript = require('rollup-plugin-typescript2');

/**
 * @function build
 * @param {Object} inputOptions
 * @param {Object} outputOptions
 */
async function build(inputOptions, outputOptions) {
  await fs.remove('dist');

  const bundle = await rollup.rollup(inputOptions);

  await bundle.write(outputOptions);
  console.log(`Build ${outputOptions.file} success!`);
}

const banner = `/**
 * @module ${pkg.name.toUpperCase()}
 * @author ${pkg.author.name}
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @description ${pkg.description}
 * @see ${pkg.homepage}
 */
`;

const inputOptions = {
  input: 'URI.ts',
  context: 'window',
  plugins: [typescript()]
};

const outputOptions = {
  name: 'URI',
  format: 'umd',
  indent: true,
  strict: true,
  banner: banner,
  amd: { id: 'URI' },
  file: 'dist/URI.js'
};

build(inputOptions, outputOptions);
