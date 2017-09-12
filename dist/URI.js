(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('URI', factory) :
    (global.URI = factory());
}(this, (function () { 'use strict';

    /*!
     * URI
     * Date: 2017/09/08
     * https://github.com/nuintun/uri
     *
     * This is licensed under the MIT License (MIT).
     * For details, see: https://github.com/nuintun/uri/blob/master/LICENSE
     */
    var undef = void (0);
    var WHATWG_URI = /^([^.:@?#/]+:)?(?:\/\/)?(?:([^:@]*)(?::([^:@]*))?@)?([^:?#/]*)(?::(\d*(?=$|[?#/])))?([^?#]*)(\?[^#]*)?(#.*)?/;
    /**
     * normalize
     *
     * @param value
     */
    function normalize(value) {
        if (value === undef)
            return null;
        return value;
    }
    /**
     * nonnull
     *
     * @param value
     */
    function nonnull(value) {
        return value !== null;
    }
    /**
     * encode
     *
     * @param value
     */
    function encode(value) {
        if (!value)
            return value;
        return encodeURIComponent(value);
    }
    /**
     * decode
     *
     * @param value
     */
    function decode(value) {
        if (!value)
            return value;
        return decodeURIComponent(value);
    }
    /**
     * search
     *
     * @param search
     */
    function parse(search) {
        var param = {};
        if (!search)
            return param;
        search = search.replace(/^[?#]/, '');
        if (search) {
            var parseRegexp = /(?:^|&)([^&=]*)(?:=([^&]*))?/g;
            while (true) {
                var matched = parseRegexp.exec(search);
                if (matched) {
                    var key = decode(matched[1] || '');
                    var value = decode(normalize(matched[2]));
                    if (param.hasOwnProperty(key)) {
                        if (!Array.isArray(param[key])) {
                            param[key] = [param[key]];
                        }
                        param[key].push(value);
                    }
                    else {
                        param[key] = value;
                    }
                }
                else {
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
    function stringify(param, prefix) {
        var search = '';
        var _loop_1 = function (key) {
            if (param.hasOwnProperty(key)) {
                var value = param[key];
                if (Array.isArray(value)) {
                    value.forEach(function (item) {
                        search += '&' + encode(key);
                        if (nonnull(item)) {
                            search += '=' + encode(item);
                        }
                    });
                }
                else {
                    search += '&' + key;
                    if (nonnull(value)) {
                        search += '=' + encode(value);
                    }
                }
            }
        };
        for (var key in param) {
            _loop_1(key);
        }
        return search.replace(/^&/, prefix);
    }
    /**
     * URI
     *
     * @class
     */
    var URI = /** @class */ (function () {
        /**
         * @constructor
         * @param uri
         */
        function URI(uri) {
            var context = this;
            var matched = WHATWG_URI.exec(uri);
            // Normalize URI
            if (!matched) {
                throw Error('URI not a standard WHATWG URI.');
            }
            var // Matched
            protocol = matched[1], username = matched[2], password = matched[3], hostname = matched[4], port = matched[5], pathname = matched[6], search = matched[7], hash = matched[8];
            context.protocol = normalize(protocol);
            context.username = normalize(username);
            context.password = normalize(password);
            context.hostname = normalize(hostname);
            context.port = normalize(port);
            context.pathname = normalize(pathname);
            context.param = parse(search);
            context.anchor = parse(hash);
        }
        Object.defineProperty(URI.prototype, "search", {
            get: function () {
                return stringify(this.param, '?');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "hash", {
            get: function () {
                return stringify(this.anchor, '#');
            },
            enumerable: true,
            configurable: true
        });
        /**
         * toURI
         *
         * @method
         */
        URI.prototype.toURI = function () {
            var URI = '';
            var context = this;
            var protocol = context.protocol;
            var username = context.username;
            var password = context.password;
            var hostname = context.hostname;
            var port = context.port;
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
        };
        /**
         * toString
         *
         * @method
         */
        URI.prototype.toString = function () {
            return this.toURI();
        };
        return URI;
    }());

    return URI;

})));
