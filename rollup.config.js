/**
 * @module rollup.config
 */

import rimraf from 'rimraf';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

rimraf.sync('typings');
rimraf.sync('index.js');

const banner = `/**
 * @module ${pkg.name}
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @author ${pkg.author.name}
 * @description ${pkg.description}
 * @see ${pkg.homepage}
 */
`;

const tsconfigOverride = { compilerOptions: { declaration: true, declarationDir: '.' } };

export default {
  input: 'src/URI.ts',
  output: {
    banner,
    name: 'URI',
    indent: true,
    strict: true,
    format: 'umd',
    file: 'URI.js',
    interop: false,
    esModule: false
  },
  plugins: [typescript({ tsconfigOverride, clean: true, useTsconfigDeclarationDir: true })]
};
