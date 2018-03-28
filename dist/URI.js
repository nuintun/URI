/**
 * @module URI
 * @author nuintun
 * @license MIT
 * @version 0.0.1
 * @description A simple WHATWG URI parser.
 * @see https://github.com/nuintun/uri#readme
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('URI', factory) :
  (global.URI = factory());
}(this, (function () { 'use strict';

  /**
   * @module URI
   * @license MIT
   * @version 2018/03/28
   */
  var undef = void 0;
  //                     1.protocol                2.user      3.pass      4.hostname         5.port     6.pathname 7.search 8.hash
  //                         |                        |          |             |                |             |        |       |
  //                   --------------              -------     ------      ---------     ---------------   ------- --------  -----
  var WHATWG_URI = /^([a-z0-9.+-]+:)?(?:\/\/)?(?:([^/:]*)(?::([^/]*))?@)?([^:?#/]*)(?::(\d*(?=$|[?#/])))?([^?#]*)(\?[^#]*)?(#.*)?/i;
  /**
   * @function normalize
   * @param {string} value
   * @returns {string|null}
   */
  function normalize(value) {
      if (value === undef)
          return null;
      return value;
  }
  /**
   * @function nonnull
   * @param {string|null} value
   * @returns {boolean}
   */
  function nonnull(value) {
      return value !== null;
  }
  /**
   * @function encode
   * @param {string|null} value
   * @returns {string|null}
   */
  function encode(value) {
      if (!value)
          return value;
      return encodeURIComponent(value);
  }
  /**
   * @function decode
   * @param {string|null} value
   * @returns {string|null}
   */
  function decode(value) {
      if (!value)
          return value;
      return decodeURIComponent(value);
  }
  /**
   * @function parse
   * @param {string} search
   * @returns {Object}
   */
  function parse(search) {
      var query = {};
      if (!search)
          return query;
      search = search.replace(/^[?#]/, '');
      if (search) {
          var parseRegexp = /(?:^|&)([^&=]*)(?:=([^&]*))?/g;
          while (true) {
              var matched = parseRegexp.exec(search);
              if (matched) {
                  var key = decode(matched[1] || '');
                  var value = decode(normalize(matched[2]));
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
      }
      return query;
  }
  /**
   * @function stringify
   * @param {Object} param
   * @param {string} prefix
   * @returns {string}
   */
  function stringify(query, prefix) {
      var search = '';
      var _loop_1 = function (key) {
          if (query.hasOwnProperty(key)) {
              var value = query[key];
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
      for (var key in query) {
          _loop_1(key);
      }
      return search.replace(/^&/, prefix);
  }
  /**
   * @class URI
   */
  var URI = /** @class */ (function () {
      /**
       * @constructor
       * @param {string} URI
       * @returns {URI}
       */
      function URI(URI) {
          var context = this;
          var matched = WHATWG_URI.exec(URI);
          // Normalize URI
          if (!matched) {
              throw Error('URI not a standard WHATWG URI.');
          }
          var 
          // Matched
          protocol = matched[1], username = matched[2], password = matched[3], hostname = matched[4], port = matched[5], pathname = matched[6], search = matched[7], hash = matched[8];
          context.protocol = normalize(protocol);
          context.username = normalize(username);
          context.password = normalize(password);
          context.hostname = normalize(hostname);
          context.port = normalize(port);
          context.pathname = normalize(pathname);
          context.query = parse(search);
          context.fragment = parse(hash);
      }
      Object.defineProperty(URI.prototype, "search", {
          /**
           * @property search
           * @method get
           * @returns {string}
           */
          get: function () {
              return stringify(this.query, '?');
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(URI.prototype, "hash", {
          /**
           * @property hash
           * @method get
           * @returns {string}
           */
          get: function () {
              return stringify(this.fragment, '#');
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @method toURI
       * @returns {string}
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
          URI += context.pathname + context.search + context.hash;
          return URI;
      };
      /**
       * @method toString
       * @returns {string}
       */
      URI.prototype.toString = function () {
          return this.toURI();
      };
      return URI;
  }());

  return URI;

})));
