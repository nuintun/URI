/**
 * @module URI
 * @license MIT
 * @version 2018/03/28
 */

export interface ParseResult {
  [key: string]: string | null | (string | null)[];
}

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
 * @function isNonNullable
 * @param value
 */
function isNonNullable(value?: string | null): value is string {
  return value != null;
}

/**
 * @function normalize
 * @param value
 */
function normalize(value?: null): null;
function normalize(value: string): string;
function normalize(value?: string | null): string | null {
  return isNonNullable(value) ? value : null;
}

/**
 * @function decode
 * @param value
 */
function decode(value: null): null;
function decode(value: string): string;
function decode(value: string | null): string | null {
  if (!value) return value;

  return decodeURIComponent(value);
}

/**
 * @function encode
 * @param value
 */

function encode(value: string): string {
  return encodeURIComponent(value);
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
        const key = decode(matched[1]);
        const value = decode(normalize(matched[2]));

        if (query.hasOwnProperty(key)) {
          const values = query[key];

          if (Array.isArray(values)) {
            values.push(value);
          } else {
            query[key] = [values, value];
          }
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
 * @param query
 * @param prefix
 */
function stringify(query: ParseResult, prefix: string): string {
  let search = '';

  const entries = Object.entries(query);

  for (const [key, value] of entries) {
    const name = encode(key);

    if (Array.isArray(value)) {
      value.forEach(value => {
        search += `&${name}`;

        if (isNonNullable(value)) {
          search += `=${encode(value)}`;
        }
      });
    } else {
      search += `&${name}`;

      if (isNonNullable(value)) {
        search += `=${encode(value)}`;
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

    if (isNonNullable(protocol)) {
      URI += protocol;
    }

    if (isNonNullable(protocol)) {
      URI += '//';
    }

    if (isNonNullable(username)) {
      URI += username;
    }

    if (isNonNullable(password)) {
      URI += `:${password}`;
    }

    if (isNonNullable(username) || isNonNullable(password)) {
      URI += '@';
    }

    if (isNonNullable(hostname)) {
      URI += hostname;
    }

    if (isNonNullable(port)) {
      URI += `:${port}`;
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
