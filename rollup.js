const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');

rollup.rollup({
  input: './URI.ts',
  plugins: [typescript()]
}).then(function(bundle) {
  bundle.write({
    format: 'umd',
    indent: true,
    strict: true,
    name: 'URI',
    amd: { id: 'URI' },
    file: './dist/URI.js'
  });
});
