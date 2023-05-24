/**
 * @module URI
 * @license MIT
 * @version 2018/03/28
 */
export interface ParseResult {
  [key: string]: string | null | (string | null)[];
}
/**
 * @class URI
 */
export default class URI {
  protocol: string | null;
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
