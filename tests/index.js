import URI from '../esm/index.js';

const url = new URI('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');

console.log(url);
console.log(url.toURI());
