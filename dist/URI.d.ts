/**
 * @module URI
 * @license MIT
 * @version 2018/03/28
 */
declare type ParamValue = string | string[] | null;
interface ParseResult {
    [key: string]: ParamValue;
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
     * @param {string} URI
     */
    constructor(URI: string);
    /**
     * @property search
     * @method get
     * @returns {string}
     */
    get search(): string;
    /**
     * @property hash
     * @method get
     * @returns {string}
     */
    get hash(): string;
    /**
     * @method toURI
     * @returns {string}
     */
    toURI(): string;
    /**
     * @method toString
     * @returns {string}
     */
    toString(): string;
}
export {};
