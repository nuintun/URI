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
  public query: object;
  public fragment: object;

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

    context.query = parse(search.slice(1));
    context.fragment = parse(hash.slice(1));
  }

  public get search(): string {
    return '?' + stringify(this.query);
  }

  public get hash(): string {
    return '#' + stringify(this.fragment);
  }
}

function parse(search: string): object {
  let query = {};

  if (!search) return query;

  let parseRegexp = /(?:^|&)([^&=]*)(?:=([^&]*))?/g;

  while (true) {
    let matched = parseRegexp.exec(search);

    if (matched) {
      let key = matched[1];
      let value = matched[2];

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

  return query;
}

function stringify(query: object): string {
  let search = '';

  for (let key in query) {
    if (query.hasOwnProperty(key)) {
      let value = query[key];

      if (Array.isArray(value)) {
        value.forEach(function (item) {
          search += '&' + key;

          if (item !== undefined) {
            search += '=' + item;
          }
        });
      } else {
        search += '&' + key;

        if (value !== undefined) {
          search += '=' + value;
        }
      }
    }
  }

  return search.replace(/^&/, '');
}
