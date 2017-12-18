/**
 * @module rollup
 * @license MIT
 * @version 2017/12/18
 */

'use strict';

const fs = require('fs');
const rollup = require('rollup');
const uglify = require('uglify-es');
const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package.json');

const banner = `/**
* @module ${pkg.name}
* @author ${pkg.author.name}
* @license ${pkg.license}
* @version ${pkg.version}
* @description ${pkg.description}
* @see ${pkg.homepage}
*/
`;

rollup
  .rollup({
    context: 'window',
    input: 'URI.ts',
    plugins: [typescript()]
  })
  .then(bundle => {
    fs.stat('dist', error => {
      if (error) {
        fs.mkdirSync('dist');
      }

      bundle
        .write({
          format: 'umd',
          indent: true,
          strict: true,
          name: 'URI',
          banner: banner,
          amd: { id: 'URI' },
          file: './dist/URI.js'
        })
        .then(a => {
          console.log('Build URI.js and URI.d.ts success!');
        });
    });
  })
  .catch(error => {
    console.error(error);
  });
