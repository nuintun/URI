/**
 * @module URI
 * @license MIT
 */

export interface ParseResult {
  [key: string]: string | null | (string | null)[];
}

// Parse query regex
const PARSE_QUERY_REGEX: RegExp = /(?:^|&)([^&=]*)(?:=([^&]*))?/g;
// Parse WHATWG URI regex (readable RFC 3986 / RFC 6874 composition)
//
// Matched groups:
//   1.protocol 2.slashes 3.user 4.pass 5.hostname 6.port 7.pathname 8.search 9.hash
const PROTOCOL_PATTERN = '([a-z0-9.+-]+:)?';
const SLASHES_PATTERN = '(//)?';
const AUTH_PATTERN = '(?:([^/:]*)(?::([^/]*))?@)?';
const IPV6_PATTERN = '[0-9a-f:.]+(?:%25[0-9a-z._~-]+)?';
const IPVFUTURE_PATTERN = "v[0-9a-f]+\\.[0-9a-z._~!$&'()*+,;=:-]+";
const IP_LITERAL_PATTERN = `\\[(?:${IPV6_PATTERN}|${IPVFUTURE_PATTERN})\\]`;
const HOST_PATTERN = `(${IP_LITERAL_PATTERN}|[^:?#/\\[\\]]*)`;
const PORT_PATTERN = '(?::(\\d*(?=$|[?#/])))?';
const PATH_PATTERN = '([^?#]*)';
const SEARCH_PATTERN = '(\\?[^#]*)?';
const HASH_PATTERN = '(#.*)?';

const WHATWG_URI_REGEX: RegExp = new RegExp(
  `^${PROTOCOL_PATTERN}${SLASHES_PATTERN}${AUTH_PATTERN}${HOST_PATTERN}${PORT_PATTERN}${PATH_PATTERN}${SEARCH_PATTERN}${HASH_PATTERN}$`,
  'i'
);

/**
 * @function normalize
 * @param value
 */
function normalize(value?: null): null;
function normalize(value: string): string;
function normalize(value?: string | null): string | null {
  return value != null ? value : null;
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

        if (value != null) {
          search += `=${encode(value)}`;
        }
      });
    } else {
      search += `&${name}`;

      if (value != null) {
        search += `=${encode(value)}`;
      }
    }
  }

  return search.replace(/^&/, prefix);
}

/**
 * @class URI
 */
export class URI {
  public protocol: string | null;
  public slashes: string | null;
  public username: string | null;
  public password: string | null;
  public hostname: string | null;
  public port: string | null;
  public pathname: string | null;
  public query: ParseResult;
  public fragment: ParseResult;

  /**
   * @constructor
   * @param URI
   */
  constructor(URI: string) {
    const matched = WHATWG_URI_REGEX.exec(URI);

    // Normalize URI
    if (!matched) {
      throw Error('URI not a standard WHATWG URI.');
    }

    const [
      ,
      // Matched
      protocol,
      slashes,
      username,
      password,
      hostname,
      port,
      pathname,
      search,
      hash
    ] = matched;

    this.protocol = normalize(protocol);
    this.slashes = normalize(slashes);
    this.username = normalize(username);
    this.password = normalize(password);
    this.hostname = normalize(hostname);
    this.port = normalize(port);
    this.pathname = normalize(pathname);
    this.query = parse(search);
    this.fragment = parse(hash);
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
    const slashes = context.slashes;
    const username = context.username;
    const password = context.password;
    const hostname = context.hostname;
    const port = context.port;

    if (protocol != null) {
      URI += protocol;
    }

    if (slashes != null) {
      URI += slashes;
    }

    if (username != null) {
      URI += username;

      if (password != null) {
        URI += `:${password}`;
      }

      URI += '@';
    }

    if (hostname != null) {
      URI += hostname;
    }

    if (port != null) {
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
