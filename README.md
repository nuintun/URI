# URI

<!-- prettier-ignore -->
> A simple WHATWG URI parser.
>
> [![NPM Version][npm-image]][npm-url]
> [![Download Status][download-image]][npm-url]
> [![Languages Status][languages-image]][github-url]
> [![Tree Shakeable][tree-shakeable-image]][bundle-phobia-url]
> [![Side Effect][side-effect-image]][bundle-phobia-url]
> [![License][license-image]][license-url]

```ts
/**
 * @module URI
 * @license MIT
 */
export interface ParseResult {
  [key: string]: string | null | (string | null)[];
}
/**
 * @class URI
 */
export declare class URI {
  protocol: string | null;
  slashes: string | null;
  username: string | null;
  password: string | null;
  hostname: string | null;
  port: string | null;
  pathname: string | null;
  query: ParseResult;
  fragment: ParseResult;
  /**
   * @constructor
   * @param URI
   */
  constructor(URI: string);
  /**
   * @property search
   * @method get
   */
  get search(): string;
  /**
   * @property hash
   * @method get
   */
  get hash(): string;
  /**
   * @method toURI
   */
  toURI(): string;
  /**
   * @method toString
   */
  toString(): string;
}
```

[npm-image]: https://img.shields.io/npm/v/@nuintun/uri?style=flat-square
[npm-url]: https://www.npmjs.org/package/@nuintun/uri
[download-image]: https://img.shields.io/npm/dm/@nuintun/uri?style=flat-square
[languages-image]: https://img.shields.io/github/languages/top/nuintun/uri?style=flat-square
[github-url]: https://github.com/nuintun/uri
[tree-shakeable-image]: https://img.shields.io/badge/tree--shakeable-true-brightgreen?style=flat-square
[side-effect-image]: https://img.shields.io/badge/side--effect-free-brightgreen?style=flat-square
[bundle-phobia-url]: https://bundlephobia.com/result?p=@nuintun/uri
[license-image]: https://img.shields.io/github/license/nuintun/uri?style=flat-square
[license-url]: https://github.com/nuintun/uri/blob/main/LICENSE
