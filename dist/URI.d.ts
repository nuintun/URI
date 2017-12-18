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
    param: object;
    anchor: object;
    /**
     * @constructor
     * @param {string} URI
     */
    constructor(URI: string);
    /**
     * @property search
     * @method get
     */
    readonly search: string;
    /**
     * @property hash
     * @method get
     */
    readonly hash: string;
    /**
     * @method toURI
     */
    toURI(): string;
    /**
     * @method toString
     */
    toString(): string;
}
