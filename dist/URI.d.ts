/**
 * @class URI
 */
export default class URI {
    protocol: string;
    username: string;
    password: string;
    hostname: string;
    port: string;
    pathname: string;
    query: Object;
    fragment: Object;
    /**
     * @constructor
     * @param {string} URI
     * @returns {URI}
     */
    constructor(URI: string);
    /**
     * @property search
     * @method get
     * @returns {string}
     */
    readonly search: string;
    /**
     * @property hash
     * @method get
     * @returns {string}
     */
    readonly hash: string;
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
