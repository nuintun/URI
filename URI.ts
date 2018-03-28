/**
 * @module URI
 * @license MIT
 * @version 2018/03/28
 */

const undef = void 0;
//                     1.protocol                2.user      3.pass      4.hostname         5.port     6.pathname 7.search 8.hash
//                         |                        |          |             |                |             |        |       |
//                   --------------              -------     ------      ---------     ---------------   ------- --------  -----
const WHATWG_URI = /^([a-z0-9.+-]+:)?(?:\/\/)?(?:([^/:]*)(?::([^/]*))?@)?([^:?#/]*)(?::(\d*(?=$|[?#/])))?([^?#]*)(\?[^#]*)?(#.*)?/i;

/**
 * @function normalize
 * @param {string} value
 * @returns {string|null}
 */
function normalize(value: string): string | null {
  if (value === undef) return null;

  return value;
}

/**
 * @function nonnull
 * @param {string|null} value
 * @returns {boolean}
 */
function nonnull(value: string | null): boolean {
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
  let query = {};

  if (!search) return query;

  search = search.replace(/^[?#]/, '');

  if (search) {
    let parseRegexp = /(?:^|&)([^&=]*)(?:=([^&]*))?/g;

    while (true) {
      let matched = parseRegexp.exec(search);

      if (matched) {
        let key = decode(matched[1] || '');
        let value = decode(normalize(matched[2]));

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
  let search = '';

  for (let key in query) {
    if (query.hasOwnProperty(key)) {
      let value = query[key];

      if (Array.isArray(value)) {
        value.forEach(function(item) {
          search += '&' + encode(key);

          if (nonnull(item)) {
            search += '=' + encode(item);
          }
        });
      } else {
        search += '&' + key;

        if (nonnull(value)) {
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
  public protocol: string;
  public username: string;
  public password: string;
  public hostname: string;
  public port: string;
  public pathname: string;
  public query: Object;
  public fragment: Object;

  /**
   * @constructor
   * @param {string} URI
   * @returns {URI}
   */
  constructor(URI: string) {
    let context = this;
    let matched = WHATWG_URI.exec(URI);

    // Normalize URI
    if (!matched) {
      throw Error('URI not a standard WHATWG URI.');
    }

    let [
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
    let URI = '';
    let context = this;
    let protocol = context.protocol;
    let username = context.username;
    let password = context.password;
    let hostname = context.hostname;
    let port = context.port;

    if (nonnull(protocol)) {
      URI += protocol;
    }

    if (nonnull(protocol) || nonnull(hostname)) {
      URI += '//';
    }

    if (nonnull(username)) {
      URI += username;
    }

    if (nonnull(password)) {
      URI += ':' + password;
    }

    if (nonnull(username) || nonnull(password)) {
      URI += '@';
    }

    if (nonnull(hostname)) {
      URI += hostname;
    }

    if (nonnull(port)) {
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
