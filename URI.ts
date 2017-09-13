/*!
 * URI
 * Date: 2017/09/08
 * https://github.com/nuintun/uri
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/uri/blob/master/LICENSE
 */

const undef = void (0);
const WHATWG_URI = /^([^.:@?#/]+:)?(?:\/\/)?(?:([^:@]*)(?::([^:@]*))?@)?([^:?#/]*)(?::(\d*(?=$|[?#/])))?([^?#]*)(\?[^#]*)?(#.*)?/;

/**
 * normalize
 *
 * @param value
 */
function normalize(value: any): any {
  if (value === undef) return null;

  return value;
}

/**
 * nonnull
 *
 * @param value
 */
function nonnull(value): boolean {
  return value !== null;
}

/**
 * encode
 *
 * @param value
 */
function encode(value: any): any {
  if (!value) return value;

  return encodeURIComponent(value);
}

/**
 * decode
 *
 * @param value
 */
function decode(value: any): any {
  if (!value) return value;

  return decodeURIComponent(value);
}

/**
 * search
 *
 * @param search
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
 * stringify
 *
 * @param param
 * @param prefix
 */
function stringify(param: object, prefix: string): string {
  let search = '';

  for (let key in param) {
    if (param.hasOwnProperty(key)) {
      let value = param[key];

      if (Array.isArray(value)) {
        value.forEach(function (item) {
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
 * URI
 *
 * @class
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
   * @param URI
   */
  constructor(URI: string) {
    let context = this;
    let matched = WHATWG_URI.exec(URI);

    // Normalize URI
    if (!matched) {
      throw Error('URI not a standard WHATWG URI.');
    }

    let [
      , // Matched
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

  public get search(): string {
    return stringify(this.param, '?');
  }

  public get hash(): string {
    return stringify(this.anchor, '#');
  }

  /**
   * toURI
   *
   * @method
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

    URI += context.search + context.hash;

    return URI;
  }

  /**
   * toString
   *
   * @method
   */
  public toString(): string {
    return this.toURI();
  }
}
