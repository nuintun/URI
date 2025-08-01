/**
 * @module index
 */

import { URI } from '@nuintun/uri';

const url = new URI('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');

console.log(url);
console.log(url.toURI());

const mail = new URI('mailto:user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');

console.log(mail);
console.log(mail.toURI());
