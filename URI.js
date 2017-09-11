/*!
 * URI
 * Date: 2017/09/08
 * https://github.com/nuintun/uri
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/uri/blob/master/LICENSE
 */
var WHATWG_URI = /^(?:([^:?#/]+:)?(?:\/\/)?)?(?:(?:(?:([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]+)(?::(\d+(?=$|[?#/])))?)?([^?#]+)?(\?[^#]*)?(#.*)?/;
var URI = /** @class */ (function () {
    function URI(uri) {
        var context = this;
        var matched = WHATWG_URI.exec(uri);
        // Normalize URI
        if (!matched) {
            throw Error('URI not a standard WHATWG URI.');
        }
        var // Matched
        protocol = matched[1], username = matched[2], password = matched[3], hostname = matched[4], port = matched[5], pathname = matched[6], search = matched[7], hash = matched[8];
        context.protocol = protocol;
        context.username = username;
        context.password = password;
        context.hostname = hostname;
        context.port = port;
        context.pathname = pathname;
        context.query = parse(search.slice(1));
        context.fragment = parse(hash.slice(1));
    }
    Object.defineProperty(URI.prototype, "search", {
        get: function () {
            return '?' + stringify(this.query);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "hash", {
        get: function () {
            return '#' + stringify(this.fragment);
        },
        enumerable: true,
        configurable: true
    });
    return URI;
}());
export default URI;
function parse(search) {
    var query = {};
    if (!search)
        return query;
    var parseRegexp = /(?:^|&)([^&=]*)(?:=([^&]*))?/g;
    while (true) {
        var matched = parseRegexp.exec(search);
        if (matched) {
            var key = matched[1];
            var value = matched[2];
            if (query.hasOwnProperty(key)) {
                if (!Array.isArray(query[key])) {
                    query[key] = [query[key]];
                }
                query[key].push(value);
            }
            else {
                query[key] = value;
            }
        }
        else {
            break;
        }
    }
    return query;
}
function stringify(query) {
    var search = '';
    var _loop_1 = function (key) {
        if (query.hasOwnProperty(key)) {
            var value = query[key];
            if (Array.isArray(value)) {
                value.forEach(function (item) {
                    search += '&' + key;
                    if (item !== undefined) {
                        search += '=' + item;
                    }
                });
            }
            else {
                search += '&' + key;
                if (value !== undefined) {
                    search += '=' + value;
                }
            }
        }
    };
    for (var key in query) {
        _loop_1(key);
    }
    return search.replace(/^&/, '');
}
