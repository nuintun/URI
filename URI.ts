/*!
 * URI
 * Date: 2017/09/08
 * https://github.com/nuintun/uri
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/uri/blob/master/LICENSE
 */

const WHATWG_URI = /^(?:([^:?#/]+:)?(?:\/\/)?)?(?:(?:(?:([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]+)(?::(\d+(?=$|[?#/])))?)?([^?#]+)?(\?[^#]*)?(#.*)?/;

export default class URI {
  public protocol: string;
  public username: string;
  public password: string;
  public hostname: string;
  public port: string;
  public pathname: string;
  public param: object;
  public anchor: object;

  constructor(uri: string) {
    let context = this;
    let matched = WHATWG_URI.exec(uri);

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

    context.protocol = protocol;
    context.username = username;
    context.password = password;
    context.hostname = hostname;
    context.port = port;
    context.pathname = pathname;

    context.param = parse(search);
    context.anchor = parse(hash);
  }

  public get search(): string {
    return stringify(this.param, '?');
  }

  public get hash(): string {
    return stringify(this.anchor, '#');
  }
}

function parse(search: string): object {
  let param = {};

  if (!search) return param;

  search = search.replace(/^[?#]/, '');

  if (search) {
    let parseRegexp = /(?:^|&)([^&=]*)(?:=([^&]*))?/g;

    while (true) {
      let matched = parseRegexp.exec(search);

      if (matched) {
        let key = decodeURIComponent(matched[1]);
        let value = matched[2];

        if (value) {
          value = decodeURIComponent(value);
        }

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

function stringify(param: object, prefix: string): string {
  let search = '';

  for (let key in param) {
    if (param.hasOwnProperty(key)) {
      key = encodeURIComponent(key);

      let value = param[key];

      if (Array.isArray(value)) {
        value.forEach(function (item) {
          search += '&' + key;

          if (item !== undefined) {
            search += '=' + encodeURIComponent(item);
          }
        });
      } else {
        search += '&' + key;

        if (value !== undefined) {
          search += '=' + encodeURIComponent(value);
        }
      }
    }
  }

  return search.replace(/^&/, prefix);
}
