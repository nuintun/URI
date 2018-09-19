/**
 * @module URI
 * @license MIT
 * @version 2018/03/28
 */

// Undefined
const UNDEFINED: undefined = void 0;
// Parse query regex
const PARSE_QUERY_REGEX: RegExp = /(?:^|&)([^&=]*)(?:=([^&]*))?/g;
// Parse WHATWG URI regex
//
//     1.protocol                 2.user     3.pass     4.hostname         5.port      6.pathname 7.search 8.hash
//          |                       |           |            |                |              |       |       |
//   ---------------             --------    -------     ----------    ---------------   ----------------- -----
// /^([a-z0-9.+-]+:)?(?:\/\/)?(?:([^/:]*)(?::([^/]*))?@)?([^:?#/]*)(?::(\d*(?=$|[?#/])))?([^?#]*)(\?[^#]*)?(#.*)?/i
const WHATWG_URI_REGEX: RegExp = /^([a-z0-9.+-]+:)?(?:\/\/)?(?:([^/:]*)(?::([^/]*))?@)?([^:?#/]*)(?::(\d*(?=$|[?#/])))?([^?#]*)(\?[^#]*)?(#.*)?/i;

/**
 * @function normalize
 * @param {string} value
 * @returns {string|null}
 */
function normalize(value: string): string | null {
  if (value === UNDEFINED) return null;

  return value;
}

/**
 * @function isNotNull
 * @param {string|null} value
 * @returns {boolean}
 */
function isNotNull(value: string | null): boolean {
  return value !== null;
}

/**
 * @function encode
 * @param {string|null} value
 * @returns {string|null}
 */
function encode(value: string | null): string | null {
  if (!value) return value;

  return encodeURIComponent(value);
}

/**
 * @function decode
 * @param {string|null} value
 * @returns {string|null}
 */
function decode(value: string | null): string | null {
  if (!value) return value;

  return decodeURIComponent(value);
}

/**
 * @function parse
 * @param {string} search
 * @returns {Object}
 */
function parse(search: string): Object {
  const query: Object = {};

  if (!search) return query;

  search = search.replace(/^[?#]/, '');

  if (search) {
    while (true) {
      const matched: string[] | null = PARSE_QUERY_REGEX.exec(search);

      if (matched) {
        const key: string = decode(matched[1] || '');
        const value: string | null = decode(normalize(matched[2]));

        if (query.hasOwnProperty(key)) {
          if (!Array.isArray(query[key])) {
            query[key] = [query[key]];
          }

          query[key].push(value);
        } else {
          query[key] = value;
        }
      } else {
        break;
      }
    }
  }

  return query;
}

/**
 * @function stringify
 * @param {Object} param
 * @param {string} prefix
 * @returns {string}
 */
function stringify(query: Object, prefix: string): string {
  let search: string = '';

  for (let key in query) {
    if (query.hasOwnProperty(key)) {
      const value: string | string[] = query[key];

      // Encode key
      key = encode(key);

      if (Array.isArray(value)) {
        value.forEach(item => {
          search += '&' + key;

          if (isNotNull(item)) {
            search += '=' + encode(item);
          }
        });
      } else {
        search += '&' + key;

        if (isNotNull(value)) {
          search += '=' + encode(value);
        }
      }
    }
  }

  return search.replace(/^&/, prefix);
}

/**
 * @class URI
 */
export default class URI {
  public protocol: string | null;
  public username: string | null;
  public password: string | null;
  public hostname: string | null;
  public port: string | null;
  public pathname: string | null;
  public query: Object;
  public fragment: Object;

  /**
   * @constructor
   * @param {string} URI
   */
  constructor(URI: string) {
    const context: URI = this;
    const matched: string[] | null = WHATWG_URI_REGEX.exec(URI);

    // Normalize URI
    if (!matched) {
      throw Error('URI not a standard WHATWG URI.');
    }

    const [
      ,
      // Matched
      protocol,
      username,
      password,
      hostname,
      port,
      pathname,
      search,
      hash
    ] = matched;

    context.protocol = normalize(protocol);
    context.username = normalize(username);
    context.password = normalize(password);
    context.hostname = normalize(hostname);
    context.port = normalize(port);
    context.pathname = normalize(pathname);

    context.query = parse(search);
    context.fragment = parse(hash);
  }

  /**
   * @property search
   * @method get
   * @returns {string}
   */
  public get search(): string {
    return stringify(this.query, '?');
  }

  /**
   * @property hash
   * @method get
   * @returns {string}
   */
  public get hash(): string {
    return stringify(this.fragment, '#');
  }

  /**
   * @method toURI
   * @returns {string}
   */
  public toURI(): string {
    let URI: string = '';
    const context: URI = this;
    const protocol: string | null = context.protocol;
    const username: string | null = context.username;
    const password: string | null = context.password;
    const hostname: string | null = context.hostname;
    const port: string | null = context.port;

    if (isNotNull(protocol)) {
      URI += protocol;
    }

    if (isNotNull(protocol)) {
      URI += '//';
    }

    if (isNotNull(username)) {
      URI += username;
    }

    if (isNotNull(password)) {
      URI += ':' + password;
    }

    if (isNotNull(username) || isNotNull(password)) {
      URI += '@';
    }

    if (isNotNull(hostname)) {
      URI += hostname;
    }

    if (isNotNull(port)) {
      URI += ':' + port;
    }

    URI += context.pathname + context.search + context.hash;

    return URI;
  }

  /**
   * @method toString
   * @returns {string}
   */
  public toString(): string {
    return this.toURI();
  }
}
