'use strict';

const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');

rollup
  .rollup({
    input: './URI.ts',
    plugins: [typescript()]
  })
  .then(bundle => {
    bundle
      .write({
        format: 'umd',
        indent: true,
        strict: true,
        name: 'URI',
        amd: { id: 'URI' },
        file: './dist/URI.js'
      })
      .then(() => {
        console.log('Build URI.js and URI.d.ts success!');
      });
  });
