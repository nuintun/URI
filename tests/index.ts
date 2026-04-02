import assert from 'node:assert/strict';
import test from 'node:test';

import { URI } from '@nuintun/uri';

test('should keep original https example behavior', () => {
  const source = 'https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash';
  const uri = new URI(source);

  assert.equal(uri.protocol, 'https:');
  assert.equal(uri.username, 'user');
  assert.equal(uri.password, 'pass');
  assert.equal(uri.hostname, 'sub.host.com');
  assert.equal(uri.port, '8080');
  assert.equal(uri.pathname, '/p/a/t/h');
  assert.deepEqual(uri.query, { query: 'string' });
  assert.deepEqual(uri.fragment, { hash: null });
  assert.equal(uri.toURI(), source);
});

test('should keep original mailto example behavior', () => {
  const source = 'mailto:user:pass@sub.host.com:8080/p/a/t/h?query=string#hash';
  const uri = new URI(source);

  assert.equal(uri.protocol, 'mailto:');
  assert.equal(uri.slashes, null);
  assert.equal(uri.username, 'user');
  assert.equal(uri.password, 'pass');
  assert.equal(uri.hostname, 'sub.host.com');
  assert.equal(uri.port, '8080');
  assert.equal(uri.pathname, '/p/a/t/h');
  assert.deepEqual(uri.query, { query: 'string' });
  assert.deepEqual(uri.fragment, { hash: null });
  assert.equal(uri.toURI(), source);
});

test('should parse and stringify IPv6 URI', () => {
  const source = 'https://[2001:410:0:1:0:0:0:45ff]:80/hello';
  const uri = new URI(source);

  assert.equal(uri.protocol, 'https:');
  assert.equal(uri.hostname, '[2001:410:0:1:0:0:0:45ff]');
  assert.equal(uri.port, '80');
  assert.equal(uri.pathname, '/hello');
  assert.equal(uri.toURI(), source);
});

test('should parse and stringify IPv6 URI with auth', () => {
  const source = 'https://user:pass@[2001:410:0:1:0:0:0:45ff]:80/hello';
  const uri = new URI(source);

  assert.equal(uri.username, 'user');
  assert.equal(uri.password, 'pass');
  assert.equal(uri.hostname, '[2001:410:0:1:0:0:0:45ff]');
  assert.equal(uri.port, '80');
  assert.equal(uri.toURI(), source);
});

test('should keep IPv4 behavior', () => {
  const source = 'https://user:pass@127.0.0.1:8080/hello?x=1#ok';
  const uri = new URI(source);

  assert.equal(uri.hostname, '127.0.0.1');
  assert.equal(uri.username, 'user');
  assert.equal(uri.password, 'pass');
  assert.deepEqual(uri.query, { x: '1' });
  assert.deepEqual(uri.fragment, { ok: null });
  assert.equal(uri.toURI(), source);
});
