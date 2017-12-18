/*!
 * URI
 * Date: 2017/09/08
 * https://github.com/nuintun/uri
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/uri/blob/master/LICENSE
 */

const undef = void 0;
const WHATWG_URI = /^([a-z0-9.+-]+:)?(?:\/\/)?(?:([^/:]*)(?::([^/]*))?@)?([^:?#/]*)(?::(\d*(?=$|[?#/])))?([^?#]*)(\?[^#]*)?(#.*)?/i;

/**
 * @function normalize
 * @param {any} value
 * @returns {any}
 */
function normalize(value: any): any {
  if (value === undef) return null;

  return value;
}

/**
 * @function nonnull
 * @param {any} value
 * @returns {boolean}
 */
function nonnull(value: any): boolean {
  return value !== null;
}

/**
 * @function encode
 * @param {any} value
 * @returns {string}
 */
function encode(value: any): any {
  if (!value) return value;

  return encodeURIComponent(value);
}

/**
 * @function decode
 * @param {any} value
 * @returns {string}
 */
function decode(value: any): any {
  if (!value) return value;

  return decodeURIComponent(value);
}

/**
 * @function parse
 * @param {string} search
 * @returns {Object}
 */
function parse(search: string): object {
  let param = {};

  if (!search) return param;

  search = search.replace(/^[?#]/, '');

  if (search) {
    let parseRegexp = /(?:^|&)([^&=]*)(?:=([^&]*))?/g;

    while (true) {
      let matched = parseRegexp.exec(search);

      if (matched) {
        let key = decode(matched[1] || '');
        let value = decode(normalize(matched[2]));

        if (param.hasOwnProperty(key)) {
          if (!Array.isArray(param[key])) {
            param[key] = [param[key]];
          }

          param[key].push(value);
        } else {
          param[key] = value;
        }
      } else {
        break;
      }
    }
  }

  return param;
}

/**
 * @function stringify
 * @param {Object} param
 * @param {string} prefix
 * @returns {string}
 */
function stringify(param: object, prefix: string): string {
  let search = '';

  for (let key in param) {
    if (param.hasOwnProperty(key)) {
      let value = param[key];

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
  public param: object;
  public anchor: object;

  /**
   * @constructor
   * @param {string} URI
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

    context.param = parse(search);
    context.anchor = parse(hash);
  }

  /**
   * @property search
   * @method get
   */
  public get search(): string {
    return stringify(this.param, '?');
  }

  /**
   * @property hash
   * @method get
   */
  public get hash(): string {
    return stringify(this.anchor, '#');
  }

  /**
   * @method toURI
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
   */
  public toString(): string {
    return this.toURI();
  }
}
