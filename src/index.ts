/**
 * @module URI
 * @license MIT
 * @version 2018/03/28
 */

// Parse query regex
const PARSE_QUERY_REGEX: RegExp = /(?:^|&)([^&=]*)(?:=([^&]*))?/g;
// prettier-ignore
// Parse WHATWG URI regex
//
//     1.protocol                 2.user     3.pass     4.hostname         5.port      6.pathname 7.search 8.hash
//          |                       |           |            |                |              |       |       |
//   ---------------             --------    -------     ----------    ---------------   ----------------- -----
// /^([a-z0-9.+-]+:)?(?:\/\/)?(?:([^/:]*)(?::([^/]*))?@)?([^:?#/]*)(?::(\d*(?=$|[?#/])))?([^?#]*)(\?[^#]*)?(#.*)?/i
const WHATWG_URI_REGEX: RegExp = /^([a-z0-9.+-]+:)?(?:\/\/)?(?:([^/:]*)(?::([^/]*))?@)?([^:?#/]*)(?::(\d*(?=$|[?#/])))?([^?#]*)(\?[^#]*)?(#.*)?/i;

/**
 * @function normalize
 * @param value
 */
function normalize<T>(value: T): T | null {
  if (value == null) return null;

  return value;
}

/**
 * @function isNotNullAndUndef
 * @param value
 */
function isNotNullAndUndef(value: unknown): boolean {
  return value != null;
}

/**
 * @function encode
 * @param value
 */
function encode(value: string | null): string | null {
  if (!value) return value;

  return encodeURIComponent(value);
}

/**
 * @function decode
 * @param value
 */
function decode(value: string | null): string | null {
  if (!value) return value;

  return decodeURIComponent(value);
}

export type ParamValue = string | string[] | null;

export interface ParseResult {
  [key: string]: ParamValue;
}

/**
 * @function parse
 * @param search
 */
function parse(search: string): ParseResult {
  const query: ParseResult = {};

  if (!search) return query;

  search = search.replace(/^[?#]/, '');

  if (search) {
    while (true) {
      const matched = PARSE_QUERY_REGEX.exec(search);

      if (matched) {
        const key = decode(matched[1] || '') as string;
        const value = decode(normalize(matched[2])) as string;

        if (query.hasOwnProperty(key)) {
          if (!Array.isArray(query[key])) {
            query[key] = [query[key] as string];
          }

          (query[key] as string[]).push(value);
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
 * @param param
 * @param prefix
 */
function stringify(query: ParseResult, prefix: string): string {
  let search = '';

  for (let key in query) {
    if (query.hasOwnProperty(key)) {
      const value = query[key];

      // Encode key
      key = encode(key) as string;

      if (Array.isArray(value)) {
        value.forEach(item => {
          search += '&' + key;

          if (isNotNullAndUndef(item)) {
            search += '=' + encode(item);
          }
        });
      } else {
        search += '&' + key;

        if (isNotNullAndUndef(value)) {
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
  public protocol!: string | null;
  public username!: string | null;
  public password!: string | null;
  public hostname!: string | null;
  public port!: string | null;
  public pathname!: string | null;
  public query!: ParseResult;
  public fragment!: ParseResult;

  /**
   * @constructor
   * @param URI
   */
  constructor(URI: string) {
    const context = this;
    const matched = WHATWG_URI_REGEX.exec(URI);

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
   */
  public get search(): string {
    return stringify(this.query, '?');
  }

  /**
   * @property hash
   * @method get
   */
  public get hash(): string {
    return stringify(this.fragment, '#');
  }

  /**
   * @method toURI
   */
  public toURI(): string {
    let URI = '';

    const context = this;
    const protocol = context.protocol;
    const username = context.username;
    const password = context.password;
    const hostname = context.hostname;
    const port = context.port;

    if (isNotNullAndUndef(protocol)) {
      URI += protocol;
    }

    if (isNotNullAndUndef(protocol)) {
      URI += '//';
    }

    if (isNotNullAndUndef(username)) {
      URI += username;
    }

    if (isNotNullAndUndef(password)) {
      URI += ':' + password;
    }

    if (isNotNullAndUndef(username) || isNotNullAndUndef(password)) {
      URI += '@';
    }

    if (isNotNullAndUndef(hostname)) {
      URI += hostname;
    }

    if (isNotNullAndUndef(port)) {
      URI += ':' + port;
    }

    URI += context.pathname + context.search + context.hash;

    return URI;
  }

  /**
   * @method toString
   */
  public toString(): string {
    return this.toURI();
  }
}
