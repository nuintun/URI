/**
 * @module rollup
 * @license MIT
 * @version 2018/03/28
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');
const terser = require('terser');
const rollup = require('rollup');
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

  const file = outputOptions.file;
  const map = `${file}.map`;
  const min = file.replace(/\.js$/i, '.min.js');

  console.log(`Build ${file} success!`);
  console.log(`Build ${map} success!`);

  const minify = terser.minify(
    { 'URI.js': (await fs.readFile(path.resolve(file))).toString() },
    { ie8: true, mangle: { eval: true }, sourceMap: { url: path.basename(map) } }
  );

  await fs.outputFile(min, outputOptions.banner + minify.code);
  console.log(`Build ${min} success!`);
}

const banner = `/**
 * @module ${pkg.name.toUpperCase()}
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @author ${pkg.author.name}
 * @description ${pkg.description}
 * @see ${pkg.homepage}
 */
`;

const inputOptions = {
  input: 'URI.ts',
  context: 'window',
  plugins: [typescript({ clean: true })]
};

const outputOptions = {
  banner,
  name: 'URI',
  indent: true,
  strict: true,
  format: 'umd',
  sourcemap: true,
  amd: { id: 'URI' },
  file: 'dist/URI.js'
};

build(inputOptions, outputOptions);
